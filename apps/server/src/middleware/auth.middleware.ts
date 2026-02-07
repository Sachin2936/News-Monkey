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
        // // Debug: Log request origin and cookies
        // console.log('[Auth] Request origin:', req.headers.origin);
        // console.log('[Auth] Cookie header:', req.headers.cookie ? 'Present' : 'Missing');

        // Get the session token from cookies
        const cookies = req.headers.cookie?.split('; ') ?? [];

        const sessionToken =cookies.find(row =>
            row.startsWith('__Secure-better-auth.session_token=')
        )?.split('=')[1] ??
        cookies.find(row =>
            row.startsWith('better-auth.session_token=')
        )?.split('=')[1];


        if (!sessionToken) {
            console.log('[Auth] No session token found in cookies');
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        console.log('[Auth] Session token found, verifying...');

        // Verify the session using Better Auth
        const session = await auth.api.getSession({
            headers: req.headers as Record<string, any>,
        });

        if (!session || !session.user) {
            console.log('[Auth] Session validation failed - session:', !!session, 'user:', !!(session?.user));
            res.status(401).json({ error: "Invalid or expired session" });
            return;
        }

        console.log('[Auth] Session validated for user:', session.user.email);

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
        console.error("[Auth] Authentication error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
}
