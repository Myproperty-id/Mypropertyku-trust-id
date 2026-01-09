import { Link } from "react-router-dom";
import { ArrowRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        <div className="bg-gradient-to-br from-primary via-primary to-primary/90 rounded-3xl p-8 md:p-12 lg:p-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Siap Menjual Properti Anda?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Daftarkan properti Anda sekarang dan raih jutaan pembeli potensial. Dapatkan verifikasi gratis untuk meningkatkan kepercayaan pembeli.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/post-property">
              <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                <PlusCircle className="w-5 h-5" />
                Pasang Iklan Gratis
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Pelajari Lebih Lanjut
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
