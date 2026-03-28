import React, { useState, useRef } from "react";
import { Scale, Heart, BookOpen, Star, Mail, Globe, Award, Users, Target, Brain, FileText, Lock, X, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SECRET_SEQUENCE, ADMIN_USERNAME, ADMIN_PASSWORD, loginAdmin } from "@/lib/adminAuth";

const stats = [
  { icon: BookOpen, label: "Legal Terms", value: "24+" },
  { icon: FileText, label: "Amendments Covered", value: "17" },
  { icon: Brain, label: "LSAT Questions", value: "25" },
  { icon: Users, label: "Teen Learners", value: "∞" },
];

const features = [
  {
    icon: BookOpen,
    title: "Teens-First Language",
    desc: "No law degree required. Every explanation is written so a 14-year-old can understand it without a dictionary.",
  },
  {
    icon: Scale,
    title: "Real Cases, Real Stakes",
    desc: "We cover landmark Supreme Court cases and current legal news — including cases directly affecting young people.",
  },
  {
    icon: Brain,
    title: "LSAT & College Prep",
    desc: "Practice LSAT-style questions to build the logical reasoning skills needed for college applications and beyond.",
  },
  {
    icon: Heart,
    title: "Voice-Enabled Learning",
    desc: "Every case, term, and amendment can be listened to — supporting different learning styles and accessibility needs.",
  },
];

export default function About() {
  const navigate = useNavigate();
  const [clickSequence, setClickSequence] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [highlightedBoxes, setHighlightedBoxes] = useState([]);
  const sequenceTimer = useRef(null);

  const handleBoxClick = (index) => {
    const newSeq = [...clickSequence, index];

    // Highlight the clicked box briefly
    setHighlightedBoxes((prev) => [...prev, index]);
    setTimeout(() => setHighlightedBoxes((prev) => prev.filter((i) => i !== index)), 400);

    // Reset timer — if user pauses 3s, reset sequence
    if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
    sequenceTimer.current = setTimeout(() => setClickSequence([]), 3000);

    // Check if sequence matches so far
    const matchesSoFar = newSeq.every((val, i) => val === SECRET_SEQUENCE[i]);

    if (!matchesSoFar) {
      setClickSequence([]);
      return;
    }

    if (newSeq.length === SECRET_SEQUENCE.length) {
      // Full sequence matched!
      clearTimeout(sequenceTimer.current);
      setClickSequence([]);
      setShowLogin(true);
      setError("");
      setUsername("");
      setPassword("");
    } else {
      setClickSequence(newSeq);
    }
  };

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      loginAdmin();
      setShowLogin(false);
      navigate("/admin");
    } else {
      setError("Invalid credentials.");
      setTimeout(() => {
        setShowLogin(false);
        setError("");
        setUsername("");
        setPassword("");
        navigate("/");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Login modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="bg-navy-dark px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                <span className="font-display text-white font-bold">Admin Access</span>
              </div>
              <button onClick={() => setShowLogin(false)} className="text-gold/60 hover:text-gold transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {error ? (
                <div className="text-center py-4">
                  <p className="font-play text-red-600 font-medium">{error}</p>
                  <p className="font-play text-muted-foreground text-sm mt-1">Redirecting...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                        className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="w-full border border-border rounded-lg px-3 py-2 pr-10 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark"
                        />
                        <button
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy-dark"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full bg-navy-dark text-gold font-play font-bold py-2.5 rounded-lg hover:bg-navy-light transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-navy-dark py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-navy-light/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 mb-6 mx-auto">
            <Scale className="w-12 h-12 text-gold" />
          </div>
          <h1 className="font-display text-5xl font-bold text-white mb-4">About the Creator</h1>
          <p className="text-gold-light/60 font-play text-lg max-w-xl mx-auto">
            The story behind Law4Teen and the mission to make legal education accessible to every young person in America.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Creator card */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm mb-10">
          <div className="h-3 bg-gradient-to-r from-navy-dark via-navy-light to-gold" />
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-navy-dark flex items-center justify-center shadow-lg">
                  <Scale className="w-16 h-16 text-gold" />
                </div>
                <div className="mt-3 flex flex-col gap-1">
                  <a href="mailto:hello@law4teen.org" className="flex items-center gap-1.5 text-muted-foreground hover:text-navy-dark text-xs font-play transition-colors">
                    <Mail className="w-3.5 h-3.5" /> hello@law4teen.org
                  </a>
                  <a href="https://law4teen.org" className="flex items-center gap-1.5 text-muted-foreground hover:text-navy-dark text-xs font-play transition-colors">
                    <Globe className="w-3.5 h-3.5" /> law4teen.org
                  </a>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="font-play text-xs text-gold-dark font-medium uppercase tracking-wide">Founder & Creator</span>
                </div>
                <h2 className="font-display text-3xl font-bold text-navy-dark mb-4">Law4Teen.org</h2>
                <p className="font-play text-muted-foreground leading-relaxed mb-4">
                  Law4Teen was born from a simple belief: <span className="text-navy-dark font-medium">every teenager deserves to understand their legal rights and the justice system</span> — not just those whose parents are lawyers or who go to well-funded schools.
                </p>
                <p className="font-play text-muted-foreground leading-relaxed mb-4">
                  Growing up, the legal system felt like a foreign language — full of jargon, complexity, and barriers. When teens don't understand their rights, they can't exercise them. When they don't know how courts work, they can't participate in democracy. That gap inspired the creation of this platform.
                </p>
                <p className="font-play text-muted-foreground leading-relaxed">
                  Law4Teen breaks down landmark cases, constitutional amendments, legal vocabulary, and current events into language that's <span className="text-navy-dark font-medium">clear, engaging, and built for young minds</span>. Whether you're preparing for law school, studying for the LSAT, or just curious about how the law affects your life — you're in the right place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-navy-dark rounded-2xl p-8 md:p-10 mb-10 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-gold" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="font-play text-gold-light/70 leading-relaxed text-lg">
            "To empower every teenager with the legal knowledge and critical thinking skills they need to navigate the world, understand their rights, and become engaged, informed citizens."
          </p>
        </div>

        {/* What makes it different — SECRET TRIGGER ZONE */}
        <h2 className="font-display text-2xl font-bold text-navy-dark mb-6">What Makes Law4Teen Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {features.map((item, i) => (
            <div
              key={i}
              onClick={() => handleBoxClick(i)}
              className={`bg-white border rounded-xl p-6 flex items-start gap-4 cursor-pointer select-none transition-all duration-200 ${
                highlightedBoxes.includes(i)
                  ? "border-gold bg-gold/5 shadow-md scale-[1.02]"
                  : "border-border hover:shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-gold-dark" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy-dark mb-1">{item.title}</h3>
                <p className="font-play text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Join the movement */}
        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-8 text-center">
          <Award className="w-10 h-10 text-gold mx-auto mb-3" />
          <h3 className="font-display text-xl font-bold text-navy-dark mb-2">Join the Movement</h3>
          <p className="font-play text-muted-foreground max-w-lg mx-auto">
            Share Law4Teen with a friend, a classmate, or a teacher. Legal literacy is a superpower — and it should belong to everyone.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-gold fill-gold" />
            <span className="font-play text-sm text-gold-dark font-medium">Made with passion for the next generation of legal minds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
