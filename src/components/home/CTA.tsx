'use client';

import Link from 'next/link';
import { Section } from '@/components/ui/section';

export function CTA() {
    return (
        <Section className="bg-ghee-50 py-32 text-center relative">
            {/* Top Wave Divider */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(150%+1.3px)] h-[60px] fill-[#2a1208]">
                    <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                </svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-ghee-900 mb-6">
                Taste the Tradition
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                Join thousands of families who have switched to a healthier, tastier cooking medium.
            </p>
            <Link
                href="/shop"
                className="px-10 py-4 bg-ghee-950 text-white rounded-full font-medium hover:bg-ghee-700 transition-colors"
            >
                Start Your Journey
            </Link>

        </Section>
    );
}
