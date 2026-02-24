import { NextResponse } from "next/server";
import { YESTERDAY_ARTICLES } from "@/lib/editorialData";

// Revalidate every 12 hours — Next.js will serve stale while revalidating
export const revalidate = 43200; // 12h in seconds

export async function GET() {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/api/yesterday`);
        if (!res.ok) throw new Error("Backend yesterday fetch failed");

        const articles = await res.json();

        if (!articles || articles.length === 0) {
            throw new Error("No yesterday articles returned");
        }

        return NextResponse.json(articles, {
            headers: {
                "Cache-Control": "public, max-age=43200, stale-while-revalidate=3600",
            },
        });
    } catch (err) {
        console.error("Using fallback yesterday news:", err);
        return NextResponse.json(YESTERDAY_ARTICLES, {
            headers: {
                "Cache-Control": "public, max-age=43200, stale-while-revalidate=3600",
            },
        });
    }
}
