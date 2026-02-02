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

      {/* Partner Logos - Single row with animation */}
      <div className="relative py-6 w-full overflow-hidden">
        <motion.div 
          className="flex gap-16 items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Show all partners from konstruksiPartners array */}
          {konstruksiPartners.map((partner) => (
            <motion.div 
              key={partner.id}
              className="flex-shrink-0" 
              whileHover={{
                scale: 1.08
              }} 
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 10
              }}
            >
              <a 
                href={partner.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-background border border-border"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="w-full h-full object-cover" 
                  width={96}
                  height={96}
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