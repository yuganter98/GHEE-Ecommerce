import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
    title: {
        default: 'Kravelab | Pure A2 Bilona Ghee',
        template: '%s | Kravelab'
    },
    description: 'Experience the purest handcrafted Bilona Ghee from free-grazing cows and buffaloes. Traditional Vedic method, 100% organic and cruelty-free.',
    metadataBase: new URL('https://www.kravelab.in'),
    keywords: ['A2 Ghee', 'Bilona Ghee', 'Organic Ghee', 'Buffalo Ghee', 'Desi Ghee', 'Kravelab', 'Pure Ghee'],
    openGraph: {
        title: 'Kravelab | Pure A2 Bilona Ghee',
        description: 'Authentic Vedic Bilona Ghee. Handcrafted details, pure taste.',
        url: 'https://www.kravelab.in',
        siteName: 'Kravelab',
        locale: 'en_IN',
        type: 'website',
    },
};

import { Footer } from '@/components/layout/Footer';
import { FloatingCart } from '@/components/layout/FloatingCart';
// ... imports

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={cn(inter.variable, playfair.variable)}>
            <body className="font-sans antialiased min-h-screen flex flex-col">
                <FloatingCart />
                {children}
                <Footer />
            </body>
        </html>
    );
}
