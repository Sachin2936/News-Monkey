import type { NewsCategory } from "./types";

export class ClassifierService {
    private static KEYWORDS: Record<NewsCategory, string[]> = {
        general: ["news", "update", "report"],
        world: ["international", "global", "un", "treaty", "world", "foreign"],
        politics: ["government", "election", "policy", "minister", "president", "senate", "congress", "political", "parliament"],
        sports: ["cricket", "football", "soccer", "olympics", "match", "tournament", "score", "athlete", "tennis", "nba", "ipl"],
        technology: ["software", "hardware", "ai", "tech", "gadget", "apple", "google", "microsoft", "startup", "data", "crypto"],
        business: ["economy", "market", "stock", "finance", "bank", "investment", "company", "trade", "profit", "revenue"],
        fintech: ["crypto", "blockchain", "bitcoin", "ethereum", "fintech", "payment", "digital currency", "banking tech", "ledger", "defi"],
        entertainment: ["movie", "cinema", "music", "celebrity", "hollywood", "bollywood", "actor", "actress", "singer", "concert", "showbiz"],
        science: ["space", "nasa", "physics", "biology", "research", "discovery", "astronomy", "scientific", "study", "experiment"]
    };

    static classify(title: string, content: string, apiCategory?: string): NewsCategory {
        // 1. If API category exists and matches our types, use it
        if (apiCategory) {
            const normalized = apiCategory.toLowerCase();
            if (this.isCategory(normalized)) return normalized;

            // Map common API categories to our types
            if (normalized === 'health') return 'general';
        }

        // 2. Keyword matching
        const fullText = (title + " " + content).toLowerCase();
        let bestCategory: NewsCategory = 'general';
        let maxMatches = 0;

        for (const [category, keywords] of Object.entries(this.KEYWORDS)) {
            if (category === 'general') continue;

            let matches = 0;
            for (const keyword of keywords) {
                if (fullText.includes(keyword)) {
                    matches++;
                }
            }

            if (matches > maxMatches) {
                maxMatches = matches;
                bestCategory = category as NewsCategory;
            }
        }

        return bestCategory;
    }

    private static isCategory(val: string): val is NewsCategory {
        return ['general', 'world', 'politics', 'sports', 'technology', 'business', 'fintech', 'entertainment', 'science'].includes(val);
    }
}
