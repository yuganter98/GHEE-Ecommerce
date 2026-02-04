import { Process } from '@/components/home/Process';
import { Section } from '@/components/ui/section';

export default function ProcessPage() {
    return (
        <main className="bg-white min-h-screen pt-20">
            <Section className="py-20 text-center bg-ghee-950 text-white">
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Craft</h1>
                <p className="max-w-2xl mx-auto text-lg text-ghee-200">
                    We follow the traditional Bilona method, ensuring every drop of ghee is pure, aromatic, and nutrient-rich.
                </p>
            </Section>

            <Process />
        </main>
    );
}
