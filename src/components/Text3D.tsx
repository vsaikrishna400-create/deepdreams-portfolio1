'use client';

import { motion } from 'framer-motion';

interface Text3DProps {
    text: string;
    className?: string;
    color?: string;
    delay?: number;
}

export default function Text3D({ text, className, color, delay = 0 }: Text3DProps) {
    const letters = text.split("");

    const container = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: delay * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            z: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            rotateX: -90,
            z: -50,
        },
    };

    return (
        <motion.span
            style={{ 
                display: 'flex', 
                overflow: 'hidden',
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={child}
                    style={{ 
                        display: 'inline-block', 
                        color: color,
                        whiteSpace: 'pre',
                        transformStyle: 'preserve-3d',
                        willChange: 'transform'
                    }}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
}
