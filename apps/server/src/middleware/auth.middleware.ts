import { auth } from "@News-Monkey/auth";
import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        name: string;
    };
    session?: {
        id: string;
        userId: string;
        expiresAt: Date;
    };
}

/**
 * Middleware to verify user authentication using Better Auth
 */
export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Get the session token from cookies
        const sessionToken = req.headers.cookie
            ?.split('; ')
            .find(row => row.startsWith('better-auth.session_token='))
            ?.split('=')[1];

        if (!sessionToken) {
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        // Verify the session using Better Auth
        const session = await auth.api.getSession({
            headers: req.headers as Record<string, any>,
        });

        if (!session || !session.user) {
            res.status(401).json({ error: "Invalid or expired session" });
            return;
        }

        // Attach user and session info to request
        (req as AuthenticatedRequest).user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
        };

        (req as AuthenticatedRequest).session = {
            id: session.session.id,
            userId: session.session.userId,
            expiresAt: new Date(session.session.expiresAt),
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
}
