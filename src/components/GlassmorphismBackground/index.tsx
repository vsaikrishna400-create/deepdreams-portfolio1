'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function GlassmorphismBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Mouse position with spring physics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // FAST responsive spring - high stiffness for immediate response
    const springConfig = { damping: 40, stiffness: 300, mass: 0.5 };
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

            {/* Main Glowing Orb - Large with FAST cursor following */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    x: orbX,
                    y: orbY,
                    width: 700,
                    height: 700,
                    marginLeft: -350,
                    marginTop: -350,
                }}
            >
                {/* Outer diffuse glow */}
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(196, 160, 82, 0.1) 0%, rgba(196, 160, 82, 0.05) 30%, rgba(0, 212, 255, 0.03) 50%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />

                {/* Middle glow layer */}
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '15%',
                        left: '15%',
                        width: '70%',
                        height: '70%',
                        background: 'radial-gradient(circle at center, rgba(255, 200, 100, 0.15) 0%, rgba(196, 160, 82, 0.08) 40%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />

                {/* Inner bright core */}
                <div
                    className="absolute rounded-full"
                    style={{
                        top: '30%',
                        left: '30%',
                        width: '40%',
                        height: '40%',
                        background: 'radial-gradient(circle at 45% 45%, rgba(255, 230, 150, 0.22) 0%, rgba(196, 160, 82, 0.1) 50%, transparent 80%)',
                        filter: 'blur(25px)',
                    }}
                />
            </motion.div>
        </div>
    );
}
