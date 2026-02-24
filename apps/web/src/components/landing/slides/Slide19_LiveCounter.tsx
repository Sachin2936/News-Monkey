"use client";

import { motion, MotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Slide19_LiveCounter({ progress }: { progress: MotionValue<number> }) {
    // Act 4 handles 0.60 to 0.80
    // Slide 19 Active: 0.60 to 0.64
    const opacity = useTransform(progress, [0.71, 0.72, 0.765, 0.77], [0, 1, 1, 0]);

    // Counter triggers
    const countRef = useRef<HTMLHeadingElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        return progress.on("change", (latest) => {
            if (latest > 0.715 && latest < 0.77 && !isVisible) {
                setIsVisible(true);
            } else if ((latest <= 0.715 || latest >= 0.77) && isVisible) {
                setIsVisible(false);
            }
        });
    }, [progress, isVisible]);

    useEffect(() => {
        if (isVisible) {
            animate(0, 1420593, { duration: 3, ease: "easeOut", onUpdate: (v) => countRef.current && (countRef.current.textContent = Math.round(v).toLocaleString()) });
        } else {
            if (countRef.current) countRef.current.textContent = "0";
        }
    }, [isVisible]);

    // Typography overflows the screen intentionally and slightly scrolls horizontally
    const textX = useTransform(progress, [0.715, 0.77], ["10%", "-10%"]);

    return (
        <motion.div style={{ opacity, zIndex: 28 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#ea580c] pointer-events-none overflow-hidden">

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-multiply" />

            {/* Massive scrolling counter text */}
            <motion.div style={{ x: textX }} className="w-[150vw] flex items-center justify-center pointer-events-none whitespace-nowrap">
                <h2
                    ref={countRef}
                    className="text-[15rem] md:text-[25rem] font-black text-[#511c00] tracking-tighter mix-blend-color-burn"
                >
                    0
                </h2>
            </motion.div>

            {/* Foreground Context Text */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center">
                <div className="bg-[#511c00] text-orange-50 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm mb-4">Live Analytics</div>
                <h3 className="text-white text-5xl md:text-7xl font-black uppercase italic drop-shadow-2xl">
                    ARTICLES <br /> SUMMARIZED.
                </h3>
            </div>

        </motion.div>
    );
}
