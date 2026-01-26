import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel, Italiana } from "next/font/google"; // Import Italiana
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
    variable: "--font-cinzel",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const italiana = Italiana({
    variable: "--font-italiana",
    subsets: ["latin"],
    weight: ["400"],
});

export const metadata: Metadata = {
    title: "DeepDreams AI Studio | AI Video Production & Web Development",
    description: "Transform your dreams into digital reality with DeepDreams AI Studio. Expert AI video production, stunning web applications, and intelligent chatbot solutions.",
    keywords: ["AI Video", "Web Development", "Chatbots", "AI Agents", "Digital Production"],
    authors: [{ name: "DeepDreams AI Studio" }],
    icons: {
        icon: [
            { url: '/favicon-16x16.png?v=4', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png?v=4', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-48x48.png?v=4', sizes: '48x48', type: 'image/png' },
        ],
        shortcut: '/favicon.ico?v=4',
        apple: '/apple-touch-icon.png?v=4',
    },
    openGraph: {
        title: "DeepDreams AI Studio",
        description: "Transform your dreams into digital reality",
        type: "website",
        images: [
            {
                url: '/images/logo-transparent-new.png',
                width: 1200,
                height: 630,
                alt: 'DeepDreams AI Studio',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "DeepDreams AI Studio",
        description: "Transform your dreams into digital reality",
        images: ['/images/logo-transparent-new.png'],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${playfair.variable} ${cinzel.variable} antialiased bg-[#0a0a0a] text-white`}>
                {children}
            </body>
        </html>
    );
}
