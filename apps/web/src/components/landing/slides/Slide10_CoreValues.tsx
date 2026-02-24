"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide10_CoreValues({ progress }: { progress: MotionValue<number> }) {
    // Slide 10 Active: 0.28 to 0.33
    const opacity = useTransform(progress, [0.325, 0.335, 0.405, 0.41], [0, 1, 1, 0]);

    // Card 1
    const c1Y = useTransform(progress, [0.335, 0.365], [800, 0]);
    const c1Rotate = useTransform(progress, [0.335, 0.365], [10, -5]);

    // Card 2
    const c2Y = useTransform(progress, [0.355, 0.385], [800, 0]);
    const c2Rotate = useTransform(progress, [0.355, 0.385], [20, 0]);

    // Card 3
    const c3Y = useTransform(progress, [0.375, 0.405], [800, 0]);
    const c3Rotate = useTransform(progress, [0.375, 0.405], [30, 5]);

    return (
        <motion.div style={{ opacity, zIndex: 19 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#f0f4f8] pointer-events-none overflow-hidden">

            <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center w-full">
                <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight">THE THREE PILLARS</h2>
            </div>

            <div className="relative w-full max-w-5xl h-[500px] flex justify-center items-center">

                {/* Card 1 */}
                <motion.div
                    style={{ y: c1Y, rotateZ: c1Rotate }}
                    className="absolute w-80 h-[450px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 p-8 flex flex-col transform-origin-bottom"
                >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-2xl mb-8">01</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Unbiased Truth.</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">We aggregate from both ends of the spectrum and let the AI find the median reality. You see the full picture.</p>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                    style={{ y: c2Y, rotateZ: c2Rotate }}
                    className="absolute w-80 h-[460px] bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.15)] border border-slate-100 p-8 flex flex-col transform-origin-bottom z-10"
                >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 font-bold text-2xl mb-8">02</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Zero Distraction.</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">No ads. No auto-play videos. No clickbait. Just clean, readable typography that respects your cognitive load.</p>
                </motion.div>

                {/* Card 3 */}
                <motion.div
                    style={{ y: c3Y, rotateZ: c3Rotate }}
                    className="absolute w-80 h-[470px] bg-white rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 p-8 flex flex-col transform-origin-bottom z-20"
                >
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 font-bold text-2xl mb-8">03</div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Maximum Context.</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">Every story is mapped to its historical timeline. You don't just read what happened today, you learn why.</p>
                </motion.div>

            </div>

        </motion.div>
    );
}
