import React from "react";
import { Scale, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-navy-light/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-gold" />
            <span className="font-display text-lg font-bold text-gold">Law4Teen.org</span>
          </div>
          <p className="text-gold-light/50 text-sm font-play flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-gold fill-gold" /> for the next generation of legal minds
          </p>
          <p className="text-gold-light/40 text-xs font-play">
            &copy; {new Date().getFullYear()} Law4Teen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}