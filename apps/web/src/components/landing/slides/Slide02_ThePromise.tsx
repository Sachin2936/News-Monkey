"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide02_ThePromise({ progress }: { progress: MotionValue<number> }) {
    // Slide 2 Active: 0.03 to 0.066
    const opacity = useTransform(progress, [0.05, 0.06, 0.105, 0.11], [0, 1, 1, 0]);

    // Typography that scales down massively to snap into place
    const textScale = useTransform(progress, [0.06, 0.08, 0.105], [3, 1, 0.8]);
    const letterSpacing = useTransform(progress, [0.06, 0.08], ["-0.1em", "0em"]);
    const textY = useTransform(progress, [0.06, 0.08, 0.105], [100, 0, -50]);

    return (
        <motion.div style={{ opacity, zIndex: 11 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#000000] pointer-events-none overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)]" />

            <motion.div
                style={{ scale: textScale, y: textY, letterSpacing }}
                className="text-center w-full px-6 flex flex-col items-center justify-center"
            >
                <h2 className="text-5xl md:text-8xl font-black text-white leading-tight uppercase mix-blend-difference">
                    Everything you read.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500">
                        Zero Friction.
                    </span>
                </h2>
                <motion.p
                    style={{ opacity: useTransform(progress, [0.08, 0.09], [0, 1]) }}
                    className="mt-8 text-xl text-zinc-400 font-medium max-w-2xl mx-auto"
                >
                    We rebuilt news aggregation from the ground up to be instantaneous, beautiful, and absolutely effortless.
                </motion.p>
            </motion.div>

        </motion.div>
    );
}
