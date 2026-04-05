import React, { useState } from "react";
import { FileText, Volume2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const amendments = [
  { number: 1, title: "Freedom of Speech, Religion, Press, Assembly, and Petition", year: 1791, category: "Civil Liberties", text: "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press...", plain: "You have the right to practice any religion, say what you think, write what you believe, gather peacefully, and ask the government to change things.", example: "A student can write an opinion piece criticizing school policy in the school newspaper — this is protected speech. However, threatening speech or speech causing 'clear and present danger' is not protected." },
  { number: 2, title: "Right to Bear Arms", year: 1791, category: "Civil Rights", text: "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.", plain: "Citizens have the right to own and carry firearms, though courts have allowed reasonable regulations.", example: "The Supreme Court ruled in D.C. v. Heller (2008) that individuals have the right to own guns for self-defense, but governments can still ban guns in schools and government buildings." },
  { number: 3, title: "Quartering of Soldiers", year: 1791, category: "Civil Rights", text: "No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner...", plain: "The government cannot force you to house soldiers in your home without your permission.", example: "During peacetime, if a soldier knocked on your door demanding to live there, you'd be protected by the 3rd Amendment in refusing." },
  { number: 4, title: "Protection from Unreasonable Searches and Seizures", year: 1791, category: "Criminal Rights", text: "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated...", plain: "Police generally need a warrant to search your home, car, or belongings — and that warrant must be based on probable cause.", example: "If police want to search your locker at school, this right (modified for schools) applies. Police cannot randomly search your phone without a warrant or your consent." },
  { number: 5, title: "Rights of Persons Accused of Crimes", year: 1791, category: "Criminal Rights", text: "No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury...", plain: "You can't be tried twice for the same crime (double jeopardy), you don't have to testify against yourself, and the government can't take your property without fair payment.", example: "This is why you hear people 'plead the Fifth' — they're using their right not to self-incriminate. O.J. Simpson could not be tried again for murder after his acquittal due to double jeopardy." },
  { number: 6, title: "Right to a Fair Trial", year: 1791, category: "Criminal Rights", text: "In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial, by an impartial jury...", plain: "If you're accused of a crime, you have the right to a quick, public trial with an impartial jury, the right to know what you're charged with, and the right to an attorney.", example: "Miranda v. Arizona (1966) established that police must inform arrested persons of their 6th Amendment rights — this is the famous 'Miranda warning' you hear on TV: 'You have the right to an attorney...'" },
  { number: 7, title: "Right to a Jury Trial in Civil Cases", year: 1791, category: "Civil Rights", text: "In Suits at common law, where the value in controversy shall exceed twenty dollars, the right of trial by jury shall be preserved...", plain: "In civil (non-criminal) lawsuits involving significant money, either party can demand a jury trial.", example: "If you sued someone for $50,000 in damages from a car accident, you'd have the right to have a jury decide the case rather than just a judge." },
  { number: 8, title: "Protection Against Excessive Bail and Cruel Punishment", year: 1791, category: "Criminal Rights", text: "Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.", plain: "Bail can't be set unreasonably high, fines must be proportional to the crime, and punishment cannot be cruel or unusual.", example: "Courts have used the 8th Amendment to ban the death penalty for crimes committed by minors (Roper v. Simmons, 2005) and for non-homicide offenses." },
  { number: 9, title: "Rights Retained by the People", year: 1791, category: "Civil Liberties", text: "The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people.", plain: "Just because a right isn't listed in the Constitution doesn't mean you don't have it. Americans have rights beyond those written down.", example: "The right to privacy (though not explicitly mentioned) has been recognized by the Supreme Court as a right retained under the 9th Amendment." },
  { number: 10, title: "States' Rights", year: 1791, category: "Federalism", text: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people.", plain: "Any power not specifically given to the federal government belongs to the states or the people.", example: "Education policy, traffic laws, and marriage laws are traditionally state issues because the Constitution doesn't give the federal government authority over them." },
  { number: 13, title: "Abolition of Slavery", year: 1865, category: "Civil Rights", text: "Neither slavery nor involuntary servitude, except as a punishment for crime whereof the party shall have been duly convicted, shall exist within the United States...", plain: "Slavery and forced labor are illegal in the United States, except as punishment for a crime after conviction.", example: "Passed after the Civil War, this amendment formally outlawed the institution of slavery that had existed since the nation's founding. It was a turning point in American history." },
  { number: 14, title: "Equal Protection and Due Process", year: 1868, category: "Civil Rights", text: "All persons born or naturalized in the United States...are citizens of the United States...nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person...the equal protection of the laws.", plain: "Everyone born in the U.S. is a citizen. States must treat people equally under the law and can't take away rights without due process.", example: "Brown v. Board of Education used the Equal Protection Clause to end school segregation. Same-sex marriage was legalized via the Equal Protection Clause in Obergefell v. Hodges (2015)." },
  { number: 15, title: "Right to Vote Regardless of Race", year: 1870, category: "Voting Rights", text: "The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of race, color, or previous condition of servitude.", plain: "The government cannot deny citizens the right to vote based on race or because they were previously enslaved.", example: "Despite this amendment, states used poll taxes and literacy tests to prevent Black Americans from voting until the Voting Rights Act of 1965 addressed these barriers." },
  { number: 19, title: "Women's Right to Vote", year: 1920, category: "Voting Rights", text: "The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of sex.", plain: "Women have the constitutional right to vote in all U.S. elections.", example: "After 70+ years of suffragist activism, the 19th Amendment was ratified in 1920. Susan B. Anthony and Elizabeth Cady Stanton were key figures in this fight." },
  { number: 21, title: "Repeal of Prohibition", year: 1933, category: "Historical", text: "The eighteenth article of amendment to the Constitution of the United States is hereby repealed.", plain: "This amendment ended the ban on alcohol that had been established by the 18th Amendment in 1919.", example: "The 21st Amendment is unique — it's the only amendment that repealed another amendment, showing that the Constitution can correct its own mistakes." },
  { number: 22, title: "Presidential Term Limits", year: 1951, category: "Government Structure", text: "No person shall be elected to the office of the President more than twice...", plain: "No one can be elected President more than twice, serving a maximum of two four-year terms.", example: "Franklin D. Roosevelt was elected four times (1932-1944). The 22nd Amendment was passed in response, ensuring no future president could serve more than two terms." },
  { number: 26, title: "Voting Age Set to 18", year: 1971, category: "Voting Rights", text: "The right of citizens of the United States, who are eighteen years of age or older, to vote shall not be denied or abridged...", plain: "Any U.S. citizen who is 18 years or older has the right to vote.", example: "Passed during the Vietnam War, young people argued: if we're old enough to fight and die for our country, we're old enough to vote. Congress agreed and the amendment was ratified." },
];

const categories = ["All", ...Array.from(new Set(amendments.map((a) => a.category))).sort()];

function AmendmentCard({ amendment }) {
  const [open, setOpen] = useState(false);

  const speak = (e) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      `Amendment ${amendment.number}: ${amendment.title}. In plain English: ${amendment.plain}. Example: ${amendment.example}`
    );
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
      >
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-navy-dark flex flex-col items-center justify-center">
          <span className="text-gold/50 font-play text-[9px] uppercase tracking-widest">Amend.</span>
          <span className="text-gold font-display font-bold text-xl leading-none">{amendment.number}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-navy-dark text-base truncate">{amendment.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="font-play text-xs">{amendment.category}</Badge>
            <span className="text-xs text-muted-foreground font-play">Ratified {amendment.year}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={speak} className="p-1.5 rounded-lg bg-gold/10 text-gold-dark hover:bg-gold/20 transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-border">
          <div className="p-5 bg-navy-dark/3">
            <p className="font-play text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Original Text</p>
            <p className="font-play text-sm text-muted-foreground italic leading-relaxed">"{amendment.text}"</p>
          </div>
          <div className="p-5 border-t border-border">
            <p className="font-play text-xs font-bold text-gold-dark uppercase tracking-widest mb-2">What It Means</p>
            <p className="font-play text-sm text-foreground leading-relaxed">{amendment.plain}</p>
          </div>
          <div className="p-5 border-t border-border bg-gold/3">
            <p className="font-play text-xs font-bold text-gold-dark uppercase tracking-widest mb-2">Real-World Example</p>
            <p className="font-play text-sm text-muted-foreground leading-relaxed">{amendment.example}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Amendments() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = amendments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) || a.plain.toLowerCase().includes(q) || String(a.number).includes(q);
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy-dark mb-4">
          <FileText className="w-7 h-7 text-gold" />
        </div>
        <h1 className="font-display text-4xl font-bold text-navy-dark">Constitutional Amendments</h1>
        <p className="mt-2 text-muted-foreground font-play max-w-xl mx-auto">
          All 27 Amendments explained in plain English, with real-world examples. Click to expand, tap the speaker to listen.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search amendments..." className="pl-10 bg-white font-play" />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-play font-medium transition-colors border ${
              activeCategory === cat ? "bg-navy-dark text-gold border-navy-dark" : "bg-white text-muted-foreground border-border hover:border-navy-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => <AmendmentCard key={a.number} amendment={a} />)}
      </div>
    </div>
  );
}