"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide12_Categories({ progress }: { progress: MotionValue<number> }) {
    // Act 3 handles 0.36 to 0.60
    // Slide 12 Active: 0.36 to 0.40
    const opacity = useTransform(progress, [0.405, 0.415, 0.49, 0.495], [0, 1, 1, 0]);

    // Background transition from Zinc Act 2 into deep purple Act 3
    const bgOpacity = useTransform(progress, [0.41, 0.42], [0, 1]);

    // 3D Carousel Rotation based on scroll
    const rotateY = useTransform(progress, [0.41, 0.495], [0, -360]);

    const categories = [
        { label: "Technology", color: "from-blue-400 to-blue-600", angle: 0 },
        { label: "Markets", color: "from-emerald-400 to-emerald-600", angle: 72 },
        { label: "Politics", color: "from-rose-400 to-rose-600", angle: 144 },
        { label: "Science", color: "from-purple-400 to-purple-600", angle: 216 },
        { label: "Culture", color: "from-amber-400 to-amber-600", angle: 288 },
    ];

    return (
        <motion.div style={{ opacity, zIndex: 21 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none perspective-[1200px] overflow-hidden">

            <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 bg-[#0a0514] z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(100,20,150,0.15)_0%,rgba(0,0,0,0)_70%)] z-0" />

            <div className="text-center z-10 w-full px-6 flex flex-col items-center mb-32">
                <span className="text-purple-500 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                    Dynamic Filtering
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mix-blend-screen">
                    CHOOSE YOUR <br /> DIMENSION.
                </h2>
            </div>

            {/* 3D Rotating Carousel */}
            <div className="relative w-full max-w-4xl h-64 flex justify-center items-center transform-style-3d z-20">
                <motion.div
                    style={{ rotateY }}
                    className="w-full h-full absolute transform-style-3d flex justify-center items-center"
                >
                    {categories.map((cat, i) => (
                        <div
                            key={i}
                            style={{ transform: `rotateY(${cat.angle}deg) translateZ(350px)` }}
                            className="absolute w-64 h-80 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-20`} />
                            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${cat.color} mb-6 shadow-2xl`} />
                            <h3 className="text-2xl font-bold text-white relative z-10">{cat.label}</h3>
                        </div>
                    ))}
                </motion.div>
            </div>

        </motion.div>
    );
}
