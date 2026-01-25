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
    openGraph: {
        title: "DeepDreams AI Studio",
        description: "Transform your dreams into digital reality",
        type: "website",
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
