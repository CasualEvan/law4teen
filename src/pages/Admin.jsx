import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/adminAuth";
import { LogOut, Newspaper, Plus, Trash2, Save, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const defaultHeadlines = [
  { title: "Supreme Court Agrees to Hear Major Free Speech Case Involving Social Media Companies", summary: "The Supreme Court will decide whether states can regulate how large social media platforms moderate content, raising major First Amendment questions.", category: "Constitutional Law", time: "2 hours ago", impact: "High", position: 0 },
  { title: "Federal Judge Blocks New Immigration Policy, Citing Due Process Violations", summary: "A federal district court has issued a temporary injunction halting enforcement of a new deportation policy, ruling it likely violates the Fifth Amendment's due process protections.", category: "Immigration Law", time: "4 hours ago", impact: "High", position: 1 },
  { title: "Teen Sues School District Over Cell Phone Search Policy", summary: "A 16-year-old student is challenging her school's policy of searching phones without a warrant, arguing it violates the Fourth Amendment protection against unreasonable searches.", category: "Student Rights", time: "6 hours ago", impact: "Medium", position: 2 },
  { title: "Congress Debates New Data Privacy Bill That Would Affect Minors Online", summary: "Legislators are pushing a bill that would give people under 18 stronger controls over their online data, building on the Children's Online Privacy Protection Act.", category: "Privacy Law", time: "8 hours ago", impact: "High", position: 3 },
  { title: "Landmark Environmental Case: Youth Activists Win Climate Lawsuit in Montana", summary: "In a historic ruling, a Montana court ruled in favor of young plaintiffs who argued the state's fossil fuel policy violated their constitutional right to a clean environment.", category: "Environmental Law", time: "1 day ago", impact: "High", position: 4 },
  { title: "New Report: Juvenile Justice Reform Reduces Recidivism Rates by 30%", summary: "A nationwide study shows that states implementing rehabilitation-focused juvenile justice programs see significantly lower rates of repeat offenses among young people.", category: "Juvenile Justice", time: "1 day ago", impact: "Medium", position: 5 },
  { title: "U.S. Sentencing Commission Proposes Reducing Mandatory Minimum Sentences", summary: "The federal Sentencing Commission has proposed new guidelines that would give judges more discretion in sentencing for non-violent drug offenses.", category: "Criminal Law", time: "2 days ago", impact: "Medium", position: 6 },
];

export default function Admin() {
  const navigate = useNavigate();
  const [headlines, setHeadlines] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate("/"); return; }
    fetchHeadlines();
  }, []);

  const fetchHeadlines = async () => {
    setLoading(true);
    const { data } = await supabase.from("headlines").select("*").order("position", { ascending: true });
    setHeadlines(data && data.length > 0 ? data : defaultHeadlines.map(h => ({ ...h })));
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Delete all existing rows then reinsert in order
    await supabase.from("headlines").delete().neq("id", 0);
    const toInsert = headlines.map((h, i) => ({
      title: h.title,
      summary: h.summary,
      category: h.category,
      time: h.time,
      impact: h.impact,
      position: i,
    }));
    await supabase.from("headlines").insert(toInsert);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    fetchHeadlines();
  };

  const handleReset = async () => {
    if (!window.confirm("Reset all headlines to defaults?")) return;
    setSaving(true);
    await supabase.from("headlines").delete().neq("id", 0);
    await supabase.from("headlines").insert(defaultHeadlines);
    setSaving(false);
    fetchHeadlines();
  };

  const handleChange = (i, field, value) => {
    setHeadlines(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: value } : h));
  };

  const handleAdd = () => {
    setHeadlines(prev => [...prev, { title: "", summary: "", category: "", time: "", impact: "Medium", position: prev.length }]);
    setExpanded(headlines.length);
  };

  const handleDelete = (i) => {
    setHeadlines(prev => prev.filter((_, idx) => idx !== i));
    setExpanded(null);
  };

  const handleLogout = () => { logoutAdmin(); navigate("/"); };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-navy-dark" />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-navy-dark sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-gold" />
            </div>
            <div>
              <span className="font-display text-white font-bold">Law4Teen Admin</span>
              <span className="ml-2 text-gold/50 font-play text-xs">Headlines Editor</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-gold/60 hover:text-gold font-play text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-dark">Manage Headlines</h1>
            <p className="font-play text-sm text-muted-foreground mt-0.5">
              {headlines.length} headline{headlines.length !== 1 ? "s" : ""} — saved to Supabase, visible to everyone
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} disabled={saving} className="font-play text-sm text-muted-foreground hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-red-200 disabled:opacity-50">
              Reset to defaults
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 font-play font-bold text-sm px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${saved ? "bg-green-500 text-white" : "bg-navy-dark text-gold hover:bg-navy-light"}`}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {headlines.map((h, i) => (
            <div key={i} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div onClick={() => setExpanded(expanded === i ? null : i)} className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-play text-xs text-muted-foreground w-5 flex-shrink-0">#{i + 1}</span>
                  <span className="font-display font-bold text-navy-dark text-sm truncate">
                    {h.title || <span className="text-muted-foreground italic font-play font-normal">Untitled headline</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className={`text-xs font-play px-2 py-0.5 rounded border font-medium ${h.impact === "High" ? "bg-red-100 text-red-700 border-red-200" : h.impact === "Low" ? "bg-green-100 text-green-700 border-green-200" : "bg-gold/10 text-gold-dark border-gold/20"}`}>
                    {h.impact}
                  </span>
                  {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>

              {expanded === i && (
                <div className="border-t border-border px-5 py-5 space-y-4">
                  <div>
                    <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Title</label>
                    <input type="text" value={h.title} onChange={(e) => handleChange(i, "title", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark" placeholder="Headline title..." />
                  </div>
                  <div>
                    <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Summary</label>
                    <textarea value={h.summary} onChange={(e) => handleChange(i, "summary", e.target.value)} rows={3} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark resize-none" placeholder="Brief summary (2 sentences)..." />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Category</label>
                      <input type="text" value={h.category} onChange={(e) => handleChange(i, "category", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark" placeholder="e.g. Student Rights" />
                    </div>
                    <div>
                      <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Time</label>
                      <input type="text" value={h.time} onChange={(e) => handleChange(i, "time", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark" placeholder="e.g. 2 hours ago" />
                    </div>
                    <div>
                      <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Impact</label>
                      <select value={h.impact} onChange={(e) => handleChange(i, "impact", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark bg-white">
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button onClick={() => handleDelete(i)} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-play text-sm transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete headline
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button onClick={handleAdd} className="w-full border-2 border-dashed border-border rounded-xl py-4 flex items-center justify-center gap-2 text-muted-foreground hover:border-navy-light hover:text-navy-dark transition-colors font-play text-sm">
          <Plus className="w-4 h-4" /> Add headline
        </button>

        <p className="text-center font-play text-xs text-muted-foreground mt-8">
          Changes are saved to Supabase and instantly visible to all visitors.
        </p>
      </div>
    </div>
  );
}
