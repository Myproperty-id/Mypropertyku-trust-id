import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  FileText,
  User,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Info,
  Building,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const property = {
  id: 1,
  title: "Villa Modern dengan Pool di Bali",
  description: "Villa mewah dengan desain modern kontemporer, dilengkapi kolam renang infinity edge yang menghadap ke sawah. Lokasi strategis di jantung Seminyak, dekat dengan pantai, restoran, dan pusat perbelanjaan. Cocok untuk hunian pribadi atau investasi villa sewa.",
  location: "Seminyak, Bali",
  address: "Jl. Petitenget No. 123, Seminyak, Kec. Kuta Utara, Kabupaten Badung, Bali 80361",
  price: "8.500.000.000",
  pricePerMeter: "18.888.889",
  images: [property1, property2, property3],
  beds: 4,
  baths: 3,
  area: 450,
  landArea: 500,
  floors: 2,
  type: "Villa",
  certificate: "SHM",
  verified: true,
  riskLevel: "low",
  riskScore: 15,
  features: [
    "Kolam Renang",
    "Taman",
    "Garasi 2 Mobil",
    "Smart Home System",
    "Solar Panel",
    "Water Heater",
    "AC Setiap Kamar",
    "Furnished",
  ],
  verificationDetails: {
    certificateStatus: "verified",
    certificateNumber: "SHM No. 12345/Seminyak",
    disputeCheck: "clear",
    lastVerified: "15 Januari 2025",
    verifiedBy: "BPN Kabupaten Badung",
  },
  legalDetails: {
    certificateType: "Sertifikat Hak Milik (SHM)",
    landSize: "500 m²",
    buildingSize: "450 m²",
    zoning: "Perumahan",
    imb: "Tersedia",
    pbb: "Lunas hingga 2025",
  },
  riskAnalysis: {
    score: 15,
    level: "low",
    factors: [
      { name: "Status Sertifikat", status: "safe", detail: "SHM valid dan terdaftar di BPN" },
      { name: "Riwayat Sengketa", status: "safe", detail: "Tidak ada catatan sengketa" },
      { name: "Pajak Bumi & Bangunan", status: "safe", detail: "Lunas hingga 2025" },
      { name: "IMB/PBG", status: "safe", detail: "Izin lengkap dan valid" },
    ],
  },
  seller: {
    name: "PT. Bali Property Prima",
    type: "Agen",
    phone: "+62 812-3456-7890",
    verified: true,
    listings: 45,
    joined: "2020",
  },
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-3 border-b border-border">
          <div className="container-main">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">Beranda</Link>
              <span>/</span>
              <Link to="/listings" className="hover:text-foreground">Cari Properti</Link>
              <span>/</span>
              <span className="text-foreground">{property.title}</span>
            </nav>
          </div>
        </div>

        <div className="container-main py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <img
                    src={property.images[currentImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.verified && (
                      <Badge className="bg-accent text-accent-foreground gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary">{property.type}</Badge>
                    <Badge variant="outline" className="bg-card/90">{property.certificate}</Badge>
                  </div>
                </div>
                {/* Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        idx === currentImage ? "bg-primary-foreground" : "bg-primary-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Property Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="badge-verified">Risiko Rendah</span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{property.type}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.beds} Kamar Tidur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.baths} Kamar Mandi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.area} m² Bangunan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{property.landArea} m² Tanah</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                    Ringkasan
                  </TabsTrigger>
                  <TabsTrigger value="verification" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                    Verifikasi
                  </TabsTrigger>
                  <TabsTrigger value="legal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                    Detail Legal
                  </TabsTrigger>
                  <TabsTrigger value="risk" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                    Analisis Risiko
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Fasilitas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {property.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="verification" className="pt-6">
                  <div className="trust-panel">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Status Terverifikasi</h3>
                        <p className="text-sm text-muted-foreground">Properti ini telah melewati proses verifikasi</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Status Sertifikat</p>
                        <p className="font-medium text-accent flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Terverifikasi
                        </p>
                      </div>
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Nomor Sertifikat</p>
                        <p className="font-medium">{property.verificationDetails.certificateNumber}</p>
                      </div>
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Cek Sengketa</p>
                        <p className="font-medium text-accent flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Bersih
                        </p>
                      </div>
                      <div className="bg-card rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-1">Terakhir Diverifikasi</p>
                        <p className="font-medium">{property.verificationDetails.lastVerified}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4 flex items-start gap-2">
                      <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Verifikasi dilakukan oleh {property.verificationDetails.verifiedBy}. Data dapat berubah, selalu lakukan pengecekan mandiri.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="legal" className="pt-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Detail Legal
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(property.legalDetails).map(([key, value], idx) => (
                        <div key={idx} className="flex justify-between py-3 border-b border-border last:border-0">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="pt-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold">Analisis Risiko</h3>
                        <p className="text-sm text-muted-foreground">Berdasarkan pengecekan data resmi</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-accent">{property.riskAnalysis.score}/100</p>
                        <p className="text-sm text-accent font-medium">Risiko Rendah</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {property.riskAnalysis.factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-accent" />
                            <div>
                              <p className="font-medium">{factor.name}</p>
                              <p className="text-sm text-muted-foreground">{factor.detail}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                            Aman
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <p className="text-sm text-muted-foreground mb-1">Harga</p>
                  <p className="text-3xl font-bold text-primary mb-2">
                    Rp {property.price}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Rp {property.pricePerMeter} / m²
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full gap-2" size="lg">
                      <Phone className="w-4 h-4" />
                      Hubungi Penjual
                    </Button>
                    <Button variant="outline" className="w-full gap-2" size="lg">
                      <MessageCircle className="w-4 h-4" />
                      Chat WhatsApp
                    </Button>
                    <Button variant="secondary" className="w-full gap-2">
                      <FileText className="w-4 h-4" />
                      Minta Laporan Verifikasi
                    </Button>
                  </div>
                </div>

                {/* Seller Card */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Penjual / Agen</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {property.seller.name}
                        {property.seller.verified && (
                          <ShieldCheck className="w-4 h-4 text-accent" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{property.seller.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-t border-border">
                    <span className="text-muted-foreground">Listing Aktif</span>
                    <span className="font-medium">{property.seller.listings} Properti</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-t border-border">
                    <span className="text-muted-foreground">Bergabung Sejak</span>
                    <span className="font-medium">{property.seller.joined}</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-muted/50 rounded-xl p-4 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      MyProperty tidak menjamin kepemilikan atau legalitas properti. Informasi disediakan berdasarkan data yang tersedia. Selalu lakukan verifikasi mandiri sebelum transaksi.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
