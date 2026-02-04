'use client';

import { Section } from '@/components/ui/section';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Mock submission
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <main className="min-h-screen bg-ghee-50/30">
            {/* Header */}
            <div className="bg-ghee-900 text-white py-24 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Get in Touch</h1>
                <p className="text-ghee-200 text-lg">We'd love to hear from you. Queries, feedback, or just a hello.</p>
            </div>

            <Section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-ghee-100 flex flex-col md:flex-row">

                        {/* Left: Info */}
                        <div className="bg-ghee-50 p-12 md:w-2/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-serif font-bold text-ghee-900 mb-8">Contact Information</h3>
                                <ul className="space-y-8">
                                    <li className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ghee-600 shadow-sm shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Farm Location</p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Premium Ghee Co. Farm<br />
                                                Near Gir National Park<br />
                                                Gujarat, India - 362135
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ghee-600 shadow-sm shrink-0">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Phone</p>
                                            <p className="text-gray-600 text-sm mt-1">+91 98765 43210</p>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-ghee-600 shadow-sm shrink-0">
                                            <Mail size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Email</p>
                                            <p className="text-gray-600 text-sm mt-1">hello@premiumghee.com</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-12">
                                <p className="text-sm text-ghee-400">
                                    Working Hours: Mon - Sat, 9am - 6pm
                                </p>
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div className="p-12 md:w-3/5">
                            {status === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-2xl border border-green-100">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                        <Send size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                                    <p className="text-green-600">Thank you for reaching out. We'll get back to you shortly.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-8 text-sm font-medium text-green-700 underline hover:text-green-800"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">First Name</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-ghee-500 focus:ring-2 focus:ring-ghee-200 outline-none transition-all" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-ghee-500 focus:ring-2 focus:ring-ghee-200 outline-none transition-all" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <input required type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-ghee-500 focus:ring-2 focus:ring-ghee-200 outline-none transition-all" placeholder="john@example.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Message</label>
                                        <textarea required rows={5} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-ghee-500 focus:ring-2 focus:ring-ghee-200 outline-none transition-all placeholder:text-gray-400" placeholder="How can we help you today?" />
                                    </div>

                                    <button
                                        disabled={status === 'submitting'}
                                        className="w-full bg-ghee-600 text-white py-4 rounded-lg font-bold hover:bg-ghee-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </Section>
        </main>
    );
}
