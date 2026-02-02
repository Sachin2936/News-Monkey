import axios from "axios";
import { parseStringPromise } from "xml2js";

// ======================
// Types
// ======================

export interface NewsArticle {
    title: string;
    content: string;
    source: { name: string };
    publishedAt: string;
    url: string;
    imageUrl?: string | null;
    category: string;
}

interface RSSFeed {
    category: string;
    url: string;
}

// ======================
// Constants
// ======================

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const FEED_LIST_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
const RSS_INDEX_URL = "https://timesofindia.indiatimes.com/rss.cms";

// Fallback feeds in case scraping fails
const FALLBACK_FEEDS: Record<string, string> = {
    general: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
    technology: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms",
    business: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
    sports: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
    entertainment: "https://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
    science: "https://timesofindia.indiatimes.com/rssfeeds/4719161.cms",
    health: "https://timesofindia.indiatimes.com/rssfeeds/3908999.cms",
};

// ======================
// Text Normalizer (Enhanced)
// ======================

function normalizeText(text: string): string {
    if (!text) return "";

    return text
        .replace(/<script[^>]*>.*?<\/script>/gi, "")
        .replace(/<style[^>]*>.*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&apos;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#\d+;/g, "") // Remove numeric HTML entities
        .replace(/[^\w\s.,?!'"-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// ======================
// News Service
// ======================

export class NewsService {
    private static cache: Map<string, NewsArticle[]> = new Map();
    private static lastFetch: Map<string, number> = new Map();
    private static feedList: Map<string, string> = new Map();
    private static feedListLastFetch: number = 0;

    // Warm cache on startup
    static async initialize() {
        await this.scrapeFeedList();
        this.getNews("general", 20).catch(console.error);
    }

    // ======================
    // RSS Feed Scraper
    // ======================

    private static async scrapeFeedList(): Promise<void> {
        const now = Date.now();

        // Use cached feed list if still valid
        if (this.feedList.size > 0 && now - this.feedListLastFetch < FEED_LIST_CACHE_DURATION) {
            console.log("[NewsService] Using cached RSS feed list");
            return;
        }

        try {
            console.log("[NewsService] Scraping RSS feed list from TOI...");

            const response = await axios.get(RSS_INDEX_URL, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            const html = response.data;

            // Extract RSS feed links and their categories
            const feedRegex = /<a[^>]*href=["'](https:\/\/timesofindia\.indiatimes\.com\/rssfeeds\/[^"']+)["'][^>]*>([^<]+)<\/a>/gi;
            const feeds: RSSFeed[] = [];

            let match;
            while ((match = feedRegex.exec(html)) !== null) {
                const url = match[1];
                const rawCategory = match[2]?.trim() || "";

                if (url && rawCategory) {
                    // Normalize category name to lowercase, remove special chars
                    const category = rawCategory
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .trim();

                    if (category) {
                        feeds.push({ category, url });
                    }
                }
            }

            // Also extract general feed and other feed formats
            const linkRegex = /<a[^>]*href=["'](https:\/\/timesofindia\.indiatimes\.com\/[^"']*rss[^"']*)["'][^>]*>([^<]+)<\/a>/gi;
            while ((match = linkRegex.exec(html)) !== null) {
                const url = match[1];
                const rawCategory = match[2]?.trim() || "";

                if (url && rawCategory && !feeds.some(f => f.url === url)) {
                    const category = rawCategory
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/g, "")
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .trim();

                    if (category) {
                        feeds.push({ category, url });
                    }
                }
            }

            // Update feed list
            this.feedList.clear();

            // Add general/top-stories as the default feed
            this.feedList.set("general", "https://timesofindia.indiatimes.com/rssfeedstopstories.cms");

            // Add scraped feeds
            for (const feed of feeds) {
                if (!this.feedList.has(feed.category)) {
                    this.feedList.set(feed.category, feed.url);
                }
            }

            this.feedListLastFetch = now;

            console.log(`[NewsService] Scraped ${this.feedList.size} RSS feeds`);
            console.log(`[NewsService] Available categories:`, Array.from(this.feedList.keys()));

        } catch (error) {
            console.error("[NewsService] Failed to scrape RSS feed list:", error);

            // Use fallback feeds if scraping fails
            if (this.feedList.size === 0) {
                console.log("[NewsService] Using fallback feed list");
                for (const [category, url] of Object.entries(FALLBACK_FEEDS)) {
                    this.feedList.set(category, url);
                }
            }
        }
    }

    // Public method - matches existing API signature
    static async getNews(category: string = 'general', limit: number = 10): Promise<NewsArticle[]> {
        // Ensure feed list is up to date
        await this.scrapeFeedList();

        const now = Date.now();
        const cacheKey = category;
        const lastFetch = this.lastFetch.get(cacheKey) || 0;
        const cachedArticles = this.cache.get(cacheKey) || [];

        if (cachedArticles.length > 0 && now - lastFetch < CACHE_DURATION) {
            console.log(`[NewsService] Returning cached articles for ${category}`);
            return cachedArticles.slice(0, limit);
        }

        console.log(`[NewsService] Fetching RSS feed for ${category}...`);

        const articles = await this.fetchFromRSS(category);

        if (articles.length > 0) {
            this.cache.set(cacheKey, articles);
            this.lastFetch.set(cacheKey, now);
        }

        return articles.slice(0, limit);
    }

    // ======================
    // RSS Fetcher
    // ======================

    private static async fetchFromRSS(category: string): Promise<NewsArticle[]> {
        try {
            const feedUrl = this.feedList.get(category) || this.feedList.get("general") || FALLBACK_FEEDS.general;

            const response = await axios.get(feedUrl, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            const parsed = await parseStringPromise(response.data);

            const items = parsed?.rss?.channel?.[0]?.item || [];

            const results: NewsArticle[] = [];

            for (const item of items) {
                const rawTitle = item.title?.[0];
                const rawDesc = item.description?.[0];
                const link = item.link?.[0];
                const pubDate = item.pubDate?.[0];

                if (!rawTitle || !rawDesc) continue;

                const title = normalizeText(rawTitle);
                const content = normalizeText(rawDesc);

                // Skip if content is too short for typing practice
                if (title.length < 15 || content.length < 40) continue;

                results.push({
                    title,
                    content,
                    source: { name: "Times of India" },
                    publishedAt: pubDate || new Date().toISOString(),
                    url: link || "",
                    imageUrl: null,
                    category,
                });
            }

            console.log(`[NewsService] Fetched ${results.length} articles for ${category}`);

            return results;
        } catch (err) {
            console.error(`[NewsService] RSS Fetch Failed for ${category}:`, err);
            return [];
        }
    }

    // ======================
    // Status
    // ======================

    static async getStatus() {
        await this.scrapeFeedList();

        const cacheStats: Record<string, number> = {};
        for (const [category, articles] of this.cache.entries()) {
            cacheStats[category] = articles.length;
        }

        return {
            mode: "rss-feed",
            provider: "Times of India RSS",
            status: "ok",
            message: "News is fetched from Times of India RSS feeds. Feeds are dynamically scraped.",
            cachedCategories: cacheStats,
            availableCategories: Array.from(this.feedList.keys()),
            totalFeeds: this.feedList.size,
        };
    }

    // ======================
    // Utility
    // ======================

    static async getRandomArticle(category: string = 'general'): Promise<NewsArticle | null> {
        const news = await this.getNews(category);
        if (news.length === 0) return null;
        return news[Math.floor(Math.random() * news.length)] ?? null;
    }
}
