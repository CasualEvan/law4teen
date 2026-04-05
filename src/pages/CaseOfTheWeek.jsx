import React, { useState, useEffect, useRef } from "react";
import { Scale, Mic, MicOff, Volume2, Calendar, Tag, Loader2, Play, Pause, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const defaultCase = {
  title: "Brown v. Board of Education",
  year: "1954",
  court: "U.S. Supreme Court",
  category: "Civil Rights",
  outcome: "Unanimous (9-0)",
  summary: "In this landmark Supreme Court case, the justices unanimously ruled that racial segregation of children in public schools was unconstitutional. This decision overturned the 'separate but equal' doctrine established by Plessy v. Ferguson (1896) and became a catalyst for the Civil Rights Movement.",
  background: "Linda Brown, a young Black girl in Topeka, Kansas, was denied enrollment at an all-white elementary school near her home. Her father, Oliver Brown, along with other families, challenged the Topeka Board of Education's policy of racial segregation. The NAACP's Legal Defense Fund, led by attorney Thurgood Marshall, brought the case to the Supreme Court.",
  ruling: "Chief Justice Earl Warren delivered the unanimous opinion, stating: 'We conclude that in the field of public education, the doctrine of separate but equal has no place. Separate educational facilities are inherently unequal.' The Court held that segregation violated the Equal Protection Clause of the 14th Amendment.",
  impact: "This decision fundamentally changed American society. It desegregated public schools, inspired the Civil Rights Act of 1964, and demonstrated the power of the courts to protect individual rights. Thurgood Marshall later became the first Black Supreme Court Justice.",
  key_terms: ["Equal Protection Clause", "14th Amendment", "Unconstitutional", "Segregation", "Precedent"],
  audio_url: null,
  week_date: "March 28, 2026",
};

export default function CaseOfTheWeek() {
  const [weekCase, setWeekCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchCase();
    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const fetchCase = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cases")
      .select("*")
      .eq("is_active", true)
      .single();
    setWeekCase(data || defaultCase);
    setLoading(false);
  };

  const startSpeech = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(weekCase.voice_text);
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-40">
      <Loader2 className="w-6 h-6 animate-spin text-navy-dark" />
    </div>
  );

  const c = weekCase;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-gold-dark font-play text-sm mb-4">
        <Calendar className="w-4 h-4" />
        <span>Week of {c.week_date}</span>
      </div>

      <div className="bg-navy-dark rounded-2xl p-8 md:p-12 text-white mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <Badge className="bg-gold/20 text-gold border-gold/30 mb-3">{c.category}</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight">{c.title}</h1>
            <p className="mt-2 text-gold-light/60 font-play text-sm flex items-center gap-2">
              <Scale className="w-4 h-4" /> {c.court} · {c.year}
            </p>
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="font-play text-xs text-gold-light/50">Ruling</span>
            <span className="font-display text-gold font-bold">{c.outcome}</span>
          </div>
        </div>
        {/* Uploaded audio player */}
        {c.audio_url && (
          <div className="mt-4 bg-navy-light/30 border border-gold/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-play text-sm text-gold-light/80">In-Depth Audio Explanation</p>
              <p className="font-play text-xs text-gold-light/40">Audio on the go</p>
            </div>
            <audio
              ref={audioRef}
              src={c.audio_url}
              onEnded={() => setAudioPlaying(false)}
              onPause={() => setAudioPlaying(false)}
              onPlay={() => setAudioPlaying(true)}
            />
            <Button
              onClick={toggleAudio}
              className="flex items-center gap-2 font-play font-medium px-5 py-2 rounded-lg bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30 transition-colors"
            >
              {audioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {audioPlaying ? "Pause" : "Play"}
            </Button>
          </div>
        )}
      </div>

      {/* Sections */}
      {[
        { label: "Case Summary", content: c.summary },
        { label: "Background", content: c.background },
        { label: "The Ruling", content: c.ruling },
        { label: "Impact & Legacy", content: c.impact },
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
          {(c.key_terms || []).map((term) => (
            <span key={term} className="bg-navy-dark text-gold font-play text-sm px-4 py-1.5 rounded-full border border-navy-light/30">
              {term}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
