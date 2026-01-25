'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
            {/* Logo Icon with continuous float */}
            <div className="mb-6">
                <motion.img
                    src="/images/logo-clean.png"
                    alt="DeepDreams"
                    className="w-28 md:w-36 lg:w-40 h-auto"
                    animate={{
                        y: [0, -10, 0],
                        filter: [
                            'drop-shadow(0 0 15px rgba(196,160,82,0.2))',
                            'drop-shadow(0 0 30px rgba(196,160,82,0.4))',
                            'drop-shadow(0 0 15px rgba(196,160,82,0.2))'
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* TITLE - DeepDreams with CONTINUOUS shimmer animation */}
            <div className="text-center mb-3 px-4 py-2">
                <motion.h1
                    className="text-5xl md:text-6xl lg:text-8xl font-bold"
                    style={{
                        fontFamily: 'var(--font-italiana), serif',
                        background: 'linear-gradient(90deg, #e8d5a3 0%, #c4a052 20%, #ffd700 40%, #ffffff 50%, #ffd700 60%, #c4a052 80%, #e8d5a3 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '0.05em',
                        lineHeight: '1.4',
                        padding: '12px 0', // Generous padding to prevent clipping
                    }}
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    DeepDreams
                </motion.h1>
            </div>

            {/* AI Studio with continuous glow pulse */}
            <div className="text-center mb-6">
                <motion.h2
                    className="text-lg md:text-xl lg:text-2xl font-light tracking-[0.4em] uppercase"
                    style={{ color: '#00d4ff' }}
                    animate={{
                        textShadow: [
                            '0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
                            '0 0 25px rgba(0, 212, 255, 0.6), 0 0 50px rgba(0, 212, 255, 0.3)',
                            '0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)',
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                    AI Studio
                </motion.h2>
            </div>

            {/* Decorative line with continuous shimmer */}
            <div className="w-24 h-px mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(90deg, transparent, #c4a052, transparent)' }}>
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                        width: '50%'
                    }}
                    animate={{ x: ['-50%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Tagline with subtle pulse */}
            <motion.p
                className="text-base md:text-lg text-[#888] max-w-md mx-auto text-center mb-10"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                Transforming Dreams into Digital Reality
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                    href="#portfolio"
                    className="px-8 py-3.5 rounded-full text-center font-medium text-[#0a0a0a]"
                    style={{ background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 100%)' }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(196, 160, 82, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    View Portfolio
                </motion.a>
                <motion.a
                    href="#contact"
                    className="px-8 py-3.5 rounded-full text-center font-medium text-[#c4a052] border-2 border-[#c4a052]"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(196, 160, 82, 0.15)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get in Touch
                </motion.a>
            </div>

            {/* Scroll Indicator with continuous animation */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <motion.div
                    className="flex flex-col items-center gap-2"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.span
                        className="text-xs text-[#555] uppercase tracking-widest"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Scroll
                    </motion.span>
                    <div className="w-5 h-8 rounded-full border border-[#c4a052]/40 flex items-start justify-center p-1.5">
                        <motion.div
                            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-[#c4a052]"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
