import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate email
    const validation = emailSchema.safeParse({ email });
    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());

    if (error) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } else {
      setSent(true);
      toast({ 
        title: "Email Terkirim", 
        description: "Silakan cek inbox email Anda untuk link reset password" 
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            {sent ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Email Terkirim!</h1>
                <p className="text-muted-foreground mb-6">
                  Kami telah mengirimkan link reset password ke <strong>{email}</strong>. 
                  Silakan cek inbox atau folder spam Anda.
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setSent(false)}
                  >
                    Kirim Ulang Email
                  </Button>
                  <Link to="/login">
                    <Button className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Kembali ke Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary mb-4">
                    <Mail className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">Lupa Kata Sandi?</h1>
                  <p className="text-muted-foreground">
                    Masukkan email Anda dan kami akan mengirimkan link untuk mengatur ulang kata sandi
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="nama@email.com" 
                        className={`pl-10 ${validationError ? "border-destructive" : ""}`}
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        maxLength={255}
                      />
                    </div>
                    {validationError && (
                      <p className="text-destructive text-xs mt-1">{validationError}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Kembali ke Login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
