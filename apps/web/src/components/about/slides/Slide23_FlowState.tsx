"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide23_FlowState({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.77 to 0.88 in Part 2
    const opacity = useTransform(progress, [0.76, 0.79, 0.86, 0.88], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.76, 0.88], [0.95, 1.05]);

    return (
        <motion.div style={{ opacity, zIndex: 105 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black px-6 pointer-events-none overflow-hidden">

            <motion.div style={{ scale }} className="text-center z-10">
                <span className="text-white/30 text-xs font-mono uppercase tracking-[0.5em] mb-12 block">
                    Phase 4 / Zen
                </span>

                <h2 className="text-[8vw] md:text-[6vw] font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                    FLOW STATE.
                </h2>

                <p className="mt-8 text-xl md:text-2xl font-medium text-white/50 leading-relaxed max-w-2xl mx-auto">
                    A distraction-free zone. No ads. No clutter. Just you, the keyboard, and the words.
                </p>
            </motion.div>

            {/* Mesmerizing ambient background for Flow State */}
            <div className="absolute inset-0 flex items-center justify-center mix-blend-screen opacity-40">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute aspect-square rounded-full border border-white/5"
                        style={{ width: `${30 + i * 15}vw` }}
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{
                            rotate: { duration: 60 + i * 10, repeat: Infinity, ease: "linear" },
                            scale: { duration: 5 + i, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                ))}
            </div>

        </motion.div>
    );
}
