import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/listings", label: "Cari Properti" },
    { href: "/how-it-works", label: "Cara Kerja" },
    { href: "/about", label: "Tentang Kami" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border transition-colors duration-300">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              alt="Mypropertyku Logo"
              className="h-10 w-auto object-contain"
              src="/lovable-uploads/941ef5e7-fdec-4555-899a-7caefe7cdba7.png"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full transition-all duration-300 hover:bg-muted"
              aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-muted-foreground transition-transform duration-300 hover:rotate-12" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
              )}
            </Button>

            <Link to="/post-property">
              <Button variant="outline" size="sm">
                Pasang Iklan
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  Masuk
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link to="/login">Masuk</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/register">Daftar</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dark Mode Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full"
              aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border flex flex-col gap-2 px-4">
                <Link to="/post-property" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Pasang Iklan
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Masuk</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
