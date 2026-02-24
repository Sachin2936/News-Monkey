"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Slide30_Singularity({ progress }: { progress: MotionValue<number> }) {
    // Slide 30 Active: 0.95 to 1.0
    // Stays visible at the very end
    const opacity = useTransform(progress, [0.945, 0.96], [0, 1]);

    // The entire universe sucks into a singularity dot
    const implosionScale = useTransform(progress, [0.95, 0.97], [50, 0]);
    // Then explodes outwards into the final UI
    const explosionScale = useTransform(progress, [0.97, 0.985], [0, 1]);

    // The final button pulses automatically but scales into place on scroll
    const buttonScale = useTransform(progress, [0.98, 0.99], [0, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 39 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#000000] overflow-hidden pointer-events-auto">

            {/* The Implosion Phase */}
            <motion.div
                style={{ scale: implosionScale }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
            >
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_100px_rgba(255,255,255,1)]" />
                <div className="absolute w-screen h-screen border-[0.5px] border-white/5 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)] rounded-full" />
            </motion.div>

            {/* The Explosion Phase (Final UI Reveal) */}
            <motion.div
                style={{ scale: explosionScale }}
                className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(249,115,22,0.15)_0%,rgba(0,0,0,1)_80%)] -z-10" />

                <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter mb-12 drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                    IT'S TIME.
                </h2>

                <motion.div style={{ scale: buttonScale }}>
                    <Link href="/login">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ boxShadow: ["0 0 40px rgba(249,115,22,0.4)", "0 0 80px rgba(249,115,22,0.8)", "0 0 40px rgba(249,115,22,0.4)"] }}
                            transition={{ boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
                            className="group relative px-12 py-6 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-black text-2xl tracking-widest flex items-center gap-4 transition-colors"
                        >
                            AWAKEN <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Footer Links */}
                <motion.div
                    style={{ opacity: useTransform(progress, [0.99, 1], [0, 1]) }}
                    className="absolute bottom-12 flex gap-8 text-sm font-medium text-white/30"
                >
                    <Link href="/about" className="hover:text-white transition-colors">About Story</Link>
                    <Link href={"#" as any} className="hover:text-white transition-colors">Terms of Use</Link>
                    <Link href={"#" as any} className="hover:text-white transition-colors">Contact</Link>
                </motion.div>

            </motion.div>

        </motion.div>
    );
}
