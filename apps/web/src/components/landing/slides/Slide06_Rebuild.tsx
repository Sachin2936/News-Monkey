"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide06_Rebuild({ progress }: { progress: MotionValue<number> }) {
    // Act 2 starts: 0.16 to 0.36
    // Slide 6 Active: 0.16 to 0.20
    const opacity = useTransform(progress, [0.16, 0.17, 0.215, 0.22], [0, 1, 1, 0]);

    // Background aggressively fades to blinding white to contrast Act 1
    const bgOpacity = useTransform(progress, [0.165, 0.175], [0, 1]);

    // Typography reveals slowly, very Apple-like easing
    const textY = useTransform(progress, [0.17, 0.19], [50, 0]);
    const textOpacity = useTransform(progress, [0.17, 0.19], [0, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 15 }} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">

            {/* The Blinding White Transition */}
            <motion.div
                style={{ opacity: bgOpacity }}
                className="absolute inset-0 w-full h-full bg-[#f8fafc] z-0"
            />

            <motion.div
                style={{ y: textY, opacity: textOpacity }}
                className="text-center z-10 w-full px-6 flex flex-col items-center justify-center"
            >
                <span className="text-zinc-400 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
                    A New Foundation
                </span>
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                    LET'S FIX <br />
                    <span className="text-emerald-500 italic">THIS.</span>
                </h2>
                <p className="max-w-xl mx-auto text-xl text-slate-500 font-medium mt-8 leading-relaxed">
                    We threw away the legacy engine. Act 2 of your reading experience begins here. Pure signal. Zero noise.
                </p>
            </motion.div>

        </motion.div>
    );
}
