"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide09_Telemetry({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.53 to 0.63
    const opacity = useTransform(progress, [0.52, 0.55, 0.60, 0.63], [0, 1, 1, 0]);
    const yOffsets = useTransform(progress, [0.52, 0.63], ["50%", "-50%"]);

    // Abstract counter
    const counterProgress = useTransform(progress, [0.55, 0.60], [0, 100]);

    return (
        <motion.div style={{ opacity, zIndex: 45 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-transparent pointer-events-none px-6">
            <motion.div style={{ y: yOffsets }} className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                <div className="flex flex-col justify-center">
                    <span className="text-emerald-400 text-xs font-mono uppercase tracking-[0.4em] mb-12 block">
                        Global Telemetry
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
                        Every keystroke is <br />bringing you near to your goal.
                    </h2>
                    <p className="text-white/40 text-xl font-medium max-w-md leading-relaxed">
                        We don&apos;t just count WPM. We track burst speed, fatigue drop-off, and character-specific error rates to build a comprehensive profile of your typing mechanics.
                    </p>
                </div>

                <div className="relative flex flex-col items-end justify-center">
                    {/* Massive scrolling number */}
                    <div className="text-[15vw] md:text-[12vw] font-black text-white/5 font-mono leading-none flex items-baseline relative">
                        10<span className="text-[6vw]">ms</span>

                        {/* Overlay solid number that "fills up" */}
                        <div className="absolute inset-0 overflow-hidden text-emerald-400 mix-blend-screen" style={{ height: "100%" }}>
                            <motion.div style={{ height: useTransform(counterProgress, v => `${v}%`) }} className="overflow-hidden bg-clip-text text-transparent bg-emerald-400 h-full w-full absolute bottom-0 left-0 flex items-end">
                                10<span className="text-[6vw]">ms</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="mt-8 text-right">
                        <div className="text-emerald-400 font-mono text-xl font-bold">14.2M+</div>
                        <div className="text-white/30 text-xs uppercase tracking-widest mt-2">Data points processed today</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
