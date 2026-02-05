'use client';

import Link from 'next/link';
import { HeroCanvas } from './HeroCanvas';
import { motion } from 'framer-motion';

export function HomeHero() {
    return (
        // Adjusted height to be standard (no scroll scrub)
        <section className="relative w-full min-h-screen bg-[#1a0f00] flex items-center justify-center p-4 md:p-8">

            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#422006_0%,#1a0f00_100%)] opacity-80" />

            {/* Main Container */}
            <div className="relative w-full max-w-[1600px] h-[85vh] md:h-[90vh] rounded-3xl overflow-hidden shadow-2xl shadow-ghee-500/10 border border-white/10 bg-black z-10">

                {/* Background Canvas Layer (Auto-Playing Sequence) */}
                <div className="absolute inset-0 z-0">
                    <HeroCanvas
                        folderPath="/gheee-jpg"
                        fileNamePrefix="ezgif-frame-"
                        startIndex={1}
                        frameCount={179}
                        className="opacity-95"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
                </div>

                {/* Content Layer */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
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
                </div>

            </div>
        </section>
    );
}
