"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slides20_22_Reviews({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.48 to 0.78 in Part 2
    const containerOpacity = useTransform(progress, [0.47, 0.50, 0.76, 0.79], [0, 1, 1, 0]);

    // Horizontal scroll across 3 distinct reviews
    const xTransform = useTransform(progress, [0.50, 0.76], ["0%", "-66.66%"]);

    return (
        <motion.div
            style={{ opacity: containerOpacity, zIndex: 100 }}
            className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        >
            <motion.div
                style={{ x: xTransform }}
                // We have 3 slides, so container is 300vw
                className="absolute top-0 left-0 h-full w-[300vw] flex"
            >
                {/* ─── SLIDE 20: Review 1 ─── */}
                <div className="w-[100vw] h-full flex items-center justify-center relative px-6 md:px-24">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/10 blur-[150px] rounded-full" />
                    <div className="max-w-5xl w-full">
                        <span className="text-rose-400 text-xs font-mono uppercase tracking-widest mb-12 block">The Developer</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-12">
                            &quot;I used to type on xyz website, but typing random words got boring and was of no use. But NewsMonkey actually teaches me about the world while I warm up for my coding sessions.&quot;
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20" />
                            <div>
                                <div className="text-white font-black text-xl">Abhishek Sharma</div>
                                <div className="text-white/40 text-sm font-mono">CSE 3rd year Student, Chandigarh Univeristy</div>
                            </div>
                            <div className="ml-auto flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 21: Review 2 ─── */}
                <div className="w-[100vw] h-full flex items-center justify-center relative px-6 md:px-24 border-l border-white/10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full" />
                    <div className="max-w-5xl w-full">
                        <span className="text-cyan-400 text-xs font-mono uppercase tracking-widest mb-12 block">Student</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-12">
                            &quot;The live Reuters integration is flawless. I read the morning headlines by typing them. The adaptive difficulty keeps pushing my WPM ceiling higher.&quot;
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20" />
                            <div>
                                <div className="text-white font-black text-xl">Hiten Dhiman</div>
                                <div className="text-white/40 text-sm font-mono">CSE 4th year Student, Thapar University</div>
                            </div>
                            <div className="ml-auto flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 22: Review 3 ─── */}
                <div className="w-[100vw] h-full flex items-center justify-center relative px-6 md:px-24 border-l border-white/10">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full" />
                    <div className="max-w-5xl w-full">
                        <span className="text-amber-400 text-xs font-mono uppercase tracking-widest mb-12 block">Student</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-12">
                            &quot;This website really helped me lot, the habit of reading and typing news helped me ace my Group-Discussions.&quot;
                        </h2>
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20" />
                            <div>
                                <div className="text-white font-black text-xl">Harsh Saini</div>
                                <div className="text-white/40 text-sm font-mono">CSE 4th year Student, Chandigarh University</div>
                            </div>
                            <div className="ml-auto flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />)}
                            </div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
}
