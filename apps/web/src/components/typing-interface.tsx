"use client";

import { useEffect, useRef, useState } from "react";

interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalChars: number;
}

interface TypingInterfaceProps {
  newsHeadline: string;
  onComplete?: (stats: TypingStats) => void;
}

export default function TypingInterface({ newsHeadline, onComplete }: TypingInterfaceProps) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (userInput.length === 0) return;

    // Start timer on first character
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Calculate stats
    const correctChars = userInput.split("").filter((char, i) => char === newsHeadline[i]).length;
    const errors = userInput.length - correctChars;
    const accuracy = userInput.length > 0 ? (correctChars / userInput.length) * 100 : 100;

    // Calculate WPM
    let wpm = 0;
    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = userInput.length / 5; // standard: 5 chars = 1 word
      wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    }

    setStats({
      wpm,
      accuracy: Math.round(accuracy),
      errors,
      correctChars,
      totalChars: userInput.length,
    });

    // Check if complete
    if (userInput === newsHeadline) {
      setIsComplete(true);
      onComplete?.({
        wpm,
        accuracy: Math.round(accuracy),
        errors,
        correctChars,
        totalChars: userInput.length,
      });
    }
  }, [userInput, newsHeadline, startTime, onComplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow typing up to the headline length
    if (value.length <= newsHeadline.length) {
      setUserInput(value);
    }
  };

  const handleReset = () => {
    setUserInput("");
    setStartTime(null);
    setIsComplete(false);
    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
    });
    inputRef.current?.focus();
  };

  const getCharClass = (index: number) => {
    if (index >= userInput.length) {
      return "text-muted-foreground"; // Not typed yet
    }
    if (userInput[index] === newsHeadline[index]) {
      return "text-green-500 bg-green-500/10"; // Correct
    }
    return "text-red-500 bg-red-500/10"; // Incorrect
  };

  const getCurrentCharIndex = userInput.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Stats Display */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-6 text-center space-y-2 hover:border-primary/50 transition-colors">
          <div className="text-4xl font-bold text-primary">{stats.wpm}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">WPM</div>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center space-y-2 hover:border-primary/50 transition-colors">
          <div className="text-4xl font-bold text-primary">{stats.accuracy}%</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Accuracy</div>
        </div>
        <div className="bg-card border rounded-lg p-6 text-center space-y-2 hover:border-primary/50 transition-colors">
          <div className="text-4xl font-bold text-primary">{stats.errors}</div>
          <div className="text-sm text-muted-foreground uppercase tracking-wide">Errors</div>
        </div>
      </div>

      {/* Typing Area */}
      <div className="bg-card border rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">Type this headline:</h3>
        </div>

        {/* Display Text */}
        <div className="bg-muted/30 rounded-lg p-6 font-mono text-xl leading-relaxed min-h-[120px] flex items-center">
          <div className="w-full">
            {newsHeadline.split("").map((char, index) => (
              <span
                key={index}
                className={`${getCharClass(index)} ${
                  index === getCurrentCharIndex ? "border-b-2 border-primary animate-pulse" : ""
                } transition-all duration-100 px-0.5 rounded`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="w-full bg-background border rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Start typing..."
          disabled={isComplete}
          autoComplete="off"
          spellCheck={false}
        />

        {/* Complete Message */}
        {isComplete && (
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-2xl font-bold text-green-500">🎉 Complete!</div>
            <p className="text-muted-foreground">
              You typed at {stats.wpm} WPM with {stats.accuracy}% accuracy
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Click on the input field and start typing to begin. Your stats will update in real-time!</p>
      </div>
    </div>
  );
}
