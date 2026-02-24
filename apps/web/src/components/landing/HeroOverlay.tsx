"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function HeroOverlay({ progress }: { progress: MotionValue<number> }) {
    // Fades out as the user begins scrolling (0 to 1.2% of the 3000vh journey)
    const opacity = useTransform(progress, [0, 0.012], [1, 0]);
    // Disable pointer events when faded out so you can't accidentally click invisible buttons
    const pointerEvents = useTransform(progress, (v) => v > 0.012 ? "none" : "auto");
    const { data: session } = authClient.useSession();

    return (
        <motion.div
            style={{ opacity, pointerEvents: pointerEvents as any }}
            className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Animated non-black background to signify life before the scroll starts */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(6,182,212,0.4),_transparent_60%)] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.9, 0.6] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(139,92,246,0.35),_transparent_60%)] pointer-events-none"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.3),_transparent_70%)] pointer-events-none"
            />


            {/* Auth Links at the top right */}
            <div className="absolute top-8 right-8 flex gap-4 md:gap-6 items-center">
                {session ? (
                    <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] text-sm">
                        Enter Dashboard
                    </Link>
                ) : (
                    <>
                        <Link href="/login" className="px-5 py-2.5 rounded-full text-white/70 hover:text-white font-medium hover:bg-white/10 transition-colors text-sm">
                            Log In
                        </Link>
                        <Link href="/login" className="px-6 py-2.5 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] text-sm">
                            Join Now
                        </Link>
                    </>
                )}
            </div>

            {/* Main Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mt-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-none bg-gradient-to-br from-white via-white to-zinc-500 bg-clip-text text-transparent drop-shadow-2xl">
                        NewsMonkey
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 md:mt-8 space-y-4"
                >
                    <p className="text-xl md:text-3xl text-zinc-300 font-medium tracking-tight">
                        Type the news. Build your empire.
                    </p>
                    <p className="text-sm md:text-base text-zinc-500 max-w-2xl mx-auto">
                        An immersive, gamified typing experience powered by real-time global journalism.
                    </p>
                </motion.div>
            </div>

            {/* Glowing Mouse Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative z-10 flex flex-col items-center justify-center gap-4 mt-16 md:mt-24 pointer-events-none"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-cyan-400 text-[10px] tracking-[0.5em] font-black uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">Mission Start</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </div>

                <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5 shadow-[0_0_30px_rgba(255,255,255,0.1)] bg-black/60 backdrop-blur-md relative overflow-hidden">
                    <motion.div
                        animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-1 h-2.5 rounded-full bg-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,1)]"
                    />
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-white text-base md:text-lg font-black tracking-tighter uppercase italic animate-pulse">
                        Scroll down to begin
                    </span>
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-1" />
                </div>
            </motion.div>
        </motion.div>
    );
}
