import axios from "axios";
import * as cheerio from "cheerio";
import type { NewsCategory, NewsSource, RawArticle } from "../types";

export class ScraperSource implements NewsSource {
    name = "Technology News Backup (Scraper)";

    async fetch(category: NewsCategory): Promise<RawArticle[]> {
        if (category !== 'technology') return [];

        try {
            const response = await axios.get("https://techcrunch.com/category/startups/", {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            const $ = cheerio.load(response.data);
            const articles: RawArticle[] = [];

            $(".post-block").each((_, element) => {
                const title = $(element).find(".post-block__title a").text().trim();
                const description = $(element).find(".post-block__content").text().trim();
                const url = $(element).find(".post-block__title a").attr("href");
                const imageUrl = $(element).find(".post-block__media img").attr("src");

                if (title && description && url) {
                    articles.push({
                        title,
                        description,
                        url,
                        source: "TechCrunch",
                        publishedAt: new Date().toISOString(),
                        imageUrl,
                        category: 'technology'
                    });
                }
            });

            return articles;
        } catch (error) {
            console.error("[ScraperSource] Failed to scrape TechCrunch:", error);
            return [];
        }
    }
}
