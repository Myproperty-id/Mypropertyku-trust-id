import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, Shield, Camera, CheckCircle2, Clock, 
  XCircle, AlertCircle, Save, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Profil berhasil diperbarui" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getKYCStatus = () => {
    const status = profile?.kyc_status || "not_started";
    switch (status) {
      case "verified":
        return {
          label: "Terverifikasi",
          icon: CheckCircle2,
          color: "bg-accent/10 text-accent border-accent/20",
          description: "Identitas Anda telah diverifikasi"
        };
      case "pending":
        return {
          label: "Dalam Proses",
          icon: Clock,
          color: "bg-warning/10 text-warning border-warning/20",
          description: "Dokumen sedang ditinjau (1-3 hari kerja)"
        };
      case "rejected":
        return {
          label: "Ditolak",
          icon: XCircle,
          color: "bg-destructive/10 text-destructive border-destructive/20",
          description: "Dokumen ditolak. Silakan upload ulang."
        };
      default:
        return {
          label: "Belum Verifikasi",
          icon: AlertCircle,
          color: "bg-muted text-muted-foreground border-border",
          description: "Verifikasi identitas untuk akses fitur lengkap"
        };
    }
  };

  const kycStatus = getKYCStatus();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        <div className="container-main py-8 max-w-2xl">
          <div className="bg-card rounded-2xl border border-border p-8 animate-pulse">
            <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-6" />
            <div className="h-6 bg-muted rounded w-1/3 mx-auto mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1">
        <div className="container-main py-8 max-w-2xl">
          {/* Profile Card */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-primary/5 p-8 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h1 className="text-xl font-bold text-foreground mt-4">
                {profile?.full_name || "Pengguna"}
              </h1>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>

            <div className="p-8">
              {/* KYC Status */}
              <div className={`rounded-xl border p-4 mb-8 ${kycStatus.color}`}>
                <div className="flex items-start gap-3">
                  <kycStatus.icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Status KYC: {kycStatus.label}</h3>
                      {profile?.kyc_status !== "verified" && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Verifikasi Sekarang
                        </Button>
                      )}
                    </div>
                    <p className="text-sm opacity-80 mt-1">{kycStatus.description}</p>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5" /> Informasi Profil
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Email tidak dapat diubah</p>
                  </div>

                  <div>
                    <Label htmlFor="full_name">Nama Lengkap</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="full_name" 
                        value={formData.full_name}
                        onChange={(e) => setFormData(f => ({ ...f, full_name: e.target.value }))}
                        placeholder="Masukkan nama lengkap"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <div className="relative mt-1.5">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+62 812-3456-7890"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>

              <Separator className="my-8" />

              {/* Account Info */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Keamanan Akun
                </h2>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Ubah Password</p>
                    <p className="text-sm text-muted-foreground">Perbarui password akun Anda</p>
                  </div>
                  <Button variant="outline" size="sm">Ubah</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Autentikasi 2 Faktor</p>
                    <p className="text-sm text-muted-foreground">Tambah lapisan keamanan ekstra</p>
                  </div>
                  <Badge variant="secondary">Segera Hadir</Badge>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Logout */}
              <Button variant="destructive" onClick={handleSignOut} className="w-full gap-2">
                <LogOut className="w-4 h-4" />
                Keluar dari Akun
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
