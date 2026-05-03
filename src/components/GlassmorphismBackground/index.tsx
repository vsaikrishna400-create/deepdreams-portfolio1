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
            <div className="absolute inset-0 bg-[#050505]" />

            {/* Optimized Ambient Gradients (No Filters) */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    background: `
                        radial-gradient(circle at 20% 30%, rgba(196, 160, 82, 0.05) 0%, transparent 60%),
                        radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.03) 0%, transparent 60%)
                    `,
                    transform: 'translate3d(0,0,0)',
                }}
            />

            {/* Dynamic Interactive Orb - Optimized */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    x: orbX,
                    y: orbY,
                    width: 1200,
                    height: 1200,
                    marginLeft: -600,
                    marginTop: -600,
                    // Using layered radial gradients instead of CSS Blur filters for 60fps
                    background: 'radial-gradient(circle at center, rgba(196, 160, 82, 0.12) 0%, rgba(196, 160, 82, 0.06) 20%, rgba(0, 212, 255, 0.02) 40%, transparent 70%)',
                    transform: 'translate3d(0,0,0)',
                    willChange: 'transform',
                }}
            />
            
            {/* Grain/Noise Overlay removed for performance stability */}
        </div>
    );
}
