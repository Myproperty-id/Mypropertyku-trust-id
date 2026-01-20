import { ExternalLink, Globe, Instagram } from "lucide-react";
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

const partners: Partner[] = [
  {
    id: "tukangprofesional",
    name: "Tukang Profesional",
    logo: tukangprofesionalLogo,
    website: "https://www.tukangprofesional.id",
    instagram: "https://www.instagram.com/tukangprofesional.id",
    description: "Logo, Web, Company Profile",
  },
];

// Duplicate for seamless loop
const duplicatedLogos = [...partners, ...partners, ...partners, ...partners];

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

      {/* Animated Logo Marquee */}
      <div className="relative py-6">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-card to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-card to-transparent z-10" />
        
        {/* Infinite Scroll Container */}
        <motion.div
          className="flex gap-16 items-center"
          animate={{
            x: [0, -50 * partners.length * 4],
          }}
          transition={{
            x: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          style={{ width: "fit-content" }}
        >
          {duplicatedLogos.map((partner, index) => (
            <motion.div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-background border border-border"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Partner Cards Grid */}
      <div className="container-main mt-10">
        <div className="flex flex-wrap justify-center gap-4">
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              {/* Small Logo */}
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-foreground text-sm">
                  {partner.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {partner.description}
                </p>
                
                {/* Links */}
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
