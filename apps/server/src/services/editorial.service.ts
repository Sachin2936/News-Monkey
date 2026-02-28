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
        easyExplanation: { type: Type.STRING },
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
    required: ["title", "category", "context", "easyExplanation", "deepDive", "positives", "negatives", "keyVocab", "discussionPoints", "verdict", "tags", "difficulty", "readTime"]
};

export class EditorialService {
    static async getDailyEditorials(category: string) {
        // Map category to Guardian query/section
        const queryMap: Record<string, string> = {
            "sports": "sport",
            "fintech": "finance OR fintech OR business",
            "politics": "politics",
            "world-affairs": "world",
            "technology": "technology",
        };
        const query = queryMap[category] || category;

        try {
            const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&show-fields=bodyText,headline&page-size=4&order-by=newest&api-key=${env.GUARDIAN_API_KEY}`;
            // Use native fetch
            const res = await fetch(url);
            const data = await res.json() as any;

            if (!data.response || !data.response.results) return [];

            const articles = data.response.results;
            if (articles.length === 0) return [];

            const editorials = [];
            for (const article of articles) {
                const title = article.fields?.headline || article.webTitle;
                const content = article.fields?.bodyText || "";

                if (!content || content.length < 500) continue; // Skip articles with no body

                try {
                    // Generate AI analysis
                    const prompt = `Analyze this news article and format it into a deep-dive educational editorial. 
                    
CRITICAL INSTRUCTIONS:
1. 'easyExplanation': Write a 2-sentence VERY SIMPLE explanation as if explaining to a 10-year old. No jargon.
2. 'context': A professional summary of the current situation.
3. 'deepDive': A detailed analysis of the implications.
4. 'positives' & 'negatives': Clear, distinct benefits and drawbacks.

Article Title: ${title}
Article Source: The Guardian
Content: ${content.substring(0, 3000)}

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
                            source: "The Guardian",
                            publishedAt: article.webPublicationDate || new Date().toISOString(),
                            refreshCycle: 12
                        });
                    }
                } catch (err) {
                    console.error("Failed to generate editorial for article", article.webUrl, err);
                }
            }
            return editorials;
        } catch (error) {
            console.error("Failed to fetch from Guardian API", error);
            return [];
        }
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
