import React, { useState, useEffect } from "react";
import { Search, BookOpen, Volume2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

function TermCard({ term }) {
  const [open, setOpen] = useState(false);

  const speak = (e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${term.term}. ${term.definition}. Example: ${term.example}`);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy-dark flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-display font-bold text-sm">{term.term[0]}</span>
          </div>
          <div>
            <p className="font-display font-bold text-navy-dark text-lg">{term.term}</p>
            <span className="text-xs font-play text-muted-foreground bg-muted px-2 py-0.5 rounded">{term.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button onClick={speak} className="p-1.5 rounded-lg bg-gold/10 text-gold-dark hover:bg-gold/20 transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border bg-muted/10">
          <p className="font-play text-foreground leading-relaxed mt-4">{term.definition}</p>
          <div className="mt-3 bg-gold/5 border border-gold/15 rounded-lg p-3">
            <p className="text-xs font-play font-bold text-gold-dark uppercase tracking-wide mb-1">Example</p>
            <p className="font-play text-sm text-muted-foreground italic">{term.example}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LegalTerms() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    supabase
      .from("legal_terms")
      .select("*")
      .order("term", { ascending: true })
      .then(({ data }) => {
        setTerms(data || []);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(terms.map((t) => t.category))).sort()];

  const filtered = terms.filter((t) => {
    const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="w-6 h-6 animate-spin text-navy-dark" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-dark mb-4">
          <BookOpen className="w-7 h-7 text-gold" />
        </div>
        <h1 className="font-display text-4xl font-bold text-navy-dark">Legal Dictionary</h1>
        <p className="mt-2 text-muted-foreground font-play">Plain-English definitions of legal terms — click any term to expand, or hit the speaker icon to hear it</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="pl-10 bg-white border-border font-play"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-play font-medium transition-colors border ${
              activeCategory === cat
                ? "bg-navy-dark text-gold border-navy-dark"
                : "bg-white text-muted-foreground border-border hover:border-navy-light hover:text-navy-dark"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground font-play mb-4">{filtered.length} term{filtered.length !== 1 ? "s" : ""} found</p>

      <div className="space-y-3">
        {filtered.map((t) => <TermCard key={t.term} term={t} />)}
      </div>
    </div>
  );
}
