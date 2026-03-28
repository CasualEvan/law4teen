import React, { useState, useEffect } from "react";
import { Scale, Mic, MicOff, Volume2, Calendar, Tag, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const weekCase = {
  title: "Brown v. Board of Education",
  year: "1954",
  court: "U.S. Supreme Court",
  category: "Civil Rights",
  outcome: "Unanimous (9-0)",
  summary:
    "In this landmark Supreme Court case, the justices unanimously ruled that racial segregation of children in public schools was unconstitutional. This decision overturned the 'separate but equal' doctrine established by Plessy v. Ferguson (1896) and became a catalyst for the Civil Rights Movement.",
  background:
    "Linda Brown, a young Black girl in Topeka, Kansas, was denied enrollment at an all-white elementary school near her home. Her father, Oliver Brown, along with other families, challenged the Topeka Board of Education's policy of racial segregation. The NAACP's Legal Defense Fund, led by attorney Thurgood Marshall, brought the case to the Supreme Court.",
  ruling:
    "Chief Justice Earl Warren delivered the unanimous opinion, stating: 'We conclude that in the field of public education, the doctrine of separate but equal has no place. Separate educational facilities are inherently unequal.' The Court held that segregation violated the Equal Protection Clause of the 14th Amendment.",
  impact:
    "This decision fundamentally changed American society. It desegregated public schools, inspired the Civil Rights Act of 1964, and demonstrated the power of the courts to protect individual rights. Thurgood Marshall later became the first Black Supreme Court Justice.",
  keyTerms: ["Equal Protection Clause", "14th Amendment", "Unconstitutional", "Segregation", "Precedent"],
  voiceText:
    "Brown versus Board of Education, decided in 1954, is one of the most important Supreme Court cases in American history. The Court unanimously ruled that racial segregation in public schools violated the Equal Protection Clause of the 14th Amendment. This case ended the 'separate but equal' doctrine and paved the way for the Civil Rights Movement.",
};

export default function CaseOfTheWeek() {
  const [speaking, setSpeaking] = useState(false);
  const [utterance, setUtterance] = useState(null);

  const startSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(weekCase.voiceText);
    u.rate = 0.9;
    u.pitch = 1;
    u.onend = () => setSpeaking(false);
    setUtterance(u);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 text-gold-dark font-play text-sm mb-4">
        <Calendar className="w-4 h-4" />
        <span>Week of March 28, 2026</span>
      </div>
      <div className="bg-navy-dark rounded-2xl p-8 md:p-12 text-white mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-3">{weekCase.category}</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">
              {weekCase.title}
            </h1>
            <p className="mt-2 text-gold-light/60 font-play text-sm flex items-center gap-2">
              <Scale className="w-4 h-4" /> {weekCase.court} · {weekCase.year}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-play text-xs text-gold-light/50">Ruling</span>
            <span className="font-display text-gold font-bold">{weekCase.outcome}</span>
          </div>
        </div>

        {/* Voice player */}
        <div className="mt-8 bg-navy-light/30 border border-gold/10 rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
            <Volume2 className="w-5 h-5 text-navy-dark" />
          </div>
          <div className="flex-1">
            <p className="font-play text-sm text-gold-light/80">Voice Explanation</p>
            <p className="font-play text-xs text-gold-light/40">Hear this case explained aloud</p>
          </div>
          <Button
            onClick={speaking ? stopSpeech : startSpeech}
            className={`flex items-center gap-2 font-play font-medium px-5 py-2 rounded-lg transition-colors ${
              speaking
                ? "bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30"
                : "bg-gold text-navy-dark hover:bg-gold-light"
            }`}
          >
            {speaking ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {speaking ? "Stop" : "Listen"}
          </Button>
        </div>
      </div>

      {/* Sections */}
      {[
        { label: "Case Summary", content: weekCase.summary },
        { label: "Background", content: weekCase.background },
        { label: "The Ruling", content: weekCase.ruling },
        { label: "Impact & Legacy", content: weekCase.impact },
      ].map((section) => (
        <div key={section.label} className="bg-white border border-border rounded-xl p-6 mb-4">
          <h2 className="font-display text-xl font-bold text-navy-dark mb-3">{section.label}</h2>
          <p className="font-play text-muted-foreground leading-relaxed">{section.content}</p>
        </div>
      ))}

      {/* Key Terms */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-6">
        <h2 className="font-display text-xl font-bold text-navy-dark mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-gold-dark" /> Key Legal Terms
        </h2>
        <div className="flex flex-wrap gap-2">
          {weekCase.keyTerms.map((term) => (
            <span
              key={term}
              className="bg-navy-dark text-gold font-play text-sm px-4 py-1.5 rounded-full border border-navy-light/30"
            >
              {term}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}