'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const videos = [
    {
        src: '/videos/Shiva-Perfect-Video.mp4',
        title: 'Try Beauty - Blessing Scene',
        category: 'Try Beauty'
    },
    {
        src: '/videos/Ajay-Mom-Ai-Video.mp4',
        title: 'Mother\'s Blessing Video',
        category: 'Try Beauty'
    },
    {
        src: '/videos/Sowmya-Ai-Video.mp4',
        title: 'Celebration Moment',
        category: 'Try Beauty'
    },
    {
        src: '/videos/Warangal-Temple-Video.mp4',
        title: 'Temple Experience',
        category: 'Ad Campaign'
    },
    {
        src: '/videos/Anwer-1st-Ai-Video.mp4',
        title: 'Brand Story - Part 1',
        category: 'Ad Campaign'
    },
    {
        src: '/videos/Anwer-Last-Ai-Video.mp4',
        title: 'Brand Story - Finale',
        category: 'Ad Campaign'
    },
];

export default function VideoGallery() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

    const categories = ['All', 'Try Beauty', 'Ad Campaign'];

    const filteredVideos = filter === 'All'
        ? videos
        : videos.filter(v => v.category === filter);

    return (
        <section id="portfolio" ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
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
                {/* Section Header with reveal animation */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" as const }}
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
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-5"
                        style={{
                            background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 50%, #c4a052 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Video Portfolio
                    </motion.h2>
                    <p className="text-[#808080] text-lg max-w-2xl mx-auto">
                        AI-powered video productions that create emotional connections
                    </p>
                </motion.div>

                {/* Animated Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex justify-center gap-3 mb-14"
                >
                    {categories.map((cat, i) => (
                        <motion.button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors ${filter === cat
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
                </motion.div>

                {/* Video Grid with stagger animation */}
                <motion.div
                    layout
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
    video: typeof videos[0];
    index: number;
    onClick: () => void;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

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

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{
                duration: 0.5,
                delay: index * 0.1,
                layout: { duration: 0.3 }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group"
            style={{
                background: 'rgba(15, 15, 15, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            whileHover={{ y: -5 }}
        >
            {/* Video Thumbnail */}
            <video
                ref={videoRef}
                src={video.src}
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
            />

            {/* Animated Gradient Overlay */}
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.2) 0%, rgba(10, 10, 10, 0.9) 100%)',
                }}
            />

            {/* Play Button with scale animation */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.5
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(196, 160, 82, 0.95) 0%, rgba(212, 184, 122, 0.95) 100%)',
                        boxShadow: '0 0 30px rgba(196, 160, 82, 0.5)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className="w-7 h-7 text-[#0a0a0a] ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* Title Bar with slide-up animation */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 p-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{
                    y: isHovered ? 0 : 20,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className="text-sm text-[#c4a052] mb-1 font-medium"
                >
                    {video.category}
                </motion.div>
                <motion.div className="text-white font-semibold">
                    {video.title}
                </motion.div>
            </motion.div>

            {/* Corner accent */}
            <motion.div
                className="absolute top-0 right-0 w-16 h-16 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
            >
                <div
                    className="absolute -top-8 -right-8 w-16 h-16 rotate-45"
                    style={{ background: 'linear-gradient(135deg, #c4a052 0%, transparent 60%)' }}
                />
            </motion.div>
        </motion.div>
    );
}

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
        >
            <motion.div
                initial={{ scale: 0.7, opacity: 0, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.7, opacity: 0, rotateX: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden"
                style={{
                    boxShadow: '0 0 80px rgba(196, 160, 82, 0.25)',
                    border: '1px solid rgba(196, 160, 82, 0.2)',
                }}
            >
                <video
                    src={src}
                    controls
                    autoPlay
                    className="w-full h-full object-contain bg-black"
                />

                {/* Close Button */}
                <motion.button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{
                        background: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(10px)',
                    }}
                    whileHover={{ scale: 1.1, background: 'rgba(196, 160, 82, 0.8)' }}
                    whileTap={{ scale: 0.9 }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
