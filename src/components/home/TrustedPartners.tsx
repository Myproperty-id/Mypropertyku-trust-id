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

const konstruksiPartners: Partner[] = [
  {
    id: "tukangprofesional",
    name: "Tukang Profesional",
    logo: tukangprofesionalLogo,
    website: "https://www.tukangprofesional.id",
    instagram: "https://www.instagram.com/tukangprofesional.id",
    description: "Logo, Web, Company Profile",
  },
];

const partnerCategories: PartnerCategory[] = [
  {
    id: "konstruksi",
    name: "Jasa Konstruksi",
    icon: <HardHat className="w-6 h-6" />,
    description: "Partner konstruksi dan renovasi terpercaya",
    partners: konstruksiPartners,
  },
  {
    id: "bank",
    name: "Bank",
    icon: <Landmark className="w-6 h-6" />,
    description: "Mitra perbankan untuk KPR dan pembiayaan",
    partners: [],
  },
  {
    id: "notaris",
    name: "Notaris",
    icon: <FileCheck className="w-6 h-6" />,
    description: "Layanan notaris untuk legalitas properti",
    partners: [],
  },
  {
    id: "bpn",
    name: "BPN",
    icon: <Building2 className="w-6 h-6" />,
    description: "Badan Pertanahan Nasional",
    partners: [],
  },
];

const TrustedPartners = () => {
  return (
    <section className="py-12 md:py-16 bg-card border-y border-border overflow-hidden">
      <div className="container-main mb-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
            Trusted Partner
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            Kolaborasi Profesional
          </h3>
        </div>
      </div>

      {/* Single Logo Marquee */}
      <div className="relative py-6">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10" />
        
        <motion.div
          className="flex gap-16 items-center justify-center"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            x: {
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <a
              href={konstruksiPartners[0].website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background border border-border"
            >
              <img
                src={konstruksiPartners[0].logo}
                alt={konstruksiPartners[0].name}
                className="w-full h-full object-cover"
              />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Partner Categories Grid */}
      <div className="container-main mt-10">
        <div className="text-center mb-6">
          <h4 className="text-md font-semibold text-foreground">Kategori Partner</h4>
          <p className="text-sm text-muted-foreground">Ekosistem layanan properti terpadu</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partnerCategories.map((category) => (
            <motion.div
              key={category.id}
              className="p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {category.icon}
              </div>
              <h5 className="font-semibold text-foreground text-sm mb-1">{category.name}</h5>
              <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
              {category.partners.length > 0 ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  {category.partners.length} Partner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  Segera Hadir
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tukang Profesional Card */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-foreground text-center mb-4">Jasa Konstruksi</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {konstruksiPartners.map((partner) => (
              <motion.div
                key={partner.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-foreground text-sm">{partner.name}</h4>
                  <p className="text-xs text-muted-foreground">{partner.description}</p>
                  <div className="flex gap-3 mt-1">
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href={partner.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      <Instagram className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Verified Badge */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Verified Partner
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
