'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface Video {
    title: string;
    category: string[];
    iframeSrc: string;
    thumbnailUrl?: string;
    provider: 'youtube' | 'drive' | 'dropbox' | 'other';
}

/**
 * Extract YouTube video ID from various URL formats.
 */
function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    // youtube.com/watch?v=ID, youtube.com/embed/ID, youtu.be/ID, youtube.com/shorts/ID
    const patterns = [
        /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

/**
 * Extract Google Drive file ID from various URL formats.
 */
function extractDriveFileId(url: string): string | null {
    if (!url || !url.includes('drive.google.com')) return null;
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD) return matchD[1];
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId) return matchId[1];
    return null;
}

/**
 * Process any video URL into a universal iframe embed.
 * Supports: YouTube, Google Drive, Dropbox.
 * ALL videos are rendered as iframes — no <video> tag needed.
 */
function processVideoUrl(url: string): { iframeSrc: string; thumbnailUrl?: string; provider: Video['provider'] } {
    if (!url) return { iframeSrc: '', provider: 'other' };

    // YouTube — the gold standard
    const ytId = extractYouTubeId(url);
    if (ytId) {
        return {
            iframeSrc: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&showinfo=0`,
            thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
            provider: 'youtube',
        };
    }

    // Google Drive — use official preview iframe
    const driveId = extractDriveFileId(url);
    if (driveId) {
        return {
            iframeSrc: `https://drive.google.com/file/d/${driveId}/preview`,
            thumbnailUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
            provider: 'drive',
        };
    }

    // Dropbox — convert share link to embeddable format
    if (url.includes('dropbox.com')) {
        // Replace dl=0 with raw=1 for direct file access
        let embedUrl = url;
        if (embedUrl.includes('?')) {
            embedUrl = embedUrl.replace('dl=0', 'raw=1');
            if (!embedUrl.includes('raw=1')) embedUrl += '&raw=1';
        } else {
            embedUrl += '?raw=1';
        }
        return {
            iframeSrc: embedUrl,
            provider: 'dropbox',
        };
    }

    // Fallback — try as direct embed
    return { iframeSrc: url, provider: 'other' };
}

// Fallback videos in case the sheet fetch fails or is empty
const defaultVideos: Video[] = [
    {
        title: 'Family Members AI',
        category: ['Family'],
        ...processVideoUrl('https://drive.google.com/file/d/1xMZ84MmEY7zK-GhOQtv9PryWGVer0mW6/view'),
    },
    {
        title: 'Father and Grandmother',
        category: ['Father', 'Grandmother'],
        ...processVideoUrl('https://drive.google.com/file/d/1ya_-WB3euB5TBGxbz-K5Sx_4cPUoNvJp/view'),
    },
    {
        title: 'Father AI Video',
        category: ['Father'],
        ...processVideoUrl('https://drive.google.com/file/d/1qTarPa9No0wadIKOAWOr4mrsO_wWSOy6/view'),
    },
    {
        title: 'Grandfather AI Video',
        category: ['Grandfather'],
        ...processVideoUrl('https://drive.google.com/file/d/1LiYnIN7BmnT87L6adrwZsiXhpoYTylFN/view'),
    },
    {
        title: 'Small Brother AI Video',
        category: ['Brother'],
        ...processVideoUrl('https://drive.google.com/file/d/1ys2wXRXz3KUKIDDKv7OxuVXv1P3o31ao/view'),
    },
    {
        title: 'Trending Father AI',
        category: ['Father'],
        ...processVideoUrl('https://drive.google.com/file/d/1By-9HttTtxD1STdo8CEQFD_yZisYwgo4/view'),
    },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SPREADSHEET_ID = (process as any).env.NEXT_PUBLIC_SPREADSHEET_ID || '';

export default function VideoGallery() {
    const [videos, setVideos] = useState<Video[]>(defaultVideos);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [filter, setFilter] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        async function fetchSheetData() {
            if (!SPREADSHEET_ID) {
                setLoading(false);
                return;
            }

            try {
                // Force no-cache to ensure we get the latest sheet data every time
                const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&t=${Date.now()}`;
                const response = await fetch(url, { cache: 'no-store' });

                if (!response.ok) throw new Error('Failed to fetch spreadsheet');

                const csvText = await response.text();

                const allRows = csvText.split('\n').map(row => row.split(','));
                const headerIndex = allRows.findIndex(row =>
                    row.some(cell => cell.trim().toLowerCase().includes('title'))
                );

                if (headerIndex === -1) {
                    console.error('Could not find header row in spreadsheet');
                    setLoading(false);
                    return;
                }

                const headers = allRows[headerIndex].map(h => h.trim().toLowerCase());
                const dataRows = allRows.slice(headerIndex + 1);

                // Helper to find index even if there are extra spaces in headers
                const getColIndex = (name: string) => headers.findIndex(h => h.includes(name));
                const titleIdx = getColIndex('title');
                const srcIdx = getColIndex('src');
                const catIdx = getColIndex('category');

                const jsonData: Video[] = dataRows
                    .filter(row => row.length > 1 && row[srcIdx] && row[srcIdx].trim() !== '')
                    .map(row => {
                        const title = (row[titleIdx] || '').trim().replace(/^["']|["']$/g, '') || 'Untitled AI Video';
                        const rawSrc = (row[srcIdx] || '').trim().replace(/^["']|["']$/g, '') || '';
                        const rawCategory = (row[catIdx] || '').trim().replace(/^["']|["']$/g, '') || 'General';

                        const { iframeSrc, thumbnailUrl, provider } = processVideoUrl(rawSrc);
                        const category = rawCategory.split(/[|]/).map(c => c.trim()).filter(c => c !== '');

                        return { title, category, iframeSrc, thumbnailUrl, provider };
                    })
                    .filter(video => video.iframeSrc !== '');

                if (jsonData.length > 0) {
                    setVideos(jsonData);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch Google Sheet data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSheetData();
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const desiredOrder = ['All', 'Latest', 'Father', 'Mother', 'Grandfather', 'Grandmother', 'Brother', 'Sister'];
    const categories = Array.from(new Set(['All', ...videos.flatMap(v => v.category)]))
        .sort((a, b) => {
            const indexA = desiredOrder.indexOf(a);
            const indexB = desiredOrder.indexOf(b);
            if (indexA === -1 && indexB === -1) return a.localeCompare(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

    const filteredVideos = filter === 'All'
        ? videos
        : videos.filter(v =>
            Array.isArray(v.category)
                ? v.category.includes(filter)
                : v.category === filter
        );

    const updateScrollIndicators = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        updateScrollIndicators();
        el.addEventListener('scroll', updateScrollIndicators, { passive: true });
        window.addEventListener('resize', updateScrollIndicators);
        return () => {
            el.removeEventListener('scroll', updateScrollIndicators);
            window.removeEventListener('resize', updateScrollIndicators);
        };
    }, [updateScrollIndicators]);

    return (
        <section id="portfolio" ref={sectionRef} className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
            <motion.div
                className="absolute right-0 top-1/2 w-96 h-96 rounded-full -z-10"
                style={{
                    y,
                    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" as const }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-[#c4a052] to-transparent mx-auto mb-4 md:mb-6"
                    />
                    <motion.h2
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-5"
                        style={{
                            background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 50%, #c4a052 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Video Portfolio
                    </motion.h2>
                    <p className="text-[#808080] text-sm md:text-lg max-w-2xl mx-auto px-2">
                        {loading && SPREADSHEET_ID ? 'Syncing with dashboard...' : 'AI-powered video productions that create emotional connections'}
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="relative mb-4 md:mb-6"
                >
                    <div
                        className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 md:hidden ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
                        style={{ background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)' }}
                    />
                    <div
                        className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 md:hidden ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
                        style={{ background: 'linear-gradient(to left, #0a0a0a 0%, transparent 100%)' }}
                    />

                    <div
                        ref={scrollContainerRef}
                        className="flex md:justify-center gap-2.5 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-1 md:px-0 snap-x snap-mandatory md:snap-none"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {categories.map((cat, i) => (
                            <motion.button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + i * 0.08 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative flex-shrink-0 snap-start px-5 md:px-6 py-2.5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${filter === cat
                                    ? 'text-[#0a0a0a]'
                                    : 'text-[#a0a0a0] hover:text-white'
                                    }`}
                                style={{
                                    background: filter === cat
                                        ? 'linear-gradient(135deg, #c4a052 0%, #d4b87a 100%)'
                                        : 'rgba(255, 255, 255, 0.03)',
                                    border: filter === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                                }}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Video Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredVideos.map((video, index) => (
                            <VideoCard
                                key={video.iframeSrc}
                                video={video}
                                index={index}
                                onClick={() => setSelectedVideo(video)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredVideos.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-[#666] text-lg">No videos in this category yet</p>
                        <button
                            onClick={() => setFilter('All')}
                            className="mt-4 text-[#c4a052] underline underline-offset-4 text-sm"
                        >
                            View all videos
                        </button>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {selectedVideo && (
                    <VideoModal
                        video={selectedVideo}
                        onClose={() => setSelectedVideo(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function VideoCard({
    video,
    index,
    onClick
}: {
    video: Video;
    index: number;
    onClick: () => void;
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    // For YouTube, show a high-quality thumbnail; for others, show the iframe directly
    const showThumbnail = video.provider === 'youtube' && video.thumbnailUrl;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
                layout: { duration: 0.3 }
            }}
            onClick={onClick}
            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
            style={{
                background: 'rgba(15, 15, 15, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            whileHover={{ y: -5 }}
        >
            {/* Loading spinner */}
            {!isLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a] z-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-[#c4a052] border-t-transparent rounded-full"
                    />
                </div>
            )}

            {/* YouTube thumbnail card — clean, fast, no iframe overhead */}
            {showThumbnail ? (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setIsLoaded(true)}
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        <motion.div
                            className="w-14 h-14 md:w-18 md:h-18 rounded-full flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(196, 160, 82, 0.95) 0%, rgba(212, 184, 122, 0.95) 100%)',
                                boxShadow: '0 0 40px rgba(196, 160, 82, 0.6)',
                            }}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8 text-[#0a0a0a] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </motion.div>
                    </div>
                </>
            ) : (
                /* Drive / Dropbox — render iframe directly in card */
                <iframe
                    src={video.iframeSrc}
                    allow="autoplay; encrypted-media"
                    className="w-full h-full border-0 bg-black pointer-events-none"
                    allowFullScreen
                    onLoad={() => setIsLoaded(true)}
                ></iframe>
            )}

            {/* Gradient overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: 'linear-gradient(180deg, transparent 50%, rgba(10, 10, 10, 0.85) 100%)',
                }}
            />

            {/* Title & category label */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-30 pointer-events-none"
            >
                <div className="text-xs md:text-sm text-[#c4a052] mb-0.5 md:mb-1 font-medium">
                    {Array.isArray(video.category) ? video.category.join(' & ') : video.category}
                </div>
                <div className="text-white font-semibold text-sm md:text-base">
                    {video.title}
                </div>
            </motion.div>
        </motion.div>
    );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // For YouTube, use the embed URL with autoplay
    const modalIframeSrc = video.provider === 'youtube'
        ? `${video.iframeSrc}&autoplay=1`
        : video.iframeSrc;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
        >
            <motion.div
                initial={{ scale: 0.7, opacity: 0, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.7, opacity: 0, rotateX: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl aspect-video rounded-xl md:rounded-2xl overflow-hidden"
                style={{
                    boxShadow: '0 0 80px rgba(196, 160, 82, 0.25)',
                    border: '1px solid rgba(196, 160, 82, 0.2)',
                }}
            >
                <iframe
                    src={modalIframeSrc}
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                    className="w-full h-full border-0 bg-black"
                    allowFullScreen
                ></iframe>

                <motion.button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white z-10"
                    style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(196, 160, 82, 0.8)' }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
