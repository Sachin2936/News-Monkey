"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Newspaper, Keyboard, LayoutDashboard, Settings,
    LogOut, BookOpenText, ChevronDown, User, UserCircle, Info,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ThemeToggle } from './theme-toggle';
import { authClient } from '@/lib/auth-client';

function initials(name?: string | null) {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function ProfileMenu({ session }: { session: any }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSignOut = async () => {
        setOpen(false);
        await authClient.signOut();
        router.push('/');
    };

    const gotoProfile = () => {
        setOpen(false);
        router.push('/profile');
    };

    const user = session.user;
    const ini = initials(user?.name);

    const quickLinks = [
        { label: 'My Profile', href: '/profile', icon: UserCircle, color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
        { label: 'Practice', href: '/practice', icon: Keyboard, color: '#059669', bg: 'rgba(5,150,105,0.12)' },
        { label: 'Editorial', href: '/editorial', icon: BookOpenText, color: '#9333ea', bg: 'rgba(147,51,234,0.12)' },
        { label: 'Settings', href: '/settings', icon: Settings, color: '#0284c7', bg: 'rgba(2,132,199,0.12)' },
    ];

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-1.5 outline-none group"
                aria-label="Open profile menu"
            >
                <motion.div
                    animate={{ boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.45)' : '0 0 0 2px rgba(99,102,241,0)' }}
                    transition={{ duration: 0.2 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white select-none overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
                >
                    {user?.image
                        ? <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
                        : ini
                    }
                </motion.div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: -6 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-12 w-72 z-50 rounded-2xl overflow-hidden border border-border/60"
                        style={{ background: 'var(--background)', boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)' }}
                    >
                        {/* Hero strip — click to open profile */}
                        <button onClick={gotoProfile} className="w-full text-left px-5 pt-5 pb-4 hover:opacity-80 transition-opacity"
                            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.07) 100%)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0 overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>
                                    {user?.image
                                        ? <img src={user.image} alt={user.name ?? ''} className="w-full h-full object-cover" />
                                        : ini
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-[15px] text-foreground truncate leading-tight">{user?.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
                                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                                        style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>
                                        <User className="w-2.5 h-2.5" /> View Profile →
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* Quick links */}
                        <div className="p-2 space-y-0.5">
                            {quickLinks.map(link => {
                                const Icon = link.icon;
                                return (
                                    <Link key={link.href} href={link.href as any} onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-colors group/link">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover/link:scale-110"
                                            style={{ background: link.bg }}>
                                            <Icon className="w-4 h-4" style={{ color: link.color }} />
                                        </div>
                                        <span className="text-[14px] font-semibold text-foreground/75 group-hover/link:text-foreground transition-colors">
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Sign out */}
                        <div className="px-2 pb-2">
                            <div className="h-px bg-border/60 mb-2" />
                            <button onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold transition-all group/out hover:bg-rose-500/10 text-rose-500">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover/out:bg-rose-500/20 transition-colors">
                                    <LogOut className="w-4 h-4 text-rose-500" />
                                </div>
                                Sign Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Navbar = () => {
    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();

    const navItems = [
        { name: 'About', href: '/about' as any, icon: Info },
        { name: 'Practice', href: '/practice' as any, icon: Keyboard },
        { name: 'Dashboard', href: '/dashboard' as any, icon: LayoutDashboard },
        { name: 'Editorial', href: '/editorial' as any, icon: BookOpenText },
        { name: 'Settings', href: '/settings' as any, icon: Settings },
    ];

    const logoHref = session?.user ? '/profile' : '/';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-3xl border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo → /profile when logged in */}
                <Link href={logoHref} className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500 border border-white/10">
                        <Newspaper className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <span className="text-xl font-black tracking-tighter uppercase italic">
                        News<span className="text-primary">Monkey</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === (item.href as string);
                        return (
                            <Link key={item.name} href={item.href}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {item.name}
                                </div>
                                {isActive && (
                                    <motion.div layoutId="navbar-active"
                                        className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {isPending ? (
                        <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                    ) : session?.user ? (
                        <ProfileMenu session={session} />
                    ) : (
                        <Link href="/login"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
