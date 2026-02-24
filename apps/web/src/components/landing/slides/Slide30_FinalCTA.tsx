"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function Slide30_FinalCTA({ progress }: { progress: MotionValue<number> }) {
    // Slide 30 Active: 0.95 to 1.00
    // We want it to stay fully visible at the absolute end
    const opacity = useTransform(progress, [0.945, 0.955, 1.0, 1.0], [0, 1, 1, 1]);

    // Background scaling effect
    const bgScale = useTransform(progress, [0.95, 1.0], [1.2, 1]);

    // Elements sliding in
    const titleY = useTransform(progress, [0.95, 0.97], [100, 0]);
    const ctaScale = useTransform(progress, [0.97, 0.99], [0.8, 1]);

    return (
        <motion.div
            style={{ opacity, zIndex: 50 }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden"
        >
            {/* Ambient Background Glows */}
            <motion.div
                style={{ scale: bgScale }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-1/4 -left-1/4 w-[80vw] h-[80vw] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-[80vw] h-[80vw] bg-purple-500/10 rounded-full blur-[120px]" />
            </motion.div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-5xl px-6 text-center">
                <motion.div
                    style={{ y: titleY }}
                    className="mb-12"
                >
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        JOIN THE <br /> REVOLUTION.
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-400 mt-6 font-medium max-w-2xl mx-auto">
                        Stop reading the news. Start mastering it. Your typing empire begins today.
                    </p>
                </motion.div>

                <motion.div
                    style={{ scale: ctaScale }}
                    className="flex flex-col md:flex-row gap-6 items-center"
                >
                    <Link
                        href="/login"
                        className="group relative px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-lg rounded-full flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        Get Started
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/login"
                        className="px-10 py-5 border-2 border-white/20 text-white font-bold uppercase tracking-widest text-lg rounded-full hover:bg-white/10 hover:border-white transition-all"
                    >
                        Sign In
                    </Link>
                </motion.div>

                {/* Bottom Footer Links */}
                <div className="mt-24 flex gap-8 text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">
                    <Link href={"/about" as any} className="hover:text-white transition-colors">About</Link>
                    <Link href={"/terms" as any} className="hover:text-white transition-colors">Terms</Link>
                    <Link href={"/privacy" as any} className="hover:text-white transition-colors">Privacy</Link>
                </div>
            </div>

            {/* Floating Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [-20, -100],
                            x: [(i * 7) % 10 - 5, (i * 13) % 10 - 5],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + (i % 3),
                            repeat: Infinity,
                            delay: i * 0.7
                        }}
                        className="absolute bottom-0 text-cyan-500/40"
                        style={{ left: `${10 + i * 15}%` }}
                    >
                        <Zap size={20 + (i * 5) % 15} fill="currentColor" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
