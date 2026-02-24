import type { NormalizedArticle, RawArticle, NewsCategory } from "./types";

export class CleanerService {
    private static MAX_PARAGRAPH_LENGTH = 300;
    private static MIN_PARAGRAPH_LENGTH = 150;

    static normalize(raw: RawArticle, targetCategory: NewsCategory): NormalizedArticle {
        return {
            title: this.cleanText(raw.title),
            content: this.cleanText(raw.description),
            sourceName: raw.source,
            url: raw.url,
            imageUrl: raw.imageUrl || null,
            category: targetCategory,
            publishedAt: raw.publishedAt instanceof Date ? raw.publishedAt : new Date(raw.publishedAt),
        };
    }

    static cleanText(text: string): string {
        if (!text) return "";

        return text
            .replace(/<script[^>]*>.*?<\/script>/gi, " ")
            .replace(/<style[^>]*>.*?<\/style>/gi, " ")
            .replace(/<[^>]+>/g, " ") // Space prevents word gluing
            .replace(/&nbsp;/gi, " ")
            .replace(/&amp;/gi, "&")
            .replace(/&quot;/gi, '"')
            .replace(/&apos;/gi, "'")
            .replace(/&lt;/gi, "<")
            .replace(/&gt;/gi, ">")
            // Remove Emojis and special symbols
            .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '')
            .replace(/[^\w\s.,?!'"\-:;()]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    /**
     * Splits text into typing-friendly blocks of 150-300 characters.
     */
    static splitIntoParagraphs(text: string): string[] {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const paragraphs: string[] = [];
        let currentParagraph = "";

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if ((currentParagraph + " " + trimmedSentence).length > this.MAX_PARAGRAPH_LENGTH) {
                if (currentParagraph.length >= this.MIN_PARAGRAPH_LENGTH) {
                    paragraphs.push(currentParagraph.trim());
                    currentParagraph = trimmedSentence;
                } else {
                    // If current is too short, we must append even if it exceeds max slightly, 
                    // or just hard break if it's way too long (rare for single sentence).
                    currentParagraph += (currentParagraph ? " " : "") + trimmedSentence;
                }
            } else {
                currentParagraph += (currentParagraph ? " " : "") + trimmedSentence;
            }
        }

        if (currentParagraph.trim().length >= this.MIN_PARAGRAPH_LENGTH) {
            paragraphs.push(currentParagraph.trim());
        } else if (currentParagraph.trim().length > 0 && paragraphs.length > 0) {
            // Append leftover to last paragraph if too short
            paragraphs[paragraphs.length - 1] += " " + currentParagraph.trim();
        } else if (currentParagraph.trim().length > 0) {
            // If it's the only text and too short, still keep it but maybe warn?
            paragraphs.push(currentParagraph.trim());
        }

        return paragraphs;
    }
}
