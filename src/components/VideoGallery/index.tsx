'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

interface Video {
    title: string;
    category: string[];
    iframeSrc?: string;
    videoSrc?: string;
    thumbnailUrl?: string;
    originalUrl: string;
    provider: 'youtube' | 'drive' | 'dropbox' | 'other';
}

function extractYouTubeId(url: string): string | null {
    if (!url) return null;
    const patterns = [
        /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
        const m = url.match(p);
        if (m) return m[1];
    }
    return null;
}

function extractDriveFileId(url: string): string | null {
    if (!url || !url.includes('drive.google.com')) return null;
    const matchD = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD) return matchD[1];
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId) return matchId[1];
    return null;
}

function processVideoUrl(url: string): Omit<Video, 'title' | 'category'> {
    if (!url) return { provider: 'other', originalUrl: '' };

    const ytId = extractYouTubeId(url);
    if (ytId) {
        return {
            iframeSrc: `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`,
            thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
            originalUrl: url,
            provider: 'youtube',
        };
    }

    const driveId = extractDriveFileId(url);
    if (driveId) {
        return {
            iframeSrc: `https://drive.google.com/file/d/${driveId}/preview`,
            thumbnailUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`,
            originalUrl: url,
            provider: 'drive',
        };
    }

    if (url.includes('dropbox.com')) {
        let directLink = url;
        if (directLink.includes('?')) {
            directLink = directLink.replace('dl=0', 'raw=1');
            if (!directLink.includes('raw=1')) directLink += '&raw=1';
        } else {
            directLink += '?raw=1';
        }
        return { videoSrc: directLink, originalUrl: url, provider: 'dropbox' };
    }

    return { videoSrc: url, originalUrl: url, provider: 'other' };
}

const defaultVideos: Video[] = [
    { title: 'Family Members AI', category: ['Family'], ...processVideoUrl('https://drive.google.com/file/d/1xMZ84MmEY7zK-GhOQtv9PryWGVer0mW6/view') },
    { title: 'Father and Grandmother', category: ['Father', 'Grandmother'], ...processVideoUrl('https://drive.google.com/file/d/1ya_-WB3euB5TBGxbz-K5Sx_4cPUoNvJp/view') },
    { title: 'Father AI Video', category: ['Father'], ...processVideoUrl('https://drive.google.com/file/d/1qTarPa9No0wadIKOAWOr4mrsO_wWSOy6/view') },
    { title: 'Grandfather AI Video', category: ['Grandfather'], ...processVideoUrl('https://drive.google.com/file/d/1LiYnIN7BmnT87L6adrwZsiXhpoYTylFN/view') },
    { title: 'Small Brother AI Video', category: ['Brother'], ...processVideoUrl('https://drive.google.com/file/d/1ys2wXRXz3KUKIDDKv7OxuVXv1P3o31ao/view') },
    { title: 'Trending Father AI', category: ['Father'], ...processVideoUrl('https://drive.google.com/file/d/1By-9HttTtxD1STdo8CEQFD_yZisYwgo4/view') },
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
            if (!SPREADSHEET_ID) { setLoading(false); return; }
            try {
                const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&t=${Date.now()}`;
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) throw new Error('Failed to fetch spreadsheet');
                const csvText = await response.text();
                const allRows = csvText.split('\n').map(row => row.split(','));
                const headerIndex = allRows.findIndex(row => row.some(cell => cell.trim().toLowerCase().includes('title')));
                if (headerIndex === -1) { setLoading(false); return; }
                const headers = allRows[headerIndex].map(h => h.trim().toLowerCase());
                const dataRows = allRows.slice(headerIndex + 1);
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
                        const processed = processVideoUrl(rawSrc);
                        const category = rawCategory.split(/[|]/).map(c => c.trim()).filter(c => c !== '');
                        return { title, category, ...processed };
                    })
                    .filter(v => v.iframeSrc || v.videoSrc);
                if (jsonData.length > 0) setVideos(jsonData);
            } catch (error) {
                console.error("Failed to fetch Google Sheet data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSheetData();
    }, []);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const desiredOrder = ['All', 'Latest', 'Father', 'Mother', 'Grandfather', 'Grandmother', 'Brother', 'Sister'];
    const categories = Array.from(new Set(['All', ...videos.flatMap(v => v.category)]))
        .sort((a, b) => {
            const iA = desiredOrder.indexOf(a), iB = desiredOrder.indexOf(b);
            if (iA === -1 && iB === -1) return a.localeCompare(b);
            if (iA === -1) return 1;
            if (iB === -1) return -1;
            return iA - iB;
        });

    const filteredVideos = filter === 'All' ? videos : videos.filter(v => Array.isArray(v.category) ? v.category.includes(filter) : v.category === filter);

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
        return () => { el.removeEventListener('scroll', updateScrollIndicators); window.removeEventListener('resize', updateScrollIndicators); };
    }, [updateScrollIndicators]);

    return (
        <section id="portfolio" ref={sectionRef} className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
            <motion.div className="absolute right-0 top-1/2 w-96 h-96 rounded-full -z-10" style={{ y, background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" as const }} viewport={{ once: true }} className="text-center mb-10 md:mb-16">
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-transparent via-[#c4a052] to-transparent mx-auto mb-4 md:mb-6" />
                    <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-5" style={{ background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 50%, #c4a052 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                        Video Portfolio
                    </motion.h2>
                    <p className="text-[#808080] text-sm md:text-lg max-w-2xl mx-auto px-2">
                        {loading && SPREADSHEET_ID ? 'Syncing with dashboard...' : 'AI-powered video productions that create emotional connections'}
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="relative mb-4 md:mb-6">
                    <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 md:hidden ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #0a0a0a 0%, transparent 100%)' }} />
                    <div className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 md:hidden ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to left, #0a0a0a 0%, transparent 100%)' }} />
                    <div ref={scrollContainerRef} className="flex md:justify-center gap-2.5 md:gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide px-1 md:px-0 snap-x snap-mandatory md:snap-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                        {categories.map((cat, i) => (
                            <motion.button key={cat} onClick={() => setFilter(cat)} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.08 }} viewport={{ once: true }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className={`relative flex-shrink-0 snap-start px-5 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${filter === cat ? 'text-[#0a0a0a]' : 'text-[#a0a0a0] hover:text-white'}`}
                                style={{ background: filter === cat ? 'linear-gradient(135deg, #c4a052 0%, #d4b87a 100%)' : 'rgba(255, 255, 255, 0.03)', border: filter === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)' }}>
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredVideos.map((video, index) => (
                            <VideoCard key={video.iframeSrc || video.videoSrc || index} video={video} index={index} onClick={() => setSelectedVideo(video)} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredVideos.length === 0 && !loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                        <p className="text-[#666] text-lg">No videos in this category yet</p>
                        <button onClick={() => setFilter('All')} className="mt-4 text-[#c4a052] underline underline-offset-4 text-sm">View all videos</button>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
            </AnimatePresence>
        </section>
    );
}

function VideoCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current) videoRef.current.play().catch(() => { });
    };
    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) videoRef.current.pause();
    };

    // We only use the native video element for previews if it's a direct streamable source (Dropbox/other)
    // and only when hovered to save bandwidth.
    const canShowPreview = video.provider === 'dropbox' || video.provider === 'other';

    return (
        <motion.div layout initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, delay: index * 0.08, layout: { duration: 0.3 } }}
            onMouseEnter={canShowPreview ? handleMouseEnter : () => setIsHovered(true)} 
            onMouseLeave={canShowPreview ? handleMouseLeave : () => setIsHovered(false)}
            onClick={onClick} className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer bg-[#0f0f0f]"
            style={{ border: '1px solid rgba(255, 255, 255, 0.05)' }} whileHover={{ y: -5 }}>

            {/* Always show thumbnail/background first for instant load */}
            {video.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={video.thumbnailUrl} alt={video.title} 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsLoaded(true)} onError={() => setIsLoaded(true)} />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
            )}

            {/* Video preview on hover for streamable sources */}
            {canShowPreview && video.videoSrc && isHovered && (
                <video ref={videoRef} src={video.videoSrc} muted loop playsInline preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover z-10" />
            )}

            {/* Transparent click overlay */}
            <div className="absolute inset-0 z-40 cursor-pointer" />

            <div className="absolute inset-0 pointer-events-none z-20" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(10, 10, 10, 0.85) 100%)' }} />

            {/* Play button overlay */}
            <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                initial={{ opacity: 0.7 }} animate={{ opacity: isHovered ? 1 : 0.7, scale: isHovered ? 1 : 0.8 }} transition={{ duration: 0.3 }}>
                <motion.div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(196, 160, 82, 0.95) 0%, rgba(212, 184, 122, 0.95) 100%)', boxShadow: '0 0 30px rgba(196, 160, 82, 0.5)' }}>
                    <svg className="w-6 h-6 text-[#0a0a0a] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </motion.div>
            </motion.div>

            <motion.div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 z-50 pointer-events-none">
                <div className="text-xs md:text-sm text-[#c4a052] mb-0.5 md:mb-1 font-medium">
                    {Array.isArray(video.category) ? video.category.join(' & ') : video.category}
                </div>
                <div className="text-white font-semibold text-sm md:text-base">{video.title}</div>
            </motion.div>
        </motion.div>
    );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
    useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);

    const useIframe = video.provider === 'drive' || video.provider === 'youtube';
    const modalSrc = video.provider === 'youtube' ? `${video.iframeSrc}&autoplay=1` : video.iframeSrc;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 md:p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
            
            <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl aspect-video rounded-xl md:rounded-2xl overflow-hidden mb-4"
                style={{ boxShadow: '0 0 80px rgba(196, 160, 82, 0.25)', border: '1px solid rgba(196, 160, 82, 0.2)' }}>

                {useIframe && modalSrc ? (
                    <iframe src={modalSrc} allow="autoplay; encrypted-media; fullscreen" className="w-full h-full border-0 bg-black" allowFullScreen></iframe>
                ) : video.videoSrc ? (
                    <video controls autoPlay playsInline className="w-full h-full object-contain bg-black" src={video.videoSrc}>Your browser does not support the video tag.</video>
                ) : null}

                <motion.button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white z-10"
                    style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </motion.button>
            </motion.div>

            {/* Fallback link for enterprise reliability */}
            <motion.a href={video.originalUrl} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-[#c4a052] text-sm md:text-base hover:underline underline-offset-4 flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-[#c4a052]/20 hover:bg-white/10 transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Trouble playing? View on original platform
            </motion.a>
        </motion.div>
    );
}
