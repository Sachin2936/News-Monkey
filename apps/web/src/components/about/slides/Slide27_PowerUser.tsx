"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide27_PowerUser({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.24 to 0.50 in Part 3
    const opacity = useTransform(progress, [0.24, 0.28, 0.46, 0.50], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.24, 0.50], [0.95, 1.05]);

    // Typewriter effect driven by scroll progress
    const typeProgress = useTransform(progress, [0.28, 0.44], [0, 100]);

    return (
        <motion.div style={{ opacity, zIndex: 130 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black px-6 pointer-events-none">
            <motion.div style={{ scale }} className="w-full max-w-5xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-emerald-400 text-xs font-mono uppercase tracking-[0.4em] mb-4 block drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        Power User Mode
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200">
                        NEVER USE A MOUSE.
                    </h2>
                </div>

                {/* CRT Screen */}
                <div className="relative w-full aspect-video bg-[#05100a] rounded-2xl border-4 border-[#1a1b26] p-2 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)]">

                    {/* Inner CRT Glass */}
                    <div className="absolute inset-0 border border-emerald-500/20 rounded-xl" />

                    {/* Scanlines Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-20 mix-blend-overlay opacity-50" />

                    {/* CRT Flicker */}
                    <motion.div
                        className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay z-10 pointer-events-none"
                        animate={{ opacity: [0.05, 0.15, 0.05, 0.1, 0.05] }}
                        transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Vingette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />

                    {/* Terminal Content running on scroll */}
                    <div className="p-8 font-mono text-emerald-400 text-sm md:text-lg h-full flex flex-col justify-end drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">

                        <div className="mb-4">
                            <span className="text-emerald-500 mx-2">monkey@engine:~$</span> ./init_power_mode
                        </div>

                        <div className="text-emerald-300/70 mb-2">
                            Loading keyboard shortcuts...
                        </div>

                        {/* Fake commands appearing based on scroll */}
                        <div className="flex flex-col gap-2">
                            <CodeLine progress={typeProgress} threshold={10} cmd="cmd + k" desc="Open universal command palette" />
                            <CodeLine progress={typeProgress} threshold={30} cmd="tab + enter" desc="Restart current typing session" />
                            <CodeLine progress={typeProgress} threshold={50} cmd="esc" desc="Bail out of run, view heatmaps" />
                            <CodeLine progress={typeProgress} threshold={70} cmd="cmd + shift + p" desc="Toggle Live Feed News ingestion" />
                            <CodeLine progress={typeProgress} threshold={90} cmd="alt + z" desc="Enter Zen Mode (Hide UI)" />
                        </div>

                        <div className="mt-4 flex items-center">
                            <span className="text-emerald-500 mx-2">monkey@engine:~$</span>
                            <motion.div
                                className="w-2 h-5 bg-emerald-400 ml-2"
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                            />
                        </div>

                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
}

// Child component to handle the scroll-based reveal of terminal lines
function CodeLine({ progress, threshold, cmd, desc }: { progress: MotionValue<number>, threshold: number, cmd: string, desc: string }) {
    const opacity = useTransform(progress, [threshold, threshold + 5], [0, 1]);

    return (
        <motion.div style={{ opacity }} className="flex">
            <span className="text-emerald-200 bg-emerald-900/40 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.3)]">{cmd}</span>
            <span className="text-emerald-500 mx-4">---</span>
            <span className="text-emerald-100">{desc}</span>
        </motion.div>
    );
}
