"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Newspaper, Keyboard, ChevronDown } from "lucide-react";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        <div className="container mx-auto z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl text-sm font-bold uppercase tracking-[0.2em] text-primary"
            >
              <Newspaper className="w-4 h-4" />
              <span>Real-Time News Typing</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl md:text-8xl font-black font-outfit tracking-tighter"
            >
              Type the <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">Future.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Master your typing skills while staying ahead of the world.
              Real headlines, real-time stats, premium experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <Link
                href={"/practice" as any}
                className="group relative px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/40 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-foreground/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <Keyboard className="w-6 h-6" />
                Start Typing Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={"/about" as any}
                className="px-10 py-5 bg-muted/50 border border-border rounded-2xl font-bold text-xl hover:bg-muted transition-all backdrop-blur-xl flex items-center gap-3"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground/50"
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative bg-muted/50 backdrop-blur-lg border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Live News Flux",
                desc: "Type from a constant stream of global news across 6+ categories.",
                icon: Newspaper,
                color: "text-blue-500 dark:text-blue-400"
              },
              {
                title: "Deep Metrics",
                desc: "Real-time WPM, accuracy, and error tracking with visual analytics.",
                icon: Target,
                color: "text-purple-500 dark:text-purple-400"
              },
              {
                title: "Peak Performance",
                desc: "Zero-latency typing engine designed for competitive speed practicing.",
                icon: Zap,
                color: "text-amber-500 dark:text-amber-400"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-card border border-border hover:border-primary/50 transition-all space-y-6 group"
              >
                <div className={`w-16 h-16 rounded-3xl bg-muted border border-border flex items-center justify-center ${feature.color} group-hover:bg-primary/10 transition-colors`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black font-outfit">{feature.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose NewsMonkey Section */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black font-outfit tracking-tight mb-4">
              Why <span className="text-primary">NewsMonkey</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practice typing with purpose. Stay informed while you improve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Learn While You Type",
                desc: "Stay updated with real news from around the world while improving your typing speed and accuracy.",
                icon: "📰"
              },
              {
                title: "Track Your Progress",
                desc: "Detailed stats including WPM, accuracy, and CPM help you measure improvement over time.",
                icon: "📊"
              },
              {
                title: "Multiple Categories",
                desc: "Choose from technology, sports, business, entertainment, science, and health news.",
                icon: "🗂️"
              },
              {
                title: "Cloud Sync",
                desc: "Your typing history syncs across devices. Never lose your progress again.",
                icon: "☁️"
              },
              {
                title: "Customizable Experience",
                desc: "Choose your preferred keyboard sounds, focus mode, and session duration.",
                icon: "⚙️"
              },
              {
                title: "Beautiful Theming",
                desc: "Switch between light and dark modes for a comfortable typing experience.",
                icon: "🎨"
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <div className="text-3xl">{benefit.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
