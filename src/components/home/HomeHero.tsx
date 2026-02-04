'use client';

import Link from 'next/link';
import { HeroCanvas } from './HeroCanvas';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

export function HomeHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [frameIndex, setFrameIndex] = useState(0);

    // Track scroll progress of the 300vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth out the scroll progress (Scrubbing effect)
    // Smooth out the scroll progress (Scrubbing effect)
    // Tuned for "scrub: 0.2" feel (softer, less rigid)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 15,
        restDelta: 0.001
    });

    // Map smoothed scroll (0 to 1) to frame index (0 to 178)
    // Rounding is handled in the listener, but useTransform output is continuous
    const frameIndexMotion = useTransform(smoothProgress, [0, 1], [0, 178]);

    // Update state when motion value changes
    useMotionValueEvent(frameIndexMotion, "change", (latest) => {
        setFrameIndex(Math.round(latest));
    });

    return (
        <section ref={containerRef} className="relative h-[300vh] w-full bg-[#1a0f00]">
            {/* Ambient Background: Radial Gradient to frame the center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#422006_0%,#1a0f00_100%)] opacity-80" />

            {/* Sticky Container with "Floating" Look */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center p-4 md:p-8 z-10">

                {/* Constrained Canvas Container */}
                <div className="relative w-full max-w-[1600px] h-[85vh] md:h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-ghee-500/10 border border-white/10 bg-black">

                    {/* Background Canvas Layer */}
                    <div className="absolute inset-0 z-0">
                        <HeroCanvas
                            folderPath="/gheee-jpg"
                            fileNamePrefix="ezgif-frame-"
                            startIndex={1}
                            frameCount={179}
                            frameIndex={frameIndex}
                            className="opacity-95"
                        />
                    </div>

                    {/* Content Layer */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-lg tracking-tight">
                                Generic. <br /> <span className="text-ghee-300 italic">But Gold.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-ghee-100 mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
                                The purest Bilona Ghee, crafted for those who know the difference.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto">
                                <Link
                                    href="/shop"
                                    className="px-8 py-3 bg-ghee-500 hover:bg-ghee-600 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-ghee-900/20"
                                >
                                    Shop Now
                                </Link>
                                <Link
                                    href="/about"
                                    className="px-8 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 rounded-full font-bold text-lg transition-all"
                                >
                                    Our Story
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/50"
                    >
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                            <div className="w-1 h-2 bg-white/70 rounded-full" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
