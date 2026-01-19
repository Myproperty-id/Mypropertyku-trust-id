import { ExternalLink, Globe, Instagram } from "lucide-react";
import tukangprofesionalLogo from "@/assets/partners/tukangprofesional-logo.jpeg";

const TrustedPartners = () => {
  return (
    <section className="py-12 md:py-16 bg-card border-y border-border">
      <div className="container-main">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left - Label */}
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
              Trusted Partner
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              Kolaborasi Profesional
            </h3>
          </div>

          {/* Center - Partner Card */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-background border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <img
                src={tukangprofesionalLogo}
                alt="Tukang Profesional Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                Tukang Profesional
              </h4>
              <p className="text-sm text-muted-foreground">
                Logo, Web, Company Profile
              </p>
              
              {/* Links */}
              <div className="flex flex-wrap gap-3 mt-1">
                <a
                  href="https://www.tukangprofesional.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>tukangprofesional.id</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.instagram.com/tukangprofesional.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@tukangprofesional.id</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right - Decorative */}
          <div className="hidden md:block text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Verified Partner
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPartners;
