// profileSystem.ts – Warm/Light Theme Edition

export interface UserStats {
    xp: number; totalTests: number; avgWpm: number; bestWpm: number;
    avgAccuracy: number; streak: number; typingStreak: number;
    articlesRead: number; editorialsSaved: number; practiceMinutes: number;
    accuracyHighs: number; lastActiveDate: string;
}

export interface Badge {
    id: string; name: string; description: string; icon: string;
    tier: "bronze" | "silver" | "gold" | "platinum";
    xpReward: number; progressTarget: number; tip: string;
    condition: (s: UserStats) => boolean;
    progressValue: (s: UserStats) => number;
}

export interface DailyTask {
    id: string; title: string; description: string; icon: string;
    xpReward: number; target: number; progress: number; completed: boolean;
}

export interface TimelineItem {
    id: string; type: string; label: string; detail?: string;
    timestamp: number; icon: string; color: string;
}

export interface UserGoal {
    id: "dailyMinutes" | "weeklyArticles" | "monthlyStreak";
    label: string; target: number; current: number; unit: string; icon: string;
}

export interface LeaderboardEntry {
    rank: number; name: string; level: number; xp: number; wpm: number; streak: number; isUser?: boolean;
}

// ── XP & Level (Level = XP / 100 + 1) ─────────────────────────
export function levelFromXp(xp: number) { return Math.max(1, Math.floor(xp / 100) + 1); }
export function xpProgress(xp: number) {
    const level = levelFromXp(xp);
    const progress = xp - (level - 1) * 100;
    return { level, progress, pct: Math.min(1, progress / 100), nextLevelXp: 100 };
}

export const XP_REWARDS = {
    typing5min: 10, typing10min: 25, articleRead: 15, dailyStreak: 20, editorialRead: 10,
} as const;

// ── Ranks ──────────────────────────────────────────────────────
export const RANKS = [
    { name: "Rookie", icon: "🌱", color: "#7aaa50", minLevel: 1 },
    { name: "Explorer", icon: "🔍", color: "#c08060", minLevel: 5 },
    { name: "Learner", icon: "📖", color: "#e07830", minLevel: 10 },
    { name: "Scholar", icon: "🎓", color: "#d4900a", minLevel: 20 },
    { name: "Expert", icon: "⭐", color: "#e8a020", minLevel: 35 },
    { name: "Pro", icon: "🏅", color: "#d06820", minLevel: 50 },
    { name: "Champion", icon: "🏆", color: "#b84a10", minLevel: 70 },
    { name: "Legend", icon: "👑", color: "#9a3800", minLevel: 100 },
];
export function getRank(level: number) {
    for (let i = RANKS.length - 1; i >= 0; i--) if (level >= RANKS[i].minLevel) return RANKS[i];
    return RANKS[0];
}

// ── Tier Styles (warm palette) ─────────────────────────────────
export const TIER_STYLE = {
    bronze: { label: "Bronze", bg: "#fff7ed", border: "#e8a060", text: "#92400e", glow: "rgba(232,160,96,.3)" },
    silver: { label: "Silver", bg: "#f9f9f9", border: "#b0a090", text: "#6b5040", glow: "rgba(176,160,144,.3)" },
    gold: { label: "Gold", bg: "#fffde7", border: "#e8b800", text: "#7c5700", glow: "rgba(232,184,.44)" },
    platinum: { label: "Platinum", bg: "#f0fdf4", border: "#6aaa60", text: "#1a5c20", glow: "rgba(106,170,96,.4)" },
};

// ── Badges ─────────────────────────────────────────────────────
export const BADGES: Badge[] = [
    {
        id: "first_step", name: "First Step", icon: "👣", tier: "bronze",
        description: "Complete your first typing test", xpReward: 50, progressTarget: 1,
        tip: "Go to Practice and complete any article!", condition: s => s.totalTests >= 1, progressValue: s => Math.min(1, s.totalTests)
    },
    {
        id: "speed_starter", name: "Speed Starter", icon: "🚀", tier: "bronze",
        description: "Type for 5 consecutive days", xpReward: 100, progressTarget: 5,
        tip: "Practice every day — even 5 minutes counts!", condition: s => s.typingStreak >= 5, progressValue: s => Math.min(5, s.typingStreak)
    },
    {
        id: "quick_fingers", name: "Quick Fingers", icon: "⌨️", tier: "bronze",
        description: "Reach 40 WPM average", xpReward: 100, progressTarget: 40,
        tip: "Focus on rhythm first, speed follows", condition: s => s.avgWpm >= 40, progressValue: s => Math.min(40, s.avgWpm)
    },
    {
        id: "news_curious", name: "News Curious", icon: "📰", tier: "bronze",
        description: "Read 5 news articles", xpReward: 75, progressTarget: 5,
        tip: "Try the Practice section for article sessions", condition: s => s.articlesRead >= 5, progressValue: s => Math.min(5, s.articlesRead)
    },
    {
        id: "on_a_roll", name: "On A Roll", icon: "🎲", tier: "bronze",
        description: "3-day practice streak", xpReward: 80, progressTarget: 3,
        tip: "Come back tomorrow to keep the streak alive!", condition: s => s.streak >= 3, progressValue: s => Math.min(3, s.streak)
    },

    {
        id: "news_reader", name: "News Reader", icon: "📚", tier: "silver",
        description: "Read 20 news articles", xpReward: 200, progressTarget: 20,
        tip: "Try different topic categories each day", condition: s => s.articlesRead >= 20, progressValue: s => Math.min(20, s.articlesRead)
    },
    {
        id: "week_warrior", name: "Week Warrior", icon: "🗓️", tier: "silver",
        description: "7-day practice streak", xpReward: 200, progressTarget: 7,
        tip: "Even 5 minutes a day builds momentum!", condition: s => s.streak >= 7, progressValue: s => Math.min(7, s.streak)
    },
    {
        id: "dedicated", name: "Dedicated", icon: "💪", tier: "silver",
        description: "Complete 50 typing tests", xpReward: 300, progressTarget: 50,
        tip: "Every test builds real skill — keep going", condition: s => s.totalTests >= 50, progressValue: s => Math.min(50, s.totalTests)
    },
    {
        id: "accuracy_rising", name: "Sharp Eye", icon: "🎯", tier: "silver",
        description: "95%+ accuracy 5 times", xpReward: 250, progressTarget: 5,
        tip: "Slow down — accuracy comes before speed", condition: s => s.accuracyHighs >= 5, progressValue: s => Math.min(5, s.accuracyHighs)
    },

    {
        id: "accuracy_king", name: "Accuracy King", icon: "⚡", tier: "gold",
        description: "95%+ accuracy 10 times", xpReward: 500, progressTarget: 10,
        tip: "Take your time — precision is a superpower", condition: s => s.accuracyHighs >= 10, progressValue: s => Math.min(10, s.accuracyHighs)
    },
    {
        id: "interview_ready", name: "Interview Ready", icon: "🎓", tier: "gold",
        description: "Complete 30 typing tests", xpReward: 700, progressTarget: 30,
        tip: "Treat every session like a real interview", condition: s => s.totalTests >= 30, progressValue: s => Math.min(30, s.totalTests)
    },
    {
        id: "speed_machine", name: "Speed Machine", icon: "💨", tier: "gold",
        description: "Reach 80 WPM average", xpReward: 600, progressTarget: 80,
        tip: "Practice longer texts to build sustained speed", condition: s => s.avgWpm >= 80, progressValue: s => Math.min(80, s.avgWpm)
    },

    {
        id: "consistency_pro", name: "Consistency Pro", icon: "🔥", tier: "platinum",
        description: "30-day practice streak!", xpReward: 800, progressTarget: 30,
        tip: "Make it a morning habit — coffee + NewsMonkey", condition: s => s.streak >= 30, progressValue: s => Math.min(30, s.streak)
    },
    {
        id: "century_club", name: "Century Club", icon: "💯", tier: "platinum",
        description: "Complete 100 typing tests", xpReward: 1000, progressTarget: 100,
        tip: "You are in the top 5% — keep pushing!", condition: s => s.totalTests >= 100, progressValue: s => Math.min(100, s.totalTests)
    },
];

export function computeEarnedBadges(stats: UserStats) { return BADGES.filter(b => b.condition(stats)); }

// ── Daily Tasks ────────────────────────────────────────────────
const TASK_POOL: Omit<DailyTask, "progress" | "completed">[] = [
    { id: "type_5min", title: "Type for 5 Minutes", description: "Practice for at least 5 minutes", icon: "⌨️", xpReward: 10, target: 1 },
    { id: "type_article", title: "Type 2 News Articles", description: "Complete 2 article typing sessions", icon: "📄", xpReward: 30, target: 2 },
    { id: "read_editorial", title: "Read 1 Editorial", description: "Read an editorial from the section", icon: "📰", xpReward: 10, target: 1 },
    { id: "accuracy", title: "Accuracy Challenge", description: "Score 90%+ accuracy in a test", icon: "🎯", xpReward: 20, target: 1 },
    { id: "type_10min", title: "Type for 10 Minutes", description: "Practice for a full 10 minutes", icon: "⏱️", xpReward: 25, target: 1 },
    { id: "streak", title: "Protect Your Streak", description: "Complete any practice today", icon: "🔥", xpReward: 15, target: 1 },
    { id: "three_tests", title: "Complete 3 Tests", description: "Do 3 full typing sessions", icon: "✅", xpReward: 35, target: 3 },
    { id: "wpm_goal", title: "Beat Your Best WPM", description: "Hit a new personal WPM record", icon: "⚡", xpReward: 40, target: 1 },
];
export function getDailyTasks(): DailyTask[] {
    const today = new Date().toDateString();
    const seed = today.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const i1 = seed % TASK_POOL.length;
    const i2 = (seed * 7 + 3) % TASK_POOL.length;
    const t1 = TASK_POOL[i1];
    const t2 = TASK_POOL[i2 === i1 ? (i2 + 1) % TASK_POOL.length : i2];
    if (!t1 || !t2) return [];

    return [t1, t2].map(t => ({ ...t, progress: 0, completed: false }));
}

// Timeline is completely backend mapped now.

// Goals
export const DEFAULT_GOALS: UserGoal[] = [
    { id: "dailyMinutes", label: "Daily Practice", target: 10, current: 0, unit: "min", icon: "⏰" },
    { id: "weeklyArticles", label: "Weekly Articles", target: 5, current: 0, unit: "articles", icon: "📰" },
    { id: "monthlyStreak", label: "Monthly Streak", target: 30, current: 0, unit: "days", icon: "🔥" },
];

// ── User Stats default (moved logic to backend) ─────────────────
export function defaultStats(): UserStats {
    return { xp: 0, totalTests: 0, avgWpm: 0, bestWpm: 0, avgAccuracy: 0, streak: 0, typingStreak: 0, articlesRead: 0, editorialsSaved: 0, practiceMinutes: 0, accuracyHighs: 0, lastActiveDate: "" };
}

// ── Motivation Quotes ──────────────────────────────────────────
const QUOTES = [
    "Every word you type brings you closer to your dream job. 💼",
    "Consistency is the bridge between goals and accomplishment. 🌉",
    "Small progress is still progress — keep going! 🌱",
    "Your next opportunity starts with today's practice. ✨",
    "Champions are built through daily practice, not talent. 🏆",
    "Read more, type faster, dream bigger. 🚀",
];
export function getTodayQuote() {
    const seed = new Date().toDateString().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return QUOTES[seed % QUOTES.length];
}

// ── Leaderboard ────────────────────────────────────────────────
export function getMockLeaderboard(name: string, xp: number, wpm: number, streak: number): LeaderboardEntry[] {
    const board: LeaderboardEntry[] = [
        { rank: 1, name: "Arjun Sharma", level: 47, xp: 4750, wpm: 112, streak: 45 },
        { rank: 2, name: "Priya Nair", level: 42, xp: 4200, wpm: 105, streak: 38 },
        { rank: 3, name: "Dev Kapoor", level: 38, xp: 3800, wpm: 98, streak: 30 },
        { rank: 4, name: "Sneha Reddy", level: 33, xp: 3300, wpm: 91, streak: 22 },
        { rank: 5, name: "Rohan Mehta", level: 29, xp: 2900, wpm: 87, streak: 18 },
        { rank: 6, name: "Ananya Singh", level: 24, xp: 2400, wpm: 82, streak: 14 },
        { rank: 7, name: "Kiran Joshi", level: 21, xp: 2100, wpm: 78, streak: 11 },
        { rank: 8, name: "Tanvi Desai", level: 18, xp: 1800, wpm: 74, streak: 8 },
        { rank: 9, name: "Vikram Rao", level: 15, xp: 1500, wpm: 70, streak: 6 },
        { rank: 10, name: "Pooja Menon", level: 12, xp: 1200, wpm: 65, streak: 4 },
    ];
    const user: LeaderboardEntry = { rank: 0, name: name || "You", level: levelFromXp(xp), xp, wpm: Math.round(wpm), streak, isUser: true };
    const pos = board.findIndex(e => xp > e.xp);
    if (pos === -1) { user.rank = 11; return [...board, user]; }
    board.splice(pos, 0, user);
    return board.slice(0, 11).map((e, i) => ({ ...e, rank: i + 1 }));
}
