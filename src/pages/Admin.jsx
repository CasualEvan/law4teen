import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";
import { LogOut, Plus, Trash2, Save, CheckCircle, ChevronDown, ChevronUp, Loader2, Scale, Upload, X, ToggleLeft, ToggleRight, User, BookOpen } from "lucide-react";

// ─── ABOUT TAB ────────────────────────────────────────────────────────────────

function AboutTab() {
  const [content, setContent] = useState("");
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("about_me").select("*").single().then(({ data }) => {
      if (data) { setContent(data.content); setRecordId(data.id); }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (recordId) {
      await supabase.from("about_me").update({ content, updated_at: new Date().toISOString() }).eq("id", recordId);
    } else {
      const { data } = await supabase.from("about_me").insert({ content }).select().single();
      if (data) setRecordId(data.id);
    }
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-navy-dark" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="font-play text-sm text-muted-foreground">Edit the bio shown on the About page. Use blank lines to separate paragraphs.</p>
        <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 font-play font-bold text-sm px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${saved ? "bg-green-500 text-white" : "bg-navy-dark text-gold hover:bg-navy-light"}`}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b border-border">
          <p className="font-play text-xs text-muted-foreground">About Me content — visible to all visitors</p>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full px-5 py-4 font-play text-sm text-navy-dark focus:outline-none resize-none leading-relaxed"
          placeholder="Write your bio here. Use blank lines between paragraphs..."
        />
      </div>
      <div className="mt-3 bg-gold/5 border border-gold/20 rounded-lg px-4 py-3">
        <p className="font-play text-xs text-gold-dark">
          <strong>Preview:</strong> Each blank line creates a new paragraph on the About page.
        </p>
      </div>
    </div>
  );
}

// ─── CASES TAB ────────────────────────────────────────────────────────────────

function CasesTab() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchCases(); }, []);

  const fetchCases = async () => {
    setLoading(true);
    const { data } = await supabase.from("cases").select("*").order("created_at", { ascending: false });
    setCases(data || []);
    setLoading(false);
  };

  const handleChange = (id, field, value) => setCases(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));

  const handleSaveCase = async (c) => {
    setSaving(c.id);
    const { id, ...fields } = c;
    if (typeof fields.key_terms === "string") {
      fields.key_terms = fields.key_terms.split(",").map(t => t.trim()).filter(Boolean);
    }
    await supabase.from("cases").update(fields).eq("id", id);
    setSaving(false); setSaved(c.id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleSetActive = async (id) => {
    await supabase.from("cases").update({ is_active: false }).neq("id", 0);
    await supabase.from("cases").update({ is_active: true }).eq("id", id);
    fetchCases();
  };

  const handleDeleteCase = async (id) => {
    if (!window.confirm("Delete this case?")) return;
    await supabase.from("cases").delete().eq("id", id);
    fetchCases();
  };

  const handleAudioUpload = async (caseId, file) => {
    setUploading(caseId);
    const ext = file.name.split(".").pop();
    const path = `${caseId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("case-audio").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("case-audio").getPublicUrl(path);
      await supabase.from("cases").update({ audio_url: urlData.publicUrl }).eq("id", caseId);
      fetchCases();
    }
    setUploading(false);
  };

  const handleRemoveAudio = async (caseId) => {
    await supabase.from("cases").update({ audio_url: null }).eq("id", caseId);
    fetchCases();
  };

  const handleAddCase = async () => {
    const blank = {
      title: "New Case", year: new Date().getFullYear().toString(), court: "U.S. Supreme Court",
      category: "Constitutional Law", outcome: "", summary: "", background: "", ruling: "",
      impact: "", key_terms: [], voice_text: "", audio_url: null,
      week_date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      is_active: false,
    };
    const { data } = await supabase.from("cases").insert(blank).select().single();
    if (data) { fetchCases(); setExpanded(data.id); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-navy-dark" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="font-play text-sm text-muted-foreground">{cases.length} case{cases.length !== 1 ? "s" : ""} — one marked active shows on the site</p>
        <button onClick={handleAddCase} className="flex items-center gap-2 bg-navy-dark text-gold font-play font-bold text-sm px-4 py-2 rounded-lg hover:bg-navy-light transition-colors">
          <Plus className="w-4 h-4" /> New Case
        </button>
      </div>
      <div className="space-y-3">
        {cases.map((c) => (
          <div key={c.id} className={`bg-white border rounded-xl overflow-hidden ${c.is_active ? "border-gold" : "border-border"}`}>
            <div onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                {c.is_active && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gold" />}
                <span className="font-display font-bold text-navy-dark text-sm truncate">{c.title}</span>
                <span className="font-play text-xs text-muted-foreground flex-shrink-0">{c.year}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {c.is_active && <span className="text-xs font-play text-gold-dark font-medium px-2 py-0.5 bg-gold/10 rounded border border-gold/20">Active</span>}
                {expanded === c.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
            {expanded === c.id && (
              <div className="border-t border-border px-5 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[["Title","title"],["Year","year"],["Court","court"],["Category","category"],["Outcome","outcome"],["Week Date","week_date"]].map(([label, field]) => (
                    <div key={field} className={field === "title" || field === "court" ? "col-span-2" : ""}>
                      <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">{label}</label>
                      <input type="text" value={c[field] || ""} onChange={e => handleChange(c.id, field, e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark" />
                    </div>
                  ))}
                </div>
                {[["Summary","summary"],["Background","background"],["The Ruling","ruling"],["Impact & Legacy","impact"]].map(([label, field]) => (
                  <div key={field}>
                    <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">{label}</label>
                    <textarea value={c[field] || ""} onChange={e => handleChange(c.id, field, e.target.value)} rows={field === "voice_text" ? 2 : 4} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark resize-none" />
                  </div>
                ))}
                <div>
                  <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Key Terms (comma-separated)</label>
                  <input type="text" value={Array.isArray(c.key_terms) ? c.key_terms.join(", ") : c.key_terms || ""} onChange={e => handleChange(c.id, "key_terms", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark" placeholder="Term 1, Term 2, Term 3" />
                </div>
                <div>
                  <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">In-Depth Audio Explanation</label>
                  {c.audio_url ? (
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <audio controls src={c.audio_url} className="flex-1" style={{ height: 32 }} />
                      <button onClick={() => handleRemoveAudio(c.id)} className="text-red-500 hover:text-red-700 flex-shrink-0"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading === c.id ? "border-gold bg-gold/5" : "border-border hover:border-navy-light"}`}>
                      {uploading === c.id ? <Loader2 className="w-5 h-5 animate-spin text-gold" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                      <span className="font-play text-sm text-muted-foreground">{uploading === c.id ? "Uploading..." : "Upload MP3 or audio file"}</span>
                      <input type="file" accept="audio/*" className="hidden" onChange={e => e.target.files[0] && handleAudioUpload(c.id, e.target.files[0])} disabled={!!uploading} />
                    </label>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button onClick={() => !c.is_active && handleSetActive(c.id)} className={`flex items-center gap-2 font-play text-sm font-medium transition-colors ${c.is_active ? "text-gold cursor-default" : "text-muted-foreground hover:text-navy-dark"}`}>
                    {c.is_active ? <ToggleRight className="w-5 h-5 text-gold" /> : <ToggleLeft className="w-5 h-5" />}
                    {c.is_active ? "Currently active" : "Set as active case"}
                  </button>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDeleteCase(c.id)} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-play text-sm transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                    <button onClick={() => handleSaveCase(c)} disabled={saving === c.id} className={`flex items-center gap-2 font-play font-bold text-sm px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${saved === c.id ? "bg-green-500 text-white" : "bg-navy-dark text-gold hover:bg-navy-light"}`}>
                      {saving === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : saved === c.id ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {saved === c.id ? "Saved!" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TERMS TAB ────────────────────────────────────────────────────────────────

const CATEGORIES = ["Constitutional Law", "Criminal Law", "Civil Law", "Court Procedure", "Evidence", "Tort Law", "Property Law", "Government", "Legal Profession", "Crimes", "Defenses & Damages", "Punishments"];

function TermsTab() {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchTerms(); }, []);

  const fetchTerms = async () => {
    setLoading(true);
    const { data } = await supabase.from("legal_terms").select("*").order("term", { ascending: true });
    setTerms(data || []);
    setLoading(false);
  };

  const handleChange = (id, field, value) =>
    setTerms(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));

  const handleSave = async (t) => {
    setSaving(t.id);
    const { id, created_at, ...fields } = t;
    await supabase.from("legal_terms").update(fields).eq("id", id);
    setSaving(null); setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this term?")) return;
    await supabase.from("legal_terms").delete().eq("id", id);
    fetchTerms();
  };

  const handleAdd = async () => {
    const blank = { term: "New Term", category: "Court Procedure", definition: "", example: "" };
    const { data } = await supabase.from("legal_terms").insert(blank).select().single();
    if (data) { fetchTerms(); setExpanded(data.id); }
  };

  const filtered = terms.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-navy-dark" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <p className="font-play text-sm text-muted-foreground">{terms.length} term{terms.length !== 1 ? "s" : ""} in the dictionary</p>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-navy-dark text-gold font-play font-bold text-sm px-4 py-2 rounded-lg hover:bg-navy-light transition-colors">
          <Plus className="w-4 h-4" /> Add Term
        </button>
      </div>

      <div className="relative mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark pl-9"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white border border-border rounded-xl overflow-hidden">
            <div onClick={() => setExpanded(expanded === t.id ? null : t.id)} className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-navy-dark flex items-center justify-center flex-shrink-0">
                  <span className="text-gold font-display font-bold text-xs">{t.term[0]}</span>
                </div>
                <div className="min-w-0">
                  <span className="font-display font-bold text-navy-dark text-sm truncate block">{t.term}</span>
                  <span className="font-play text-xs text-muted-foreground">{t.category}</span>
                </div>
              </div>
              {expanded === t.id ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </div>

            {expanded === t.id && (
              <div className="border-t border-border px-5 py-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Term</label>
                    <input type="text" value={t.term} onChange={e => handleChange(t.id, "term", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark" />
                  </div>
                  <div className="col-span-2">
                    <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Category</label>
                    <select value={t.category} onChange={e => handleChange(t.id, "category", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark bg-white">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Definition</label>
                  <textarea value={t.definition} onChange={e => handleChange(t.id, "definition", e.target.value)} rows={3} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark resize-none" />
                </div>
                <div>
                  <label className="font-play text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">Example</label>
                  <textarea value={t.example} onChange={e => handleChange(t.id, "example", e.target.value)} rows={2} className="w-full border border-border rounded-lg px-3 py-2 font-play text-sm focus:outline-none focus:ring-2 focus:ring-navy-dark resize-none" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <button onClick={() => handleDelete(t.id)} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-play text-sm transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                  <button onClick={() => handleSave(t)} disabled={saving === t.id} className={`flex items-center gap-2 font-play font-bold text-sm px-4 py-2 rounded-lg transition-all disabled:opacity-50 ${saved === t.id ? "bg-green-500 text-white" : "bg-navy-dark text-gold hover:bg-navy-light"}`}>
                    {saving === t.id ? <Loader2 className="w-4 h-4 animate-spin" /> : saved === t.id ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved === t.id ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN ADMIN ───────────────────────────────────────────────────────────────

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("cases");

  useEffect(() => { if (!isAdminLoggedIn()) navigate("/"); }, []);

  const handleLogout = () => { logoutAdmin(); navigate("/"); };

  const tabs = [
    { id: "cases", label: "Cases", icon: Scale },
    { id: "terms", label: "Legal Terms", icon: BookOpen },
    { id: "about", label: "About Me", icon: User },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-navy-dark sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
                <Scale className="w-4 h-4 text-gold" />
              </div>
              <span className="font-display text-white font-bold">Law4Teen Admin</span>
            </div>
            <div className="flex items-center gap-1 bg-navy-light/30 rounded-lg p-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-play text-sm font-medium transition-colors ${tab === id ? "bg-gold text-navy-dark" : "text-gold/60 hover:text-gold"}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-gold/60 hover:text-gold font-play text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-2xl font-bold text-navy-dark mb-6">
          {tabs.find(t => t.id === tab)?.label}
        </h1>
        {tab === "cases" && <CasesTab />}
        {tab === "terms" && <TermsTab />}
        {tab === "about" && <AboutTab />}
      </div>
    </div>
  );
}
