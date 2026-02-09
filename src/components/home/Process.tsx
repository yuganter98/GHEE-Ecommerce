'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Milk, Activity, Flame, PackageCheck, Utensils } from 'lucide-react';

const steps = [
    {
        id: 1,
        title: "Pure Milk Collection",
        desc: "Fresh, nutrient-rich milk from free-range buffaloes is collected daily.",
        icon: Milk,
        color: "bg-blue-100 text-blue-600",
    },
    {
        id: 2,
        title: "Curd Formation",
        desc: "Milk is boiled and set into curd in clay pots overnight.",
        icon: Utensils,
        color: "bg-ghee-100 text-ghee-600",
    },
    {
        id: 3,
        title: "Hand Churning",
        desc: "Curd is churned using the traditional wooden Bilona method.",
        icon: Activity,
        color: "bg-orange-100 text-orange-600",
    },
    {
        id: 4,
        title: "Slow Heating",
        desc: "Butter is separated and slowly heated over firewood.",
        icon: Flame,
        color: "bg-red-100 text-red-600",
    },
    {
        id: 5,
        title: "Golden Ghee",
        desc: "Pure, granulated ghee is filtered and jarred with love.",
        icon: PackageCheck,
        color: "bg-green-100 text-green-600",
    },
];

export function Process() {
    const container = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const trackWidth = track.current!.scrollWidth;
            const windowWidth = window.innerWidth;
            const xMove = -(trackWidth - windowWidth + 100);

            gsap.to(track.current, {
                x: xMove,
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + (trackWidth / 2),
                    anticipatePin: 1,
                }
            });
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative bg-ghee-50 overflow-hidden py-20 md:py-32">
            {/* Transition Divider */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-10">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(138%+1.3px)] h-[60px] md:h-[80px] fill-[#2C1810]">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>

            <div className="container px-4 mb-12 md:mb-20 text-center">
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-ghee-900 mb-6">
                    The Bilona Method
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                    An ancient 5-step process that preserves nutrients and flavor.
                </p>
            </div>

            <div className="md:overflow-hidden">
                <div ref={track} className="flex flex-col md:flex-row gap-8 px-4 md:px-24 w-full md:w-max items-center">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className="relative w-full md:w-[400px] h-auto md:h-[500px] bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-between border border-ghee-100 shrink-0"
                        >
                            <div>
                                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-8`}>
                                    <step.icon size={32} />
                                </div>
                                <span className="text-6xl font-serif text-gray-100 absolute top-4 right-8 font-bold select-none">
                                    0{step.id}
                                </span>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">{step.desc}</p>
                            </div>
                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-8">
                                <div className="h-full bg-ghee-500 rounded-full" style={{ width: `${step.id * 20}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
