'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Text3D from '@/components/Text3D';

export default function About() {
    return (
        <section id="about" className="relative py-20 md:py-32 px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Enhanced Profile Photo with Premium Glow Effects */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center"
                    >
                        <div className="relative">
                            {/* Outer animated glow ring */}
                            <motion.div
                                className="absolute -inset-4 md:-inset-6 rounded-3xl"
                                animate={{
                                    boxShadow: [
                                        '0 0 60px 20px rgba(196, 160, 82, 0.12), 0 0 100px 40px rgba(0, 212, 255, 0.06)',
                                        '0 0 80px 30px rgba(196, 160, 82, 0.18), 0 0 120px 50px rgba(0, 212, 255, 0.1)',
                                        '0 0 60px 20px rgba(196, 160, 82, 0.12), 0 0 100px 40px rgba(0, 212, 255, 0.06)',
                                    ],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            {/* Ambient background glow - Optimized (No Filters) */}
                            <div
                                className="absolute -inset-12 md:-inset-20 rounded-3xl -z-10"
                                style={{
                                    background: 'radial-gradient(ellipse at center, rgba(196, 160, 82, 0.15) 0%, rgba(0, 212, 255, 0.08) 30%, transparent 70%)',
                                    willChange: 'transform',
                                    transform: 'translate3d(0,0,0)',
                                }}
                            />

                            {/* Profile image container - taller aspect ratio with 3D effect */}
                            <motion.div
                                className="relative w-56 sm:w-64 md:w-80 rounded-2xl overflow-hidden cursor-pointer"
                                style={{ 
                                    aspectRatio: '3/4',
                                    perspective: '1000px',
                                    transformStyle: 'preserve-3d',
                                    position: 'relative',
                                    willChange: 'transform'
                                }}
                                whileHover={{ 
                                    rotateY: 10, 
                                    rotateX: -5,
                                    scale: 1.02
                                }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                {/* Inner glow ring */}
                                <div
                                    className="absolute inset-0 rounded-2xl z-10 pointer-events-none"
                                    style={{
                                        boxShadow: 'inset 0 0 40px 15px rgba(196, 160, 82, 0.15), inset 0 0 80px 30px rgba(0, 0, 0, 0.4)',
                                    }}
                                />

                                <Image
                                    src="/images/headshot-new.png"
                                    alt="Founder of DeepDreams AI Studio"
                                    fill
                                    sizes="(max-width: 640px) 224px, (max-width: 768px) 256px, 320px"
                                    className="object-cover object-top"
                                    style={{
                                        objectPosition: 'center 15%',
                                    }}
                                    priority
                                />

                                {/* Bottom gradient fade for seamless blend */}
                                <div
                                    className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
                                    style={{
                                        background: 'linear-gradient(to top, rgba(10, 10, 10, 0.9) 0%, transparent 100%)',
                                    }}
                                />
                            </motion.div>

                            {/* Floating accent particles */}
                            <motion.div
                                className="absolute -top-3 -right-3 w-2 h-2 md:w-3 md:h-3 rounded-full"
                                style={{ backgroundColor: '#c4a052' }}
                                animate={{
                                    y: [-5, 5, -5],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute -bottom-2 -left-4 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                                style={{ backgroundColor: '#00d4ff' }}
                                animate={{
                                    y: [5, -5, 5],
                                    opacity: [0.4, 0.9, 0.4],
                                }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Text3D
                            text="About the Studio"
                            className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 md:mb-6 justify-center md:justify-start"
                            color="#c4a052"
                        />

                        <p className="text-[#b0b0b0] text-base md:text-lg mb-4 md:mb-6 leading-relaxed text-center md:text-left">
                            Welcome to <span className="text-white font-semibold">DeepDreams AI Studio</span>,
                            where cutting-edge artificial intelligence meets creative vision. We specialize in
                            transforming ideas into stunning digital experiences that captivate and inspire.
                        </p>

                        <p className="text-[#b0b0b0] text-base md:text-lg mb-8 md:mb-10 leading-relaxed text-center md:text-left">
                            From revolutionary AI-powered video production to sophisticated web applications
                            and intelligent chatbot solutions, we bring your deepest dreams to life with
                            the power of next-generation technology.
                        </p>

                        {/* Premium Stats */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {[
                                { value: '50+', label: 'AI Videos', color: '#00d4ff' },
                                { value: '20+', label: 'Happy Clients', color: '#c4a052' },
                                { value: '100%', label: 'Satisfaction', color: '#ffffff' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="text-center p-3 md:p-4 rounded-xl"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        background: 'rgba(255, 255, 255, 0.04)',
                                    }}
                                >
                                    <div
                                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-1"
                                        style={{ color: stat.color }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-[#666] uppercase tracking-wider">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
