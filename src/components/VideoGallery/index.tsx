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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SPREADSHEET_ID = (process as any).env.NEXT_PUBLIC_SPREADSHEET_ID || '';

function extractYouTubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function extractDriveFileId(url: string): string | null {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
}

function processVideoUrl(url: string): Omit<Video, 'title' | 'category'> {
    if (!url) return { provider: 'other', originalUrl: '' };

    const ytId = extractYouTubeId(url);
    if (ytId) {
        // Switched to youtube-nocookie.com for better compatibility and to bypass some restrictions
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return {
            iframeSrc: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1&autoplay=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`,
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

    // Handle Local Videos (e.g., if the user puts "father.mp4" in the sheet)
    if (!url.startsWith('http') && (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'))) {
        const localPath = url.startsWith('/') ? url : `/videos/${url}`;
        return { videoSrc: localPath, originalUrl: localPath, provider: 'other' };
    }

    return { videoSrc: url, originalUrl: url, provider: 'other' };
}

export default function VideoGallery() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [filter, setFilter] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

                const jsonData: Video[] = dataRows
                    .filter(row => row.length > 1 && row[srcIdx] && row[srcIdx].trim() !== '')
                    .map(row => {
                        const title = (row[titleIdx] || '').trim().replace(/^["']|["']$/g, '') || 'Untitled AI Video';
                        const src = (row[srcIdx] || '').trim().replace(/^["']|["']$/g, '') || '';
                        const rawCategory = (row[catIdx] || '').trim().replace(/^["']|["']$/g, '') || 'General';
                        
                        const processed = processVideoUrl(src);
                        const category = rawCategory.split(/[|]/).map(c => c.trim()).filter(c => c !== '');

                        return { title, category, ...processed };
                    });

                if (jsonData.length > 0) setVideos(jsonData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch Google Sheet data:", error);
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

    return (
        <section id="portfolio" ref={sectionRef} className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
            <motion.div className="absolute right-0 top-1/2 w-96 h-96 rounded-full -z-10"
                style={{ y, background: 'radial-gradient(circle, rgba(196, 160, 82, 0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

            <div className="max-w-6xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
                        className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#c4a052] to-transparent mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
                        Our <span className="text-[#c4a052]">Portfolio</span>
                    </h2>
                    <p className="text-[#808080] text-lg max-w-2xl mx-auto">
                        {loading ? 'Initializing gallery...' : 'Professional AI video production for family and business'}
                    </p>
                </motion.div>

                {/* Filter Tabs - Optimized Slider */}
                <div className="relative mb-12 overflow-hidden">
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 px-4 md:px-0 md:justify-center -mx-4 md:mx-0 no-scrollbar snap-x snap-proximity">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => setFilter(cat)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all snap-start ${
                                    filter === cat ? 'bg-[#c4a052] text-[#0a0a0a]' : 'bg-white/5 text-[#a0a0a0] border border-white/10'
                                }`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredVideos.map((video, index) => (
                            <VideoCard key={video.originalUrl + index} video={video} index={index} onClick={() => setSelectedVideo(video)} />
                        ))}
                    </AnimatePresence>
                </div>

                {filteredVideos.length === 0 && !loading && (
                    <div className="text-center py-20 text-[#666]">No videos found for this category.</div>
                )}
            </div>

            <AnimatePresence>
                {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
            </AnimatePresence>
        </section>
    );
}

function VideoCard({ video, index, onClick }: { video: Video; index: number; onClick: () => void }) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.1 }} onClick={onClick}
            className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5 shadow-2xl">
            
            <div className="absolute inset-0 w-full h-full">
                {video.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={video.thumbnailUrl} alt={video.title} 
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)} onError={() => setIsLoaded(true)} />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
                )}
            </div>

            {/* Transparent click capture overlay */}
            <div className="absolute inset-0 z-40" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 z-20" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 transform group-hover:scale-110">
                <div className="w-16 h-16 rounded-full bg-[#c4a052] flex items-center justify-center shadow-[0_0_30px_rgba(196,160,82,0.5)]">
                    <svg className="w-8 h-8 text-[#0a0a0a] fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 p-6 w-full z-30">
                <div className="text-[10px] uppercase tracking-widest text-[#c4a052] font-bold mb-1">
                    {video.category.join(' & ')}
                </div>
                <h3 className="text-lg font-bold text-white line-clamp-1">{video.title}</h3>
            </div>
        </motion.div>
    );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const isIframe = !!video.iframeSrc;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-6xl aspect-video rounded-3xl overflow-hidden bg-black shadow-[0_0_100px_rgba(196,160,82,0.15)] border border-white/10">
                
                {isIframe ? (
                    <iframe src={video.iframeSrc} className="w-full h-full border-0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
                ) : (
                    <video src={video.videoSrc} controls autoPlay className="w-full h-full object-contain" />
                )}
                
                <button onClick={onClose}
                    className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#c4a052] hover:text-[#0a0a0a] transition-all z-50">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </motion.div>
        </motion.div>
    );
}
