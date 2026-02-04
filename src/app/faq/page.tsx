'use client';

import { Section } from '@/components/ui/section';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// ... faqs array ...

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-white pt-20 pb-20 relative">
            <div className="absolute top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 text-ghee-900/80 hover:text-ghee-900 transition-colors group">
                    <div className="p-2 rounded-full bg-ghee-900/5 backdrop-blur-md group-hover:bg-ghee-900/10 transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>
            </div>
            <Section className="max-w-4xl mx-auto px-4">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-ghee-900 mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Everything you need to know about our liquid gold.
                    </p>
                </header>

                <div className="space-y-12">
                    {faqs.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="text-xl font-serif font-bold text-ghee-700 mb-6 border-b border-ghee-100 pb-2">
                                {group.category}
                            </h3>
                            <div className="space-y-4">
                                {group.questions.map((faq, qIdx) => (
                                    <Accordion key={qIdx} question={faq.q} answer={faq.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </main>
    );
}

function Accordion({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-ghee-100 rounded-2xl overflow-hidden bg-ghee-50/50 transition-colors hover:bg-ghee-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-medium text-ghee-900 text-lg pr-8">{question}</span>
                <span className={`shrink-0 transition-transform duration-300 text-ghee-500 ${isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
