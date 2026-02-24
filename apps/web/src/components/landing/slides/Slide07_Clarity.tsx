"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide07_Clarity({ progress }: { progress: MotionValue<number> }) {
    // Slide 7 Active: 0.19 to 0.23
    const opacity = useTransform(progress, [0.215, 0.225, 0.27, 0.275], [0, 1, 1, 0]);

    // Paper peeling effect mapping
    // Peeling layer 1 (top left to bottom right)
    const peel1X = useTransform(progress, [0.225, 0.25], ["0%", "100%"]);
    const peel1Y = useTransform(progress, [0.225, 0.25], ["0%", "100%"]);
    const peel1Rotate = useTransform(progress, [0.225, 0.25], [0, 45]);

    // Peeling layer 2 (bottom right to top left)
    const peel2X = useTransform(progress, [0.225, 0.24], ["0%", "-100%"]);
    const peel2Y = useTransform(progress, [0.225, 0.24], ["0%", "-100%"]);
    const peel2Rotate = useTransform(progress, [0.225, 0.24], [0, -45]);

    return (
        <motion.div style={{ opacity, zIndex: 16 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#f8fafc] pointer-events-none overflow-hidden">

            {/* The Text underneath the peel */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-12">
                <div className="max-w-4xl w-full text-center">
                    <h2 className="text-4xl md:text-7xl font-sans font-black text-slate-800 leading-tight">
                        DESIGNED FOR <br /> ABSOLUTE CLARITY.
                    </h2>
                    <p className="mt-8 text-2xl text-slate-500 font-serif italic">
                        Every pixel serves a purpose. Every typography choice maximizes retention.
                    </p>
                </div>
            </div>

            {/* Top Peeling Layer */}
            <motion.div
                style={{ x: peel1X, y: peel1Y, rotateZ: peel1Rotate }}
                className="absolute inset-0 w-[150vw] h-[150vh] -top-[25vh] -left-[25vw] bg-white border-br-2 shadow-[0_20px_100px_rgba(0,0,0,0.1)] z-30 origin-top-left"
            />

            {/* Bottom Peeling Layer */}
            <motion.div
                style={{ x: peel2X, y: peel2Y, rotateZ: peel2Rotate }}
                className="absolute inset-0 w-[150vw] h-[150vh] top-[25vh] left-[25vw] bg-slate-100/80 backdrop-blur-3xl shadow-[0_-20px_100px_rgba(0,0,0,0.05)] z-20 origin-bottom-right"
            />

        </motion.div>
    );
}
