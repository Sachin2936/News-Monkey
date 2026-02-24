"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide22_WallOfLove({ progress }: { progress: MotionValue<number> }) {
    // Slide 22 Active: 0.69 to 0.74
    const opacity = useTransform(progress, [0.82, 0.83, 0.885, 0.89], [0, 1, 1, 0]);

    // Constant scrolling tied to the user's scroll depth
    const moveLeft = useTransform(progress, [0.825, 0.89], ["0%", "-30%"]);
    const moveRight = useTransform(progress, [0.825, 0.89], ["-30%", "0%"]);

    // The whole wall tilts dramatically like Star Wars text
    const tilt = useTransform(progress, [0.825, 0.84], [40, 60]);

    const reviews = [
        { text: "Absolutely insane speed.", name: "Aarav Sharma", avatar: "https://i.pravatar.cc/150?u=aarav" },
        { text: "The bias engine is scarily accurate.", name: "Priya Patel", avatar: "https://i.pravatar.cc/150?u=priya" },
        { text: "The summaries save me 2 hours a day.", name: "Rahul Singh", avatar: "https://i.pravatar.cc/150?u=rahul" },
        { text: "Perfect UI.", name: "Neha Gupta", avatar: "https://i.pravatar.cc/150?u=neha" },
        { text: "Best $10 I spend every month.", name: "Vikram Reddy", avatar: "https://i.pravatar.cc/150?u=vikram" },
        { text: "How is this so fast?", name: "Ananya Desai", avatar: "https://i.pravatar.cc/150?u=ananya" },
        { text: "Beautiful typography.", name: "Karan Mehta", avatar: "https://i.pravatar.cc/150?u=karan" },
        { text: "It's like reading the matrix.", name: "Riya Kapoor", avatar: "https://i.pravatar.cc/150?u=riya" }
    ];

    const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

    return (
        <motion.div style={{ opacity, zIndex: 31 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#000000] pointer-events-none overflow-hidden perspective-[1000px]">

            <div className="absolute top-32 z-20 text-center w-full px-6">
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mix-blend-difference mb-4">THE WALL OF LOVE.</h2>
                <div className="flex justify-center flex-wrap gap-2 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-8 h-8 fill-current drop-shadow-[0_0_10px_rgba(234,179,8,1)]" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                    ))}
                </div>
            </div>

            <motion.div
                style={{ rotateX: tilt }}
                className="w-full h-[600px] flex flex-col justify-center gap-6 mt-32 transform-style-3d opacity-80"
            >
                {/* Row 1 - Left */}
                <motion.div style={{ x: moveLeft }} className="flex gap-6 whitespace-nowrap w-max px-12">
                    {duplicatedReviews.map((r, i) => (
                        <div key={i} className="px-8 py-6 bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl flex flex-col gap-4">
                            <p className="text-2xl font-bold text-zinc-300">"{r.text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                <span className="text-sm font-medium text-zinc-400">{r.name}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Row 2 - Right */}
                <motion.div style={{ x: moveRight }} className="flex gap-6 whitespace-nowrap w-max px-12">
                    {duplicatedReviews.map((r, i) => (
                        <div key={i} className="px-8 py-6 bg-emerald-900/30 border border-emerald-500/20 rounded-2xl shadow-2xl flex flex-col gap-4">
                            <p className="text-2xl font-bold text-emerald-100">"{r.text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-emerald-500/20" />
                                <span className="text-sm font-medium text-emerald-400/80">{r.name}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Row 3 - Left */}
                <motion.div style={{ x: moveLeft }} className="flex gap-6 whitespace-nowrap w-max px-12">
                    {duplicatedReviews.map((r, i) => (
                        <div key={i} className="px-8 py-6 bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl flex flex-col gap-4">
                            <p className="text-2xl font-bold text-zinc-300">"{r.text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                <span className="text-sm font-medium text-zinc-400">{r.name}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Row 4 - Right */}
                <motion.div style={{ x: moveRight }} className="flex gap-6 whitespace-nowrap w-max px-12">
                    {duplicatedReviews.map((r, i) => (
                        <div key={i} className="px-8 py-6 bg-rose-900/30 border border-rose-500/20 rounded-2xl shadow-2xl flex flex-col gap-4">
                            <p className="text-2xl font-bold text-rose-100">"{r.text}"</p>
                            <div className="flex items-center gap-3">
                                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-rose-500/20" />
                                <span className="text-sm font-medium text-rose-400/80">{r.name}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* Fade gradients for the top and bottom of the wall */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

        </motion.div>
    );
}
