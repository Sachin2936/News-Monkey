"use client";

import { motion, MotionValue, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type NodeData = { id: number, left: string, top: string, z: number };

function NeuralNode({ node, springX, springY }: { node: NodeData, springX: any, springY: any }) {
    const x = useTransform(springX, (v: number) => v * node.z * -1);
    const y = useTransform(springY, (v: number) => v * node.z * -1);

    return (
        <motion.div
            style={{ x, y }}
            className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)]"
            initial={{ left: node.left, top: node.top }}
        />
    );
}

export function Slide08_Intelligence({ progress }: { progress: MotionValue<number> }) {
    // Slide 8 Active: 0.22 to 0.26
    const opacity = useTransform(progress, [0.21, 0.225, 0.25, 0.26], [0, 1, 1, 0]);

    // Container for mouse tracking
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate percentage from center (-50 to 50)
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
            mouseX.set(x);
            mouseY.set(y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const [nodes, setNodes] = useState<NodeData[]>([]);

    useEffect(() => {
        // Nodes for the neural net
        setNodes(Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            // Random spread
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
            // Parallax multiplier
            z: Math.random() * 2 + 0.5
        })));
    }, []);

    return (
        <motion.div ref={containerRef} style={{ opacity, zIndex: 17 }} className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#f8fafc] overflow-hidden pointer-events-auto">

            {/* Neural Net Nodes following mouse in parallax */}
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply">
                {nodes.map((node) => (
                    <NeuralNode key={node.id} node={node} springX={springX} springY={springY} />
                ))}
            </div>

            {/* Glowing Mouse Orb */}
            <motion.div
                style={{
                    x: useTransform(springX, (v) => typeof window !== "undefined" ? (v * window.innerWidth) / 100 : 0),
                    y: useTransform(springY, (v) => typeof window !== "undefined" ? (v * window.innerHeight) / 100 : 0)
                }}
                className="absolute w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none z-0"
            />

            <div className="text-center z-10 w-full px-6 flex flex-col items-center">
                <span className="text-emerald-600 font-mono text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                    Neural Filtering
                </span>
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-tight pointer-events-none">
                    LIVING <br /> INTELLIGENCE.
                </h2>
                <p className="max-w-xl mx-auto text-xl text-slate-500 font-medium mt-6 pointer-events-none">
                    Our AI bias-checks, summarizes, and contextualizes global events in milliseconds. The network learns what you value.
                </p>
            </div>

        </motion.div>
    );
}
