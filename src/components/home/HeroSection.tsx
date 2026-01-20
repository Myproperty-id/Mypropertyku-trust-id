import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, TrendingUp, Shield, CheckCircle, Building2, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCountUp } from "@/hooks/useCountUp";
import logo from "@/assets/myproperty-logo.png";

// Indonesian locations for the dropdown
const INDONESIAN_LOCATIONS = [{
  value: "jakarta-selatan",
  label: "Jakarta Selatan"
}, {
  value: "jakarta-barat",
  label: "Jakarta Barat"
}, {
  value: "jakarta-pusat",
  label: "Jakarta Pusat"
}, {
  value: "jakarta-timur",
  label: "Jakarta Timur"
}, {
  value: "jakarta-utara",
  label: "Jakarta Utara"
}, {
  value: "bandung",
  label: "Bandung"
}, {
  value: "surabaya",
  label: "Surabaya"
}, {
  value: "bali",
  label: "Bali"
}, {
  value: "yogyakarta",
  label: "Yogyakarta"
}, {
  value: "malang",
  label: "Malang"
}, {
  value: "tangerang",
  label: "Tangerang"
}, {
  value: "bekasi",
  label: "Bekasi"
}, {
  value: "karawang",
  label: "Karawang"
}, {
  value: "bogor",
  label: "Bogor"
}, {
  value: "semarang",
  label: "Semarang"
}];
const HeroSection = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const stats = {
    properties: useCountUp({
      end: 10000,
      suffix: "+"
    }),
    verified: useCountUp({
      end: 5000,
      suffix: "+"
    }),
    satisfaction: useCountUp({
      end: 99,
      suffix: "%"
    })
  };
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType) params.set("type", propertyType);
    if (priceRange) params.set("price", priceRange);
    navigate(`/listings?${params.toString()}`);
  };
  return <section className="relative min-h-[700px] md:min-h-[800px] flex items-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 hero-gradient">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating 3D shapes */}
          <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl animate-float-delay" />
          <div className="absolute top-1/3 right-[20%] w-32 h-32 rounded-full bg-accent/20 blur-2xl animate-float" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      </div>

      {/* Content */}
      <div className="relative container-main py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-2xl">
            {/* Logo */}
            
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-sm mb-6 animate-fade-in border border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-semibold text-primary-foreground">#1 Platform Properti Terverifikasi di Indonesia</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-6 leading-[1.1] animate-fade-in">
              Marketplace Properti{" "}
              <span className="relative inline-block">
                <span className="text-accent">Aman</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" fill="none">
                  <path d="M0 4C20 0 40 8 60 4C80 0 100 8 100 4" stroke="hsl(160, 84%, 39%)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>{" "}
              &{" "}
              <span className="text-accent">Terverifikasi</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-primary-foreground/75 mb-8 max-w-xl animate-fade-in leading-relaxed">
              Cek legalitas, kurangi risiko sengketa, dan transaksi lebih aman. Semua properti diverifikasi oleh tim ahli Mypropertyku.
            </p>

            {/* Search Box */}
            <div className="glass rounded-2xl p-5 md:p-6 shadow-2xl animate-fade-in border border-primary-foreground/10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Location Dropdown */}
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">
                    Lokasi
                  </label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-card border-border">
                      {INDONESIAN_LOCATIONS.map(loc => <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type */}
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">
                    Tipe Properti
                  </label>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background">
                      <Home className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
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
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wide">
                    Rentang Harga
                  </label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="bg-background/50 border-border/50 focus:bg-background">
                      <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground shrink-0" />
                      <SelectValue placeholder="Pilih harga" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
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
                  <Button className="w-full h-10 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-lg" size="lg" onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                    Cari Properti
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 md:gap-10 animate-fade-in">
              <div ref={stats.properties.ref}>
                <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{stats.properties.count}</p>
                <p className="text-sm text-primary-foreground/60 font-medium">Properti Terdaftar</p>
              </div>
              <div ref={stats.verified.ref}>
                <p className="text-3xl md:text-4xl font-extrabold text-accent">{stats.verified.count}</p>
                <p className="text-sm text-primary-foreground/60 font-medium">Terverifikasi</p>
              </div>
              <div ref={stats.satisfaction.ref}>
                <p className="text-3xl md:text-4xl font-extrabold text-primary-foreground">{stats.satisfaction.count}</p>
                <p className="text-sm text-primary-foreground/60 font-medium">Tingkat Kepuasan</p>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Scene */}
          <div className="hidden lg:flex justify-center items-center relative">
            {/* 3D House Illustration */}
            <div className="relative">
              {/* Main house card */}
              <div className="relative w-80 h-80 animate-float">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/20 shadow-2xl flex items-center justify-center">
                  <Building2 className="w-32 h-32 text-primary-foreground/80" strokeWidth={1} />
                </div>
                
                {/* Verification badge */}
                <div className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-accent shadow-xl flex items-center justify-center animate-pulse-glow">
                  <Shield className="w-10 h-10 text-accent-foreground" />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -left-16 top-12 p-4 rounded-2xl glass shadow-xl animate-float-delay">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Verified</p>
                    <p className="text-xs text-muted-foreground">Legal Clear</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-12 bottom-20 p-4 rounded-2xl glass shadow-xl animate-float-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">SHM</p>
                    <p className="text-xs text-muted-foreground">Certificate</p>
                  </div>
                </div>
              </div>

              <div className="absolute left-8 -bottom-8 p-3 rounded-xl glass shadow-xl animate-float">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="text-xs font-medium text-foreground">Risiko Rendah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;