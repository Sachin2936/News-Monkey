import type { NewsCategory, NewsSource, NormalizedArticle } from "./types";
import { CleanerService } from "./cleaner.service";
import { ClassifierService } from "./classifier.service";

export class SourceManager {
    private sources: NewsSource[] = [];

    registerSource(source: NewsSource) {
        this.sources.push(source);
    }

    async fetchAll(category: NewsCategory): Promise<NormalizedArticle[]> {
        const allArticles: NormalizedArticle[] = [];

        for (const source of this.sources) {
            try {
                console.log(`[SourceManager] Fetching from ${source.name} for ${category}`);
                const raws = await source.fetch(category);
                for (const raw of raws) {
                    const normalized = CleanerService.normalize(raw, category);

                    // Refine categorization
                    normalized.category = ClassifierService.classify(
                        normalized.title,
                        normalized.content,
                        raw.category
                    );

                    allArticles.push(normalized);
                }
            } catch (error) {
                console.error(`[SourceManager] Source ${source.name} failed:`, error);
            }
        }

        // Deduplicate by URL
        const unique = new Map<string, NormalizedArticle>();
        allArticles.forEach(a => unique.set(a.url, a));

        return Array.from(unique.values());
    }
}
