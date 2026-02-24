"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Keyboard, RefreshCw, Star, Copy, Check, Quote, ChevronDown, Newspaper, Clock, ExternalLink, Calendar } from "lucide-react";
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
    "sports": { c: "#6366f1", soft: "#eef2ff", glow: "#6366f120" },
    "fintech": { c: "#059669", soft: "#ecfdf5", glow: "#05966920" },
    "politics": { c: "#d97706", soft: "#fffbeb", glow: "#d9770620" },
    "world-affairs": { c: "#0284c7", soft: "#f0f9ff", glow: "#0284c720" },
    "technology": { c: "#9333ea", soft: "#faf5ff", glow: "#9333ea20" },
};

const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    Finance: { bg: "#ecfdf5", text: "#059669", border: "#bbf7d0" },
    Health: { bg: "#fff0f3", text: "#e11d48", border: "#fecdd3" },
    Technology: { bg: "#faf5ff", text: "#9333ea", border: "#e9d5ff" },
    Politics: { bg: "#fffbeb", text: "#d97706", border: "#fcd34d" },
    Environment: { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0" },
    default: { bg: "#f0f9ff", text: "#0284c7", border: "#bae6fd" },
};

/* ─── Editorial Card ─────────────────────────────────────────────── */
function EditorialCard({ ed, index, accent }: { ed: Editorial; index: number; accent: typeof A[string] }) {
    const [open, setOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const { setArticle } = useTypingStore();
    const router = useRouter();

    useEffect(() => {
        const ids: string[] = JSON.parse(localStorage.getItem("ed-saved") || "[]");
        setSaved(ids.includes(ed.id));
    }, [ed.id]);

    const toggleSave = () => {
        const ids: string[] = JSON.parse(localStorage.getItem("ed-saved") || "[]");
        const next = ids.includes(ed.id) ? ids.filter(i => i !== ed.id) : [...ids, ed.id];
        localStorage.setItem("ed-saved", JSON.stringify(next));
        setSaved(!saved);
    };

    const doCopy = async () => {
        await navigator.clipboard.writeText(
            `${ed.title}\n\n${ed.context}\n\n✅ Positives:\n${ed.positives.join("\n")}\n\n❌ Negatives:\n${ed.negatives.join("\n")}\n\nVerdict: ${ed.verdict}`
        );
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const doPractice = () => {
        setArticle({
            title: `Editorial: ${ed.title}`,
            content: `${ed.title}. ${ed.context} ${ed.deepDive} Positives: ${ed.positives.join(". ")}. Negatives: ${ed.negatives.join(". ")}.`.toLowerCase(),
            url: "", source: ed.source, category: ed.category, publishedAt: ed.publishedAt,
        });
        router.push("/practice");
    };

    const date = new Date(ed.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-white rounded-3xl overflow-hidden"
            style={{ border: "1px solid #e4e4f0", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
        >
            {/* left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: accent.c }} />

            <div className="pl-8 pr-7 pt-7 pb-7">
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-[13px] font-black uppercase tracking-[0.18em]" style={{ color: accent.c }}>
                        {ed.source}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[15px] text-slate-400">{date}</span>
                    <span className="ml-auto text-[14px] font-semibold text-slate-400">{ed.readTime} min read</span>
                </div>

                <h2 className="text-[28px] md:text-[34px] font-black leading-[1.2] tracking-tight text-slate-900 mb-5">
                    {ed.title}
                </h2>

                <p className="text-[18px] md:text-[20px] text-slate-600 leading-[1.78] mb-8 max-w-2xl">
                    {ed.context}
                </p>

                <div className="h-px mb-7" style={{ background: `linear-gradient(90deg, ${accent.c}60, transparent)` }} />

                <div className="grid md:grid-cols-2 gap-5 mb-6">
                    <div className="rounded-2xl p-5" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                            <span className="text-[13px] font-black uppercase tracking-[0.16em] text-emerald-700">Positives</span>
                        </div>
                        <ul className="space-y-2.5">
                            {ed.positives.map((p, i) => (
                                <motion.li key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.06 }}
                                    className="flex items-start gap-2.5">
                                    <span className="mt-[8px] w-[5px] h-[5px] rounded-full flex-shrink-0 bg-emerald-500" />
                                    <span className="text-[16px] text-slate-700 leading-relaxed">{p}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl p-5" style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                            </div>
                            <span className="text-[13px] font-black uppercase tracking-[0.16em] text-rose-700">Negatives</span>
                        </div>
                        <ul className="space-y-2.5">
                            {ed.negatives.map((n, i) => (
                                <motion.li key={i}
                                    initial={{ opacity: 0, x: 10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + i * 0.06 }}
                                    className="flex items-start gap-2.5">
                                    <span className="mt-[8px] w-[5px] h-[5px] rounded-full flex-shrink-0 bg-rose-500" />
                                    <span className="text-[16px] text-slate-700 leading-relaxed">{n}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-3 rounded-2xl p-5 mb-6"
                    style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}
                >
                    <Quote className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-[12px] font-black uppercase tracking-widest text-amber-600 mb-2">Balanced Verdict</p>
                        <p className="text-[17px] text-slate-700 leading-relaxed">{ed.verdict}</p>
                    </div>
                </motion.div>

                <button onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 text-[15px] font-bold text-slate-400 hover:text-slate-700 transition-colors mb-5">
                    <div className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                    {open ? "Collapse" : "Deep Dive + Vocabulary"}
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.38, ease: "easeInOut" }}
                            className="overflow-hidden">
                            <p className="text-[18px] text-slate-600 leading-[1.82] border-l-[3px] pl-5 mb-6"
                                style={{ borderColor: accent.c }}>
                                {ed.deepDive}
                            </p>
                            <div className="grid gap-2.5 mb-5">
                                {ed.keyVocab.map((v, i) => (
                                    <div key={i} className="flex gap-2 px-4 py-3 rounded-xl" style={{ background: accent.soft, border: `1px solid ${accent.c}30` }}>
                                        <span className="text-[15px] font-black flex-shrink-0" style={{ color: accent.c }}>{v.term}:</span>
                                        <span className="text-[15px] text-slate-600 leading-snug">{v.definition}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[12px] font-black uppercase tracking-widest text-slate-400 mb-3">For Discussions & Interviews</p>
                            <div className="space-y-3 mb-5">
                                {ed.discussionPoints.map((dp, i) => (
                                    <div key={i} className="flex gap-3 text-[16px] text-slate-600 leading-relaxed">
                                        <span className="font-black flex-shrink-0" style={{ color: accent.c }}>{i + 1}.</span>
                                        {dp}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center gap-2.5 pt-5 border-t border-slate-100">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={doPractice}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-[16px] font-black text-white"
                        style={{ background: accent.c }}>
                        <Keyboard className="w-4 h-4" /> Practice
                    </motion.button>
                    <button onClick={doCopy}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-[16px] font-bold border border-slate-200 hover:bg-slate-50 transition-all text-slate-600">
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                    </button>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                        onClick={toggleSave}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[16px] font-bold border transition-all ml-auto ${saved ? "text-amber-700" : "border-slate-200 text-slate-400 hover:bg-slate-50"}`}
                        style={saved ? { background: "#fffbeb", borderColor: "#fcd34d" } : {}}>
                        <Star className={`w-4 h-4 ${saved ? "fill-amber-500 text-amber-500" : ""}`} />
                        {saved ? "Saved" : "Save"}
                    </motion.button>
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
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #e4e4f0", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
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
                <h3 className="text-[17px] font-black leading-[1.3] text-slate-900 mb-3">
                    {article.headline}
                </h3>

                {/* summary */}
                <p className="text-[14px] text-slate-500 leading-relaxed mb-4">
                    {article.summary}
                </p>

                {/* key fact pill */}
                <div className="rounded-xl px-4 py-3 mb-4" style={{ background: "#fffbeb", border: "1px solid #fcd34d" }}>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 block mb-1">Key Fact</span>
                    <span className="text-[13px] font-semibold text-slate-700">{article.keyFact}</span>
                </div>

                {/* footer */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <span className="text-[12px] font-bold text-slate-400">{article.source}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[12px] text-slate-400">{date}</span>
                    <div className="ml-auto flex gap-2">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={doPractice}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-bold text-white"
                            style={{ background: "#6366f1" }}>
                            <Keyboard className="w-3 h-3" /> Practice
                        </motion.button>
                        <a href={article.url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                            <ExternalLink className="w-3 h-3" /> Read
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Skeleton ───────────────────────────────────────────────────── */
function Skeleton() {
    return (
        <div className="space-y-6">
            {[0, 1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl animate-pulse overflow-hidden" style={{ border: "1px solid #e4e4f0" }}>
                    <div className="pl-8 pr-7 py-7">
                        <div className="flex gap-3 mb-4"><div className="h-4 w-24 bg-slate-100 rounded" /><div className="h-4 w-32 bg-slate-100 rounded" /></div>
                        <div className="h-8 w-4/5 bg-slate-200 rounded-xl mb-4" />
                        <div className="space-y-2.5 mb-7">{[1, .85, .7].map(w => <div key={w} className="h-4 bg-slate-100 rounded" style={{ width: `${w * 100}%` }} />)}</div>
                        <div className="grid grid-cols-2 gap-5 mb-5"><div className="h-32 bg-emerald-50 rounded-2xl" /><div className="h-32 bg-rose-50 rounded-2xl" /></div>
                        <div className="flex gap-3"><div className="h-10 w-28 bg-slate-200 rounded-xl" /><div className="h-10 w-20 bg-slate-100 rounded-xl" /></div>
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
                <div key={i} className="bg-white rounded-2xl animate-pulse p-5" style={{ border: "1px solid #e4e4f0" }}>
                    <div className="h-5 w-20 bg-slate-100 rounded mb-3" />
                    <div className="h-6 w-full bg-slate-200 rounded mb-2" />
                    <div className="h-4 w-4/5 bg-slate-100 rounded mb-1" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded mb-4" />
                    <div className="h-14 bg-amber-50 rounded-xl mb-4" />
                    <div className="flex gap-2"><div className="h-8 w-20 bg-slate-200 rounded-lg" /><div className="h-8 w-16 bg-slate-100 rounded-lg" /></div>
                </div>
            ))}
        </div>
    );
}

function Divider({ accent }: { accent: typeof A[string] }) {
    return (
        <div className="flex items-center gap-4 py-3">
            <div className="flex-1 h-px bg-slate-200" />
            <div className="w-2 h-2 rounded-full" style={{ background: accent.c, boxShadow: `0 0 8px ${accent.c}88` }} />
            <div className="flex-1 h-px bg-slate-200" />
        </div>
    );
}

/* ─── MAIN ───────────────────────────────────────────────────────── */
export default function EditorialPage() {
    const [cat, setCat] = useState<CategoryId>("sports");
    const [store, setStore] = useState<Record<string, Editorial[]>>({});
    const [loading, setLoading] = useState(true);
    const [dailyArticles, setDailyArticles] = useState<DailyArticle[]>([]);
    const [dailyLoading, setDailyLoading] = useState(true);
    const [nextRefresh, setNextRefresh] = useState<string>("");

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
        <div className="min-h-screen" style={{ background: "#f4f4fb" }}>

            {/* ── HERO ── */}
            <div className="border-b bg-white overflow-hidden relative" style={{ borderColor: "#e4e4f0" }}>
                <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 20% 60%, ${accent.glow} 0%, transparent 65%)` }} />

                <div className="container mx-auto px-5 pt-12 pb-10 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <p className="text-[11px] font-black uppercase tracking-[0.28em] mb-4" style={{ color: accent.c }}>
                            Editorial · Both Sides · Refreshed every 12h
                        </p>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.93] mb-4">
                            Read Both<br />
                            <span style={{ color: accent.c }}>Sides.</span>
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                            Balanced, fact-first editorials — with vocabulary, discussion questions, and typing practice built in.
                        </p>
                        {nextRefresh && (
                            <p className="flex items-center gap-1.5 mt-3 text-[13px] text-slate-400 font-medium">
                                <RefreshCw className="w-3.5 h-3.5" />
                                Next refresh in {nextRefresh}
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* ── STICKY TABS ── */}
            <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b" style={{ borderColor: "#e4e4f0" }}>
                <div className="container mx-auto px-5">
                    <div className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-none">
                        {CATEGORIES.map(c => {
                            const a = A[c.id];
                            const active = cat === c.id;
                            return (
                                <button key={c.id}
                                    onClick={() => { setCat(c.id); load(c.id); }}
                                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all"
                                    style={active
                                        ? { background: a.soft, color: a.c, border: `1px solid ${a.c}40` }
                                        : { color: "#94a3b8", border: "1px solid transparent" }}>
                                    {active && (
                                        <motion.span layoutId="tab-dot" className="absolute left-2.5 w-1.5 h-1.5 rounded-full"
                                            style={{ background: a.c }} />
                                    )}
                                    <span className={active ? "pl-3" : ""}>{c.emoji} {c.label}</span>
                                </button>
                            );
                        })}
                        <button onClick={() => load(cat, true)}
                            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent transition-all flex-shrink-0">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* ── EDITORIAL CONTENT ── */}
            <div className="container mx-auto px-5 py-8 max-w-4xl">
                <AnimatePresence mode="wait">
                    <motion.div key={cat + "hd"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                        className="flex items-end justify-between mb-7">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Now Reading</p>
                            <h2 className="text-2xl font-black tracking-tight" style={{ color: accent.c }}>
                                {activeCat.emoji} {activeCat.label}
                            </h2>
                        </div>
                        <span className="text-sm text-slate-400">{cards.length} editorial{cards.length !== 1 ? "s" : ""}</span>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div key={cat} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}>
                        {isLoading ? <Skeleton /> : (
                            cards.map((ed, i) => (
                                <div key={ed.id}>
                                    <EditorialCard ed={ed} index={i} accent={accent} />
                                    {i < cards.length - 1 && <Divider accent={accent} />}
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── YESTERDAY'S DAILY NEWS ── */}
            <div className="border-t" style={{ borderColor: "#e4e4f0", background: "white" }}>
                <div className="container mx-auto px-5 py-10 max-w-6xl">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center">
                                <Newspaper className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-0.5">
                                    Daily Refresh · 6 stories
                                </p>
                                <h2 className="text-2xl font-black tracking-tight text-slate-900">
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
                        style={{ background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                        <RefreshCw className="w-3.5 h-3.5 text-sky-500" />
                        <span className="text-[13px] font-semibold text-sky-700">
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
