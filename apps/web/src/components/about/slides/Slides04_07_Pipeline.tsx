"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slides04_07_Pipeline({ progress }: { progress: MotionValue<number> }) {
    // This section is active from 0.18 to 0.45.
    // It fades in at 0.18, stays fully opaque, and fades out at 0.45.
    const containerOpacity = useTransform(progress, [0.17, 0.20, 0.43, 0.46], [0, 1, 1, 0]);

    // This section translates horizontally across 4 "screens" based on vertical scroll.
    // 0% x-translation = Slide 4
    // -33.3% x-translation = Slide 5
    // -66.6% x-translation = Slide 6
    // -100% (or max width - screen width) x-translation = Slide 7
    const xTransform = useTransform(progress, [0.20, 0.43], ["0%", "-75%"]);

    return (
        <motion.div
            style={{ opacity: containerOpacity, zIndex: 30 }}
            className="absolute inset-0 w-full h-full bg-black pointer-events-none overflow-hidden"
        >
            <motion.div
                style={{ x: xTransform }}
                // We have 4 slides, so the container is 400% of the screen width (400vw).
                className="absolute top-0 left-0 h-full w-[400vw] flex"
            >
                {/* ─── SLIDE 4: Horizontal Intro ─── */}
                <div className="w-[100vw] h-full flex flex-col justify-center px-12 md:px-32 relative">
                    <span className="text-white/30 text-xs font-mono uppercase tracking-[0.4em] mb-8">Phase 1 / Overview</span>
                    <h2 className="text-6xl md:text-8xl lg:text-[10vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-violet-400 leading-[0.85] drop-shadow-lg">
                        THE PIPELINE.
                    </h2>
                    <p className="max-w-xl text-xl md:text-2xl text-violet-100/50 mt-12 font-medium">
                        NewsMonkey isn&apos;t just a frontend wrapper. We built a high-throughput content ingestion engine that process tens of thousands of articles.
                    </p>
                    {/* Decorative arrow pointing right */}
                    <motion.div
                        className="absolute bottom-20 right-24 text-violet-400/50 text-4xl"
                        animate={{ x: [0, 20, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        →
                    </motion.div>
                </div>

                {/* ─── SLIDE 5: Pipeline - Fetch ─── */}
                <div className="w-[100vw] h-full flex items-center justify-center relative border-l border-violet-500/10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none mix-blend-screen" />
                    <div className="max-w-6xl w-full px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center z-10">
                        <div>
                            <span className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-6 block drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">01 / Fetch</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Ingestion.</h2>
                            <p className="text-blue-100/60 text-lg md:text-2xl font-medium leading-relaxed">
                                Our edge workers poll 12+ premium news APIs globally every 15 minutes, pulling raw JSON streams into our central queue.
                            </p>
                        </div>
                        <div className="relative h-[400px] bg-blue-900/10 border border-blue-500/20 rounded-2xl flex items-center justify-center p-8 overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(59,130,246,0.1)]">
                            {/* Abstract visual: data streaming in */}
                            {Array.from({ length: 15 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                                    style={{ top: `${5 + i * 6}%`, left: "-100%", width: "50%" }}
                                    animate={{ left: "150%" }}
                                    transition={{ duration: 1.5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 6: Pipeline - Parse ─── */}
                <div className="w-[100vw] h-full flex items-center justify-center relative border-l border-violet-500/10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(217,70,239,0.15)_0%,rgba(0,0,0,0)_70%)] pointer-events-none mix-blend-screen" />
                    <div className="max-w-6xl w-full px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center z-10">
                        <div className="order-2 md:order-1 relative h-[400px] bg-fuchsia-900/10 border border-fuchsia-500/20 rounded-2xl flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(217,70,239,0.1)]">
                            {/* Abstract visual: Parsing/filtering */}
                            <motion.div
                                className="w-32 h-32 border-4 border-fuchsia-500 rounded-xl shadow-[0_0_30px_rgba(217,70,239,0.4)]"
                                animate={{ rotate: 90, scale: [1, 0.8, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute w-40 h-40 border-2 border-fuchsia-400/50 rounded-xl"
                                animate={{ rotate: -90, scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                        <div className="order-1 md:order-2">
                            <span className="text-fuchsia-400 text-xs font-mono uppercase tracking-widest mb-6 block drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]">02 / Parse</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Sanitization.</h2>
                            <p className="text-fuchsia-100/60 text-lg md:text-2xl font-medium leading-relaxed">
                                We strip out HTML, ad tags, and irrelevant metadata. The text is analyzed for reading difficulty, length, and subject matter before hitting PostgreSQL.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ─── SLIDE 7: Pipeline - Serve ─── */}
                <div className="w-[100vw] h-full flex items-center justify-center relative border-l border-white/10">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full" />
                    <div className="max-w-6xl w-full px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-6 block">03 / Serve</span>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">Zero Latency.</h2>
                            <p className="text-slate-400 text-lg md:text-2xl font-medium leading-relaxed">
                                Curated articles are pushed to edge caches (Redis). When you hit play, the text is delivered in double-digit milliseconds.
                            </p>
                        </div>
                        <div className="relative h-[400px] bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8">
                            {/* Abstract visual: Speed/Ping */}
                            <div className="text-7xl font-black text-emerald-400 font-mono flex items-baseline">
                                <motion.span
                                    animate={{ opacity: [1, 0.4, 1] }}
                                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 1 }}
                                >
                                    12
                                </motion.span>
                                <span className="text-3xl ml-2">ms</span>
                            </div>
                            <div className="mt-4 text-white/30 text-sm uppercase tracking-widest font-bold">Edge Delivery</div>
                        </div>
                    </div>
                </div>

            </motion.div>
        </motion.div>
    );
}
