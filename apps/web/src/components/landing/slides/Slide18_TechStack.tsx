"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Tech stack words for the matrix effect
const words = ["NEXT.JS", "REACT", "TURBOPACK", "TYPESCRIPT", "TAILWIND", "FRAMER", "REDIS", "POSTGRESQL", "EDGE", "LLM", "V8", "RUST"];

const MatrixColumn = ({ progress, delay, index }: { progress: MotionValue<number>, delay: number, index: number }) => {
    // Each column falls at slightly different speeds during the scroll window (0.54 to 0.58)
    const yTransform = useTransform(progress, [0.54, 0.58], [-1000 + (delay * 50), 1000 - (delay * 20)]);
    const opacityTransform = useTransform(progress, [0.54, 0.55, 0.57, 0.58], [0, 1, 1, 0]);

    const [randomWords, setRandomWords] = useState<string[]>([]);

    useEffect(() => {
        setRandomWords(Array.from({ length: 20 }).map(() => words[Math.floor(Math.random() * words.length)]));
    }, []);

    // Prevent rendering until hydration is complete to match server
    if (randomWords.length === 0) return null;

    return (
        <motion.div
            style={{ y: yTransform, opacity: opacityTransform, left: `${(index / 15) * 100}%` }}
            className={`flex flex-col gap-4 font-mono font-bold text-sm md:text-xl text-emerald-500/50 absolute top-0`}
        >
            {randomWords.map((word, i) => (
                <span key={i} className={i % 3 === 0 ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,1)]" : "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"}>
                    {word}
                </span>
            ))}
        </motion.div>
    );
};

export function Slide18_TechStack({ progress }: { progress: MotionValue<number> }) {
    // Slide 18 Active: 0.54 to 0.58
    const opacity = useTransform(progress, [0.535, 0.545, 0.575, 0.58], [0, 1, 1, 0]);

    const [delays, setDelays] = useState<number[]>([]);

    useEffect(() => {
        setDelays(Array.from({ length: 15 }).map(() => Math.random() * 10));
    }, []);

    return (
        <motion.div style={{ opacity, zIndex: 27 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#010a05] pointer-events-none overflow-hidden">

            {/* The Matrix Rain Columns based on SCROLL progress (not time) */}
            <div className="absolute inset-0 w-full h-full opacity-60">
                {delays.length > 0 && delays.map((delay, i) => (
                    <MatrixColumn key={i} index={i} delay={delay} progress={progress} />
                ))}
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.9)_70%)] z-10" />

            {/* Content overlay */}
            <div className="z-20 text-center px-6 mix-blend-screen backdrop-blur-sm p-12 border border-emerald-900/50 bg-black/40 rounded-3xl">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
                    BUILT FOR THE <br /> <span className="text-emerald-400">HARDCORE.</span>
                </h2>
                <p className="max-w-lg mx-auto text-emerald-100/50 font-mono text-sm leading-relaxed">
                    Under the hood, it's a Rust-backed V8 isolated environment running Turbopack Edge functions. We engineered it like an HFT trading platform.
                </p>
            </div>

        </motion.div>
    );
}
