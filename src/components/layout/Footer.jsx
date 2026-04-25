import React, { useState, useEffect } from "react";
import { Scale } from "lucide-react";

export default function Footer() {
  const [globalVisits, setGlobalVisits] = useState(null);

  useEffect(() => {
    // We fetch from the internal path we just created
    fetch("/api/get-count")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.count) {
          setGlobalVisits(data.count);
        }
      })
      .catch((err) => console.error("Counter Error:", err));
  }, []);

  return (
    <footer className="bg-navy-dark border-t border-navy-light/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-gold" />
            <span className="font-display text-lg font-bold text-gold">Law4Teen.org</span>
          </div>

          <p className="text-gold-light/50 text-sm font-play">
            {globalVisits !== null ? (
              <>Global Visitors: <span className="text-gold font-bold">{globalVisits.toLocaleString()}</span></>
            ) : (
              "Empowering teens through legal literacy"
            )}
          </p>

          <p className="text-gold-light/40 text-xs font-play">
            &copy; {new Date().getFullYear()} Law4Teen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
