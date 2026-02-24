import prisma from "@News-Monkey/db";
import {
    type UserStats,
    type TimelineItem,
    type LeaderboardEntry,
    BADGES,
    levelFromXp,
    XP_REWARDS,
    getDailyTasks,
} from "./profileSystem";

export class ProfileService {

    // 1. Get or Create Profile
    static async getOrCreateProfile(userId: string) {
        let profile = await prisma.userProfile.findUnique({ where: { userId } });
        if (!profile) {
            profile = await prisma.userProfile.create({ data: { userId } });
        }
        return profile;
    }

    // 2. Add Timeline Event
    static async pushTimeline(userId: string, item: Omit<TimelineItem, "id" | "timestamp">) {
        return prisma.timelineEvent.create({
            data: {
                userId,
                type: item.type,
                label: item.label,
                detail: item.detail,
                icon: item.icon,
                color: item.color,
            }
        });
    }

    // 3. Increment XP
    static async addXp(userId: string, xp: number, reason: string, icon: string = "⭐", color: string = "#d97820") {
        if (xp <= 0) return;
        await this.getOrCreateProfile(userId);

        await prisma.userProfile.update({
            where: { userId },
            data: { xp: { increment: xp } }
        });

        await this.pushTimeline(userId, {
            type: "xp",
            label: `+${xp} XP`,
            detail: reason,
            icon,
            color,
        });
    }

    // 4. Update Daily Task Progress
    static async updateTaskProgress(userId: string, taskId: string, progressAmount = 1) {
        const today = new Date().toDateString(); // YYYY-MM-DD local approx
        const tasksForToday = getDailyTasks(); // gets the seeded pool for today
        const targetTask = tasksForToday.find(t => t.id === taskId);
        if (!targetTask) return null;

        let taskRecord = await prisma.dailyTaskProgress.findUnique({
            where: { userId_date_taskId: { userId, date: today, taskId } }
        });

        if (!taskRecord) {
            taskRecord = await prisma.dailyTaskProgress.create({
                data: { userId, date: today, taskId, progress: 0 }
            });
        }

        if (taskRecord.completed) return taskRecord; // already done

        const newProgress = Math.min(targetTask.target, taskRecord.progress + progressAmount);
        const newlyCompleted = newProgress >= targetTask.target;

        taskRecord = await prisma.dailyTaskProgress.update({
            where: { id: taskRecord.id },
            data: { progress: newProgress, completed: newlyCompleted }
        });

        if (newlyCompleted) {
            await this.addXp(userId, targetTask.xpReward, targetTask.title, "✅", "#5a9e42");
        }

        return taskRecord;
    }

    // 5. Evaluate Badges based on current stats
    static async evaluateBadges(userId: string) {
        const stats = await this.buildFullStats(userId);
        const earnedAlready = await prisma.userBadge.findMany({ where: { userId } });
        const earnedIds = new Set(earnedAlready.map(b => b.badgeId));

        for (const badge of BADGES) {
            if (!earnedIds.has(badge.id) && badge.condition(stats)) {
                // Earned a new badge
                await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
                await this.addXp(userId, badge.xpReward, `Badge Unlocked: ${badge.name}`, badge.icon, "#c8900a");
            }
        }
    }

    // 6. Build User Stats for Frontend
    static async buildFullStats(userId: string): Promise<UserStats> {
        const profile = await this.getOrCreateProfile(userId);

        // Compute testing aggregates
        const tests = await prisma.typingResult.findMany({ where: { userId } });

        let avgWpm = 0;
        let avgAccuracy = 0;
        let accuracyHighs = 0;

        if (tests.length > 0) {
            avgWpm = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
            avgAccuracy = tests.reduce((sum, t) => sum + t.accuracy, 0) / tests.length;
            accuracyHighs = tests.filter(t => t.accuracy >= 95).length;
        }

        return {
            xp: profile.xp,
            totalTests: tests.length,
            avgWpm: Math.round(avgWpm),
            bestWpm: Math.max(0, ...tests.map(t => t.wpm)),
            avgAccuracy: Math.round(avgAccuracy),
            streak: profile.streak,
            typingStreak: profile.typingStreak,
            articlesRead: profile.articlesRead,
            editorialsSaved: profile.editorialsSaved,
            practiceMinutes: profile.practiceMinutes,
            accuracyHighs: accuracyHighs,
            lastActiveDate: profile.lastActiveDate || "",
        };
    }

    // 7. Process a typing test completion
    static async processTypingTest(userId: string, durationSeconds: number, accuracy: number) {
        const profile = await this.getOrCreateProfile(userId);

        // Update practice minutes
        const minutes = Math.ceil(durationSeconds / 60);
        await prisma.userProfile.update({
            where: { userId },
            data: { practiceMinutes: { increment: minutes } }
        });

        // Add Base XP for time typed
        if (minutes >= 10) await this.addXp(userId, XP_REWARDS.typing10min, "10+ min session", "⏱️", "#d97820");
        else if (minutes >= 5) await this.addXp(userId, XP_REWARDS.typing5min, "5+ min session", "⏱️", "#d97820");

        // Handle Daily Task "type_10min" or "type_5min"
        if (minutes >= 10) await this.updateTaskProgress(userId, "type_10min", 1);
        if (minutes >= 5) await this.updateTaskProgress(userId, "type_5min", 1);

        // Handle "three_tests" task
        await this.updateTaskProgress(userId, "three_tests", 1);

        if (accuracy >= 90) {
            await this.updateTaskProgress(userId, "accuracy", 1);
        }

        // Check for streak protection
        const today = new Date().toDateString();
        if (profile.lastActiveDate !== today) {
            await prisma.userProfile.update({
                where: { userId },
                data: {
                    streak: { increment: 1 },
                    typingStreak: { increment: 1 },
                    lastActiveDate: today
                }
            });
            await this.updateTaskProgress(userId, "streak", 1);
            await this.addXp(userId, XP_REWARDS.dailyStreak, "Daily Activity Streak", "🔥", "#c85a4a");
        }

        // Finally, run badge evaluations
        await this.evaluateBadges(userId);
    }

    // 8. Generate Leaderboard
    static async getLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
        const allProfiles = await prisma.userProfile.findMany({
            include: { user: { select: { name: true } } },
            orderBy: { xp: 'desc' },
        });

        const board: LeaderboardEntry[] = allProfiles.map((p, i) => ({
            rank: i + 1,
            name: p.nickname || p.user?.name || "Anonymous",
            level: levelFromXp(p.xp),
            xp: p.xp,
            wpm: p.bestWpm || p.avgWpm,
            streak: p.streak,
            isUser: p.userId === userId,
        }));

        // Truncate to top 10, plus user if they aren't in there
        const top10 = board.slice(0, 10);
        const userPos = board.find(b => b.isUser);

        if (userPos && userPos.rank > 10) {
            top10.push(userPos);
        }

        return top10;
    }
}
