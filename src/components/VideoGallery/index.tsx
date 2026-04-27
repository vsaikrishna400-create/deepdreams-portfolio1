'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Fallback videos in case the sheet fetch fails or is empty
const defaultVideos = [
    {
        src: '/videos/shiva.mp4',
        title: 'Mother\'s Blessing - Scene 1',
        category: ['Mother AI']
    },
    {
        src: '/videos/ajay.mp4',
        title: 'Mother\'s Blessing - Scene 2',
        category: ['Mother AI']
    },
    {
        src: '/videos/celebration.mp4',
        title: 'Family Celebration',
        category: ['General']
    },
    {
        src: '/videos/temple.mp4',
        title: 'Spiritual Experience',
        category: ['General']
    },
    {
        src: '/videos/brand-story-1.mp4',
        title: 'Brand Story - Part 1',
        category: ['Ad Campaign']
    },
    {
        src: '/videos/brand-story-2.mp4',
        title: 'Brand Story - Finale',
        category: ['Ad Campaign']
    },
    {
        src: '/videos/amamma-ai-video-mobile.mp4',
        title: 'Grandmother\'s Legacy',
        category: ['Grandmother AI']
    },
    {
        src: '/videos/father-mother-ai.mp4',
        title: 'Father & Mother Reunion',
        category: ['Father AI', 'Mother AI']
    },
    {
        src: '/videos/father-grandmother-ai.mp4',
        title: 'Father & Grandmother Blessings',
        category: ['Father AI', 'Grandmother AI']
    },
];

// Spreadsheet ID from .env.local
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID || '';

/**
 * Converts a standard Google Drive share link into a direct streamable link for <video> tags.
 */
function getGoogleDriveDirectLink(url: string) {
    if (!url || !url.includes('drive.google.com')) return url;
    const match = url.match(/\/d\/([^/]+)/);
    if (match && match[1]) {
        // Direct download link for streaming
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
}

export default function VideoGallery() {
    const [videos, setVideos] = useState(defaultVideos);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Fetch data from Google Sheet on mount
    useEffect(() => {
        async function fetchSheetData() {
            if (!SPREADSHEET_ID) {
                setLoading(false);
                return;
            }

            try {
                // Add a timestamp to avoid browser caching of the sheet
                const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&t=${Date.now()}`;
                const response = await fetch(url);
                const csvText = await response.text();
                
                const allRows = csvText.split('\n').map(row => row.split(','));
                
                // Smart header detection: find the row that actually contains the word "title"
                const headerIndex = allRows.findIndex(row => 
                    row.some(cell => cell.trim().toLowerCase() === 'title')
                );

                if (headerIndex === -1) {
                    console.error("Could not find a valid header row in the spreadsheet.");
                    setLoading(false);
                    return;
                }

                const headers = allRows[headerIndex].map(h => h.trim().toLowerCase());
                const dataRows = allRows.slice(headerIndex + 1);
                
                const jsonData = dataRows
                    .filter(row => row.length >= headers.length && row.some(cell => cell.trim() !== ''))
                    .map(row => {
                        const obj: any = {};
                        headers.forEach((header, index) => {
                            let value = row[index]?.trim() || '';
                            // Remove quotes
                            value = value.replace(/^["']|["']$/g, '');
                            
                            if (header === 'category') {
                                obj[header] = value.split(/[|,]/).map(c => c.trim()).filter(c => c !== '');
                            } else if (header === 'src') {
                                obj[header] = getGoogleDriveDirectLink(value);
                            } else {
                                obj[header] = value;
                            }
                        });
                        return obj;
                    })
                    .filter(item => item.src && item.src !== ''); // Must have a source link

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

    // Dynamic categories based on data
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

    const handleFilterClick = (cat: string) => {
        setFilter(cat);
    };

    return (
        <section id="portfolio" ref={sectionRef} className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
            {/* Animated background accent */}
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
                                onClick={() => handleFilterClick(cat)}
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
                                onClick={() => setSelectedVideo(video.src)}
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
                        src={selectedVideo}
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
    video: any;
    index: number;
    onClick: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isTouched, setIsTouched] = useState(false);

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
            <video
                key={video.src}
                ref={videoRef}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            >
                <source src={video.src} type="video/mp4" />
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

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
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
                <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                >
                    <source src={src} type="video/mp4" />
                </video>

                <motion.button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white"
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
