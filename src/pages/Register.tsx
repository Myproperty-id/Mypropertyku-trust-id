import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { registerSchema } from "@/lib/validations/property";
import Navbar from "@/components/layout/Navbar";
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const {
    signUp
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    checkRateLimit,
    isLimited,
    retryAfter
  } = useRateLimit();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    if (!agreed) {
      toast({
        title: "Error",
        description: "Harap setujui syarat & ketentuan",
        variant: "destructive"
      });
      return;
    }

    // Validate with Zod
    const validation = registerSchema.safeParse({
      fullName,
      email,
      phone,
      password
    });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }
    setLoading(true);

    // Check rate limit before attempting registration
    const rateLimitResult = await checkRateLimit("auth", email.toLowerCase());
    if (!rateLimitResult.allowed) {
      setLoading(false);
      toast({
        title: "Terlalu Banyak Percobaan",
        description: `Silakan coba lagi dalam ${rateLimitResult.retryAfter} detik`,
        variant: "destructive"
      });
      return;
    }
    const {
      error
    } = await signUp(email.trim(), password, fullName.trim(), phone.trim() || undefined);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Berhasil",
        description: "Akun berhasil dibuat!"
      });
      navigate("/dashboard");
    }
    setLoading(false);
  };
  return <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Buat Akun Baru</h1>
              <p className="text-muted-foreground">Daftar untuk mulai menggunakan Mypropertyku</p>
            </div>

            {isLimited && <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                Terlalu banyak percobaan. Coba lagi dalam {retryAfter} detik.
              </div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="Masukkan nama lengkap" className={`pl-10 ${validationErrors.fullName ? "border-destructive" : ""}`} value={fullName} onChange={e => setFullName(e.target.value)} required maxLength={100} />
                </div>
                {validationErrors.fullName && <p className="text-destructive text-xs mt-1">{validationErrors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="nama@email.com" className={`pl-10 ${validationErrors.email ? "border-destructive" : ""}`} value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} />
                </div>
                {validationErrors.email && <p className="text-destructive text-xs mt-1">{validationErrors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="phone" type="tel" placeholder="+62 812 xxxx xxxx" className={`pl-10 ${validationErrors.phone ? "border-destructive" : ""}`} value={phone} onChange={e => setPhone(e.target.value)} maxLength={20} />
                </div>
                {validationErrors.phone && <p className="text-destructive text-xs mt-1">{validationErrors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 karakter, huruf besar, kecil, angka" className={`pl-10 pr-10 ${validationErrors.password ? "border-destructive" : ""}`} value={password} onChange={e => setPassword(e.target.value)} required maxLength={128} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && <p className="text-destructive text-xs mt-1">{validationErrors.password}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  Minimal 8 karakter, kombinasi huruf besar, kecil, dan angka
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="terms" className="mt-0.5" checked={agreed} onCheckedChange={c => setAgreed(!!c)} />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  Saya setuju dengan <Link to="/terms" className="text-primary hover:underline">Syarat & Ketentuan</Link>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading || isLimited}>
                {loading ? "Memproses..." : "Daftar"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Sudah punya akun?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Masuk di sini</Link>
            </p>
          </div>
        </div>
      </main>
    </div>;
};
export default Register;