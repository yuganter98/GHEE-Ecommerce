'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Leaf, Heart, Droplet } from 'lucide-react';
import { Section } from '@/components/ui/section';

const features = [
    { icon: ShieldCheck, title: "Lab Tested", desc: "Every batch verified for purity." },
    { icon: Leaf, title: "100% Organic", desc: "No chemicals, GMOs, or additives." },
    { icon: Heart, title: "Cruelty Free", desc: "Our cows are treated like family." },
    { icon: Droplet, title: "A2 Protein", desc: "Easier digestion and better health." },
];

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
};

export function Quality() {
    return (
        <Section className="bg-white">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-ghee-900 mb-4">Uncompromised Purity</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">We don't just sell ghee; we deliver a promise of health and tradition.</p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {features.map((f, i) => (
                    <motion.div
                        key={i}
                        variants={item}
                        className="p-8 rounded-2xl bg-ghee-50/50 hover:bg-ghee-50 border border-transparent hover:border-ghee-200 transition-colors text-center group"
                    >
                        <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 text-ghee-600">
                            <f.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                        <p className="text-gray-600 font-light">{f.desc}</p>
                    </motion.div>
                ))}
            </motion.div>
        </Section>
    );
}
