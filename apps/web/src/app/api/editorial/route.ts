import { NextResponse } from "next/server";
import { FALLBACK_EDITORIALS, type CategoryId } from "@/lib/editorialData";

// Next.js will revalidate this route every 12 hours
export const revalidate = 43200;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get("category") || "sports") as CategoryId;

    try {
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
        const res = await fetch(`${backendUrl}/api/editorial?category=${category}`);
        if (!res.ok) throw new Error("Backend editorial fetch failed");

        const editorials = await res.json();

        // If AI generation fails or returns empty, fallback to static data
        if (!editorials || editorials.length === 0) {
            throw new Error("No editorials generated");
        }

        return NextResponse.json(editorials, {
            headers: {
                "Cache-Control": "public, max-age=43200, stale-while-revalidate=3600",
            },
        });
    } catch (err) {
        console.error("Using fallback editorials:", err);
        const fallbacks = FALLBACK_EDITORIALS.filter((e) => e.category === category);
        return NextResponse.json(fallbacks, {
            headers: {
                "Cache-Control": "public, max-age=43200, stale-while-revalidate=3600",
            },
        });
    }
}

