import prisma from "@News-Monkey/db";
import { SourceManager } from "./news/source.manager";
import { MultiRssSource } from "./news/sources/multi-rss.source";
import { NewsApiSource } from "./news/sources/news-api.source";
import { ScraperSource } from "./news/sources/scraper.source";
import { RotationService } from "./news/rotation.service";
import { FullContentService } from "./news/full-content.service";
import type { NewsCategory, NormalizedArticle } from "./news/types";

export class NewsService {
    private static sourceManager = new SourceManager();
    private static isInitialized = false;

    static async initialize() {
        if (this.isInitialized) return;

        // Register BBC News
        this.sourceManager.registerSource(new MultiRssSource({
            name: "BBC News",
            categoryMap: {
                general: "http://feeds.bbci.co.uk/news/rss.xml",
                world: "http://feeds.bbci.co.uk/news/world/rss.xml",
                technology: "http://feeds.bbci.co.uk/news/technology/rss.xml",
                business: "http://feeds.bbci.co.uk/news/business/rss.xml",
                politics: "http://feeds.bbci.co.uk/news/politics/rss.xml",
            }
        }));

        // Register Google News
        this.sourceManager.registerSource(new MultiRssSource({
            name: "Google News",
            categoryMap: {
                general: "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en",
                technology: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-IN&gl=IN&ceid=IN:en",
                sports: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-IN&gl=IN&ceid=IN:en",
                business: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en",
                fintech: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-IN&gl=IN&ceid=IN:en", // Google News uses Business for Finance/Fintech
                entertainment: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-IN&gl=IN&ceid=IN:en",
                science: "https://news.google.com/rss/headlines/section/topic/SCIENCE?hl=en-IN&gl=IN&ceid=IN:en",
            }
        }));

        // Register Times of India
        this.sourceManager.registerSource(new MultiRssSource({
            name: "Times of India",
            categoryMap: {
                general: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
                world: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
                politics: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
                sports: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
                technology: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms",
                business: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
                entertainment: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
                science: "https://timesofindia.indiatimes.com/rssfeeds/-2128672765.cms",
            }
        }));

        this.sourceManager.registerSource(new NewsApiSource());
        this.sourceManager.registerSource(new ScraperSource());

        this.isInitialized = true;
        console.log("[NewsService] Modular News system initialized");

        // --- SCHEDULER ---

        // 1. Fetch Headlines (Every 30 min)
        this.syncAllCategories().catch(console.error);
        setInterval(() => {
            console.log("[Scheduler] Triggering 30m Fetch...");
            this.syncAllCategories().catch(console.error);
        }, 30 * 60 * 1000);

        // 2. Cleanup Expired Articles (Every 6 hrs)
        setInterval(() => {
            console.log("[Scheduler] Triggering 6h Cleanup...");
            this.cleanupOldArticles().catch(console.error);
        }, 6 * 60 * 60 * 1000);

        // 3. Daily Re-indexing (Every 24 hrs)
        setInterval(() => {
            console.log("[Scheduler] Triggering Daily Re-index...");
            this.reindexCategories().catch(console.error);
        }, 24 * 60 * 60 * 1000);
    }

    static async cleanupOldArticles() {
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        const deleted = await prisma.newsArticle.deleteMany({
            where: {
                createdAt: { lt: fortyEightHoursAgo }
            }
        });
        console.log(`[NewsService] Cleanup: Deleted ${deleted.count} expired articles`);
    }

    static async reindexCategories() {
        console.log("[NewsService] Starting daily re-indexing...");
        // For re-indexing, we could clear non-seen articles and refetch,
        // but for now let's just do a deep sync of top articles.
        await this.syncAllCategories();
    }

    static async syncAllCategories() {
        console.log("[NewsService] Starting background sync for all categories...");
        const categories: NewsCategory[] = ['general', 'world', 'politics', 'sports', 'technology', 'business', 'fintech', 'entertainment', 'science'];

        for (const category of categories) {
            await this.syncCategory(category);
        }
        console.log("[NewsService] Background sync completed");
    }

    static async syncCategory(category: NewsCategory) {
        try {
            const articles = await this.sourceManager.fetchAll(category);
            for (const article of articles) {
                await prisma.newsArticle.upsert({
                    where: { url: article.url },
                    create: {
                        title: article.title,
                        content: article.content,
                        sourceName: article.sourceName,
                        url: article.url,
                        imageUrl: article.imageUrl,
                        category: article.category,
                        publishedAt: article.publishedAt,
                        isFullContent: false,
                    },
                    update: {}, // Don't overwrite if exists to preserve full content if already scraped
                });
            }
        } catch (error) {
            console.error(`[NewsService] Sync failed for ${category}:`, error);
        }
    }

    /**
     * Get a SINGLE long news article for practice.
     */
    static async getNews(category: string = 'general', userId: string | null = null): Promise<NormalizedArticle[]> {
        await this.initialize();

        // 1. Get a single article from rotation
        let article = await RotationService.getRandomArticle(userId, category as NewsCategory);

        // 2. If no article found, trigger an on-demand sync
        if (!article) {
            console.log(`[NewsService] Cache miss for ${category}, triggering on-demand sync...`);
            await this.syncCategory(category as NewsCategory);
            article = await RotationService.getRandomArticle(userId, category as NewsCategory);
        }

        if (!article) return [];

        // 2. Ensure it has full content (3+ mins of typing)
        let finalContent = article.content;

        // Check if we already have full content in DB or if it's just a snippet
        const dbArticle = await prisma.newsArticle.findUnique({ where: { url: article.url } });

        if (dbArticle && !dbArticle.isFullContent) {
            console.log(`[NewsService] On-demand scraping full content for: ${article.title}`);
            const fullContent = await FullContentService.fetchFullContent(article.url);

            if (fullContent && fullContent.length > 500) {
                finalContent = fullContent;
                // Update DB so we don't scrape it again
                await prisma.newsArticle.update({
                    where: { url: article.url },
                    data: {
                        content: fullContent,
                        isFullContent: true
                    }
                });
            } else {
                console.warn("[NewsService] Scraper returned too little content, using existing snippet");
            }
        }

        return [{
            ...article,
            content: finalContent
        }];
    }

    static async getStatus() {
        const stats = await prisma.newsArticle.groupBy({
            by: ['category'],
            _count: { _all: true }
        });
        const categoryStats: Record<string, number> = {};
        stats.forEach(s => categoryStats[s.category] = s._count._all);

        return {
            status: "ok",
            provider: "Modular Aggregator with Scraper",
            categories: categoryStats,
            sources: ["BBC", "Google News", "TOI", "NewsAPI", "Scraper"],
            lastSync: new Date().toISOString(),
        };
    }
}

export type { NormalizedArticle } from "./news/types";
