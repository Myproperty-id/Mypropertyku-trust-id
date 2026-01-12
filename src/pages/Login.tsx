import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRateLimit } from "@/hooks/useRateLimit";
import { loginSchema } from "@/lib/validations/property";
import Navbar from "@/components/layout/Navbar";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { signIn } = useAuth();
  const { toast } = useToast();
  const { checkRateLimit, isLimited, retryAfter } = useRateLimit();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    
    // Validate with Zod
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setValidationErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // Check rate limit before attempting login
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
    
    const { error } = await signIn(email.trim(), password);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Berhasil", description: "Selamat datang kembali!" });
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Masuk ke Akun</h1>
              <p className="text-muted-foreground">Masuk untuk mengakses fitur lengkap MyProperty</p>
            </div>

            {isLimited && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                Terlalu banyak percobaan. Coba lagi dalam {retryAfter} detik.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@email.com" 
                    className={`pl-10 ${validationErrors.email ? "border-destructive" : ""}`} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    maxLength={255}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-destructive text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Masukkan kata sandi" 
                    className={`pl-10 pr-10 ${validationErrors.password ? "border-destructive" : ""}`} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    maxLength={128}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-destructive text-xs mt-1">{validationErrors.password}</p>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading || isLimited}>
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
