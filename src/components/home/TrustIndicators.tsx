import { ShieldCheck, FileSearch, AlertTriangle, Clock, CheckCircle, Users, Award } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
const trustFeatures = [{
  icon: ShieldCheck,
  title: "Data Terverifikasi",
  description: "Setiap properti diverifikasi oleh tim ahli kami dengan pengecekan dokumen resmi.",
  color: "accent"
}, {
  icon: FileSearch,
  title: "Cek Sengketa",
  description: "Sistem kami memeriksa riwayat sengketa dan status hukum properti secara menyeluruh.",
  color: "primary"
}, {
  icon: AlertTriangle,
  title: "Analisis Risiko",
  description: "Dapatkan penilaian risiko yang jelas sebelum melakukan transaksi properti.",
  color: "warning"
}, {
  icon: Clock,
  title: "Audit Trail",
  description: "Jejak audit lengkap untuk setiap perubahan data dan verifikasi properti.",
  color: "accent"
}];
const statsData = [{
  value: 5000,
  suffix: "+",
  label: "Properti Terverifikasi",
  icon: CheckCircle
}, {
  value: 10000,
  suffix: "+",
  label: "Pengguna Aktif",
  icon: Users
}, {
  value: 50,
  suffix: "+",
  label: "Mitra Terpercaya",
  icon: Award
}];
const TrustIndicators = () => {
  const stats = statsData.map(stat => ({
    ...stat,
    counter: useCountUp({
      end: stat.value,
      suffix: stat.suffix
    })
  }));
  return <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-main relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">Mengapa Mypropertyku?<ShieldCheck className="w-4 h-4" />
            Mengapa MyProperty?
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
            Kepercayaan adalah{" "}
            <span className="text-accent">Prioritas</span> Kami
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Kami memastikan setiap properti di platform kami telah melalui proses verifikasi yang ketat untuk melindungi pembeli dan penjual.
          </p>
        </div>

        {/* Features Grid with 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {trustFeatures.map((feature, index) => <div key={index} className="card-3d p-6 group cursor-default" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${feature.color === "accent" ? "bg-accent/10 group-hover:bg-accent/20" : feature.color === "warning" ? "bg-warning/10 group-hover:bg-warning/20" : "bg-primary/10 group-hover:bg-primary/20"}`}>
                <feature.icon className={`w-7 h-7 ${feature.color === "accent" ? "text-accent" : feature.color === "warning" ? "text-warning" : "text-primary"}`} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>)}
        </div>

        {/* Stats Section */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {stats.map((stat, index) => <div key={index} ref={stat.counter.ref} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-foreground/10 mb-4">
                  <stat.icon className="w-7 h-7 text-accent" />
                </div>
                <p className="text-4xl md:text-5xl font-extrabold text-primary-foreground mb-2">
                  {stat.counter.count}
                </p>
                <p className="text-primary-foreground/70 font-medium">
                  {stat.label}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default TrustIndicators;