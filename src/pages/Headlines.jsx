import React, { useState, useEffect } from "react";
import { Newspaper, Volume2, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const defaultHeadlines = [
  {
    title: "Supreme Court Agrees to Hear Major Free Speech Case Involving Social Media Companies",
    summary: "The Supreme Court will decide whether states can regulate how large social media platforms moderate content, raising major First Amendment questions.",
    category: "Constitutional Law",
    time: "2 hours ago",
    impact: "High",
  },
  {
    title: "Federal Judge Blocks New Immigration Policy, Citing Due Process Violations",
    summary: "A federal district court has issued a temporary injunction halting enforcement of a new deportation policy, ruling it likely violates the Fifth Amendment's due process protections.",
    category: "Immigration Law",
    time: "4 hours ago",
    impact: "High",
  },
  {
    title: "Teen Sues School District Over Cell Phone Search Policy",
    summary: "A 16-year-old student is challenging her school's policy of searching phones without a warrant, arguing it violates the Fourth Amendment protection against unreasonable searches.",
    category: "Student Rights",
    time: "6 hours ago",
    impact: "Medium",
  },
  {
    title: "Congress Debates New Data Privacy Bill That Would Affect Minors Online",
    summary: "Legislators are pushing a bill that would give people under 18 stronger controls over their online data, building on the Children's Online Privacy Protection Act.",
    category: "Privacy Law",
    time: "8 hours ago",
    impact: "High",
  },
  {
    title: "Landmark Environmental Case: Youth Activists Win Climate Lawsuit in Montana",
    summary: "In a historic ruling, a Montana court ruled in favor of young plaintiffs who argued the state's fossil fuel policy violated their constitutional right to a clean environment.",
    category: "Environmental Law",
    time: "1 day ago",
    impact: "High",
  },
  {
    title: "New Report: Juvenile Justice Reform Reduces Recidivism Rates by 30%",
    summary: "A nationwide study shows that states implementing rehabilitation-focused juvenile justice programs see significantly lower rates of repeat offenses among young people.",
    category: "Juvenile Justice",
    time: "1 day ago",
    impact: "Medium",
  },
  {
    title: "U.S. Sentencing Commission Proposes Reducing Mandatory Minimum Sentences",
    summary: "The federal Sentencing Commission has proposed new guidelines that would give judges more discretion in sentencing for non-violent drug offenses.",
    category: "Criminal Law",
    time: "2 days ago",
    impact: "Medium",
  },
];

const impactColors = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-gold/10 text-gold-dark border-gold/20",
  Low: "bg-green-100 text-green-700 border-green-200",
};

export default function Headlines() {
  const [headlines, setHeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("headlines")
      .select("*")
      .order("position", { ascending: true });

    if (error || !data || data.length === 0) {
      setHeadlines(defaultHeadlines);
    } else {
      setHeadlines(data);
    }
    setLoading(false);
  };

  const speakHeadline = (h) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${h.title}. ${h.summary}`);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-navy-dark rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-navy-dark" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Law Headlines</h1>
            <p className="text-gold-light/60 font-play text-sm flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" /> Legal news, explained for teens
            </p>
          </div>
        </div>
        <p className="mt-4 text-gold-light/60 font-play text-sm">
          Click the speaker icon to hear any story read aloud.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-navy-dark" />
        </div>
      ) : (
        <div className="space-y-4">
          {headlines.map((h, i) => (
            <div key={h.id || i} className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant="outline" className="font-play text-xs">{h.category}</Badge>
                    <span className={`text-xs font-play px-2 py-0.5 rounded border font-medium ${impactColors[h.impact] || impactColors.Medium}`}>
                      {h.impact} Impact
                    </span>
                    <span className="text-xs text-muted-foreground font-play">{h.time}</span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-navy-dark leading-snug mb-2">{h.title}</h2>
                  <p className="font-play text-sm text-muted-foreground leading-relaxed">{h.summary}</p>
                </div>
                <button
                  onClick={() => speakHeadline(h)}
                  className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold/10 text-gold-dark hover:bg-gold/20 transition-colors flex items-center justify-center"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
