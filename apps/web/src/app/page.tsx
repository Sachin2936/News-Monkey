"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Award, Newspaper } from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)] -z-10" />

        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
              <Newspaper className="w-4 h-4" />
              <span>Stay Informed While You Type</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Master Typing with
              <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Real News Headlines
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Improve your typing speed while staying updated with the latest news.
              Practice makes perfect, and knowledge makes you powerful.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/practice"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                Start Typing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-card border rounded-lg font-semibold text-lg hover:bg-accent transition-all hover:scale-105"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">News Headlines</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">Real-time</div>
                <div className="text-sm text-muted-foreground">Feedback</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">Track</div>
                <div className="text-sm text-muted-foreground">Progress</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">Why Choose News Monkey?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The perfect blend of skill development and staying informed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-card border rounded-xl p-8 space-y-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Real-time Feedback</h3>
              <p className="text-muted-foreground">
                Get instant feedback on your typing speed, accuracy, and errors as you type.
                Watch your WPM improve in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-card border rounded-xl p-8 space-y-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Newspaper className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Latest News</h3>
              <p className="text-muted-foreground">
                Practice typing with real, current news headlines. Stay informed about world events
                while improving your skills.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-card border rounded-xl p-8 space-y-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all hover:-translate-y-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement over time with detailed statistics and performance metrics.
                See how far you've come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start improving your typing skills in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold">Choose Your News</h3>
                <p className="text-muted-foreground text-lg">
                  Select from a variety of news categories or let us pick a random headline for you.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold">Start Typing</h3>
                <p className="text-muted-foreground text-lg">
                  Type the headline as accurately and quickly as you can. See real-time feedback on every keystroke.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start group">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-2xl font-bold">Track & Improve</h3>
                <p className="text-muted-foreground text-lg">
                  Review your performance, track your progress over time, and watch your skills grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Become a Typing Master?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users improving their typing skills while staying informed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/practice"
                className="group px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/25"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
