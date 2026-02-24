"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide17_Badges({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.18 to 0.30 in Part 2
    const opacity = useTransform(progress, [0.17, 0.20, 0.27, 0.30], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.17, 0.30], [0.9, 1.1]);

    return (
        <motion.div style={{ opacity, zIndex: 85 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none px-6">
            <div className="max-w-5xl w-full text-center mb-16">
                <span className="text-amber-400 text-xs font-mono uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                    Progression System
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-200 leading-tight">
                    Earn Your Rank.
                </h2>
                <p className="mt-6 text-amber-100/50 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                    Start as a Novice, grind to Grandmaster. Unlock prestigious animated badges to display next to your name on the global leaderboards.
                </p>
            </div>

            <motion.div style={{ scale }} className="flex flex-wrap justify-center gap-8 md:gap-16 perspective-1000">

                {/* Bronze / Novice */}
                <div className="relative group perspective-1000">
                    <motion.div
                        className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-[#CD7F32] to-[#704214] border-4 border-white/10 shadow-[0_20px_50px_rgba(205,127,50,0.3)] flex items-center justify-center"
                        animate={{ rotateY: [0, 10, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="font-mono text-xl font-bold text-white/80">NOVICE</span>
                    </motion.div>
                </div>

                {/* Gold / Expert */}
                <div className="relative group perspective-1000 -mt-8 md:-mt-12 z-10">
                    <motion.div
                        className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 border-4 border-yellow-200/50 shadow-[0_30px_60px_rgba(245,158,11,0.5)] flex items-center justify-center relative overflow-hidden"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent w-[200%] h-full -left-[100%] animate-[sweep_2s_ease-in-out_infinite]" />
                        <span className="font-black text-3xl md:text-4xl text-white drop-shadow-xl tracking-tighter">EXPERT</span>
                    </motion.div>
                </div>

                {/* Grandmaster */}
                <div className="relative group perspective-1000">
                    <motion.div
                        className="w-32 h-32 md:w-40 md:h-40 rounded-lg rotate-45 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 border-4 border-white/20 shadow-[0_20px_50px_rgba(139,92,246,0.4)] flex items-center justify-center"
                        animate={{ rotateZ: [45, 55, 35, 45] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="font-mono text-xl md:text-2xl font-black text-white -rotate-45 drop-shadow-md">GM</span>
                    </motion.div>
                </div>

            </motion.div>
        </motion.div>
    );
}
