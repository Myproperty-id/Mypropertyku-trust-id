import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Home, MapPin, FileText, Check, ChevronLeft, ChevronRight,
  Building2, Ruler, Bed, Bath, Layers, Calendar, Loader2
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
import FileUploader from "@/components/admin/FileUploader";

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

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
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

  useEffect(() => {
    if (user && id) {
      fetchProperty();
    }
  }, [user, id]);

  const fetchProperty = async () => {
    setLoadingProperty(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast({ title: "Error", description: "Properti tidak ditemukan", variant: "destructive" });
      navigate("/dashboard");
      return;
    }

    // Check if user owns this property
    if (data.user_id !== user?.id) {
      toast({ title: "Error", description: "Anda tidak memiliki akses ke properti ini", variant: "destructive" });
      navigate("/dashboard");
      return;
    }

    setFormData({
      title: data.title || "",
      description: data.description || "",
      price: data.price?.toString() || "",
      property_type: data.property_type || "",
      certificate_type: (data.certificate_type as CertificateType) || "",
      address: data.address || "",
      city: data.city || "",
      province: data.province || "",
      postal_code: data.postal_code || "",
      land_size: data.land_size?.toString() || "",
      building_size: data.building_size?.toString() || "",
      bedrooms: data.bedrooms?.toString() || "",
      bathrooms: data.bathrooms?.toString() || "",
      floors: data.floors?.toString() || "",
      year_built: data.year_built?.toString() || "",
      zoning_info: data.zoning_info || "",
    });
    setPropertyImages(data.images || []);
    setLoadingProperty(false);
  };

  const updateField = (field: keyof PropertyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (!user || !id) return;
    
    setSubmitting(true);
    
    const priceValue = parseInt(formData.price.replace(/\D/g, "")) || 0;
    
    const { error } = await supabase
      .from("properties")
      .update({
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
        images: propertyImages.length > 0 ? propertyImages : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Properti berhasil diperbarui" });
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
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (authLoading || loadingProperty) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container-main py-8 max-w-4xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container-main py-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">Edit Properti</h1>

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

              {/* Property Images Upload */}
              <div>
                <Label className="mb-2 block">Foto Properti</Label>
                <FileUploader
                  onUploadComplete={(urls) => setPropertyImages([...propertyImages, ...urls])}
                  maxFiles={10}
                  bucket="property-images"
                  userId={user?.id || ""}
                />
                {propertyImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {propertyImages.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPropertyImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Review & Submit</h2>
              
              <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Judul</p>
                    <p className="font-medium text-foreground">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tipe</p>
                    <p className="font-medium text-foreground">{formData.property_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Harga</p>
                    <p className="font-medium text-foreground">Rp {parseInt(formData.price.replace(/\D/g, "") || "0").toLocaleString("id-ID")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Lokasi</p>
                    <p className="font-medium text-foreground">{formData.city}, {formData.province}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sertifikat</p>
                    <p className="font-medium text-foreground">{formData.certificate_type?.toUpperCase() || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Foto</p>
                    <p className="font-medium text-foreground">{propertyImages.length} foto</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setStep(prev => prev - 1)}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(prev => prev + 1)}
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
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
