"use client";

import Link from 'next/link';
import { Newspaper, Github, Twitter, Linkedin } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const Footer = () => {
    const { data: session } = authClient.useSession();
    const homeHref = session ? '/dashboard' : '/';

    return (
        <footer className="bg-background/50 border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link href={homeHref} className="flex items-center gap-2">
                            <Newspaper className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold tracking-tight">
                                News<span className="text-primary">Type</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            The ultimate platform for improving your typing speed while staying
                            up to date with the latest global news and technology trends.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href={"/practice" as any} className="hover:text-primary transition-colors">Typing Test</Link></li>
                            <li><Link href={"/results" as any} className="hover:text-primary transition-colors">Statistics</Link></li>
                            <li><Link href={"/settings" as any} className="hover:text-primary transition-colors">Settings</Link></li>
                            <li><Link href={"/about" as any} className="hover:text-primary transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href={"#" as any} className="hover:text-primary transition-colors">API Docs</Link></li>
                            <li><Link href={"#" as any} className="hover:text-primary transition-colors">Typing Tips</Link></li>
                            <li><Link href={"#" as any} className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href={"#" as any} className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} NewsType. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
