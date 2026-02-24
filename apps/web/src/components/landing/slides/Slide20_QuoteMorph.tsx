"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { User } from "lucide-react";

export function Slide20_QuoteMorph({ progress }: { progress: MotionValue<number> }) {
    // Slide 20 Active: 0.63 to 0.67
    const opacity = useTransform(progress, [0.765, 0.775, 0.82, 0.825], [0, 1, 1, 0]);

    // Morphing a giant quote mark SVG path into a User Icon path conceptually using border-radius and scaling
    // (Framer Motion path morphing is complex, so we'll do an elegant CSS visual morph)
    const containerRadius = useTransform(progress, [0.77, 0.81], ["100%", "24px"]);
    const containerWidth = useTransform(progress, [0.77, 0.81], ["300px", "600px"]);
    const containerHeight = useTransform(progress, [0.77, 0.81], ["300px", "400px"]);
    const containerBg = useTransform(progress, [0.77, 0.81], ["#c026d3", "#1f2937"]); // Fuchsia to Slate 800

    // Quote mark fades out as it expands
    const quoteOpacity = useTransform(progress, [0.77, 0.79], [1, 0]);
    // Review content fades in
    const reviewOpacity = useTransform(progress, [0.79, 0.81], [0, 1]);

    return (
        <motion.div style={{ opacity, zIndex: 29 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-900 pointer-events-none overflow-hidden">

            <motion.div
                style={{
                    width: containerWidth,
                    height: containerHeight,
                    borderRadius: containerRadius,
                    backgroundColor: containerBg
                }}
                className="relative flex items-center justify-center p-12 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10"
            >
                {/* The Giant Quote Mark State */}
                <motion.div style={{ opacity: quoteOpacity }} className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-[250px] font-serif italic font-black leading-none drop-shadow-xl -mt-20">
                        "
                    </span>
                </motion.div>

                {/* The Revealed Quote State */}
                <motion.div style={{ opacity: reviewOpacity }} className="w-full h-full flex flex-col justify-between">
                    <p className="text-white text-3xl font-serif italic leading-relaxed">
                        "It fundamentally broke my doomscrolling addiction. I get exactly the news I need in 60 seconds, and I leave feeling informed instead of exhausted."
                    </p>
                    <div className="flex items-center gap-4 mt-8">
                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                            <div className="text-white font-bold">Sarah Jenkins</div>
                            <div className="text-fuchsia-400 text-sm">Product Manager @ Stripe</div>
                        </div>
                    </div>
                </motion.div>

            </motion.div>

        </motion.div>
    );
}
