import { Link } from "react-router-dom";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-danger/10 mb-8">
          <ShieldX className="w-12 h-12 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Akses Ditolak
        </h1>
        <p className="text-muted-foreground mb-8">
          Anda tidak memiliki izin untuk mengakses halaman ini. 
          Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <Link to="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
