"use client";

import { AuthGuard, useAuth } from "@/components/auth-guard";
import { type HistoryItem } from "@/store/useTypingStore";
import { dashboardService, type TypingResultResponse } from "@/services/dashboard.service";
import { syncLocalHistoryToBackend, hasHistorySynced } from "@/lib/sync-history";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  History,
  Zap,
  Target,
  Calendar,
  Trash2,
  ArrowRight,
  Search,
  Loader2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

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

function DashboardContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
    if (!confirm("Clear all typing history?")) return;

    setIsClearing(true);
    const success = await dashboardService.clearTypingResults();
    if (success) {
      setHistory([]);
    }
    setIsClearing(false);
  };

  const stats = {
    avgWpm: history.length > 0
      ? Math.round(history.reduce((acc, item) => acc + item.wpm, 0) / history.length)
      : 0,
    avgAccuracy: history.length > 0
      ? Math.round(history.reduce((acc, item) => acc + item.accuracy, 0) / history.length)
      : 0,
    totalTests: history.length
  };

  if (isLoading || isSyncing) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">
            {isSyncing ? "Syncing your history..." : "Loading your dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-black font-outfit tracking-tight uppercase">Dashboard</h1>
                <p className="text-muted-foreground font-medium">
                  Welcome back{user?.name ? `, ${user.name}` : ""}! Track your typing journey.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm"
              />
            </div>
            <button
              onClick={fetchResults}
              className="p-3 rounded-2xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all border border-white/10"
              title="Refresh"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                title="Clear History"
              >
                {isClearing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* OverView Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Average WPM</h3>
                <div className="text-5xl font-black font-outfit tracking-tighter mt-1">{stats.avgWpm}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-green-500/10 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/10">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Average Accuracy</h3>
                <div className="text-5xl font-black font-outfit tracking-tighter mt-1">{stats.avgAccuracy}%</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Total Tests</h3>
                <div className="text-5xl font-black font-outfit tracking-tighter mt-1">{stats.totalTests}</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* History List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black font-outfit tracking-tight uppercase flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              Recent Sessions
            </h2>
          </div>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border border-primary/20 shadow-inner">
                          {item.wpm}
                        </div>
                        <div>
                          <h4 className="font-bold line-clamp-1 group-hover:text-primary transition-colors text-lg tracking-tight">
                            {item.article.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(item.date), 'MMM d, h:mm a')}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span>{item.article.source}</span>
                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">
                              {item.region === 'in' ? 'INDIA' : 'GLOBAL'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8 justify-between md:justify-end">
                      <div className="flex gap-8">
                        <div className="text-center">
                          <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">Accuracy</div>
                          <div className="text-xl font-black font-outfit text-green-500">{item.accuracy}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-black text-muted-foreground uppercase tracking-wider">CPM</div>
                          <div className="text-xl font-black font-outfit text-blue-500">{item.cpm}</div>
                        </div>
                      </div>
                      <Link
                        href="/practice"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all shadow-lg"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-24 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
                    <History className="w-10 h-10 opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold font-outfit">No sessions found</h3>
                  <p className="text-muted-foreground mt-2 font-medium">Start your first typing practice to see history.</p>
                  <Link
                    href="/practice"
                    className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
                  >
                    Start Typing Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </AnimatePresence>
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
