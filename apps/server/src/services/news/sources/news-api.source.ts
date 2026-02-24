import axios from "axios";
import type { NewsCategory, NewsSource, RawArticle } from "../types";
import { env } from "@News-Monkey/env/server";

export class NewsApiSource implements NewsSource {
    name = "NewsAPI";

    async fetch(category: NewsCategory): Promise<RawArticle[]> {
        const apiKey = env.NEWS_API_KEY;
        if (!apiKey) {
            console.warn("[NewsApiSource] NEWS_API_KEY not found in env");
            return [];
        }

        try {
            const response = await axios.get("https://newsapi.org/v2/top-headlines", {
                params: {
                    category: category === 'general' ? undefined : category,
                    language: 'en',
                    apiKey: apiKey,
                    pageSize: 20,
                },
            });

            return response.data.articles.map((a: any) => ({
                title: a.title,
                description: a.description || a.content || "",
                url: a.url,
                source: a.source.name,
                publishedAt: a.publishedAt,
                imageUrl: a.urlToImage,
                category: category,
            }));
        } catch (error) {
            console.error("[NewsApiSource] Failed to fetch:", error);
            return [];
        }
    }
}
