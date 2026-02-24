"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

export function Slide04_Overload({ progress }: { progress: MotionValue<number> }) {
    // Slide 4 Active: 0.10 to 0.13
    const opacity = useTransform(progress, [0.095, 0.10, 0.125, 0.13], [0, 1, 1, 0]);

    // Chaotic opposing marquees speeding up as you scroll
    const marquee1X = useTransform(progress, [0.095, 0.13], ["0%", "-50%"]);
    const marquee2X = useTransform(progress, [0.095, 0.13], ["-50%", "0%"]);
    const marquee3X = useTransform(progress, [0.095, 0.13], ["0%", "-80%"]);
    const marquee4X = useTransform(progress, [0.095, 0.13], ["-80%", "0%"]);

    // The scale of the overload increases
    const scale = useTransform(progress, [0.10, 0.125], [1, 1.5]);

    const words = ["BREAKING", "EXCLUSIVE", "YOU WON'T BELIEVE", "SHOCKING", "MUST READ", "UPDATE", "SCANDAL"];
    const rowContent = Array(20).fill(words).flat();

    return (
        <motion.div style={{ opacity, zIndex: 13 }} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#110000] pointer-events-none overflow-hidden">

            <motion.div style={{ scale }} className="absolute inset-0 flex flex-col justify-center gap-1 opacity-80 mix-blend-color-dodge">

                {/* Row 1 */}
                <motion.div style={{ x: marquee1X }} className="flex whitespace-nowrap gap-8 text-8xl font-black text-red-600 uppercase italic opacity-60 w-[400vw]">
                    {rowContent.map((w, i) => <span key={i}>{w}</span>)}
                </motion.div>

                {/* Row 2 */}
                <motion.div style={{ x: marquee2X }} className="flex whitespace-nowrap gap-8 text-[10rem] font-black text-orange-600 uppercase opacity-80 w-[400vw] ml-[-100vw]">
                    {rowContent.map((w, i) => <span key={i}>{w}</span>)}
                </motion.div>

                {/* Row 3 - The loudest */}
                <motion.div style={{ x: marquee3X }} className="flex whitespace-nowrap gap-8 text-[12rem] font-black text-yellow-500 uppercase italic max-w-none w-[400vw]">
                    {rowContent.map((w, i) => <span key={i}>{w}</span>)}
                </motion.div>

                {/* Row 4 */}
                <motion.div style={{ x: marquee4X }} className="flex whitespace-nowrap gap-8 text-7xl font-black text-rose-700 uppercase opacity-50 w-[400vw] ml-[-200vw]">
                    {rowContent.map((w, i) => <span key={i}>{w}</span>)}
                </motion.div>

            </motion.div>

            <motion.div
                style={{ scale: useTransform(progress, [0.10, 0.13], [0.8, 1.2]) }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-transparent backdrop-blur-[2px]"
            >
                <div className="px-12 py-6 bg-black border-2 border-red-500 text-white shadow-[0_0_100px_rgba(220,38,38,1)] transform -rotate-6">
                    <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mix-blend-difference">OVERLOAD.</h2>
                </div>
            </motion.div>

        </motion.div>
    );
}
