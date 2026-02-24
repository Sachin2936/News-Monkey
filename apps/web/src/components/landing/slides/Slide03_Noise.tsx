"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { X, Lock, PlayCircle, MousePointerClick } from "lucide-react";

export function Slide03_Noise({ progress }: { progress: MotionValue<number> }) {
    // Slide 3 Active: 0.06 to 0.10
    const opacity = useTransform(progress, [0.105, 0.115, 0.16, 0.165], [0, 1, 1, 0]);

    // Z-axis vibration and chaos mapping
    const chaosLevel = useTransform(progress, [0.11, 0.16], [0, 1]); // 0 to 1 intensity
    const zScale = useTransform(chaosLevel, [0, 1], [0.8, 1.5]);

    // Red tint increasing as the chaos escalates
    const bgTint = useTransform(progress, [0.12, 0.16], ["#050505", "#1a0505"]);

    return (
        <motion.div style={{ opacity, zIndex: 12, backgroundColor: bgTint }} className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none overflow-hidden perspective-[1200px]">

            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
                <motion.h2
                    style={{ scale: zScale, opacity: useTransform(progress, [0.115, 0.12], [0, 1]) }}
                    className="text-white text-6xl md:text-9xl font-black uppercase text-center mix-blend-overlay z-50 tracking-tighter"
                >
                    The Old Web<br />Is Broken.
                </motion.h2>
            </div>

            {/* Floating Ads and Paywalls */}
            <motion.div
                style={{
                    rotateX: useTransform(progress, [0.11, 0.16], [20, -20]),
                    rotateY: useTransform(progress, [0.11, 0.16], [-10, 10]),
                    z: useTransform(progress, [0.11, 0.16], [0, 500])
                }}
                className="w-full h-full absolute inset-0 transform-style-3d flex items-center justify-center"
            >
                {/* Paywall Banner - Top */}
                <motion.div
                    style={{ y: useTransform(progress, [0.11, 0.16], [-200, -300]), rotateZ: useTransform(chaosLevel, [0, 1], [0, 15]) }}
                    className="absolute top-1/4 left-1/4 w-[400px] bg-zinc-900 border border-red-500/50 p-6 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.2)] flex flex-col gap-4 text-white"
                >
                    <div className="flex justify-between items-center"><span className="text-red-400 font-bold uppercase text-xs">Premium Content</span><X className="w-4 h-4 text-zinc-500" /></div>
                    <h3 className="text-xl font-bold">You've reached your free article limit.</h3>
                    <button className="bg-red-600 w-full py-3 rounded-md font-bold flex items-center justify-center gap-2"><Lock className="w-4 h-4" /> Subscribe Now</button>
                </motion.div>

                {/* Video Autoplay Ad - Bottom Right */}
                <motion.div
                    style={{ y: useTransform(progress, [0.11, 0.16], [100, 250]), x: useTransform(progress, [0.11, 0.16], [200, 350]), rotateZ: useTransform(chaosLevel, [0, 1], [0, -25]) }}
                    className="absolute bottom-1/4 right-1/4 w-[300px] h-[200px] bg-emerald-900 border border-emerald-500/50 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
                >
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/50 text-[10px] text-white rounded">Ad 0:15</div>
                    <PlayCircle className="w-16 h-16 text-white/50 animate-pulse" />
                </motion.div>

                {/* Cookie Banner - Bottom Left */}
                <motion.div
                    style={{ y: useTransform(progress, [0.11, 0.16], [200, 100]), x: useTransform(progress, [0.11, 0.16], [-200, -300]), rotateZ: useTransform(chaosLevel, [0, 1], [0, 10]) }}
                    className="absolute bottom-10 left-10 w-[450px] bg-zinc-800 border-t-4 border-yellow-500 p-6 rounded-t-xl shadow-2xl flex flex-col gap-4 text-white"
                >
                    <h3 className="text-lg font-bold flex items-center gap-2"><MousePointerClick className="w-5 h-5 text-yellow-400" /> We value your privacy</h3>
                    <p className="text-sm text-zinc-400">By clicking "Accept All", you agree to the storing of 1,204 tracker cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.</p>
                    <div className="flex gap-2"><button className="bg-yellow-500 text-black px-4 py-2 rounded-md font-bold flex-1">Accept All</button><button className="bg-zinc-700 px-4 py-2 rounded-md font-bold w-1/3">Reject</button></div>
                </motion.div>

            </motion.div>

        </motion.div>
    );
}
