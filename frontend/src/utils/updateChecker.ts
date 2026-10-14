import { App } from "@capacitor/app";
import packageJson from "../../package.json";
import { getAppVersionInfo } from "../api/backend";

const GITHUB_VERSION_URL = "https://raw.githubusercontent.com/itsarunkumarx/HeartTone/main/version.json";

export const getCurrentVersion = async (): Promise<string> => {
    try {
        const info = await App.getInfo();
        if (info?.version) return info.version;
        return packageJson.version || "5.1.2";
    } catch {
        return packageJson.version || "5.1.2";
    }
};

export const getLatestVersion = async () => {
    // 1. Try backend API via Axios client
    try {
        const data = await getAppVersionInfo();
        if (data && data.version) {
            return data;
        }
    } catch {
        // Continue to next fallback
    }

    // 2. Try static public version.json
    try {
        const res = await fetch("/version.json?t=" + Date.now());
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Continue to next fallback
    }

    // 3. Fallback to GitHub raw
    try {
        const res = await fetch(GITHUB_VERSION_URL + "?t=" + Date.now());
        if (res.ok) {
            return await res.json();
        }
    } catch {
        // Ignore
    }

    return null;
};

export const compareVersions = (v1: string, v2: string) => {
    if (!v1 || !v2) return false;
    const clean1 = String(v1).replace(/^v/i, "").trim();
    const clean2 = String(v2).replace(/^v/i, "").trim();
    const a = clean1.split(".").map((n) => parseInt(n, 10) || 0);
    const b = clean2.split(".").map((n) => parseInt(n, 10) || 0);

    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const diff = (a[i] || 0) - (b[i] || 0);
        if (diff !== 0) return diff < 0;
    }
    return false;
};

export interface UpdateInfo {
    version: string;
    apk_url?: string;
    exe_url?: string;
    deb_url?: string;
    changelog?: string[] | string;
    mandatory?: boolean;
    force?: boolean;
    currentVersion?: string;
}

export const checkForUpdate = async (): Promise<UpdateInfo | null> => {
    try {
        const current = await getCurrentVersion();
        const latest = await getLatestVersion();
        if (!latest || !latest.version) return null;

        const updateAvailable = compareVersions(current, latest.version);
        if (updateAvailable) {
            return {
                ...latest,
                currentVersion: current,
            };
        }

        return null;
    } catch (e) {
        console.error("Update check failed", e);
        return null;
    }
};
