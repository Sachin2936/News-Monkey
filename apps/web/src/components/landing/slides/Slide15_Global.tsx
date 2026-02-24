"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide15_Global({ progress }: { progress: MotionValue<number> }) {
    // Slide 15 Active: 0.45 to 0.49
    const opacity = useTransform(progress, [0.545, 0.555, 0.60, 0.605], [0, 1, 1, 0]);

    // The globe spins exactly as the user scrolls through this segment
    const rotateY = useTransform(progress, [0.55, 0.605], [0, 360]);

    return (
        <motion.div style={{ opacity, zIndex: 24 }} className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center bg-[#070b19] pointer-events-none overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(56,189,248,0.1)_0%,rgba(0,0,0,0)_60%)]" />

            <div className="flex-1 p-12 md:p-24 z-10 flex flex-col justify-center max-w-2xl">
                <span className="text-sky-400 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-6 block">
                    Global Reach
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
                    10+ SOURCES.<br />ONE FEED.
                </h2>
                <p className="text-xl text-sky-100/50 font-medium leading-relaxed">
                    We ingest from verified journalistic entities globally. If it's real, and it happened, it's on NewsMonkey.
                </p>
                <div className="flex gap-4 mt-12 opacity-80 mix-blend-screen">
                    {/* Abstract brand blocks */}
                    <div className="px-6 py-2 bg-white/10 border border-white/20 rounded font-bold text-white uppercase text-sm">Reuters</div>
                    <div className="px-6 py-2 bg-white/10 border border-white/20 rounded font-bold text-white uppercase text-sm">BBC</div>
                    <div className="px-6 py-2 bg-white/10 border border-white/20 rounded font-bold text-white uppercase text-sm">AP</div>
                </div>
            </div>

            <div className="flex-1 h-full relative flex items-center justify-center transform-style-3d perspective-[1000px] p-12">
                {/* 3D Wireframe Globe Representation built from rotating rings */}
                <motion.div
                    style={{ rotateY, rotateX: 20 }}
                    className="w-[400px] h-[400px] relative transform-style-3d drop-shadow-[0_0_50px_rgba(56,189,248,0.5)]"
                >
                    {[0, 30, 60, 90, 120, 150].map((deg, i) => (
                        <div
                            key={i}
                            style={{ transform: `rotateY(${deg}deg)` }}
                            className="absolute inset-0 border-2 border-sky-500/30 rounded-full"
                        />
                    ))}
                    {[0, 30, 60].map((deg, i) => (
                        <div
                            key={i + 6}
                            style={{ transform: `rotateX(${deg}deg)` }}
                            className="absolute inset-0 border border-sky-400/20 rounded-full"
                        />
                    ))}

                    {/* Glowing pinned nodes floating on the sphere */}
                    <div className="absolute top-[20%] left-[20%] w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)]" style={{ transform: 'translateZ(200px)' }} />
                    <div className="absolute top-[60%] right-[10%] w-3 h-3 rounded-full bg-sky-200 shadow-[0_0_15px_rgba(186,230,253,1)]" style={{ transform: 'translateZ(-150px)' }} />
                    <div className="absolute bottom-[30%] left-[40%] w-5 h-5 rounded-full bg-amber-300 shadow-[0_0_25px_rgba(252,211,77,1)]" style={{ transform: 'translateZ(180px)' }} />
                </motion.div>
            </div>

        </motion.div>
    );
}
