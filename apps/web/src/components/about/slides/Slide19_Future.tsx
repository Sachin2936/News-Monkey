"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide19_Future({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.39 to 0.49 in Part 2
    const opacity = useTransform(progress, [0.38, 0.41, 0.46, 0.49], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.38, 0.49], [0.95, 1.05]);

    return (
        <motion.div style={{ opacity, zIndex: 95 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black px-6 pointer-events-none">
            <motion.div style={{ scale }} className="max-w-4xl text-center">
                <span className="text-white/30 text-xs font-mono uppercase tracking-[0.5em] mb-12 block">
                    Phase 3 / Cognition
                </span>

                <h2 className="text-[6vw] md:text-[5vw] font-black tracking-tighter leading-[0.9] text-white">
                    REWIRE YOUR BRAIN.
                </h2>

                <p className="mt-12 text-2xl md:text-4xl font-medium text-white/50 leading-relaxed max-w-3xl mx-auto">
                    Typing fast isn&apos;t about moving your fingers quickly. It&apos;s about reducing the latency between a thought and its digital execution.
                </p>
                <p className="mt-8 text-xl md:text-2xl font-medium text-violet-400/80 leading-relaxed max-w-2xl mx-auto">
                    Zero friction. Pure output.
                </p>
            </motion.div>
        </motion.div>
    );
}
