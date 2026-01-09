import { Search, FileCheck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Cari Properti",
    description: "Jelajahi ribuan properti yang tersedia di platform kami. Gunakan filter untuk menemukan properti yang sesuai dengan kebutuhan Anda.",
  },
  {
    icon: FileCheck,
    step: "02",
    title: "Periksa Verifikasi",
    description: "Lihat status verifikasi, sertifikat, dan analisis risiko untuk setiap properti. Pastikan legalitas sebelum bertransaksi.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Transaksi Aman",
    description: "Hubungi penjual dengan percaya diri. Semua data telah terverifikasi untuk memastikan transaksi yang aman dan transparan.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-4">
            Proses Mudah
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-primary-foreground/70">
            Tiga langkah sederhana untuk menemukan properti impian Anda dengan keamanan dan transparansi penuh.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-primary-foreground/20" />
              )}
              
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 mb-6">
                <step.icon className="w-10 h-10 text-primary-foreground" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>

              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
