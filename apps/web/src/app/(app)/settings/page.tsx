"use client";

import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Volume2, EyeOff, Monitor, Keyboard, ShieldCheck,
    Palette, Type, BarChart2, Trash2, Download, RefreshCw,
    CheckCircle2, ChevronRight, Zap, Moon, Sun, SunMedium,
    AlignJustify, Gauge, BellOff, Database, AlertTriangle,
    Sliders, Info
} from "lucide-react";

/* ─── Theme applier ─────────────────────────────────────────────── */
function useThemeApplier(theme: 'system' | 'light' | 'dark') {
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'light') {
            root.classList.remove('dark');
        } else {
            // system
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            if (mq.matches) root.classList.add('dark');
            else root.classList.remove('dark');
            const handler = (e: MediaQueryListEvent) => {
                if (e.matches) root.classList.add('dark');
                else root.classList.remove('dark');
            };
            mq.addEventListener('change', handler);
            return () => mq.removeEventListener('change', handler);
        }
    }, [theme]);
}

/* ─── Toggle ────────────────────────────────────────────────────── */
function Toggle({ value, onChange, accent = "#6366f1" }: { value: boolean; onChange: () => void; accent?: string }) {
    return (
        <button
            onClick={onChange}
            className="relative flex-shrink-0 transition-all duration-300 border border-white/10"
            style={{ width: 52, height: 28, borderRadius: 14, background: value ? accent : "rgba(30, 41, 59, 0.8)" }}
        >
            <motion.div
                animate={{ x: value ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute top-[3px] w-5 h-5 bg-white rounded-full shadow-md"
            />
        </button>
    );
}

/* ─── Chip group ────────────────────────────────────────────────── */
function ChipGroup({ options, value, onChange, accent = "#6366f1" }: {
    options: Array<{ label: string; value: string; icon?: string }>;
    value: string;
    onChange: (v: string) => void;
    accent?: string;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(o => {
                const active = value === o.value;
                return (
                    <button key={o.value} onClick={() => onChange(o.value)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold transition-all border hover:scale-[1.02] active:scale-95"
                        style={active
                            ? { background: accent + "20", color: accent, borderColor: accent + "50", boxShadow: `0 4px 12px ${accent}20` }
                            : { background: "rgba(30, 41, 59, 0.5)", color: "#94a3b8", borderColor: "rgba(255, 255, 255, 0.05)" }}>
                        {o.icon && <span>{o.icon}</span>}
                        {o.label}
                    </button>
                );
            })}
        </div>
    );
}

/* ─── Slider ────────────────────────────────────────────────────── */
function Slider({ value, min, max, step, onChange, accent = "#6366f1", label }: {
    value: number; min: number; max: number; step: number;
    onChange: (v: number) => void; accent?: string; label?: (v: number) => string;
}) {
    return (
        <div className="flex items-center gap-3 w-full max-w-xs">
            <input type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer bg-slate-800 border border-slate-700"
                style={{ accentColor: accent }} />
            <span className="text-sm font-black w-12 text-right" style={{ color: accent }}>
                {label ? label(value) : value}
            </span>
        </div>
    );
}

/* ─── Row ───────────────────────────────────────────────────────── */
function SettingRow({ icon: Icon, label, desc, children, accent = "#6366f1", badge }: {
    icon?: React.ComponentType<{ className?: string; color?: string; style?: React.CSSProperties }>; label: string; desc?: string; children: React.ReactNode; accent?: string; badge?: string;
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors -mx-4 px-4 rounded-2xl">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" color={accent} />}
                    <span className="font-bold text-slate-200 text-[15px]">{label}</span>
                    {badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border"
                            style={{ background: accent + "10", color: accent, borderColor: accent + "40" }}>
                            {badge}
                        </span>
                    )}
                </div>
                {desc && <p className="text-[13px] text-slate-400 leading-relaxed ml-6">{desc}</p>}
            </div>
            <div className="flex-shrink-0 sm:ml-auto ml-6">{children}</div>
        </div>
    );
}

/* ─── Section ───────────────────────────────────────────────────── */
function Section({ id, icon: Icon, title, subtitle, accent, children }: {
    id: string; icon: React.ComponentType<{ className?: string; color?: string; style?: React.CSSProperties }>; title: string; subtitle: string; accent: string; children: React.ReactNode;
}) {
    return (
        <motion.section id={id}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 relative"
            style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" }}>

            {/* Subtle glow behind the section header */}
            <div className="absolute top-0 left-0 w-full h-32 blur-[80px] opacity-20 pointer-events-none" style={{ background: accent }} />

            <div className="px-7 py-6 border-b border-white/5 relative z-10" style={{ background: accent + "05" }}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)` }}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-100 leading-tight">{title}</h2>
                        <p className="text-[13px] text-slate-400 font-medium">{subtitle}</p>
                    </div>
                </div>
            </div>
            <div className="px-7 relative z-10">{children}</div>
        </motion.section>
    );
}

const NAV = [
    { id: "practice", label: "Practice", icon: Clock, accent: "#6366f1" },
    { id: "experience", label: "Experience", icon: Volume2, accent: "#8b5cf6" },
    { id: "appearance", label: "Appearance", icon: Palette, accent: "#ec4899" },
    { id: "typing", label: "Typing Behaviour", icon: Keyboard, accent: "#0ea5e9" },
    { id: "stats", label: "Stats & Data", icon: BarChart2, accent: "#10b981" },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, accent: "#f43f5e" },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {

    /* All settings live in Zustand — reactive everywhere */
    const {
        duration, setDuration,
        soundEnabled, toggleSound,
        soundProfile, setSoundProfile,
        hideErrorSound, setHideErrorSound,
        focusMode, toggleFocusMode,
        showLiveWpm, setShowLiveWpm,
        autoPause, setAutoPause,
        theme, setTheme,
        fontSize, setFontSize,
        caretStyle, setCaretStyle,
        smoothCaret, setSmoothCaret,
        animatedBg, setAnimatedBg,
        highlightWord, setHighlightWord,
        history, clearHistory,
    } = useTypingStore();

    // Enforce dark theme on settings page
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('dark');
    }, []);

    const [activeSection, setActiveSection] = useState("practice");
    const [saved, setSaved] = useState<string | null>(null);
    const [exportDone, setExportDone] = useState(false);

    const flash = (key: string) => { setSaved(key); setTimeout(() => setSaved(null), 1800); };

    const exportHistory = () => {
        const csv = [
            "Date,WPM,Accuracy,CPM,Region,Article",
            ...history.map(h =>
                `"${h.date}","${h.wpm}","${h.accuracy}%","${h.cpm}","${h.region}","${h.article.title.replace(/"/g, '""')}"`
            )
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "newsmonkey-history.csv"; a.click();
        setExportDone(true); setTimeout(() => setExportDone(false), 2500);
    };

    /* scroll-spy */
    useEffect(() => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
        }, { rootMargin: "-30% 0px -60% 0px" });
        NAV.forEach(n => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
        return () => obs.disconnect();
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const durations = [30, 60, 90, 120, 180, 300];

    const bestWpm = history.length ? Math.max(...history.map(h => h.wpm)) : 0;
    const avgAccuracy = history.length
        ? Math.round(history.reduce((a, h) => a + h.accuracy, 0) / history.length)
        : 0;

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "#060a12" }}>

            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[100px] -mr-[20vw] -mt-[20vw]" />
                <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-pink-900/10 rounded-full blur-[100px] -ml-[20vw] -mb-[20vw]" />
                <div className="absolute inset-0 bg-[#060a12]/50" />
            </div>

            {/* hero */}
            <div className="relative border-b border-white/5 bg-slate-900/40 backdrop-blur-md z-10">
                <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                            <Sliders className="w-3.5 h-3.5" />
                            Preferences
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-100 mb-4">Settings</h1>
                        <p className="text-slate-400 text-lg max-w-xl leading-relaxed">Customize your practice environment, audio feedback, and personal data.</p>
                    </motion.div>
                </div>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 items-start z-10">
                {/* sidebar */}
                <aside className="hidden md:flex flex-col gap-1 w-56 sticky top-24 flex-shrink-0">
                    {NAV.map(n => {
                        const active = activeSection === n.id;
                        return (
                            <button key={n.id} onClick={() => scrollTo(n.id)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all text-left"
                                style={active
                                    ? { background: n.accent + "20", color: n.accent, border: `1px solid ${n.accent}40`, boxShadow: `0 4px 12px ${n.accent}20` }
                                    : { color: "#94a3b8", border: "1px solid transparent" }}>
                                <n.icon className="w-4 h-4 flex-shrink-0" />
                                {n.label}
                                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                            </button>
                        );
                    })}
                </aside>

                {/* main */}
                <div className="flex-1 space-y-8 min-w-0 w-full mb-20">

                    {/* ── PRACTICE ── */}
                    <Section id="practice" icon={Clock} title="Practice" subtitle="Session timing and difficulty" accent="#6366f1">
                        <SettingRow icon={Clock} label="Test Duration" desc="Quick preset lengths. Change here or use the slider below." accent="#6366f1">
                            <ChipGroup
                                options={durations.map(d => ({ label: d >= 60 ? `${d / 60}m` : `${d}s`, value: String(d) }))}
                                value={String(duration)}
                                onChange={v => { setDuration(Number(v)); flash("duration"); }}
                                accent="#6366f1"
                            />
                        </SettingRow>
                        <SettingRow icon={Sliders} label="Custom Duration"
                            desc={`Drag to set any length 15 s – 10 min. Currently ${duration >= 60 ? `${Math.floor(duration / 60)}m${duration % 60 ? ` ${duration % 60}s` : ''}` : `${duration}s`}.`}
                            accent="#6366f1">
                            <Slider value={duration} min={15} max={600} step={15}
                                onChange={v => { setDuration(v); flash("custom"); }}
                                accent="#6366f1" label={v => v >= 60 ? `${Math.floor(v / 60)}m${v % 60 ? `${v % 60}s` : ""}` : `${v}s`} />
                        </SettingRow>
                        <SettingRow icon={Gauge} label="Auto-Pause on Idle" desc="Pause timer if you stop typing for 3 seconds." accent="#6366f1">
                            <Toggle value={autoPause} onChange={() => { setAutoPause(!autoPause); flash("autoPause"); }} accent="#6366f1" />
                        </SettingRow>
                        <SettingRow icon={EyeOff} label="Focus Mode" desc="Hides navbar and stats while typing." accent="#6366f1">
                            <Toggle value={focusMode} onChange={() => { toggleFocusMode(); flash("focus"); }} accent="#6366f1" />
                        </SettingRow>
                        <SettingRow icon={Gauge} label="Show Live WPM" desc="Display real-time WPM above the typing area." accent="#6366f1">
                            <Toggle value={showLiveWpm} onChange={() => { setShowLiveWpm(!showLiveWpm); flash("liveWpm"); }} accent="#6366f1" />
                        </SettingRow>
                    </Section>

                    {/* ── EXPERIENCE ── */}
                    <Section id="experience" icon={Volume2} title="Sound & Experience" subtitle="Audio feedback and immersion" accent="#8b5cf6">
                        <SettingRow icon={Volume2} label="Keystroke Sounds" desc="Plays a key click sound as you type." accent="#8b5cf6">
                            <Toggle value={soundEnabled} onChange={() => { toggleSound(); flash("sound"); }} accent="#8b5cf6" />
                        </SettingRow>
                        <SettingRow icon={Volume2} label="Sound Profile" desc="Choose your key sound. Mechanical and Thock recommended." accent="#8b5cf6">
                            <ChipGroup
                                options={[
                                    { label: "⌨️ Mechanical", value: "mechanical" },
                                    { label: "🖱️ Clicky", value: "clicky" },
                                    { label: "🥁 Thock", value: "thock" },
                                    { label: "🔫 Blaster", value: "blaster" },
                                    { label: "⚔️ Lightsaber", value: "lightsaber" },
                                ]}
                                value={soundProfile}
                                onChange={v => { setSoundProfile(v as any); flash("soundProfile"); }}
                                accent="#8b5cf6"
                            />
                        </SettingRow>
                        <SettingRow icon={BellOff} label="Silence on Wrong Key" desc="Don't play a sound when you type a wrong character." accent="#8b5cf6">
                            <Toggle value={hideErrorSound} onChange={() => { setHideErrorSound(!hideErrorSound); flash("errorSound"); }} accent="#8b5cf6" />
                        </SettingRow>
                        <SettingRow icon={Zap} label="Animated Background" desc="Show the background particle effect on the practice page." accent="#8b5cf6">
                            <Toggle value={animatedBg} onChange={() => { setAnimatedBg(!animatedBg); flash("bg"); }} accent="#8b5cf6" />
                        </SettingRow>
                    </Section>

                    {/* ── APPEARANCE ── */}
                    <Section id="appearance" icon={Palette} title="Appearance" subtitle="Fonts, sizing, and cursor style" accent="#ec4899">
                        <SettingRow icon={Type} label="Article Font Size" desc={`Text size in the typing area. Currently ${fontSize}px — see live preview below.`} accent="#ec4899">
                            <Slider value={fontSize} min={14} max={28} step={1}
                                onChange={v => { setFontSize(v); flash("fontSize"); }}
                                accent="#ec4899" label={v => `${v}px`} />
                        </SettingRow>

                        {/* live font preview */}
                        <div className="py-6 border-b border-white/5">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4 ml-6">Live Font Preview</p>
                            <div className="rounded-2xl px-6 py-5 border border-white/10 bg-slate-900/50 text-slate-300 leading-relaxed shadow-inner" style={{ fontSize }}>
                                The quick brown fox jumps over the lazy dog. 1234567890.
                            </div>
                        </div>

                        <SettingRow icon={AlignJustify} label="Caret Style" desc="How the cursor renders beneath the current character while typing." accent="#ec4899">
                            <ChipGroup
                                options={[
                                    { label: "▬ Underline", value: "underline" },
                                    { label: "█ Block", value: "block" },
                                    { label: "| Bar", value: "bar" },
                                ]}
                                value={caretStyle}
                                onChange={v => { setCaretStyle(v as any); flash("caret"); }}
                                accent="#ec4899"
                            />
                        </SettingRow>
                        <SettingRow icon={Zap} label="Smooth Caret Animation" desc="Animate caret movement between characters (disable if you experience lag)." accent="#ec4899">
                            <Toggle value={smoothCaret} onChange={() => { setSmoothCaret(!smoothCaret); flash("smoothCaret"); }} accent="#ec4899" />
                        </SettingRow>
                    </Section>

                    {/* ── TYPING BEHAVIOUR ── */}
                    <Section id="typing" icon={Keyboard} title="Typing Behaviour" subtitle="Visual feedback while typing" accent="#0ea5e9">
                        <SettingRow icon={AlignJustify} label="Word Highlight" desc="Subtly highlight the word you are currently on." accent="#0ea5e9" badge="NEW">
                            <Toggle value={highlightWord} onChange={() => { setHighlightWord(!highlightWord); flash("highlight"); }} accent="#0ea5e9" />
                        </SettingRow>
                    </Section>

                    {/* ── STATS & DATA ── */}
                    <Section id="stats" icon={BarChart2} title="Stats & Data" subtitle="Your session history and exports" accent="#10b981">
                        <div className="py-6 border-b border-white/5">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Sessions", value: history.length },
                                    { label: "Best WPM", value: bestWpm },
                                    { label: "Avg Accuracy", value: history.length ? `${avgAccuracy}%` : "—" },
                                ].map(stat => (
                                    <div key={stat.label} className="rounded-2xl p-5 text-center border border-emerald-900/50 bg-emerald-950/20">
                                        <p className="text-3xl font-black text-emerald-400 mb-1">{stat.value}</p>
                                        <p className="text-[11px] font-bold text-emerald-600/80 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <SettingRow icon={Download} label="Export History" desc="Download all sessions as a CSV file." accent="#10b981">
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={exportHistory}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white"
                                style={{ background: exportDone ? "#10b981" : "#0ea5e9" }}>
                                {exportDone ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                {exportDone ? "Downloaded!" : "Export CSV"}
                            </motion.button>
                        </SettingRow>
                        <SettingRow icon={Database} label="Clear Editorial Cache" desc="Forces a fresh fetch of editorial articles on next visit." accent="#10b981">
                            <button onClick={() => {
                                ["ed-v6", "yd-v1"].forEach(k => localStorage.removeItem(k));
                                flash("cache");
                            }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black border border-white/10 text-slate-300 bg-slate-800/50 hover:bg-slate-700 transition-all">
                                {saved === "cache" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
                                {saved === "cache" ? "Cleared!" : "Clear Cache"}
                            </button>
                        </SettingRow>
                    </Section>

                    {/* ── DANGER ZONE ── */}
                    <Section id="danger" icon={AlertTriangle} title="Danger Zone" subtitle="Irreversible actions — proceed carefully" accent="#f43f5e">
                        <SettingRow icon={Trash2} label="Delete Session History"
                            desc={`Permanently deletes all ${history.length} saved sessions. Cannot be undone.`} accent="#f43f5e">
                            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    if (confirm(`Delete all ${history.length} sessions? This cannot be undone.`)) {
                                        clearHistory(); flash("clearHistory");
                                    }
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white"
                                style={{ background: "#f43f5e" }}>
                                {saved === "clearHistory" ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                {saved === "clearHistory" ? "Done!" : `Delete ${history.length} Sessions`}
                            </motion.button>
                        </SettingRow>
                        <SettingRow icon={RefreshCw} label="Reset All Settings" desc="Resets every preference back to factory defaults." accent="#f43f5e">
                            <button onClick={() => {
                                if (!confirm("Reset all settings to defaults?")) return;
                                // Reset Zustand persisted values to defaults
                                setTheme('system'); setFontSize(20); setCaretStyle('underline'); setSmoothCaret(true);
                                setHighlightWord(false); setShowLiveWpm(true); setAutoPause(false); setAnimatedBg(true);
                                setHideErrorSound(false); setDuration(60); flash("reset");
                            }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black border border-rose-500/20 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all">
                                {saved === "reset" ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                                {saved === "reset" ? "Reset Done!" : "Reset Defaults"}
                            </button>
                        </SettingRow>
                    </Section>

                </div>
            </div>

            {/* floating toast */}
            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: 24, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-white text-sm font-bold shadow-2xl z-50"
                        style={{ background: "#1e293b" }}>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Saved
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
