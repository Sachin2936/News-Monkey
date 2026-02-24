"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTypingStore } from '@/store/useTypingStore';
import { Keyboard, ExternalLink, Calendar } from 'lucide-react';
import { soundManager } from '@/lib/SoundManager';

export default function TypingArea() {
    const {
        article,
        userInput,
        updateInput,
        isActive,
        isPaused,
        isFinished,
        cursorIndex,
        soundEnabled,
        soundProfile,
        hideErrorSound,
        focusMode,
        toggleFocusMode,
        pauseTest,
        resumeTest,
        // appearance settings
        fontSize,
        caretStyle,
        smoothCaret,
        highlightWord,
        autoPause,
    } = useTypingStore();

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [focus, setFocus] = useState(false);
    const [cheatWarning, setCheatWarning] = useState(false);

    // Auto-pause on idle (3 seconds with no keystroke)
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearIdleTimer = useCallback(() => {
        if (idleTimer.current) { clearTimeout(idleTimer.current); idleTimer.current = null; }
    }, []);
    const resetIdleTimer = useCallback(() => {
        if (!autoPause || !isActive || isFinished) return;
        clearIdleTimer();
        idleTimer.current = setTimeout(() => {
            pauseTest();
        }, 3000);
    }, [autoPause, isActive, isFinished, clearIdleTimer, pauseTest]);
    useEffect(() => { return () => clearIdleTimer(); }, [clearIdleTimer]);

    // Initialize audio on first interaction
    useEffect(() => {
        const initAudio = () => soundManager.init();
        window.addEventListener('keydown', initAudio, { once: true });
        window.addEventListener('click', initAudio, { once: true });
        return () => {
            window.removeEventListener('keydown', initAudio);
            window.removeEventListener('click', initAudio);
        };
    }, []);

    useEffect(() => {
        if (isActive && !isPaused && !isFinished) {
            inputRef.current?.focus();
        }
    }, [isActive, isPaused, isFinished]);

    // Anti-cheat: Detect tab switch
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive && !isFinished) {
                pauseTest();
                setCheatWarning(true);
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isActive, isFinished, pauseTest]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (isFinished) return;
        // Play sound — suppress error beep when hideErrorSound is on
        if (soundEnabled) {
            const text = article?.content || '';
            const char = e.target.value[e.target.value.length - 1];
            const expected = text[e.target.value.length - 1];
            const isWrong = char !== expected;
            if (!isWrong || !hideErrorSound) {
                soundManager.play(soundProfile);
            }
        }
        resetIdleTimer();
        updateInput(e.target.value);
    };

    const handleFocus = () => {
        setFocus(true);
        if (isPaused && !isFinished) resumeTest();
    };

    const handleBlur = () => setFocus(false);

    // Auto-scroll logic
    useEffect(() => {
        const cursorElement = document.getElementById('typing-cursor');
        if (cursorElement && scrollRef.current) {
            const container = scrollRef.current;
            const cursorTop = cursorElement.offsetTop;
            const containerHeight = container.clientHeight;

            if (cursorTop > container.scrollTop + containerHeight - 120) {
                container.scrollTo({ top: cursorTop - 120, behavior: 'smooth' });
            } else if (cursorIndex === 0) {
                container.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [cursorIndex]);

    const text = article?.content || "";

    // ── Caret renderer ──────────────────────────────────────────────
    // NOTE: No layoutId — that caused the caret to animate across DOM positions
    // (oscillating back to the start on every keystroke).
    // Instead we use `key={cursorIndex}` at the call site so the span
    // re-mounts in-place and just blinks without spatial interpolation.
    const renderCaret = (currentFocus: boolean) => {
        if (!currentFocus) return null;

        if (caretStyle === 'block') {
            return (
                <motion.span
                    key={`caret-block-${cursorIndex}`}
                    className="absolute inset-0 rounded-sm pointer-events-none"
                    style={{ background: 'rgba(99,102,241,0.32)', border: '1.5px solid rgba(99,102,241,0.7)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                />
            );
        }
        if (caretStyle === 'bar') {
            return (
                <motion.span
                    key={`caret-bar-${cursorIndex}`}
                    className="absolute -left-[1.5px] top-[10%] bottom-[10%] w-[2.5px] bg-primary rounded-full pointer-events-none"
                    style={{ boxShadow: '0 0 8px rgba(99,102,241,0.8)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                />
            );
        }
        // default: underline
        return (
            <motion.span
                key={`caret-ul-${cursorIndex}`}
                className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full pointer-events-none"
                style={{ boxShadow: '0 0 10px rgba(99,102,241,0.8)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            />
        );
    };

    // ── Character/word renderer ──────────────────────────────────────
    const renderedChars = useMemo(() => {
        const words: { char: string, index: number }[][] = [];
        let currentWord: { char: string, index: number }[] = [];

        text.split('').forEach((char, i) => {
            currentWord.push({ char, index: i });
            if (char === ' ' || char === '\n') {
                words.push(currentWord);
                currentWord = [];
            }
        });
        if (currentWord.length > 0) words.push(currentWord);

        // Find which word the cursor is currently in
        let cursorWordIdx = -1;
        if (highlightWord) {
            let charsSoFar = 0;
            for (let wi = 0; wi < words.length; wi++) {
                charsSoFar += words[wi].length;
                if (userInput.length < charsSoFar) { cursorWordIdx = wi; break; }
            }
        }

        return words.map((word, wordIdx) => {
            const isCurrentWord = highlightWord && wordIdx === cursorWordIdx;
            return (
                <span
                    key={wordIdx}
                    className="inline-block"
                    style={isCurrentWord
                        ? { background: 'rgba(99,102,241,0.08)', borderRadius: 4, outline: '1.5px solid rgba(99,102,241,0.25)' }
                        : undefined
                    }
                >
                    {word.map(({ char, index: i }) => {
                        let color = 'text-muted-foreground/40';
                        const isTyped = i < userInput.length;
                        const isCorrect = isTyped && userInput[i] === text[i];
                        const isCurrent = i === userInput.length;

                        if (isTyped) {
                            color = isCorrect
                                ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                : 'text-destructive bg-destructive/10 rounded-sm';
                        }

                        return (
                            <span
                                key={i}
                                className={`${color} relative inline-block min-w-[0.5ch]`}
                                id={isCurrent ? 'typing-cursor' : undefined}
                            >
                                {char === '\n' ? <br /> : char}
                                {isCurrent && renderCaret(focus)}
                            </span>
                        );
                    })}
                </span>
            );
        });
    }, [text, userInput, focus, caretStyle, smoothCaret, highlightWord]);

    return (
        <div className={`relative w-full group transition-all duration-700 ${focusMode && isActive ? 'mt-4 scale-105' : 'mt-4'}`}>
            {/* Container for the text */}
            <div
                ref={scrollRef}
                onClick={() => inputRef.current?.focus()}
                className={`relative min-h-[320px] max-h-[460px] overflow-y-auto px-8 py-8 rounded-[2.5rem] border transition-all duration-500 cursor-text scrollbar-hide ${focus
                    ? 'bg-card/80 border-primary/40 shadow-[0_0_80px_rgba(59,130,246,0.1)] ring-1 ring-primary/20 backdrop-blur-sm'
                    : 'bg-card/40 border-border/50 shadow-xl'
                    }`}
            >
                {/* The text — fontSize from settings */}
                <div
                    className={`relative font-medium tracking-tight select-none transition-all ${focusMode && isActive ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.85, wordSpacing: '0.06em' }}
                >
                    {renderedChars}
                </div>

                {/* Focus Warning Overlay */}
                {!focus && !isFinished && isActive && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center z-20 transition-all">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                                <Keyboard className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-2xl font-black font-outfit text-foreground">
                                    {autoPause && isPaused ? 'Auto-Paused (Idle)' : 'Focus Required'}
                                </p>
                                <p className="text-muted-foreground">Click anywhere to resume your session</p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Anti-cheat Overlay */}
                {cheatWarning && isPaused && !focus && (
                    <div className="absolute inset-x-0 top-0 p-4 bg-destructive/10 border-b border-destructive/20 backdrop-blur-md text-center text-xs font-bold uppercase tracking-widest text-destructive z-30">
                        Tab switch detected. Test paused to ensure accuracy.
                    </div>
                )}
            </div>

            {/* Hidden Textarea */}
            <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={isFinished}
                className="absolute top-0 left-0 opacity-0 w-1 h-1 pointer-events-none"
                autoFocus
            />

            <div className={`mt-6 flex flex-col md:flex-row justify-between items-center px-4 gap-4 transition-opacity duration-500 ${focusMode && isActive && focus ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-foreground font-medium">
                            {article?.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            }) : 'Recent'}
                        </span>
                    </div>
                    <a
                        href={article?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border hover:bg-accent hover:text-accent-foreground transition-all flex items-center gap-2 group"
                    >
                        Source: <span className="text-foreground font-medium group-hover:text-primary">{article?.source || 'Link'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
                <div className="flex gap-6 items-center">
                    <button
                        onClick={toggleFocusMode}
                        className={`text-xs font-bold uppercase tracking-widest transition-colors ${focusMode ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        Focus Mode {focusMode ? '(ON)' : '(OFF)'}
                    </button>
                </div>
            </div>
        </div>
    );
}
