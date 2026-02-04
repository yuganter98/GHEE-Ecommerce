import { Process } from '@/components/home/Process';
import { Section } from '@/components/ui/section';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProcessPage() {
    return (
        <main className="bg-white min-h-screen pt-20">
            <Section className="py-20 text-center bg-ghee-950 text-white relative">
                <div className="absolute top-6 left-6 z-50">
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
                        <div className="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Craft</h1>
                <p className="max-w-2xl mx-auto text-lg text-ghee-200">
                    We follow the traditional Bilona method, ensuring every drop of ghee is pure, aromatic, and nutrient-rich.
                </p>
            </Section>

            <Process />
        </main>
    );
}
