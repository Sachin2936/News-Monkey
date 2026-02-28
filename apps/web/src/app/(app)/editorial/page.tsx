"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, Star, Copy, Check, Quote, ChevronDown, Newspaper, Clock, ExternalLink, Calendar, Type, Loader2, Play, Pause, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type Editorial, type CategoryId, type DailyArticle } from "@/lib/editorialData";
import { useTypingStore } from "@/store/useTypingStore";

/* ─── cache helpers ──────────────────────────────────────────────── */
const ED_CK = "ed-v6";          // bump version = wipes old cache
const YD_CK = "yd-v1";
const TTL_12H = 12 * 60 * 60 * 1000;

/** Return cached data if it exists and was saved < 12h ago */
function readCache<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { d, t } = JSON.parse(raw);
        if (Date.now() - t > TTL_12H) { localStorage.removeItem(key); return null; }
        return d as T;
    } catch { return null; }
}
function writeCache<T>(key: string, data: T) {
    try { localStorage.setItem(key, JSON.stringify({ d: data, t: Date.now() })); } catch { }
}

/** Additionally, evict if the saved *calendar day* differs from today. */
function readDailyCache<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const { d, day } = JSON.parse(raw);
        const today = new Date().toDateString();
        if (day !== today) { localStorage.removeItem(key); return null; }
        return d as T;
    } catch { return null; }
}
function writeDailyCache<T>(key: string, data: T) {
    try {
        localStorage.setItem(key, JSON.stringify({ d: data, day: new Date().toDateString() }));
    } catch { }
}

/* ─── palette ────────────────────────────────────────────────────── */
const A: Record<string, { c: string; soft: string; glow: string }> = {
    "sports": { c: "#818cf8", soft: "#312e8180", glow: "#818cf840" },
    "fintech": { c: "#34d399", soft: "#064e3b80", glow: "#34d39940" },
    "politics": { c: "#fbbf24", soft: "#78350f80", glow: "#fbbf2440" },
    "world-affairs": { c: "#38bdf8", soft: "#0c4a6e80", glow: "#38bdf840" },
    "technology": { c: "#c084fc", soft: "#4c1d9580", glow: "#c084fc40" },
};

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Finance: { bg: "#064e3b80", text: "#34d399", border: "#05966980" },
    Health: { bg: "#88133780", text: "#fb7185", border: "#e11d4880" },
    Technology: { bg: "#4c1d9580", text: "#c084fc", border: "#9333ea80" },
    Politics: { bg: "#78350f80", text: "#fbbf24", border: "#d9770680" },
    Environment: { bg: "#14532d80", text: "#4ade80", border: "#16a34a80" },
    default: { bg: "#0c4a6e80", text: "#38bdf8", border: "#0284c780" },
};

/* ─── Editorial Card ─────────────────────────────────────────────── */
function EditorialCard({ ed, index, accent, textSizeStyle }: { ed: Editorial; index: number; accent: typeof A[string]; textSizeStyle: any }) {
    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { setArticle } = useTypingStore();
    const router = useRouter();

    useEffect(() => {
        const ids: string[] = JSON.parse(localStorage.getItem("ed-saved") || "[]");
        setSaved(ids.includes(ed.id));
    }, [ed.id]);

    const date = new Date(ed.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    const toggleSpeech = () => {
        if (!("speechSynthesis" in window)) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        const textToRead = `${ed.title}. The core idea: ${ed.easyExplanation}. Context: ${ed.context}. Benefits include: ${ed.positives.join(", ")}. Risks include: ${ed.negatives.join(", ")}. Final verdict: ${ed.verdict}.`;
        const utterance = new SpeechSynthesisUtterance(textToRead);

        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
    };

    // Cleanup speech on unmount
    useEffect(() => {
        return () => {
            if ("speechSynthesis" in window && isPlaying) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isPlaying]);

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group mb-12"
            style={{
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.2)"
            }}
        >
            {/* dynamic accent glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full blur-[100px] opacity-30 pointer-events-none transition-colors duration-700"
                style={{ background: accent.c }} />

            <div className="pl-8 pr-8 pt-10 pb-10 relative z-10">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest text-[#0f172a] shadow-lg shadow-black/20"
                        style={{ background: accent.c }}>
                        {ed.source}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-[14px]">
                        <Calendar className="w-4 h-4 opacity-50" />
                        {date}
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleSpeech}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[13px] font-bold transition-all ${isPlaying ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800"}`}
                        >
                            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {isPlaying ? "Stop" : "Listen"}
                        </motion.button>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[13px] font-bold text-slate-300">
                            <Clock className="w-3.5 h-3.5" />
                            {ed.readTime} min read
                        </div>
                    </div>
                </div>

                <h2 className="font-black leading-[1.1] tracking-tighter text-slate-100 mb-6 group-hover:tracking-tight transition-all duration-500" style={textSizeStyle.h2}>
                    {ed.title}
                </h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative mb-10 p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-[0.05] rotate-12 transition-transform group-hover:rotate-45 duration-1000">
                        <Star className="w-24 h-24" style={{ color: accent.c }} />
                    </div>
                    <div className="flex gap-6 items-start relative z-10">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl"
                            style={{ background: `linear-gradient(135deg, ${accent.c}, ${accent.c}80)` }}>
                            <Star className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <p className="text-[13px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: accent.c }}>
                                The Core Idea
                            </p>
                            <p className="font-[800] text-slate-200 leading-[1.3] tracking-tight transition-all duration-300" style={textSizeStyle.core}>
                                {ed.easyExplanation}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <p className="text-slate-300 leading-[1.8] mb-10 max-w-3xl font-medium transition-all duration-300" style={textSizeStyle.p}>
                    {ed.context}
                </p>

                <div className="grid lg:grid-cols-2 gap-8 mb-10">
                    {/* Benefits Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-[15px] font-black uppercase tracking-widest text-emerald-400">The Benefits</h3>
                        </div>
                        <div className="grid gap-3">
                            {ed.positives.map((p, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/50 hover:bg-emerald-900/40 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                    <span className="font-semibold text-slate-300 leading-snug transition-all duration-300" style={textSizeStyle.list}>{p}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Cons Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center">
                                <TrendingDown className="w-5 h-5 text-rose-400" />
                            </div>
                            <h3 className="text-[15px] font-black uppercase tracking-widest text-rose-400">The Risks</h3>
                        </div>
                        <div className="grid gap-3">
                            {ed.negatives.map((n, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-rose-950/30 border border-rose-900/50 hover:bg-rose-900/40 transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                                    <span className="font-semibold text-slate-300 leading-snug transition-all duration-300" style={textSizeStyle.list}>{n}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 rounded-3xl p-8 mb-10 relative overflow-hidden group/verdict"
                    style={{ background: "#451a0380", border: "1px solid #78350f" }}
                >
                    <div className="absolute -right-4 -bottom-4 opacity-5 translate-x-4 translate-y-4 group-hover/verdict:translate-x-0 group-hover/verdict:translate-y-0 transition-transform duration-700">
                        <Quote className="w-32 h-32 text-amber-500" />
                    </div>
                    <Quote className="w-8 h-8 text-amber-400 flex-shrink-0 mt-1" />
                    <div className="relative z-10">
                        <p className="text-[14px] font-black uppercase tracking-[0.3em] text-amber-500 mb-3">Final Verdict</p>
                        <p className="font-black text-slate-100 leading-tight tracking-tight transition-all duration-300" style={textSizeStyle.core}>{ed.verdict}</p>
                    </div>
                </motion.div>

                <div className="flex flex-col gap-6">
                    <button onClick={() => setOpen(!open)}
                        className="flex items-center gap-3 text-[14px] font-black text-slate-400 hover:text-slate-200 transition-all uppercase tracking-[0.2em] py-2">
                        <div className={`w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center transition-all ${open ? "rotate-180 border-slate-100 bg-slate-100 text-slate-900" : ""}`}>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        {open ? "Condense Analysis" : "The Deep Dive & Insight"}
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden">
                                <div className="pl-8 border-l-4 mb-10" style={{ borderColor: accent.c }}>
                                    <p className="text-slate-300 leading-[1.8] font-medium italic transition-all duration-300" style={textSizeStyle.p}>
                                        {ed.deepDive}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <p className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-500">Master the Vocab</p>
                                        <div className="grid gap-3">
                                            {ed.keyVocab.map((v, i) => (
                                                <div key={i} className="group/vocab flex flex-col gap-1 p-6 rounded-[1.5rem] bg-slate-800/50 border border-slate-700/50 shadow-sm hover:shadow-xl hover:border-slate-600 transition-all">
                                                    <span className="text-[17px] font-black" style={{ color: accent.c }}>{v.term}</span>
                                                    <span className="text-[15px] text-slate-400 font-medium leading-snug">{v.definition}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-[12px] font-black uppercase tracking-[0.25em] text-slate-500">Discussion Points</p>
                                        <div className="space-y-4">
                                            {ed.discussionPoints.map((dp, i) => (
                                                <div key={i} className="flex gap-4 p-6 rounded-[1.5rem] bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/80 hover:shadow-xl transition-all group/dp">
                                                    <span className="text-[20px] font-black opacity-30 group-hover/dp:opacity-100 transition-opacity" style={{ color: accent.c }}>{i + 1}</span>
                                                    <p className="text-[17px] text-slate-300 font-bold leading-tight">{dp}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center justify-between pt-10 border-t border-slate-800/50">
                        <div className="flex items-center gap-3">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={async () => {
                                    await navigator.clipboard.writeText(`${ed.title}\n\n${ed.context}\n\nVerdict: ${ed.verdict}`);
                                    setCopied(true); setTimeout(() => setCopied(false), 2000);
                                }}
                                className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all text-slate-400 hover:text-slate-200 group">
                                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    const ids: string[] = JSON.parse(localStorage.getItem("ed-saved") || "[]");
                                    const next = ids.includes(ed.id) ? ids.filter(id => id !== ed.id) : [...ids, ed.id];
                                    localStorage.setItem("ed-saved", JSON.stringify(next));
                                    setSaved(!saved);
                                }}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all group ${saved ? "bg-amber-900/30 border-amber-700/50 text-amber-500" : "border-slate-700 text-slate-400 hover:border-amber-700/50 hover:text-amber-500"}`}>
                                <Star className={`w-5 h-5 group-hover:scale-110 transition-transform ${saved ? "fill-amber-500" : ""}`} />
                            </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {ed.tags.map((t, i) => (
                                <span key={i} className="px-5 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-[12px] font-bold text-slate-400">#{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

/* ─── Yesterday's News Card ──────────────────────────────────────── */
function DailyCard({ article, index }: { article: DailyArticle; index: number }) {
    const { setArticle } = useTypingStore();
    const router = useRouter();
    const col = CAT_COLORS[article.category] ?? CAT_COLORS.default;

    const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
    });

    const doPractice = () => {
        setArticle({
            title: article.headline,
            content: `${article.headline}. ${article.summary} Key fact: ${article.keyFact}`.toLowerCase(),
            url: article.url, source: article.source, category: article.category,
            publishedAt: article.publishedAt,
        });
        router.push("/practice");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-900 rounded-2xl overflow-hidden"
            style={{ border: "1px solid #1e293b", boxShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
        >
            <div className="p-5">
                {/* badges */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-lg"
                        style={{ background: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-slate-400 ml-auto">
                        <Clock className="w-3 h-3" /> {article.readTime} min
                    </span>
                </div>

                {/* headline */}
                <h3 className="text-[17px] font-black leading-[1.3] text-slate-100 mb-3">
                    {article.headline}
                </h3>

                {/* summary */}
                <p className="text-[14px] text-slate-400 leading-relaxed mb-4">
                    {article.summary}
                </p>

                {/* key fact pill */}
                <div className="rounded-xl px-4 py-3 mb-4" style={{ background: "#451a0380", border: "1px solid #78350f" }}>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-500 block mb-1">Key Fact</span>
                    <span className="text-[13px] font-semibold text-slate-300">{article.keyFact}</span>
                </div>

                {/* footer */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                    <span className="text-[12px] font-bold text-slate-400">{article.source}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[12px] text-slate-400">{date}</span>
                    <div className="ml-auto">
                        <motion.a href={article.url} target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[14px] font-black bg-white text-slate-900 shadow-lg shadow-black/20 hover:shadow-xl transition-all">
                            Explore Story <ExternalLink className="w-4 h-4" />
                        </motion.a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Skeleton ───────────────────────────────────────────────────── */
function Skeleton() {
    return (
        <div className="space-y-10">
            {[0, 1].map(i => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] animate-pulse overflow-hidden p-10 border border-slate-800">
                    <div className="flex gap-4 mb-8">
                        <div className="h-8 w-24 bg-slate-800 rounded-full" />
                        <div className="h-8 w-32 bg-slate-800/50 rounded-full" />
                    </div>
                    <div className="h-16 w-4/5 bg-slate-800 rounded-2xl mb-8" />
                    <div className="h-32 w-full bg-slate-800/50 rounded-[2rem] mb-8" />
                    <div className="space-y-4 mb-10">
                        {[1, 0.9, 0.7].map(w => <div key={w} className="h-5 bg-slate-800/50 rounded-full" style={{ width: `${w * 100}%` }} />)}
                    </div>
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="h-40 bg-emerald-950/30 rounded-3xl" />
                        <div className="h-40 bg-rose-950/30 rounded-3xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function DailySkeleton() {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map(i => (
                <div key={i} className="bg-slate-900 rounded-2xl animate-pulse p-5" style={{ border: "1px solid #1e293b" }}>
                    <div className="h-5 w-20 bg-slate-800 rounded mb-3" />
                    <div className="h-6 w-full bg-slate-700/50 rounded mb-2" />
                    <div className="h-4 w-4/5 bg-slate-800 rounded mb-1" />
                    <div className="h-4 w-3/4 bg-slate-800 rounded mb-4" />
                    <div className="h-14 bg-amber-950/30 rounded-xl mb-4" />
                    <div className="flex gap-2"><div className="h-8 w-20 bg-slate-800 rounded-lg" /><div className="h-8 w-16 bg-slate-800/50 rounded-lg" /></div>
                </div>
            ))}
        </div>
    );
}

function Divider({ accent }: { accent: typeof A[string] }) {
    return (
        <div className="flex items-center gap-6 py-10 opacity-30">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.c }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: accent.c, boxShadow: `0 0 15px ${accent.c}` }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.c }} />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-700" />
        </div>
    );
}

/* ─── Typography Sizes ────────────────────────────────────────────── */
const SIZES = {
    sm: { h2: { fontSize: '28px' }, core: { fontSize: '18px' }, p: { fontSize: '16px' }, list: { fontSize: '14px' } },
    md: { h2: { fontSize: '38px' }, core: { fontSize: '22px' }, p: { fontSize: '19px' }, list: { fontSize: '16px' } },
    lg: { h2: { fontSize: '46px' }, core: { fontSize: '26px' }, p: { fontSize: '22px' }, list: { fontSize: '18px' } },
};
type SizeKey = keyof typeof SIZES;

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function EditorialPage() {
    const [cat, setCat] = useState<CategoryId>("sports");
    const [store, setStore] = useState<Record<string, Editorial[]>>({});
    const [loading, setLoading] = useState(true);
    const [dailyArticles, setDailyArticles] = useState<DailyArticle[]>([]);
    const [dailyLoading, setDailyLoading] = useState(true);
    const [nextRefresh, setNextRefresh] = useState<string>("");

    const [textSize, setTextSize] = useState<SizeKey>("md");

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    /* Compute time until next 12h boundary */
    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            // Next refresh is at the next boundary of 12h from epoch
            const boundary = new Date();
            boundary.setMinutes(0, 0, 0);
            if (boundary.getHours() < 12) boundary.setHours(12);
            else { boundary.setDate(boundary.getDate() + 1); boundary.setHours(0); }
            const diff = boundary.getTime() - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            setNextRefresh(`${h}h ${m}m`);
        };
        tick();
        const t = setInterval(tick, 60000);
        return () => clearInterval(t);
    }, []);

    /* Load editorials with 12h cache */
    const load = useCallback(async (c: CategoryId, force = false) => {
        if (!force && store[c]) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/editorial?category=${c}`);
            const data: Editorial[] = await res.json();
            setStore(prev => {
                const n = { ...prev, [c]: data };
                writeCache(ED_CK, n);
                return n;
            });
        } catch {/* keep old */ }
        setLoading(false);
    }, [store]);

    useEffect(() => {
        const cached = readCache<Record<string, Editorial[]>>(ED_CK);
        if (cached) { setStore(cached); setLoading(false); }
        else load("sports");
    }, []);

    /* Also eagerly pre-load all categories after initial render */
    useEffect(() => {
        if (Object.keys(store).length === 0) return;
        const missing = CATEGORIES.map(c => c.id).filter(id => !store[id]);
        missing.forEach(id => load(id as CategoryId));
    }, [store]);

    /* Load yesterday's news with daily (not 12h) cache */
    useEffect(() => {
        const cached = readDailyCache<DailyArticle[]>(YD_CK);
        if (cached) { setDailyArticles(cached); setDailyLoading(false); return; }
        fetch("/api/yesterday")
            .then(r => r.json())
            .then((data: DailyArticle[]) => {
                setDailyArticles(data);
                writeDailyCache(YD_CK, data);
                setDailyLoading(false);
            })
            .catch(() => setDailyLoading(false));
    }, []);

    const accent = A[cat];
    const cards = store[cat] || [];
    const isLoading = loading && cards.length === 0;
    const activeCat = CATEGORIES.find(c => c.id === cat)!;

    const yesterdayLabel = new Date(Date.now() - 86400000).toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
    });

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "#060a12" }}>
            {/* ── Reading Progress Bar ── */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1.5 z-50 origin-left"
                style={{ scaleX, background: A[cat].c }}
            />

            {/* ── Premium Background Decorative Elements ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-indigo-900/20 rounded-full blur-[120px] -mr-[40vw] -mt-[40vw]" />
                <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-rose-900/20 rounded-full blur-[100px] -ml-[30vw] -mb-[30vw]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] opacity-[0.05] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
            </div>

            {/* ── HERO ── */}
            <div className="relative z-10 pt-32 pb-24">
                <div className="container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 shadow-2xl shadow-black/40 mb-10">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                            <span className="text-white text-[13px] font-black uppercase tracking-[0.4em]">The Editorial Room</span>
                        </div>

                        <h1 className="text-[65px] md:text-[110px] font-black tracking-[-0.05em] leading-[0.9] text-white mb-10">
                            Elite insights for the<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400 animate-gradient-x"
                                style={{ backgroundSize: '200% auto' }}>
                                Modern Mind.
                            </span>
                        </h1>

                        <div className="max-w-2xl mx-auto mb-16 px-4">
                            <p className="text-[22px] md:text-[26px] text-slate-400 font-bold leading-tight tracking-tight">
                                We dissect complex events into <span className="text-slate-100 underline decoration-indigo-500/50 underline-offset-8">pure clarity.</span> Deep analysis, simplified.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-8">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-[#060a12] bg-slate-800 shadow-lg relative z-[5] hover:z-10 transition-all hover:scale-110">
                                        <img src={`https://i.pravatar.cc/48?img=${i + 20}`} className="w-full h-full rounded-full" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-4 border-[#060a12] bg-white flex items-center justify-center text-[12px] text-slate-900 font-black shadow-lg relative z-0">
                                    +100
                                </div>
                            </div>
                            <div className="h-10 w-px bg-slate-800" />
                            <div className="text-left">
                                <p className="text-[18px] font-black text-white leading-none mb-1">Trusted globally.</p>
                                <p className="text-[14px] font-bold text-slate-400">Join our growing reader base.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── STICKY TABS & CONTROLS ── */}
            <div className="sticky top-20 z-40 px-6">
                <div className="container mx-auto max-w-4xl flex items-center justify-between gap-4">
                    <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-2 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] flex items-center gap-1 overflow-x-auto scrollbar-none max-w-[calc(100%-140px)]">
                        {CATEGORIES.map(c => {
                            const a = A[c.id];
                            const active = cat === c.id;
                            return (
                                <button key={c.id}
                                    onClick={() => { setCat(c.id); load(c.id); }}
                                    className="relative flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-[15px] font-black whitespace-nowrap flex-shrink-0 transition-all duration-300"
                                    style={active
                                        ? { background: a.c, color: "white", boxShadow: `0 8px 16px ${a.c}40` }
                                        : { color: "#94a3b8" }}>
                                    <span>{c.emoji}</span>
                                    <span>{c.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Text Size Controls */}
                    <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-[1.5rem] p-1 shadow-lg flex items-center flex-shrink-0">
                        {(["sm", "md", "lg"] as SizeKey[]).map((s) => (
                            <button key={s}
                                onClick={() => setTextSize(s)}
                                className={`w-10 h-10 rounded-[1rem] flex items-center justify-center transition-all ${textSize === s ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"}`}
                            >
                                <Type className={`w-${s === 'sm' ? '3' : s === 'md' ? '4' : '5'} h-${s === 'sm' ? '3' : s === 'md' ? '4' : '5'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── EDITORIAL CONTENT ── */}
            <div className="container mx-auto px-5 py-12 max-w-4xl relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div key={cat} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                        {isLoading ? <Skeleton /> : (
                            cards.map((ed, i) => (
                                <div key={ed.id}>
                                    <EditorialCard ed={ed} index={i} accent={accent} textSizeStyle={SIZES[textSize]} />
                                    {i < cards.length - 1 && <Divider accent={accent} />}
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── YESTERDAY'S DAILY NEWS ── */}
            <div className="border-t" style={{ borderColor: "#1e293b", background: "#060a12" }}>
                <div className="container mx-auto px-5 py-10 max-w-6xl">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center">
                                <Newspaper className="w-5 h-5 text-slate-900" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 mb-0.5">
                                    Daily Refresh · 6 stories
                                </p>
                                <h2 className="text-2xl font-black tracking-tight text-white">
                                    Yesterday's Top Stories
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-slate-400 font-medium">
                            <Calendar className="w-4 h-4" />
                            {yesterdayLabel}
                        </div>
                    </div>

                    {/* explanation pill */}
                    <div className="flex items-center gap-2 mb-7 px-4 py-2.5 rounded-xl inline-flex w-fit"
                        style={{ background: "#0c4a6e80", border: "1px solid #0284c780" }}>
                        <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-[13px] font-semibold text-sky-300">
                            These 6 articles are replaced every midnight with yesterday's top news. Click Practice to type any story.
                        </span>
                    </div>

                    {/* daily cards grid */}
                    {dailyLoading ? <DailySkeleton /> : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {dailyArticles.map((article, i) => (
                                <DailyCard key={article.id} article={article} index={i} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
