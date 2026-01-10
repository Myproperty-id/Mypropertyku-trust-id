import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Bed, Bath, Maximize, ShieldCheck, SlidersHorizontal,
  Grid3X3, List, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CardSkeleton } from "@/components/ui/loading-skeleton";
import { NoPropertiesEmpty } from "@/components/ui/empty-state";
import property1 from "@/assets/property-1.jpg";

interface Property {
  id: string;
  title: string;
  city: string;
  province: string;
  price: number;
  property_type: string;
  certificate_type: string | null;
  verification_status: string;
  risk_level: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  land_size: number | null;
  building_size: number | null;
  images: string[] | null;
  created_at: string;
}

interface Filters {
  location: string;
  propertyTypes: string[];
  minPrice: string;
  maxPrice: string;
  certificates: string[];
  verified: boolean;
  riskLevels: string[];
}

const propertyTypeOptions = ["Rumah", "Apartemen", "Tanah", "Ruko", "Villa", "Gudang", "Kantor"];
const certificateOptions = ["shm", "shgb", "hpl", "girik", "ajb", "ppjb"];
const provinceOptions = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "Bali"];

const getRiskBadge = (level: string | null) => {
  switch (level) {
    case "low": return <span className="badge-verified">Risiko Rendah</span>;
    case "medium": return <span className="badge-warning">Risiko Sedang</span>;
    case "high": return <span className="badge-danger">Risiko Tinggi</span>;
    default: return null;
  }
};

const getCertLabel = (type: string | null) => {
  const labels: Record<string, string> = { shm: "SHM", shgb: "SHGB", hpl: "HPL", girik: "Girik", ajb: "AJB", ppjb: "PPJB" };
  return type ? labels[type] || type.toUpperCase() : null;
};

const FilterSidebar = ({ filters, setFilters, onClear }: { 
  filters: Filters; 
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClear: () => void;
}) => {
  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" /> Filter
        </h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <X className="w-4 h-4 mr-1" /> Reset
        </Button>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Lokasi</h4>
        <Select value={filters.location} onValueChange={(v) => setFilters(f => ({ ...f, location: v }))}>
          <SelectTrigger><SelectValue placeholder="Pilih provinsi" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Lokasi</SelectItem>
            {provinceOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Tipe Properti</h4>
        <div className="space-y-2">
          {propertyTypeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => setFilters(f => ({ ...f, propertyTypes: toggleArray(f.propertyTypes, type) }))}
              />
              <span className="text-sm text-muted-foreground">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Rentang Harga</h4>
        <div className="space-y-2">
          <Input 
            placeholder="Min (Rp)" 
            type="number" 
            value={filters.minPrice}
            onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value }))}
          />
          <Input 
            placeholder="Max (Rp)" 
            type="number"
            value={filters.maxPrice}
            onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-foreground mb-3">Sertifikat</h4>
        <div className="space-y-2">
          {certificateOptions.map(cert => (
            <label key={cert} className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={filters.certificates.includes(cert)}
                onCheckedChange={() => setFilters(f => ({ ...f, certificates: toggleArray(f.certificates, cert) }))}
              />
              <span className="text-sm text-muted-foreground">{getCertLabel(cert)}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox 
            checked={filters.verified}
            onCheckedChange={(c) => setFilters(f => ({ ...f, verified: !!c }))}
          />
          <span className="text-sm font-medium text-accent">Hanya Terverifikasi</span>
        </label>
      </div>
    </div>
  );
};

const Listings = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("verified");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    location: "all", propertyTypes: [], minPrice: "", maxPrice: "",
    certificates: [], verified: false, riskLevels: [],
  });

  const clearFilters = () => setFilters({
    location: "all", propertyTypes: [], minPrice: "", maxPrice: "",
    certificates: [], verified: false, riskLevels: [],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("is_published", true)
        .eq("verification_status", "approved")
        .order("created_at", { ascending: false });
      setProperties(data || []);
      setLoading(false);
    };
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (filters.location && filters.location !== "all") {
      result = result.filter(p => p.province === filters.location);
    }
    if (filters.propertyTypes.length > 0) {
      result = result.filter(p => filters.propertyTypes.includes(p.property_type));
    }
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseInt(filters.maxPrice));
    }
    if (filters.certificates.length > 0) {
      result = result.filter(p => p.certificate_type && filters.certificates.includes(p.certificate_type));
    }
    if (filters.verified) {
      result = result.filter(p => p.verification_status === "approved");
    }

    // Sorting
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case "verified": 
        result.sort((a, b) => {
          if (a.verification_status === "approved" && b.verification_status !== "approved") return -1;
          if (b.verification_status === "approved" && a.verification_status !== "approved") return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
    }

    return result;
  }, [properties, filters, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="bg-primary py-12">
          <div className="container-main">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Cari Properti</h1>
            <p className="text-primary-foreground/70">Temukan properti terverifikasi sesuai kebutuhan Anda</p>
          </div>
        </div>

        <div className="container-main py-8 md:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                <FilterSidebar filters={filters} setFilters={setFilters} onClear={clearFilters} />
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-muted-foreground">
                  Menampilkan <span className="font-medium text-foreground">{filteredProperties.length}</span> properti
                </p>
                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden gap-2">
                        <SlidersHorizontal className="w-4 h-4" /> Filter
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader><SheetTitle>Filter Properti</SheetTitle></SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar filters={filters} setFilters={setFilters} onClear={clearFilters} />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44"><SelectValue placeholder="Urutkan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Terverifikasi Dulu</SelectItem>
                      <SelectItem value="newest">Terbaru</SelectItem>
                      <SelectItem value="price-low">Harga Terendah</SelectItem>
                      <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}>
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
                </div>
              ) : filteredProperties.length === 0 ? (
                <NoPropertiesEmpty />
              ) : (
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {filteredProperties.map((property) => (
                    <Link key={property.id} to={`/property/${property.id}`} className={`card-property group ${viewMode === "list" ? "flex" : ""}`}>
                      <div className={`relative overflow-hidden ${viewMode === "list" ? "w-64 flex-shrink-0" : "aspect-[4/3]"}`}>
                        <img src={property.images?.[0] || property1} alt={property.title}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${viewMode === "list" ? "h-48" : ""}`} />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {property.verification_status === "approved" && (
                            <Badge className="bg-accent text-accent-foreground gap-1"><ShieldCheck className="w-3 h-3" />Verified</Badge>
                          )}
                          <Badge variant="secondary">{property.property_type}</Badge>
                        </div>
                        {property.certificate_type && (
                          <div className="absolute top-3 right-3">
                            <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">{getCertLabel(property.certificate_type)}</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xl font-bold text-primary">Rp {property.price.toLocaleString("id-ID")}</p>
                          {getRiskBadge(property.risk_level)}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                          <MapPin className="w-4 h-4" /><span className="text-sm">{property.city}, {property.province}</span>
                        </div>
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          {property.bedrooms && property.bedrooms > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Bed className="w-4 h-4" /><span>{property.bedrooms} KT</span></div>
                          )}
                          {property.bathrooms && property.bathrooms > 0 && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Bath className="w-4 h-4" /><span>{property.bathrooms} KM</span></div>
                          )}
                          {(property.land_size || property.building_size) && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Maximize className="w-4 h-4" /><span>{property.building_size || property.land_size} m²</span></div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Listings;