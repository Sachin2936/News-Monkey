import { GoogleGenAI, Type, type Schema } from "@google/genai";
import { env } from "@News-Monkey/env/server";
import prisma from "@News-Monkey/db";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const editorialSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        category: { type: Type.STRING },
        context: { type: Type.STRING },
        deepDive: { type: Type.STRING },
        positives: { type: Type.ARRAY, items: { type: Type.STRING } },
        negatives: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyVocab: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { term: { type: Type.STRING }, definition: { type: Type.STRING } },
                required: ["term", "definition"]
            }
        },
        discussionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        verdict: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
        readTime: { type: Type.INTEGER },
    },
    required: ["title", "category", "context", "deepDive", "positives", "negatives", "keyVocab", "discussionPoints", "verdict", "tags", "difficulty", "readTime"]
};

export class EditorialService {
    static async getDailyEditorials(category: string) {
        // Find 4 top recent articles from this category
        const articles = await prisma.newsArticle.findMany({
            where: { category },
            orderBy: { publishedAt: 'desc' },
            take: 4
        });

        if (articles.length === 0) return [];

        const editorials = [];
        for (const article of articles) {
            try {
                // Generate AI analysis
                const prompt = `Analyze this news article and format it into a deep-dive educational editorial. Keep sentences engaging and informative.
Article Title: ${article.title}
Article Source: ${article.sourceName}
Content: ${article.content.substring(0, 3000)}

Follow the JSON schema exactly. The category should be one of: sports, fintech, politics, world-affairs, technology.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: editorialSchema,
                    }
                });

                if (response.text) {
                    const parsed = JSON.parse(response.text);
                    editorials.push({
                        id: Math.random().toString(36).substring(7),
                        ...parsed,
                        source: article.sourceName,
                        publishedAt: article.publishedAt.toISOString(),
                        refreshCycle: 12
                    });
                }
            } catch (err) {
                console.error("Failed to generate editorial for article", article.url, err);
            }
        }
        return editorials;
    }

    static async getYesterdayNews() {
        const categories = ["sports", "fintech", "politics", "general", "technology", "business"];
        const articles = [];

        for (const cat of categories) {
            const topItem = await prisma.newsArticle.findFirst({
                where: { category: cat },
                orderBy: { publishedAt: 'desc' }
            });
            if (topItem) {
                articles.push({
                    id: topItem.id,
                    category: cat,
                    headline: topItem.title,
                    summary: topItem.content.substring(0, 150) + "...",
                    keyFact: `Published by ${topItem.sourceName}`,
                    readTime: Math.max(3, Math.ceil(topItem.content.length / 1000)),
                    source: topItem.sourceName,
                    url: topItem.url,
                    publishedAt: topItem.publishedAt.toISOString()
                });
            }
        }
        return articles;
    }
}
