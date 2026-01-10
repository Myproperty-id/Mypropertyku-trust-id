import { Check, X, Zap, Shield, Star, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Pricing = () => {
  const plans = [
    {
      name: "Gratis",
      price: "Rp 0",
      period: "selamanya",
      description: "Untuk penjual yang baru memulai",
      icon: Zap,
      popular: false,
      features: [
        { text: "1 listing properti aktif", included: true },
        { text: "Verifikasi dasar", included: true },
        { text: "Tampil di hasil pencarian", included: true },
        { text: "Notifikasi email", included: true },
        { text: "Badge terverifikasi", included: false },
        { text: "Prioritas tampil di pencarian", included: false },
        { text: "Boost listing mingguan", included: false },
        { text: "Laporan statistik lengkap", included: false },
        { text: "Dukungan prioritas", included: false },
      ],
      cta: "Mulai Gratis",
      ctaVariant: "outline" as const,
    },
    {
      name: "Premium",
      price: "Rp 299.000",
      period: "/bulan",
      description: "Untuk agen profesional",
      icon: Shield,
      popular: true,
      features: [
        { text: "10 listing properti aktif", included: true },
        { text: "Verifikasi prioritas (24 jam)", included: true },
        { text: "Tampil di hasil pencarian", included: true },
        { text: "Notifikasi email & WhatsApp", included: true },
        { text: "Badge terverifikasi", included: true },
        { text: "Prioritas tampil di pencarian", included: true },
        { text: "1 Boost listing /minggu", included: true },
        { text: "Laporan statistik lengkap", included: false },
        { text: "Dukungan prioritas", included: false },
      ],
      cta: "Pilih Premium",
      ctaVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "Rp 999.000",
      period: "/bulan",
      description: "Untuk developer & agensi",
      icon: Crown,
      popular: false,
      features: [
        { text: "Unlimited listing properti", included: true },
        { text: "Verifikasi ekspres (6 jam)", included: true },
        { text: "Tampil di hasil pencarian", included: true },
        { text: "Notifikasi multi-channel", included: true },
        { text: "Badge terverifikasi premium", included: true },
        { text: "Prioritas tampil #1 di pencarian", included: true },
        { text: "Unlimited Boost listing", included: true },
        { text: "Laporan statistik lengkap + export", included: true },
        { text: "Account manager dedicated", included: true },
      ],
      cta: "Hubungi Sales",
      ctaVariant: "outline" as const,
    },
  ];

  const faqs = [
    {
      q: "Bagaimana sistem pembayaran?",
      a: "Pembayaran dilakukan bulanan melalui transfer bank atau kartu kredit. Langganan akan diperpanjang otomatis kecuali dibatalkan."
    },
    {
      q: "Apakah bisa upgrade atau downgrade paket?",
      a: "Ya, Anda bisa mengubah paket kapan saja. Perubahan akan berlaku di periode billing berikutnya."
    },
    {
      q: "Apa yang terjadi jika listing melebihi kuota?",
      a: "Listing yang melebihi kuota akan menjadi draft dan tidak ditampilkan. Upgrade paket untuk mengaktifkan kembali."
    },
    {
      q: "Apakah ada trial period?",
      a: "Paket Gratis bisa digunakan selamanya. Untuk Premium dan Enterprise, hubungi tim sales untuk trial 14 hari."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16 md:py-20">
          <div className="container-main text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Pilih Paket yang Tepat
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Mulai gratis dan upgrade sesuai kebutuhan bisnis Anda
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24 -mt-8">
          <div className="container-main">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div 
                  key={index}
                  className={`relative bg-card rounded-2xl border ${
                    plan.popular ? "border-primary shadow-xl scale-105" : "border-border"
                  } p-8 flex flex-col`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      <Star className="w-3 h-3 mr-1" /> Paling Populer
                    </Badge>
                  )}
                  
                  <div className="mb-6">
                    <div className={`w-12 h-12 rounded-xl ${
                      plan.popular ? "bg-primary/10" : "bg-muted"
                    } flex items-center justify-center mb-4`}>
                      <plan.icon className={`w-6 h-6 ${
                        plan.popular ? "text-primary" : "text-muted-foreground"
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-accent flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.ctaVariant} 
                    className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-muted/30">
          <div className="container-main">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              Perbandingan Lengkap Fitur
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-foreground font-medium">Fitur</th>
                    <th className="text-center py-4 px-4 text-foreground font-medium">Gratis</th>
                    <th className="text-center py-4 px-4 text-primary font-medium">Premium</th>
                    <th className="text-center py-4 px-4 text-foreground font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Jumlah Listing", "1", "10", "Unlimited"],
                    ["Waktu Verifikasi", "3-5 hari", "24 jam", "6 jam"],
                    ["Badge Verified", "—", "✓", "✓ Premium"],
                    ["Boost Listing", "—", "1/minggu", "Unlimited"],
                    ["Laporan Statistik", "Dasar", "Lengkap", "Lengkap + Export"],
                    ["Dukungan", "Email", "Email + Chat", "Dedicated Manager"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border">
                      <td className="py-4 px-4 text-foreground">{row[0]}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{row[1]}</td>
                      <td className="py-4 px-4 text-center text-foreground font-medium">{row[2]}</td>
                      <td className="py-4 px-4 text-center text-muted-foreground">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24">
          <div className="container-main max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              Pertanyaan Umum
            </h2>
            
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
