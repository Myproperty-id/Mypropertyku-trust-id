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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustIndicators />
        <FeaturedListings />
        <AIAssistant />
        <HowItWorks />
        <TrustedPartners />
        <PartnersSection />
        <ConsultationCTA />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
