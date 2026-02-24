"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide10_GlobalFeed({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.62 to 0.72
    const opacity = useTransform(progress, [0.61, 0.64, 0.69, 0.72], [0, 1, 1, 0]);

    // Parallax scrolling for text marquees
    const marqueeRight = useTransform(progress, [0.61, 0.72], ["0%", "-30%"]);
    const marqueeLeft = useTransform(progress, [0.61, 0.72], ["-30%", "0%"]);

    return (
        <motion.div style={{ opacity, zIndex: 50 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-none">

            <motion.div style={{ x: marqueeRight }} className="whitespace-nowrap flex gap-8 mb-24 opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mix-blend-difference">
                        WORLD NEWS
                    </span>
                ))}
            </motion.div>

            <motion.div style={{ x: marqueeLeft }} className="whitespace-nowrap flex gap-8 mb-24 opacity-20">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} className="text-7xl md:text-9xl font-black text-transparent stroke-text uppercase tracking-tighter" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.5)" }}>
                        TECH UPDATES
                    </span>
                ))}
            </motion.div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4xl w-full text-center px-6 mix-blend-difference">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                    An Infinite Feed.
                </h2>
                <p className="text-xl md:text-2xl text-white/70 font-medium">
                    You aren&apos;t just typing. You are consuming the world&apos;s information stream in real-time. Stay informed at 120 words per minute.
                </p>
            </div>

            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]" />
        </motion.div>
    );
}
