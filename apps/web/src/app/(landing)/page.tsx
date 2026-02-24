"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";

// V4 30-Block Cinematic Masterpiece
import { Slide01_Explosion } from "@/components/landing/slides/Slide01_Explosion";
import { Slide02_ThePromise } from "@/components/landing/slides/Slide02_ThePromise";
import { Slide03_Noise } from "@/components/landing/slides/Slide03_Noise";

import { Slide06_Rebuild } from "@/components/landing/slides/Slide06_Rebuild";
import { Slide07_Clarity } from "@/components/landing/slides/Slide07_Clarity";
import { Slide09_Velocity } from "@/components/landing/slides/Slide09_Velocity";
import { Slide10_CoreValues } from "@/components/landing/slides/Slide10_CoreValues";

import { Slide12_Categories } from "@/components/landing/slides/Slide12_Categories";
import { Slide14_Delivery } from "@/components/landing/slides/Slide14_Delivery";
import { Slide15_Global } from "@/components/landing/slides/Slide15_Global";
import { Slide16_Bias } from "@/components/landing/slides/Slide16_Bias";
import { Slide17_Reader } from "@/components/landing/slides/Slide17_Reader";

import { Slide19_LiveCounter } from "@/components/landing/slides/Slide19_LiveCounter";
import { Slide20_QuoteMorph } from "@/components/landing/slides/Slide20_QuoteMorph";

import { Slide22_WallOfLove } from "@/components/landing/slides/Slide22_WallOfLove";

import { Slide29_Founder } from "@/components/landing/slides/Slide29_Founder";
import { Slide30_FinalCTA } from "@/components/landing/slides/Slide30_FinalCTA";
import { HeroOverlay } from "@/components/landing/HeroOverlay";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LandingPage() {
    const { scrollYProgress } = useScroll();
    const { data: session } = authClient.useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace("/dashboard");
        }
    }, [session, router]);

    return (
        <main className="bg-black min-h-screen text-slate-100 font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* 30 Slides * 100vh = 3000vh for a massive smooth journey */}
            <div className="relative h-[3000vh] w-full">
                <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
                    {/* Elevated Overlay so links are clickable above the slides */}
                    <HeroOverlay progress={scrollYProgress} />

                    {/* Act 1: The Hook */}
                    <Slide01_Explosion progress={scrollYProgress} />
                    <Slide02_ThePromise progress={scrollYProgress} />
                    <Slide03_Noise progress={scrollYProgress} />



                    {/* Act 2: The Revelation */}
                    <Slide06_Rebuild progress={scrollYProgress} />
                    <Slide07_Clarity progress={scrollYProgress} />
                    <Slide09_Velocity progress={scrollYProgress} />
                    <Slide10_CoreValues progress={scrollYProgress} />

                    {/* Act 3: The Features */}
                    <Slide12_Categories progress={scrollYProgress} />
                    <Slide14_Delivery progress={scrollYProgress} />
                    <Slide15_Global progress={scrollYProgress} />
                    <Slide16_Bias progress={scrollYProgress} />
                    <Slide17_Reader progress={scrollYProgress} />

                    {/* Act 4: Proof & Stats */}
                    <Slide19_LiveCounter progress={scrollYProgress} />
                    <Slide20_QuoteMorph progress={scrollYProgress} />
                    <Slide22_WallOfLove progress={scrollYProgress} />

                    {/* Act 5: The Future & CTA */}
                    <Slide29_Founder progress={scrollYProgress} />
                    <Slide30_FinalCTA progress={scrollYProgress} />


                </div>
            </div>
        </main>
    );
}
