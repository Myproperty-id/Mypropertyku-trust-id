import { ExternalLink, Globe, Instagram, Building2, Landmark, FileCheck, HardHat } from "lucide-react";
import { motion } from "framer-motion";
import tukangprofesionalLogo from "@/assets/partners/tukangprofesional-logo.jpeg";
interface Partner {
  id: string;
  name: string;
  logo: string;
  website: string;
  instagram: string;
  description: string;
}
interface PartnerCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  partners: Partner[];
}
const konstruksiPartners: Partner[] = [{
  id: "tukangprofesional",
  name: "Tukang Profesional",
  logo: tukangprofesionalLogo,
  website: "https://www.tukangprofesional.id",
  instagram: "https://www.instagram.com/tukangprofesional.id",
  description: "Logo, Web, Company Profile"
}];
const partnerCategories: PartnerCategory[] = [{
  id: "konstruksi",
  name: "Jasa Konstruksi",
  icon: <HardHat className="w-6 h-6" />,
  description: "Partner konstruksi dan renovasi terpercaya",
  partners: konstruksiPartners
}, {
  id: "bank",
  name: "Bank",
  icon: <Landmark className="w-6 h-6" />,
  description: "Mitra perbankan untuk KPR dan pembiayaan",
  partners: []
}, {
  id: "notaris",
  name: "Notaris",
  icon: <FileCheck className="w-6 h-6" />,
  description: "Layanan notaris untuk legalitas properti",
  partners: []
}, {
  id: "bpn",
  name: "BPN",
  icon: <Building2 className="w-6 h-6" />,
  description: "Badan Pertanahan Nasional",
  partners: []
}];
const TrustedPartners = () => {
  return <section className="py-12 md:py-16 bg-card border-y border-border overflow-hidden">
      <div className="container-main mb-8">
        
      </div>

      {/* Single Logo Marquee */}
      <div className="relative py-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10" />
        
        <motion.div className="flex gap-16 items-center justify-center" animate={{
        x: ["-100%", "100%"]
      }} transition={{
        x: {
          duration: 12,
          repeat: Infinity,
          ease: "linear"
        }
      }} style={{
        width: "fit-content"
      }}>
          <motion.div className="flex-shrink-0" whileHover={{
          scale: 1.1
        }} transition={{
          type: "spring",
          stiffness: 400,
          damping: 10
        }}>
            <a href={konstruksiPartners[0].website} target="_blank" rel="noopener noreferrer" className="block w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background border border-border">
              <img src={konstruksiPartners[0].logo} alt={konstruksiPartners[0].name} className="w-full h-full object-cover" />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Partner Categories Grid */}
      <div className="container-main mt-10">
        <div className="text-center mb-6">
          <h4 className="text-md font-semibold text-foreground">Mitra Kami</h4>
          
        </div>

        

        {/* Tukang Profesional Card */}
        

        {/* Verified Badge */}
        
      </div>
    </section>;
};
export default TrustedPartners;