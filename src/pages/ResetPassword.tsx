import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { z } from "zod";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf besar")
    .regex(/[a-z]/, "Harus mengandung huruf kecil")
    .regex(/[0-9]/, "Harus mengandung angka"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi kata sandi tidak cocok",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [accessError, setAccessError] = useState(false);
  const { updatePassword, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a valid recovery session
    // The session will be set after clicking the email link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    // If no recovery type in URL and no session, show error
    if (!type && !session) {
      setAccessError(true);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Validate passwords
    const validation = passwordSchema.safeParse({ password, confirmPassword });
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
    const { error } = await updatePassword(password);

    if (error) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      setSuccess(true);
      toast({ 
        title: "Berhasil", 
        description: "Kata sandi Anda telah diperbarui" 
      });
    }
    setLoading(false);
  };

  if (accessError) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-lg text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-destructive/10 mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Link Tidak Valid</h1>
              <p className="text-muted-foreground mb-6">
                Link reset password tidak valid atau sudah kedaluwarsa. 
                Silakan minta link baru.
              </p>
              <Link to="/forgot-password">
                <Button className="w-full">Minta Link Baru</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            {success ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Kata Sandi Diperbarui!</h1>
                <p className="text-muted-foreground mb-6">
                  Kata sandi Anda telah berhasil diperbarui. Silakan masuk dengan kata sandi baru.
                </p>
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Masuk Sekarang
                </Button>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-4">
                    <Lock className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Atur Kata Sandi Baru</h1>
                  <p className="text-muted-foreground">
                    Masukkan kata sandi baru untuk akun Anda
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="password">Kata Sandi Baru</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Masukkan kata sandi baru" 
                        className={`pl-10 pr-10 ${validationErrors.password ? "border-destructive" : ""}`}
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        maxLength={128}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-destructive text-xs mt-1">{validationErrors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimal 8 karakter, huruf besar, huruf kecil, dan angka
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="confirmPassword" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Konfirmasi kata sandi baru" 
                        className={`pl-10 pr-10 ${validationErrors.confirmPassword ? "border-destructive" : ""}`}
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        maxLength={128}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-destructive text-xs mt-1">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Memproses..." : "Perbarui Kata Sandi"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
