"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide25_Community({ progress }: { progress: MotionValue<number> }) {
    // Act 5 handles 0.80 to 1.0
    // Slide 25 Active: 0.80 to 0.84
    const opacity = useTransform(progress, [0.795, 0.805, 0.835, 0.84], [0, 1, 1, 0]);

    // Constellation lines drawing in
    const pathLength = useTransform(progress, [0.80, 0.83], [0, 1]);

    // An infinite neon tunnel moving towards the user
    const tunnelScale = useTransform(progress, [0.80, 0.84], [1, 3]);
    const tunnelRotate = useTransform(progress, [0.80, 0.84], [0, 15]);

    // Nodes glowing up as they are connected
    const opacity1 = useTransform(progress, [0.80, 0.81], [0.2, 1]);
    const opacity2 = useTransform(progress, [0.81, 0.82], [0.2, 1]);
    const opacity3 = useTransform(progress, [0.82, 0.83], [0.2, 1]);

    const z1 = useTransform(progress, [0.80, 0.84], [0, 100]);
    const z2 = useTransform(progress, [0.80, 0.84], [0, 150]);
    const z3 = useTransform(progress, [0.80, 0.84], [0, 200]);

    return (
        <motion.div style={{ opacity, zIndex: 34 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#000000] pointer-events-none overflow-hidden perspective-[1000px]">

            {/* The Neon Grid Tunnel */}
            <motion.div
                style={{ scale: tunnelScale, rotateZ: tunnelRotate }}
                className="absolute inset-0 w-[200vw] h-[200vh] -left-[50vw] -top-[50vh] flex items-center justify-center opacity-30 mix-blend-screen"
            >
                <div className="absolute inset-0 border-[0.5px] border-emerald-500/30" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)", backgroundSize: "100px 100px", perspective: "800px", transform: "rotateX(60deg) translateY(-200px) translateZ(-200px)" }} />
                <div className="absolute inset-0 border-[0.5px] border-blue-500/30" style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)", backgroundSize: "100px 100px", perspective: "800px", transform: "rotateX(-60deg) translateY(200px) translateZ(-200px)" }} />
            </motion.div>

            <div className="absolute top-32 z-20 text-center w-full px-6">
                <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                    The Network
                </span>
                <h2 className="text-5xl md:text-7xl font-sans font-black text-white tracking-tighter mix-blend-screen drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    100+ READERS. <br /> CONNECTED.
                </h2>
            </div>

            <div className="relative w-full max-w-5xl h-full flex items-center justify-center transform-style-3d">

                {/* SVG Connecting Lines (Constellation) */}
                <svg className="absolute inset-0 w-full h-full z-0" style={{ transform: 'translateZ(-50px)' }}>
                    {/* Simplified geometric connections */}
                    <motion.line x1="20%" y1="30%" x2="50%" y2="50%" stroke="rgba(52,211,153,0.5)" strokeWidth="2" style={{ pathLength }} />
                    <motion.line x1="50%" y1="50%" x2="80%" y2="40%" stroke="rgba(52,211,153,0.5)" strokeWidth="2" style={{ pathLength }} />
                    <motion.line x1="50%" y1="50%" x2="30%" y2="70%" stroke="rgba(52,211,153,0.5)" strokeWidth="2" style={{ pathLength }} />
                    <motion.line x1="50%" y1="50%" x2="70%" y2="75%" stroke="rgba(52,211,153,0.5)" strokeWidth="2" style={{ pathLength }} />
                    <motion.line x1="20%" y1="30%" x2="40%" y2="20%" stroke="rgba(52,211,153,0.2)" strokeWidth="1" style={{ pathLength }} />
                    <motion.line x1="80%" y1="40%" x2="60%" y2="20%" stroke="rgba(52,211,153,0.2)" strokeWidth="1" style={{ pathLength }} />
                </svg>

                {/* Node 1 */}
                <motion.div style={{ opacity: opacity1, z: z1, left: "20%", top: "30%" }} className="absolute w-12 h-12 bg-emerald-500 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.8)] flex items-center justify-center border-2 border-white">
                    <img src="https://i.pravatar.cc/150?u=d" className="w-full h-full rounded-full" />
                </motion.div>

                {/* Center Hub */}
                <motion.div style={{ opacity: opacity1, z: z2, left: "50%", top: "50%", x: "-50%", y: "-50%" }} className="absolute w-24 h-24 bg-[#030014] rounded-full shadow-[0_0_80px_rgba(52,211,153,0.6)] flex items-center justify-center border-4 border-emerald-500 z-20">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">YOU</span>
                    </div>
                </motion.div>

                {/* Node 2 */}
                <motion.div style={{ opacity: opacity2, z: z3, left: "80%", top: "40%" }} className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-[0_0_40px_rgba(59,130,246,0.8)] flex items-center justify-center border-2 border-white">
                    <img src="https://i.pravatar.cc/150?u=e" className="w-full h-full rounded-full" />
                </motion.div>

                {/* Node 3 */}
                <motion.div style={{ opacity: opacity3, z: z1, left: "30%", top: "70%" }} className="absolute w-10 h-10 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.8)] flex items-center justify-center border-[1px] border-white">
                    <img src="https://i.pravatar.cc/150?u=f" className="w-full h-full rounded-full" />
                </motion.div>

                {/* Node 4 */}
                <motion.div style={{ opacity: opacity3, z: z2, left: "70%", top: "75%" }} className="absolute w-14 h-14 bg-rose-500 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.8)] flex items-center justify-center border-2 border-white">
                    <img src="https://i.pravatar.cc/150?u=g" className="w-full h-full rounded-full" />
                </motion.div>

            </div>

        </motion.div>
    );
}
