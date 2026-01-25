'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <motion.div
                className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-6 py-3"
                animate={{
                    backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(10, 10, 10, 0)',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
                    border: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Logo */}
                <motion.a
                    href="#"
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="relative w-10 h-10">
                        <Image
                            src="/images/logo.jpg"
                            alt="DeepDreams"
                            fill
                            className="object-contain rounded-full"
                            style={{ mixBlendMode: 'lighten' }}
                        />
                    </div>
                    <motion.span
                        className="font-bold text-lg hidden sm:block"
                        style={{
                            color: '#e8d5a3', // Solid Gold
                            textShadow: '0 0 10px rgba(196, 160, 82, 0.3)',
                            fontFamily: 'var(--font-italiana), serif', // Match Hero font
                            letterSpacing: '0.05em'
                        }}
                    >
                        DeepDreams
                    </motion.span>
                </motion.a>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {navLinks.map((link, i) => (
                        <motion.a
                            key={link.href}
                            href={link.href}
                            className="relative px-4 py-2 text-sm text-[#a0a0a0] hover:text-white transition-colors"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            {link.label}
                            <motion.div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#c4a052] rounded-full"
                                initial={{ width: 0 }}
                                whileHover={{ width: '60%' }}
                                transition={{ duration: 0.2 }}
                            />
                        </motion.a>
                    ))}

                    {/* CTA Button */}
                    <motion.a
                        href="https://wa.me/919010901232"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#c4a052] to-[#d4b87a] text-[#0a0a0a] hidden md:block"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 }}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(196, 160, 82, 0.4)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Let&apos;s Talk
                    </motion.a>
                </div>
            </motion.div>
        </motion.nav>
    );
}
