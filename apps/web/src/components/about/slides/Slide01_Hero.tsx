"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

export function Slide01_Hero({ progress }: { progress: MotionValue<number> }) {
    // Map the global scroll progress to the local animation of this slide.
    // Slide 1 is active roughly from 0 to 0.06 of the page scroll.
    const opacity = useTransform(progress, [0, 0.05, 0.08], [1, 1, 0]);
    const scale = useTransform(progress, [0, 0.08], [1, 1.5]);
    const yOffsets = useTransform(progress, [0, 0.08], ["0%", "-50%"]);

    return (
        <motion.div
            style={{ opacity }}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-black text-white px-6 overflow-hidden"
        >
            <motion.div
                style={{ scale, y: yOffsets }}
                className="text-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="block text-[10px] md:text-sm font-black uppercase tracking-[0.5em] text-white/30 mb-8 md:mb-12">
                        System Online
                    </span>
                    <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-[0.85] text-white">
                        THE ENGINE
                    </h1>
                </motion.div>

                {/* Decorative floating elements */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] border border-white/5 rounded-full pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] md:w-[30vw] md:h-[30vw] border border-white/[0.02] rounded-full pointer-events-none"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">Scroll</span>
                <div className="w-px h-12 bg-white/10 relative overflow-hidden">
                    <motion.div
                        className="absolute top-0 left-0 w-full h-1/2 bg-white"
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
