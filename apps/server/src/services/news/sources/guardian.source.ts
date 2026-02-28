import axios from "axios";
import type { NewsCategory, NewsSource, RawArticle } from "../types";
import { env } from "@News-Monkey/env/server";

export class GuardianSource implements NewsSource {
    name = "The Guardian";

    async fetch(category: NewsCategory): Promise<RawArticle[]> {
        const apiKey = env.GUARDIAN_API_KEY;
        if (!apiKey) {
            console.warn("[GuardianSource] GUARDIAN_API_KEY not found in env");
            return [];
        }

        const queryMap: Record<string, string> = {
            "sports": "sport",
            "fintech": "finance OR fintech OR business",
            "politics": "politics",
            "world": "world",
            "technology": "technology",
            "business": "business",
            "entertainment": "culture",
            "science": "science",
            "general": "news"
        };
        const query = queryMap[category] || category;

        try {
            const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&show-fields=bodyText,headline,thumbnail&page-size=15&order-by=newest&api-key=${apiKey}`;
            const response = await axios.get(url);

            if (!response.data || !response.data.response || !response.data.response.results) {
                return [];
            }

            return response.data.response.results.map((a: any) => ({
                title: a.fields?.headline || a.webTitle,
                description: a.fields?.bodyText || "",
                url: a.webUrl,
                source: "The Guardian",
                publishedAt: new Date(a.webPublicationDate),
                imageUrl: a.fields?.thumbnail || "",
                category: category,
            }));
        } catch (error) {
            console.error("[GuardianSource] Failed to fetch:", error);
            return [];
        }
    }
}
