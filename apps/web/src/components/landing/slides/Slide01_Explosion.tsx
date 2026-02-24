"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide01_Explosion({ progress }: { progress: MotionValue<number> }) {
    // Act 1 handles 0.00 to 0.16 roughly (5 slides out of 30)
    // Slide 1 Active: 0.00 to 0.033
    const opacity = useTransform(progress, [0, 0.05, 0.055], [1, 1, 0]);

    // The single pixel dot that explodes
    const dotScale = useTransform(progress, [0, 0.015, 0.025], [0, 1, 200]);
    const dotOpacity = useTransform(progress, [0, 0.015, 0.02], [0, 1, 0]);

    // The text entering immediately after the explosion
    const textScale = useTransform(progress, [0.015, 0.03, 0.05], [5, 1, 1]);
    const textOpacity = useTransform(progress, [0.015, 0.025, 0.045, 0.055], [0, 1, 1, 0]);

    // Dynamic color shifting for that insane Apple/Stripe feel
    const textColor = useTransform(
        progress,
        [0.015, 0.03, 0.045],
        ["#06b6d4", "#ffffff", "#4f46e5"] // Cyan -> White -> Indigo
    );

    // Initial content (Login/Signup & Scroll Indicator) that vanishes immediately
    const initialOpacity = useTransform(progress, [0, 0.005], [1, 0]);

    return (
        <motion.div style={{ opacity, zIndex: 10 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden perspective-[1000px]">

            {/* The Dot */}
            <motion.div
                style={{ scale: dotScale, opacity: dotOpacity }}
                className="absolute w-2 h-2 rounded-full bg-cyan-400"
            />

            {/* The Headline */}
            <motion.h1
                style={{ scale: textScale, opacity: textOpacity, color: textColor }}
                className="text-8xl md:text-[12rem] font-black tracking-tighter uppercase leading-none whitespace-nowrap drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]"
            >
                NewsMonkey
            </motion.h1>

        </motion.div>
    );
}
