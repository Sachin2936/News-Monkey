"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Authentication guard component that protects routes.
 * Redirects to /login if user is not authenticated.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!isPending && !session?.user && !isRedirecting) {
            setIsRedirecting(true);
            router.push("/login");
        }
    }, [session, isPending, router, isRedirecting]);

    // Show loading spinner while checking authentication
    if (isPending || isRedirecting) {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-muted-foreground font-medium">Loading...</p>
                    </div>
                </div>
            )
        );
    }

    // If not authenticated, don't render children (will redirect)
    if (!session?.user) {
        return null;
    }

    // User is authenticated, render children
    return <>{children}</>;
}

/**
 * Hook to check if user is authenticated.
 * Returns session data and authentication status.
 */
export function useAuth() {
    const { data: session, isPending } = authClient.useSession();

    return {
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: isPending,
        session,
    };
}
