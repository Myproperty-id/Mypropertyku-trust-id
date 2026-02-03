import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustIndicators from "@/components/home/TrustIndicators";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import PartnersSection from "@/components/home/PartnersSection";
import TrustedPartners from "@/components/home/TrustedPartners";
import AIAssistant from "@/components/home/AIAssistant";
import CTASection from "@/components/home/CTASection";
import ConsultationCTA from "@/components/home/ConsultationCTA";

/**
 * Homepage dengan urutan section yang dioptimasi untuk conversion:
 * 1. Hero - Value prop & search (3 detik pertama)
 * 2. How It Works - Cara kerja sederhana
 * 3. Trust Indicators - Membangun kepercayaan
 * 4. Featured Listings - Bukti properti nyata
 * 5. AI Assistant - Bantuan interaktif
 * 6. Consultation CTA - Ajak kontak
 * 7. Partners - Social proof
 * 8. Final CTA - Pasang iklan
 */
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero: Value proposition & search dalam 3 detik */}
        <HeroSection />
        
        {/* How It Works: 3 langkah sederhana */}
        <HowItWorks />
        
        {/* Trust Indicators: Mengapa Mypropertyku? */}
        <TrustIndicators />
        
        {/* Featured Listings: Bukti properti terverifikasi */}
        <FeaturedListings />
        
        {/* AI Assistant: Bantuan interaktif */}
        <AIAssistant />
        
        {/* Consultation CTA: Konsultasi gratis */}
        <ConsultationCTA />
        
        {/* Partners: Social proof */}
        <TrustedPartners />
        <PartnersSection />
        
        {/* Final CTA: Pasang iklan gratis */}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
