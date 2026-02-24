"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide25_TechMatrix({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.0 to 0.25 in Part 3
    const opacity = useTransform(progress, [0, 0.05, 0.20, 0.25], [0, 1, 1, 0]);

    // Y parallax for the grid to make it feel like we're flying over it
    const gridY = useTransform(progress, [0, 0.25], [200, -200]);
    // Perspective rotation change based on scroll
    const rotateX = useTransform(progress, [0, 0.25], [60, 45]);

    const techs = [
        { name: "Next.js 14", color: "from-white/20 to-white/5", border: "border-white/20", glow: "rgba(255,255,255,0.2)" },
        { name: "PostgreSQL", color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30", glow: "rgba(59,130,246,0.3)" },
        { name: "Redis Cache", color: "from-red-500/20 to-red-500/5", border: "border-red-500/30", glow: "rgba(239,68,68,0.3)" },
        { name: "Framer Motion", color: "from-fuchsia-500/20 to-fuchsia-500/5", border: "border-fuchsia-500/30", glow: "rgba(217,70,239,0.3)" },
        { name: "Tailwind CSS", color: "from-cyan-500/20 to-cyan-500/5", border: "border-cyan-500/30", glow: "rgba(6,182,212,0.3)" },
        { name: "tRPC", color: "from-blue-600/20 to-blue-600/5", border: "border-blue-600/30", glow: "rgba(37,99,235,0.3)" },
        { name: "WebSockets", color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", glow: "rgba(245,158,11,0.3)" },
        { name: "Prisma ORM", color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", glow: "rgba(16,185,129,0.3)" },
        { name: "Vercel Edge", color: "from-slate-300/20 to-slate-400/5", border: "border-slate-300/30", glow: "rgba(203,213,225,0.3)" },
    ];

    return (
        <motion.div style={{ opacity, zIndex: 120 }} className="absolute inset-0 w-full h-full flex flex-col pointer-events-none overflow-hidden pb-32">

            {/* Header Text */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 text-center w-full px-6 z-20">
                <span className="text-blue-400 text-xs font-mono uppercase tracking-[0.4em] mb-4 block drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                    The Architecture
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200">
                    SUB-50ms LATENCY.
                </h2>
                <p className="mt-6 text-blue-100/60 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                    A modern stack purpose-built for extreme high-throughput keystroke ingestion and global edge delivery.
                </p>
            </div>

            {/* 3D Isometric Grid */}
            <div className="absolute inset-0 flex items-center justify-center mt-32 perspective-1000">
                <motion.div
                    style={{ y: gridY, rotateX, rotateZ: 30 }}
                    className="grid grid-cols-3 gap-4 md:gap-8 w-[800px] h-[800px] transform-style-3d"
                >
                    {techs.map((tech, i) => (
                        <motion.div
                            key={i}
                            className={`relative bg-gradient-to-b ${tech.color} border ${tech.border} backdrop-blur-md flex items-center justify-center rounded-2xl`}
                            style={{ boxShadow: `0 20px 50px -12px ${tech.glow}, inset 0 2px 10px rgba(255,255,255,0.1)` }}
                            initial={{ z: -100, opacity: 0 }}
                            whileInView={{ z: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.8, type: "spring" }}
                            viewport={{ once: false, margin: "-100px" }}
                        >
                            <span className="font-bold text-white text-lg md:text-2xl drop-shadow-md transform -rotate-z-30 origin-center block">
                                {tech.name}
                            </span>

                            {/* Animated glowing border line */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-50"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Background fog to blend edges */}
            <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-[#070211] to-transparent z-10" />

        </motion.div>
    );
}
