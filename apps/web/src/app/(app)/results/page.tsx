"use client";

import { useTypingStore } from "@/store/useTypingStore";
import { motion } from "framer-motion";
import {
    Trophy,
    Target,
    Zap,
    Clock,
    Repeat,
    Newspaper,
    ArrowRight,
    BrainCircuit,
    Award,
    LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function ResultsPage() {
    const router = useRouter();
    const {
        wpm,
        accuracy,
        errors,
        totalCharsTyped,
        isFinished,
        article,
        resetTest,
        repeatArticle
    } = useTypingStore();

    useEffect(() => {
        if (isFinished && accuracy > 90) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#8b5cf6', '#ec4899']
            });
        }
    }, [isFinished, accuracy]);

    const stats = [
        { label: "WPM", value: wpm, icon: Zap, color: "text-yellow-400" },
        { label: "Accuracy", value: `${accuracy}%`, icon: Target, color: "text-emerald-400" },
        { label: "Total Chars", value: totalCharsTyped, icon: Award, color: "text-blue-400" },
        { label: "Errors", value: errors, icon: Clock, color: "text-red-400" },
    ];

    if (!isFinished) {
        return (
            <div className="container mx-auto px-4 py-32 text-center space-y-8">
                <h1 className="text-4xl font-black font-outfit">No Test Completed</h1>
                <p className="text-muted-foreground">Complete a typing session to see your results.</p>
                <Link
                    href={"/practice" as any}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold"
                >
                    Start Practice
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-20 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 text-primary mb-4">
                        <Trophy className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black font-outfit tracking-tight">Great Session!</h1>
                    <p className="text-xl text-muted-foreground">Here is how you performed on the latest news.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center gap-4 text-center"
                        >
                            <div className={`p-4 rounded-2xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-4xl font-black font-outfit">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Insight Card */}
                <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BrainCircuit className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3 text-primary">
                            <BrainCircuit className="w-6 h-6" />
                            <span className="font-bold uppercase tracking-widest text-sm">Typing Insight</span>
                        </div>
                        <h3 className="text-3xl font-black font-outfit">
                            {accuracy > 95 ? "Precision Master" : accuracy > 85 ? "Steady Progress" : "Focus on Accuracy"}
                        </h3>
                        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                            {accuracy > 95
                                ? "Your accuracy is exceptional! To continue improving, try to push your speed just a bit past your comfort zone while maintaining this level of precision."
                                : accuracy > 85
                                    ? "You're finding a good rhythm. Focus on keeping your hands relaxed to reduce the minor errors and watch your WPM naturally climb."
                                    : "You're typing fast, but accuracy is key to building muscle memory. Try slowing down by 10% to focus on hitting every key correctly."}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                        onClick={() => {
                            useTypingStore.getState().repeatArticle();
                            router.push("/practice");
                        }}
                        className="px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all backdrop-blur-xl flex items-center justify-center gap-3"
                    >
                        <Repeat className="w-6 h-6" />
                        Repeat
                    </button>
                    <Link
                        href={"/practice" as any}
                        onClick={resetTest}
                        className="px-10 py-5 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                        <Newspaper className="w-6 h-6" />
                        Next
                    </Link>
                    <Link
                        href={"/dashboard" as any}
                        className="px-10 py-5 bg-white/5 border border-white/10 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-all backdrop-blur-xl flex items-center justify-center gap-3"
                    >
                        <LayoutDashboard className="w-6 h-6" />
                        Dashboard
                    </Link>
                </div>

                <div className="pt-12 text-center text-muted-foreground">
                    Session article: <span className="font-bold text-white italic">"{article?.title}"</span> from {article?.source}
                </div>
            </motion.div>
        </div>
    );
}
