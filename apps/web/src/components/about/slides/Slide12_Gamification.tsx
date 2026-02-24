"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide12_Gamification({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.80 to 0.90
    const opacity = useTransform(progress, [0.79, 0.82, 0.87, 0.90], [0, 1, 1, 0]);

    // Staggered Y reveals for badges
    const y1 = useTransform(progress, [0.81, 0.86], [100, -50]);
    const y2 = useTransform(progress, [0.82, 0.87], [150, -20]);
    const y3 = useTransform(progress, [0.83, 0.88], [200, 10]);

    return (
        <motion.div style={{ opacity, zIndex: 60 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black pointer-events-none px-6">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Content */}
                <div className="z-10">
                    <span className="text-amber-400 text-xs font-mono uppercase tracking-[0.4em] mb-6 block">Proof of Work</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                        Earn your rank.
                    </h2>
                    <p className="text-white/50 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
                        Climb the global leaderboard. Unlock achievements. Participate in daily quests. Typing is a skill, and here, you get rewarded for mastering it.
                    </p>
                </div>

                {/* Floating Badges */}
                <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000">

                    <motion.div
                        style={{ y: y1 }}
                        className="absolute left-[10%] top-[20%] w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-amber-400 to-orange-600 rounded-3xl rotate-12 flex items-center justify-center border-4 border-white/20 shadow-[0_20px_50px_rgba(245,158,11,0.5)]"
                    >
                        <span className="font-black text-4xl text-white drop-shadow-md">100<br /><span className="text-xl">WPM</span></span>
                    </motion.div>

                    <motion.div
                        style={{ y: y2 }}
                        className="absolute left-[40%] top-[40%] z-20 w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full -rotate-6 flex items-center justify-center border-4 border-white/20 shadow-[0_20px_50px_rgba(139,92,246,0.5)]"
                    >
                        <svg className="w-16 h-16 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </motion.div>

                    <motion.div
                        style={{ y: y3 }}
                        className="absolute right-[5%] top-[10%] w-28 h-28 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl -rotate-12 flex items-center justify-center border-4 border-white/20 shadow-[0_20px_50px_rgba(59,130,246,0.5)]"
                    >
                        <span className="font-black text-2xl text-white drop-shadow-md tracking-tighter">GLOBAL<br />TOP 1%</span>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
}
