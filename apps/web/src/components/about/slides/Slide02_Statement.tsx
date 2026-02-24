"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide02_Statement({ progress }: { progress: MotionValue<number> }) {
    // Active from roughly 0.05 to 0.13
    const opacity = useTransform(progress, [0.04, 0.07, 0.11, 0.14], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.04, 0.14], [0.95, 1.05]);

    // Text reveal magic based on scroll within this section
    const rawProgress = useTransform(progress, [0.05, 0.12], [0, 1]);

    const words = "Traditional typing tests are fundamentally broken. They force you to memorize static dictionaries or type outdated public domain texts. We rebuilt the entire pipeline from scratch.".split(" ");

    return (
        <motion.div style={{ opacity, zIndex: 10 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center px-6 md:px-24 pointer-events-none">
            <motion.div style={{ scale }} className="max-w-6xl w-full">
                <span className="block text-rose-500 text-xs md:text-sm font-black uppercase tracking-[0.4em] mb-12 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                    02 / The Problem
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white/10">
                    {words.map((word, i) => {
                        const start = i / words.length;
                        const end = start + (1 / words.length);
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const wordOpacity = useTransform(rawProgress, [start, end], [0.05, 1]);
                        return (
                            <motion.span
                                key={i}
                                style={{ opacity: wordOpacity }}
                                className="inline-block mr-[0.25em] text-transparent bg-clip-text bg-gradient-to-br from-violet-200 to-rose-200 drop-shadow-lg"
                            >
                                {word}
                            </motion.span>
                        );
                    })}
                </h2>
            </motion.div>
        </motion.div>
    );
}
