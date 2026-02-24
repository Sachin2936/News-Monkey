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
            className="relative flex-shrink-0 transition-all duration-200"
            style={{ width: 52, height: 28, borderRadius: 14, background: value ? accent : "#e2e8f0" }}
        >
            <motion.div
                animate={{ x: value ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute top-[4px] w-5 h-5 bg-white rounded-full shadow-md"
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
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all border"
                        style={active
                            ? { background: accent + "15", color: accent, borderColor: accent + "50" }
                            : { background: "transparent", color: "#94a3b8", borderColor: "#e2e8f0" }}>
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
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
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
        <div className="flex items-center gap-6 py-5 border-b border-slate-100 last:border-0">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" color={accent} />}
                    <span className="font-bold text-slate-800">{label}</span>
                    {badge && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{ background: accent + "15", color: accent }}>
                            {badge}
                        </span>
                    )}
                </div>
                {desc && <p className="text-sm text-slate-400 leading-relaxed mt-0.5 ml-6">{desc}</p>}
            </div>
            <div className="flex-shrink-0">{children}</div>
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
            className="bg-white rounded-3xl overflow-hidden border border-slate-100"
            style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
            <div className="px-7 py-5 border-b border-slate-100" style={{ background: accent + "08" }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + "15" }}>
                        <Icon className="w-5 h-5" color={accent} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-900 leading-tight">{title}</h2>
                        <p className="text-[12px] text-slate-400">{subtitle}</p>
                    </div>
                </div>
            </div>
            <div className="px-7">{children}</div>
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

    // Apply theme to <html> whenever it changes
    useThemeApplier(theme);

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
        <div className="min-h-screen" style={{ background: "#f4f5fb" }}>
            {/* hero */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-indigo-500 mb-2">Preferences</p>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">Settings</h1>
                        <p className="text-slate-400 text-lg">Customise your practice environment, appearance, and data.</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10 flex gap-8 items-start">
                {/* sidebar */}
                <aside className="hidden lg:flex flex-col gap-1 w-52 sticky top-24 flex-shrink-0">
                    {NAV.map(n => {
                        const active = activeSection === n.id;
                        return (
                            <button key={n.id} onClick={() => scrollTo(n.id)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left"
                                style={active ? { background: n.accent + "15", color: n.accent } : { color: "#94a3b8" }}>
                                <n.icon className="w-4 h-4 flex-shrink-0" />
                                {n.label}
                                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                            </button>
                        );
                    })}
                </aside>

                {/* main */}
                <div className="flex-1 space-y-6 min-w-0">

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
                    <Section id="appearance" icon={Palette} title="Appearance" subtitle="Theme, fonts, and visual style" accent="#ec4899">
                        <SettingRow icon={SunMedium} label="Colour Theme" desc="Applies immediately. Follow OS, force Light, or force Dark." accent="#ec4899">
                            <ChipGroup
                                options={[
                                    { label: "System", value: "system", icon: "💻" },
                                    { label: "Light", value: "light", icon: "☀️" },
                                    { label: "Dark", value: "dark", icon: "🌙" },
                                ]}
                                value={theme}
                                onChange={v => { setTheme(v as any); flash("theme"); }}
                                accent="#ec4899"
                            />
                        </SettingRow>
                        <SettingRow icon={Type} label="Article Font Size" desc={`Text size in the typing area. Currently ${fontSize}px — see live preview below.`} accent="#ec4899">
                            <Slider value={fontSize} min={14} max={28} step={1}
                                onChange={v => { setFontSize(v); flash("fontSize"); }}
                                accent="#ec4899" label={v => `${v}px`} />
                        </SettingRow>

                        {/* live font preview */}
                        <div className="py-5 border-b border-slate-100">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-6">Live Font Preview</p>
                            <div className="rounded-2xl px-5 py-4 border border-slate-100 bg-slate-50 text-slate-700 leading-relaxed" style={{ fontSize }}>
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
                    <Section id="typing" icon={Keyboard} title="Typing Behaviour" subtitle="Error handling and visual feedback" accent="#0ea5e9">
                        <SettingRow icon={AlignJustify} label="Word Highlight" desc="Subtly highlight the word you are currently on." accent="#0ea5e9" badge="NEW">
                            <Toggle value={highlightWord} onChange={() => { setHighlightWord(!highlightWord); flash("highlight"); }} accent="#0ea5e9" />
                        </SettingRow>
                        <SettingRow icon={ShieldCheck} label="Strict Accuracy" desc="Wrong characters permanently reduce accuracy — even if deleted. This is always enabled to ensure fair scoring." accent="#0ea5e9" badge="On">
                            <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" /> Enabled
                            </span>
                        </SettingRow>
                    </Section>

                    {/* ── STATS & DATA ── */}
                    <Section id="stats" icon={BarChart2} title="Stats & Data" subtitle="Your session history and exports" accent="#10b981">
                        <div className="py-5 border-b border-slate-100">
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Sessions", value: history.length },
                                    { label: "Best WPM", value: bestWpm },
                                    { label: "Avg Accuracy", value: history.length ? `${avgAccuracy}%` : "—" },
                                ].map(stat => (
                                    <div key={stat.label} className="rounded-2xl p-4 text-center"
                                        style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                                        <p className="text-2xl font-black text-emerald-700">{stat.value}</p>
                                        <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mt-1">{stat.label}</p>
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
                            }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                                {saved === "cache" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <RefreshCw className="w-4 h-4" />}
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
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black border border-rose-200 text-rose-500 hover:bg-rose-50 transition-all">
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
