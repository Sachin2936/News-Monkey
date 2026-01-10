"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Zap, Target, TrendingUp, ArrowRight } from "lucide-react";

export default function Dashboard({ session }: { session: typeof authClient.$Infer.Session }) {
  // Mock stats - in production, these would come from a database
  const stats = {
    totalSessions: 0,
    averageWPM: 0,
    averageAccuracy: 0,
    headlinesCompleted: 0,
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Ready to improve your typing skills today?
          </p>
        </div>

        {/* Quick Action */}
        <Link
          href="/practice"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 shadow-lg"
        >
          <Zap className="w-5 h-5" />
          Start Typing Practice
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-card border rounded-xl p-6 space-y-3 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </div>
            <div className="text-3xl font-bold">{stats.totalSessions}</div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-3 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Average WPM</div>
            </div>
            <div className="text-3xl font-bold">{stats.averageWPM}</div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-3 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-3xl font-bold">{stats.averageAccuracy}%</div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-3 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Headlines Done</div>
            </div>
            <div className="text-3xl font-bold">{stats.headlinesCompleted}</div>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border rounded-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-semibold">Start Practice</h3>
              <p className="text-sm text-muted-foreground">
                Click the button above to begin your typing practice with real news headlines.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Your stats will be saved automatically and displayed here on your dashboard.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-semibold">Improve Skills</h3>
              <p className="text-sm text-muted-foreground">
                Practice regularly to see your typing speed and accuracy improve over time.
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-bold">💡 Pro Tips</h3>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Practice for 15-20 minutes daily for best results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Focus on accuracy first, speed will follow naturally</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Keep your wrists elevated and fingers curved</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Take breaks every 30 minutes to avoid fatigue</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
