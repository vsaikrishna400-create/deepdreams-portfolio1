'use client';

import { useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function GlassmorphismBackground() {
    const containerRef = useRef<HTMLDivElement>(null);


    // Mouse position with spring physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ultra-smooth zero-lag configuration
    const springConfig = { damping: 25, stiffness: 200, mass: 0.1 }; // Low mass for instant reaction
    const orbX = useSpring(mouseX, springConfig);
    const orbY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            // Initialize orb at center
            if (mouseX.get() === 0 && mouseY.get() === 0) {
                mouseX.set(window.innerWidth / 2);
                mouseY.set(window.innerHeight / 2);
            }
        };

        updateWindowSize();
        window.addEventListener('resize', updateWindowSize);

        return () => window.removeEventListener('resize', updateWindowSize);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Background base */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />

            {/* Subtle ambient gradient */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'radial-gradient(ellipse at 20% 30%, rgba(196, 160, 82, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(0, 212, 255, 0.03) 0%, transparent 50%)'
                }}
            />

            {/* Starfield / Dust Effect - Glowing & Enchanted */}
            <div className="absolute inset-0 pointer-events-none">
                {/* White/Cruising Dust */}
                <div className="absolute top-0 left-0 w-full h-full animate-[spin_120s_linear_infinite]"
                    style={{
                        backgroundImage: 'radial-gradient(1.5px 1.5px at 20px 30px, rgba(255,255,255,0.8), rgba(0,0,0,0)), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.9), rgba(0,0,0,0)), radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,1), rgba(0,0,0,0)), radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.7), rgba(0,0,0,0))',
                        backgroundSize: '300px 300px',
                        opacity: 0.5,
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                    }}
                />

                {/* Gold/Sparkle Dust - Reverse Rotation */}
                <div className="absolute top-0 left-0 w-full h-full animate-[spin_180s_linear_infinite_reverse]"
                    style={{
                        backgroundImage: 'radial-gradient(2px 2px at 50px 160px, rgba(196, 160, 82, 0.8), rgba(0,0,0,0)), radial-gradient(2px 2px at 130px 80px, rgba(0, 212, 255, 0.6), rgba(0,0,0,0))',
                        backgroundSize: '400px 400px',
                        opacity: 0.6,
                        mixBlendMode: 'screen',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                    }}
                />
            </div>

            {/* Main Glowing Orb - LARGE & SOFT (Requested: Bigger radius, Lower intensity) */}
            <motion.div
                className="absolute pointer-events-none will-change-transform"
                style={{
                    x: orbX,
                    y: orbY,
                    width: 1000, // Increased from 800
                    height: 1000,
                    marginLeft: -500,
                    marginTop: -500,
                    transform: 'translateZ(0)',
                }}
            >
                {/* Outer diffuse glow - Lower opacity */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(196, 160, 82, 0.08) 0%, rgba(196, 160, 82, 0.04) 30%, rgba(0, 212, 255, 0.02) 50%, transparent 70%)',
                        filter: 'blur(50px)', // Slightly softer blur for size
                        willChange: 'transform',
                    }}
                />

                {/* Middle glow layer - Lower opacity */}
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '20%',
                        left: '20%',
                        width: '60%',
                        height: '60%',
                        background: 'radial-gradient(circle at center, rgba(255, 200, 100, 0.12) 0%, rgba(196, 160, 82, 0.08) 40%, transparent 70%)',
                        filter: 'blur(30px)',
                    }}
                />

                {/* Inner bright core - Lower opacity */}
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '35%',
                        left: '35%',
                        width: '30%',
                        height: '30%',
                        background: 'radial-gradient(circle at 45% 45%, rgba(255, 230, 150, 0.18) 0%, rgba(196, 160, 82, 0.08) 50%, transparent 80%)',
                        filter: 'blur(20px)',
                    }}
                />
            </motion.div>
        </div>
    );
}
