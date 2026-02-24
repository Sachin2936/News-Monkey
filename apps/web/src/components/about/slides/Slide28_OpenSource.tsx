"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide28_OpenSource({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.49 to 0.75 in Part 3
    const opacity = useTransform(progress, [0.48, 0.52, 0.71, 0.75], [0, 1, 1, 0]);
    // The globe explodes outwards at the end of its active sequence
    const explodeScale = useTransform(progress, [0.65, 0.72], [1, 30]);
    const explodeOpacity = useTransform(progress, [0.65, 0.72], [1, 0]);

    return (
        <motion.div style={{ opacity, zIndex: 135 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent px-6 pointer-events-none overflow-hidden">

            <div className="text-center z-20 max-w-4xl">
                <span className="text-cyan-400 text-xs font-mono uppercase tracking-[0.4em] mb-6 block drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    The Movement
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-200 leading-none">
                    100% OPEN SOURCE.
                </h2>
                <p className="mt-8 text-cyan-100/60 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
                    A global network of developers contributing to the core engine. No paywalls. No premium tiers. The fastest typing platform on earth belongs to everyone.
                </p>
            </div>

            {/* Particle Sphere Container */}
            <motion.div
                style={{ scale: explodeScale, opacity: explodeOpacity }}
                className="absolute inset-0 flex items-center justify-center -z-10"
            >
                {/* 
                    Fake 3D Sphere created by rotating circular tracks in 3D space.
                    We use framer-motion to spin the entire system.
                */}
                <motion.div
                    className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] transform-style-3d"
                    animate={{ rotateX: 360, rotateY: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    {/* Track 1 */}
                    <div className="absolute inset-0 border-[0.5px] border-cyan-500/20 rounded-full" style={{ transform: "rotateY(0deg)" }}>
                        <Particle delay={0} />
                        <Particle delay={2} />
                    </div>
                    {/* Track 2 */}
                    <div className="absolute inset-0 border-[0.5px] border-cyan-500/20 rounded-full" style={{ transform: "rotateY(45deg)" }}>
                        <Particle delay={1} />
                        <Particle delay={3} />
                    </div>
                    {/* Track 3 */}
                    <div className="absolute inset-0 border-[0.5px] border-cyan-500/20 rounded-full" style={{ transform: "rotateY(90deg)" }}>
                        <Particle delay={0.5} />
                        <Particle delay={2.5} />
                    </div>
                    {/* Track 4 */}
                    <div className="absolute inset-0 border-[0.5px] border-cyan-500/20 rounded-full" style={{ transform: "rotateY(135deg)" }}>
                        <Particle delay={1.5} />
                        <Particle delay={3.5} />
                    </div>
                    {/* Track 5 (Horizontal) */}
                    <div className="absolute inset-0 border-[0.5px] border-cyan-500/20 rounded-full" style={{ transform: "rotateX(90deg)" }}>
                        <Particle delay={0.2} />
                        <Particle delay={2.2} />
                    </div>
                </motion.div>

                {/* Ambient Center Core */}
                <div className="absolute w-32 h-32 bg-cyan-500/30 rounded-full blur-[60px]" />
            </motion.div>

        </motion.div>
    );
}

// Single glowing particle that animates around its circular track
function Particle({ delay }: { delay: number }) {
    return (
        <motion.div
            className="absolute top-0 right-1/2 w-4 h-4 -mt-2 -mr-2 bg-white rounded-full shadow-[0_0_20px_rgba(34,211,238,1)]"
            animate={{ rotate: 360 }}
            style={{ transformOrigin: "50% 150px" }} // Default to mobile radius
            transition={{ duration: 4, delay, repeat: Infinity, ease: "linear" }}
        />
    );
}
