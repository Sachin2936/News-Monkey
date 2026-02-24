import prisma from "@News-Monkey/db";
import type { NewsCategory, NormalizedArticle } from "./types";

export class RotationService {
    /**
     * Gets random articles for the user, prioritizing ones they haven't seen.
     */
    static async getRandomArticles(userId: string | null, category: NewsCategory, limit: number = 1): Promise<NormalizedArticle[]> {
        // 1. Fetch articles for this category
        const articles = await prisma.newsArticle.findMany({
            where: { category },
            orderBy: { publishedAt: 'desc' },
            take: 100, // Consider last 100 articles for more variety
        });

        if (articles.length === 0) return [];

        let selectedArticles: any[] = [];

        if (userId) {
            // 2. Identify seen articles for this user
            const seenArticleIds = (await prisma.userSeenArticle.findMany({
                where: { userId },
                select: { articleId: true },
            })).map(s => s.articleId);

            // 3. Prioritize unseen articles
            const unseenArticles = articles.filter(a => !seenArticleIds.includes(a.id));

            if (unseenArticles.length >= limit) {
                // If we have enough unseen, shuffle and take requested amount
                selectedArticles = unseenArticles.sort(() => 0.5 - Math.random()).slice(0, limit);
            } else {
                // Mix unseen with some seen if needed
                selectedArticles = [...unseenArticles];
                const needed = limit - selectedArticles.length;
                const seenArticles = articles.filter(a => seenArticleIds.includes(a.id));
                selectedArticles.push(...seenArticles.sort(() => 0.5 - Math.random()).slice(0, needed));
            }

            // 4. Mark as seen
            selectedArticles.forEach(a => this.markAsSeen(userId, a.id).catch(console.error));
        } else {
            // No user ID (guest), just return random fresh articles
            selectedArticles = articles.sort(() => 0.5 - Math.random()).slice(0, limit);
        }

        return selectedArticles.map(targetArticle => ({
            title: targetArticle.title,
            content: targetArticle.content,
            sourceName: targetArticle.sourceName,
            url: targetArticle.url,
            imageUrl: targetArticle.imageUrl,
            category: targetArticle.category as NewsCategory,
            publishedAt: targetArticle.publishedAt,
        }));
    }

    // Keep for backward compatibility if needed, but we'll use getRandomArticles
    static async getRandomArticle(userId: string | null, category: NewsCategory): Promise<NormalizedArticle | null> {
        const results = await this.getRandomArticles(userId, category, 1);
        return results[0] || null;
    }

    private static async markAsSeen(userId: string, articleId: string) {
        try {
            await prisma.userSeenArticle.upsert({
                where: {
                    userId_articleId: { userId, articleId }
                },
                create: { userId, articleId },
                update: { seenAt: new Date() },
            });
        } catch (error) {
            console.error("[RotationService] Failed to mark article as seen:", error);
        }
    }
}
