"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide13_Team({ progress }: { progress: MotionValue<number> }) {
    // Active from 0.89 to 0.98
    const opacity = useTransform(progress, [0.88, 0.91, 0.96, 0.98], [0, 1, 1, 0]);
    const scale = useTransform(progress, [0.88, 0.98], [0.95, 1.05]);

    return (
        <motion.div style={{ opacity, zIndex: 65 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#050505] pointer-events-none px-6">
            <div className="max-w-6xl w-full">

                <div className="flex items-end justify-between border-b border-white/10 pb-8 mb-16">
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white/90">
                        THE<br />ARCHITECTS.
                    </h2>
                    <span className="text-white/30 text-xs font-mono uppercase tracking-[0.4em] mb-4">
                        v1.0.0
                    </span>
                </div>

                <motion.div style={{ scale }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                    {/* GG */}
                    <div className="group relative">
                        <div className="aspect-[4/5] md:aspect-square bg-white/5 border border-white/10 flex flex-col justify-end p-8 md:p-12 overflow-hidden">

                            <div className="absolute top-8 right-8 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                                01
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-2">Geetansh Garg</h3>
                                <p className="text-rose-400 font-mono text-sm uppercase tracking-widest mb-6">Backend & AI Infrastructure</p>
                                <p className="text-white/40 text-lg leading-relaxed max-w-sm">
                                    Engineered the real-time article synchronization pipeline, WebSocket broadcasting, and adaptive AI difficulty scaling.
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* SS */}
                    <div className="group relative">
                        <div className="aspect-[4/5] md:aspect-square bg-white/5 border border-white/10 flex flex-col justify-end p-8 md:p-12 overflow-hidden">

                            <div className="absolute top-8 right-8 text-5xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                                02
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-2">Sachin Singh</h3>
                                <p className="text-violet-400 font-mono text-sm uppercase tracking-widest mb-6">Frontend Architecture & UX</p>
                                <p className="text-white/40 text-lg leading-relaxed max-w-sm">
                                    Designed the structural typography, scroll-linked animation engine, gamification UI, and zero-latency client interactions.
                                </p>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        </div>
                    </div>

                </motion.div>
            </div>
        </motion.div>
    );
}
