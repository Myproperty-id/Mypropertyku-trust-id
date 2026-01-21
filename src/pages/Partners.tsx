import { useState } from "react";
import { motion } from "framer-motion";
import { 
  HardHat, 
  Landmark, 
  FileCheck, 
  Building2, 
  Globe, 
  Instagram, 
  Send,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Wrench,
  PenTool,
  FileText,
  Building
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import tukangProfesionalLogo from "@/assets/partners/tukangprofesional-logo.jpeg";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  category: string;
}

const Partners = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    category: "konstruksi"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent, category: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Pesan berhasil dikirim! Partner kami akan segera menghubungi Anda.");
    setFormData({ name: "", email: "", phone: "", message: "", category });
    setIsSubmitting(false);
  };

  const partnerCategories = [
    {
      id: "konstruksi",
      name: "Jasa Konstruksi",
      icon: HardHat,
      colorClass: "bg-primary text-primary-foreground",
      description: "Partner konstruksi terpercaya untuk pembangunan dan renovasi properti"
    },
    {
      id: "bank",
      name: "Bank",
      icon: Landmark,
      colorClass: "bg-secondary text-secondary-foreground",
      description: "Solusi pembiayaan properti dari bank-bank terpercaya"
    },
    {
      id: "notaris",
      name: "Notaris",
      icon: FileCheck,
      colorClass: "bg-accent text-accent-foreground",
      description: "Layanan notaris untuk legalitas dan dokumen properti"
    },
    {
      id: "bpn",
      name: "BPN",
      icon: Building2,
      colorClass: "bg-muted text-muted-foreground",
      description: "Informasi dan layanan terkait Badan Pertanahan Nasional"
    }
  ];

  const tukangProfesionalServices = [
    { icon: PenTool, name: "Jasa Arsitek", desc: "Desain arsitektur profesional" },
    { icon: Building, name: "Pembangunan", desc: "Konstruksi bangunan lengkap" },
    { icon: Wrench, name: "Kontraktor", desc: "Layanan kontraktor berpengalaman" },
    { icon: FileText, name: "Perizinan Bangunan", desc: "Pengurusan IMB dan perizinan" }
  ];

  const ContactForm = ({ category }: { category: string }) => (
    <form onSubmit={(e) => handleSubmit(e, category)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nama Lengkap</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Masukkan nama lengkap"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Nomor Telepon</label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+62 812 xxxx xxxx"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Pesan</label>
        <Textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Jelaskan kebutuhan Anda..."
          rows={4}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );

  const ComingSoonCard = ({ category }: { category: typeof partnerCategories[0] }) => (
    <div className="text-center py-12">
      <div className={`${category.colorClass} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6`}>
        <category.icon className="h-10 w-10 text-white" />
      </div>
      <Badge variant="secondary" className="mb-4">Segera Hadir</Badge>
      <h3 className="text-xl font-semibold text-foreground mb-2">Partner {category.name}</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        Kami sedang menjalin kerjasama dengan partner {category.name.toLowerCase()} terpercaya. 
        Daftar untuk mendapat notifikasi ketika partner tersedia.
      </p>
      <ContactForm category={category.id} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4">Partner Ekosistem</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Partner Terpercaya Kami
            </h1>
            <p className="text-lg text-muted-foreground">
              Ekosistem lengkap untuk semua kebutuhan properti Anda - dari konstruksi, 
              pembiayaan, legalitas, hingga sertifikasi tanah.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner Categories Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="konstruksi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8 h-auto gap-2 bg-transparent">
              {partnerCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-2 py-4 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg border border-border"
                >
                  <category.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Konstruksi Tab - Tukang Profesional */}
            <TabsContent value="konstruksi">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Partner Profile */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={tukangProfesionalLogo}
                        alt="Tukang Profesional"
                        className="w-24 h-24 rounded-xl object-cover bg-white p-1"
                      />
                      <div className="text-white">
                        <h2 className="text-2xl font-bold">Tukang Profesional</h2>
                        <p className="opacity-90">Partner Konstruksi Resmi</p>
                        <Badge className="mt-2 bg-white/20 hover:bg-white/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified Partner
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Tentang Kami</h3>
                        <p className="text-muted-foreground text-sm">
                          Tukang Profesional adalah partner konstruksi terintegrasi yang menyediakan 
                          layanan lengkap mulai dari desain arsitektur, pembangunan, hingga perizinan. 
                          Kami berkomitmen memberikan solusi konstruksi yang berkualitas, tepat waktu, 
                          dan sesuai budget.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Layanan Kami</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {tukangProfesionalServices.map((service, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                              <service.icon className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium text-sm text-foreground">{service.name}</p>
                                <p className="text-xs text-muted-foreground">{service.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Kontak & Media Sosial</h3>
                        <div className="space-y-2">
                          <a
                            href="https://www.tukangprofesional.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            www.tukangprofesional.id
                          </a>
                          <a
                            href="https://www.instagram.com/tukangprofesional.id"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Instagram className="h-4 w-4" />
                            @tukangprofesional.id
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button asChild className="flex-1">
                          <a href="https://www.tukangprofesional.id" target="_blank" rel="noopener noreferrer">
                            <Globe className="h-4 w-4 mr-2" />
                            Kunjungi Website
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="flex-1">
                          <a href="https://www.instagram.com/tukangprofesional.id" target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4 mr-2" />
                            Instagram
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      Hubungi Tukang Profesional
                    </CardTitle>
                    <CardDescription>
                      Konsultasikan kebutuhan konstruksi Anda dengan tim kami
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ContactForm category="konstruksi" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bank Tab */}
            <TabsContent value="bank">
              <Card>
                <CardContent className="p-8">
                  <ComingSoonCard category={partnerCategories[1]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notaris Tab */}
            <TabsContent value="notaris">
              <Card>
                <CardContent className="p-8">
                  <ComingSoonCard category={partnerCategories[2]} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* BPN Tab */}
            <TabsContent value="bpn">
              <Card>
                <CardContent className="p-8">
                  <ComingSoonCard category={partnerCategories[3]} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ingin Menjadi Partner?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Bergabunglah dengan ekosistem MyProperty dan jangkau lebih banyak pelanggan. 
            Kami mencari partner Bank, Notaris, dan BPN untuk melengkapi layanan kami.
          </p>
          <Button size="lg" asChild>
            <a href="/contact">
              Hubungi Kami
              <Send className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partners;
