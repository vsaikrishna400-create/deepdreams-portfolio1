'use client';

import { motion, Variants, useMotionValue, useTransform } from 'framer-motion';
import { useState, MouseEvent } from 'react';

// Professional, abstract service representations with SVG icons
const services = [
    {
        id: 'chatbots',
        title: 'AI Chatbots',
        description: 'Intelligent conversational AI that engages customers 24/7 with natural, human-like interactions and deep emotional intelligence.',
        color: '#00d4ff',
        gradient: 'from-cyan-500/20 to-blue-600/20',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0066ff" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <rect x="10" y="15" width="45" height="35" rx="8" fill="url(#chatGrad)" stroke="#00d4ff" strokeWidth="1.5" />
                <rect x="25" y="35" width="45" height="30" rx="8" fill="#0a0a0a" stroke="#00d4ff" strokeWidth="1.5" />
                <circle cx="35" cy="50" r="3" fill="#00d4ff" opacity="0.8" />
                <circle cx="47" cy="50" r="3" fill="#00d4ff" opacity="0.6" />
                <circle cx="59" cy="50" r="3" fill="#00d4ff" opacity="0.4" />
                <path d="M20 28 L45 28" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M20 35 L38 35" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
        ),
    },
    {
        id: 'agents',
        title: 'Intelligent Agents',
        description: 'Sophisticated AI agents that automate complex workflows, make intelligent decisions, and continuously learn from every interaction.',
        color: '#c4a052',
        gradient: 'from-amber-500/20 to-yellow-600/20',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c4a052" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#d4b87a" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="25" fill="none" stroke="url(#agentGrad)" strokeWidth="2" />
                <circle cx="40" cy="40" r="15" fill="none" stroke="#c4a052" strokeWidth="1.5" opacity="0.6" />
                <circle cx="40" cy="40" r="5" fill="#c4a052" />
                <path d="M40 10 L40 20" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" />
                <path d="M40 60 L40 70" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 40 L20 40" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" />
                <path d="M60 40 L70 40" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 18 L25 25" stroke="#c4a052" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M55 55 L62 62" stroke="#c4a052" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M62 18 L55 25" stroke="#c4a052" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                <path d="M25 55 L18 62" stroke="#c4a052" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
        ),
    },
    {
        id: 'applications',
        title: 'Applications',
        description: 'Beautiful, high-performance mobile and desktop applications with intuitive interfaces that deliver exceptional user experiences.',
        color: '#00d4ff',
        gradient: 'from-cyan-500/20 to-teal-600/20',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="appGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00ffd4" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <rect x="22" y="8" width="36" height="64" rx="6" fill="none" stroke="url(#appGrad)" strokeWidth="2" />
                <rect x="28" y="18" width="24" height="36" rx="2" fill="url(#appGrad)" opacity="0.3" />
                <circle cx="40" cy="64" r="4" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
                <rect x="32" y="24" width="16" height="3" rx="1" fill="#00d4ff" opacity="0.8" />
                <rect x="32" y="30" width="12" height="2" rx="1" fill="#00d4ff" opacity="0.5" />
                <rect x="32" y="36" width="8" height="8" rx="2" fill="#00d4ff" opacity="0.6" />
                <rect x="43" y="36" width="8" height="8" rx="2" fill="#00d4ff" opacity="0.4" />
            </svg>
        ),
    },
    {
        id: 'web',
        title: 'Web Development',
        description: 'Stunning, responsive websites built with cutting-edge frameworks and world-class design aesthetics that set you apart.',
        color: '#c4a052',
        gradient: 'from-amber-500/20 to-orange-600/20',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="webGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c4a052" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ffd700" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <rect x="8" y="12" width="64" height="48" rx="4" fill="none" stroke="url(#webGrad)" strokeWidth="2" />
                <path d="M8 24 L72 24" stroke="#c4a052" strokeWidth="1" opacity="0.5" />
                <circle cx="16" cy="18" r="2" fill="#c4a052" opacity="0.6" />
                <circle cx="23" cy="18" r="2" fill="#c4a052" opacity="0.6" />
                <circle cx="30" cy="18" r="2" fill="#c4a052" opacity="0.6" />
                <rect x="14" y="30" width="20" height="24" rx="2" fill="url(#webGrad)" opacity="0.3" />
                <rect x="38" y="30" width="28" height="10" rx="2" fill="#c4a052" opacity="0.4" />
                <rect x="38" y="44" width="28" height="3" rx="1" fill="#c4a052" opacity="0.3" />
                <rect x="38" y="50" width="20" height="3" rx="1" fill="#c4a052" opacity="0.2" />
                <path d="M40 68 L40 72 L32 72" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" />
                <path d="M40 68 L40 72 L48 72" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: 'video-generation',
        title: 'AI Video Generation',
        description: 'Specializing in emotional legacy videos where deceased loved ones attend special events, offer blessings, and return to heaven—bringing closure and eternal memories.',
        color: '#00d4ff',
        gradient: 'from-cyan-500/20 to-purple-600/20',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="vidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <rect x="10" y="15" width="60" height="50" rx="4" fill="none" stroke="url(#vidGrad)" strokeWidth="2" />
                <path d="M10 25 L70 25" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                <path d="M10 55 L70 55" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                <path d="M35 32 L50 40 L35 48 Z" fill="url(#vidGrad)" stroke="#00d4ff" strokeWidth="1" />
                <rect x="15" y="18" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="25" y="18" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="35" y="18" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="45" y="18" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="55" y="18" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="61" y="18" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="15" y="58" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="25" y="58" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="35" y="58" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="45" y="58" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="55" y="58" width="4" height="4" fill="#00d4ff" opacity="0.6" />
                <rect x="61" y="58" width="4" height="4" fill="#00d4ff" opacity="0.6" />
            </svg>
        ),
    },
    {
        id: 'ad-videos',
        title: 'AI Advertisement Videos',
        description: 'Compelling, conversion-driven commercial videos generated by AI to captivate audiences and elevate your brand narrative.',
        color: '#c4a052',
        gradient: 'from-amber-500/20 to-red-600/20',
        icon: (
            <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
                <defs>
                    <linearGradient id="adGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c4a052" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <circle cx="40" cy="40" r="30" fill="none" stroke="url(#adGrad)" strokeWidth="2" />
                <path d="M40 10 L40 70" stroke="#c4a052" strokeWidth="1" opacity="0.3" />
                <path d="M10 40 L70 40" stroke="#c4a052" strokeWidth="1" opacity="0.3" />
                <path d="M25 25 L40 40 L55 25" stroke="#c4a052" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <rect x="30" y="45" width="20" height="15" rx="2" fill="url(#adGrad)" opacity="0.4" />
                <path d="M30 45 L50 60" stroke="#c4a052" strokeWidth="1" opacity="0.5" />
                <path d="M50 45 L30 60" stroke="#c4a052" strokeWidth="1" opacity="0.5" />
                <circle cx="60" cy="20" r="6" fill="#c4a052" opacity="0.8" />
                <path d="M57 17 L63 23" stroke="#000" strokeWidth="1.5" />
                <path d="M63 17 L57 23" stroke="#000" strokeWidth="1.5" />
            </svg>
        ),
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" }
    },
};

export default function Services() {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    return (
        <section id="services" className="relative py-32 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold mb-5"
                        style={{
                            background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 50%, #c4a052 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Our Services
                    </motion.h2>
                    <p className="text-[#808080] text-lg max-w-2xl mx-auto">
                        Cutting-edge solutions powered by artificial intelligence
                    </p>
                </motion.div>

                {/* Services Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 gap-6"
                >
                    {services.map((service) => (
                        <TiltCard key={service.id} service={service} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function TiltCard({ service }: { service: typeof services[0] }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [5, -5]);
    const rotateY = useTransform(x, [-100, 100], [-5, 5]);

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="relative rounded-2xl overflow-hidden group cursor-pointer h-full"
                style={{
                    background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Animated glow on hover */}
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), ${service.color}15, transparent 40%)`,
                        zIndex: 0,
                    }}
                />

                <div className="flex flex-col md:flex-row p-8 gap-6 relative z-10" style={{ transform: "translateZ(20px)" }}>
                    {/* Icon Container with Floating Effect */}
                    <div className="flex-shrink-0">
                        <motion.div
                            className="w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}05 100%)`,
                                border: `1px solid ${service.color}30`,
                                boxShadow: `0 0 20px ${service.color}10`,
                            }}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {service.icon}
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3
                            className="text-2xl font-bold mb-3 transition-colors duration-300"
                            style={{ color: service.color }}
                        >
                            {service.title}
                        </h3>
                        <p className="text-[#a0a0a0] leading-relaxed text-base">
                            {service.description}
                        </p>

                        {/* Learn More Link with arrow animation */}
                        <div
                            className="mt-6 flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                            style={{ color: service.color }}
                        >
                            <span>Explore Solution</span>
                            <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Top accent line */}
                <div
                    className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-700 ease-out"
                    style={{ backgroundColor: service.color }}
                />
            </motion.div>
        </motion.div>
    );
}
