import React from "react";

export default function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center mb-10">
      {Icon && (
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy/10 mb-4">
          <Icon className="w-7 h-7 text-navy" />
        </div>
      )}
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-muted-foreground font-play text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gold" />
    </div>
  );
}