"use client";

import { AuthGuard, useAuth } from "@/components/auth-guard";
import { type HistoryItem } from "@/store/useTypingStore";
import { dashboardService, type TypingResultResponse } from "@/services/dashboard.service";
import { syncLocalHistoryToBackend, hasHistorySynced } from "@/lib/sync-history";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Calendar,
  ExternalLink,
  History,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trash2,
  Zap,
  X,
  ChevronRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { format, formatDistanceToNow } from "date-fns";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Convert backend response to HistoryItem format for display
function toHistoryItem(result: TypingResultResponse): HistoryItem {
  return {
    id: result.id,
    wpm: result.wpm,
    accuracy: result.accuracy,
    cpm: result.cpm,
    date: result.createdAt,
    region: result.region,
    article: {
      title: result.articleTitle,
      source: result.articleSource,
      url: result.articleUrl,
    },
  };
}

interface ArticleActionModalProps {
  item: HistoryItem;
  onClose: () => void;
}

function ArticleActionModal({ item, onClose }: ArticleActionModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>

          {/* Article Info */}
          <div className="mb-8">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Session Details</div>
            <h3 className="text-xl font-black text-slate-100 tracking-tight leading-snug mb-3 pr-8">
              {item.article.title}
            </h3>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <span className="text-indigo-400/80">{item.article.source}</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>{formatDistanceToNow(new Date(item.date), { addSuffix: true })}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: "WPM", value: item.wpm, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
              { label: "Accuracy", value: `${item.accuracy}%`, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { label: "CPM", value: item.cpm, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20" },
            ].map((stat) => (
              <div key={stat.label} className={`text-center py-4 px-2 rounded-2xl ${stat.bg} border ${stat.border}`}>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{stat.label}</div>
                <div className={`text-2xl font-black tracking-tight ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Single Action */}
          <a
            href={item.article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full px-6 py-5 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 hover:border-sky-400/40 hover:from-sky-500/20 hover:to-indigo-500/20 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500/30 transition-colors border border-sky-500/20">
              <ExternalLink className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-100 text-base">Read Original Article</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Opens {item.article.source} in a new tab</div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 ml-auto group-hover:text-sky-300 group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  // Fetch typing results from backend
  const fetchResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const results = await dashboardService.getTypingResults();
      const items = results.map(toHistoryItem);
      setHistory(items);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync localStorage history on first mount if user is authenticated
  useEffect(() => {
    async function syncAndFetch() {
      if (user && !hasHistorySynced()) {
        setIsSyncing(true);
        await syncLocalHistoryToBackend();
        setIsSyncing(false);
      }
      await fetchResults();
    }
    syncAndFetch();
  }, [user, fetchResults]);

  // Filter history based on search term
  useEffect(() => {
    setFilteredHistory(
      history.filter(item =>
        item.article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.article.source.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, history]);

  // Clear all history
  const handleClearHistory = async () => {
    if (!confirm("Clear all 10 typing history sessions?")) return;
    setIsClearing(true);
    const success = await dashboardService.clearTypingResults();
    if (success) setHistory([]);
    setIsClearing(false);
  };

  const stats = {
    avgWpm: history.length > 0
      ? Math.round(history.reduce((acc, item) => acc + item.wpm, 0) / history.length)
      : 0,
    avgAccuracy: history.length > 0
      ? Math.round(history.reduce((acc, item) => acc + item.accuracy, 0) / history.length)
      : 0,
    totalTests: history.length,
    bestWpm: history.length > 0 ? Math.max(...history.map(h => h.wpm)) : 0,
    bestAccuracy: history.length > 0 ? Math.max(...history.map(h => h.accuracy)) : 0,
    streak: history.length, // Simplified streak = recent active sessions
  };

  // Rank calculation based on avgWpm
  const getRank = (wpm: number) => {
    if (wpm >= 120) return { title: "Grandmaster", emoji: "🏆", color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30", glow: "shadow-purple-500/20", next: null, nextAt: 120 };
    if (wpm >= 100) return { title: "Master", emoji: "💎", color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/30", glow: "shadow-rose-500/20", next: "Grandmaster", nextAt: 120 };
    if (wpm >= 80) return { title: "Expert", emoji: "⚡", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20", next: "Master", nextAt: 100 };
    if (wpm >= 60) return { title: "Advanced", emoji: "🎯", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30", glow: "shadow-blue-500/20", next: "Expert", nextAt: 80 };
    if (wpm >= 40) return { title: "Intermediate", emoji: "📈", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30", glow: "shadow-emerald-500/20", next: "Advanced", nextAt: 60 };
    if (wpm >= 20) return { title: "Novice", emoji: "🌱", color: "text-indigo-400", bg: "bg-indigo-500/20", border: "border-indigo-500/30", glow: "shadow-indigo-500/20", next: "Intermediate", nextAt: 40 };
    return { title: "Beginner", emoji: "🔰", color: "text-slate-400", bg: "bg-slate-500/20", border: "border-slate-500/30", glow: "shadow-slate-500/20", next: "Novice", nextAt: 20 };
  };

  const currentRank = getRank(stats.avgWpm);

  // WPM sparkline data (chronological order)
  const sparklineData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const maxWpm = Math.max(...sparklineData.map(h => h.wpm), 10);

  if (isLoading || isSyncing) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center bg-[#060a12]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-slate-400 font-medium">
            {isSyncing ? "Syncing your sessions..." : "Loading your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#060a12] text-slate-100 selection:bg-indigo-500/30">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px] -mr-[20vw] -mt-[20vw]" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-rose-900/8 rounded-full blur-[120px] -ml-[20vw] -mb-[20vw]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-violet-900/5 rounded-full blur-[100px]" />
      </div>

      {/* Modal */}
      {selectedItem && (
        <ArticleActionModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div className="container mx-auto px-6 py-28 relative z-10">
        <div className="max-w-6xl mx-auto space-y-10">

          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-white/5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" /> Analytics Dashboard
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                  <LayoutDashboard className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-100">Dashboard</h1>
                  <p className="text-slate-500 font-medium mt-0.5">
                    Welcome back{user?.name ? `, ${user.name}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/8 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm text-slate-200 placeholder:text-slate-600 font-medium"
                />
              </div>
              <button
                onClick={fetchResults}
                className="p-3 rounded-2xl bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all border border-white/8"
                title="Refresh"
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  disabled={isClearing}
                  className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 disabled:opacity-50"
                  title="Clear History"
                >
                  {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>

          {/* ── Rank + Stats Row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Rank Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 p-8 rounded-[2.5rem] bg-slate-900/60 backdrop-blur-xl border border-white/8 relative overflow-hidden flex flex-col justify-between group"
              style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" }}
            >
              <div className={`absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 blur-3xl transition-colors opacity-15 group-hover:opacity-30 ${currentRank.bg.replace('/20', '')}`} />
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Your Rank</div>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${currentRank.bg} flex items-center justify-center text-3xl border ${currentRank.border} shadow-lg ${currentRank.glow}`}>
                    {currentRank.emoji}
                  </div>
                  <div>
                    <div className={`text-3xl font-black tracking-tight ${currentRank.color}`}>{currentRank.title}</div>
                    <div className="text-sm text-slate-500 font-medium mt-0.5">{stats.avgWpm} WPM average</div>
                  </div>
                </div>
                {/* Rank Progress */}
                {currentRank.next && (
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Progress to {currentRank.next}</span>
                      <span className={currentRank.color}>{stats.avgWpm}/{currentRank.nextAt} WPM</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stats.avgWpm / currentRank.nextAt) * 100)}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500`}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Best WPM</div>
                  <div className="text-xl font-black text-amber-400">{stats.bestWpm}</div>
                </div>
                <div className="bg-white/3 rounded-xl p-3 border border-white/5">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Best Acc</div>
                  <div className="text-xl font-black text-emerald-400">{stats.bestAccuracy}%</div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Zap className="w-5 h-5" />,
                  label: "Average WPM",
                  value: stats.avgWpm,
                  color: "text-indigo-400",
                  bg: "bg-indigo-500/10",
                  border: "border-indigo-500/20",
                  glow: "bg-indigo-500/10",
                  delay: 0.1,
                },
                {
                  icon: <Target className="w-5 h-5" />,
                  label: "Avg Accuracy",
                  value: `${stats.avgAccuracy}%`,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/20",
                  glow: "bg-emerald-500/10",
                  delay: 0.2,
                },
                {
                  icon: <History className="w-5 h-5" />,
                  label: "Saved Sessions",
                  value: `${stats.totalTests}/10`,
                  color: "text-sky-400",
                  bg: "bg-sky-500/10",
                  border: "border-sky-500/20",
                  glow: "bg-sky-500/10",
                  delay: 0.3,
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay }}
                  className="p-7 rounded-[2rem] bg-slate-900/60 backdrop-blur-xl border border-white/8 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stat.glow} rounded-full -mr-16 -mt-16 blur-3xl group-hover:opacity-150 transition-opacity`} />
                  <div className="relative z-10 space-y-4">
                    <div className={`w-11 h-11 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} border ${stat.border}`}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</div>
                      <div className="text-4xl font-black tracking-tighter mt-1 text-slate-100">{stat.value}</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Mini WPM Chart */}
              {sparklineData.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-3 p-6 rounded-[2rem] bg-slate-900/60 backdrop-blur-xl border border-white/8"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                        <TrendingUp className="w-4 h-4 text-pink-400" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-100">WPM Trend</div>
                        <div className="text-xs text-slate-500">Last {sparklineData.length} sessions</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-slate-500"></div>
                  </div>
                  <div className="h-20 flex items-end gap-1.5">
                    {sparklineData.map((s, i) => {
                      const pct = Math.max(8, (s.wpm / maxWpm) * 100);
                      const isBest = s.wpm === maxWpm;
                      return (
                        <div key={s.id} className="flex-1 flex flex-col items-center justify-end h-full relative group/bar">
                          {/* Tooltip */}
                          <div className="absolute -top-8 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded-lg pointer-events-none z-10 whitespace-nowrap">
                            {s.wpm} WPM
                          </div>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: "easeOut" }}
                            className={`w-full max-w-[28px] rounded-t-md ${isBest ? "bg-gradient-to-t from-indigo-600 to-violet-400" : "bg-slate-700/60 hover:bg-slate-600/80"} transition-colors`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* ── Animated Tree Scene ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative rounded-[2.5rem] overflow-hidden border border-white/5"
            style={{ minHeight: 200, background: "linear-gradient(to bottom, #08101e 0%, #0d1a2e 55%, #0d1e0d 100%)" }}
          >
            {/* Twinkling stars */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute rounded-full bg-white"
                style={{
                  width: i % 4 === 0 ? 2 : 1,
                  height: i % 4 === 0 ? 2 : 1,
                  left: `${(i * 19 + 3) % 94}%`,
                  top: `${(i * 13 + 2) % 38}%`,
                }}
                animate={{ opacity: [0.15, 0.9, 0.15] }}
                transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.28, ease: "easeInOut" }}
              />
            ))}

            {/* Moon glow */}
            <div className="absolute top-4 right-12 w-7 h-7 rounded-full bg-amber-100/80 shadow-[0_0_18px_6px_rgba(254,243,199,0.25)]" />

            {/* SVG Forest */}
            <svg
              viewBox="0 0 900 200"
              preserveAspectRatio="xMidYMax slice"
              className="absolute bottom-0 left-0 w-full"
              style={{ height: "100%" }}
            >
              <defs>
                <filter id="ff-glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Ground */}
              <rect x="0" y="178" width="900" height="22" fill="#0d1e0d" />

              {/* Tree 1 – far left, small */}
              <g transform="translate(55,178) scale(0.65)">
                <rect x="-5" y="-28" width="10" height="28" fill="#3b2a1a" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [-1.5, 1.5, -1.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <polygon points="0,-108 -36,0 36,0" fill="#1a4a1a" />
                  <polygon points="0,-82 -30,12 30,12" fill="#1f5c1f" />
                  <polygon points="0,-56 -24,22 24,22" fill="#267026" />
                </motion.g>
              </g>

              {/* Tree 2 – left, tall */}
              <g transform="translate(160,178)">
                <rect x="-7" y="-45" width="14" height="45" fill="#3b2a1a" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [2, -2, 2] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}>
                  <polygon points="0,-158 -52,0 52,0" fill="#163d16" />
                  <polygon points="0,-125 -44,14 44,14" fill="#1c5a1c" />
                  <polygon points="0,-94 -37,26 37,26" fill="#236823" />
                  <polygon points="0,-63 -29,38 29,38" fill="#2a782a" />
                </motion.g>
              </g>

              {/* Tree 3 – centre-left */}
              <g transform="translate(290,178) scale(0.85)">
                <rect x="-6" y="-36" width="12" height="36" fill="#4a3520" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}>
                  <polygon points="0,-132 -43,0 43,0" fill="#1a4a1a" />
                  <polygon points="0,-100 -36,13 36,13" fill="#206020" />
                  <polygon points="0,-70 -29,25 29,25" fill="#287228" />
                </motion.g>
              </g>

              {/* Tree 4 – centre, tallest */}
              <g transform="translate(450,178)">
                <rect x="-9" y="-55" width="18" height="55" fill="#3b2a1a" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [1.5, -1.5, 1.5] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}>
                  <polygon points="0,-178 -60,0 60,0" fill="#133913" />
                  <polygon points="0,-142 -51,15 51,15" fill="#1a5a1a" />
                  <polygon points="0,-108 -42,28 42,28" fill="#226422" />
                  <polygon points="0,-75 -33,40 33,40" fill="#2c7a2c" />
                </motion.g>
              </g>

              {/* Tree 5 – centre-right */}
              <g transform="translate(600,178) scale(0.9)">
                <rect x="-6" y="-40" width="12" height="40" fill="#3b2a1a" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [-1, 1.8, -1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                  <polygon points="0,-142 -47,0 47,0" fill="#1a4a1a" />
                  <polygon points="0,-108 -40,13 40,13" fill="#1f5e1f" />
                  <polygon points="0,-76 -33,26 33,26" fill="#287028" />
                </motion.g>
              </g>

              {/* Tree 6 – right */}
              <g transform="translate(748,178)">
                <rect x="-7" y="-42" width="14" height="42" fill="#4a3520" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [2.5, -1, 2.5] }}
                  transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
                  <polygon points="0,-150 -49,0 49,0" fill="#163d16" />
                  <polygon points="0,-116 -43,15 43,15" fill="#1d5a1d" />
                  <polygon points="0,-82 -35,28 35,28" fill="#256825" />
                  <polygon points="0,-50 -27,40 27,40" fill="#2e7e2e" />
                </motion.g>
              </g>

              {/* Tree 7 – far right, small */}
              <g transform="translate(856,178) scale(0.65)">
                <rect x="-5" y="-28" width="10" height="28" fill="#3b2a1a" />
                <motion.g style={{ originX: "0px", originY: "0px" }}
                  animate={{ rotate: [-2, 2, -2] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}>
                  <polygon points="0,-106 -36,0 36,0" fill="#1a4a1a" />
                  <polygon points="0,-80 -30,13 30,13" fill="#236423" />
                  <polygon points="0,-55 -24,25 24,25" fill="#2c7a2c" />
                </motion.g>
              </g>

              {/* Falling leaves */}
              {[
                { x: 115, delay: 0, dur: 6 },
                { x: 275, delay: 1.5, dur: 7 },
                { x: 425, delay: 0.8, dur: 5.5 },
                { x: 525, delay: 2.2, dur: 8 },
                { x: 675, delay: 0.3, dur: 6.5 },
                { x: 800, delay: 1.1, dur: 7.5 },
              ].map((lf, i) => (
                <motion.ellipse
                  key={`leaf-${i}`}
                  cx={lf.x} cy={0} rx={4} ry={2.5}
                  fill={i % 2 === 0 ? "#3d9e3d" : "#2db82d"}
                  opacity={0.8}
                  animate={{
                    cy: [5, 192],
                    cx: [lf.x, lf.x + (i % 2 === 0 ? 28 : -24)],
                    rotate: [0, 360],
                    opacity: [0, 0.85, 0],
                  }}
                  transition={{
                    duration: lf.dur,
                    repeat: Infinity,
                    ease: "easeIn",
                    delay: lf.delay,
                    repeatDelay: lf.delay + 0.5,
                  }}
                />
              ))}

              {/* Fireflies */}
              {[
                { x: 200, y: 118 }, { x: 385, y: 88 },
                { x: 545, y: 108 }, { x: 705, y: 94 },
              ].map((ff, i) => (
                <motion.circle
                  key={`ff-${i}`}
                  cx={ff.x} cy={ff.y} r={2.5}
                  fill="#d4f06c"
                  filter="url(#ff-glow)"
                  animate={{
                    opacity: [0, 1, 0],
                    cx: [ff.x, ff.x + (i % 2 === 0 ? 14 : -11), ff.x],
                    cy: [ff.y, ff.y - 10, ff.y],
                  }}
                  transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                />
              ))}
            </svg>

            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10 pb-10">
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs font-black uppercase tracking-[0.3em] text-slate-400"
              >
                Keep growing
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-300"
              >
                Every session counts 🌿
              </motion.div>
              <Link
                href="/practice"
                className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all"
              >
                Start a New Session <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* ── College Marquee ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="overflow-hidden rounded-3xl bg-slate-900/40 border border-white/5 py-5 px-2"
          >
            <p className="text-center text-[10px] font-black uppercase tracking-[0.35em] text-slate-600 mb-4">
              Practiced by students at top colleges
            </p>

            {/* Row 1 — scrolls left */}
            <div className="relative overflow-hidden mb-3">
              <motion.div
                className="flex gap-5 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              >
                {[
                  { name: "IIT Bombay", color: "#003087" },
                  { name: "IIT Delhi", color: "#00539F" },
                  { name: "IIT Madras", color: "#007CC3" },
                  { name: "IIT Kanpur", color: "#CC0000" },
                  { name: "IIT Kharagpur", color: "#1B4F72" },
                  { name: "IIT Roorkee", color: "#6A0DAD" },
                  { name: "Chandigarh Univ.", color: "#E87722" },
                  { name: "BITS Pilani", color: "#FFD700" },
                  { name: "VIT Vellore", color: "#0066CC" },
                  { name: "SRM Institute", color: "#EE3524" },
                  { name: "Thapar Institute", color: "#003366" },
                  // duplicate for seamless loop
                  { name: "IIT Bombay", color: "#003087" },
                  { name: "IIT Delhi", color: "#00539F" },
                  { name: "IIT Madras", color: "#007CC3" },
                  { name: "IIT Kanpur", color: "#CC0000" },
                  { name: "IIT Kharagpur", color: "#1B4F72" },
                  { name: "IIT Roorkee", color: "#6A0DAD" },
                  { name: "Chandigarh Univ.", color: "#E87722" },
                  { name: "BITS Pilani", color: "#FFD700" },
                  { name: "VIT Vellore", color: "#0066CC" },
                  { name: "SRM Institute", color: "#EE3524" },
                  { name: "Thapar Institute", color: "#003366" },
                ].map((co, i) => (
                  <span
                    key={`r1-${i}`}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/3 text-xs font-black tracking-wide flex-shrink-0"
                    style={{ color: co.color }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: co.color, boxShadow: `0 0 6px ${co.color}` }}
                    />
                    {co.name}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Row 2 — scrolls right */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-5 whitespace-nowrap"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
              >
                {[
                  { name: "Punjab Engg. College", color: "#4A90D9" },
                  { name: "Amity University", color: "#8B2252" },
                  { name: "LPU", color: "#FF6600" },
                  { name: "Shiv Nadar Univ.", color: "#005F73" },
                  { name: "Manipal Institute", color: "#D62839" },
                  { name: "KIIT University", color: "#1D3557" },
                  { name: "Galgotias University", color: "#457B9D" },
                  { name: "Bennett University", color: "#E63946" },
                  { name: "Chitkara University", color: "#2D6A4F" },
                  { name: "Graphic Era Univ.", color: "#F4A261" },
                  { name: "JSS Academy NOIDA", color: "#264653" },
                  { name: "SAGE University", color: "#6D6875" },
                  { name: "TMU", color: "#A8DADC" },
                  { name: "KARE", color: "#80B918" },
                  { name: "IFHE Hyderabad", color: "#9B2226" },
                  // duplicate for seamless loop
                  { name: "Punjab Engg. College", color: "#4A90D9" },
                  { name: "Amity University", color: "#8B2252" },
                  { name: "LPU", color: "#FF6600" },
                  { name: "Shiv Nadar Univ.", color: "#005F73" },
                  { name: "Manipal Institute", color: "#D62839" },
                  { name: "KIIT University", color: "#1D3557" },
                  { name: "Galgotias University", color: "#457B9D" },
                  { name: "Bennett University", color: "#E63946" },
                  { name: "Chitkara University", color: "#2D6A4F" },
                  { name: "Graphic Era Univ.", color: "#F4A261" },
                  { name: "JSS Academy NOIDA", color: "#264653" },
                  { name: "SAGE University", color: "#6D6875" },
                  { name: "TMU", color: "#A8DADC" },
                  { name: "KARE", color: "#80B918" },
                  { name: "IFHE Hyderabad", color: "#9B2226" },
                ].map((co, i) => (
                  <span
                    key={`r2-${i}`}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/3 text-xs font-black tracking-wide flex-shrink-0"
                    style={{ color: co.color }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: co.color, boxShadow: `0 0 6px ${co.color}` }}
                    />
                    {co.name}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ── Session History ── */}
          <div
            className="rounded-[2.5rem] bg-slate-900/60 backdrop-blur-xl border border-white/8"
            style={{ boxShadow: "0 20px 40px -15px rgba(0,0,0,0.5)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Activity className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Recent Sessions</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {history.length > 0
                      ? `Showing ${filteredHistory.length} of ${history.length} saved sessions (max 10)`
                      : "No sessions yet"}
                  </p>
                </div>
              </div>
              {history.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-800/50 px-3 py-1.5 rounded-full border border-white/5">
                  <Clock className="w-3 h-3" />
                  <span>Click any session to interact</span>
                </div>
              )}
            </div>

            {/* List */}
            <div className="p-6 pt-4 grid gap-3">
              <AnimatePresence mode="popLayout">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => {
                    const rank = getRank(item.wpm);
                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => setSelectedItem(item)}
                        className="p-5 rounded-2xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/60 hover:border-white/10 transition-all group cursor-pointer flex flex-col md:flex-row md:items-center gap-5"
                      >
                        {/* Rank badge */}
                        <div className={`w-12 h-12 rounded-xl ${rank.bg} flex items-center justify-center font-black ${rank.color} border ${rank.border} shadow-inner flex-shrink-0 text-sm`}>
                          {item.wpm}
                          <span className="text-[8px] ml-0.5">wpm</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate text-slate-100 group-hover:text-indigo-300 transition-colors text-base tracking-tight mb-1">
                            {item.article.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1 text-indigo-400/70">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(item.date), "MMM d, h:mm a")}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span>{item.article.source}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className={`${item.region === "in" ? "text-orange-400/80" : "text-sky-400/80"}`}>
                              {item.region === "in" ? "🇮🇳 India" : "🌐 Global"}
                            </span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-center bg-emerald-500/8 px-3 py-2 rounded-xl border border-emerald-500/10">
                            <div className="text-[9px] font-black text-emerald-600/80 uppercase tracking-widest mb-0.5">Acc</div>
                            <div className="text-base font-black text-emerald-400">{item.accuracy}%</div>
                          </div>
                          <div className="text-center bg-sky-500/8 px-3 py-2 rounded-xl border border-sky-500/10">
                            <div className="text-[9px] font-black text-sky-600/80 uppercase tracking-widest mb-0.5">CPM</div>
                            <div className="text-base font-black text-sky-400">{item.cpm}</div>
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-slate-700/50 border border-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all">
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-white/8 mx-2 mb-2">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5">
                      <Activity className="w-7 h-7 text-slate-600" />
                    </div>
                    <h3 className="text-lg font-black tracking-tight text-slate-300">
                      {searchTerm ? "No matching sessions" : "No sessions yet"}
                    </h3>
                    <p className="text-slate-600 mt-2 font-medium text-sm">
                      {searchTerm ? "Try a different search term" : "Complete your first typing session to see history here."}
                    </p>
                    {!searchTerm && (
                      <Link
                        href="/practice"
                        className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-500 text-white rounded-2xl font-bold hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20 text-sm"
                      >
                        Start Typing <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Footer Note ── */}
          <div className="text-center text-slate-600 text-xs font-medium py-2">
            NewsMonkey stores your 10 most recent typing sessions to keep your data minimal and fast.
          </div>

        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
