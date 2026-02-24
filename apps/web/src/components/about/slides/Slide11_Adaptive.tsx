"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide11_Adaptive({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.71 to 0.81
    const opacity = useTransform(progress, [0.70, 0.73, 0.78, 0.81], [0, 1, 1, 0]);
    const pathLength = useTransform(progress, [0.73, 0.78], [0, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 55 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent pointer-events-none px-6">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Visualizer */}
                <div className="relative h-[400px] w-full flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 400 300" className="overflow-visible">
                        {/* Base grid */}
                        <path d="M0,50 L400,50 M0,100 L400,100 M0,150 L400,150 M0,200 L400,200 M0,250 L400,250" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                        {/* The adaptive line */}
                        <motion.path
                            d="M0,250 C100,250 150,150 200,150 C250,150 280,50 400,50"
                            stroke="url(#gradient)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            style={{ pathLength }}
                        />

                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#f43f5e" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono">Difficulty</div>
                    <div className="absolute top-4 right-4 text-rose-400 text-xs font-mono font-bold">Max Potential</div>
                </div>

                {/* Content */}
                <div>
                    <span className="text-violet-400 text-xs font-mono uppercase tracking-widest mb-6 block">The Engine</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Adaptive<br />Difficulty.</h2>
                    <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed">
                        The texts you type scale with your skill. As your WPM increases, we pull denser, more complex journalistic pieces to continually push your ceiling.
                    </p>
                </div>

            </div>

            {/* Background glow tied to the graph colors */}
            <div className="absolute top-1/2 left-[25%] -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full -z-10" />
        </motion.div>
    );
}
