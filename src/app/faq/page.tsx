'use client';

import { Section } from '@/components/ui/section';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        category: "Product & Purity",
        questions: [
            {
                q: "Is your ghee 100% pure?",
                a: "Yes! Our ghee is made from the milk of free-range Gir cows using the traditional wooden Bilona method. It contains zero preservatives, additives, or chemicals."
            },
            {
                q: "What is the Bilona method?",
                a: "Bilona is an ancient Vedic method where curd is hand-churned (two-way) to extract butter, which is then slow-boiled to make ghee. This retains more nutrients compared to modern cream-based machine processing."
            },
            {
                q: "Does it contain lactose?",
                a: "The clarification process removes almost all milk solids, including lactose and casein. However, if you have severe allergies, please consult your doctor."
            }
        ]
    },
    {
        category: "Ordering & Shipping",
        questions: [
            {
                q: "How long does delivery take?",
                a: "We process orders within 24 hours. Delivery typically takes 2-4 days for metro cities and 5-7 days for other locations."
            },
            {
                q: "Do you offer Cash on Delivery (COD)?",
                a: "Yes, we offer COD for most pin codes in India."
            },
            {
                q: "Can I return the product?",
                a: "Due to the nature of food products, we only accept returns if the jar arrives damaged or broken. Please refer to our Refund Policy for details."
            }
        ]
    },
    {
        category: "Storage & Shelf Life",
        questions: [
            {
                q: "Does ghee expire?",
                a: "Pure ghee has a very long shelf life. It is best before 12 months from the date of manufacture when stored in a cool, dry place."
            },
            {
                q: "Should I refrigerate it?",
                a: "No, refrigeration is not necessary. Just ensure you use a clean, dry spoon every time to prevent moisture contamination."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-white pt-20 pb-20">
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
