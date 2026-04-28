'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface Video {
    src: string;
    title: string;
    category: string[];
    isDrive: boolean;
}

// Fallback videos in case the sheet fetch fails or is empty
const defaultVideos: Video[] = [
    {
        src: 'https://drive.google.com/file/d/1xMZ84MmEY7zK-GhOQtv9PryWGVer0mW6/view',
        title: 'Family Members AI',
        category: ['Family'],
        isDrive: true
    },
    {
        src: 'https://drive.google.com/file/d/1ya_-WB3euB5TBGxbz-K5Sx_4cPUoNvJp/view',
        title: 'Father and Grandmother',
        category: ['Father', 'Grandmother'],
        isDrive: true
    },
    {
        src: 'https://drive.google.com/file/d/1qTarPa9No0wadIKOAWOr4mrsO_wWSOy6/view',
        title: 'Father AI Video',
        category: ['Father'],
        isDrive: true
    },
    {
        src: 'https://drive.google.com/file/d/1LiYnIN7BmnT87L6adrwZsiXhpoYTylFN/view',
        title: 'Grandfather AI Video',
        category: ['Grandfather'],
        isDrive: true
    },
    {
        src: 'https://drive.google.com/file/d/1ys2wXRXz3KUKIDDKv7OxuVXv1P3o31ao/view',
        title: 'Small Brother AI Video',
        category: ['Brother'],
        isDrive: true
    },
    {
        src: 'https://drive.google.com/file/d/1By-9HttTtxD1STdo8CEQFD_yZisYwgo4/view',
        title: 'Trending Father AI',
        category: ['Father'],
        isDrive: true
    }
];

const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID || '';

/**
 * Extracts the Google Drive file ID from a share URL.
 */
function extractDriveFileId(url: string): string | null {
    if (!url || !url.includes('drive.google.com')) return null;
    const match = url.match(/\/d\/([^/]+)/);
    return match ? match[1] : null;
}

/**
 * Converts a Google Drive share link to a direct stream URL.
 * Note: Google blocks direct streaming for files > 100MB to enforce virus scanning.
 * Compressing videos to < 100MB allows a seamless white-label experience.
 */
function getGoogleDriveEmbedLink(url: string): string {
    const fileId = extractDriveFileId(url);
    if (fileId) {
        return `https://drive.google.com/uc?id=${fileId}&export=download`;
    }
    return url;
}

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
                const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&t=${Date.now()}`;
                const response = await fetch(url);
                const csvText = await response.text();
                
                const allRows = csvText.split('\n').map(row => row.split(','));
                const headerIndex = allRows.findIndex(row => 
                    row.some(cell => cell.trim().toLowerCase() === 'title')
                );

                if (headerIndex === -1) {
                    setLoading(false);
                    return;
                }

                const headers = allRows[headerIndex].map(h => h.trim().toLowerCase());
                const dataRows = allRows.slice(headerIndex + 1);
                
                const jsonData: Video[] = dataRows
                    .filter(row => row.length >= headers.length && row.some(cell => cell.trim() !== ''))
                    .map(row => {
                        const title = row[headers.indexOf('title')]?.trim().replace(/^["']|["']$/g, '') || '';
                        const rawSrc = row[headers.indexOf('src')]?.trim().replace(/^["']|["']$/g, '') || '';
                        const rawCategory = row[headers.indexOf('category')]?.trim().replace(/^["']|["']$/g, '') || '';

                        const isDrive = rawSrc.includes('drive.google.com');
                        const src = isDrive ? getGoogleDriveEmbedLink(rawSrc) : rawSrc;
                        const category = rawCategory.split(/[|]/).map(c => c.trim()).filter(c => c !== '');

                        return { title, src, category, isDrive };
                    })
                    .filter(item => item.src && item.src !== '');

                if (jsonData.length > 0) {
                    setVideos(jsonData);
                }
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

    const categories = ['All', ...Array.from(new Set(videos.flatMap(v => v.category)))];

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
                    className="relative mb-10 md:mb-14"
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
                                key={video.src}
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

            {/* Video Modal */}
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const videoSrc = video.isDrive ? getGoogleDriveEmbedLink(video.src) : video.src;

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleTouchStart = () => {
        if (!isTouched) {
            setIsTouched(true);
            setIsHovered(true);
            if (videoRef.current) {
                videoRef.current.play().catch(() => { });
            }
        }
    };

    const active = isHovered || isTouched;

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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onClick={onClick}
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group active:scale-[0.98] transition-transform"
            style={{
                background: 'rgba(15, 15, 15, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            whileHover={{ y: -5 }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-[#c4a052] border-t-transparent rounded-full"
                    />
                </div>
            )}

            <video
                key={videoSrc}
                ref={videoRef}
                src={videoSrc}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setIsLoaded(true)}
                className="w-full h-full object-cover"
            >
                Your browser does not support the video tag.
            </video>

            <div
                className="absolute inset-0 md:opacity-0 opacity-100"
                style={{
                    background: 'linear-gradient(180deg, transparent 40%, rgba(10, 10, 10, 0.85) 100%)',
                }}
            />

            <motion.div
                className="absolute inset-0 hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.2) 0%, rgba(10, 10, 10, 0.9) 100%)',
                }}
            />

            {/* Play button overlay */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: active ? 1 : 0.7,
                    scale: active ? 1 : 0.8
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(196, 160, 82, 0.95) 0%, rgba(212, 184, 122, 0.95) 100%)',
                        boxShadow: '0 0 30px rgba(196, 160, 82, 0.5)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className="w-5 h-5 md:w-7 md:h-7 text-[#0a0a0a] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Title & category label */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 md:p-4"
                initial={false}
                animate={{
                    y: active ? 0 : 0,
                    opacity: 1
                }}
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
                {/* Professional Video Player */}
                <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    src={video.isDrive ? getGoogleDriveEmbedLink(video.src) : video.src}
                >
                    Your browser does not support the video tag.
                </video>

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
