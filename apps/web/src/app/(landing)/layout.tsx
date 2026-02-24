import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../../index.css";
// Intentionally omitting Navbar, Footer, and ThreeBackground

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "NewsMonkey | Interactive Typing Experience",
    description: "Improve your typing speed and accuracy through an immersive, interactive journey.",
};

export default function LandingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white selection:bg-primary/30 min-h-screen`}>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
