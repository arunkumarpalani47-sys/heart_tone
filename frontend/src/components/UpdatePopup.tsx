import { Browser } from "@capacitor/browser";
import { Download, Sparkles, X } from "lucide-react";
import { isNative } from "../utils/platform";

type Props = {
    data: any;
    onUpdate?: () => void;
    onClose?: () => void;
};

export const UpdatePopup = ({ data, onUpdate, onClose }: Props) => {
    if (!data) return null;

    const changelogList: string[] = Array.isArray(data.changelog)
        ? data.changelog
        : typeof data.changelog === "string"
        ? data.changelog.split("\n").filter((l: string) => l.trim().length > 0)
        : [];

    const handleUpdate = () => {
        if (onUpdate) {
            onUpdate();
            return;
        }

        const rawUrl = data.apk_url || "/HeartTone.apk";
        const targetUrl = rawUrl.startsWith("http") ? rawUrl : window.location.origin + rawUrl;

        if (isNative()) {
            openUpdateLink(targetUrl);
        } else {
            const a = document.createElement("a");
            a.href = targetUrl;
            a.download = "HeartTone.apk";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }

        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className="relative bg-[#140a12] border border-white/10 p-6 sm:p-7 rounded-3xl w-full max-w-sm text-white shadow-[0_0_50px_rgba(255,42,95,0.2)] animate-scaleIn">
                {/* Close Button if not forced */}
                {!data.force && !data.mandatory && onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all active:scale-95"
                        title="Close"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Header with App Icon */}
                <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-lg flex-shrink-0 bg-black">
                        <img
                            src="/app-icon.jpg"
                            alt="HeartTone"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                            }}
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-black tracking-tight text-white leading-tight flex items-center gap-1.5">
                            Update Available <Sparkles size={16} className="text-rose-400 fill-rose-400" />
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-bold text-rose-300 bg-rose-500/15 border border-rose-500/20 px-2 py-0.5 rounded-md">
                                v{data.version}
                            </span>
                            {data.currentVersion && (
                                <span className="text-[11px] text-white/40">
                                    Current: v{data.currentVersion}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Changelog */}
                <div className="mb-6 bg-white/[0.02] border border-white/[0.05] p-3.5 rounded-2xl max-h-48 overflow-y-auto">
                    <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                        What's New in HeartTone
                    </p>
                    <ul className="text-[13px] text-white/75 space-y-1.5">
                        {changelogList.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 leading-snug">
                                <span className="text-rose-400 font-bold mt-0.5">•</span>
                                <span>{c.replace(/^[•\-\*]\s*/, "")}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2.5">
                    {!data.force && !data.mandatory && (
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/[0.06] hover:bg-white/[0.1] text-white/70 py-3 rounded-2xl font-bold transition-all active:scale-[0.98] text-xs"
                        >
                            Later
                        </button>
                    )}

                    <button
                        onClick={handleUpdate}
                        className="flex-[2] bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-2xl font-black hover:brightness-110 active:scale-[0.98] transition-all text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.4)]"
                    >
                        <Download size={15} />
                        Update Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export const openUpdateLink = async (url: string) => {
    try {
        await Browser.open({ url });
    } catch {
        window.open(url, "_blank");
    }
};
