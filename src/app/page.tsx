import { GsapRegistry } from '@/components/ui/gsap-registry';
import { HomeHero } from '@/components/home/HomeHero';
import { FarmStory } from '@/components/home/FarmStory';
import { Process } from '@/components/home/Process';
import { ProductShowcase } from '@/components/home/ProductShowcase';

export default function Home() {
    return (
        <main className="bg-ghee-50 min-h-screen">
            <GsapRegistry />
            <HomeHero />
            <FarmStory />
            <Process />
            <ProductShowcase />
        </main>
    );
}
