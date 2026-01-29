import { toast } from "sonner";

export interface TypingResultDto {
    articleTitle: string;
    articleSource: string;
    articleUrl: string;
    wpm: number;
    accuracy: number;
    errors: number;
    totalCharsTyped: number;
    category: string;
    region: 'us' | 'in';
    cpm: number;
    publishedAt?: string;
}

export interface TypingResultResponse {
    id: string;
    userId: string;
    articleTitle: string;
    articleSource: string;
    articleUrl: string;
    wpm: number;
    accuracy: number;
    errors: number;
    totalCharsTyped: number;
    category: string;
    region: 'us' | 'in';
    cpm: number;
    publishedAt?: string;
    createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class DashboardService {
    /**
     * Save a typing result to the database
     */
    async saveTypingResult(data: TypingResultDto): Promise<TypingResultResponse | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/typing-results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Failed to save typing result' }));
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving typing result:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save typing result');
            return null;
        }
    }

    /**
     * Get all typing results for the authenticated user
     */
    async getTypingResults(): Promise<TypingResultResponse[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/typing-results`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // User is not authenticated
                    return [];
                }
                const error = await response.json().catch(() => ({ message: 'Failed to fetch typing results' }));
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            const results = await response.json();
            return results;
        } catch (error) {
            console.error('Error fetching typing results:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to fetch typing results');
            return [];
        }
    }

    /**
     * Delete a specific typing result
     */
    async deleteTypingResult(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/typing-results/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Failed to delete typing result' }));
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            toast.success('Typing result deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting typing result:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete typing result');
            return false;
        }
    }

    /**
     * Clear all typing results for the authenticated user
     */
    async clearTypingResults(): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/typing-results`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Failed to clear typing results' }));
                throw new Error(error.message || `HTTP error! status: ${response.status}`);
            }

            toast.success('All typing results cleared successfully');
            return true;
        } catch (error) {
            console.error('Error clearing typing results:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to clear typing results');
            return false;
        }
    }
}

// Export a singleton instance
export const dashboardService = new DashboardService();
