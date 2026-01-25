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

      {/* Full Width Logo Marquee */}
      <div className="relative py-4 w-full">
        <motion.div 
          className="flex gap-24 items-center" 
          animate={{
            x: ["0%", "-50%"]
          }} 
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          {/* Duplicate logos for seamless loop */}
          {[...Array(8)].map((_, idx) => (
            <motion.div 
              key={idx}
              className="flex-shrink-0" 
              whileHover={{
                scale: 1.1
              }} 
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
            >
              <a 
                href={konstruksiPartners[0].website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-background border border-border"
              >
                <img 
                  src={konstruksiPartners[0].logo} 
                  alt={konstruksiPartners[0].name} 
                  className="w-full h-full object-cover" 
                  width={64}
                  height={64}
                  loading="lazy"
                />
              </a>
            </motion.div>
          ))}
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