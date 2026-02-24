"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide24_Leaderboard({ progress }: { progress: MotionValue<number> }) {
    // Slide 24 Active: 0.75 to 0.79
    const opacity = useTransform(progress, [0.745, 0.755, 0.785, 0.79], [0, 1, 1, 0]);

    // Cards falling gracefully from the top on scroll
    const y1 = useTransform(progress, [0.75, 0.77], [-1000, 0]);
    const y2 = useTransform(progress, [0.755, 0.775], [-1000, 0]);
    const y3 = useTransform(progress, [0.76, 0.78], [-1000, 0]);

    // Slight scale in depth to give it an Apple physical feel
    const scale1 = useTransform(progress, [0.75, 0.77], [1.5, 1]);
    const scale2 = useTransform(progress, [0.755, 0.775], [1.5, 1.05]);
    const scale3 = useTransform(progress, [0.76, 0.78], [1.5, 1.1]);

    const z1 = useTransform(progress, [0.75, 0.77], [-100, 0]);
    const z2 = useTransform(progress, [0.755, 0.775], [-100, 50]);
    const z3 = useTransform(progress, [0.76, 0.78], [-100, 100]);

    return (
        <motion.div style={{ opacity, zIndex: 33 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#fdfaf5] pointer-events-none overflow-hidden perspective-[1000px]">

            <div className="absolute top-24 z-10 text-center w-full px-6">
                <span className="text-purple-600 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                    Global Ranking
                </span>
                <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight mb-8 font-black">
                    WHO KNOWS MORE?
                </h2>
            </div>

            <div className="relative w-full max-w-4xl h-[600px] flex justify-center mt-32 transform-style-3d">

                {/* Rank 3 Card (Back) */}
                <motion.div
                    style={{ y: y1, scale: scale1, z: z1 }}
                    className="absolute top-0 w-80 bg-white border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-3xl p-6 flex items-center gap-4 z-10 opacity-70"
                >
                    <div className="text-3xl font-black text-slate-300 w-8">3</div>
                    <img src="https://i.pravatar.cc/150?u=a" className="w-16 h-16 rounded-full border-2 border-slate-100" />
                    <div>
                        <div className="font-bold text-slate-900">David C.</div>
                        <div className="text-slate-500 text-sm">342 Day Streak</div>
                    </div>
                </motion.div>

                {/* Rank 2 Card (Middle) */}
                <motion.div
                    style={{ y: y2, scale: scale2, z: z2 }}
                    className="absolute top-24 w-96 bg-white border border-slate-200 shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-3xl p-6 flex items-center gap-4 z-20 opacity-90"
                >
                    <div className="text-4xl font-black text-slate-400 w-10">2</div>
                    <img src="https://i.pravatar.cc/150?u=b" className="w-20 h-20 rounded-full border-2 border-slate-100" />
                    <div>
                        <div className="font-bold text-slate-900 text-xl">Elena M.</div>
                        <div className="text-purple-500 font-bold text-sm">491 Day Streak</div>
                        <div className="text-slate-400 text-xs mt-1">Top 2% Reader</div>
                    </div>
                </motion.div>

                {/* Rank 1 Card (Front) */}
                <motion.div
                    style={{ y: y3, scale: scale3, z: z3 }}
                    className="absolute top-48 w-[450px] bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 shadow-[0_50px_100px_rgba(79,70,229,0.3)] rounded-3xl p-8 flex items-center gap-6 z-30"
                >
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-amber-500 w-12 drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">1</div>
                    <div className="relative">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600 blur animate-pulse" />
                        <img src="https://i.pravatar.cc/150?u=c" className="w-24 h-24 rounded-full border-4 border-indigo-900 relative z-10" />
                    </div>
                    <div>
                        <div className="font-black text-white text-3xl">Alex K.</div>
                        <div className="text-yellow-400 font-bold text-lg mb-1">812 Day Streak</div>
                        <div className="px-3 py-1 bg-white/10 rounded-full text-indigo-200 text-xs font-bold inline-block border border-white/20">Grandmaster Status</div>
                    </div>
                </motion.div>

            </div>

        </motion.div>
    );
}
