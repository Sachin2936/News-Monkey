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
    const { article, setArticle, resetTest, isFinished, repeatArticle, region, setRegion } = useTypingStore();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchNewArticle = async () => {
        setLoading(true);
        try {
            // Fetch fresh news (utilizing background update cache and correct region)
            const res = await fetch(`/api/news?category=general&country=${region}`);
            const articlesList = await res.json();

            if (articlesList && articlesList.length > 0) {
                // Shuffle the entire list so variety is guaranteed
                const shuffled = [...articlesList].sort(() => Math.random() - 0.5);

                // Combine 5-7 articles to ensure enough content for 60s
                const count = Math.min(7, shuffled.length);
                const selected = shuffled.slice(0, count);

                const combinedContent = selected
                    .map((a) => a.description)
                    .join(" ... ");
                // console.log(selected);
                const sources = Array.from(new Set(selected.map((a) => a.source.name))).join(", ");

                setArticle({
                    title: "Headline Mix: " + selected[0].title,
                    content: combinedContent,
                    url: selected[0].url,
                    source: sources,
                    category: 'general',
                    publishedAt: selected[0].publishedAt
                });
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

    // Auto-fetch news if none present or region changes
    useEffect(() => {
        fetchNewArticle();
    }, [region]);

    return (
        <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-64px)]">
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
                                Loading {region === 'in' ? 'Indian' : 'Global'} News
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
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                            <div className="space-y-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Home
                                </Link>
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
                                {/* Region Selector */}
                                <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl self-end">
                                    <button
                                        onClick={() => setRegion('us')}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${region === 'us'
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5 opacity-60'
                                            }`}
                                    >
                                        WORLDWIDE
                                    </button>
                                    <button
                                        onClick={() => setRegion('in')}
                                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${region === 'in'
                                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-100'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5 opacity-60'
                                            }`}
                                    >
                                        INDIA
                                    </button>
                                </div>

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
                                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors hidden md:block"
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
