'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-16 md:py-20 overflow-hidden">
            {/* Logo Icon with continuous float - Clean Professional Look */}
            <div className="mb-6 md:mb-10 relative z-10 flex justify-center items-center">
                <motion.div
                    className="relative w-48 sm:w-64 md:w-80 lg:w-[30rem] aspect-square"
                    style={{
                        filter: 'drop-shadow(0 0 25px rgba(196,160,82,0.3))',
                        willChange: 'transform, filter',
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        rotate: [-0.5, 0.5, -0.5],
                        filter: [
                            'drop-shadow(0 0 20px rgba(196,160,82,0.2))',
                            'drop-shadow(0 0 45px rgba(196,160,82,0.5))',
                            'drop-shadow(0 0 20px rgba(196,160,82,0.2))'
                        ]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: [0.45, 0, 0.55, 1]
                    }}
                >
                    <Image
                        src="/images/logo-transparent-new.png"
                        alt="DeepDreams"
                        fill
                        sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 500px"
                        className="object-contain"
                        priority
                    />
                </motion.div>
            </div>

            {/* TITLE - DeepDreams with elegant gold styling */}
            <div className="text-center mb-4 md:mb-6 px-2 md:px-4 relative z-10">
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold relative z-10 tracking-wider"
                    style={{
                        fontFamily: 'var(--font-italiana), serif',
                        background: 'linear-gradient(to right, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        lineHeight: '1.2',
                        paddingBottom: '0.2em',
                        textShadow: '0 0 30px rgba(196, 160, 82, 0.2)',
                    }}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        filter: 'blur(0px)',
                        backgroundPosition: ['0% center', '200% center']
                    }}
                    transition={{
                        opacity: { duration: 1.2, ease: "easeOut" },
                        scale: { duration: 1.2, ease: "easeOut" },
                        filter: { duration: 1.2, ease: "easeOut" },
                        backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" }
                    }}
                >
                    DEEPDREAMS
                </motion.h1>
            </div>

            {/* AI Studio with continuous glow pulse */}
            <div className="text-center mb-4 md:mb-6">
                <motion.h2
                    className="text-base sm:text-lg md:text-xl lg:text-2xl font-light tracking-[0.3em] md:tracking-[0.4em] uppercase"
                    style={{ color: '#00d4ff' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        textShadow: [
                            '0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
                            '0 0 25px rgba(0, 212, 255, 0.6), 0 0 50px rgba(0, 212, 255, 0.3)',
                            '0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
                        ]
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.3 },
                        y: { duration: 0.8, delay: 0.3 },
                        textShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    AI Studio
                </motion.h2>
            </div>

            {/* Decorative line with continuous shimmer */}
            <motion.div
                className="w-16 md:w-24 h-px mb-4 md:mb-6 relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, transparent, #c4a052, transparent)' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                        width: '50%'
                    }}
                    animate={{ x: ['-50%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Tagline with subtle pulse */}
            <motion.p
                className="text-sm sm:text-base md:text-lg text-[#888] max-w-md mx-auto text-center mb-8 md:mb-10 px-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: [0.7, 1, 0.7], y: 0 }}
                transition={{
                    opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 0.8, delay: 0.6 }
                }}
            >
                Transforming Dreams into Digital Reality
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-6 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <motion.a
                    href="#portfolio"
                    className="px-8 py-3.5 rounded-full text-center font-medium text-[#0a0a0a] text-sm md:text-base"
                    style={{ background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 100%)' }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(196, 160, 82, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    View Portfolio
                </motion.a>
                <motion.a
                    href="#contact"
                    className="px-8 py-3.5 rounded-full text-center font-medium text-[#c4a052] border-2 border-[#c4a052] text-sm md:text-base"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(196, 160, 82, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get in Touch
                </motion.a>
            </motion.div>

            {/* Scroll Indicator — hidden on small mobile to save space */}
            <motion.div
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
            >
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.span
                        className="text-xs text-[#555] uppercase tracking-widest"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    >
                        Scroll
                    </motion.span>
                    <div className="w-5 h-8 rounded-full border border-[#c4a052]/40 flex items-start justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-[#c4a052]"
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
