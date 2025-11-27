import { Link, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/email-scanner", label: "Email Scanner" },
    { href: "/delete-data", label: "Delete Data" },
    { href: "/policy-lens", label: "Policy Lens" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-all duration-300 group-hover:text-cyan" />
              <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-cyan/40 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-foreground">Shadow</span>
              <span className="text-gradient-primary">Data</span>
            </span>
          </Link>

          {/* Center tagline - hidden on mobile */}
          <p className="hidden lg:block text-sm text-muted-foreground">
            Privacy tools, no signup.
          </p>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
