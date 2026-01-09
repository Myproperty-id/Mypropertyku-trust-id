import { Building2, Scale, Landmark, Shield } from "lucide-react";

const partners = [
  {
    icon: Landmark,
    name: "Badan Pertanahan Nasional",
    description: "Integrasi data sertifikat",
  },
  {
    icon: Scale,
    name: "Notaris Terdaftar",
    description: "Partner verifikasi hukum",
  },
  {
    icon: Building2,
    name: "Bank Partner",
    description: "Dukungan KPR & pembiayaan",
  },
  {
    icon: Shield,
    name: "Asuransi Properti",
    description: "Perlindungan transaksi",
  },
];

const PartnersSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Dipercaya oleh Institusi Terkemuka
          </h2>
          <p className="text-muted-foreground">
            Kami bekerja sama dengan berbagai institusi untuk memastikan keamanan dan keabsahan setiap transaksi.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                <partner.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{partner.name}</h3>
              <p className="text-sm text-muted-foreground">{partner.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
