'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#contact', label: 'Contact' },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 px-3 md:px-6 py-3 md:py-4"
            >
                <motion.div
                    className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-4 md:px-6 py-2.5 md:py-3"
                    animate={{
                        backgroundColor: isScrolled || mobileMenuOpen ? 'rgba(10, 10, 10, 0.92)' : 'rgba(10, 10, 10, 0)',
                        backdropFilter: isScrolled || mobileMenuOpen ? 'blur(20px)' : 'blur(0px)',
                        border: isScrolled || mobileMenuOpen ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Logo */}
                    <motion.a
                        href="#"
                        className="flex items-center gap-2 md:gap-3"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <div className="relative w-10 h-10 md:w-14 md:h-14 shrink-0">
                            <Image
                                src="/images/logo-transparent-new.png"
                                alt="DeepDreams"
                                fill
                                sizes="56px"
                                className="object-contain rounded-full"
                                unoptimized
                            />
                        </div>
                        <motion.span
                            className="font-bold text-base md:text-lg hidden sm:block"
                            style={{
                                color: '#e8d5a3',
                                textShadow: '0 0 10px rgba(196, 160, 82, 0.3)',
                                fontFamily: 'var(--font-italiana), serif',
                                letterSpacing: '0.05em'
                            }}
                        >
                            DeepDreams
                        </motion.span>
                    </motion.a>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-1">
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
                            className="ml-4 px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-[#c4a052] to-[#d4b87a] text-[#0a0a0a]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(196, 160, 82, 0.4)' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Let&apos;s Talk
                        </motion.a>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <motion.button
                        className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle menu"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between">
                            <motion.span
                                className="block h-0.5 w-full rounded-full bg-[#c4a052]"
                                animate={mobileMenuOpen
                                    ? { rotate: 45, y: 7, width: '100%' }
                                    : { rotate: 0, y: 0, width: '100%' }
                                }
                                transition={{ duration: 0.3 }}
                            />
                            <motion.span
                                className="block h-0.5 w-3/4 rounded-full bg-[#c4a052]"
                                animate={mobileMenuOpen
                                    ? { opacity: 0, x: -10 }
                                    : { opacity: 1, x: 0 }
                                }
                                transition={{ duration: 0.2 }}
                            />
                            <motion.span
                                className="block h-0.5 w-full rounded-full bg-[#c4a052]"
                                animate={mobileMenuOpen
                                    ? { rotate: -45, y: -7, width: '100%' }
                                    : { rotate: 0, y: 0, width: '100%' }
                                }
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.button>
                </motion.div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-40 md:hidden"
                        style={{
                            backgroundColor: 'rgba(10, 10, 10, 0.97)',
                            backdropFilter: 'blur(30px)',
                        }}
                    >
                        <div className="flex flex-col items-center justify-center h-full gap-2 px-8">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className="text-3xl font-light text-[#a0a0a0] hover:text-white py-4 tracking-wider transition-colors"
                                    style={{ fontFamily: 'var(--font-italiana), serif' }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}

                            {/* Mobile CTA */}
                            <motion.a
                                href="https://wa.me/919010901232"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: 0.35, duration: 0.4 }}
                                className="mt-6 px-8 py-3.5 rounded-full text-base font-medium bg-gradient-to-r from-[#c4a052] to-[#d4b87a] text-[#0a0a0a]"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Let&apos;s Talk
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
