const SERVER_URL = 'http://localhost:3000';

/**
 * Fetch news from our backend server (Direct Fetch)
 */
export async function getNews(category = 'general', _country = 'us') {
    try {
        console.log(`[Frontend] Fetching news from ${SERVER_URL}/api/news?category=${category}`);
        const response = await fetch(`${SERVER_URL}/api/news?category=${category}`, {
            cache: 'no-store' // Disable Next.js caching to get fresh data
        });

        if (!response.ok) {
            throw new Error(`Backend fetch failed: ${response.statusText}`);
        }

        const articles = await response.json();
        console.log("[Frontend] Fetched articles count:", articles.length);
        return articles;
    } catch (error) {
        console.error("Error fetching news from backend:", error);
        return [];
    }
}

// // Keep these as empty for compatibility with existing components
// export async function saveNewsToCache(_articles, _region = 'us') { }
// export async function loadNewsFromCache(_region = 'us') { return null; }
