import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { dashboardService } from '@/services/dashboard.service';

interface Article {
  title: string;
  content: string;
  url: string;
  source: string;
  category: string;
  publishedAt: string;
}

export interface HistoryItem {
  id: string;
  wpm: number;
  accuracy: number;
  cpm: number;
  date: string;
  region: 'us' | 'in';
  article: {
    title: string;
    source: string;
    url: string;
  };
}

interface TypingState {
  // Config
  duration: number; // in seconds
  category: string;
  region: 'us' | 'in';

  // Article Data
  article: Article | null;

  // Game State
  startTime: number | null;
  endTime: number | null;
  isPaused: boolean;
  isActive: boolean;
  isFinished: boolean;

  // Typing Progress
  userInput: string;
  cursorIndex: number;
  errors: number;
  totalCharsTyped: number;
  correctCharsTyped: number;
  // Monotonic error counter — NEVER decreases on backspace
  totalErrorsEver: number;
  // Previous input length so we can detect new keystrokes vs deletions
  prevInputLength: number;

  // Stats
  wpm: number;
  accuracy: number;
  cpm: number;
  timeLeft: number;

  // Settings — sound
  soundEnabled: boolean;
  soundProfile: 'mechanical' | 'clicky' | 'thock' | 'blaster' | 'lightsaber';
  hideErrorSound: boolean;

  // Settings — practice
  focusMode: boolean;
  showLiveWpm: boolean;
  autoPause: boolean;

  // Settings — appearance
  theme: 'system' | 'light' | 'dark';
  fontSize: number;           // px, applied to typing area text
  caretStyle: 'underline' | 'block' | 'bar';
  smoothCaret: boolean;
  animatedBg: boolean;

  // Settings — typing behaviour
  highlightWord: boolean;

  // History
  history: HistoryItem[];

  // Actions
  setDuration: (duration: number) => void;
  setCategory: (category: string) => void;
  setArticle: (article: Article) => void;
  startTest: () => void;
  pauseTest: () => void;
  resumeTest: () => void;
  resetTest: () => void;
  finishTest: () => void;
  updateInput: (input: string) => void;
  calculateStats: () => void;
  toggleSound: () => void;
  setSoundProfile: (profile: 'mechanical' | 'clicky' | 'thock' | 'blaster' | 'lightsaber') => void;
  toggleFocusMode: () => void;
  setShowLiveWpm: (v: boolean) => void;
  setAutoPause: (v: boolean) => void;
  setTheme: (v: 'system' | 'light' | 'dark') => void;
  setFontSize: (v: number) => void;
  setCaretStyle: (v: 'underline' | 'block' | 'bar') => void;
  setSmoothCaret: (v: boolean) => void;
  setAnimatedBg: (v: boolean) => void;
  setHighlightWord: (v: boolean) => void;
  setHideErrorSound: (v: boolean) => void;
  repeatArticle: () => void;
  setTimeLeft: (time: number) => void;
  setRegion: (region: 'us' | 'in') => void;
  addResultToHistory: () => void;
  clearHistory: () => void;
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      duration: 60,
      category: 'general',
      region: 'us',
      article: null,
      startTime: null,
      endTime: null,
      isPaused: false,
      isActive: false,
      isFinished: false,
      userInput: '',
      cursorIndex: 0,
      errors: 0,
      totalCharsTyped: 0,
      correctCharsTyped: 0,
      totalErrorsEver: 0,
      prevInputLength: 0,
      wpm: 0,
      accuracy: 0,
      cpm: 0,
      timeLeft: 60,
      soundEnabled: true,
      soundProfile: 'mechanical',
      hideErrorSound: false,
      focusMode: false,
      showLiveWpm: true,
      autoPause: false,
      theme: 'system',
      fontSize: 32,
      caretStyle: 'underline',
      smoothCaret: true,
      animatedBg: true,
      highlightWord: false,
      history: [],

      setDuration: (duration: number) => set({ duration, timeLeft: duration }),
      setCategory: (category: string) => set({ category }),
      setArticle: (article: Article) => set({ article, userInput: '', cursorIndex: 0, errors: 0, isActive: false, isFinished: false }),

      startTest: () => set({
        startTime: Date.now(),
        isActive: true,
        isPaused: false,
        isFinished: false,
        userInput: '',
        cursorIndex: 0,
        errors: 0,
        totalCharsTyped: 0,
        correctCharsTyped: 0,
        totalErrorsEver: 0,
        prevInputLength: 0,
        wpm: 0,
        accuracy: 100,
        cpm: 0,
        timeLeft: get().duration
      }),

      pauseTest: () => set({ isPaused: true, isActive: false }),
      resumeTest: () => set({ isPaused: false, isActive: true }),

      resetTest: () => set({
        article: null,
        isActive: false,
        isPaused: false,
        isFinished: false,
        userInput: '',
        cursorIndex: 0,
        errors: 0,
        totalCharsTyped: 0,
        correctCharsTyped: 0,
        totalErrorsEver: 0,
        prevInputLength: 0,
        startTime: null,
        endTime: null,
        wpm: 0,
        accuracy: 0,
        cpm: 0,
        timeLeft: get().duration
      }),

      finishTest: () => {
        get().calculateStats();
        set({ isFinished: true, isActive: false, endTime: Date.now() });
        get().addResultToHistory();
      },

      updateInput: (input: string) => {
        const { article, isActive, startTest, isFinished, prevInputLength, totalErrorsEver } = get();
        if (isFinished) return;
        if (!isActive) startTest();

        const targetText = article?.content || '';
        let currentErrors = 0;
        let correctChars = 0;

        for (let i = 0; i < input.length; i++) {
          if (input[i] !== targetText[i]) {
            currentErrors++;
          } else {
            correctChars++;
          }
        }

        // Only count NEW wrong keystrokes — never let deleting reduce totalErrorsEver.
        // If the user typed a new character (input grew) and it's wrong, add to the
        // permanent error tally. Backspace/delete never reduces this counter.
        let newTotalErrorsEver = totalErrorsEver;
        if (input.length > prevInputLength) {
          // A new character was added — check if it's wrong
          const newCharIndex = input.length - 1;
          if (input[newCharIndex] !== targetText[newCharIndex]) {
            newTotalErrorsEver = totalErrorsEver + 1;
          }
        }

        set({
          userInput: input,
          cursorIndex: input.length,
          errors: currentErrors,
          totalCharsTyped: input.length,
          correctCharsTyped: correctChars,
          totalErrorsEver: newTotalErrorsEver,
          prevInputLength: input.length,
        });

        if (input.length === targetText.length) {
          get().finishTest();
        } else {
          get().calculateStats();
        }
      },

      calculateStats: () => {
        const { startTime, correctCharsTyped, totalCharsTyped, totalErrorsEver, isFinished, endTime } = get();
        if (!startTime) return;

        const now = isFinished && endTime ? endTime : Date.now();
        const timeElapsedMinutes = (now - startTime) / 60000;

        if (timeElapsedMinutes <= 0) return;

        const wpm = Math.round((correctCharsTyped / 5) / timeElapsedMinutes);
        const cpm = Math.round(correctCharsTyped / timeElapsedMinutes);

        // Accuracy uses totalErrorsEver (monotonically increasing) so deleting
        // a wrong character doesn't restore accuracy to 100%.
        // Base = total chars typed ever (errors + correct at current position)
        const totalEver = totalCharsTyped + totalErrorsEver;
        const accuracy = totalEver > 0
          ? Math.max(0, Math.round(((totalEver - totalErrorsEver) / totalEver) * 100))
          : 100;

        set({ wpm, cpm, accuracy });
      },

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundProfile: (soundProfile) => set({ soundProfile }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      setShowLiveWpm: (showLiveWpm) => set({ showLiveWpm }),
      setAutoPause: (autoPause) => set({ autoPause }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setCaretStyle: (caretStyle) => set({ caretStyle }),
      setSmoothCaret: (smoothCaret) => set({ smoothCaret }),
      setAnimatedBg: (animatedBg) => set({ animatedBg }),
      setHighlightWord: (highlightWord) => set({ highlightWord }),
      setHideErrorSound: (hideErrorSound) => set({ hideErrorSound }),
      repeatArticle: () => {
        if (get().article) {
          set({
            userInput: '',
            cursorIndex: 0,
            errors: 0,
            totalCharsTyped: 0,
            correctCharsTyped: 0,
            totalErrorsEver: 0,
            prevInputLength: 0,
            isActive: false,
            isFinished: false,
            startTime: null,
            endTime: null,
            wpm: 0,
            accuracy: 100,
            cpm: 0,
            timeLeft: get().duration
          });
        }
      },
      setTimeLeft: (timeLeft: number) => set({ timeLeft }),
      setRegion: (region: 'us' | 'in') => set({ region }),

      addResultToHistory: () => {
        const { wpm, accuracy, cpm, article, region, errors, totalCharsTyped, category } = get();
        if (!article) return;

        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 11),
          wpm,
          accuracy,
          cpm,
          date: new Date().toISOString(),
          region,
          article: {
            title: article.title,
            source: article.source,
            url: article.url
          }
        };

        set(state => ({
          history: [newItem, ...state.history].slice(0, 10) // Keep last 10 results
        }));

        // Also save to backend (fire and forget - don't block on this)
        dashboardService.saveTypingResult({
          articleTitle: article.title,
          articleSource: article.source,
          articleUrl: article.url,
          wpm,
          accuracy,
          errors,
          totalCharsTyped,
          category: category || article.category || 'general',
          region,
          cpm,
          publishedAt: article.publishedAt,
        }).catch(console.error);
      },

      clearHistory: () => {
        set({ history: [] });
        dashboardService.clearTypingResults().catch(console.error);
      },
    }),
    {
      name: 'news-monkey-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // sound
        soundEnabled: state.soundEnabled,
        soundProfile: state.soundProfile,
        hideErrorSound: state.hideErrorSound,
        // practice
        focusMode: state.focusMode,
        showLiveWpm: state.showLiveWpm,
        autoPause: state.autoPause,
        // appearance
        theme: state.theme,
        fontSize: state.fontSize,
        caretStyle: state.caretStyle,
        smoothCaret: state.smoothCaret,
        animatedBg: state.animatedBg,
        // typing behaviour
        highlightWord: state.highlightWord,
        // history
        history: state.history,
        // config
        duration: state.duration,
      }),
      version: 4,
      migrate: (persisted: unknown) => {
        const s = persisted as Record<string, unknown>;
        s.fontSize = 32;
        return s;
      },
    }
  )
);
