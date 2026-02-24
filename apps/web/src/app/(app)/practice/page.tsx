"use client";

import { useTypingStore } from "@/store/useTypingStore";
import TypingArea from "@/components/TypingArea";
import PracticeStats from "@/components/PracticeStats";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowLeft, BookOpen, Settings2, Repeat } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PracticePage() {
    const { article, setArticle, resetTest, isFinished, repeatArticle } = useTypingStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchNewArticle = async () => {
        setLoading(true);
        try {
            // Fetch fresh news (default to general)
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
                    publishedAt: a.publishedAt
                });
            } else {
                console.warn("No articles found");
            }
        } catch (err) {
            console.error("Failed to fetch news:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFinished) {
            router.push("/results");
        }
    }, [isFinished, router]);

    // Cleanup: Reset test state when leaving the practice page
    useEffect(() => {
        return () => {
            const state = useTypingStore.getState();
            if (!state.isFinished) {
                state.resetTest();
            }
        };
    }, []);

    // Auto-fetch news if none present
    useEffect(() => {
        if (!article) {
            fetchNewArticle();
        }
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
                            <p className="text-muted-foreground animate-pulse font-medium">Preparing your typing session...</p>
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
                        {/* Practice Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
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

                            <div className="flex flex-col gap-4 w-full md:w-auto">
                                <div className="flex gap-4">
                                    <button
                                        onClick={repeatArticle}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold group"
                                        title="Repeat Current Article"
                                    >
                                        <Repeat className="w-5 h-5 text-primary group-hover:rotate-180 transition-transform duration-500" />
                                        <span>Repeat</span>
                                    </button>
                                    <button
                                        onClick={fetchNewArticle}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground hover:scale-105 transition-all font-bold shadow-lg shadow-primary/20"
                                        title="Get New Article"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        <span>New Article</span>
                                    </button>
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

                        <div className="mt-12 text-center text-muted-foreground/40 text-sm font-medium italic">
                            Tip: Start typing to begin the timer automatically. Higher accuracy results in more rewards!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
