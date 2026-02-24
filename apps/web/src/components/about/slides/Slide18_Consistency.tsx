"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide18_Consistency({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.28 to 0.40 in Part 2
    const opacity = useTransform(progress, [0.27, 0.30, 0.37, 0.40], [0, 1, 1, 0]);
    const xOffset = useTransform(progress, [0.27, 0.40], ["10%", "-10%"]);

    return (
        <motion.div style={{ opacity, zIndex: 90 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none px-6">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Heatmap Graphic */}
                <motion.div style={{ x: xOffset }} className="order-2 md:order-1 relative h-[300px] bg-[#0d1117] border border-[#30363d] rounded-xl p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] flex flex-col justify-center">

                    <div className="flex justify-between text-[#8b949e] text-xs font-mono mb-2">
                        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>

                    <div className="flex gap-1">
                        {/* Generate fake columns for heatmap */}
                        {Array.from({ length: 24 }).map((_, col) => (
                            <div key={col} className="flex flex-col gap-1">
                                {Array.from({ length: 7 }).map((_, row) => {
                                    // Randomize colors to simulate git-like streak
                                    const rand = Math.random();
                                    let bg = "bg-[#161b22]";
                                    if (rand > 0.6) bg = "bg-[#0e4429]";
                                    if (rand > 0.8) bg = "bg-[#006d32]";
                                    if (rand > 0.9) bg = "bg-[#26a641]";
                                    if (rand > 0.95) bg = "bg-[#39d353] shadow-[0_0_8px_#39d353]";

                                    return (
                                        <div key={row} className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] ${bg}`} />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Text */}
                <div className="order-1 md:order-2">
                    <span className="text-emerald-400 text-xs font-mono uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        The Streak
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200 leading-tight mb-8">
                        Consistency is everything.
                    </h2>
                    <p className="text-emerald-100/60 text-xl md:text-2xl font-medium leading-relaxed">
                        Track your daily habits. Build a massive streak. A 15-minute daily drill doesn&apos;t just build muscle memory; it wires your brain for sustained focus and faster cognitive translation.
                    </p>
                </div>

            </div>
        </motion.div>
    );
}
