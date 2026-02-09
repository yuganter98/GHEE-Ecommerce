'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Section } from '@/components/ui/section';

export function FarmStory() {
    const container = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Parallax Effect
        // Background moves slower than scroll (yPercent)
        gsap.to(bgRef.current, {
            yPercent: 20, // Moves down slightly as we scroll down to create depth
            ease: 'none',
            scrollTrigger: {
                trigger: container.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        });

        // Content Fade In
        gsap.fromTo(contentRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    }, { scope: container });

    return (
        <Section ref={container} fullWidth className="h-[80vh] flex items-center justify-center text-white overflow-hidden bg-[#2C1810]">
            {/* Top Wave Divider Overlay */}
            <div className="absolute top-0 left-0 w-full z-20 overflow-hidden leading-[0]">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(110%+1.3px)] h-[60px] md:h-[100px] fill-[#1a0f00]">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>

            {/* Parallax Background */}
            <div ref={bgRef} className="absolute inset-0 h-[120%] -top-[10%] w-full">
                <Image
                    src="/images/farm-bg.png" // Created asset
                    alt="Green pastures with cows"
                    fill
                    className="object-cover opacity-60"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div ref={contentRef} className="relative z-10 container text-center max-w-3xl px-4">
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-ghee-100">
                    Happy Herd, <br />Humble Beginnings
                </h2>
                <p className="text-lg md:text-xl text-ghee-50/90 leading-relaxed">
                    Our cows and buffaloes graze freely on lush, organic pastures.
                    We believe that the purity of the ghee begins with the happiness of the herd.
                    No hormones, no stress—just nature’s rhythm.
                </p>
            </div>
        </Section>
    );
}
