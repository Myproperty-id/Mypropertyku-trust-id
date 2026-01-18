import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCardSkeleton } from "@/components/ui/loading-skeleton";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

// Fallback images for properties without images
const fallbackImages = [property1, property2, property3];

interface Property {
  id: string;
  title: string;
  city: string;
  province: string;
  price: number;
  images: string[] | null;
  bedrooms: number | null;
  bathrooms: number | null;
  building_size: number | null;
  property_type: string;
  certificate_type: string | null;
  risk_level: string | null;
}

// Demo properties for display when no real data exists
const DEMO_PROPERTIES: Property[] = [
  {
    id: "demo-1",
    title: "Villa Mewah di SCBD",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    price: 15000000000,
    images: null,
    bedrooms: 5,
    bathrooms: 4,
    building_size: 450,
    property_type: "Villa",
    certificate_type: "shm",
    risk_level: "low",
  },
  {
    id: "demo-2",
    title: "Apartemen Mewah Jakarta Selatan",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    price: 3500000000,
    images: null,
    bedrooms: 3,
    bathrooms: 2,
    building_size: 180,
    property_type: "Apartemen",
    certificate_type: "shgb",
    risk_level: "low",
  },
  {
    id: "demo-3",
    title: "Villa Premium Bali",
    city: "Badung",
    province: "Bali",
    price: 8500000000,
    images: null,
    bedrooms: 4,
    bathrooms: 3,
    building_size: 320,
    property_type: "Villa",
    certificate_type: "shm",
    risk_level: "low",
  },
  {
    id: "demo-4",
    title: "Rumah Modern Jakarta Barat",
    city: "Jakarta Barat",
    province: "DKI Jakarta",
    price: 2800000000,
    images: null,
    bedrooms: 4,
    bathrooms: 3,
    building_size: 200,
    property_type: "Rumah",
    certificate_type: "shm",
    risk_level: "low",
  },
  {
    id: "demo-5",
    title: "Apartemen View Laut Bali",
    city: "Denpasar",
    province: "Bali",
    price: 5200000000,
    images: null,
    bedrooms: 2,
    bathrooms: 2,
    building_size: 120,
    property_type: "Apartemen",
    certificate_type: "shgb",
    risk_level: "low",
  },
  {
    id: "demo-6",
    title: "Rumah Cluster Tangerang",
    city: "Tangerang",
    province: "Banten",
    price: 1850000000,
    images: null,
    bedrooms: 3,
    bathrooms: 2,
    building_size: 150,
    property_type: "Rumah",
    certificate_type: "shm",
    risk_level: "low",
  },
];

const getRiskBadge = (level: string | null) => {
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

const getCertificateLabel = (type: string | null) => {
  const labels: Record<string, string> = {
    shm: "SHM",
    shgb: "SHGB",
    hpl: "HPL",
    girik: "Girik",
    ajb: "AJB",
    ppjb: "PPJB",
  };
  return type ? labels[type] || type.toUpperCase() : "-";
};

const FeaturedListings = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedProperties = async () => {
      setLoading(true);
      
      // Simulate loading delay for demo
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Only fetch approved and published properties
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, city, province, price, images, bedrooms, bathrooms, building_size, property_type, certificate_type, risk_level")
        .eq("verification_status", "approved")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        setProperties(data);
      } else {
        // Use demo properties if no real data
        setProperties(DEMO_PROPERTIES);
      }
      setLoading(false);
    };

    fetchApprovedProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-28 section-gradient">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                <ShieldCheck className="w-4 h-4" />
                Properti Terverifikasi
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
                Properti <span className="text-accent">Unggulan</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Properti pilihan yang telah terverifikasi oleh tim Mypropertyku dengan status hukum yang jelas.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 section-gradient relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="container-main relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              Properti Terverifikasi
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-3">
              Properti <span className="text-accent">Unggulan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Properti pilihan yang telah terverifikasi oleh tim Mypropertyku dengan status hukum yang jelas.
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" className="gap-2 font-semibold" size="lg">
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <Link
              key={property.id}
              to={property.id.startsWith("demo-") ? "#" : `/property/${property.id}`}
              className="card-property group"
              onClick={(e) => {
                if (property.id.startsWith("demo-")) {
                  e.preventDefault();
                }
              }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.images?.[0] || fallbackImages[index % fallbackImages.length]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge className="bg-accent text-accent-foreground gap-1 font-semibold shadow-lg">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                  <Badge variant="secondary" className="font-semibold shadow-lg bg-secondary text-secondary-foreground">{property.property_type}</Badge>
                </div>
                {property.certificate_type && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-card/95 backdrop-blur-sm font-semibold shadow-lg border-border">
                      {getCertificateLabel(property.certificate_type)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-2xl font-extrabold text-primary">
                    Rp {property.price.toLocaleString("id-ID")}
                  </p>
                  {getRiskBadge(property.risk_level)}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-5">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{property.city}, {property.province}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-5 pt-5 border-t border-border">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bed className="w-4 h-4" />
                      <span className="font-medium">{property.bedrooms} KT</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bath className="w-4 h-4" />
                      <span className="font-medium">{property.bathrooms} KM</span>
                    </div>
                  )}
                  {property.building_size && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Maximize className="w-4 h-4" />
                      <span className="font-medium">{property.building_size} m²</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
