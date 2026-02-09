'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-ghee-950 text-ghee-100 pt-16 pb-8 border-t border-ghee-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="block mb-4">
                            <div className="relative w-40 h-24">
                                <Image
                                    src="/images/logo.png"
                                    alt="KraveLab Logo"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-ghee-200/80 text-sm leading-relaxed">
                            Crafting the purest Bilona Ghee with traditional methods and happy cows. Bringing the golden essence of health to your kitchen.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://www.instagram.com/kravelab.in?igsh=bm5rY2Y1ajRzczN0" target="_blank" rel="noopener noreferrer" className="text-ghee-300 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-ghee-300 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-ghee-300 hover:text-white transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-serif font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition-colors">Shop Now</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/process" className="hover:text-white transition-colors">The Process</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="text-white font-serif font-bold mb-6">Support</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-serif font-bold mb-6">Get in Touch</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-ghee-400 mt-0.5 shrink-0" />
                                <span>Kravelab Food, Radha Keli Kunj,<br />Village- Dhodhsar ,Jaipur Rajasthan 303712</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-ghee-400 shrink-0" />
                                <span>+91 9571259565</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-ghee-400 shrink-0" />
                                <span>kravelabco@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-ghee-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ghee-400">
                    <p>&copy; {new Date().getFullYear()} Premium Ghee Co. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
