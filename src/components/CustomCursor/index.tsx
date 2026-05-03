'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    
    // Mouse position with high-performance spring physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Ultra-smooth configuration for enterprise feel
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [mouseX, mouseY, isVisible]);

    if (typeof window === 'undefined') return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%',
                opacity: isVisible ? 1 : 0,
            }}
        >
            {/* Large Subtle Ambient Glow - Low Intensity, High Radius */}
            <div 
                className="w-[400px] h-[400px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(196, 160, 82, 0.15) 0%, rgba(196, 160, 82, 0.05) 40%, transparent 70%)',
                    willChange: 'transform',
                }}
            />
            {/* Fine Core Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20 blur-[2px]" style={{ willChange: 'transform' }} />
        </motion.div>
    );
}
