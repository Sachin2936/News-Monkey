"use client";

import { useState } from "react";
import TypingInterface from "@/components/typing-interface";
import { RefreshCw } from "lucide-react";

// Sample news headlines - in production, these would come from an API
const NEWS_HEADLINES = [
    "Scientists discover new species of deep-sea creature in the Pacific Ocean",
    "Global tech summit announces breakthrough in renewable energy storage",
    "International space station welcomes new crew members for six-month mission",
    "Major cities worldwide commit to carbon neutrality by 2030",
    "Researchers develop AI system that can predict natural disasters with 95% accuracy",
    "New archaeological findings shed light on ancient civilization in South America",
    "World leaders gather for climate summit to discuss urgent environmental action",
    "Breakthrough medical treatment shows promise in fighting rare diseases",
    "Tech giant unveils revolutionary smartphone with week-long battery life",
    "Olympic athletes break multiple world records at international championships",
    "Astronomers detect potentially habitable exoplanet 100 light-years away",
    "Innovative farming techniques help combat food insecurity in developing nations",
    "Historic peace agreement signed between neighboring countries after decades of conflict",
    "Scientists make progress in developing universal flu vaccine",
    "Major museum announces discovery of previously unknown works by famous artist",
];

export default function PracticePage() {
    const [currentHeadline, setCurrentHeadline] = useState(
        NEWS_HEADLINES[Math.floor(Math.random() * NEWS_HEADLINES.length)]
    );
    const [completedCount, setCompletedCount] = useState(0);

    const getNewHeadline = () => {
        let newHeadline;
        do {
            newHeadline = NEWS_HEADLINES[Math.floor(Math.random() * NEWS_HEADLINES.length)];
        } while (newHeadline === currentHeadline && NEWS_HEADLINES.length > 1);
        setCurrentHeadline(newHeadline);
    };

    const handleComplete = () => {
        setCompletedCount((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Typing Practice
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Type the news headline below as fast and accurately as you can
                    </p>
                </div>

                {/* Session Stats */}
                <div className="flex justify-center items-center gap-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{completedCount}</div>
                        <div className="text-sm text-muted-foreground">Headlines Completed</div>
                    </div>
                    <button
                        onClick={getNewHeadline}
                        className="flex items-center gap-2 px-6 py-3 bg-card border rounded-lg hover:bg-accent transition-colors group"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span>New Headline</span>
                    </button>
                </div>

                {/* Typing Interface */}
                <TypingInterface
                    key={currentHeadline}
                    newsHeadline={currentHeadline}
                    onComplete={handleComplete}
                />

                {/* Tips Section */}
                <div className="max-w-2xl mx-auto mt-12 bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">💡 Typing Tips</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Keep your eyes on the screen, not your keyboard</li>
                        <li>• Maintain proper posture with feet flat on the floor</li>
                        <li>• Use all ten fingers and keep them on the home row</li>
                        <li>• Focus on accuracy first, speed will come naturally</li>
                        <li>• Take breaks every 20-30 minutes to avoid strain</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
