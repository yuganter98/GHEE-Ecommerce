import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
    title: 'Premium Ghee | Pure Golden Goodness',
    description: 'Hand-crafted, artisanal ghee for the discerning palate.',
    metadataBase: new URL('http://localhost:3000'),
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
