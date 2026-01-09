import { Search, MapPin, Home, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>

      {/* Content */}
      <div className="relative container-main py-16 md:py-24">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground backdrop-blur-sm mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground">Platform Properti Terverifikasi #1 di Indonesia</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in">
            Marketplace Properti{" "}
            <span className="text-accent">Aman</span> &{" "}
            <span className="text-accent">Terverifikasi</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl animate-fade-in">
            Cek legalitas, kurangi risiko sengketa, dan transaksi lebih aman. Semua properti diverifikasi oleh tim ahli kami.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-4 md:p-6 shadow-xl animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Lokasi
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari lokasi..."
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Tipe Properti
                </label>
                <Select>
                  <SelectTrigger>
                    <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rumah">Rumah</SelectItem>
                    <SelectItem value="apartemen">Apartemen</SelectItem>
                    <SelectItem value="tanah">Tanah</SelectItem>
                    <SelectItem value="ruko">Ruko</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="md:col-span-1">
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Rentang Harga
                </label>
                <Select>
                  <SelectTrigger>
                    <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Pilih harga" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-500">Di bawah 500 Juta</SelectItem>
                    <SelectItem value="500-1000">500 Juta - 1 Miliar</SelectItem>
                    <SelectItem value="1000-2000">1 - 2 Miliar</SelectItem>
                    <SelectItem value="2000-5000">2 - 5 Miliar</SelectItem>
                    <SelectItem value="5000+">Di atas 5 Miliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <Button className="w-full h-10 gap-2" size="lg">
                  <Search className="w-4 h-4" />
                  Cari Properti
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-8 md:gap-12 animate-fade-in">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground">10,000+</p>
              <p className="text-sm text-primary-foreground/70">Properti Terdaftar</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground">5,000+</p>
              <p className="text-sm text-primary-foreground/70">Terverifikasi</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-foreground">99%</p>
              <p className="text-sm text-primary-foreground/70">Tingkat Kepuasan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
