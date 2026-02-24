"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide08_Arena({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.44 to 0.54
    const opacity = useTransform(progress, [0.43, 0.46, 0.51, 0.54], [0, 1, 1, 0]);
    // Start small, scale up slightly as you scroll past
    const scale = useTransform(progress, [0.43, 0.54], [0.9, 1.05]);

    return (
        <motion.div style={{ opacity, zIndex: 40 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent pointer-events-none px-6">
            <motion.div style={{ scale }} className="text-center w-full max-w-6xl">
                <span className="text-white/20 text-xs font-mono uppercase tracking-[0.4em] mb-12 block">
                    The Destination
                </span>

                <h2 className="text-[10vw] md:text-[8vw] font-black tracking-tighter leading-[0.8] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-16">
                    THE ARENA.
                </h2>

                {/* Abstract UI representation */}
                <div className="w-full h-[40vh] md:h-[50vh] bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative backdrop-blur-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">

                    {/* Glowing cursor bar */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-white/20 blur-[10px]" />

                    <div className="flex gap-4 mb-16 opacity-30">
                        <div className="w-12 h-4 rounded-full bg-rose-500" />
                        <div className="w-24 h-4 rounded-full bg-white/20" />
                        <div className="w-16 h-4 rounded-full bg-white/20" />
                    </div>

                    {/* Simulated typing text */}
                    <p className="text-2xl md:text-5xl font-mono text-white/30 leading-relaxed text-center max-w-4xl mx-auto">
                        <span className="text-white/80">The future is in your hands, use your fingers, type daily, read daily, learn daily</span>
                        <span className="relative inline-block ml-4">
                            
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                                className="absolute -right-2 top-0 bottom-0 w-1 bg-rose-500"
                            />
                        </span>
                        <span>_</span>
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
