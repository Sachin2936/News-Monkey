import { dashboardService, type TypingResultDto } from "@/services/dashboard.service";
import { useTypingStore, type HistoryItem } from "@/store/useTypingStore";
import { toast } from "sonner";

const SYNC_FLAG_KEY = "news-monkey-history-synced";

/**
 * Check if the localStorage history has already been synced to the backend.
 */
export function hasHistorySynced(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SYNC_FLAG_KEY) === "true";
}

/**
 * Mark the history as synced.
 */
export function markHistorySynced(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(SYNC_FLAG_KEY, "true");
}

/**
 * Clear the sync flag (useful for testing or manual reset).
 */
export function clearSyncFlag(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(SYNC_FLAG_KEY);
}

/**
 * Convert a HistoryItem from the store to a TypingResultDto for the API.
 */
function historyItemToDto(item: HistoryItem, category: string = "general"): TypingResultDto {
    return {
        articleTitle: item.article.title,
        articleSource: item.article.source,
        articleUrl: item.article.url,
        wpm: item.wpm,
        accuracy: item.accuracy,
        errors: 0, // Error count not stored in old history format
        totalCharsTyped: Math.round(item.cpm * ((item.wpm > 0 ? item.cpm / item.wpm : 0) / 60)), // Approximate
        category: category,
        region: item.region,
        cpm: item.cpm,
        publishedAt: item.date,
    };
}

/**
 * Sync localStorage typing history to the backend.
 * This should be called once when a user first logs in.
 * 
 * Returns true if sync was successful (or already done), false on error.
 */
export async function syncLocalHistoryToBackend(): Promise<boolean> {
    // Don't run on server
    if (typeof window === "undefined") return true;

    // Already synced
    if (hasHistorySynced()) {
        return true;
    }

    // Get history from store
    const store = useTypingStore.getState();
    const history = store.history;

    // No history to sync
    if (history.length === 0) {
        markHistorySynced();
        return true;
    }

    try {
        // Batch upload to backend (in parallel with some rate limiting)
        const batchSize = 5;
        let successCount = 0;

        for (let i = 0; i < history.length; i += batchSize) {
            const batch = history.slice(i, i + batchSize);
            const promises = batch.map((item) => dashboardService.saveTypingResult(historyItemToDto(item)));
            const results = await Promise.all(promises);
            successCount += results.filter((r) => r !== null).length;
        }

        // Mark as synced
        markHistorySynced();

        // Clear localStorage history after successful sync
        store.clearHistory();

        if (successCount > 0) {
            toast.success(`Synced ${successCount} typing result${successCount > 1 ? "s" : ""} to your account`);
        }

        return true;
    } catch (error) {
        console.error("Error syncing history to backend:", error);
        toast.error("Failed to sync your typing history");
        return false;
    }
}
