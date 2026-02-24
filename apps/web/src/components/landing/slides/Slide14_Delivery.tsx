"use client";

import { motion, MotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";

export function Slide14_Delivery({ progress }: { progress: MotionValue<number> }) {
    // Slide 14 Active: 0.42 to 0.46
    const opacity = useTransform(progress, [0.49, 0.50, 0.545, 0.55], [0, 1, 1, 0]);

    // Timer refs
    const countRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        return progress.on("change", (latest) => {
            if (latest > 0.495 && latest < 0.55 && !isVisible) {
                setIsVisible(true);
            } else if ((latest <= 0.495 || latest >= 0.55) && isVisible) {
                setIsVisible(false);
            }
        });
    }, [progress, isVisible]);

    useEffect(() => {
        if (isVisible) {
            animate(999, 12, { duration: 2, ease: "circOut", onUpdate: (v) => countRef.current && (countRef.current.textContent = Math.round(v).toString()) });
        } else {
            if (countRef.current) countRef.current.textContent = "999";
        }
    }, [isVisible]);

    // Zoom and flash effect when hitting 12ms
    const flashOpacity = useTransform(progress, [0.51, 0.52], [0, 0.5]);
    const boltScale = useTransform(progress, [0.515, 0.525], [0, 1.5]);

    return (
        <motion.div style={{ opacity, zIndex: 23 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#170a1a] pointer-events-none overflow-hidden">

            <motion.div style={{ opacity: flashOpacity }} className="absolute inset-0 bg-yellow-500/20 mix-blend-overlay z-0" />

            <div className="text-center z-10 w-full px-6 flex flex-col items-center">

                {/* Visual Timer */}
                <div className="relative flex items-center justify-center w-64 h-64 mb-12">
                    {/* Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                        <motion.circle
                            cx="128" cy="128" r="120" stroke="#eab308" strokeWidth="8" fill="none" strokeDasharray="753"
                            style={{ strokeDashoffset: useTransform(progress, [0.50, 0.53], [753, 0]) }}
                        />
                    </svg>

                    {/* Lightning bolt appearing */}
                    <motion.div style={{ scale: boltScale }} className="absolute z-20 top-0 text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,1)]">
                        <Zap className="w-24 h-24 fill-yellow-500" />
                    </motion.div>

                    {/* Counter */}
                    <div className="text-center absolute z-10">
                        <span ref={countRef} className="text-7xl font-mono font-black text-white tracking-tighter">999</span>
                        <span className="text-yellow-500 font-bold ml-1">ms</span>
                    </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                    INSTANT DELIVERY.
                </h2>
                <p className="max-w-md mx-auto text-xl text-white/50 font-medium mt-6">
                    Powered by a globally distributed edge network. The news hits your screen the moment it drops.
                </p>

            </div>

        </motion.div>
    );
}
