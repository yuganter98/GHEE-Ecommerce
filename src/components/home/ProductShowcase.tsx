'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/section';

export function ProductShowcase() {
    return (
        <Section className="bg-ghee-950 text-white relative pt-32 pb-24">
            {/* Top Tilt Divider */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(123%+1.3px)] h-[80px] fill-[#fffbeb]">
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" className="shape-fill"></path>
                </svg>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-16">
                {/* Product Image Stage */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="flex-1 relative w-full aspect-square max-w-lg mx-auto"
                >
                    <div className="absolute inset-0 bg-ghee-500/20 blur-[100px] rounded-full" />
                    <div className="relative z-10 w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-full border border-white/10 overflow-hidden">
                        {/* Placeholder for actual product jar */}
                        <div className="relative w-full h-full transform transition-transform duration-500 hover:scale-105">
                            <Image
                                src="/images/product-jar.jpg"
                                alt="Premium Ghee Jar"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 500px"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* content */}
                <div className="flex-1 text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-ghee-100">
                            The Golden Jar
                        </h2>
                        <p className="text-xl text-ghee-50/80 mb-8 max-w-xl font-light leading-relaxed">
                            Available in 500ml and 1L jars. Experience the distinct aroma and texture of genuine Bilona Ghee.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 justify-center lg:justify-start text-sm tracking-wider uppercase text-ghee-400 font-medium">
                                <span>• Glass Jar Packaging</span>
                                <span>• Vacuum Sealed</span>
                            </div>
                            <div className="pt-6">
                                <Link
                                    href="/shop"
                                    className="inline-block px-12 py-5 bg-ghee-500 text-ghee-950 rounded-full font-bold hover:bg-white transition-all duration-300 shadow-xl shadow-amber-900/20"
                                >
                                    Buy Now
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Section>
    );
}
