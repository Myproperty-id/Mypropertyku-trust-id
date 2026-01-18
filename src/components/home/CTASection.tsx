import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle, Building2, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container-main">
        <div className="relative bg-primary rounded-[2rem] p-8 md:p-12 lg:p-16 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary-foreground/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Gratis untuk Penjual
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-5 leading-tight">
                Siap Menjual <br className="hidden md:block" />
                Properti Anda?
              </h2>
              <p className="text-lg text-primary-foreground/75 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Daftarkan properti Anda sekarang dan raih jutaan pembeli potensial. Dapatkan verifikasi gratis untuk meningkatkan kepercayaan pembeli.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/post-property">
                  <Button size="lg" className="gap-2 w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-xl">
                    <PlusCircle className="w-5 h-5" />
                    Pasang Iklan Gratis
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Element */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                {/* Main card */}
                <div className="w-64 h-64 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center shadow-2xl animate-float">
                  <Building2 className="w-24 h-24 text-primary-foreground/80" strokeWidth={1} />
                </div>

                {/* Shield badge */}
                <div className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-accent shadow-xl flex items-center justify-center animate-pulse-glow">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>

                {/* Floating card */}
                <div className="absolute -bottom-4 -left-8 px-5 py-3 rounded-xl bg-card shadow-xl animate-float-delay">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-semibold text-foreground">5000+ Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
