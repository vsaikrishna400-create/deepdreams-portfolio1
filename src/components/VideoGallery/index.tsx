'use client';

import React, { useState, useEffect, useRef } from 'react';
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

// Initial fallback data to guarantee the gallery is never blank
const INITIAL_VIDEOS: Video[] = [
    { title: "3 Family members Ai video (51)", originalUrl: "3 family members Ai video (51).mp4", category: ["Family"], videoSrc: "/videos/3%20family%20members%20Ai%20video%20(51).mp4", provider: 'other' },
    { title: "Father and grandmother", originalUrl: "Father and grandmother Ai video 1080p.mp4", category: ["Latest", "Father", "Grandmother"], videoSrc: "/videos/Father%20and%20grandmother%20Ai%20video%201080p.mp4", provider: 'other' },
    { title: "Father Ai video", originalUrl: "Father Ai video_1.mp4", category: ["Father"], videoSrc: "/videos/Father%20Ai%20video_1.mp4", provider: 'other' },
    { title: "Trending Father Ai video", originalUrl: "Father Temple Ai video.mp4", category: ["Father", "Latest"], videoSrc: "/videos/Father%20Temple%20Ai%20video.mp4", provider: 'other' },
    { title: "Grandfather Ai video", originalUrl: "Grandfather AI video nspt.mp4", category: ["Grandfather"], videoSrc: "/videos/Grandfather%20AI%20video%20nspt.mp4", provider: 'other' },
    { title: "Mother Ai video birthday", originalUrl: "Amamma Ai video Mobile.mp4", category: ["Mother"], videoSrc: "/videos/Amamma%20Ai%20video%20Mobile.mp4", provider: 'other' },
    { title: "Saree function father's Ai video", originalUrl: "Saree function Ai video.mp4", category: ["Father", "Latest"], videoSrc: "/videos/Saree%20function%20Ai%20video.mp4", provider: 'other' },
    { title: "Brother Ai video", originalUrl: "Small brother Ai video.mp4", category: ["Brother"], videoSrc: "/videos/Small%20brother%20Ai%20video.mp4", provider: 'other' },
    { title: "Mother AI video", originalUrl: "Mother AI video.mp4", category: ["Mother"], videoSrc: "/videos/Mother%20AI%20video.mp4", provider: 'other' },
    { title: "3 father's", originalUrl: "Jalsa Studio 3fathers Ai video.mp4", category: ["Family"], videoSrc: "/videos/Jalsa%20Studio%203fathers%20Ai%20video.mp4", provider: 'other' },
    { title: "Father Ai video", originalUrl: "lv_0_20260418222126.mp4", category: ["Father"], videoSrc: "/videos/lv_0_20260418222126.mp4", provider: 'other' },
    { title: "House ceremony Father and mother", originalUrl: "father and mother Ai video 1080p.mp4", category: ["Family", "Latest"], videoSrc: "/videos/father%20and%20mother%20Ai%20video%201080p.mp4", provider: 'other' },
    { title: "Sister Ai video", originalUrl: "Sister Ai video.mp4", category: ["Sister"], videoSrc: "/videos/Sister%20Ai%20video.mp4", provider: 'other' },
    { title: "Brother Ai video", originalUrl: "Brother Ai video.mp4", category: ["Brother"], videoSrc: "/videos/Brother%20Ai%20video.mp4", provider: 'other' },
    { title: "4 Family members Ai video (52)", originalUrl: "4 family members Ai video (50).mp4", category: ["Family"], videoSrc: "/videos/4%20family%20members%20Ai%20video%20(50).mp4", provider: 'other' },
    { title: "Father Ai video", originalUrl: "VID-20260224-WA0008.mp4", category: ["Father"], videoSrc: "/videos/VID-20260224-WA0008.mp4", provider: 'other' }
];

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

    if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.webm') || url.toLowerCase().endsWith('.mov')) {
        const isLocal = !url.startsWith('http');
        let videoSrc = url;
        if (isLocal) {
            videoSrc = encodeURI(url.startsWith('/') ? url : `/videos/${url}`);
        }
        return { 
            videoSrc: videoSrc, 
            originalUrl: url, 
            provider: 'other' 
        };
    }

    return { videoSrc: url, originalUrl: url, provider: 'other' };
}

export default function VideoGallery() {
    const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
    const [filter, setFilter] = useState('All');
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        async function fetchSheetData() {
            if (!SPREADSHEET_ID) {
                setLoading(false);
                return;
            }

            try {
                const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) throw new Error('Failed to fetch spreadsheet');
                
                const csvText = await response.text();
                const rows = csvText.split(/\r?\n/);
                const allRows = rows.map(row => row.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, '')));

                const headerIndex = allRows.findIndex(row => row.some(cell => cell.toLowerCase().includes('title')));
                if (headerIndex === -1) {
                    setLoading(false);
                    return;
                }

                const headers = allRows[headerIndex].map(h => h.toLowerCase());
                const dataRows = allRows.slice(headerIndex + 1);
                
                const getColIndex = (name: string) => headers.findIndex(h => h.includes(name));
                const titleIdx = getColIndex('title');
                const srcIdx = getColIndex('src');
                const catIdx = getColIndex('category');

                const jsonData: Video[] = dataRows
                    .filter(row => row.length > 1 && row[srcIdx])
                    .map(row => {
                        const title = row[titleIdx] || 'Untitled AI Video';
                        const src = row[srcIdx] || '';
                        const rawCategory = row[catIdx] || 'General';
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

                {/* Filter Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {categories.map((cat) => (
                            <button key={cat} onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    filter === cat ? 'bg-[#c4a052] text-[#0a0a0a] shadow-[0_0_20px_rgba(196,160,82,0.3)]' : 'bg-white/5 text-[#808080] hover:bg-white/10 hover:text-white'
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
                            <motion.div key={video.originalUrl + index} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }} onClick={() => setSelectedVideo(video)}
                                className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/5 shadow-2xl">
                                
                                {/* Visual Content - Flattened to avoid component failure */}
                                <div className="absolute inset-0 w-full h-full bg-black">
                                    {video.videoSrc ? (
                                        <video 
                                            src={`${video.videoSrc}#t=0.5`} 
                                            poster={video.thumbnailUrl || video.videoSrc}
                                            className="w-full h-full object-cover"
                                            muted playsInline preload="metadata"
                                        />
                                    ) : video.thumbnailUrl ? (
                                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                                    )}
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 bg-black/40">
                                    <div className="w-16 h-16 rounded-full bg-[#c4a052] flex items-center justify-center shadow-[0_0_30px_rgba(196,160,82,0.5)]">
                                        <svg className="w-8 h-8 text-[#0a0a0a] fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-20" />

                                <div className="absolute bottom-0 left-0 p-6 w-full z-30">
                                    <div className="text-[10px] uppercase tracking-widest text-[#c4a052] font-bold mb-1">
                                        {video.category.join(' & ')}
                                    </div>
                                    <h3 className="text-lg font-bold text-white line-clamp-1">{video.title}</h3>
                                </div>
                            </motion.div>
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

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
    const isIframe = !!video.iframeSrc;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-[#0a0a0a] border border-white/10">
                <button onClick={onClose} className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-[#c4a052] hover:text-[#0a0a0a] transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {isIframe ? (
                    <iframe src={video.iframeSrc} className="w-full h-full border-0" allow="autoplay; encrypted-media; fullscreen" allowFullScreen />
                ) : (
                    <video src={video.videoSrc} poster={video.videoSrc} controls autoPlay preload="auto" className="w-full h-full object-contain bg-black" />
                )}
            </motion.div>
        </motion.div>
    );
}
