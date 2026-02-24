"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide14_Manifesto({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.96 to 0.99
    const opacity = useTransform(progress, [0.95, 0.97, 0.98, 0.99], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.95, 0.99], [0.95, 1.05]);

    return (
        <motion.div style={{ opacity, zIndex: 70 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black px-6 pointer-events-none">
            <motion.div style={{ scale }} className="max-w-4xl text-center">
                <span className="text-white/30 text-xs font-mono uppercase tracking-[0.5em] mb-12 block">
                     The Manifesto
                </span>

                <h2 className="text-[6vw] md:text-[5vw] font-black tracking-tighter leading-[0.9] text-white">
                    TYPE WHAT MATTERS.
                </h2>

                <p className="mt-12 text-2xl md:text-4xl font-medium text-white/50 leading-relaxed max-w-3xl mx-auto">
                    A machine learning engineer typing Shakespeare makes no sense. A day trader typing public domain poetry makes no sense. You learn by doing what you do.
                </p>
            </motion.div>
        </motion.div>
    );
}
