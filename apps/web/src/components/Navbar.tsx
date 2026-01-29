"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Newspaper, Keyboard, LayoutDashboard, Settings, Info, LogOut } from 'lucide-react';

import { ThemeToggle } from './theme-toggle';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Navbar = () => {
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    const navItems = [
        { name: 'Practice', href: '/practice' as any, icon: Keyboard },
        { name: 'Dashboard', href: '/dashboard' as any, icon: LayoutDashboard },
        { name: 'Settings', href: '/settings' as any, icon: Settings },
        { name: 'About', href: '/about' as any, icon: Info },
    ];

    const handleSignOut = async () => {
        await authClient.signOut();
    };
    console.log(session);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-border/50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" as="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors border border-primary/20">
                        <Newspaper className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        News<span className="text-primary">Monkey</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === (item.href as string);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </div>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {isPending ? (
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                    ) : session?.user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="h-8 w-8 ring-1 ring-border cursor-pointer hover:ring-primary/50 transition-all">
                                    <AvatarImage src={session.user.image || undefined} alt={session.user.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                        {session.user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-2">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="p-0">
                                    <Link href="/dashboard" className="w-full px-2 py-2 flex items-center gap-2 cursor-pointer">
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="p-0">
                                    <Link href="/settings" className="w-full px-2 py-2 flex items-center gap-2 cursor-pointer">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
