import axios from "axios";
import * as cheerio from "cheerio";
import { CleanerService } from "./cleaner.service";

export class FullContentService {
    /**
     * Fetches and extracts the main text content from a news URL.
     */
    static async fetchFullContent(url: string): Promise<string> {
        try {
            console.log(`[FullContentService] Fetching full content from: ${url}`);
            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
            });

            const $ = cheerio.load(response.data);

            // Remove unwanted elements
            $('script, style, iframe, nav, header, footer, ads, .ads, .advertisement, .sidebar, .comments').remove();

            // Common selectors for news article bodies
            const selectors = [
                'article',
                '.article-body',
                '.article-content',
                '.story-body',
                '.story-content',
                '.main-content',
                '.post-content',
                '[itemprop="articleBody"]',
                '.entry-content',
            ];

            let content = "";

            for (const selector of selectors) {
                const element = $(selector);
                if (element.length > 0) {
                    // Get text from paragraphs to preserve some structure and filter noise
                    const paragraphs = element.find('p').map((_, el) => $(el).text().trim()).get();
                    if (paragraphs.length > 3) {
                        content = paragraphs.join("\n\n");
                        break;
                    }
                }
            }

            // Fallback: If no specific container found, try all paragraphs in the body
            if (!content || content.length < 500) {
                const allParagraphs = $('p').map((_, el) => $(el).text().trim()).get();
                // Filter out very short paragraphs which are often navigation or footer links
                content = allParagraphs.filter(p => p.length > 40).join("\n\n");
            }

            const cleanedContent = CleanerService.cleanText(content);

            console.log(`[FullContentService] Extracted ${cleanedContent.length} characters`);
            return cleanedContent;
        } catch (error: any) {
            console.error(`[FullContentService] Failed to fetch ${url}:`, error?.message || 'Unknown error');
            return "";
        }
    }
}
