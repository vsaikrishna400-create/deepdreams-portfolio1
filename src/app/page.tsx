import GlassmorphismBackground from '@/components/GlassmorphismBackground';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import VideoGallery from '@/components/VideoGallery';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
    return (
        <main className="relative min-h-screen">
            {/* Background Effect */}
            <GlassmorphismBackground />

            {/* Floating Navigation */}
            <Navigation />

            {/* Content Sections */}
            <div className="relative z-10">
                <Hero />
                <About />
                <Services />
                <VideoGallery />
                <Contact />
                <Footer />
            </div>
        </main>
    );
}
