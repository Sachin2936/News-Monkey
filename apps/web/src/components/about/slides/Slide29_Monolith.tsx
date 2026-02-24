"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Link from "next/link";

export function Slide29_Monolith({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.74 to 1.00 in Part 3
    const opacity = useTransform(progress, [0.73, 0.78, 1.0], [0, 1, 1]);

    // The monolith rises from the bottom of the screen
    const monolithY = useTransform(progress, [0.78, 0.95], ["100vh", "15vh"]);
    // The halo intensity increases as it rises
    const haloIntensity = useTransform(progress, [0.82, 0.95], [0, 1]);

    // The final interactive elements fade in at the very bottom
    const ctaOpacity = useTransform(progress, [0.92, 0.96], [0, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 140 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-end px-6 pointer-events-none overflow-hidden pb-48 md:pb-32">

            {/* The Halo (Backlight) */}
            <motion.div
                style={{ opacity: haloIntensity }}
                className="absolute bottom-[-20%] w-[150vw] h-[150vw] md:w-[100vw] md:h-[100vw] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(251,191,36,0.1)_40%,rgba(7,2,17,0)_70%)] pointer-events-none -z-20 blur-3xl transform -translate-y-1/2"
            />

            {/* The Monolith Container */}
            <motion.div
                style={{ y: monolithY }}
                className="relative w-[300px] md:w-[400px] h-[80vh] bg-black border-t-2 border-l-2 border-r-2 border-white/10 rounded-t-sm shadow-[0_-50px_100px_rgba(0,0,0,1)] flex flex-col items-center justify-start py-24 z-10"
            >

                {/* The glowing Rune / Core */}
                <motion.div
                    className="w-16 h-16 border-2 border-emerald-500 flex items-center justify-center rotate-45 mb-16 shadow-[0_0_30px_rgba(16,185,129,0.6)]"
                    animate={{ boxShadow: ["0 0 30px rgba(16,185,129,0.6)", "0 0 60px rgba(16,185,129,1)", "0 0 30px rgba(16,185,129,0.6)"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <div className="w-6 h-6 bg-emerald-400" />
                </motion.div>

                {/* Cryptic final text */}
                <motion.div style={{ opacity: ctaOpacity }} className="text-center w-full px-8 pointer-events-auto">
                    <h2 className="text-2xl font-mono text-white/50 tracking-[0.5em] mb-12 uppercase">
                        The End<br />of the Line
                    </h2>

                    <Link href="/practice">
                        <button className="group relative w-full py-6 bg-transparent border-y border-white/20 text-white font-black text-2xl tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 overflow-hidden">
                            <span className="relative z-10 transition-colors duration-500">INITIATE</span>
                            <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
                        </button>
                    </Link>
                </motion.div>

            </motion.div>

            {/* Foreground Fog/Smoke */}
            <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-black via-[#070211] to-transparent z-20 pointer-events-none" />

        </motion.div>
    );
}
