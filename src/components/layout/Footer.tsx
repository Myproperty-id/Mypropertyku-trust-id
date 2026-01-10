import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-foreground">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">MyProperty</span>
            </Link>
            <p className="text-sm text-primary-foreground/70 mb-6">
              Marketplace properti aman dan terverifikasi di Indonesia. Cek legalitas, kurangi risiko sengketa.
            </p>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@myproperty.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Properti */}
          <div>
            <h4 className="font-semibold mb-4">Properti</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li><Link to="/listings" className="hover:text-primary-foreground transition-colors">Cari Properti</Link></li>
              <li><Link to="/listings?type=rumah" className="hover:text-primary-foreground transition-colors">Rumah</Link></li>
              <li><Link to="/listings?type=apartemen" className="hover:text-primary-foreground transition-colors">Apartemen</Link></li>
              <li><Link to="/listings?type=tanah" className="hover:text-primary-foreground transition-colors">Tanah</Link></li>
              <li><Link to="/listings?type=ruko" className="hover:text-primary-foreground transition-colors">Ruko</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li><Link to="/post-property" className="hover:text-primary-foreground transition-colors">Pasang Iklan</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary-foreground transition-colors">Cara Kerja</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-foreground transition-colors">Harga Layanan</Link></li>
              <li><Link to="/about" className="hover:text-primary-foreground transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/70">
              <li><Link to="/privacy" className="hover:text-primary-foreground transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/terms" className="hover:text-primary-foreground transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/disclaimer" className="hover:text-primary-foreground transition-colors">Disclaimer</Link></li>
              <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© 2025 MyProperty. Hak cipta dilindungi undang-undang.</p>
            <p className="text-xs">
              Disclaimer: MyProperty tidak menjamin kepemilikan atau legalitas properti. Selalu lakukan verifikasi mandiri.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
