"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide16_Bias({ progress }: { progress: MotionValue<number> }) {
    // Slide 16 Active: 0.48 to 0.52
    const opacity = useTransform(progress, [0.60, 0.61, 0.655, 0.66], [0, 1, 1, 0]);

    // The scale tips back and forth, then finds perfect balance right in the middle around 0.50
    const rotateZ = useTransform(
        progress,
        [0.61, 0.62, 0.63, 0.64, 0.65],
        [-15, 10, 0, 0, 0] // Stabilizes at 0
    );

    // Left plate drops heavily then rises to center
    const leftY = useTransform(progress, [0.61, 0.62, 0.63], [100, -50, 0]);

    // Right plate rises heavily then drops to center
    const rightY = useTransform(progress, [0.61, 0.62, 0.63], [-100, 50, 0]);

    // The glow that appears ONLY when balanced
    const balancedGlow = useTransform(progress, [0.625, 0.635], [0, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 25 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#0f172a] pointer-events-none overflow-hidden">

            <div className="text-center z-10 w-full px-6 flex flex-col items-center mb-24">
                <h2 className="text-5xl md:text-7xl font-sans font-black text-slate-100 tracking-tighter">
                    THE BIAS ENGINE.
                </h2>
                <p className="mt-6 text-xl text-slate-400 font-medium max-w-2xl mx-auto">
                    News is inherently slanted. Our AI weighs the emotional language, cross-references sources, and finds the perfect center.
                </p>
            </div>

            {/* The Animated Physical Scale */}
            <div className="relative w-full max-w-3xl h-64 flex justify-center items-center mt-20">

                {/* The Central Pillar */}
                <div className="absolute bottom-0 w-4 h-64 bg-slate-700 rounded-t-lg z-0">
                    <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-slate-500 shadow-xl" />
                </div>

                {/* The Beam */}
                <motion.div
                    style={{ rotateZ }}
                    className="absolute top-0 w-full h-3 bg-slate-600 rounded-full z-10 flex justify-between items-end pb-3 origin-center"
                >
                    {/* Left Plate (Leaning Left Wing/Bias 1) */}
                    <div className="relative">
                        <div className="absolute w-1 h-32 bg-slate-600 -top-0 -left-6 transform -rotate-12 transform-origin-top" />
                        <div className="absolute w-1 h-32 bg-slate-600 -top-0 left-6 transform rotate-12 transform-origin-top" />
                        <motion.div style={{ y: leftY }} className="absolute top-32 -left-16 w-32 h-6 bg-rose-500/80 rounded-full border border-rose-400 shadow-[0_10px_30px_rgba(244,63,94,0.5)] flex items-center justify-center">
                            <span className="absolute -top-10 text-rose-300 font-bold">Emotion</span>
                        </motion.div>
                    </div>

                    {/* Right Plate (Leaning Right Wing/Bias 2) */}
                    <div className="relative">
                        <div className="absolute w-1 h-32 bg-slate-600 -top-0 -left-6 transform -rotate-12 transform-origin-top" />
                        <div className="absolute w-1 h-32 bg-slate-600 -top-0 left-6 transform rotate-12 transform-origin-top" />
                        <motion.div style={{ y: rightY }} className="absolute top-32 -left-16 w-32 h-6 bg-blue-500/80 rounded-full border border-blue-400 shadow-[0_10px_30px_rgba(59,130,246,0.5)] flex items-center justify-center">
                            <span className="absolute -top-10 text-blue-300 font-bold">Rhetoric</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* The Balanced Glow indicating perfect truth finding */}
                <motion.div
                    style={{ opacity: balancedGlow }}
                    className="absolute top-0 w-32 h-32 bg-emerald-400 rounded-full blur-[60px] z-0 pointer-events-none"
                />
            </div>

            <motion.div style={{ opacity: balancedGlow }} className="mt-32 border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 rounded-full text-emerald-400 font-bold uppercase tracking-widest text-sm backdrop-blur-md">
                Equilibrium Reached
            </motion.div>

        </motion.div>
    );
}
