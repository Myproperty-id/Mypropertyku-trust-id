import { ShieldCheck, FileSearch, AlertTriangle, Clock } from "lucide-react";
const trustFeatures = [{
  icon: ShieldCheck,
  title: "Data Terverifikasi",
  description: "Setiap properti diverifikasi oleh tim ahli kami dengan pengecekan dokumen resmi."
}, {
  icon: FileSearch,
  title: "Cek Sengketa",
  description: "Sistem kami memeriksa riwayat sengketa dan status hukum properti secara menyeluruh."
}, {
  icon: AlertTriangle,
  title: "Analisis Risiko",
  description: "Dapatkan penilaian risiko yang jelas sebelum melakukan transaksi properti."
}, {
  icon: Clock,
  title: "Audit Trail",
  description: "Jejak audit lengkap untuk setiap perubahan data dan verifikasi properti."
}];
const TrustIndicators = () => {
  return <section className="py-16 md:py-24 bg-muted/50">
      <div className="container-main">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">Mengapa Myproperty?<ShieldCheck className="w-4 h-4" />
            Mengapa MyProperty?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kepercayaan adalah Prioritas Kami
          </h2>
          <p className="text-muted-foreground">
            Kami memastikan setiap properti di platform kami telah melalui proses verifikasi yang ketat untuk melindungi pembeli dan penjual.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustFeatures.map((feature, index) => <div key={index} className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default TrustIndicators;