import React, { useState } from "react";
import { Search, BookOpen, Volume2, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const terms = [
  { term: "Affidavit", category: "Evidence", definition: "A written statement confirmed by oath or affirmation, used as evidence in court proceedings.", example: "A witness who cannot appear in court may submit an affidavit describing what they saw." },
  { term: "Acquittal", category: "Criminal Law", definition: "A judgment that a person is not guilty of the crime charged.", example: "After reviewing all evidence, the jury returned an acquittal for the defendant." },
  { term: "Amicus Curiae", category: "Court Procedure", definition: "Latin for 'friend of the court' — a person or organization not party to a case who offers information or expertise.", example: "The ACLU filed an amicus curiae brief in the civil rights case." },
  { term: "Appeal", category: "Court Procedure", definition: "A request to a higher court to review and change the decision of a lower court.", example: "After losing the trial, the defendant filed an appeal to the Circuit Court." },
  { term: "Arraignment", category: "Criminal Law", definition: "A court proceeding in which a defendant is formally charged and asked to plead guilty or not guilty.", example: "At the arraignment, the defendant pleaded not guilty to all three charges." },
  { term: "Brief", category: "Court Procedure", definition: "A written legal document presented to a court arguing why one side should win.", example: "The attorney spent weeks writing her brief outlining why the law was unconstitutional." },
  { term: "Burden of Proof", category: "Evidence", definition: "The obligation of a party to prove their claims to the required legal standard.", example: "In criminal cases, the prosecution bears the burden of proof beyond a reasonable doubt." },
  { term: "Class Action", category: "Civil Law", definition: "A lawsuit where a large group of people collectively bring a claim against a defendant.", example: "Consumers filed a class action lawsuit against the company for selling defective products." },
  { term: "Due Process", category: "Constitutional Law", definition: "The legal requirement that the government must respect all legal rights owed to a person.", example: "The defendant claimed his due process rights were violated when he wasn't allowed an attorney." },
  { term: "Eminent Domain", category: "Property Law", definition: "The government's power to take private property for public use, with fair compensation.", example: "The city used eminent domain to acquire land for building a new highway." },
  { term: "Habeas Corpus", category: "Constitutional Law", definition: "A legal action requiring a person under arrest to be brought before a judge or court.", example: "The prisoner filed a habeas corpus petition challenging the legality of his detention." },
  { term: "Injunction", category: "Civil Law", definition: "A court order requiring a party to do or stop doing a specific action.", example: "The court issued an injunction preventing the company from dumping chemicals in the river." },
  { term: "Jurisdiction", category: "Court Procedure", definition: "The authority of a court to hear and decide a case.", example: "The federal court lacked jurisdiction because it was a state matter." },
  { term: "Libel", category: "Tort Law", definition: "A published false statement that damages a person's reputation.", example: "The celebrity sued the magazine for libel after they published false rumors about her." },
  { term: "Litigation", category: "Court Procedure", definition: "The process of taking legal action; being involved in a lawsuit.", example: "After failed negotiations, the dispute went into litigation." },
  { term: "Moot", category: "Court Procedure", definition: "A case or issue that is no longer relevant or has been resolved outside of court.", example: "The case became moot when the law was repealed before the court could rule on it." },
  { term: "Negligence", category: "Tort Law", definition: "Failure to exercise the care a reasonable person would take, resulting in harm to another.", example: "The driver was found negligent for texting while driving, causing an accident." },
  { term: "Plaintiff", category: "Court Procedure", definition: "The person who brings a case against another in a court of law.", example: "The plaintiff sued the landlord for failing to fix the broken heater." },
  { term: "Precedent", category: "Constitutional Law", definition: "A legal decision that serves as a rule for future similar cases (also called 'stare decisis').", example: "Brown v. Board of Education set a precedent for desegregating public schools." },
  { term: "Subpoena", category: "Court Procedure", definition: "A legal document ordering someone to appear in court or produce documents.", example: "The witness received a subpoena requiring her to testify at the trial." },
  { term: "Tort", category: "Tort Law", definition: "A wrongful act or infringement of rights leading to civil legal liability.", example: "Slipping on a wet floor in a store with no warning sign could be considered a tort." },
  { term: "Verdict", category: "Court Procedure", definition: "The formal decision made by a jury after a trial.", example: "After two days of deliberation, the jury announced a guilty verdict." },
  { term: "Voir Dire", category: "Court Procedure", definition: "The process of questioning potential jurors before a trial to select an impartial jury.", example: "During voir dire, both attorneys questioned 50 potential jurors." },
  { term: "Writ", category: "Court Procedure", definition: "A formal written order issued by a court or other legal authority.", example: "The Supreme Court issued a writ of certiorari to hear the appeal." },
];

const categories = ["All", ...Array.from(new Set(terms.map((t) => t.category))).sort()];

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
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = terms.filter((t) => {
    const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-dark mb-4">
          <BookOpen className="w-7 h-7 text-gold" />
        </div>
        <h1 className="font-display text-4xl font-bold text-navy-dark">Legal Dictionary</h1>
        <p className="mt-2 text-muted-foreground font-play">Plain-English definitions of legal terms — click any term to expand, or hit the speaker icon to hear it</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="pl-10 bg-white border-border font-play"
        />
      </div>

      {/* Category filter */}
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