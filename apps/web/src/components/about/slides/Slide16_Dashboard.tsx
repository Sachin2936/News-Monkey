"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide16_Dashboard({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.09 to 0.19 in Part 2
    const opacity = useTransform(progress, [0.08, 0.11, 0.16, 0.19], [0, 1, 1, 0]);
    const yOffsets = useTransform(progress, [0.08, 0.19], ["10%", "-10%"]);

    return (
        <motion.div style={{ opacity, zIndex: 80 }} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none px-6">
            <motion.div style={{ y: yOffsets }} className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div>
                    <span className="text-cyan-400 text-xs font-mono uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                        The Command Center
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-200 leading-tight mb-8">
                        Total<br />Visibility.
                    </h2>
                    <p className="text-cyan-100/60 text-xl md:text-2xl font-medium leading-relaxed max-w-lg mb-8">
                        Your personal dashboard tracks everything. WPM trends over the last 30 days, accuracy heatmaps across different news categories, and a detailed breakdown of your most troubled keystrokes.
                    </p>
                </div>

                {/* Abstract Glass Dashboard Graphic */}
                <div className="relative h-[500px] w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col gap-6 backdrop-blur-md shadow-[0_30px_100px_rgba(34,211,238,0.1)] overflow-hidden perspective-1000">

                    {/* Fake Header */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                        </div>
                        <div className="w-32 h-4 bg-white/5 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-6 flex-1">
                        {/* Big Stat Box */}
                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 p-6 flex flex-col justify-between">
                            <div className="text-white/30 text-xs uppercase tracking-widest font-mono">Avg Speed</div>
                            <div className="text-6xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                                124 <span className="text-xl text-white/20">WPM</span>
                            </div>
                        </div>

                        {/* Bar Chart Box */}
                        <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 p-6 flex items-end gap-3">
                            {[40, 60, 45, 80, 50, 95].map((height, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-violet-500/50 rounded-t-sm"
                                    style={{ height: `${height}%` }}
                                    initial={{ scaleY: 0 }}
                                    whileInView={{ scaleY: 1 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                />
                            ))}
                        </div>

                        {/* Wide Box */}
                        <div className="col-span-2 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 p-6 relative overflow-hidden">
                            <div className="text-white/30 text-xs uppercase tracking-widest font-mono mb-4">Accuracy Trend</div>
                            <svg className="w-full h-24" viewBox="0 0 400 100" preserveAspectRatio="none">
                                <motion.path
                                    d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,30"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-emerald-400"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    viewport={{ once: true }}
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Ambient glow inside dashboard */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full -z-10" />
                </div>

            </motion.div>
        </motion.div>
    );
}
