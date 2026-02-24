"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide17_Reader({ progress }: { progress: MotionValue<number> }) {
    // Slide 17 Active: 0.51 to 0.55
    const opacity = useTransform(progress, [0.655, 0.665, 0.71, 0.715], [0, 1, 1, 0]);

    // The Book Folding Effect
    // Left side rotates in (closes like a book)
    const leftFoldRotateY = useTransform(progress, [0.665, 0.71], [0, 110]); // Go slightly past 90 for a "vanished" feel

    // Right side text reveals as the left side folds away
    const rightSideOpacity = useTransform(progress, [0.68, 0.71], [0, 1]);
    const rightSideY = useTransform(progress, [0.68, 0.71], [20, 0]);

    return (
        <motion.div style={{ opacity, zIndex: 26 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#fdfaf5] pointer-events-none overflow-hidden perspective-[2000px]">

            {/* The Book Background Base */}
            <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full bg-[#fdfaf5] shadow-[inset_-20px_0_50px_rgba(0,0,0,0.05)] border-r border-[#eaddc5]" />
                <div className="w-1/2 h-full bg-[#fdfaf5] shadow-[inset_20px_0_50px_rgba(0,0,0,0.05)]" />
            </div>

            {/* The Folding Left Page */}
            <motion.div
                style={{ rotateY: leftFoldRotateY, transformOrigin: "right" }}
                className="absolute left-0 top-0 w-1/2 h-full bg-white shadow-[20px_0_50px_rgba(0,0,0,0.1)] flex items-center justify-center p-12"
            >
                <div className="max-w-md w-full opacity-30 pointer-events-none blur-[1px]">
                    <div className="w-full h-8 bg-zinc-300 rounded mb-6" />
                    <div className="w-full h-4 bg-zinc-200 rounded mb-3" />
                    <div className="w-full h-4 bg-zinc-200 rounded mb-3" />
                    <div className="w-4/5 h-4 bg-zinc-200 rounded mb-3" />
                    <div className="w-11/12 h-4 bg-zinc-200 rounded mb-8" />
                    <div className="w-full h-48 bg-zinc-300 rounded mb-8" />
                    <div className="w-full h-4 bg-zinc-200 rounded mb-3" />
                    <div className="w-full h-4 bg-zinc-200 rounded mb-3" />
                </div>
            </motion.div>

            {/* The Clean Right Page (Reader Mode Focus) */}
            <div className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-center p-12 lg:p-24 z-10">
                <motion.div style={{ opacity: rightSideOpacity, y: rightSideY }} className="max-w-xl w-full">
                    <span className="text-amber-700 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                        Immersive Mode
                    </span>
                    <h2 className="text-5xl lg:text-7xl font-serif text-slate-900 leading-tight mb-8 font-light italic">
                        Like reading a perfectly printed manuscript.
                    </h2>
                    <p className="text-xl text-slate-600 font-serif leading-relaxed">
                        We spent 40+ hours optimizing the line-height, letter-spacing, and ambient color warmth for absolute reading comfort. Zero strain. True focus.
                    </p>
                </motion.div>
            </div>

        </motion.div>
    );
}
