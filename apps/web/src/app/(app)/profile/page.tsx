"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import {
    Activity, Shield, Zap, Target, Flame, Trophy, Lock, Unlock,
    Crosshair, Hexagon, Terminal, ChevronRight, Hash, Star, Edit3,
    Clock, BookOpen, Bookmark, CheckCircle2, TrendingUp, Medal
} from "lucide-react";
import {
    xpProgress, getRank, BADGES, TIER_STYLE, RANKS,
    computeEarnedBadges, getTodayQuote,
    type UserStats, type Badge, type DailyTask, type UserGoal, type LeaderboardEntry,
} from "@/lib/profileSystem";

export default function AuroraProfile() {
    const { data: session } = authClient.useSession();

    const [stats, setStats] = useState<UserStats | null>(null);
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [timeline, setTimeline] = useState<any[]>([]);
    const [nickname, setNickname] = useState("");
    const [typingHistory, setTypingHistory] = useState<any[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        let isM = true;
        const load = async () => {
            try {
                // Fetch Core Profile
                const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/profile`, { credentials: "include" });
                if (!res.ok) return;
                const d = await res.json();

                // Fetch Typing History for Chart
                const histRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/typing-results`, { credentials: "include" });
                const histData = histRes.ok ? await histRes.json() : [];

                if (!isM) return;
                setStats(d.stats);
                setTasks(d.tasks);
                setLeaderboard(d.leaderboard);
                setTimeline(d.timeline);
                setNickname(d.nickname);
                // Reverse so oldest is first for charting left-to-right
                setTypingHistory(histData.reverse());
            } catch (e) { } finally {
                if (isM) setMounted(true);
            }
        };

        load();
        const intervalId = setInterval(load, 10000); // 10s real-time sync

        return () => {
            isM = false;
            clearInterval(intervalId);
        };
    }, [session]);

    if (!mounted || !stats) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-white/10 border-t-indigo-500" />
            </div>
        );
    }

    return (
        <ProfileContent
            stats={stats}
            tasks={tasks}
            setTasks={setTasks}
            setStats={setStats}
            leaderboard={leaderboard}
            timeline={timeline}
            typingHistory={typingHistory}
            nickname={nickname}
            setNickname={setNickname}
            session={session}
        />
    );
}

function ProfileContent({ stats, tasks, setTasks, setStats, leaderboard, timeline, typingHistory, nickname, setNickname, session }: any) {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

    const prog = xpProgress(stats.xp);
    const currentRank = getRank(prog.level);
    const earnedBadges = computeEarnedBadges(stats);
    const earnedIds = new Set(earnedBadges.map(b => b.id));
    const quote = getTodayQuote();

    const markTask = async (id: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/profile/task`, {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId: id, amount: 1 }), credentials: "include"
        });
        const d = await (await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/profile`, { credentials: "include" })).json();
        setTasks(d.tasks); setStats(d.stats);
    };

    return (
        <main className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">

            {/* Ambient Aurora Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.4] dark:opacity-[0.15]"
                    animate={{ background: [`radial-gradient(circle, ${currentRank.color}44 0%, transparent 70%)`, `radial-gradient(circle, #8b5cf644 0%, transparent 70%)`] }}
                    transition={{ repeat: Infinity, duration: 8, repeatType: "mirror" }} />
                <motion.div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-[0.3] dark:opacity-[0.1]"
                    animate={{ background: [`radial-gradient(circle, #3b82f644 0%, transparent 70%)`, `radial-gradient(circle, #ec489944 0%, transparent 70%)`] }}
                    transition={{ repeat: Infinity, duration: 12, repeatType: "mirror" }} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-8 py-20 pb-48 max-w-7xl space-y-8">

                {/* HERO ROW: Identity & WPM Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <SectionIdentity stats={stats} prog={prog} rank={currentRank} nickname={nickname} setNickname={setNickname} quote={quote} image={session?.user?.image} />
                    </div>
                    <div className="lg:col-span-2">
                        <SectionAnalyticsChart history={typingHistory} currentRank={currentRank} />
                    </div>
                </div>

                {/* BENTO GRID ROW: Stats, Tasks, Leaderboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-auto">
                    <div className="lg:col-span-1 space-y-8">
                        <SectionBentoStats stats={stats} />
                        <SectionTasks tasks={tasks} onComplete={markTask} />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <SectionArena leaderboard={leaderboard} />
                        <SectionVault earnedIds={earnedIds} onSelectBadge={setSelectedBadge} />
                    </div>
                </div>

            </div>

            <AnimatePresence>
                {selectedBadge && <BadgeOverrideModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} isEarned={earnedIds.has(selectedBadge.id)} stats={stats} />}
            </AnimatePresence>

        </main>
    );
}

/* ─────────────────────────────────────────────────────────────
   GLASS COMPONENTS
───────────────────────────────────────────────────────────── */
function GlassCard({ children, className = "", delay = 0 }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
            className={`bg-white/60 dark:bg-[#111]/60 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden ${className}`}>
            {children}
        </motion.div>
    );
}

/* ─────────────────────────────────────────────────────────────
   ACT I: IDENTITY 
───────────────────────────────────────────────────────────── */
function SectionIdentity({ stats, prog, rank, nickname, setNickname, quote, image }: any) {
    return (
        <GlassCard className="p-8 h-full flex flex-col items-center text-center relative overflow-hidden group">

            {/* Animated Ring SVG */}
            <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle cx="50" cy="50" r="46" fill="transparent" className="stroke-slate-200 dark:stroke-white/5" strokeWidth="2" />
                    {/* Progress Sweep */}
                    <motion.circle
                        cx="50" cy="50" r="46" fill="transparent"
                        stroke={rank.color} strokeWidth="4" strokeLinecap="round"
                        initial={{ strokeDasharray: "0, 300" }}
                        animate={{ strokeDasharray: `${prog.pct * 289}, 300` }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                        className="drop-shadow-[0_0_8px_currentColor]"
                    />
                </svg>

                {/* Avatar Core */}
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-[#111] shadow-xl relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#222] dark:to-[#111]">
                    {image ? <img src={image} className="w-full h-full object-cover" alt="Profile" />
                        : <span className="absolute inset-0 flex items-center justify-center text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-400 to-slate-600 uppercase">{nickname.slice(0, 2)}</span>}
                </div>

                {/* Level Badge Hooked onto Ring */}
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}
                    className="absolute -bottom-2 bg-white dark:bg-[#222] border border-slate-200 dark:border-white/10 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                    <span className="text-sm font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${rank.color}, #a855f7)` }}>
                        Lvl {prog.level}
                    </span>
                    <span className="text-xs text-slate-500">{rank.name}</span>
                </motion.div>
            </div>

            <NicknameEditor currentNickname={nickname} onSave={setNickname} />
            <p className="text-sm text-slate-500 dark:text-slate-400 italic mb-8">"{quote}"</p>

            <div className="w-full mt-auto space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    <span>XP Core</span>
                    <span style={{ color: rank.color }}>{prog.progress} / {prog.nextLevelXp}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-black/50 rounded-full overflow-hidden shadow-inner">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${prog.pct * 100}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${rank.color}88, ${rank.color})` }} />
                </div>
            </div>

        </GlassCard>
    );
}

function NicknameEditor({ currentNickname, onSave }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [val, setVal] = useState(currentNickname);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!val.trim() || val === currentNickname) {
            setIsEditing(false); setVal(currentNickname); return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/profile/nickname`, {
                method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nickname: val.trim() }), credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                onSave(data.nickname);
                setIsEditing(false);
            }
        } catch (e) { console.error("Failed to save nickname", e); } finally { setLoading(false); }
    };

    if (!isEditing) {
        return (
            <div className="group flex items-center gap-2 cursor-pointer mb-2" onClick={() => setIsEditing(true)}>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                    {currentNickname}
                </h1>
                <Edit3 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        );
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="flex items-center gap-2 mb-2 w-full max-w-[200px] mx-auto">
            <input autoFocus type="text" value={val} onChange={(e) => setVal(e.target.value)} maxLength={20} disabled={loading}
                className="bg-slate-100 dark:bg-black/50 text-xl font-bold text-center text-slate-900 dark:text-white outline-none rounded-lg px-3 py-1 w-full border border-indigo-500/30 focus:border-indigo-500 transition-colors" />
        </form>
    );
}

/* ─────────────────────────────────────────────────────────────
   ACT II: WPM AREA CHART (SVG)
───────────────────────────────────────────────────────────── */
function SectionAnalyticsChart({ history, currentRank }: any) {
    // If no history, show placeholder
    const dataPts = history && history.length > 0 ? history.slice(-30) : []; // max 30 points

    // SVG Dimensions
    const w = 800; const h = 300;
    const padX = 20; const padY = 40;

    let pathD = "";
    let areaD = "";
    let minWPM = 0; let maxWPM = 100;

    if (dataPts.length > 1) {
        minWPM = Math.max(0, Math.min(...dataPts.map((d: any) => d.wpm)) - 10);
        maxWPM = Math.max(minWPM + 20, Math.max(...dataPts.map((d: any) => d.wpm)) + 10);
        const range = maxWPM - minWPM;

        const pts = dataPts.map((d: any, i: number) => {
            const x = padX + (i / (dataPts.length - 1)) * (w - padX * 2);
            const y = h - padY - ((d.wpm - minWPM) / range) * (h - padY * 2);
            return { x, y };
        });

        // Generate smooth cubic bezier SVG path
        pathD = `M ${pts[0].x},${pts[0].y} `;
        for (let i = 1; i < pts.length; i++) {
            const cp1X = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 3;
            const cp1Y = pts[i - 1].y;
            const cp2X = pts[i].x - (pts[i].x - pts[i - 1].x) / 3;
            const cp2Y = pts[i].y;
            pathD += `C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${pts[i].x},${pts[i].y} `;
        }

        areaD = `${pathD} L ${pts[pts.length - 1].x},${h - padY} L ${pts[0].x},${h - padY} Z`;
    }

    return (
        <GlassCard className="p-8 h-full flex flex-col relative" delay={0.1}>
            <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-bold tracking-tight mb-1 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" /> Velocity Over Time
                    </h3>
                    <p className="text-sm text-slate-500">Based on your last {dataPts.length} tests</p>
                </div>
                {dataPts.length > 0 && (
                    <div className="text-right">
                        <div className="text-4xl font-black tracking-tighter" style={{ color: currentRank.color }}>{dataPts[dataPts.length - 1].wpm}</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Latest WPM</div>
                    </div>
                )}
            </div>

            <div className="flex-1 w-full relative min-h-[200px]">
                {dataPts.length > 1 ? (
                    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible drop-shadow-xl" preserveAspectRatio="none">

                        {/* Grid Lines */}
                        {[0, 0.5, 1].map(pct => (
                            <line key={pct} x1={padX} y1={padY + pct * (h - padY * 2)} x2={w - padX} y2={padY + pct * (h - padY * 2)}
                                className="stroke-slate-200 dark:stroke-white/5" strokeWidth="1" strokeDasharray="4 4" />
                        ))}

                        {/* Chart Area Gradient */}
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={currentRank.color} stopOpacity="0.3" />
                                <stop offset="100%" stopColor={currentRank.color} stopOpacity="0.0" />
                            </linearGradient>
                            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor={currentRank.color} />
                            </linearGradient>
                        </defs>

                        {/* Area Fill */}
                        <motion.path d={areaD} fill="url(#areaGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />

                        {/* Stroke Line */}
                        <motion.path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />

                        {/* Data Points */}
                        {dataPts.map((d: any, i: number) => {
                            const x = padX + (i / (dataPts.length - 1)) * (w - padX * 2);
                            const y = h - padY - ((d.wpm - minWPM) / (maxWPM - minWPM)) * (h - padY * 2);
                            return (
                                <motion.circle key={i} cx={x} cy={y} r="4" fill="white" className="dark:fill-[#111]" stroke={currentRank.color} strokeWidth="2"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + (i * 0.05), type: "spring" }} />
                            );
                        })}
                    </svg>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">Not enough data to graph velocity. Keep typing!</div>
                )}
            </div>
        </GlassCard>
    );
}

/* ─────────────────────────────────────────────────────────────
   ACT III: BENTO STATS
───────────────────────────────────────────────────────────── */
function SectionBentoStats({ stats }: any) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <BentoStat label="Practice Time" val={`${stats.practiceMinutes}m`} icon={<Clock className="w-5 h-5 text-blue-500" />} delay={0.2} />
            <BentoStat label="Articles Read" val={stats.articlesRead} icon={<BookOpen className="w-5 h-5 text-emerald-500" />} delay={0.3} />
            <BentoStat label="Accuracy Highs" val={stats.accuracyHighs} icon={<Target className="w-5 h-5 text-rose-500" />} desc="Tests ≥ 95%" delay={0.4} />
            <BentoStat label="Daily Streak" val={`${stats.streak}🔥`} icon={<Flame className="w-5 h-5 text-orange-500" />} delay={0.5} />
        </div>
    );
}

function BentoStat({ label, val, icon, desc, delay }: any) {
    return (
        <GlassCard className="p-5 flex flex-col justify-between aspect-square relative group" delay={delay}>
            {/* Soft Hover Bloom */}
            <div className="absolute inset-0 bg-white dark:bg-white inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />

            <div className="bg-slate-100 dark:bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center mb-4 border border-slate-200 dark:border-white/5 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <div className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{val}</div>
                <div className="text-sm font-semibold text-slate-500">{label}</div>
                {desc && <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{desc}</div>}
            </div>
        </GlassCard>
    );
}

/* ─────────────────────────────────────────────────────────────
   ACT IV: TASKS
───────────────────────────────────────────────────────────── */
function SectionTasks({ tasks, onComplete }: any) {
    return (
        <GlassCard className="p-6" delay={0.6}>
            <h3 className="text-lg font-bold tracking-tight mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Daily Objectives
            </h3>
            <div className="space-y-3">
                {tasks.map((t: any, i: number) => {
                    const pct = Math.min(1, t.progress / t.target);
                    return (
                        <div key={t.id} className="relative p-4 rounded-2xl bg-slate-100/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 overflow-hidden">
                            {t.completed && <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />}

                            <div className="flex gap-4 relative z-10">
                                <div className="text-2xl drop-shadow-sm">{t.icon}</div>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className={`font-bold text-sm ${t.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{t.title}</div>
                                        <div className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-black/50 text-indigo-500 border border-indigo-500/20 shadow-sm">
                                            +{t.xpReward} XP
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-black/50 rounded-full overflow-hidden shadow-inner">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} transition={{ duration: 1 }}
                                                className={`h-full rounded-full ${t.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 min-w-[30px] text-right">{t.progress}/{t.target}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}


/* ─────────────────────────────────────────────────────────────
   ACT V: ARENA PODIUM
───────────────────────────────────────────────────────────── */
function SectionArena({ leaderboard }: any) {
    if (!leaderboard || leaderboard.length === 0) return null;

    return (
        <GlassCard className="p-8" delay={0.2}>
            <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" /> Global Arena Rankings
            </h3>

            <div className="space-y-3">
                {leaderboard.map((entry: any, i: number) => {
                    const r = getRank(entry.level);
                    const isTop3 = entry.rank <= 3;

                    let bgClass = "bg-slate-100/50 dark:bg-white/[0.02] border-slate-200/50 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.05]";
                    if (entry.rank === 1) bgClass = "bg-amber-100/50 dark:bg-amber-500/10 border-amber-300/50 dark:border-amber-500/30";
                    else if (entry.rank === 2) bgClass = "bg-slate-200/50 dark:bg-slate-400/10 border-slate-300/50 dark:border-slate-400/30";
                    else if (entry.rank === 3) bgClass = "bg-orange-100/50 dark:bg-orange-500/10 border-orange-300/50 dark:border-orange-500/30";
                    else if (entry.isUser) bgClass = "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]";

                    return (
                        <div key={entry.name + i} className={`flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 ${bgClass}`}>
                            <div className="w-10 text-center font-black text-xl text-slate-400 dark:text-slate-500">
                                {isTop3 ? `#${entry.rank}` : entry.rank}
                            </div>
                            <div className="flex-1 flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-black/50 border shadow-sm flex items-center justify-center font-bold text-sm" style={{ borderColor: `${r.color}44`, color: r.color }}>
                                        {entry.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {entry.name} {entry.isUser && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500 text-white">You</span>}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">{r.icon} {r.name}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-slate-900 dark:text-white drop-shadow-sm">{entry.wpm} <span className="text-xs font-semibold text-slate-400">WPM</span></div>
                                    <div className="text-xs text-slate-500">{entry.xp} XP</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}

/* ─────────────────────────────────────────────────────────────
   ACT VI: THE VAULT
───────────────────────────────────────────────────────────── */
function SectionVault({ earnedIds, onSelectBadge }: any) {
    return (
        <GlassCard className="p-8" delay={0.4}>
            <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Achievement Vault
            </h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {BADGES.map((b, i) => {
                    const earned = earnedIds.has(b.id);
                    const ts = TIER_STYLE[b.tier as keyof typeof TIER_STYLE] || { border: "#cbd5e1", glow: "#94a3b8", bg: "#f1f5f9" };
                    return (
                        <motion.button key={b.id}
                            whileHover={{ scale: 1.05, y: -4 }} whileTap={{ scale: 0.95 }}
                            onClick={() => onSelectBadge(b)}
                            className="relative aspect-square flex flex-col items-center justify-center p-2 rounded-3xl border transition-all overflow-hidden"
                            style={{
                                backgroundColor: earned ? `var(--tw-prose-body, rgba(255,255,255,0.05))` : 'rgba(0,0,0,0.02)',
                                borderColor: earned ? `${ts.border}44` : "rgba(100,116,139,0.1)",
                                boxShadow: earned ? `inset 0 0 30px ${ts.glow}22, 0 10px 30px -10px ${ts.glow}66` : "none"
                            }}>

                            {/* Glass shine effect for earned */}
                            {earned && (
                                <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                            )}

                            <div className="text-4xl mb-2 drop-shadow-xl transition-transform relative z-10" style={{ filter: earned ? `drop-shadow(0 0 15px ${ts.glow}88)` : "blur(4px) grayscale(1) opacity(0.3)" }}>
                                {b.icon}
                            </div>

                            {!earned && (
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <Lock className="w-8 h-8 text-slate-400/40" />
                                </div>
                            )}

                            <div className="text-[10px] font-bold text-center leading-tight truncate w-full z-10 px-1 relative" style={{ color: earned ? ts.border : "var(--tw-prose-counters, #94a3b8)" }}>
                                {earned ? b.name : "Locked"}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </GlassCard>
    );
}

/* ─────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────── */
function BadgeOverrideModal({ badge, onClose, isEarned, stats }: any) {
    const ts = TIER_STYLE[badge.tier as keyof typeof TIER_STYLE] || { border: "#94a3b8", glow: "#64748b", bg: "#f1f5f9" };

    return (
        <motion.div onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md cursor-pointer">
            <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.8, opacity: 0, y: 40, rotateX: 15 }} animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl cursor-default border border-white/20"
                style={{ background: `linear-gradient(135deg, ${ts.border}33, transparent)`, backgroundColor: 'rgba(255,255,255,0.05)', boxShadow: `0 30px 100px -20px ${ts.glow}` }}>

                {/* Internal container with massive backdrop blur for glass effect */}
                <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-[60px] p-10 flex flex-col items-center text-center relative z-10">

                    {/* Background Light Bloom specific to the badge tier */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] opacity-40 mix-blend-screen pointer-events-none" style={{ backgroundColor: ts.glow }} />

                    <motion.div animate={{ y: [-8, 8, -8], rotateY: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="text-8xl mb-8 drop-shadow-2xl relative z-20" style={{ filter: `drop-shadow(0 20px 30px ${ts.glow}CC)` }}>
                        {badge.icon}
                    </motion.div>

                    <span className="text-xs font-black uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full border shadow-sm relative z-20" style={{ color: ts.border, borderColor: `${ts.border}44`, backgroundColor: `${ts.border}11` }}>{badge.tier} Class</span>

                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-3 relative z-20">{badge.name}</h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mb-10 max-w-[280px] relative z-20">{badge.description}</p>

                    {!isEarned && (
                        <div className="w-full bg-slate-100/50 dark:bg-black/30 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-5 mb-8 relative z-20 shadow-inner">
                            <div className="flex justify-between text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
                                <span>Integration</span>
                                <span style={{ color: ts.border }}>{Math.min(badge.progressTarget, badge.progressValue(stats))} / {badge.progressTarget}</span>
                            </div>
                            <div className="h-3 bg-slate-200/50 dark:bg-black overflow-hidden shadow-inner p-0.5 rounded-full">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(Math.min(badge.progressTarget, badge.progressValue(stats)) / badge.progressTarget) * 100}%` }} transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                                    className="h-full rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]" style={{ background: `linear-gradient(90deg, ${ts.border}88, ${ts.border})` }} />
                            </div>
                        </div>
                    )}

                    <button onClick={onClose} className="w-full py-5 rounded-2xl font-bold text-lg transition-all relative z-20 overflow-hidden group" style={{ backgroundColor: isEarned ? ts.border : 'rgba(100,116,139,0.1)', color: isEarned ? '#fff' : ts.border }}>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isEarned ? "Claim Achievement" : "Return to Vault"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
