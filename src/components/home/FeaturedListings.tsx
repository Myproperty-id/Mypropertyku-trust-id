import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
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
      
      // Only fetch approved and published properties
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, city, province, price, images, bedrooms, bathrooms, building_size, property_type, certificate_type, risk_level")
        .eq("verification_status", "approved")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setProperties(data);
      }
      setLoading(false);
    };

    fetchApprovedProperties();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
            <div>
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-property">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-48 mb-4" />
                  <div className="flex gap-4 pt-4 border-t border-border">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show nothing if no approved properties yet
  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              Properti Terverifikasi
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Properti Unggulan
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Properti pilihan yang telah terverifikasi oleh tim kami dengan status hukum yang jelas.
            </p>
          </div>
          <Link to="/listings">
            <Button variant="outline" className="gap-2">
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
              to={`/property/${property.id}`}
              className="card-property group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.images?.[0] || fallbackImages[index % fallbackImages.length]}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <Badge className="bg-accent text-accent-foreground gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                  <Badge variant="secondary">{property.property_type}</Badge>
                </div>
                {property.certificate_type && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
                      {getCertificateLabel(property.certificate_type)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-2xl font-bold text-primary">
                    Rp {property.price.toLocaleString("id-ID")}
                  </p>
                  {getRiskBadge(property.risk_level)}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{property.city}, {property.province}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bed className="w-4 h-4" />
                      <span>{property.bedrooms} KT</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Bath className="w-4 h-4" />
                      <span>{property.bathrooms} KM</span>
                    </div>
                  )}
                  {property.building_size && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Maximize className="w-4 h-4" />
                      <span>{property.building_size} m²</span>
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