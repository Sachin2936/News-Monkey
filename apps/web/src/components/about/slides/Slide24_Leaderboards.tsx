"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide24_Leaderboards({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.87 to 0.96 in Part 2
    const opacity = useTransform(progress, [0.86, 0.89, 0.94, 0.96], [0, 1, 1, 0]);
    const yOffsets = useTransform(progress, [0.86, 0.96], ["15%", "-15%"]);

    return (
        <motion.div style={{ opacity, zIndex: 110 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent px-6 pointer-events-none">
            <motion.div style={{ y: yOffsets }} className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Abstract Leaderboard UI */}
                <div className="relative h-[500px] w-full bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden perspective-1000 -rotate-2">
                    <div className="text-white/30 text-xs font-mono uppercase tracking-widest mb-4 border-b border-white/5 pb-4">
                        Global Rankings
                    </div>

                    {[
                        { rank: 1, name: "Tanisha", wpm: 100, acc: "99.8%" },
                        { rank: 2, name: "Gaurav", wpm: 100, acc: "98.5%" },
                        { rank: 3, name: "Kundan", wpm: 95, acc: "99.1%" },
                        { rank: 4, name: "Shauraya", wpm: 70, acc: "97.0%" },
                        { rank: 5, name: "TypistZero", wpm: 69, acc: "98.2%" }
                    ].map((row, i) => (
                        <motion.div
                            key={i}
                            className={`flex items-center p-4 rounded-xl border ${i === 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/5'}`}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className={`w-8 font-black ${i === 0 ? 'text-amber-400' : 'text-white/40'}`}>
                                #{row.rank}
                            </div>
                            <div className="flex-1 font-bold text-white ml-4">{row.name}</div>
                            <div className="text-right">
                                <div className="text-emerald-400 font-mono font-bold">{row.wpm} <span className="text-xs text-white/30">WPM</span></div>
                                <div className="text-white/30 text-xs font-mono">{row.acc}</div>
                            </div>
                        </motion.div>
                    ))}

                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
                </div>

                {/* Text Content */}
                <div>
                    <span className="text-amber-400 text-xs font-mono uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                        The Competition
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-amber-200 leading-tight mb-8">
                        Global<br />Leaderboards.
                    </h2>
                    <p className="text-amber-100/60 text-lg md:text-2xl font-medium leading-relaxed max-w-lg mb-8">
                        You aren&apos;t just typing into the void. Compete against the fastest typists on the internet to claim a spot in the Top 10.
                    </p>
                </div>

            </motion.div>
        </motion.div>
    );
}
