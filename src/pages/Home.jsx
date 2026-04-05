import React from "react";
import { Link } from "react-router-dom";
import { Scale, BookOpen, Mic, Newspaper, Brain, FileText, User, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Scale,
    title: "Case of the Week",
    desc: "Deep dive into landmark legal cases explained for teens.",
    path: "/case-of-the-week",
    color: "bg-gold/10 text-gold-dark border-gold/20",
  },
  {
    icon: BookOpen,
    title: "Legal Terms",
    desc: "Plain-English definitions of complex legal vocabulary.",
    path: "/legal-terms",
    color: "bg-navy/10 text-navy border-navy/20",
  },
  {
    icon: Mic,
    title: "Voice Explanations",
    desc: "Listen to cases and legal concepts read aloud.",
    path: "/case-of-the-week",
    color: "bg-gold/10 text-gold-dark border-gold/20",
  },
  {
    icon: Newspaper,
    title: "Law Headlines",
    desc: "Today's most important legal news, simplified.",
    path: "/headlines",
    color: "bg-navy/10 text-navy border-navy/20",
  },
  {
    icon: Brain,
    title: "LSAT Practice",
    desc: "Sharpen your logic and reasoning skills.",
    path: "/lsat-practice",
    color: "bg-gold/10 text-gold-dark border-gold/20",
  },
  {
    icon: FileText,
    title: "Amendments",
    desc: "All 27 Amendments with real-world examples.",
    path: "/amendments",
    color: "bg-navy/10 text-navy border-navy/20",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-navy-dark overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: "repeating-linear-gradient(45deg, #f0c040 0, #f0c040 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }}
          />
        </div>
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-navy-light/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
            Law Made{" "}
            <span className="text-gold relative">
              Simple
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold/40" />
            </span>{" "}
            for Teens
          </h1>
          <p className="mt-6 text-gold-light/70 text-lg md:text-xl max-w-2xl mx-auto font-play leading-relaxed">
            Explore landmark cases, master legal vocabulary, practice LSAT questions, and understand your constitutional rights.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/case-of-the-week"
              className="flex items-center gap-2 bg-gold text-navy-dark font-play font-bold px-8 py-3.5 rounded-lg hover:bg-gold-light transition-colors shadow-lg shadow-gold/20"
            >
              Case of the Week <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/lsat-practice"
              className="flex items-center gap-2 bg-transparent border border-gold/30 text-gold font-play font-bold px-8 py-3.5 rounded-lg hover:bg-gold/10 transition-colors"
            >
              Try LSAT Practice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-dark">
            Everything You Need to Know About Law
          </h2>
          <p className="mt-3 text-muted-foreground font-play">
            Explore our sections designed specifically for young legal minds
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link
              key={i}
              to={f.path}
              className="group bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-navy-dark mb-2">{f.title}</h3>
              <p className="text-muted-foreground font-play text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-gold-dark text-sm font-play font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quote banner */}
      <section className="bg-navy-dark py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-display text-2xl md:text-3xl italic text-gold-light/90 leading-relaxed">
            "The law is reason, free from passion."
          </p>
          <p className="mt-4 text-gold/50 font-play text-sm">— Aristotle</p>
        </div>
      </section>
    </div>
  );
}
