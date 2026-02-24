"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide05_Shatter({ progress }: { progress: MotionValue<number> }) {
    // Slide 5 Active: 0.125 to 0.16
    const opacity = useTransform(progress, [0.125, 0.13, 0.155, 0.16], [0, 1, 1, 0]);

    // The entire "screen" scales up and rotates away wildly as if broken
    const wrapperScale = useTransform(progress, [0.13, 0.16], [1, 5]);
    const wrapperRotateX = useTransform(progress, [0.13, 0.16], [0, 45]);
    const wrapperRotateZ = useTransform(progress, [0.13, 0.16], [0, -20]);
    const blur = useTransform(progress, [0.14, 0.16], ["blur(0px)", "blur(20px)"]);

    return (
        <motion.div style={{ opacity, zIndex: 14 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black pointer-events-none perspective-[1500px] overflow-hidden">

            <motion.div
                style={{ scale: wrapperScale, rotateX: wrapperRotateX, rotateZ: wrapperRotateZ, filter: blur }}
                className="w-full h-full flex items-center justify-center relative transform-style-3d"
            >
                {/* Simulated broken glass shards flying outward */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        style={{ x: useTransform(progress, [0.13, 0.16], [0, -500]), y: useTransform(progress, [0.13, 0.16], [0, -300]), rotate: useTransform(progress, [0.13, 0.16], [0, -45]) }}
                        className="w-[60vw] h-[40vh] bg-zinc-900 border-r border-b border-white/20 absolute top-0 left-0 flex items-center justify-center drop-shadow-2xl"
                    >
                        <span className="text-white/20 font-black text-9xl">NOISE.</span>
                    </motion.div>

                    <motion.div
                        style={{ x: useTransform(progress, [0.13, 0.16], [0, 500]), y: useTransform(progress, [0.13, 0.16], [0, 400]), rotate: useTransform(progress, [0.13, 0.16], [0, 60]) }}
                        className="w-[70vw] h-[50vh] bg-zinc-800 border-l border-t border-white/20 absolute bottom-0 right-0 flex items-center justify-center drop-shadow-2xl"
                    >
                        <span className="text-white/10 font-black text-8xl">ADS.</span>
                    </motion.div>

                    <div className="absolute z-10 w-32 h-32 bg-white rounded-full blur-[100px] shadow-[0_0_200px_rgba(255,255,255,1)]" />
                </div>
            </motion.div>

            {/* The calm text underneath the shatter that stays perfectly still */}
            <motion.div
                style={{ opacity: useTransform(progress, [0.14, 0.15], [0, 1]) }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-transparent"
            >
                <div className="text-center">
                    <span className="text-zinc-600 font-mono text-xs uppercase tracking-[0.5em] mb-4 block">System Purge Complete</span>
                    <h2 className="text-white text-4xl md:text-6xl font-serif italic tracking-tight font-light">
                        Silence.
                    </h2>
                </div>
            </motion.div>

        </motion.div>
    );
}
