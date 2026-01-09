import { Link } from "react-router-dom";
import { MapPin, Bed, Bath, Maximize, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

const properties = [
  {
    id: 1,
    title: "Villa Modern dengan Pool di Bali",
    location: "Seminyak, Bali",
    price: "8.500.000.000",
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
    image: property3,
    beds: 5,
    baths: 4,
    area: 600,
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

const FeaturedListings = () => {
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
          {properties.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="card-property group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-2xl font-bold text-primary">
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
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Bed className="w-4 h-4" />
                    <span>{property.beds} KT</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Bath className="w-4 h-4" />
                    <span>{property.baths} KM</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Maximize className="w-4 h-4" />
                    <span>{property.area} m²</span>
                  </div>
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
