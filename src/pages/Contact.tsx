import { useState } from "react";
import { 
  Mail, Phone, MapPin, Clock, Send, MessageSquare,
  Facebook, Instagram, Twitter, Linkedin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Pesan Terkirim",
      description: "Terima kasih! Tim kami akan merespons dalam 1-2 hari kerja.",
    });
    
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setSubmitting(false);
  };

  const contacts = [
    {
      icon: Mail,
      title: "Email",
      value: "support@mypropertyku.id",
      desc: "Respons dalam 24 jam",
    },
    {
      icon: Phone,
      title: "Telepon",
      value: "(021) 1234-5678",
      desc: "Senin - Jumat, 09:00 - 18:00",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      value: "+62 812-3456-7890",
      desc: "Chat langsung dengan tim kami",
    },
    {
      icon: MapPin,
      title: "Alamat",
      value: "Jakarta Selatan",
      desc: "Gedung Mypropertyku, Jl. Sudirman",
    },
  ];

  const socials = [
    { icon: Facebook, name: "Facebook", url: "#" },
    { icon: Instagram, name: "Instagram", url: "#" },
    { icon: Twitter, name: "Twitter", url: "#" },
    { icon: Linkedin, name: "LinkedIn", url: "#" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary py-16">
          <div className="container-main text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Hubungi Kami
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Ada pertanyaan? Tim kami siap membantu Anda
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24">
          <div className="container-main">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Informasi Kontak
                </h2>
                
                <div className="space-y-6">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <contact.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{contact.title}</h3>
                        <p className="text-foreground">{contact.value}</p>
                        <p className="text-sm text-muted-foreground">{contact.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Office Hours */}
                <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Jam Operasional</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Senin - Jumat</span>
                      <span className="text-foreground">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sabtu</span>
                      <span className="text-foreground">09:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minggu & Libur</span>
                      <span className="text-foreground">Tutup</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8">
                  <h3 className="font-semibold text-foreground mb-4">Ikuti Kami</h3>
                  <div className="flex gap-3">
                    {socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label={social.name}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-card rounded-2xl border border-border p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Kirim Pesan
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Isi formulir di bawah dan tim kami akan menghubungi Anda segera.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="mt-1.5"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="mt-1.5"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="mt-1.5"
                          placeholder="+62 812-3456-7890"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">Subjek *</Label>
                        <Select 
                          value={formData.subject} 
                          onValueChange={(v) => setFormData({ ...formData, subject: v })}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Pilih subjek" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Pertanyaan Umum</SelectItem>
                            <SelectItem value="listing">Bantuan Listing</SelectItem>
                            <SelectItem value="verification">Verifikasi Properti</SelectItem>
                            <SelectItem value="payment">Pembayaran & Langganan</SelectItem>
                            <SelectItem value="technical">Masalah Teknis</SelectItem>
                            <SelectItem value="partnership">Kerjasama & Partnership</SelectItem>
                            <SelectItem value="other">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Pesan *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="mt-1.5 min-h-[150px]"
                        placeholder="Tuliskan pesan Anda di sini..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting || !formData.subject}
                      className="w-full md:w-auto gap-2"
                    >
                      {submitting ? "Mengirim..." : "Kirim Pesan"}
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Quick Link */}
        <section className="py-12 bg-muted/30">
          <div className="container-main text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Butuh Jawaban Cepat?
            </h3>
            <p className="text-muted-foreground mb-4">
              Lihat halaman Cara Kerja kami untuk FAQ dan panduan lengkap.
            </p>
            <Button variant="outline" asChild>
              <a href="/how-it-works">Lihat FAQ</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
