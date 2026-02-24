"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Slide01_Hero } from "@/components/about/slides/Slide01_Hero";
import { Slide02_Statement } from "@/components/about/slides/Slide02_Statement";
import { Slide03_Catalyst } from "@/components/about/slides/Slide03_Catalyst";
import { Slides04_07_Pipeline } from "@/components/about/slides/Slides04_07_Pipeline";
import { Slide08_Arena } from "@/components/about/slides/Slide08_Arena";
import { Slide09_Telemetry } from "@/components/about/slides/Slide09_Telemetry";
import { Slide10_GlobalFeed } from "@/components/about/slides/Slide10_GlobalFeed";
import { Slide11_Adaptive } from "@/components/about/slides/Slide11_Adaptive";
import { Slide12_Gamification } from "@/components/about/slides/Slide12_Gamification";
import { Slide13_Team } from "@/components/about/slides/Slide13_Team";
import { Slide14_Manifesto } from "@/components/about/slides/Slide14_Manifesto";
import { Slide15_Ecosystem } from "@/components/about/slides/Slide15_Ecosystem";
import { Slide16_Dashboard } from "@/components/about/slides/Slide16_Dashboard";
import { Slide17_Badges } from "@/components/about/slides/Slide17_Badges";
import { Slide18_Consistency } from "@/components/about/slides/Slide18_Consistency";
import { Slide19_Future } from "@/components/about/slides/Slide19_Future";
import { Slides20_22_Reviews } from "@/components/about/slides/Slides20_22_Reviews";
import { Slide23_FlowState } from "@/components/about/slides/Slide23_FlowState";
import { Slide24_Leaderboards } from "@/components/about/slides/Slide24_Leaderboards";
import { Slide25_TechMatrix } from "@/components/about/slides/Slide25_TechMatrix";
import { Slide27_PowerUser } from "@/components/about/slides/Slide27_PowerUser";
import { Slide28_OpenSource } from "@/components/about/slides/Slide28_OpenSource";
import { Slide29_Monolith } from "@/components/about/slides/Slide29_Monolith";

export default function AboutPage() {
    // The master scroll container. 
    // We will make it 3000vh since we have ~30 "slides" of content.
    const { scrollYProgress } = useScroll();

    // Global Progress Bar
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Split the scrolling into three distinct chunks.
    // Part 1: First 50% of vertical scroll -> Maps to 0.0 - 1.0 for original 14 slides
    // Part 2: 50% to 83.3% of vertical scroll -> Maps to 0.0 - 1.0 for slides 15-24
    // Part 3: Last 16.7% of vertical scroll -> Maps to 0.0 - 1.0 for final slides 25-29
    const part1Progress = useTransform(scrollYProgress, [0, 0.50], [0, 1]);
    const part2Progress = useTransform(scrollYProgress, [0.50, 0.833], [0, 1]);
    const part3Progress = useTransform(scrollYProgress, [0.833, 1.0], [0, 1]);

    return (
        <div className="relative w-full bg-[#070211]" style={{ height: "3000vh" }}>

            {/* Global Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-violet-500 via-rose-500 to-emerald-400 z-[100] origin-left"
                style={{ scaleX, width: "100%" }}
            />

            {/* Sticky Viewport Container */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">

                {/* Massive Ambient Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(7,2,17,0)_70%)] pointer-events-none -z-10" />

                {/* PART 1 SHOWN IN 0-50% SCROLL */}
                <Slide01_Hero progress={part1Progress} />
                <Slide02_Statement progress={part1Progress} />
                <Slide03_Catalyst progress={part1Progress} />
                <Slides04_07_Pipeline progress={part1Progress} />
                <Slide08_Arena progress={part1Progress} />
                <Slide09_Telemetry progress={part1Progress} />
                <Slide10_GlobalFeed progress={part1Progress} />
                <Slide11_Adaptive progress={part1Progress} />
                <Slide12_Gamification progress={part1Progress} />
                <Slide13_Team progress={part1Progress} />
                <Slide14_Manifesto progress={part1Progress} />

                {/* PART 2 SHOWN IN 50-83.3% SCROLL */}
                <Slide15_Ecosystem progress={part2Progress} />
                <Slide16_Dashboard progress={part2Progress} />
                <Slide17_Badges progress={part2Progress} />
                <Slide18_Consistency progress={part2Progress} />
                <Slide19_Future progress={part2Progress} />
                <Slides20_22_Reviews progress={part2Progress} />
                <Slide23_FlowState progress={part2Progress} />
                <Slide24_Leaderboards progress={part2Progress} />

                {/* PART 3 SHOWN IN 83.3-100% SCROLL */}
                <Slide25_TechMatrix progress={part3Progress} />
                <Slide27_PowerUser progress={part3Progress} />
                <Slide28_OpenSource progress={part3Progress} />
                <Slide29_Monolith progress={part3Progress} />

            </div>
        </div>
    );
}
