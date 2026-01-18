import { Search, FileCheck, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Cari Properti",
    description: "Jelajahi ribuan properti yang tersedia. Gunakan filter untuk menemukan properti yang sesuai dengan kebutuhan Anda.",
    color: "primary",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Periksa Verifikasi",
    description: "Lihat status verifikasi, sertifikat, dan analisis risiko untuk setiap properti sebelum bertransaksi.",
    color: "accent",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Transaksi Aman",
    description: "Hubungi penjual dengan percaya diri. Semua data telah terverifikasi untuk transaksi yang aman.",
    color: "primary",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container-main relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            Proses Mudah
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
            Bagaimana Cara <span className="text-accent">Kerjanya?</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Tiga langkah sederhana untuk menemukan properti impian Anda dengan keamanan dan transparansi penuh.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-20 left-[60%] w-[80%] items-center">
                  <div className="flex-1 h-[2px] bg-gradient-to-r from-border via-accent/30 to-border" />
                  <ArrowRight className="w-4 h-4 text-accent/50 -ml-2" />
                </div>
              )}

              {/* Card */}
              <div className="card-3d p-8 text-center h-full">
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div 
                  className={`relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-all duration-300 group-hover:scale-110 ${
                    step.color === "accent" 
                      ? "bg-accent/10 group-hover:bg-accent/20" 
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}
                >
                  <step.icon 
                    className={`w-10 h-10 ${
                      step.color === "accent" ? "text-accent" : "text-primary"
                    }`}
                  />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="gap-2 font-semibold">
              Pelajari Selengkapnya
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
