import { Search, FileCheck, ShieldCheck, Key, Upload, ClipboardCheck, Users, Building2, Scale, CheckCircle2, HelpCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const HowItWorks = () => {
  const buyerSteps = [{
    icon: Search,
    title: "Cari Properti",
    description: "Temukan properti impian Anda dengan filter lengkap berdasarkan lokasi, harga, dan tipe sertifikat."
  }, {
    icon: FileCheck,
    title: "Cek Status Verifikasi",
    description: "Lihat status verifikasi properti, termasuk pengecekan sertifikat dan riwayat sengketa."
  }, {
    icon: ShieldCheck,
    title: "Minta Laporan Detail",
    description: "Dapatkan laporan verifikasi lengkap yang mencakup analisis risiko dan legalitas properti."
  }, {
    icon: Key,
    title: "Transaksi Aman",
    description: "Lakukan transaksi dengan percaya diri berkat data yang telah diverifikasi."
  }];
  const sellerSteps = [{
    icon: Upload,
    title: "Daftarkan Properti",
    description: "Unggah informasi properti Anda termasuk foto, deskripsi, dan dokumen legalitas."
  }, {
    icon: ClipboardCheck,
    title: "Proses Verifikasi",
    description: "Tim kami akan memverifikasi dokumen dan melakukan pengecekan legalitas properti."
  }, {
    icon: CheckCircle2,
    title: "Properti Terverifikasi",
    description: "Setelah lolos verifikasi, properti Anda akan mendapat badge terverifikasi."
  }, {
    icon: Users,
    title: "Terima Calon Pembeli",
    description: "Dapatkan leads berkualitas dari pembeli yang tertarik dengan properti Anda."
  }];
  const verificationProcess = [{
    title: "Validasi Dokumen",
    description: "Kami memeriksa keaslian sertifikat dan dokumen legalitas properti."
  }, {
    title: "Pengecekan Sengketa",
    description: "Memastikan properti tidak dalam status sengketa atau masalah hukum."
  }, {
    title: "Verifikasi Kepemilikan",
    description: "Konfirmasi bahwa penjual adalah pemilik sah properti tersebut."
  }, {
    title: "Analisis Risiko",
    description: "Memberikan skor risiko berdasarkan hasil verifikasi menyeluruh."
  }];
  const faqs = [{
    question: "Apa itu Mypropertyku?",
    answer: "Mypropertyku adalah marketplace properti yang mengutamakan keamanan dan transparansi. Kami memverifikasi legalitas setiap properti untuk mengurangi risiko sengketa dan memberikan kepercayaan lebih kepada pembeli dan penjual."
  }, {
    question: "Bagaimana proses verifikasi properti?",
    answer: "Proses verifikasi meliputi: 1) Validasi dokumen sertifikat, 2) Pengecekan status sengketa, 3) Verifikasi kepemilikan, dan 4) Analisis risiko. Seluruh proses biasanya memakan waktu 3-5 hari kerja."
  }, {
    question: "Berapa biaya untuk mendaftarkan properti?",
    answer: "Pendaftaran properti di Mypropertyku gratis. Kami hanya mengenakan biaya untuk layanan verifikasi premium dan laporan detail sesuai paket yang dipilih."
  }, {
    question: "Apa yang dimaksud dengan badge 'Terverifikasi'?",
    answer: "Badge 'Terverifikasi' menandakan bahwa properti telah melewati proses verifikasi legalitas kami. Ini memberikan jaminan tambahan bahwa dokumen properti valid dan tidak ada masalah hukum yang terdeteksi."
  }, {
    question: "Bagaimana cara kerja skor risiko?",
    answer: "Skor risiko dihitung berdasarkan berbagai faktor seperti kelengkapan dokumen, status sengketa, tipe sertifikat, dan riwayat transaksi. Skor 'Rendah' berarti risiko minimal, sedangkan 'Tinggi' memerlukan perhatian khusus."
  }, {
    question: "Apakah Mypropertyku menjamin transaksi?",
    answer: "Mypropertyku menyediakan informasi verifikasi untuk membantu keputusan Anda. Namun, kami menyarankan untuk tetap melakukan due diligence tambahan dan berkonsultasi dengan notaris/PPAT untuk transaksi resmi."
  }, {
    question: "Bagaimana cara menghubungi penjual?",
    answer: "Setelah menemukan properti yang diminati, Anda dapat mengklik tombol 'Hubungi Penjual' untuk mengirim pesan atau melihat informasi kontak. Pastikan Anda sudah login untuk mengakses fitur ini."
  }, {
    question: "Berapa lama proses verifikasi?",
    answer: "Proses verifikasi standar memakan waktu 3-5 hari kerja. Untuk verifikasi express, prosesnya dapat diselesaikan dalam 1-2 hari kerja dengan biaya tambahan."
  }];
  const pricingPlans = [{
    name: "Gratis",
    price: "Rp 0",
    description: "Untuk penjual individu",
    features: ["Listing properti tanpa batas", "Foto hingga 5 gambar", "Verifikasi dasar", "Dukungan email"],
    cta: "Mulai Gratis",
    highlighted: false
  }, {
    name: "Profesional",
    price: "Rp 299.000",
    period: "/bulan",
    description: "Untuk agen properti",
    features: ["Semua fitur Gratis", "Foto hingga 20 gambar", "Verifikasi prioritas", "Badge Agen Terverifikasi", "Laporan analitik", "Dukungan prioritas"],
    cta: "Mulai Sekarang",
    highlighted: true
  }, {
    name: "Enterprise",
    price: "Hubungi Kami",
    description: "Untuk developer & perusahaan",
    features: ["Semua fitur Profesional", "Foto & video tanpa batas", "Verifikasi express", "API akses", "Account manager", "Custom integration"],
    cta: "Hubungi Sales",
    highlighted: false
  }];
  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container-main text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">Cara Kerja Mypropertyku</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Temukan bagaimana Mypropertyku membantu Anda bertransaksi properti dengan lebih aman dan transparan melalui sistem verifikasi terpercaya.</p>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Untuk Pembeli
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Beli Properti dengan Percaya Diri
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Langkah mudah untuk menemukan dan membeli properti yang aman
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerSteps.map((step, index) => <div key={index} className="relative">
                <div className="bg-card rounded-xl border border-border p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                {index < buyerSteps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ChevronRight className="w-6 h-6 text-border" />
                  </div>}
              </div>)}
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Untuk Penjual
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Jual Properti dengan Mudah
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proses sederhana untuk menjual properti Anda ke pembeli yang tepat
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerSteps.map((step, index) => <div key={index} className="relative">
                <div className="bg-card rounded-xl border border-border p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Verification Process */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Proses Verifikasi
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Verifikasi Menyeluruh untuk Keamanan Anda
              </h2>
              <p className="text-muted-foreground mb-8">Setiap properti di Mypropertyku melewati proses verifikasi ketat untuk memastikan legalitas dan mengurangi risiko sengketa.</p>
              
              <div className="space-y-4">
                {verificationProcess.map((item, index) => <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
                  <Scale className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Didukung Oleh</h3>
                  <p className="text-sm text-muted-foreground">Partner Terpercaya</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Building2 className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Notaris Resmi</span>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <FileCheck className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">BPN Terintegrasi</span>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <ShieldCheck className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Audit Trail</span>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Users className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <span className="text-sm text-muted-foreground">Tim Ahli</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Harga
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pilih Paket yang Sesuai
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mulai gratis dan upgrade sesuai kebutuhan bisnis Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => <div key={index} className={`bg-card rounded-2xl border ${plan.highlighted ? 'border-primary shadow-lg scale-105' : 'border-border'} p-6 relative`}>
                {plan.highlighted && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Populer
                    </span>
                  </div>}
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-foreground">{feature}</span>
                    </li>)}
                </ul>
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </div>)}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="container-main max-w-3xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl border border-border px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>
          
          <div className="text-center mt-12 p-8 bg-primary/5 rounded-2xl">
            <HelpCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Masih punya pertanyaan?
            </h3>
            <p className="text-muted-foreground mb-4">
              Tim support kami siap membantu Anda
            </p>
            <Button variant="outline">Hubungi Kami</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default HowItWorks;