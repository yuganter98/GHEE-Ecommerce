import Image from 'next/image';
import { Section } from '@/components/ui/section';
import { Heart, Sun, Leaf, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-static';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute top-6 left-6 z-50">
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
                <Image
                    src="/images/hero-bg.png"
                    alt="Traditional Ghee Making"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 text-center text-white px-4">
                    <span className="inline-block py-1 px-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md mb-4 text-sm tracking-wide uppercase">
                        Since 1924
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Our Legacy
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-ghee-100 max-w-2xl mx-auto">
                        Preserving the ancient art of Bilona ghee making for generations.
                    </p>
                </div>
            </div>

            {/* The Story */}
            <Section className="py-24 bg-ghee-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-ghee-900 mb-8">
                            Rooted in Tradition
                        </h2>
                        <div className="prose prose-lg prose-stone mx-auto text-gray-600 leading-relaxed">
                            <p className="mb-6">
                                It started with a single cow and a promise. A promise to keep the milk pure, the process slow, and the intention honest.
                                Before industrial machines took over, ghee was made with patience—boiled over firewood, curdled in clay pots, and churned by hand.
                            </p>
                            <p>
                                At <strong>Premium Ghee Co.</strong>, we refuse to take shortcuts. We believe that food carries the energy of how it was made.
                                That's why our cows and buffaloes roam free, our milk is never processed with chemicals, and every jar is filled with the golden essence of nature.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Values Grid */}
            <Section className="py-24 bg-white relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-ghee-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 rounded-2xl bg-ghee-50/50 border border-ghee-100 hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-ghee-600">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-ghee-900 mb-4">100% Organic</h3>
                            <p className="text-gray-600">
                                Sourced from free-grazing cows & buffaloes living on chemical-free pastures. No hormones, no antibiotics.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-ghee-50/50 border border-ghee-100 hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-ghee-600">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-ghee-900 mb-4">Cruelty Free</h3>
                            <p className="text-gray-600">
                                We follow the principle of <em>Ahimsa</em>. The calf always gets the milk first, and we only take what is left.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-ghee-50/50 border border-ghee-100 hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-ghee-600">
                                <Sun size={32} />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-ghee-900 mb-4">Vedic Method</h3>
                            <p className="text-gray-600">
                                Churned bi-directionally (Bilona) to separate butter, then slow-cooked to remove water and casein.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}
