import { Link } from "react-router-dom";
import { ServerCrash, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ServerError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warning/10 mb-8">
          <ServerCrash className="w-12 h-12 text-warning" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">
          Terjadi Kesalahan Server
        </h1>
        <p className="text-muted-foreground mb-8">
          Maaf, terjadi kesalahan di server kami. Tim teknis kami sedang 
          bekerja untuk memperbaikinya. Silakan coba lagi nanti.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.location.reload()} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </Button>
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
