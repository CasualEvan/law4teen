import React, { useState, useEffect } from "react";
import { Newspaper, Volume2, Clock, Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

const impactColors = {
  High: "bg-red-100 text-red-700 border-red-200",
  Medium: "bg-gold/10 text-gold-dark border-gold/20",
  Low: "bg-green-100 text-green-700 border-green-200",
};

const classifyCategory = (text) => {
  const t = text.toLowerCase();
  if (t.includes("first amendment") || t.includes("free speech") || t.includes("constitution")) return "Constitutional Law";
  if (t.includes("immigration") || t.includes("asylum") || t.includes("deportat")) return "Immigration Law";
  if (t.includes("student") || t.includes("school") || t.includes("minor") || t.includes("juvenile")) return "Student Rights";
  if (t.includes("privacy") || t.includes("data") || t.includes("surveillance")) return "Privacy Law";
  if (t.includes("environment") || t.includes("climate") || t.includes("epa")) return "Environmental Law";
  if (t.includes("criminal") || t.includes("arrest") || t.includes("sentence") || t.includes("prison")) return "Criminal Law";
  if (t.includes("civil rights") || t.includes("discrimination") || t.includes("equal")) return "Civil Rights";
  if (t.includes("labor") || t.includes("worker") || t.includes("employment")) return "Labor Law";
  if (t.includes("election") || t.includes("voting") || t.includes("ballot")) return "Election Law";
  return "Federal Law";
};

// ✅ CLEAN API CALL (Cloudflare Function)
const fetchLiveOpinions = async () => {
  try {
    const res = await fetch("/api/news");
    return await res.json();
  } catch {
    return [];
  }
};

export default function Headlines() {
  const [adminHeadlines, setAdminHeadlines] = useState([]);
  const [liveHeadlines, setLiveHeadlines] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [loadingLive, setLoadingLive] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);
  const [liveError, setLiveError] = useState(false);

  // ✅ AUTO REFRESH
  useEffect(() => {
    fetchAdminHeadlines();
    fetchLiveHeadlines();

    const interval = setInterval(fetchLiveHeadlines, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminHeadlines = async () => {
    setLoadingAdmin(true);
    const { data } = await supabase
      .from("headlines")
      .select("*")
      .order("position", { ascending: true });

    setAdminHeadlines(data || []);
    setLoadingAdmin(false);
  };

  const fetchLiveHeadlines = async () => {
    setLoadingLive(true);
    setLiveError(false);

    const results = await fetchLiveOpinions();

    if (results.length > 0) {
      setLiveHeadlines(results);
      setLastFetched(new Date());
    } else {
      setLiveError(true);
    }

    setLoadingLive(false);
  };

  const speakHeadline = (h) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${h.title}. ${h.summary}`);
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const formatTime = (h) => {
    if (h.pubDate) {
      try {
        return formatDistanceToNow(new Date(h.pubDate), { addSuffix: true });
      } catch {}
    }
    return h.time || "";
  };

  const loading = loadingAdmin && loadingLive;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-navy-dark rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-navy-dark" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Law Headlines</h1>
              <p className="text-gold-light/60 font-play text-sm flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5" />
                {loadingLive
                  ? "Fetching live opinions..."
                  : lastFetched
                  ? `Updated ${formatDistanceToNow(lastFetched, { addSuffix: true })}`
                  : "Curated headlines"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchLiveHeadlines}
            disabled={loadingLive}
            className="flex items-center gap-2 bg-gold/10 border border-gold/20 text-gold font-play text-sm font-medium px-4 py-2 rounded-lg hover:bg-gold/20 transition-colors disabled:opacity-50"
          >
            {loadingLive ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
        </div>

        <p className="mt-4 text-gold-light/60 font-play text-sm">
          Legal news explained for teens. Click the speaker icon to hear any story read aloud.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-navy-dark" />
        </div>
      ) : (
        <>
          {adminHeadlines.length > 0 && (
            <div className="mb-8">
              <p className="font-play text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3">
                Editor's Picks
              </p>
              <div className="space-y-4">
                {adminHeadlines.map((h, i) => (
                  <HeadlineCard key={`admin-${i}`} h={h} formatTime={formatTime} speakHeadline={speakHeadline} />
                ))}
              </div>
            </div>
          )}

          {liveHeadlines.length > 0 && (
            <div>
              <p className="font-play text-xs text-muted-foreground uppercase tracking-wide font-medium mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
                Live from Federal Courts
              </p>
              <div className="space-y-4">
                {liveHeadlines.map((h, i) => (
                  <HeadlineCard key={`live-${i}`} h={h} formatTime={formatTime} speakHeadline={speakHeadline} />
                ))}
              </div>
            </div>
          )}

          {liveError && adminHeadlines.length === 0 && (
            <div className="text-center py-20 text-muted-foreground font-play">
              <p>No headlines available right now.</p>
              <button onClick={fetchLiveHeadlines} className="mt-4 text-navy-dark font-medium hover:underline">
                Try again
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function HeadlineCard({ h, formatTime, speakHeadline }) {
  return (
    <div className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold text-navy-dark mb-2">{h.title}</h2>
          <p className="text-sm text-muted-foreground">{h.summary}</p>
        </div>

        <button onClick={() => speakHeadline(h)}>
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}