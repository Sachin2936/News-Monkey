import { auth } from "@News-Monkey/auth";
import { env } from "@News-Monkey/env/server";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import { NewsService } from "./services/news.service";
import rateLimit from "express-rate-limit";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Rate limiting for APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use("/api/auth", toNodeHandler(auth));
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// News API (Direct Fetch)
app.get("/api/news", apiLimiter, async (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'general';
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const articles = await NewsService.getNews(category, limit);
    // console.log(articles)
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

// DELETE /api/typing-results - Clear all typing results for the authenticated user
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
