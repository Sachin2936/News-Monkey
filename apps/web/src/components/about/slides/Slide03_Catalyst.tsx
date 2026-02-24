"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide03_Catalyst({ progress }: { progress: MotionValue<number> }) {
    // Active 0.11 to 0.19
    const opacity = useTransform(progress, [0.10, 0.14, 0.17, 0.20], [0, 1, 1, 0]);
    const y = useTransform(progress, [0.10, 0.20], [100, -100]);

    return (
        <motion.div style={{ opacity, zIndex: 20 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent px-6 pointer-events-none">
            <motion.div style={{ y }} className="max-w-4xl w-full text-center">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-violet-500 to-rose-500 text-white rounded-full flex items-center justify-center mb-10 shadow-[0_0_60px_rgba(244,63,94,0.4)]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>

                <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40 mb-6 drop-shadow-lg">
                    Enter the Live Feed.
                </h2>
                <p className="text-xl md:text-3xl text-rose-100/50 leading-relaxed font-medium max-w-2xl mx-auto">
                    A real-time synchronization engine that fetches, sanitizes, and streams the latest news directly to your typing field.
                </p>

                {/* Background ambient light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(244,63,94,0.08)_0%,rgba(0,0,0,0)_70%)] -z-10 pointer-events-none mix-blend-screen" />
            </motion.div>
        </motion.div>
    );
}
