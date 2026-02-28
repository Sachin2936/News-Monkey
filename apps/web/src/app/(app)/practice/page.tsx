"use client";

import { useTypingStore } from "@/store/useTypingStore";
import TypingArea from "@/components/TypingArea";
import PracticeStats from "@/components/PracticeStats";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, BookOpen, Settings2, Repeat } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/** Tooltip that appears above the wrapped element on hover. */
function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="relative group/tip">
            {children}
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                <div className="bg-slate-800 border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
                    {label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
            </div>
        </div>
    );
}

/** Small keyboard badge rendered inside button labels. */
function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-black leading-none tracking-wide">
            {children}
        </span>
    );
}

export default function PracticePage() {
    const { article, setArticle, resetTest, isFinished, repeatArticle } = useTypingStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchNewArticle = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/news?category=general`);
            const articlesList = await res.json();
            if (articlesList && articlesList.length > 0) {
                const a = articlesList[0];
                setArticle({
                    title: "News Session: " + (a.title.length > 60 ? a.title.substring(0, 60) + "..." : a.title),
                    content: a.content.toLowerCase(),
                    url: a.url,
                    source: a.sourceName || "General News",
                    category: a.category || "general",
                    publishedAt: a.publishedAt,
                });
            } else {
                console.warn("No articles found");
            }
        } catch (err) {
            console.error("Failed to fetch news:", err);
        } finally {
            setLoading(false);
        }
    }, [setArticle]);

    // ── Keyboard shortcuts ─────────────────────────────────────────────────────
    //   Escape  →  Repeat current article
    //   Tab     →  New article
    //
    // The TypingArea uses a hidden <textarea> that permanently holds DOM focus,
    // but Escape and Tab don't produce typed characters so they fire safely.
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                repeatArticle();
            }
            if (e.key === "Tab") {
                e.preventDefault();
                fetchNewArticle();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [repeatArticle, fetchNewArticle]);

    // Navigate to results when finished
    useEffect(() => {
        if (isFinished) router.push("/results");
    }, [isFinished, router]);

    // Reset test state on unmount (only if not finished)
    useEffect(() => {
        return () => {
            const state = useTypingStore.getState();
            if (!state.isFinished) state.resetTest();
        };
    }, []);

    // Auto-fetch if no article is loaded yet
    useEffect(() => {
        if (!article) fetchNewArticle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full px-4 md:px-8 py-4 md:py-6 min-h-[calc(100vh-64px)] flex flex-col justify-start">
            <AnimatePresence mode="wait">
                {loading || !article ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <RefreshCw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-glow">
                                Loading Latest News
                            </h2>
                            <p className="text-muted-foreground animate-pulse font-medium">
                                Preparing your typing session...
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="practice"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="relative"
                    >
                        {/* ── Practice Header ── */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                            {/* Article title */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black font-outfit line-clamp-1 max-w-xl">
                                            {article.title}
                                        </h2>
                                        <p className="text-xs font-bold uppercase tracking-widest text-primary/60">
                                            Practice Session • {article.source}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="flex gap-4">
                                    {/* Repeat */}
                                    <Tooltip label="Repeat current article  [ Esc ]">
                                        <button
                                            onClick={repeatArticle}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold group"
                                        >
                                            <Repeat className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                                            <span>Repeat</span>
                                            <Kbd>Esc</Kbd>
                                        </button>
                                    </Tooltip>

                                    {/* New Article */}
                                    <Tooltip label="Load new article  [ Tab ]">
                                        <button
                                            onClick={fetchNewArticle}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-all font-bold shadow-lg shadow-primary/20"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                            <span>New Article</span>
                                            <Kbd>Tab</Kbd>
                                        </button>
                                    </Tooltip>

                                    {/* Settings */}
                                    <Link
                                        href="/settings"
                                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        <Settings2 className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <PracticeStats />
                        <TypingArea />

                        {/* Bottom hint */}
                        <div className="mt-12 text-center text-muted-foreground/40 text-sm font-medium italic">
                            Start typing to begin the timer.&nbsp;&nbsp;
                            <span className="not-italic font-semibold text-muted-foreground/50">Esc</span>
                            {" "}to repeat &middot;&nbsp;
                            <span className="not-italic font-semibold text-muted-foreground/50">Tab</span>
                            {" "}for a new article.
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
