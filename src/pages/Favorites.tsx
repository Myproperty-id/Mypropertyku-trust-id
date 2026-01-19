import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Maximize, ShieldCheck, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyCardSkeleton } from '@/components/ui/loading-skeleton';
import { FavoriteButton } from '@/components/property/FavoriteButton';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { supabase } from '@/integrations/supabase/client';

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
  verification_status: string | null;
}

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchFavoriteProperties() {
      if (!favorites.length) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, title, city, province, price, images, bedrooms, bathrooms, building_size, property_type, certificate_type, risk_level, verification_status')
          .in('id', favorites);

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!favoritesLoading) {
      fetchFavoriteProperties();
    }
  }, [favorites, favoritesLoading]);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `Rp ${(price / 1000000000).toFixed(1)} M`;
    }
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(0)} Jt`;
    }
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const getRiskBadge = (risk: string | null) => {
    switch (risk) {
      case 'low':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Risiko Rendah</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Risiko Sedang</Badge>;
      case 'high':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Risiko Tinggi</Badge>;
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="text-red-500 fill-red-500" size={28} />
              Properti Favorit
            </h1>
            <p className="text-muted-foreground mt-1">
              {properties.length} properti tersimpan
            </p>
          </div>
        </div>

        {/* Loading State */}
        {(loading || favoritesLoading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !favoritesLoading && properties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="text-muted-foreground" size={40} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Belum ada properti favorit
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Simpan properti yang Anda minati dengan menekan tombol hati untuk melihatnya di sini.
            </p>
            <Button asChild>
              <Link to="/listings">Jelajahi Properti</Link>
            </Button>
          </div>
        )}

        {/* Properties Grid */}
        {!loading && !favoritesLoading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-border"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.images?.[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3">
                    <FavoriteButton
                      isFavorite={true}
                      onToggle={() => toggleFavorite(property.id)}
                      size="sm"
                    />
                  </div>

                  {/* Verified Badge */}
                  {property.verification_status === 'approved' && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-emerald-500 text-white gap-1">
                        <ShieldCheck size={14} />
                        Terverifikasi
                      </Badge>
                    </div>
                  )}

                  {/* Price */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-lg font-bold text-primary shadow-md">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin size={14} className="mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{property.city}, {property.province}</span>
                  </div>

                  {/* Specs */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    {property.bedrooms && (
                      <span className="flex items-center gap-1">
                        <Bed size={14} />
                        {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath size={14} />
                        {property.bathrooms}
                      </span>
                    )}
                    {property.building_size && (
                      <span className="flex items-center gap-1">
                        <Maximize size={14} />
                        {property.building_size} m²
                      </span>
                    )}
                  </div>

                  {/* Risk Badge */}
                  {getRiskBadge(property.risk_level)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
