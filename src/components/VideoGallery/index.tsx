'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface Video {
    title: string;
    category: string[];
    src: string;
    thumbnail?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SPREADSHEET_ID = (process as any).env.NEXT_PUBLIC_SPREADSHEET_ID || '';

export default function VideoGallery() {
    const [videos, setVideos] = useState<Video[]>([]);
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
                const response = await fetch(url, { cache: 'no-store' });
                
                if (!response.ok) throw new Error('Failed to fetch spreadsheet');
                
                const csvText = await response.text();
                const allRows = csvText.split('\n').map(row => row.split(','));
                const headerIndex = allRows.findIndex(row => 
                    row.some(cell => cell.trim().toLowerCase().includes('title'))
                );

                if (headerIndex === -1) {
                    setLoading(false);
                    return;
                }

                const headers = allRows[headerIndex].map(h => h.trim().toLowerCase());
                const dataRows = allRows.slice(headerIndex + 1);
                
                const getColIndex = (name: string) => headers.findIndex(h => h.includes(name));
                const titleIdx = getColIndex('title');
                const srcIdx = getColIndex('src');
                const catIdx = getColIndex('category');
                const thumbIdx = getColIndex('thumbnail');

                const jsonData: Video[] = dataRows
                    .filter(row => row.length > 1 && row[srcIdx] && row[srcIdx].trim() !== '')
                    .map(row => {
                        const title = (row[titleIdx] || '').trim().replace(/^["']|["']$/g, '') || 'Untitled AI Video';
                        let src = (row[srcIdx] || '').trim().replace(/^["']|["']$/g, '') || '';
                        const rawCategory = (row[catIdx] || '').trim().replace(/^["']|["']$/g, '') || 'General';
                        const thumbnail = (row[thumbIdx] || '').trim().replace(/^["']|["']$/g, '') || '';

                        // Simple, robust conversion for the common mistake of using Drive/Dropbox links
                        // This still tries to help, but is designed for DIRECT links.
                        if (src.includes('dropbox.com')) {
                            src = src.replace('dl=0', 'raw=1');
                            if (!src.includes('raw=1')) src += (src.includes('?') ? '&' : '?') + 'raw=1';
                        } else if (src.includes('drive.google.com') && src.includes('/file/d/')) {
                            const fileId = src.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
                            if (fileId) src = `https://drive.google.com/uc?id=${fileId}&export=download`;
                        }

                        const category = rawCategory.split(/[|]/).map(c => c.trim()).filter(c => c !== '');

                        return { title, src, category, thumbnail };
                    });

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
        : videos.filter(v => v.category.includes(filter));

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
                    background: 'radial-gradient(circle, rgba(196, 160, 82, 0.08) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#c4a052] to-transparent mx-auto mb-6"
                    />
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
                        Our <span className="text-[#c4a052]">Portfolio</span>
                    </h2>
                    <p className="text-[#808080] text-lg max-w-2xl mx-auto">
                        {loading ? 'Fetching enterprise assets...' : 'Cinematic AI storytelling that brings memories to life'}
                    </p>
                </motion.div>

                {/* Filter Tabs - Enterprise Mobile Slider */}
                <div className="relative mb-12 overflow-hidden">
                    {/* Professional Gradient Mask for Edge Fading */}
                    <div 
                        className="absolute inset-0 z-10 pointer-events-none hidden md:block"
                        style={{
                            background: 'linear-gradient(90deg, #0a0a0a 0%, transparent 5%, transparent 95%, #0a0a0a 100%)'
                        }}
                    />

                    <div 
                        ref={scrollContainerRef} 
                        className="flex items-center gap-3 overflow-x-auto pb-4 px-4 md:px-0 md:justify-center -mx-4 md:mx-0 no-scrollbar snap-x snap-proximity"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                        }}
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all snap-start ${
                                    filter === cat
                                        ? 'bg-[#c4a052] text-[#0a0a0a] shadow-[0_0_20px_rgba(196,160,82,0.4)]'
                                        : 'bg-white/5 text-[#a0a0a0] hover:text-white border border-white/10 hover:bg-white/10'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                </div>

                {filteredVideos.length === 0 && !loading && (
                    <div className="text-center py-20 text-[#666]">
                        No videos found for this category.
                    </div>
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

function VideoCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onMouseEnter={() => {
                setIsHovered(true);
                videoRef.current?.play().catch(() => {});
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                videoRef.current?.pause();
                if (videoRef.current) videoRef.current.currentTime = 0;
            }}
            onClick={onClick}
            className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5"
        >
            {/* Background Thumbnail or Video Preview */}
            <div className="absolute inset-0 w-full h-full">
                {video.thumbnail && !isHovered ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        src={video.src}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            {/* Play Button Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                <div className="w-16 h-16 rounded-full bg-[#c4a052] flex items-center justify-center shadow-[0_0_30px_rgba(196,160,82,0.5)]">
                    <svg className="w-8 h-8 text-[#0a0a0a] fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex gap-2 mb-2">
                    {video.category.map(cat => (
                        <span key={cat} className="text-[10px] uppercase tracking-widest text-[#c4a052] font-bold">
                            {cat}
                        </span>
                    ))}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#c4a052] transition-colors">
                    {video.title}
                </h3>
            </div>
        </motion.div>
    );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden bg-black shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
            >
                <video
                    src={video.src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                />
                
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#c4a052] hover:text-[#0a0a0a] transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </motion.div>

            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
                <div className="flex justify-center gap-4 text-[#c4a052] text-sm">
                    {video.category.map(cat => <span key={cat}>#{cat}</span>)}
                </div>
                <a 
                    href={video.src} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-8 py-3 rounded-full border border-white/20 text-[#808080] hover:text-white hover:border-white transition-all text-sm"
                >
                    Problem playing? Open direct link
                </a>
            </div>
        </motion.div>
    );
}
