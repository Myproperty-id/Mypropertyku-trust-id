import { Calendar, MessageCircle, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/fuji-anggara10";

const benefits = [
  { icon: MessageCircle, text: "Konsultasi gratis dengan ahli properti" },
  { icon: Clock, text: "Jadwalkan sesuai waktu Anda" },
  { icon: CheckCircle, text: "Dapatkan panduan jual-beli properti" },
];

const ConsultationCTA = () => {
  const handleBooking = () => {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-16 md:py-20 bg-muted/50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl md:rounded-3xl p-8 md:p-12 border border-primary/20 shadow-xl overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl" />
          </div>

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-semibold mb-4">
                <Calendar className="w-4 h-4" />
                Konsultasi Gratis
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Butuh Bantuan dengan Properti Anda?
              </h2>
              
              <p className="text-primary-foreground/80 mb-6 max-w-lg">
                Jadwalkan panggilan konsultasi gratis dengan tim ahli kami. Kami siap membantu Anda menemukan properti impian atau menjual properti dengan harga terbaik.
              </p>

              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 justify-center md:justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <benefit.icon className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="text-primary-foreground text-sm md:text-base">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                size="lg"
                onClick={handleBooking}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Calendar className="w-5 h-5" />
                Jadwalkan Konsultasi
              </Button>
            </div>

            {/* Visual */}
            <div className="hidden md:flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="w-56 h-56 lg:w-64 lg:h-64 rounded-3xl bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center shadow-xl">
                  <Calendar className="w-20 h-20 lg:w-24 lg:h-24 text-primary-foreground/70" strokeWidth={1} />
                </div>
                
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 px-4 py-2 rounded-xl bg-accent text-accent-foreground shadow-lg"
                >
                  <span className="text-sm font-semibold">100% Gratis</span>
                </motion.div>

                {/* Stats badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-3 -left-4 px-4 py-2 rounded-xl bg-primary-foreground border border-primary-foreground/20 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm font-medium text-primary">Online Sekarang</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConsultationCTA;
