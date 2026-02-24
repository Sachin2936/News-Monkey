"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide23_Gamification({ progress }: { progress: MotionValue<number> }) {
    // Slide 23 Active: 0.72 to 0.76
    const opacity = useTransform(progress, [0.715, 0.725, 0.755, 0.76], [0, 1, 1, 0]);

    // The progress bar filling up the viewport borders
    const topWidth = useTransform(progress, [0.72, 0.73], ["0%", "100%"]);
    const rightHeight = useTransform(progress, [0.73, 0.74], ["0%", "100%"]);
    const bottomWidth = useTransform(progress, [0.74, 0.75], ["0%", "100%"]);
    const leftHeight = useTransform(progress, [0.75, 0.76], ["0%", "100%"]);

    // Inside center text fills with color as the borders complete
    const textFill = useTransform(progress, [0.72, 0.76], ["0%", "100%"]);

    return (
        <motion.div style={{ opacity, zIndex: 32 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#070b19] pointer-events-none overflow-hidden p-6 md:p-12">

            {/* The Checkered Background Map */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* The Border Progress Bars */}
            <div className="absolute inset-4 md:inset-8 ring-1 ring-white/10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.1)]">

                {/* Top Border */}
                <motion.div style={{ width: topWidth }} className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)]" />

                {/* Right Border */}
                <motion.div style={{ height: rightHeight }} className="absolute top-0 right-0 w-2 bg-gradient-to-b from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)]" />

                {/* Bottom Border */}
                <motion.div style={{ width: bottomWidth }} className="absolute bottom-0 right-0 h-2 bg-gradient-to-l from-purple-500 to-pink-500 shadow-[0_0_20px_rgba(236,72,153,1)]" />

                {/* Left Border */}
                <motion.div style={{ height: leftHeight }} className="absolute bottom-0 left-0 w-2 bg-gradient-to-t from-pink-500 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,1)]" />

            </div>

            <div className="relative z-10 text-center">
                <span className="text-blue-400 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
                    Engagement System
                </span>

                <h2 className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r relative inline-block pb-4 border-white/20"
                    style={{ WebkitTextStroke: "2px rgba(255,255,255,0.1)" }}>
                    {/* Ghost Text */}
                    LEVEL UP.

                    {/* The fill text */}
                    <motion.span
                        className="absolute top-0 left-0 w-full h-full text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 overflow-hidden"
                        style={{ width: textFill, WebkitTextStroke: "0px" }}
                    >
                        LEVEL UP.
                    </motion.span>
                </h2>

                <p className="mt-8 text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
                    Reading news shouldn't feel like a chore. Build your streak. Earn badges. Conquer the leaderboard by staying informed perfectly.
                </p>

                <div className="mt-12 flex gap-8 md:gap-16 justify-center items-end">
                    {/* Player 2 */}
                    <div className="flex flex-col items-center gap-3 mb-2 md:mb-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 border-2 border-slate-700 bg-[url('https://i.pravatar.cc/150?u=arjun')] bg-cover grayscale opacity-60 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
                        <span className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">Arjun</span>
                    </div>

                    {/* Player 1 (Center Leader) */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-slate-900 border-4 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)] bg-[url('https://i.pravatar.cc/150?u=sachin')] bg-cover relative z-10 transition-transform duration-500 hover:scale-105">
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-black text-xs md:text-sm px-4 py-1.5 rounded-full border-2 border-[#070b19] shadow-lg whitespace-nowrap">Lvl 99</div>
                        </div>
                        <span className="text-base md:text-xl text-blue-400 font-black uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] mt-2">Sachin</span>
                    </div>

                    {/* Player 3 */}
                    <div className="flex flex-col items-center gap-3 mb-2 md:mb-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-900 border-2 border-slate-700 bg-[url('https://i.pravatar.cc/150?u=anjali')] bg-cover grayscale opacity-60 transition-all duration-500 hover:grayscale-0 hover:opacity-100" />
                        <span className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest">Anjali</span>
                    </div>
                </div>
            </div>

        </motion.div>
    );
}
