import { 
  Shield, Target, Eye, Users, Building2, CheckCircle2, 
  Award, TrendingUp, Heart
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparansi",
      description: "Kami percaya setiap transaksi properti harus didasari informasi yang jelas dan terverifikasi."
    },
    {
      icon: CheckCircle2,
      title: "Kepercayaan",
      description: "Sistem verifikasi multi-layer kami memastikan setiap listing telah melalui proses pengecekan ketat."
    },
    {
      icon: Heart,
      title: "Komitmen",
      description: "Dedikasi penuh untuk melindungi kepentingan pembeli dan penjual dalam setiap transaksi."
    },
  ];

  const team = [
    { name: "Tim Verifikasi", count: "15+", desc: "Profesional legal & properti" },
    { name: "Properti Terverifikasi", count: "1,000+", desc: "Listings aman & legal" },
    { name: "Pengguna Terdaftar", count: "10,000+", desc: "Kepercayaan yang terus tumbuh" },
    { name: "Transaksi Sukses", count: "500+", desc: "Nilai miliaran rupiah" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary py-20">
          <div className="container-main text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Tentang MyProperty
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Platform properti terverifikasi pertama di Indonesia yang mengutamakan 
              keamanan dan transparansi dalam setiap transaksi.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-16 md:py-24">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium text-accent uppercase tracking-wide">Visi Kami</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Menjadi Platform Properti Paling Terpercaya di Indonesia
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Kami bermimpi menciptakan ekosistem properti di mana setiap orang dapat 
                  membeli, menjual, atau menyewa properti dengan rasa aman dan tenang. 
                  Tidak ada lagi kekhawatiran tentang sertifikat palsu, sengketa lahan, 
                  atau penipuan properti.
                </p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wide">Misi Kami</span>
                </div>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Memverifikasi setiap properti dengan standar tertinggi</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Memberikan transparansi penuh tentang status legal properti</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Melindungi pembeli dari risiko sengketa dan penipuan</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Mempermudah akses informasi properti yang berkualitas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Problem We Solve */}
        <section className="py-16 bg-muted/30">
          <div className="container-main">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Masalah yang Kami Selesaikan
              </h2>
              <p className="text-muted-foreground">
                Industri properti Indonesia menghadapi tantangan besar yang merugikan 
                konsumen setiap tahunnya.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-danger" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Sertifikat Bermasalah</h3>
                <p className="text-muted-foreground text-sm">
                  Ribuan kasus sertifikat ganda, sertifikat palsu, dan sengketa kepemilikan 
                  terjadi setiap tahun, merugikan pembeli miliaran rupiah.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Kurangnya Transparansi</h3>
                <p className="text-muted-foreground text-sm">
                  Informasi properti di marketplace konvensional sering tidak lengkap, 
                  menyulitkan pembeli untuk mengambil keputusan yang tepat.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Tidak Ada Standar</h3>
                <p className="text-muted-foreground text-sm">
                  Tidak ada standar verifikasi yang konsisten antar platform, 
                  membuat pembeli harus melakukan due diligence sendiri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Different */}
        <section className="py-16 md:py-24">
          <div className="container-main">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Mengapa MyProperty Berbeda?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-primary">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {team.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold text-primary-foreground mb-2">{stat.count}</p>
                  <p className="text-primary-foreground/90 font-medium">{stat.name}</p>
                  <p className="text-primary-foreground/60 text-sm">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container-main text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Mulai Pengalaman Properti yang Aman
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pengguna yang telah mempercayakan 
              pencarian properti mereka kepada MyProperty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/listings" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                <TrendingUp className="w-5 h-5" />
                Jelajahi Properti
              </a>
              <a href="/register" className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                Daftar Sekarang
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
