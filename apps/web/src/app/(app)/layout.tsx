import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../../index.css";
import Providers from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";
import ThemeManager from "@/components/ThemeManager";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewsType | Master Your Typing with Real News",
  description: "Improve your typing speed and accuracy while staying updated with the latest news from around the world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <ThreeBackground />
          <ThemeManager />
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
