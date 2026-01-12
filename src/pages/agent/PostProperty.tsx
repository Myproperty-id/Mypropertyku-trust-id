import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, MapPin, FileText, Upload, Check, ChevronLeft, ChevronRight,
  Building2, Ruler, Bed, Bath, Layers, Calendar
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
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { propertyFormSchema, parsePriceToNumber } from "@/lib/validations/property";

type CertificateType = "shm" | "shgb" | "hpl" | "girik" | "ajb" | "ppjb";

interface PropertyData {
  title: string;
  description: string;
  price: string;
  property_type: string;
  certificate_type: CertificateType | "";
  address: string;
  city: string;
  province: string;
  postal_code: string;
  land_size: string;
  building_size: string;
  bedrooms: string;
  bathrooms: string;
  floors: string;
  year_built: string;
  zoning_info: string;
}

const PostProperty = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkRateLimit, isLimited, retryAfter } = useRateLimit();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PropertyData>({
    title: "",
    description: "",
    price: "",
    property_type: "",
    certificate_type: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    land_size: "",
    building_size: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    year_built: "",
    zoning_info: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const updateField = (field: keyof PropertyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const steps = [
    { id: 1, title: "Informasi Properti", icon: Home },
    { id: 2, title: "Lokasi", icon: MapPin },
    { id: 3, title: "Dokumen Legal", icon: FileText },
    { id: 4, title: "Review & Submit", icon: Check },
  ];

  const provinces = [
    "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten",
    "Bali", "Sumatera Utara", "Sumatera Selatan", "Kalimantan Timur", "Sulawesi Selatan"
  ];

  const propertyTypes = [
    "Rumah", "Apartemen", "Ruko", "Tanah", "Villa", "Gudang", "Kantor"
  ];

  const certificateTypes: { value: CertificateType; label: string }[] = [
    { value: "shm", label: "SHM (Sertifikat Hak Milik)" },
    { value: "shgb", label: "SHGB (Sertifikat Hak Guna Bangunan)" },
    { value: "hpl", label: "HPL (Hak Pengelolaan Lahan)" },
    { value: "girik", label: "Girik" },
    { value: "ajb", label: "AJB (Akta Jual Beli)" },
    { value: "ppjb", label: "PPJB (Perjanjian Pengikatan Jual Beli)" },
  ];

  const handleSubmit = async () => {
    if (!user) return;
    
    // Validate form data with Zod schema
    const validation = propertyFormSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      toast({ 
        title: "Validasi Gagal", 
        description: "Periksa kembali data yang Anda masukkan", 
        variant: "destructive" 
      });
      return;
    }
    
    setSubmitting(true);
    
    // Check rate limit before submitting
    const rateLimitResult = await checkRateLimit("property", user.id);
    if (!rateLimitResult.allowed) {
      setSubmitting(false);
      toast({ 
        title: "Terlalu Banyak Permintaan", 
        description: `Silakan coba lagi dalam ${rateLimitResult.retryAfter} detik`, 
        variant: "destructive" 
      });
      return;
    }
    
    const priceValue = parsePriceToNumber(formData.price);
    
    const { error } = await supabase.from("properties").insert({
      user_id: user.id,
      title: formData.title.trim(),
      description: formData.description?.trim() || null,
      price: priceValue,
      property_type: formData.property_type,
      certificate_type: formData.certificate_type || null,
      address: formData.address.trim(),
      city: formData.city.trim(),
      province: formData.province,
      postal_code: formData.postal_code?.trim() || null,
      land_size: formData.land_size ? parseInt(formData.land_size) : null,
      building_size: formData.building_size ? parseInt(formData.building_size) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      floors: formData.floors ? parseInt(formData.floors) : null,
      year_built: formData.year_built ? parseInt(formData.year_built) : null,
      zoning_info: formData.zoning_info?.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Properti berhasil didaftarkan" });
      navigate("/dashboard");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.title && formData.property_type && formData.price;
      case 2:
        return formData.address && formData.city && formData.province;
      case 3:
        return true; // Documents are optional for now
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container-main py-8 max-w-4xl">
          <div className="bg-card rounded-2xl border border-border p-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container-main py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <s.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 text-center ${step >= s.id ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${step > s.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-8">
          {/* Step 1: Property Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Informasi Properti</h2>
              
              <div>
                <Label htmlFor="title">Judul Properti *</Label>
                <Input 
                  id="title" 
                  placeholder="Contoh: Rumah Minimalis 2 Lantai di BSD"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea 
                  id="description" 
                  placeholder="Jelaskan detail properti Anda..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipe Properti *</Label>
                  <Select value={formData.property_type} onValueChange={(v) => updateField("property_type", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Pilih tipe properti" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Harga (Rp) *</Label>
                  <Input 
                    id="price" 
                    placeholder="Contoh: 1.500.000.000"
                    value={formData.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="land_size" className="flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Luas Tanah (m²)
                  </Label>
                  <Input 
                    id="land_size" 
                    type="number"
                    value={formData.land_size}
                    onChange={(e) => updateField("land_size", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="building_size" className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Luas Bangunan (m²)
                  </Label>
                  <Input 
                    id="building_size" 
                    type="number"
                    value={formData.building_size}
                    onChange={(e) => updateField("building_size", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bedrooms" className="flex items-center gap-1">
                    <Bed className="w-3 h-3" /> Kamar Tidur
                  </Label>
                  <Input 
                    id="bedrooms" 
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => updateField("bedrooms", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms" className="flex items-center gap-1">
                    <Bath className="w-3 h-3" /> Kamar Mandi
                  </Label>
                  <Input 
                    id="bathrooms" 
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => updateField("bathrooms", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="floors" className="flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Jumlah Lantai
                  </Label>
                  <Input 
                    id="floors" 
                    type="number"
                    value={formData.floors}
                    onChange={(e) => updateField("floors", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="year_built" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Tahun Dibangun
                  </Label>
                  <Input 
                    id="year_built" 
                    type="number"
                    placeholder="Contoh: 2020"
                    value={formData.year_built}
                    onChange={(e) => updateField("year_built", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Lokasi Properti</h2>
              
              <div>
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <Textarea 
                  id="address" 
                  placeholder="Masukkan alamat lengkap properti"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Kota/Kabupaten *</Label>
                  <Input 
                    id="city" 
                    placeholder="Contoh: Jakarta Selatan"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="province">Provinsi *</Label>
                  <Select value={formData.province} onValueChange={(v) => updateField("province", v)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Pilih provinsi" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map(prov => (
                        <SelectItem key={prov} value={prov}>{prov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="postal_code">Kode Pos</Label>
                <Input 
                  id="postal_code" 
                  placeholder="Contoh: 12345"
                  value={formData.postal_code}
                  onChange={(e) => updateField("postal_code", e.target.value)}
                  className="mt-1.5 max-w-[200px]"
                />
              </div>
            </div>
          )}

          {/* Step 3: Legal Documents */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Dokumen Legalitas</h2>
              
              <div>
                <Label htmlFor="certificate_type">Jenis Sertifikat</Label>
                <Select value={formData.certificate_type} onValueChange={(v) => updateField("certificate_type", v as CertificateType)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Pilih jenis sertifikat" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificateTypes.map(cert => (
                      <SelectItem key={cert.value} value={cert.value}>{cert.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="zoning_info">Informasi Zonasi</Label>
                <Input 
                  id="zoning_info" 
                  placeholder="Contoh: Perumahan, Komersial, dll"
                  value={formData.zoning_info}
                  onChange={(e) => updateField("zoning_info", e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-2">Upload Dokumen</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Seret file atau klik untuk memilih dokumen (PDF, JPG, PNG)
                </p>
                <Button variant="outline" disabled>
                  Pilih File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Fitur upload akan tersedia setelah storage diaktifkan
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Review & Submit</h2>
              
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <h3 className="font-medium text-foreground">Ringkasan Properti</h3>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Judul:</span>
                    <p className="font-medium text-foreground">{formData.title || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tipe:</span>
                    <p className="font-medium text-foreground">{formData.property_type || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Harga:</span>
                    <p className="font-medium text-foreground">Rp {formData.price || "-"}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sertifikat:</span>
                    <p className="font-medium text-foreground">
                      {certificateTypes.find(c => c.value === formData.certificate_type)?.label || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Lokasi:</span>
                    <p className="font-medium text-foreground">
                      {formData.address}, {formData.city}, {formData.province}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="text-sm text-foreground">
                  <strong>Catatan:</strong> Setelah submit, properti Anda akan masuk ke antrian 
                  verifikasi. Tim kami akan meninjau dan memverifikasi dokumen dalam 3-5 hari kerja.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button 
              variant="outline" 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            
            {step < 4 ? (
              <Button 
                onClick={() => setStep(s => Math.min(4, s + 1))}
                disabled={!canProceed()}
                className="gap-2"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={submitting}
                className="gap-2"
              >
                {submitting ? "Menyimpan..." : "Submit Properti"}
                <Check className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;
