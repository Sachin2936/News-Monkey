"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide15_Ecosystem({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.00 to 0.10 in Part 2 progress
    const opacity = useTransform(progress, [0, 0.03, 0.07, 0.10], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0, 0.10], [0.95, 1.05]);

    return (
        <motion.div style={{ opacity, zIndex: 75 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent pointer-events-none px-6">
            <motion.div style={{ scale }} className="max-w-4xl text-center">

                <span className="text-violet-400 text-sm font-mono uppercase tracking-[0.5em] mb-8 block drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                     The Ecosystem
                </span>

                <h2 className="text-[6vw] md:text-[5vw] font-black tracking-tighter leading-[0.9] text-white">
                    MORE THAN A TEST.
                </h2>

                <p className="mt-8 text-xl md:text-3xl font-medium text-white/50 leading-relaxed max-w-2xl mx-auto">
                    NewsMonkey isn&apos;t just a place you visit once to check your speed. It&apos;s a daily habit-building platform designed for relentless consistency.
                </p>

                {/* Subtle rings radiating out */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 flex items-center justify-center pointer-events-none opacity-20">
                    <motion.div
                        className="absolute w-[400px] h-[400px] rounded-full border border-violet-500/30"
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute w-[400px] h-[400px] rounded-full border border-rose-500/30"
                        animate={{ scale: [1, 2], opacity: [1, 0] }}
                        transition={{ duration: 4, delay: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

            </motion.div>
        </motion.div>
    );
}
