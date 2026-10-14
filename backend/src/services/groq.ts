import Groq from "groq-sdk";

interface KeyState {
  key: string;
  index: number;
  uses: number;
  errors: number;
  lastErrorTime: number;
  rateLimitedUntil: number;
  isInvalid?: boolean;
}

class GroqKeyManager {
  private keys: KeyState[] = [];
  private roundRobinIndex = 0;

  constructor() {
    const envKeys = [
      process.env.GROQ_KEY_1,
      process.env.GROQ_KEY_2,
      process.env.GROQ_KEY_3,
      process.env.GROQ_KEY_4,
      process.env.GROQ_KEY_5,
      process.env.GROQ_API_KEY,
    ].filter(Boolean) as string[];

    this.keys = envKeys.map((key, i) => ({
      key,
      index: i,
      uses: 0,
      errors: 0,
      lastErrorTime: 0,
      rateLimitedUntil: 0,
    }));

    console.log(`[Groq] Initialized with ${this.keys.length} API key(s)`);
    if (this.keys.length === 0) {
      console.warn("[Groq] No API keys configured");
    }
  }

  /** Pick the best available key using round-robin with health checks */
  private pickKey(): KeyState | null {
    if (this.keys.length === 0) return null;

    const now = Date.now();
    const cooldownMs = 10 * 60 * 1000; // 10 min cooldown for errored keys

    // Try round-robin through all keys
    for (let attempt = 0; attempt < this.keys.length; attempt++) {
      const idx = this.roundRobinIndex % this.keys.length;
      this.roundRobinIndex++;
      const ks = this.keys[idx];

      // Skip invalid or rate-limited keys
      if (ks.isInvalid || ks.rateLimitedUntil > now) continue;

      // Reset errors after cooldown period
      if (ks.errors > 0 && now - ks.lastErrorTime > cooldownMs) {
        ks.errors = 0;
      }

      // Skip keys with too many consecutive errors
      if (ks.errors >= 3) continue;

      return ks;
    }

    // All keys are errored — pick the one with the oldest error (most likely recovered)
    const sorted = [...this.keys].sort(
      (a, b) => a.lastErrorTime - b.lastErrorTime,
    );
    // Reset its error count to give it another chance
    sorted[0].errors = 0;
    return sorted[0];
  }

  reportError(key: string, isRateLimit = false): void {
    const ks = this.keys.find((k) => k.key === key);
    if (ks) {
      ks.errors++;
      ks.lastErrorTime = Date.now();
      if (isRateLimit) {
        // Back off this key for 60s on rate limit
        ks.rateLimitedUntil = Date.now() + 60_000;
      }
    }
  }

  reportSuccess(key: string): void {
    const ks = this.keys.find((k) => k.key === key);
    if (ks) {
      ks.errors = 0;
      ks.rateLimitedUntil = 0;
    }
  }

  async callWithFallback(
    systemPrompt: string,
    userPrompt: string,
    maxTokens = 1000,
  ): Promise<string> {
    let lastError: Error | null = null;
    const triedKeys = new Set<string>();

    const candidateModels = [
      process.env.GROQ_MODEL,
      "qwen/qwen3.8-27b",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
    ].filter(Boolean) as string[];

    for (let i = 0; i < this.keys.length; i++) {
      const ks = this.pickKey();
      if (!ks) break;

      // Avoid retrying same key in one call
      if (triedKeys.has(ks.key)) continue;
      triedKeys.add(ks.key);

      const client = new Groq({ apiKey: ks.key });

      try {
        let completion: any = null;
        let lastModelErr: any = null;

        for (const modelName of candidateModels) {
          try {
            completion = await client.chat.completions.create({
              model: modelName,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              max_tokens: Math.max(3500, maxTokens),
              temperature: 0.3,
              response_format: { type: "json_object" },
            });
            if (completion) break;
          } catch (modelErr: any) {
            lastModelErr = modelErr;
            if (modelErr?.status === 404 || modelErr?.code === "model_not_found" || modelErr?.error?.code === "model_not_found") {
              console.warn(`[Groq] Model ${modelName} not found, falling back...`);
              continue;
            }
            throw modelErr;
          }
        }

        if (!completion) {
          throw lastModelErr || new Error("All candidate Groq models failed");
        }

        const content = completion.choices[0]?.message?.content || "";
        this.reportSuccess(ks.key);
        ks.uses++;

        // Strip markdown fences & extract JSON substring (object or array)
        let cleaned = content
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim();

        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        const firstBracket = cleaned.indexOf("[");
        const lastBracket = cleaned.lastIndexOf("]");

        if (
          firstBrace !== -1 &&
          lastBrace !== -1 &&
          lastBrace > firstBrace &&
          (firstBracket === -1 || firstBrace < firstBracket)
        ) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        } else if (
          firstBracket !== -1 &&
          lastBracket !== -1 &&
          lastBracket > firstBracket
        ) {
          cleaned = cleaned.substring(firstBracket, lastBracket + 1);
        }

        return cleaned;
      } catch (err) {
        const errMsg = (err as any).message || "";
        const isRateLimit =
          errMsg.includes("rate_limit") ||
          errMsg.includes("429") ||
          errMsg.includes("quota");

        const isInvalid = errMsg.includes("401") || errMsg.includes("invalid_api_key");
        if (isInvalid) {
          ks.isInvalid = true;
          console.error(`[Groq] Key #${ks.index + 1} is PERMANENTLY INVALID (401).`);
        }

        this.reportError(ks.key, isRateLimit);
        lastError = err as Error;
        console.error(
          `[Groq] Key #${ks.index + 1} failed${isRateLimit ? " (rate limited)" : ""}, trying next: ${errMsg}`,
        );
      }
    }

    throw lastError || new Error("All Groq keys failed");
  }
}

export const groqManager = new GroqKeyManager();
