import axios from "axios";
import type { NewsCategory, NewsSource, RawArticle } from "../types";
import { env } from "@News-Monkey/env/server";

export class NewsDataSource implements NewsSource {
    name = "NewsData";

    async fetch(category: NewsCategory): Promise<RawArticle[]> {
        const apiKey = env.NEWS_DATA_API_KEY;
        if (!apiKey) {
            console.warn("[NewsDataSource] NEWS_DATA_API_KEY not found in env");
            return [];
        }

        try {
            // NewsData API expects specific categories or just text queries. 
            // We can map general tech/sports etc. to its 'category' param
            const queryCategory = category === 'general' ? 'top' : category;

            const response = await axios.get("https://newsdata.io/api/1/news", {
                params: {
                    apikey: apiKey,
                    category: queryCategory,
                    language: 'en',
                },
            });

            if (!response.data || !response.data.results) return [];

            return response.data.results.map((a: any) => ({
                title: a.title,
                description: a.description || a.content || "",
                url: a.link,
                source: a.source_id,
                publishedAt: new Date(a.pubDate),
                imageUrl: a.image_url,
                category: category,
            }));
        } catch (error) {
            console.error("[NewsDataSource] Failed to fetch:", error);
            return [];
        }
    }
}
