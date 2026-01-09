import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8">
          <span className="text-5xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground mb-8">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. 
          Silakan periksa URL atau kembali ke beranda.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Ke Beranda
            </Button>
          </Link>
          <Link to="/listings">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Search className="w-4 h-4" />
              Cari Properti
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
