import { auth } from "@News-Monkey/auth";
import { env } from "@News-Monkey/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import { NewsService } from "./services/news.service";
import rateLimit from "express-rate-limit";

const app = express();

const allowedOrigins = env.CORS_ORIGIN;

// Parse JSON bodies FIRST
app.use(express.json());

// Configure CORS with proper settings for authentication
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS: Blocked origin ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Set-Cookie",
      "X-Requested-With"
    ],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 86400, // Cache preflight for 24 hours
  })
);

// Rate limiting for APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Mount Better Auth handler - use app.use for middleware mounting
app.use("/api/auth", toNodeHandler(auth));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Initialize News Service
NewsService.initialize().catch(console.error);

// News API (Direct Fetch)
app.get("/api/news", apiLimiter, async (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'general';

  // Try to get userId from session if available
  // Note: we don't use requireAuth here to allow guests to still get news
  let userId: string | null = null;
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    userId = session?.user?.id || null;
  } catch (error) {
    // Ignore session errors for public endpoint
  }

  try {
    const articles = await NewsService.getNews(category, userId);
    res.json(articles);
  } catch (error) {
    console.error("News API Error:", error);
    res.status(500).json({ error: "Failed to fetch live news" });
  }
});

app.get("/api/news/status", async (_req: Request, res: Response) => {
  try {
    const status = await NewsService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Failed to get status" });
  }
});

// Typing Results API (Protected with Authentication)
import { requireAuth, type AuthenticatedRequest } from "./middleware/auth.middleware";
import prisma from "@News-Monkey/db";
import { z } from "zod";
import { EditorialService } from "./services/editorial.service";

app.get("/api/editorial", async (req: Request, res: Response) => {
  const category = (req.query.category as string) || "sports";
  try {
    const editorials = await EditorialService.getDailyEditorials(category);
    res.json(editorials);
  } catch (err) {
    console.error("Editorial API Error:", err);
    res.status(500).json({ error: "Failed to fetch editorials" });
  }
});

app.get("/api/yesterday", async (_req: Request, res: Response) => {
  try {
    const articles = await EditorialService.getYesterdayNews();
    res.json(articles);
  } catch (err) {
    console.error("Yesterday API Error:", err);
    res.status(500).json({ error: "Failed to fetch yesterday's news" });
  }
});

// Validation schema for typing result
const typingResultSchema = z.object({
  articleTitle: z.string(),
  articleSource: z.string(),
  articleUrl: z.string().url(),
  wpm: z.number().int().min(0),
  accuracy: z.number().int().min(0).max(100),
  errors: z.number().int().min(0),
  totalCharsTyped: z.number().int().min(0),
  cpm: z.number().int().min(0),
  category: z.string(),
  region: z.enum(['us', 'in']),
  publishedAt: z.string().optional(),
});

// POST /api/typing-results - Save a new typing result
app.post("/api/typing-results", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = typingResultSchema.parse(req.body);

    const result = await prisma.typingResult.create({
      data: {
        userId: req.user!.id,
        articleTitle: validatedData.articleTitle,
        articleSource: validatedData.articleSource,
        articleUrl: validatedData.articleUrl,
        wpm: validatedData.wpm,
        accuracy: validatedData.accuracy,
        errors: validatedData.errors,
        totalCharsTyped: validatedData.totalCharsTyped,
        cpm: validatedData.cpm,
        category: validatedData.category,
        region: validatedData.region,
        publishedAt: validatedData.publishedAt ? new Date(validatedData.publishedAt) : null,
      },
    });

    // ✨ PROFILE TRIGGERS ✨
    // Automatically process test completion in the background without blocking the response
    ProfileService.processTypingTest(
      req.user!.id,
      validatedData.cpm / 5, // Rough approximation of duration from CPM
      validatedData.accuracy
    ).catch(e => console.error("Profile Processing Error:", e));

    res.status(201).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request data", details: error.errors });
    } else {
      console.error("Error saving typing result:", error);
      res.status(500).json({ error: "Failed to save typing result" });
    }
  }
});

// GET /api/typing-results - Get all typing results for the authenticated user
app.get("/api/typing-results", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const results = await prisma.typingResult.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(results);
  } catch (error) {
    console.error("Error fetching typing results:", error);
    res.status(500).json({ error: "Failed to fetch typing results" });
  }
});

// DELETE /api/typing-results/:id - Delete a specific typing result
app.delete("/api/typing-results/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Verify the result belongs to the authenticated user
    const result = await prisma.typingResult.findUnique({
      where: { id },
    });

    if (!result) {
      res.status(404).json({ error: "Typing result not found" });
      return;
    }

    if (result.userId !== req.user!.id) {
      res.status(403).json({ error: "You don't have permission to delete this result" });
      return;
    }

    await prisma.typingResult.delete({
      where: { id },
    });

    res.json({ message: "Typing result deleted successfully" });
  } catch (error) {
    console.error("Error deleting typing result:", error);
    res.status(500).json({ error: "Failed to delete typing result" });
  }
});

// GET /api/typing-results - Clear all typing results for the authenticated user
app.delete("/api/typing-results", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await prisma.typingResult.deleteMany({
      where: {
        userId: req.user!.id,
      },
    });

    res.json({ message: "All typing results cleared successfully" });
  } catch (error) {
    console.error("Error clearing typing results:", error);
    res.status(500).json({ error: "Failed to clear typing results" });
  }
});

// ==========================================
// 🛡️ PROFILE API
// ==========================================
import { ProfileService } from "./services/profile.service";
import { getDailyTasks } from "./services/profileSystem";

// GET /api/profile
// Returns everything needed to paint the Profile Page
app.get("/api/profile", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Ensure profile exists
    await ProfileService.getOrCreateProfile(userId);

    const stats = await ProfileService.buildFullStats(userId);

    // Tasks
    const defaultPool = getDailyTasks();
    const today = new Date().toDateString();
    const activeTasks = await prisma.dailyTaskProgress.findMany({
      where: { userId, date: today }
    });

    const mergedTasks = defaultPool.map(poolTask => {
      const dbTask = activeTasks.find(a => a.taskId === poolTask.id);
      return {
        ...poolTask,
        progress: dbTask?.progress ?? 0,
        completed: dbTask?.completed ?? false,
      };
    });

    // Timeline
    const timeline = await prisma.timelineEvent.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 30,
    });

    // Earned Badges
    const earned = await prisma.userBadge.findMany({ where: { userId } });
    const earnedIds = earned.map(e => e.badgeId);

    // Leaderboard
    const leaderboard = await ProfileService.getLeaderboard(userId);

    res.json({
      stats,
      tasks: mergedTasks,
      timeline,
      earnedIds,
      leaderboard,
      nickname: (await prisma.userProfile.findUnique({ where: { userId } }))?.nickname || req.user?.name || "Learner"
    });

  } catch (e) {
    console.error("Profile GET Error", e);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// PUT /api/profile/nickname
// Updates display name
app.put("/api/profile/nickname", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { nickname } = req.body;
    if (!nickname || typeof nickname !== 'string' || nickname.length > 30) {
      return res.status(400).json({ error: "Invalid nickname." });
    }
    await ProfileService.getOrCreateProfile(req.user!.id);
    const profile = await prisma.userProfile.update({
      where: { userId: req.user!.id },
      data: { nickname }
    });
    res.json({ nickname: profile.nickname });
  } catch (e) {
    res.status(500).json({ error: "Failed to update nickname." });
  }
});

// POST /api/profile/task
// For manually progressing certain custom tasks
app.post("/api/profile/task", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { taskId, amount } = req.body;
    if (!taskId) return res.status(400).json({ error: "taskId missing" });
    const updated = await ProfileService.updateTaskProgress(req.user!.id, taskId, amount || 1);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Failed to verify task update." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
