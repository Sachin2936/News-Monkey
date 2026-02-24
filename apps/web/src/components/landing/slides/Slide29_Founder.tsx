"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useMemo } from "react";

export function Slide29_Founder({ progress }: { progress: MotionValue<number> }) {
    // Range: 0.890 → 0.950
    const opacity = useTransform(progress, [0.885, 0.895, 0.945, 0.95], [0, 1, 1, 0]);

    // Background assembly (pulling in from the edges)
    const nodePull = useTransform(progress, [0.895, 0.93], [1.5, 1]);
    const gridRotate = useTransform(progress, [0.895, 0.95], [0, 15]);

    // Holographic flicker timing
    const flickerOpacity = useTransform(progress, [0.91, 0.915, 0.92, 0.925, 0.93], [0, 0.3, 0.1, 0.8, 1]);

    // Biometric HUD lock components
    const ringRotate1 = useTransform(progress, [0.935, 0.95], [0, 360]);
    const ringRotate2 = useTransform(progress, [0.935, 0.95], [0, -180]);
    const hudOpacity = useTransform(progress, [0.935, 0.945], [0, 1]);

    const quote = "Stop dreading current affairs. Stop feeling silent in group discussions. We created NewsMonkey to turn your news anxiety into intellectual dominance.";
    const words = quote.split(" ");

    // Deterministic nodes for the background to avoid hydration mismatch
    const nodes = useMemo(() => [...Array(25)].map((_, i) => ({
        id: i,
        x: (i * 17) % 100,
        y: (i * 23) % 100,
        size: 1 + (i % 3),
        delay: i * 0.1
    })), []);

    return (
        <motion.div
            style={{ opacity, zIndex: 38 }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#02040a] overflow-hidden pointer-events-none"
        >
            {/* Generative Quantum Network Background */}
            <motion.div
                style={{ scale: nodePull, rotate: gridRotate }}
                className="absolute inset-0 opacity-20"
            >
                <svg className="w-full h-full">
                    {nodes.map((node) => (
                        <g key={node.id}>
                            <motion.circle
                                cx={`${node.x}%`}
                                cy={`${node.y}%`}
                                r={node.size}
                                fill="#4f46e5"
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity, delay: node.delay }}
                            />
                            {/* Connect to a few other nodes */}
                            {nodes.slice(node.id + 1, node.id + 3).map((target, j) => (
                                <line
                                    key={j}
                                    x1={`${node.x}%`}
                                    y1={`${node.y}%`}
                                    x2={`${target.x}%`}
                                    y2={`${target.y}%`}
                                    stroke="#4f46e5"
                                    strokeWidth="0.5"
                                    strokeOpacity="0.3"
                                />
                            ))}
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Scanning Grid Layer */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />

            <div className="relative z-20 max-w-5xl px-12 flex flex-col items-center">
                {/* Holographic Quote Assembly */}
                <motion.div
                    style={{ opacity: flickerOpacity }}
                    className="flex flex-wrap justify-center gap-x-3 gap-y-2 mb-20 text-center"
                >
                    {words.map((word, i) => {
                        const start = 0.91 + (i * 0.001);
                        const end = start + 0.005;
                        const wOpacity = useTransform(progress, [start, end], [0, 1]);
                        const wScale = useTransform(progress, [start, end], [1.2, 1]);

                        return (
                            <motion.span
                                key={i}
                                style={{ opacity: wOpacity, scale: wScale }}
                                className="text-3xl md:text-5xl lg:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] shadow-cyan-500/50"
                            >
                                {word}
                            </motion.span>
                        );
                    })}
                </motion.div>

                {/* Biometric Founder HUD */}
                <motion.div
                    style={{ opacity: hudOpacity }}
                    className="relative flex flex-col items-center"
                >
                    {/* Rotating HUD Rings */}
                    <motion.div
                        style={{ rotate: ringRotate1 }}
                        className="absolute -top-12 w-48 h-48 border border-cyan-500/20 rounded-full border-dashed"
                    />
                    <motion.div
                        style={{ rotate: ringRotate2 }}
                        className="absolute -top-8 w-40 h-40 border border-purple-500/20 rounded-full border-dotted"
                    />

                    <div className="flex flex-col items-center gap-4 pt-12">
                        <div className="flex gap-2">
                            {"SACHIN SINGH & GEETANSH GARG".split("").map((char, i) => {
                                const tracking = useTransform(progress, [0.935, 0.95], ["0.1em", "0.5em"]);
                                return (
                                    <motion.span
                                        key={i}
                                        style={{ letterSpacing: tracking }}
                                        className="text-white font-mono text-sm font-bold tracking-widest"
                                    >
                                        {char === " " ? "\u00A0" : char}
                                    </motion.span>
                                );
                            })}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cyan-500" />
                            <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-[0.4em]">Quantum Architects</span>
                            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Data Readout Pillars */}
                <motion.div
                    style={{ opacity: hudOpacity, y: useTransform(progress, [0.93, 0.95], [20, 0]) }}
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 w-full pt-12 border-t border-white/5"
                >
                    <div className="flex flex-col gap-2 group">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">GD Domination</h4>
                        </div>
                        <p className="text-white text-sm font-medium leading-relaxed opacity-60">Leverage real-time counter-arguments fueled by cross-verified global data.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                            <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Interview Pulse</h4>
                        </div>
                        <p className="text-white text-sm font-medium leading-relaxed opacity-60">Master industry context in seconds. Speak with the authority of a subject expert.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <h4 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em]">Cognitive Edge</h4>
                        </div>
                        <p className="text-white text-sm font-medium leading-relaxed opacity-60">Bypass algorithmic traps. Shape your own perspectives with raw, unfiltered truth.</p>
                    </div>
                </motion.div>
            </div>

            {/* Scanning Line overlay */}
            <motion.div
                style={{ y: useTransform(progress, [0.895, 0.95], ["-10vh", "110vh"]) }}
                className="absolute inset-x-0 h-[10vh] bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent z-50 pointer-events-none"
            />
        </motion.div>
    );
}
