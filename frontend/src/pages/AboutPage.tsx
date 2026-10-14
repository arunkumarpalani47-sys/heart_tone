import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronDown,
  Mail,
  Music2,
  Headphones,
  Users,
  Download,
  BarChart3,
  Sparkles,
  Search,
  Share2,
  Heart,
  Clock,
  Shuffle,
  Github,
  Shield,
  UserCircle,
  ListMusic,
  Star,
  Smartphone,
  Globe,
  Twitter,
  Linkedin,
  Instagram,
  Palette,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { GITHUB_REPO_URL, APK_DOWNLOAD_URL } from "../lib/constants";

const FEATURES = [
  {
    icon: Music2,
    title: "Music Streaming",
    desc: "Stream millions of songs instantly — no ads, no subscription, completely free.",
  },
  {
    icon: Search,
    title: "Smart Search",
    desc: "Search by song, artist, or album. Handles typos and natural phrasing — just type what you're thinking.",
  },
  {
    icon: Sparkles,
    title: "AI Playlist Builder",
    desc: "Describe a mood or theme and HeartTone builds a full playlist for you. Try 'rainy evening Tamil songs' and see.",
  },
  {
    icon: Heart,
    title: "Made For You",
    desc: "Your home feed learns from what you play, skip, and like. The more you use HeartTone, the better it gets.",
  },
  {
    icon: Headphones,
    title: "HeartLink — Listen Together",
    desc: "Create a room, share a code, and listen in sync with a friend. Built-in chat included.",
  },
  {
    icon: Download,
    title: "Offline Downloads",
    desc: "Download songs for offline listening — with cover art and song info preserved, just like a real music file.",
  },
  {
    icon: BarChart3,
    title: "HeartTone Wrapped",
    desc: "Your personal year in review — top songs, favourite artists, total hours, and more.",
  },
  {
    icon: ListMusic,
    title: "Playlists",
    desc: "Create and organize playlists, reorder songs by drag, and share them publicly.",
  },
  {
    icon: Share2,
    title: "Import from Spotify / YT Music",
    desc: "Paste a playlist link from another app and HeartTone finds and imports the songs.",
  },
  {
    icon: Users,
    title: "Artist Pages",
    desc: "Browse artist songs and albums. Follow artists to get their music in your recommendations.",
  },
  {
    icon: Shuffle,
    title: "Queue & Autoplay",
    desc: "Reorder your queue on the fly. When your playlist ends, HeartTone keeps playing similar songs.",
  },
  {
    icon: Clock,
    title: "Sleep Timer",
    desc: "Set a timer and playback stops automatically — great for listening while drifting off.",
  },
];

const PRIVACY_ITEMS = [
  {
    q: "What data is stored?",
    a: "Your name, email, and profile photo (from sign-in). Your liked songs, playlists, listening history, preferences (languages and moods), and any feedback messages you send.",
  },
  {
    q: "Why is it collected?",
    a: "Listening history and preferences power your personalized feed, Wrapped stats, and recommendations. Your library is synced so it's available across devices.",
  },
  {
    q: "Is my data sold or shared?",
    a: "No. Your data is never sold. There are no ads and no advertising networks. HeartTone uses Firebase Analytics for basic usage patterns (screens visited, app version, device language) — no name or email is ever included in those events.",
  },
  {
    q: "How do I delete my account?",
    a: "There's no self-serve deletion yet. Email support and your account and all data will be deleted promptly.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Why is the app slow on first load?",
    a: "HeartTone runs on free-tier infrastructure that spins down when idle. The first request after a quiet period can take 20–40 seconds while the server wakes up — subsequent loads are fast. Thanks for your patience.",
  },
  {
    q: "Why do some songs fail to play?",
    a: "Occasionally a stream URL expires before playback starts, especially on slower connections. Tapping the song again usually fixes it. If it keeps happening, try refreshing the page.",
  },
  {
    q: "Why do some search results look off?",
    a: "The catalog is very large and search is fuzzy by design. Sometimes less common songs or older tracks surface results that aren't an exact match. Keep your search shorter and more specific for best results.",
  },
];

function Accordion({
  q,
  a,
  isLast,
}: {
  q: string;
  a: string;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${!isLast ? "border-b border-white/[0.04]" : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 py-3 text-left"
      >
        <span className="text-[13px] font-semibold text-white/75">{q}</span>
        <ChevronDown
          size={14}
          className={`text-white/30 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="text-[12px] text-white/40 leading-relaxed pb-3.5">{a}</p>
      )}
    </div>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto pb-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-white/40 hover:text-white text-[13px] mb-6 transition-colors"
      >
        <ChevronLeft size={15} />
        Back
      </button>

      <div
        className="rounded-2xl border border-white/[0.06] mb-3 p-5 sm:p-6"
        style={{ background: "rgba(255,255,255,0.022)" }}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shadow-md flex-shrink-0 bg-black">
              <img src="/icon.png" alt="HeartTone" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                About HeartTone
              </h1>
              <p className="text-white/35 text-xs mt-0.5">
                Crafted with love by Arunkumar & Darshana
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-white/50 flex-shrink-0 mt-0.5">
            v5.1.2
          </span>
        </div>

        <p className="text-[13px] text-white/50 leading-relaxed mb-4">
          HeartTone is a free music streaming app — no subscriptions, no ads, no
          paywalls. Stream songs, build playlists, discover new music, and
          listen with friends. It's a personal project, not a company.
        </p>

        <div className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3 bg-amber-500/[0.05] border border-amber-500/15">
          <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-white/40 leading-relaxed">
            HeartTone runs on free infrastructure, so occasional slowness or a
            brief downtime is possible — especially on first load after a quiet
            period. Thanks for your patience.
          </p>
        </div>

        <div className="rounded-xl p-4 sm:p-5 bg-white/[0.02] border border-white/[0.05] space-y-4">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-sp-green" />
            <span className="text-[10px] font-black text-sp-green uppercase tracking-widest">
              Creators & Team
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Developer: Arunkumar */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sp-green/10 flex items-center justify-center">
                    <UserCircle size={18} className="text-sp-green" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-sp-green/10 text-sp-green text-[10px] font-bold tracking-wide uppercase">
                    Developer
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm tracking-tight">Arunkumar</h3>
                <p className="text-white/40 text-[11px] mt-0.5 mb-3 leading-relaxed">
                  Full Stack Architecture & Engineering
                </p>
              </div>

              {/* Developer Links */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <a
                  href="https://github.com/itsarunkumarx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] hover:text-white text-white/60 flex items-center justify-center transition-colors"
                  title="GitHub: itsarunkumarx"
                >
                  <Github size={13} />
                </a>
                <a
                  href="https://www.linkedin.com/in/arun-kumar-075805331?lipi=urn%3Ali%3Apage%3Ad_flagship3_messaging_conversation_detail%3BkP6sx7AYS4e0pVkb%2FdOS8A%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-[#0077b5]/20 hover:text-[#0077b5] text-white/60 flex items-center justify-center transition-colors"
                  title="LinkedIn: Arun Kumar"
                >
                  <Linkedin size={13} />
                </a>
                <a
                  href="https://instagram.com/smiley_baby_666ttt?obrf=MW1renk0dDExYXlqcg%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-[#e1306c]/20 hover:text-[#e1306c] text-white/60 flex items-center justify-center transition-colors"
                  title="Instagram: smiley_baby_666ttt"
                >
                  <Instagram size={13} />
                </a>
                <a
                  href="mailto:arunkumarpalani428@gmail.com"
                  className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-sp-green/20 hover:text-sp-green text-white/60 flex items-center justify-center transition-colors"
                  title="Email: arunkumarpalani428@gmail.com"
                >
                  <Mail size={13} />
                </a>
              </div>
            </div>

            {/* Designer: Darshana */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Palette size={18} className="text-purple-400" />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold tracking-wide uppercase">
                    Designer
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm tracking-tight">Darshana</h3>
                <p className="text-white/40 text-[11px] mt-0.5 mb-3 leading-relaxed">
                  UI/UX Design & Aesthetic Experience
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <span className="text-[11px] text-white/35 italic">
                  Crafting HeartTone’s clean visual identity
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[12px] text-white/40">
              Direct Contact & Feedback:
            </span>
            <a
              href="mailto:arunkumarpalani428@gmail.com"
              className="inline-flex items-center gap-1.5 text-[12px] text-sp-green hover:underline font-medium"
            >
              <Mail size={12} />
              arunkumarpalani428@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div
          className="rounded-2xl border border-white/[0.06] px-5 py-4"
          style={{ background: "rgba(255,255,255,0.022)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe size={13} className="text-sp-green" />
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
              Available On
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="/"
              id="about-web-link"
              className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-7 h-7 rounded-lg bg-sp-green/10 flex items-center justify-center flex-shrink-0">
                <Globe size={13} className="text-sp-green" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white leading-none">HeartTone Web App</p>
                <p className="text-[11px] text-white/30 mt-0.5">Current App · Any browser</p>
              </div>
            </a>
            <a
              href={APK_DOWNLOAD_URL}
              download="HeartTone.apk"
              id="about-apk-link"
              className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.04] active:scale-[0.98]"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-7 h-7 rounded-lg bg-sp-green/10 flex items-center justify-center flex-shrink-0">
                <Smartphone size={13} className="text-sp-green" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-white leading-none">HeartTone Android APK</p>
                <p className="text-[11px] text-white/30 mt-0.5">Direct Download · Android 7.0+</p>
              </div>
            </a>
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.022)" }}
        >
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.04] flex items-center gap-2">
            <Sparkles size={13} className="text-sp-green" />
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
              Features
            </h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3.5 px-5 py-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={13} className="text-white/40" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-white leading-snug">
                    {title}
                  </p>
                  <p className="text-[12px] text-white/38 mt-0.5 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/[0.06] px-5 pt-5 pb-2"
          style={{ background: "rgba(255,255,255,0.022)" }}
        >
          <div className="flex items-center gap-2 mb-1 pb-3 border-b border-white/[0.04]">
            <Shield size={13} className="text-sp-green" />
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
              Privacy
            </h2>
          </div>
          <p className="text-[12px] text-white/40 leading-relaxed pt-3 pb-1">
            No ads. No data selling. No third-party sharing for commercial
            purposes.
          </p>
          {PRIVACY_ITEMS.map((item, i) => (
            <Accordion
              key={item.q}
              q={item.q}
              a={item.a}
              isLast={i === PRIVACY_ITEMS.length - 1}
            />
          ))}
        </div>

        <div
          className="rounded-2xl border border-white/[0.06] px-5 pt-5 pb-2"
          style={{ background: "rgba(255,255,255,0.022)" }}
        >
          <div className="flex items-center gap-2 mb-1 pb-3 border-b border-white/[0.04]">
            <HelpCircle size={13} className="text-sp-green" />
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
              Common Questions
            </h2>
          </div>
          {FAQ_ITEMS.map((item, i) => (
            <Accordion
              key={item.q}
              q={item.q}
              a={item.a}
              isLast={i === FAQ_ITEMS.length - 1}
            />
          ))}
        </div>

        <div
          className="rounded-2xl border border-white/[0.06] px-5 py-5"
          style={{ background: "rgba(255,255,255,0.022)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart size={13} className="text-sp-green" />
            <h2 className="text-[11px] font-black text-white uppercase tracking-widest">
              The Story
            </h2>
          </div>
          <p className="text-[13px] text-white/42 leading-relaxed">
            HeartTone started as a late-night frustration with ad-filled
            streaming — and a question: could we build something that
            actually felt good to use? Several months of work later, that
            project grew into this, shaped almost entirely by real user
            feedback. Built with passion for everyone.
          </p>
        </div>

        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          id="about-star-repo"
          className="flex items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all duration-200 active:scale-[0.99] group"
          style={{
            background: "rgba(22,27,34,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] flex items-center justify-center flex-shrink-0">
              <Github
                size={15}
                className="text-white/50 group-hover:text-white transition-colors"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white/70 group-hover:text-white transition-colors leading-snug">
                Follow on GitHub
              </p>
              <p className="text-[11px] text-white/30 mt-0.5">
                @itsarunkumarx · HeartTone
              </p>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0 transition-all duration-200 group-hover:scale-105"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-400">Star</span>
          </div>
        </a>
      </div>
    </div>
  );
}
