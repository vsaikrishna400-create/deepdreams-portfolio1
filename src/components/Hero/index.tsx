'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Text3D from '@/components/Text3D';

export default function Hero() {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.replace('#', '');
        const elem = document.getElementById(targetId);
        if (elem) {
            window.scrollTo({
                top: elem.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 md:px-6 py-16 md:py-20 overflow-hidden">
            {/* Logo Icon - Masked Slide Reveal */}
            <div className="mb-6 md:mb-10 relative z-10 flex justify-center items-center overflow-hidden">
                <motion.div
                    className="relative w-48 sm:w-64 md:w-80 lg:w-[30rem] aspect-square"
                    style={{
                        filter: 'drop-shadow(0 0 30px rgba(196,160,82,0.2))',
                        willChange: 'transform, opacity',
                    }}
                    initial={{ y: '20%', opacity: 0 }}
                    animate={{
                        y: 0,
                        opacity: 1,
                    }}
                    transition={{
                        duration: 1.2,
                        delay: 0,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                >
                    <motion.div
                        animate={{
                            y: [-8, 8, -8],
                            rotate: [-0.3, 0.3, -0.3],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-full h-full relative"
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
                </motion.div>
            </div>

            {/* TITLE - Masked Reveal (Enterprise Standard) */}
            <div className="text-center mb-4 md:mb-6 px-2 md:px-4 relative z-10 overflow-hidden">
                <div
                    className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold relative z-10 tracking-[0.15em] md:tracking-[0.2em] flex flex-wrap justify-center items-center"
                    style={{
                        fontFamily: 'var(--font-italiana), serif',
                        lineHeight: '1.1',
                    }}
                >
                    <Text3D 
                        text="DEEP" 
                        color="white" 
                        className="drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                        delay={0.2} 
                    />
                    <Text3D 
                        text="DREAMS" 
                        color="#c4a052" 
                        className="drop-shadow-[0_0_15px_rgba(196,160,82,0.4)]" 
                        delay={0.4} 
                    />
                </div>
            </div>

            {/* AI Studio - Elegant Fade In */}
            <div className="text-center mb-6 md:mb-8 overflow-hidden">
                <motion.h2
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-[0.5em] md:tracking-[0.7em] uppercase"
                    style={{ 
                        color: '#00d4ff',
                        fontFamily: 'var(--font-inter), sans-serif'
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 1,
                        delay: 0.4,
                        ease: "easeOut"
                    }}
                >
                    AI Studio
                </motion.h2>
            </div>

            {/* Decorative line with continuous shimmer */}
            <motion.div
                className="w-24 md:w-32 h-[1px] mb-8 md:mb-10 relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(196,160,82,0.5), transparent)' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.6 }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                        width: '30%'
                    }}
                    animate={{ x: ['-100%', '400%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
                className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full sm:w-auto px-6 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
            >
                <motion.a
                    href="#portfolio"
                    onClick={(e) => scrollToSection(e, '#portfolio')}
                    className="group relative px-10 py-4 rounded-full text-center font-bold text-[#0a0a0a] text-sm md:text-base overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #c4a052 0%, #d4b87a 100%)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="relative z-10 uppercase tracking-widest">Explore Portfolio</span>
                    <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.a>
                <motion.a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, '#contact')}
                    className="px-10 py-4 rounded-full text-center font-bold text-[#c4a052] border-2 border-[#c4a052]/50 text-sm md:text-base backdrop-blur-sm"
                    whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: 'rgba(196, 160, 82, 0.1)',
                        borderColor: '#c4a052'
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="uppercase tracking-widest">Get Started</span>
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
