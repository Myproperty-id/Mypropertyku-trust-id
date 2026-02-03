import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  FileCheck, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle,
  Building2,
  FileText,
  Scale,
  ArrowRight,
  Loader2,
  Info,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

// Certificate types with descriptions
const CERTIFICATE_TYPES = [
  {
    code: "shm",
    name: "SHM (Sertifikat Hak Milik)",
    description: "Hak kepemilikan tertinggi atas tanah. Dapat dimiliki selamanya dan diwariskan.",
    riskLevel: "low",
    icon: Shield,
  },
  {
    code: "shgb",
    name: "SHGB (Sertifikat Hak Guna Bangunan)",
    description: "Hak untuk mendirikan bangunan di atas tanah negara/orang lain. Berlaku 20-30 tahun, dapat diperpanjang.",
    riskLevel: "medium",
    icon: Building2,
  },
  {
    code: "hpl",
    name: "HPL (Hak Pengelolaan Lahan)",
    description: "Hak untuk mengelola tanah negara. Biasanya diberikan kepada instansi pemerintah atau BUMN.",
    riskLevel: "medium",
    icon: FileText,
  },
  {
    code: "girik",
    name: "Girik / Letter C",
    description: "Bukti pembayaran pajak tanah. Bukan bukti kepemilikan resmi, perlu ditingkatkan ke SHM.",
    riskLevel: "high",
    icon: AlertTriangle,
  },
  {
    code: "ajb",
    name: "AJB (Akta Jual Beli)",
    description: "Bukti transaksi jual beli di hadapan PPAT. Perlu didaftarkan ke BPN untuk mendapat sertifikat.",
    riskLevel: "medium",
    icon: FileCheck,
  },
  {
    code: "ppjb",
    name: "PPJB (Perjanjian Pengikatan Jual Beli)",
    description: "Perjanjian awal sebelum AJB. Biasa digunakan untuk properti yang belum selesai dibangun.",
    riskLevel: "high",
    icon: HelpCircle,
  },
];

// Common legal issues
const LEGAL_ISSUES = [
  {
    title: "Sengketa Waris",
    description: "Konflik kepemilikan antar ahli waris yang belum diselesaikan secara hukum.",
    solution: "Pastikan ada Surat Keterangan Waris yang sah dan semua ahli waris menyetujui penjualan.",
  },
  {
    title: "Tanah Sengketa",
    description: "Tanah dalam proses sengketa di pengadilan atau BPN.",
    solution: "Cek status tanah di BPN dan pastikan tidak ada catatan sengketa aktif.",
  },
  {
    title: "Sertifikat Ganda",
    description: "Satu bidang tanah memiliki lebih dari satu sertifikat.",
    solution: "Lakukan pengecekan di BPN untuk memastikan keaslian sertifikat.",
  },
  {
    title: "Tanah Sitaan/Jaminan",
    description: "Tanah sedang dijadikan jaminan bank atau dalam status sitaan.",
    solution: "Minta Surat Keterangan Bebas Sitaan dari pengadilan dan roya dari bank.",
  },
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "Bagaimana cara mengecek keaslian sertifikat tanah?",
    answer: "Anda dapat mengecek keaslian sertifikat melalui: 1) Kantor BPN setempat dengan membawa sertifikat asli, 2) Aplikasi Sentuh Tanahku dari ATR/BPN, atau 3) Melalui notaris/PPAT yang akan melakukan pengecekan sebelum transaksi.",
  },
  {
    question: "Apa bedanya SHM dan SHGB?",
    answer: "SHM (Sertifikat Hak Milik) adalah hak kepemilikan tertinggi yang berlaku selamanya dan dapat diwariskan. SHGB (Sertifikat Hak Guna Bangunan) adalah hak untuk membangun di atas tanah dengan jangka waktu tertentu (20-30 tahun) yang perlu diperpanjang. SHM lebih aman untuk investasi jangka panjang.",
  },
  {
    question: "Apakah Girik bisa dijadikan bukti kepemilikan?",
    answer: "Girik (Letter C) sebenarnya bukan bukti kepemilikan resmi, melainkan bukti pembayaran pajak. Namun, Girik dapat ditingkatkan menjadi SHM melalui proses pendaftaran di BPN. Untuk keamanan transaksi, sangat disarankan untuk mengurus peningkatan ke SHM terlebih dahulu.",
  },
  {
    question: "Berapa biaya pengecekan sertifikat di BPN?",
    answer: "Biaya pengecekan sertifikat di BPN bervariasi tergantung daerah, umumnya sekitar Rp 50.000 - Rp 100.000. Jika melalui notaris, biaya tambahan untuk jasa notaris sekitar Rp 500.000 - Rp 1.500.000 tergantung kompleksitas.",
  },
  {
    question: "Apa yang harus diperiksa sebelum membeli properti?",
    answer: "Checklist penting: 1) Keaslian sertifikat di BPN, 2) Status tanah (tidak dalam sengketa/sitaan), 3) Kesesuaian data pemilik dengan KTP, 4) IMB/PBG jika ada bangunan, 5) Bukti bayar PBB tahun terakhir, 6) Riwayat kepemilikan, 7) Batas-batas tanah sesuai sertifikat.",
  },
];

const LegalCheck = () => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificateType, setCertificateType] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<null | { status: string; message: string }>(null);

  const handleCheck = async () => {
    if (!certificateNumber.trim()) {
      toast.error("Masukkan nomor sertifikat terlebih dahulu");
      return;
    }
    if (!certificateType) {
      toast.error("Pilih jenis sertifikat terlebih dahulu");
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    // Simulate checking (MVP - no real backend yet)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For MVP, show educational result
    setCheckResult({
      status: "info",
      message: "Fitur pengecekan otomatis sedang dalam pengembangan. Untuk pengecekan resmi, silakan hubungi kantor BPN atau notaris terpercaya.",
    });
    
    setIsChecking(false);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "low":
        return <Badge className="bg-accent text-accent-foreground">Risiko Rendah</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Risiko Sedang</Badge>;
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">Risiko Tinggi</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
          </div>
          
          <div className="container-main relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-6">
                <Shield className="w-4 h-4" />
                Cek Legalitas Properti
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-6 leading-tight">
                Pastikan Properti Anda{" "}
                <span className="text-accent">Aman & Legal</span>
              </h1>
              
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Cek status legalitas properti sebelum bertransaksi. Pahami jenis sertifikat, identifikasi potensi risiko, dan lindungi investasi Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Certificate Check Form */}
        <section className="py-12 md:py-16 -mt-8 relative z-10">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="max-w-2xl mx-auto shadow-xl border-border">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl md:text-2xl">Form Pengecekan Sertifikat</CardTitle>
                  <CardDescription>
                    Masukkan informasi sertifikat untuk mendapatkan informasi legalitas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cert-type">Jenis Sertifikat</Label>
                      <Select value={certificateType} onValueChange={setCertificateType}>
                        <SelectTrigger id="cert-type">
                          <SelectValue placeholder="Pilih jenis sertifikat" />
                        </SelectTrigger>
                        <SelectContent>
                          {CERTIFICATE_TYPES.map((cert) => (
                            <SelectItem key={cert.code} value={cert.code}>
                              {cert.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cert-number">Nomor Sertifikat</Label>
                      <Input
                        id="cert-number"
                        placeholder="Contoh: 12345/Kebayoran"
                        value={certificateNumber}
                        onChange={(e) => setCertificateNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handleCheck}
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sedang Memeriksa...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Cek Legalitas
                      </>
                    )}
                  </Button>

                  {/* Check Result */}
                  {checkResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-muted border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-foreground font-medium mb-2">{checkResult.message}</p>
                          <div className="flex flex-wrap gap-2">
                            <Link to="/partners">
                              <Button variant="outline" size="sm" className="gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Hubungi Notaris Mitra
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    ⚠️ Hasil pengecekan bersifat informatif. Untuk validasi resmi, gunakan layanan BPN atau notaris.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Certificate Types Education */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <FileText className="w-4 h-4" />
                Edukasi Legal
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Jenis-Jenis Sertifikat Tanah
              </h2>
              <p className="text-muted-foreground">
                Pahami perbedaan setiap jenis sertifikat dan tingkat keamanannya untuk investasi properti Anda.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CERTIFICATE_TYPES.map((cert, index) => (
                <motion.div
                  key={cert.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          cert.riskLevel === "low" ? "bg-accent/10" :
                          cert.riskLevel === "medium" ? "bg-warning/10" :
                          "bg-destructive/10"
                        }`}>
                          <cert.icon className={`w-6 h-6 ${
                            cert.riskLevel === "low" ? "text-accent" :
                            cert.riskLevel === "medium" ? "text-warning" :
                            "text-destructive"
                          }`} />
                        </div>
                        {getRiskBadge(cert.riskLevel)}
                      </div>
                      <CardTitle className="text-lg mt-3">{cert.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cert.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Legal Issues */}
        <section className="py-12 md:py-20">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-semibold mb-4">
                <AlertTriangle className="w-4 h-4" />
                Waspadai Risiko
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Masalah Hukum yang Sering Terjadi
              </h2>
              <p className="text-muted-foreground">
                Kenali potensi masalah hukum dalam transaksi properti dan cara menghindarinya.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {LEGAL_ISSUES.map((issue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-l-4 border-l-warning">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        {issue.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {issue.description}
                      </p>
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold text-accent">✓ Solusi:</span>{" "}
                          {issue.solution}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <HelpCircle className="w-4 h-4" />
                FAQ
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="container-main">
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                      Butuh Bantuan Profesional?
                    </h3>
                    <p className="text-primary-foreground/80 mb-6">
                      Hubungi mitra notaris dan BPN kami untuk konsultasi legal properti yang lebih mendalam.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link to="/partners">
                        <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                          <Scale className="w-5 h-5" />
                          Lihat Mitra Legal
                        </Button>
                      </Link>
                      <Link to="/contact">
                        <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                          Hubungi Kami
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="relative">
                      <div className="w-48 h-48 rounded-3xl bg-primary-foreground/10 flex items-center justify-center">
                        <Scale className="w-20 h-20 text-primary-foreground/70" strokeWidth={1} />
                      </div>
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-6 h-6 text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 border-t border-border">
          <div className="container-main">
            <div className="text-center max-w-3xl mx-auto">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold">⚠️ Disclaimer:</span> Informasi yang disediakan di halaman ini bersifat edukatif dan tidak merupakan nasihat hukum. Untuk keputusan legal terkait properti, selalu konsultasikan dengan notaris, PPAT, atau pengacara yang terdaftar. Mypropertyku tidak bertanggung jawab atas keputusan yang diambil berdasarkan informasi di halaman ini.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalCheck;
