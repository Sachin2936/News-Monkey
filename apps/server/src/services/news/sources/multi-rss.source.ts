import axios from "axios";
import { parseStringPromise } from "xml2js";
import type { NewsCategory, NewsSource, RawArticle } from "../types";

export interface RssFeedConfig {
    name: string;
    categoryMap: Partial<Record<NewsCategory, string>>;
}

export class MultiRssSource implements NewsSource {
    constructor(private config: RssFeedConfig) { }

    get name() {
        return this.config.name;
    }

    async fetch(category: NewsCategory): Promise<RawArticle[]> {
        const url = this.config.categoryMap[category];
        if (!url) {
            console.log(`[MultiRssSource] No URL for category ${category} in ${this.name}`);
            return [];
        }

        try {
            const response = await axios.get(url, {
                timeout: 15000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            });

            const parsed = await parseStringPromise(response.data);
            const items = parsed?.rss?.channel?.[0]?.item || [];

            return items.map((item: any) => ({
                title: item.title?.[0] || "",
                description: item.description?.[0] || "",
                url: item.link?.[0] || "",
                source: this.name,
                publishedAt: item.pubDate?.[0] || new Date().toISOString(),
                category: category,
            })).filter((a: RawArticle) => a.title && (a.description || a.title.length > 50));
        } catch (error: any) {
            console.error(`[MultiRssSource] Failed to fetch ${url} for ${this.name}:`, error?.message || 'Unknown error');
            return [];
        }
    }
}
