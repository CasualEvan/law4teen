import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Case of the Week", path: "/case-of-the-week" },
  { label: "Legal Terms", path: "/legal-terms" },
  { label: "Headlines", path: "/headlines" },
  { label: "LSAT Practice", path: "/lsat-practice" },
  { label: "Amendments", path: "/amendments" },
  { label: "About", path: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-navy-dark border-b border-navy-light/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
              <Scale className="w-5 h-5 text-navy-dark" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-gold tracking-tight">
                Law4Teen
              </span>
              <span className="font-display text-[10px] text-gold-light/60 block -mt-1 tracking-widest uppercase">
                .org
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-play font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-gold/15 text-gold"
                    : "text-gold-light/70 hover:text-gold hover:bg-navy-light/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-gold hover:bg-navy-light/30"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-dark border-t border-navy-light/20 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 text-sm font-play font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-gold/10 text-gold"
                  : "text-gold-light/70 hover:text-gold hover:bg-navy-light/20"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}