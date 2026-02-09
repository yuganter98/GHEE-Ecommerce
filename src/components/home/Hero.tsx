'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Animation variants
const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
};

export function Hero() {
    return (
        <section className="relative h-screen-dvh flex items-center overflow-hidden bg-ghee-950 text-white">
            {/* Background Image - Absolute & Priority */}
            <div className="absolute inset-0 z-0 select-none">
                <Image
                    src="/images/hero-bg.png" // Placeholder replaced with generated asset
                    alt="Golden ghee being poured"
                    fill
                    priority
                    className="object-cover opacity-40 mix-blend-overlay"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-ghee-950/30 via-transparent to-ghee-950/90" />
            </div>

            <div className="container relative z-10 px-4">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={item} className="mb-4 inline-block">
                        <span className="py-1 px-3 border border-ghee-500/50 rounded-full text-ghee-400 text-sm font-medium tracking-wider uppercase bg-ghee-950/50 backdrop-blur-sm">
                            The Essence of Purity
                        </span>
                    </motion.div>

                    <motion.h1 variants={item} className="text-5xl md:text-8xl font-serif font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-ghee-100 via-ghee-300 to-ghee-600 drop-shadow-sm">
                        Liquid Gold for<br />Modern Wellness
                    </motion.h1>

                    <motion.p variants={item} className="text-lg md:text-2xl text-ghee-100/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                        Hand-churned, Bilona method Pure Ghee. <br className="hidden md:block" />
                        Rooted in tradition, crafted for your health.
                    </motion.p>

                    <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/shop"
                            className="group relative px-8 py-4 bg-ghee-500 text-ghee-950 rounded-full font-semibold hover:bg-ghee-400 transition-all duration-300 shadow-[0_0_20px_rgba(245,183,0,0.3)] hover:shadow-[0_0_30px_rgba(245,183,0,0.5)] flex items-center gap-2"
                        >
                            Shop Collection
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/our-story"
                            className="px-8 py-4 text-ghee-200 hover:text-white border-b border-transparent hover:border-ghee-400 transition-colors"
                        >
                            Discover the Process
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Floating Elements (Optional subtle parallax decorators) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ delay: 1, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ghee-200/50"
            >
                <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-ghee-500/0 via-ghee-500/50 to-ghee-500/0" />
            </motion.div>
        </section>
    );
}
