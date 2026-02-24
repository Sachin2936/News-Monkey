"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide09_Velocity({ progress }: { progress: MotionValue<number> }) {
    // Slide 9 Active: 0.25 to 0.29
    const opacity = useTransform(progress, [0.27, 0.28, 0.325, 0.33], [0, 1, 1, 0]);

    // Motion blur effects simulating extreme speed flying in from the left
    const text1X = useTransform(progress, [0.28, 0.30], ["-100vw", "0vw"]);
    const blur1 = useTransform(progress, [0.28, 0.30], ["blur(30px)", "blur(0px)"]);
    const skew1 = useTransform(progress, [0.28, 0.30], [-45, 0]);

    // Flying in from the right
    const text2X = useTransform(progress, [0.29, 0.31], ["100vw", "0vw"]);
    const blur2 = useTransform(progress, [0.29, 0.31], ["blur(30px)", "blur(0px)"]);
    const skew2 = useTransform(progress, [0.29, 0.31], [45, 0]);

    return (
        <motion.div style={{ opacity, zIndex: 18 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#050505] pointer-events-none overflow-hidden">

            {/* Dark background heavily contrasting the previous white slide */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05)_0%,rgba(0,0,0,1)_100%)]" />

            <div className="flex flex-col gap-2 w-full max-w-7xl px-12 z-10 w-full overflow-hidden">
                <motion.h2
                    style={{ x: text1X, filter: blur1, skewX: skew1 }}
                    className="text-6xl md:text-9xl font-black text-white italic tracking-tighter w-full text-left"
                >
                    CACHED AT
                </motion.h2>

                <motion.h2
                    style={{ x: text2X, filter: blur2, skewX: skew2 }}
                    className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 italic tracking-tighter w-full text-right"
                >
                    THE EDGE.
                </motion.h2>
            </div>

            <motion.div
                style={{ opacity: useTransform(progress, [0.31, 0.32], [0, 1]) }}
                className="absolute bottom-32 w-full text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-400 font-mono text-sm tracking-widest font-bold">12ms Global Latency</span>
                </div>
            </motion.div>

        </motion.div>
    );
}
