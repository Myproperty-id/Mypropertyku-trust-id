import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const allProperties = [
  {
    id: 1,
    title: "Villa Modern dengan Pool di Bali",
    location: "Seminyak, Bali",
    price: "8.500.000.000",
    priceNum: 8500000000,
    image: property1,
    beds: 4,
    baths: 3,
    area: 450,
    type: "Villa",
    certificate: "SHM",
    verified: true,
    riskLevel: "low",
  },
  {
    id: 2,
    title: "Apartemen Mewah di Sudirman",
    location: "SCBD, Jakarta Selatan",
    price: "5.200.000.000",
    priceNum: 5200000000,
    image: property2,
    beds: 3,
    baths: 2,
    area: 180,
    type: "Apartemen",
    certificate: "SHGB",
    verified: true,
    riskLevel: "low",
  },
  {
    id: 3,
    title: "Rumah Kolonial Heritage di Bandung",
    location: "Dago, Bandung",
    price: "12.000.000.000",
    priceNum: 12000000000,
    image: property3,
    beds: 5,
    baths: 4,
    area: 600,
    type: "Rumah",
    certificate: "SHM",
    verified: true,
    riskLevel: "low",
  },
  {
    id: 4,
    title: "Tanah Strategis di BSD City",
    location: "BSD, Tangerang Selatan",
    price: "3.500.000.000",
    priceNum: 3500000000,
    image: property1,
    beds: 0,
    baths: 0,
    area: 1000,
    type: "Tanah",
    certificate: "SHM",
    verified: true,
    riskLevel: "low",
  },
  {
    id: 5,
    title: "Ruko 3 Lantai di PIK",
    location: "Pantai Indah Kapuk, Jakarta Utara",
    price: "15.000.000.000",
    priceNum: 15000000000,
    image: property2,
    beds: 0,
    baths: 2,
    area: 300,
    type: "Ruko",
    certificate: "SHGB",
    verified: false,
    riskLevel: "medium",
  },
  {
    id: 6,
    title: "Rumah Minimalis di Alam Sutera",
    location: "Alam Sutera, Tangerang",
    price: "4.800.000.000",
    priceNum: 4800000000,
    image: property3,
    beds: 4,
    baths: 3,
    area: 250,
    type: "Rumah",
    certificate: "SHM",
    verified: true,
    riskLevel: "low",
  },
];

const getRiskBadge = (level: string) => {
  switch (level) {
    case "low":
      return <span className="badge-verified">Risiko Rendah</span>;
    case "medium":
      return <span className="badge-warning">Risiko Sedang</span>;
    case "high":
      return <span className="badge-danger">Risiko Tinggi</span>;
    default:
      return null;
  }
};

const FilterSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Lokasi</h4>
        <Input placeholder="Cari lokasi..." />
      </div>

      {/* Property Type */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Tipe Properti</h4>
        <div className="space-y-2">
          {["Rumah", "Apartemen", "Tanah", "Ruko", "Villa"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox />
              <span className="text-sm text-muted-foreground">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Rentang Harga</h4>
        <div className="space-y-2">
          <Input placeholder="Min (Rp)" type="number" />
          <Input placeholder="Max (Rp)" type="number" />
        </div>
      </div>

      {/* Certificate Type */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Jenis Sertifikat</h4>
        <div className="space-y-2">
          {["SHM", "SHGB", "Girik", "AJB"].map((cert) => (
            <label key={cert} className="flex items-center gap-2 cursor-pointer">
              <Checkbox />
              <span className="text-sm text-muted-foreground">{cert}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Verification Status */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Status Verifikasi</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-muted-foreground">Terverifikasi</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-muted-foreground">Belum Terverifikasi</span>
          </label>
        </div>
      </div>

      {/* Risk Level */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Tingkat Risiko</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-accent">Risiko Rendah</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-warning">Risiko Sedang</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox />
            <span className="text-sm text-danger">Risiko Tinggi</span>
          </label>
        </div>
      </div>

      <Button className="w-full">Terapkan Filter</Button>
    </div>
  );
};

const Listings = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-primary py-12">
          <div className="container-main">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              Cari Properti
            </h1>
            <p className="text-primary-foreground/70">
              Temukan properti terverifikasi sesuai kebutuhan Anda
            </p>
          </div>
        </div>

        <div className="container-main py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filter
                </h3>
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-muted-foreground">
                  Menampilkan <span className="font-medium text-foreground">{allProperties.length}</span> properti
                </p>
                <div className="flex items-center gap-3">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filter Properti</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Urutkan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="verified">Terverifikasi Dulu</SelectItem>
                      <SelectItem value="price-low">Harga Terendah</SelectItem>
                      <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode */}
                  <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties Grid */}
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {allProperties.map((property) => (
                  <Link
                    key={property.id}
                    to={`/property/${property.id}`}
                    className={`card-property group ${viewMode === "list" ? "flex" : ""}`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-[4/3]"}`}>
                      <img
                        src={property.image}
                        alt={property.title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${viewMode === "list" ? "h-48" : ""}`}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        {property.verified && (
                          <Badge className="bg-accent text-accent-foreground gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="secondary">{property.type}</Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
                          {property.certificate}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xl font-bold text-primary">
                          Rp {property.price}
                        </p>
                        {getRiskBadge(property.riskLevel)}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      {/* Features */}
                      <div className="flex items-center gap-4 pt-4 border-t border-border">
                        {property.beds > 0 && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Bed className="w-4 h-4" />
                            <span>{property.beds} KT</span>
                          </div>
                        )}
                        {property.baths > 0 && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Bath className="w-4 h-4" />
                            <span>{property.baths} KM</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Maximize className="w-4 h-4" />
                          <span>{property.area} m²</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex items-center justify-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Sebelumnya
                </Button>
                <Button variant="default" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Selanjutnya
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Listings;
