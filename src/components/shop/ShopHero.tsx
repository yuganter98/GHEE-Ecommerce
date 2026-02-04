'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ShopHero() {
    return (
        <section className="relative h-[50vh] min-h-[500px] flex items-center justify-center overflow-hidden">
            {/* Background Parallax-ish Image */}
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-bg.png"
                    alt="Ghee Pouring"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/50 z-10" />
            </div>

            {/* Navigation */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>
            </div>

            {/* Content */}
            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block py-1 px-4 rounded-full bg-ghee-950/30 backdrop-blur-md border border-white/10 text-ghee-100 text-xs tracking-[0.2em] uppercase font-bold mb-6"
                >
                    Est. 2024 • Pure Bilona
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-serif font-black text-white mb-8 drop-shadow-2xl leading-none tracking-tight"
                >
                    Golden <span className="text-ghee-300 italic font-light">Harvest</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl text-white/90 max-w-xl mx-auto leading-relaxed font-light mix-blend-overlay"
                >
                    Curated essentials for the modern kitchen. Ethically sourced, distinctively pure.
                </motion.p>
            </div>
        </section>
    );
}
