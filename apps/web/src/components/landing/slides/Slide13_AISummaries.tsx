"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide13_AISummaries({ progress }: { progress: MotionValue<number> }) {
    // Slide 13 Active: 0.39 to 0.43
    const opacity = useTransform(progress, [0.385, 0.395, 0.425, 0.43], [0, 1, 1, 0]);

    // The wipe effect acting like a scanner
    const wipeHeight = useTransform(progress, [0.395, 0.42], ["0%", "100%"]);

    // 3D Phone Rotation from lying flat to standing up
    const rotateX = useTransform(progress, [0.395, 0.42], [60, 0]);
    const rotateY = useTransform(progress, [0.395, 0.42], [45, 0]);
    const rotateZ = useTransform(progress, [0.395, 0.42], [-20, 0]);
    const scale = useTransform(progress, [0.395, 0.42], [0.8, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 22 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0a0514] pointer-events-none overflow-hidden">

            <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center justify-center px-6">

                <div className="flex-1 space-y-6">
                    <span className="text-pink-500 font-mono text-xs font-bold uppercase tracking-[0.3em] block">
                        Neural Summarization
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                        TOO LONG;<br />DIDN'T READ.
                    </h2>
                    <p className="text-white/40 text-lg max-w-md">Our AI ingests 5,000-word articles and distills them into 3 perfect bullet points before you even click.</p>
                </div>

                <div className="flex-1 flex justify-center perspective-[1500px]">
                    <motion.div
                        style={{ rotateX, rotateY, rotateZ, scale }}
                        className="relative w-[320px] h-[600px] bg-[#11091f] rounded-[3rem] border-8 border-slate-800 shadow-[20px_50px_100px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col transform-style-3d"
                    >
                        {/* Dynamic Island */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30" />

                        {/* The Messy Article (Background) */}
                        <div className="absolute inset-0 p-8 pt-16 flex flex-col gap-4 opacity-30 blur-[2px]">
                            <div className="w-3/4 h-8 bg-white/20 rounded-md mb-4" />
                            <div className="w-full h-3 bg-white/10 rounded-sm" />
                            <div className="w-full h-3 bg-white/10 rounded-sm" />
                            <div className="w-5/6 h-3 bg-white/10 rounded-sm" />
                            <div className="w-full h-3 bg-white/10 rounded-sm" />
                            <div className="w-4/5 h-3 bg-white/10 rounded-sm" />
                            <div className="w-full h-3 bg-white/10 rounded-sm mt-4" />
                            <div className="w-full h-3 bg-white/10 rounded-sm" />
                            <div className="w-3/4 h-3 bg-white/10 rounded-sm" />
                        </div>

                        {/* The Scanner Line */}
                        <motion.div
                            style={{ top: wipeHeight }}
                            className="absolute left-0 w-full h-1 bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,1)] z-20"
                        />

                        {/* The Clean Summary (Foreground wiping down) */}
                        <motion.div
                            style={{ height: wipeHeight }}
                            className="absolute top-0 left-0 w-full overflow-hidden bg-[#1a0b2e] border-b border-pink-500/50 z-10"
                        >
                            <div className="p-8 pt-16 h-[600px]">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                                        <span className="text-pink-400 font-bold">AI</span>
                                    </div>
                                    <span className="text-white font-bold text-xl">Key Takeaways</span>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-pink-500 shrink-0" />
                                        <p className="text-white/90 text-sm leading-relaxed">The Federal Reserve announced a 0.5% rate cut, the first in four years, signaling economic shift.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-pink-500 shrink-0" />
                                        <p className="text-white/90 text-sm leading-relaxed">Markets rallied immediately, with tech stocks seeing the largest intraday gains since 2023.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-pink-500 shrink-0" />
                                        <p className="text-white/90 text-sm leading-relaxed">Inflation metrics show stabilizing trends across housing and consumer goods sectors.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

            </div>

        </motion.div>
    );
}
