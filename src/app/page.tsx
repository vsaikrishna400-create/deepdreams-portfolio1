'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphismBackground from '@/components/GlassmorphismBackground';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import VideoGallery from '@/components/VideoGallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

export default function Home() {
    const [isLoaded, setIsLoaded] = useState(false);

    // Force scroll to top on mount and after loading
    useEffect(() => {
        const scrollToTop = () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Aggressive scroll reset for mobile browsers
        scrollToTop();
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        // Multiple attempts to fight mobile browser auto-scroll
        const timer = setTimeout(scrollToTop, 100);
        const raf = requestAnimationFrame(scrollToTop);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        if (isLoaded) {
            const forceTop = () => {
                window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
                document.documentElement.scrollTop = 0;
            };
            forceTop();
            // Final check for mobile hydration jumps
            setTimeout(forceTop, 50);
        }
    }, [isLoaded]);

    return (
        <main className="relative min-h-screen bg-[#050505]">
            {/* Enterprise Plus Launch Animation */}
            <AnimatePresence mode="wait">
                {!isLoaded && (
                    <Preloader onComplete={() => setIsLoaded(true)} />
                )}
            </AnimatePresence>

            {/* Background Effect */}
            <GlassmorphismBackground />

            {/* Orchestrated Content Reveal - GPU Accelerated via Framer Motion */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`relative z-10 ${isLoaded ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <Navigation />
                <Hero />
                <About />
                <Services />
                <VideoGallery />
                <Contact />
                <Footer />
            </motion.div>
        </main>
    );
}
