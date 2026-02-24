"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/useTypingStore';
import { Zap, Target, Clock, AlertCircle } from 'lucide-react';

export default function PracticeStats() {
    const {
        wpm,
        accuracy,
        errors,
        duration,
        isActive,
        isPaused,
        isFinished,
        finishTest,
        focusMode,
        timeLeft,
        setTimeLeft,
        showLiveWpm,
    } = useTypingStore();


    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && !isPaused && !isFinished && timeLeft > 0) {
            interval = setInterval(() => {
                const newTime = timeLeft - 1;
                if (newTime <= 0) {
                    setTimeLeft(0);
                    finishTest();
                } else {
                    setTimeLeft(newTime);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, isPaused, isFinished, timeLeft, finishTest, setTimeLeft]);

    const allStats = [
        { label: 'WPM', value: wpm, icon: Zap, color: 'text-yellow-400' },
        { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: 'text-emerald-400' },
        { label: 'Errors', value: errors, icon: AlertCircle, color: 'text-red-400' },
    ];
    const stats = showLiveWpm ? allStats : allStats.filter(s => s.label !== 'WPM');


    return (
        <div className={`w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between transition-all duration-700 ${focusMode && isActive && !isPaused ? 'opacity-0 scale-95 pointer-events-none mb-0 h-0 overflow-hidden' : 'opacity-100 mb-4'
            }`}>
            <div className="flex gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-4 min-w-[120px]"
                    >
                        <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-bold font-outfit">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Timer Display */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="px-6 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-2xl flex items-center gap-4 shadow-lg shadow-primary/5"
            >
                <div className="p-2 rounded-full bg-primary/20 text-primary animate-pulse">
                    <Clock className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 leading-none mb-1">Time Left</span>
                    <span className="text-2xl font-black font-outfit leading-none">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
