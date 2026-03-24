"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search, Loader2, TrendingUp, Star, ChevronDown, X,
  Briefcase, GraduationCap, ArrowRight, Sparkles, User,
} from "lucide-react";
import { useUser } from "../context/UserContext";  // adjust path

/* ─── Domain Config ─────────────────────────────────────────── */
const DOMAINS = [
  { label: "All Fields", value: "all", emoji: "✦", color: "#a8a9f2" },
  { label: "Technology", value: "Technology", emoji: "💻", color: "#a7c7fc" },
  { label: "Medicine",   value: "Medicine",   emoji: "🩺", color: "#fda8a8" },
  { label: "Engineering",value: "Engineering",emoji: "⚙️", color: "#f59e0b" },
  { label: "Finance",    value: "Finance",    emoji: "💰", color: "#85b5a5" },
  { label: "Law",        value: "Law",        emoji: "⚖️", color: "#bda8ef" },
  { label: "Arts & Design",value:"Arts",      emoji: "🎨", color: "#e99cc2" },
  { label: "Education",  value: "Education",  emoji: "📚", color: "#84b8b2" },
  { label: "Business",   value: "Business",   emoji: "📊", color: "#f2b991" },
];

const SORT_OPTIONS = [
  { label: "Best Match",     value: "relevance",   icon: "✦" },
  { label: "Highest Pay",    value: "salary_desc", icon: "↑" },
  { label: "Lowest Pay",     value: "salary_asc",  icon: "↓" },
  { label: "Bright Outlook", value: "outlook",     icon: "★" },
];

const DOMAIN_STYLES: Record<string, any> = {
  Technology: { bg:"#eff6ff", text:"#1d4ed8", border:"#bfdbfe", pill:"#dbeafe" },
  Medicine:   { bg:"#fff1f2", text:"#be123c", border:"#fecdd3", pill:"#ffe4e6" },
  Engineering:{ bg:"#fffbeb", text:"#b45309", border:"#fde68a", pill:"#fef3c7" },
  Finance:    { bg:"#ecfdf5", text:"#065f46", border:"#a7f3d0", pill:"#d1fae5" },
  Law:        { bg:"#f5f3ff", text:"#5b21b6", border:"#ddd6fe", pill:"#ede9fe" },
  Arts:       { bg:"#fdf2f8", text:"#9d174d", border:"#fbcfe8", pill:"#fce7f3" },
  Education:  { bg:"#f0fdfa", text:"#0f766e", border:"#99f6e4", pill:"#ccfbf1" },
  Business:   { bg:"#fff7ed", text:"#c2410c", border:"#fed7aa", pill:"#ffedd5" },
};
const DEFAULT_STYLE = { bg:"#f0f9ff", text:"#0369a1", border:"#bae6fd", pill:"#e0f2fe" };

function fmt(n: number | undefined | null) {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);
}

/* ─── Career Card ────────────────────────────────────────────── */
function CareerCard({ career, index, highlighted = false }: { career: any; index: number; highlighted?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const s = DOMAIN_STYLES[career.domain] || DEFAULT_STYLE;
  const median = fmt(career.salary?.median);
  const low    = fmt(career.salary?.low);
  const high   = fmt(career.salary?.high);

  return (
    <Link href={`/careers/${career.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: highlighted ? "linear-gradient(145deg,#eff6ff,#f5f3ff)" : "#fff",
          borderRadius: 20,
          border: highlighted
            ? `2px solid ${hovered ? "#6366f1" : "#c7d2fe"}`
            : `1.5px solid ${hovered ? s.border : "#e5e7eb"}`,
          padding: "24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: hovered
            ? highlighted
              ? "0 20px 60px rgba(99,102,241,0.22)"
              : `0 20px 60px rgba(99,102,241,0.12), 0 0 0 1px ${s.border}`
            : highlighted
              ? "0 4px 20px rgba(99,102,241,0.12)"
              : "0 2px 12px rgba(0,0,0,0.05)",
          animationDelay: `${index * 60}ms`,
          animation: "cardIn 0.5s ease forwards",
          opacity: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Highlighted accent */}
        {highlighted && (
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius:"20px 20px 0 0" }} />
        )}
        {/* Hover accent (non-highlighted) */}
        {!highlighted && (
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${s.text}, transparent)`, borderRadius:"20px 20px 0 0", opacity: hovered ? 1 : 0, transition:"opacity 0.3s" }} />
        )}

        {/* Top row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8 }}>
          <div style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.text, borderRadius:10, padding:"6px 12px", fontSize:12, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase", flexShrink:0 }}>
            {career.domain || "General"}
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
            {highlighted && (
              <span style={{ display:"flex", alignItems:"center", gap:4, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
                ✦ For You
              </span>
            )}
            {career.bright_outlook && (
              <span style={{ display:"flex", alignItems:"center", gap:4, background:"#fef9c3", color:"#854d0e", border:"1px solid #fde047", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>
                <Star size={9} fill="#eab308" color="#eab308" /> Bright
              </span>
            )}
            {career.in_demand && (
              <span style={{ background:"#dcfce7", color:"#166534", border:"1px solid #86efac", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>🔥 Hot</span>
            )}
          </div>
        </div>

        <h3 style={{ marginTop:16, fontSize:18, fontWeight:800, color: hovered && highlighted ? "#4338ca" : hovered ? s.text : "#111827", lineHeight:1.3, fontFamily:"'Playfair Display', Georgia, serif", transition:"color 0.2s" }}>
          {career.title}
        </h3>

        {career.description && (
          <p style={{ marginTop:8, fontSize:13, color:"#6b7280", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {career.description}
          </p>
        )}

        {median && (
          <div style={{ marginTop:16, padding:"12px 16px", background:s.bg, borderRadius:12, border:`1px solid ${s.border}` }}>
            <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
              <span style={{ fontSize:22, fontWeight:900, color:"#111827", fontFamily:"monospace" }}>{median}</span>
              <span style={{ fontSize:11, color:"#9ca3af", fontWeight:500 }}>/ year</span>
            </div>
            {low && high && <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>Range: {low} — {high}</div>}
          </div>
        )}

        {career.education && (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12 }}>
            <GraduationCap size={13} color="#9ca3af" />
            <span style={{ fontSize:12, color:"#6b7280", fontWeight:500 }}>{career.education}</span>
          </div>
        )}

        {career.skills?.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:14 }}>
            {career.skills.slice(0, 4).map((skill: string) => (
              <span key={skill} style={{ background:s.pill, color:s.text, borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600, border:`1px solid ${s.border}` }}>{skill}</span>
            ))}
            {career.skills.length > 4 && <span style={{ background:"#f3f4f6", color:"#6b7280", borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:600 }}>+{career.skills.length-4}</span>}
          </div>
        )}

        <div style={{ marginTop:"auto", paddingTop:16, borderTop:"1px solid #f3f4f6", display:"flex", alignItems:"center", justifyContent:"space-between", marginBlockStart:16 }}>
          <span style={{ fontSize:11, color:"#d1d5db", fontFamily:"monospace" }}>#{career.id}</span>
          <span style={{ display:"flex", alignItems:"center", gap: hovered ? 8 : 4, fontSize:13, fontWeight:700, color: highlighted ? "#4338ca" : s.text, transition:"gap 0.2s" }}>
            Explore <ArrowRight size={14} />
          </span>
        </div>

        <style>{`
          @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
      </div>
    </Link>
  );
}

/* ─── Personalised Banner ─────────────────────────────────────── */
function PersonalisedBanner({ name, topCareers }: { name: string; topCareers: string[] }) {
  return (
    <div style={{
      background: "linear-gradient(135deg,#eff6ff,#f5f3ff)",
      border: "1.5px solid #c7d2fe", borderRadius: 20, padding: "20px 24px",
      marginBottom: 24, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <User size={20} color="#fff" />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 800, fontSize: "0.9rem", color: "#1e1b4b", margin: "0 0 0.2rem" }}>
          Hi {name}! We've highlighted your top matches below.
        </p>
        <p style={{ fontSize: "0.75rem", color: "#6366f1", margin: 0 }}>
          Based on your assessment: {topCareers.slice(0, 3).join(" · ")}
          {topCareers.length > 3 ? ` +${topCareers.length - 3} more` : ""}
        </p>
      </div>
      <Link href="/profile" style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", textDecoration: "none", border: "1.5px solid #c7d2fe", borderRadius: 99, padding: "0.35rem 0.85rem", background: "#fff", whiteSpace: "nowrap" }}>
        View Profile →
      </Link>
    </div>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar({ total, loaded }: { total: number; loaded: number }) {
  return (
    <div style={{ display:"flex", gap:24, padding:"16px 24px", background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", marginBottom:24, alignItems:"center", boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
      {[
        { icon:"🎯", label:"Careers Found", value:loaded },
        { icon:"📊", label:"Total in O*NET", value:`${total}+` },
        { icon:"🇺🇸", label:"Data Source", value:"U.S. Dept. of Labor" },
        { icon:"🔄", label:"Updated", value:"Live" },
      ].map(s => (
        <div key={s.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize:11, color:"#9ca3af", fontWeight:500 }}>{s.label}</div>
            <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Background Orbs ─────────────────────────────────────────── */
function Background() {
  return (
    <div style={{ position:"absolute", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 70%)", top:"-200px", left:"-100px", animation:"drift1 18s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)", bottom:"10%", right:"-100px", animation:"drift2 22s ease-in-out infinite" }} />
      <style>{`
        @keyframes drift1{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,30px)}}
        @keyframes drift2{0%,100%{transform:translate(0,0)}50%{transform:translate(-30px,20px)}}
      `}</style>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ExploreCareersPage() {
  const { userData, topCareers, isAssessed } = useUser();

  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebounced]   = useState("");
  const [activeDomain, setActiveDomain]   = useState("all");
  const [sort, setSort]                   = useState("relevance");
  const [careers, setCareers]             = useState<any[]>([]);
  const [recCareers, setRecCareers]       = useState<any[]>([]);  // personalised
  const [loading, setLoading]             = useState(true);
  const [recLoading, setRecLoading]       = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [total, setTotal]                 = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ── Fetch recommended careers for this user ─────────────────────────────── */
  useEffect(() => {
    if (!isAssessed || topCareers.length === 0) return;
    setRecLoading(true);
    // Search O*NET for each top career name, collect first result
    Promise.allSettled(
      topCareers.slice(0, 6).map(name =>
        fetch(`/api/careers?keyword=${encodeURIComponent(name)}&limit=1`)
          .then(r => r.json())
          .then(d => (d.careers || [])[0])
      )
    ).then(results => {
      const found = results
        .filter(r => r.status === "fulfilled" && (r as any).value)
        .map(r => (r as any).value)
        // deduplicate by id
        .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);
      setRecCareers(found);
    }).finally(() => setRecLoading(false));
  }, [isAssessed, topCareers.join(",")]);

  /* ── Fetch all careers ───────────────────────────────────────────────────── */
  const fetchCareers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (activeDomain !== "all") params.set("domain", activeDomain);
      if (debouncedSearch) params.set("keyword", debouncedSearch);
      const res = await fetch(`/api/careers?${params}`);
      if (!res.ok) throw new Error("Failed to fetch careers");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      let sorted = [...(data.careers || [])];
      if (sort === "salary_asc")  sorted.sort((a, b) => (a.salary?.median||0) - (b.salary?.median||0));
      if (sort === "salary_desc") sorted.sort((a, b) => (b.salary?.median||0) - (a.salary?.median||0));
      if (sort === "outlook")     sorted.sort((a, b) => (b.bright_outlook?1:0) - (a.bright_outlook?1:0));
      // Remove any careers already in recommended list so there are no duplicates
      const recIds = new Set(recCareers.map(c => c.id));
      setCareers(sorted.filter(c => !recIds.has(c.id)));
      setTotal(data.total || sorted.length);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, [activeDomain, debouncedSearch, sort, recCareers]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const activeDomainData = DOMAINS.find(d => d.value === activeDomain);

  return (
    <div style={{ background:"#f8f7f4", fontFamily:"'DM Sans', sans-serif", position:"relative", isolation:"isolate" }}>
      <Background />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&family=DM+Mono&display=swap');
        *{box-sizing:border-box}
      `}</style>

      {/* ── HERO ───────────────────────────────────────────── */}
      <div className="bg-sky-900" style={{ position:"relative", zIndex:1, overflow:"hidden", paddingBottom:60 }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
        <div style={{ position:"relative", maxWidth:900, margin:"0 auto", padding:"80px 24px 0" }}>

          <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)", color:"#e0f2fe", borderRadius:100, padding:"8px 20px", fontSize:13, fontWeight:600, backdropFilter:"blur(8px)" }}>
              <Sparkles size={14} /> Powered by O*NET · U.S. Department of Labor
            </div>
          </div>

          <h1 style={{ textAlign:"center", fontSize:"clamp(36px,6vw,64px)", fontFamily:"'Playfair Display',serif", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:16 }}>
            Discover Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400" style={{ WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Perfect Career
            </span>
          </h1>

          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.75)", fontSize:17, lineHeight:1.7, maxWidth:560, margin:"0 auto 36px" }}>
            Explore thousands of real career paths with live salary data, growth outlooks, and the skills you'll need to succeed.
          </p>

          {/* Search */}
          <div style={{ position:"relative", maxWidth:680, margin:"0 auto", transition:"transform 0.2s", transform: searchFocused ? "scale(1.02)" : "scale(1)" }}>
            <div style={{ position:"absolute", inset:-2, borderRadius:20, background: searchFocused ? "linear-gradient(135deg,#38bdf8,#818cf8)" : "transparent", transition:"all 0.3s", zIndex:-1 }} />
            <div style={{ display:"flex", alignItems:"center", background:"#ffffff", borderRadius:18, padding:"16px 20px", gap:12, boxShadow: searchFocused ? "0 20px 60px rgba(0,0,0,0.35)" : "0 8px 30px rgba(0,0,0,0.25)" }}>
              <Search size={20} color={searchFocused ? "#0ea5e9" : "#9ca3af"} style={{ transition:"color 0.2s", flexShrink:0 }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                placeholder="Search by career, skill, or keyword..."
                style={{ flex:1, border:"none", outline:"none", fontSize:16, color:"#111827", background:"transparent", fontFamily:"'DM Sans',sans-serif" }} />
              {search && (
                <button onClick={() => setSearch("")} style={{ background:"#f0f9ff", border:"none", borderRadius:"50%", width:28, height:28, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#0369a1" }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Domain pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", marginTop:28 }}>
            {DOMAINS.map(d => (
              <button key={d.value} onClick={() => setActiveDomain(d.value)}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 18px", borderRadius:100, fontSize:13, fontWeight:600, cursor:"pointer", border: activeDomain === d.value ? `1.5px solid ${d.color}` : "1.5px solid rgba(255,255,255,0.25)", background: activeDomain === d.value ? `${d.color}30` : "rgba(255,255,255,0.12)", color: activeDomain === d.value ? d.color : "#e5e7eb", backdropFilter:"blur(8px)" }}>
                <span>{d.emoji}</span> {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"40px 24px" }}>

        {/* Personalised banner */}
        {isAssessed && topCareers.length > 0 && (
          <PersonalisedBanner name={userData.name.split(" ")[0] || "there"} topCareers={topCareers} />
        )}

        {/* ── RECOMMENDED SECTION ─────────────────────────── */}
        {isAssessed && (recLoading || recCareers.length > 0) && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Sparkles size={13} color="#fff" />
              </div>
              <h2 style={{ fontSize:"1rem", fontWeight:800, color:"#1e1b4b", margin:0 }}>Recommended For You</h2>
              <span style={{ fontSize:"0.72rem", color:"#6366f1", background:"#ede9fe", borderRadius:99, padding:"0.2rem 0.6rem", fontWeight:700 }}>Based on your assessment</span>
            </div>

            {recLoading ? (
              <div style={{ display:"flex", gap:16, overflowX:"auto", paddingBottom:8 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ minWidth:280, height:220, borderRadius:20, background:"linear-gradient(135deg,#e2e8f0,#f1f5f9)", flexShrink:0, animation:"pulse 1.5s ease infinite" }} />
                ))}
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
                {recCareers.map((career, i) => (
                  <CareerCard key={career.id} career={career} index={i} highlighted />
                ))}
              </div>
            )}

            <div style={{ height:1, background:"linear-gradient(90deg,transparent,#e2e8f0,transparent)", margin:"32px 0 24px" }} />
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {activeDomain !== "all" && (
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:100, padding:"6px 16px", fontSize:13, fontWeight:600, color:"#374151" }}>
                <span>{activeDomainData?.emoji}</span>
                {activeDomainData?.label}
                <button onClick={() => setActiveDomain("all")} style={{ background:"none", border:"none", cursor:"pointer", color:"#9ca3af", display:"flex", marginLeft:4 }}>
                  <X size={12} />
                </button>
              </div>
            )}
            <p style={{ fontSize:13, color:"#9ca3af" }}>
              {loading ? "Fetching careers..." : `${careers.length} of ${total}+ careers`}
            </p>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setSort(opt.value)}
                style={{ padding:"6px 14px", borderRadius:100, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.2s", border: sort === opt.value ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb", background: sort === opt.value ? "#6366f1" : "#fff", color: sort === opt.value ? "#fff" : "#6b7280" }}>
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 0", gap:16, color:"#9ca3af" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center", animation:"spin 1s linear infinite" }}>
              <Loader2 size={32} color="#fff" />
            </div>
            <p style={{ fontSize:14, fontWeight:500 }}>Fetching live career data from O*NET...</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {error && (
          <div style={{ textAlign:"center", padding:"60px 24px", background:"#fff1f2", borderRadius:20, border:"1.5px solid #fecdd3" }}>
            <div style={{ fontSize:48, marginBottom:16 }}>⚠️</div>
            <p style={{ color:"#be123c", fontWeight:700, fontSize:16 }}>{error}</p>
            <button onClick={fetchCareers} style={{ marginTop:20, background:"#6366f1", color:"#fff", border:"none", borderRadius:12, padding:"10px 24px", fontWeight:600, fontSize:14, cursor:"pointer" }}>Try Again</button>
          </div>
        )}

        {!loading && !error && careers.length === 0 && !debouncedSearch && (
          <div style={{ textAlign:"center", padding:"100px 24px" }}>
            <div style={{ fontSize:64, marginBottom:20 }}>🔍</div>
            <h3 style={{ fontSize:22, fontWeight:800, color:"#111827", fontFamily:"'Playfair Display',serif" }}>No careers found</h3>
            <p style={{ color:"#6b7280", marginTop:8 }}>Try a different keyword or clear the domain filter</p>
            <button onClick={() => { setSearch(""); setActiveDomain("all"); }} style={{ marginTop:20, background:"#6366f1", color:"#fff", border:"none", borderRadius:12, padding:"10px 24px", fontWeight:600, fontSize:14, cursor:"pointer" }}>Clear Filters</button>
          </div>
        )}

        {!loading && !error && careers.length > 0 && (
          <>
            <StatsBar total={total} loaded={careers.length} />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:20 }}>
              {careers.map((career, i) => <CareerCard key={career.id} career={career} index={i} />)}
            </div>
          </>
        )}
      </div>

      {/* Not assessed CTA */}
      {!isAssessed && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:50 }}>
          <Link href="/aptitude-test" style={{ display:"flex", alignItems:"center", gap:8, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", borderRadius:99, padding:"12px 22px", fontWeight:700, fontSize:13, textDecoration:"none", boxShadow:"0 8px 24px rgba(99,102,241,0.4)", transition:"transform 0.2s" }}>
            <Sparkles size={14} /> Take Assessment for Personal Matches
          </Link>
        </div>
      )}
    </div>
  );
}