'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Extremely fast loading for instant feel
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 15; // Fast increments
            });
        }, 30);
        
        return () => clearInterval(interval);
    }, []);

    // Handle completion in a separate effect to avoid side-effects during state updates
    useEffect(() => {
        if (progress >= 100) {
            onComplete();
        }
    }, [progress, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
            initial={{ opacity: 1 }}
            exit={{ 
                opacity: 0,
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center"
            >
                {/* Brand Name with 3D Reveal Effect */}
                <div className="mb-8" style={{ perspective: '1000px' }}>
                    <motion.h1 
                        initial={{ 
                            y: 100, 
                            rotateX: -90, 
                            opacity: 0,
                            letterSpacing: "0.4em" 
                        }}
                        animate={{ 
                            y: 0, 
                            rotateX: 0, 
                            opacity: 1,
                            letterSpacing: "0.6em" 
                        }}
                        transition={{ 
                            duration: 1.5, 
                            ease: [0.22, 1, 0.36, 1],
                            opacity: { duration: 0.8 }
                        }}
                        className="text-4xl md:text-6xl font-bold pr-[-0.6em] flex"
                        style={{ 
                            fontFamily: 'var(--font-italiana), serif',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <span className="text-white">DEEP</span>
                        <span style={{ color: '#c4a052' }}>DREAMS</span>
                    </motion.h1>
                </div>
                
                {/* Premium Progress Bar */}
                <div className="w-48 md:w-64 h-[2px] bg-white/5 relative rounded-full overflow-hidden">
                    <motion.div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#c4a052] to-[#d4b87a]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                        style={{ boxShadow: '0 0 15px rgba(196, 160, 82, 0.4)' }}
                    />
                </div>

                {/* Progress Percentage */}
                <motion.span 
                    className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#666] font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Loading {Math.round(progress)}%
                </motion.span>
            </motion.div>
        </motion.div>
    );
}
