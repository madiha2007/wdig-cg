"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2, TrendingUp, Star, X, GraduationCap, ArrowRight, Sparkles, ExternalLink, CheckCircle2, BookOpen } from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expand-media";

/* ─── Domain Config ─────────────────────────────────────────── */
const DOMAINS = [
  { label: "All Fields",    value: "all",         emoji: "✦", color: "#a78bfa" },
  { label: "Technology",    value: "Technology",   emoji: "💻", color: "#818cf8" },
  { label: "Medicine",      value: "Medicine",     emoji: "🩺", color: "#f472b6" },
  { label: "Engineering",   value: "Engineering",  emoji: "⚙️", color: "#fb923c" },
  { label: "Finance",       value: "Finance",      emoji: "💰", color: "#34d399" },
  { label: "Law",           value: "Law",          emoji: "⚖️", color: "#c084fc" },
  { label: "Arts & Design", value: "Arts",         emoji: "🎨", color: "#f9a8d4" },
  { label: "Education",     value: "Education",    emoji: "📚", color: "#67e8f9" },
  { label: "Business",      value: "Business",     emoji: "📊", color: "#fbbf24" },
];

const SORT_OPTIONS = [
  { label: "Best Match",     value: "relevance",   icon: "✦" },
  { label: "Highest Pay",    value: "salary_desc", icon: "↑" },
  { label: "Lowest Pay",     value: "salary_asc",  icon: "↓" },
  { label: "Bright Outlook", value: "outlook",     icon: "★" },
];

/* ─── Per-domain glassmorphism tints ────────────────────────── */
const DOMAIN_GLASS: Record<string, { from: string; to: string; accent: string; text: string; border: string }> = {
  Technology:  { from: "#ede9fe", to: "#fdf2f8", accent: "#7c3aed", text: "#6d28d9", border: "rgba(124,58,237,0.18)" },
  Medicine:    { from: "#fdf2f8", to: "#fce7f3", accent: "#ec4899", text: "#9d174d", border: "rgba(236,72,153,0.18)" },
  Engineering: { from: "#fff7ed", to: "#fef9c3", accent: "#f97316", text: "#c2410c", border: "rgba(249,115,22,0.18)"  },
  Finance:     { from: "#ecfdf5", to: "#d1fae5", accent: "#10b981", text: "#065f46", border: "rgba(16,185,129,0.18)"  },
  Law:         { from: "#faf5ff", to: "#ede9fe", accent: "#8b5cf6", text: "#7e22ce", border: "rgba(139,92,246,0.18)"  },
  Arts:        { from: "#fdf2f8", to: "#fce7f3", accent: "#ec4899", text: "#9d174d", border: "rgba(236,72,153,0.18)"  },
  Education:   { from: "#ecfeff", to: "#cffafe", accent: "#06b6d4", text: "#0e7490", border: "rgba(6,182,212,0.18)"   },
  Business:    { from: "#fffbeb", to: "#fef3c7", accent: "#f59e0b", text: "#b45309", border: "rgba(245,158,11,0.18)"  },
};
const DEFAULT_GLASS = { from: "#f5f3ff", to: "#fdf2f8", accent: "#7c3aed", text: "#6d28d9", border: "rgba(124,58,237,0.18)" };

const KNOWLEDGE_COLORS = [
  { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
  { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
  { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
  { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc" },
];

function fmt(n?: number | null) {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmtDash(n?: number | null) { return fmt(n) ?? "—"; }

/* ─── Career Card ───────────────────────────────────────────── */
function CareerCard({ career, index, onOpen }: { career: any; index: number; onOpen: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const g = DOMAIN_GLASS[career.domain] || DEFAULT_GLASS;
  const median = fmt(career.salary?.median);
  const low    = fmt(career.salary?.low);
  const high   = fmt(career.salary?.high);

  return (
    <div
      onClick={() => onOpen(career.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? `linear-gradient(145deg, ${g.from} 0%, ${g.to} 100%)`
          : `linear-gradient(145deg, rgba(255,255,255,0.95) 0%, ${g.from}88 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 24,
        border: hovered ? `1.5px solid ${g.border}` : "1.5px solid rgba(255,255,255,0.8)",
        padding: "24px",
        height: "100%",
        display: "flex", flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "translateY(-8px) scale(1.015)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? `0 24px 64px ${g.accent}22, 0 4px 16px rgba(0,0,0,0.06)`
          : "0 2px 16px rgba(0,0,0,0.05)",
        position: "relative", overflow: "hidden",
        opacity: 0,
        animation: `cardIn 0.5s ease ${index * 60}ms forwards`,
      }}
    >
      {/* Top color strip */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${g.accent},${g.accent}88)`, borderRadius: "24px 24px 0 0", opacity: hovered ? 1 : 0, transition: "opacity 0.3s" }} />
      {/* Soft orb */}
      <div style={{ position: "absolute", bottom: -40, right: -40, width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle,${g.accent}18 0%,transparent 70%)`, pointerEvents: "none", opacity: hovered ? 1 : 0.4, transition: "opacity 0.3s" }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <span style={{ background: `${g.accent}15`, border: `1px solid ${g.accent}30`, color: g.text, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" }}>
          {career.domain || "General"}
        </span>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {career.bright_outlook && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, background: "#fef9c3", color: "#854d0e", border: "1px solid #fde04788", borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>
              <Star size={9} fill="#eab308" color="#eab308" /> Bright
            </span>
          )}
          {career.in_demand && (
            <span style={{ background: "#fce7f3", color: "#9d174d", border: "1px solid #fbcfe888", borderRadius: 20, padding: "3px 9px", fontSize: 11, fontWeight: 600 }}>🔥 Hot</span>
          )}
        </div>
      </div>

      <h3 style={{ fontSize: 19, fontWeight: 800, color: hovered ? g.accent : "#111827", lineHeight: 1.3, fontFamily: "'Lora',Georgia,serif", transition: "color 0.25s", marginBottom: 8 }}>
        {career.title}
      </h3>

      {career.description && (
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: 14 } as any}>
          {career.description}
        </p>
      )}

      {median && (
        <div style={{ padding: "14px 16px", background: hovered ? `${g.accent}10` : "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderRadius: 14, border: `1px solid ${hovered ? g.accent + "30" : "rgba(0,0,0,0.06)"}`, marginBottom: 12, transition: "all 0.3s" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{median}</span>
            <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>/ year</span>
          </div>
          {low && high && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>Range: {low} — {high}</div>}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
        {career.education && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <GraduationCap size={12} color={g.accent} />
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{career.education}</span>
          </div>
        )}
        {career.growth && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
            <TrendingUp size={12} color={g.accent} style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as any}>{career.growth}</span>
          </div>
        )}
      </div>

      {career.skills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {career.skills.slice(0, 3).map((skill: string) => (
            <span key={skill} style={{ background: `${g.accent}12`, border: `1px solid ${g.accent}25`, color: g.text, borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>{skill}</span>
          ))}
          {career.skills.length > 3 && (
            <span style={{ background: "rgba(0,0,0,0.04)", color: "#9ca3af", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600 }}>+{career.skills.length - 3}</span>
          )}
        </div>
      )}

      <div style={{ marginTop: "auto", paddingTop: 14, borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: "#d1d5db", fontFamily: "monospace" }}>#{career.id}</span>
        <span style={{ display: "flex", alignItems: "center", gap: hovered ? 8 : 4, fontSize: 13, fontWeight: 700, color: g.accent, transition: "gap 0.2s" }}>
          Explore <ArrowRight size={14} />
        </span>
      </div>
    </div>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar({ total, loaded }: { total: number; loaded: number }) {
  return (
    <div style={{ display: "flex", gap: 24, padding: "16px 24px", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)", borderRadius: 16, border: "1px solid rgba(124,58,237,0.1)", marginBottom: 24, alignItems: "center", boxShadow: "0 1px 8px rgba(124,58,237,0.05)", flexWrap: "wrap" }}>
      {[
        { icon: "🎯", label: "Careers Found",  value: loaded },
        { icon: "📊", label: "Total in O*NET", value: `${total}+` },
        { icon: "🇺🇸", label: "Data Source",    value: "U.S. Dept. of Labor" },
        { icon: "🔄", label: "Updated",         value: "Live" },
      ].map(s => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Career Detail Modal ───────────────────────────────────── */
// Fetches from the SAME getCareerDetails logic via a new /api/careers/[id] route
// The id passed here is the raw O*NET code e.g. "15-1252.00"
function CareerDetailModal({ careerId, onClose }: { careerId: string; onClose: () => void }) {
  const [career, setCareer]   = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    setLoading(true); setError(false); setCareer(null);
    fetch(`/api/careers/${encodeURIComponent(careerId)}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { if (d.error) throw new Error(); setCareer(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [careerId]);

  const g = (career?.domain && DOMAIN_GLASS[career.domain]) || DEFAULT_GLASS;
  const outlookMeta: any = ({
    "Bright":        { accent: "#7c3aed", label: "Growing Fast 🚀" },
    "Average":       { accent: "#ec4899", label: "Steady Growth 📊" },
    "Below Average": { accent: "#f97316", label: "Slower Growth ⚠️" },
  } as any)[career?.outlook_category] || { accent: "#7c3aed", label: "Outlook Available" };

  const fullPageUrl = `/careers/${careerId.replace(/\./g, "-dot-")}`;

  return (
    <>
      <style>{`
        @keyframes modalBgIn  { from{opacity:0} to{opacity:1} }
        @keyframes modalPopIn { from{opacity:0;transform:scale(0.93) translateY(28px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes modalSpin  { to{transform:rotate(360deg)} }
        .mskill:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(124,58,237,0.2) !important; }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,10,40,0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", animation: "modalBgIn 0.25s ease" }} />

      {/* Centered wrapper */}
      <div style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 16px", pointerEvents: "none", marginTop: "60px" }}>
        <div style={{
          pointerEvents: "all",
          width: "100%", maxWidth: 1100,
          height: "80vh",
          background: "#faf9ff",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.25), 0 4px 24px rgba(124,58,237,0.14)",
          animation: "modalPopIn 0.38s cubic-bezier(0.34,1.56,0.64,1)",
          display: "grid",
          gridTemplateColumns: "0.7fr 1.3fr"
        }}>

          {/* ─────── LEFT: Image ────────── */}
          <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", background: "linear-gradient(135deg,#1e1b4b,#312e81)" }}>
            {/* Placeholder gradient always visible */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1e1b4b 0%,#4c1d95 50%,#831843 100%)" }} />
            {career && (
              <img
                src={`/images/domains/${career.domain?.toLowerCase() || "default"}.jpg`}
                alt={career?.title ?? ""}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loading ? 0 : 1, transition: "opacity 0.4s ease" }}
              />
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
          </div>

          {/* ─────── RIGHT: Content ────────── */}
          <div style={{ display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", minWidth: 0 }}>

            {/* Close Button — always on top */}
            <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "rgba(255,255,255,0.95)", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 100, transition: "transform 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "")}>
              <X size={16} color="#374151" />
            </button>

            {/* ── HERO: always pinned at top, outside scroll ── */}
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 0", gap: 16, background: `linear-gradient(135deg,${g.from} 0%,${g.to} 100%)` }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", animation: "modalSpin 1s linear infinite" }}>
                  <Loader2 size={22} color="#fff" />
                </div>
                <p style={{ color: "#6d28d9", fontWeight: 600, fontSize: 15 }}>Loading career details…</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "48px 32px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
                <p style={{ color: "#ef4444", fontWeight: 700, marginBottom: 16 }}>Failed to load. Try the full page instead.</p>
                <Link href={fullPageUrl} style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "#fff", borderRadius: 12, padding: "10px 24px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  Open Full Page
                </Link>
              </div>
            ) : career ? (
              /* Hero Section — pinned, never scrolls away */
              <div style={{ background: `linear-gradient(135deg,${g.from} 0%,${g.to} 100%)`, padding: "20px 32px 24px", borderBottom: `1.5px solid ${g.border}`, position: "relative", overflow: "hidden", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: -70, right: -70, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle,${g.accent}20 0%,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, left: "20%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,#ec489914 0%,transparent 70%)", pointerEvents: "none" }} />

                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 16 }}>
                  {career.bright_outlook && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fef9c3", color: "#854d0e", border: "1.5px solid #fde047", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                      <Star size={10} fill="#eab308" color="#eab308" /> Bright Outlook
                    </span>
                  )}
                  {career.in_demand && <span style={{ background: "#fce7f3", color: "#9d174d", border: "1.5px solid #fbcfe8", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>🔥 In Demand</span>}
                  <span style={{ background: `${g.accent}12`, color: g.text, border: `1px solid ${g.accent}30`, borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono',monospace" }}>O*NET {career.code}</span>
                </div>

                <h2 style={{ fontFamily: "'Lora',serif", fontSize: "clamp(20px,2.8vw,32px)", fontWeight: 800, color: "#1e1b4b", lineHeight: 1.12, marginBottom: 8 }}>{career.title}</h2>

                {career.also_called?.length > 0 && (
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                    Also known as: <span style={{ color: g.text, fontWeight: 600 }}>{career.also_called.join(" · ")}</span>
                  </p>
                )}

                {career.salary && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 16 }}>
                    {[
                      { label: "Median", value: fmtDash(career.salary.median), icon: "💰", big: true },
                      { label: "Hourly", value: career.salary.hourly_median ? `$${career.salary.hourly_median}/hr` : "—", icon: "⏱" },
                      { label: "Entry",  value: fmtDash(career.salary.low),   icon: "🌱" },
                      { label: "Senior", value: fmtDash(career.salary.high),  icon: "🏆" },
                    ].map(s => (
                      <div key={s.label} style={{ background: s.big ? `${g.accent}12` : "rgba(255,255,255,0.75)", border: s.big ? `1.5px solid ${g.accent}35` : "1.5px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "12px 8px", textAlign: "center", backdropFilter: "blur(10px)", position: "relative", overflow: "hidden" }}>
                        {s.big && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${g.accent},#ec4899)` }} />}
                        <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                        <div style={{ fontSize: s.big ? 13 : 12, fontWeight: 900, color: s.big ? g.accent : "#111827", fontFamily: "'DM Mono',monospace", wordBreak: "break-all" }}>{s.value}</div>
                        <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* ── BODY: scrollable below hero ── */}
            <div style={{ overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#ddd6fe transparent", flex: 1 }}>
              {career ? (
                <>
                  {/* Body */}
                  <div style={{ padding: "28px 32px 36px", display: "grid", gridTemplateColumns: "1fr 272px", gap: 20, alignItems: "start" }}>

                    {/* LEFT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                      {career.description && (
                        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #ede9fe", padding: "22px 24px", borderLeft: `4px solid ${g.accent}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f5f3ff", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📋</div>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e2a3a", fontFamily: "'Lora',serif" }}>About This Career</h3>
                          </div>
                          <p style={{ color: "#374151", lineHeight: 1.85, fontSize: 14 }}>{career.description}</p>
                        </div>
                      )}

                      {career.tasks?.length > 0 && (
                        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #ede9fe", padding: "22px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#fdf2f8", border: "1px solid #fbcfe8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚡</div>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e2a3a", fontFamily: "'Lora',serif" }}>What You'll Do Day-to-Day</h3>
                          </div>
                          {career.tasks.map((task: string, i: number) => (
                            <div key={i} style={{ display: "flex", gap: 14 }}>
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? `linear-gradient(135deg,${g.accent},#ec4899)` : `${g.accent}12`, border: i === 0 ? "none" : `1.5px solid ${g.accent}30`, color: i === 0 ? "#fff" : g.text, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                                {i < career.tasks.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 14, background: "#ede9fe", margin: "3px 0" }} />}
                              </div>
                              <div style={{ paddingBottom: i < career.tasks.length - 1 ? 14 : 0, paddingTop: 4 }}>
                                <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65 }}>{task}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {career.skills?.length > 0 && (
                        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #ede9fe", padding: "22px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: "#f5f3ff", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛠</div>
                            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e2a3a", fontFamily: "'Lora',serif" }}>Top Skills Required</h3>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {career.skills.map((skill: string, i: number) => (
                              <span key={i} className="mskill" style={{ background: i < 3 ? `linear-gradient(135deg,${g.accent},#ec4899)` : `${g.accent}10`, color: i < 3 ? "#fff" : g.text, border: i < 3 ? "none" : `1px solid ${g.accent}25`, borderRadius: 100, padding: i < 3 ? "8px 18px" : "6px 14px", fontSize: i < 3 ? 13 : 12, fontWeight: 700, boxShadow: i < 3 ? `0 2px 8px ${g.accent}40` : "none", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}>{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 16 }}>

                      {career.education?.length > 0 && (
                        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #ede9fe", padding: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 12, background: `linear-gradient(135deg,${g.accent},#ec4899)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <GraduationCap size={16} color="#fff" />
                            </div>
                            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#1e2a3a" }}>Education Required</h3>
                          </div>
                          {career.education.map((edu: any, i: number) => (
                            <div key={i} style={{ marginBottom: i < career.education.length - 1 ? 12 : 0 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <CheckCircle2 size={12} color={g.accent} />
                                  <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{edu.name}</span>
                                </div>
                                {edu.score && <span style={{ fontSize: 11, fontWeight: 800, color: g.accent }}>{Math.round(edu.score)}%</span>}
                              </div>
                              {edu.score && (
                                <div style={{ height: 5, background: "#f5f3ff", borderRadius: 100, overflow: "hidden" }}>
                                  <div style={{ height: "100%", borderRadius: 100, width: `${Math.round(edu.score)}%`, background: `linear-gradient(90deg,${g.accent},#ec4899)` }} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {career.growth && (
                        <div style={{ background: `${outlookMeta.accent}08`, border: `1.5px solid ${outlookMeta.accent}28`, borderRadius: 18, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
                          <div style={{ position: "absolute", right: -20, top: -20, width: 90, height: 90, borderRadius: "50%", background: `${outlookMeta.accent}12`, pointerEvents: "none" }} />
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: outlookMeta.accent, boxShadow: `0 0 0 4px ${outlookMeta.accent}30` }} />
                            <TrendingUp size={14} color={outlookMeta.accent} />
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: outlookMeta.accent }}>Job Outlook — {career.outlook_category}</h3>
                          </div>
                          <p style={{ color: "#374151", fontSize: 13.5, lineHeight: 1.75 }}>{career.growth}</p>
                        </div>
                      )}

                      {career.knowledge?.length > 0 && (
                        <div style={{ background: "#fff", borderRadius: 18, border: "1.5px solid #ede9fe", padding: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 12, background: "linear-gradient(135deg,#ec4899,#f43f5e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <BookOpen size={16} color="#fff" />
                            </div>
                            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#1e2a3a" }}>Knowledge Areas</h3>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                            {career.knowledge.map((k: string, i: number) => {
                              const c = KNOWLEDGE_COLORS[i % KNOWLEDGE_COLORS.length];
                              return <div key={i} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "9px 10px", fontSize: 11, fontWeight: 700, color: c.text, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}><span style={{ marginTop: 1, fontSize: 7 }}>◆</span> {k}</div>;
                            })}
                          </div>
                        </div>
                      )}

                      <div style={{ background: "linear-gradient(135deg,#f0f9ff,#dbeafe)", borderRadius: 18, border: "1.5px solid #ddd6fe", padding: "18px 20px" }}>
                        <h3 style={{ fontSize: 11, fontWeight: 800, color: "#3e2267", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Quick Facts</h3>
                        {[
                          { icon: "💼", label: "O*NET Code", value: career.code },
                          { icon: "📈", label: "Outlook",    value: career.outlook_category || "N/A" },
                          { icon: "💵", label: "Median Pay", value: fmtDash(career.salary?.median) },
                          { icon: "⏰", label: "Hourly",     value: career.salary?.hourly_median ? `$${career.salary.hourly_median}/hr` : "—" },
                        ].map(f => (
                          <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", marginBottom: 5, background: "rgba(255,255,255,0.91)", borderRadius: 9, border: "1px solid #ddd6fe" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <span style={{ fontSize: 13 }}>{f.icon}</span>
                              <span style={{ fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>{f.label}</span>
                            </div>
                            <span style={{ fontSize: 11.5, color: "#6d28d9", fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{f.value}</span>
                          </div>
                        ))}
                      </div>

                      <Link href={fullPageUrl} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: `linear-gradient(135deg,${g.accent},#ec4899)`, color: "#fff", borderRadius: 16, padding: "14px 20px", fontWeight: 800, fontSize: 13, textDecoration: "none", boxShadow: `0 4px 20px ${g.accent}35`, transition: "transform 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "")}>
                        🌐 View Full Profile <ExternalLink size={12} />
                      </Link>
                      <p style={{ textAlign: "center", fontSize: 10.5, color: "#9ca3af" }}>Data: O*NET · U.S. Dept. of Labor</p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>{/* end scrollable body */}
          </div>{/* end right column */}
        </div>{/* end modal grid */}
      </div>{/* end centered wrapper */}
    </>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ExploreCareersPage() {
  const [search,          setSearch]          = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeDomain,    setActiveDomain]    = useState("all");
  const [sort,            setSort]            = useState("relevance");
  const [careers,         setCareers]         = useState<any[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);
  const [total,           setTotal]           = useState(0);
  const [searchFocused,   setSearchFocused]   = useState(false);
  const [skipHero,        setSkipHero]        = useState(false);
  const [modalId,         setModalId]         = useState<string | null>(null);

  useEffect(() => {
    const flag = sessionStorage.getItem("exploreSkipHero");
    if (flag === "true") { setSkipHero(true); sessionStorage.removeItem("exploreSkipHero"); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

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
      if (sort === "salary_asc")  sorted.sort((a, b) => (a.salary?.median || 0) - (b.salary?.median || 0));
      if (sort === "salary_desc") sorted.sort((a, b) => (b.salary?.median || 0) - (a.salary?.median || 0));
      if (sort === "outlook")     sorted.sort((a, b) => (b.bright_outlook ? 1 : 0) - (a.bright_outlook ? 1 : 0));
      setCareers(sorted);
      setTotal(data.total || sorted.length);
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }, [activeDomain, debouncedSearch, sort]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const activeDomainData = DOMAINS.find(d => d.value === activeDomain);

  const careersContent = (
    <div style={{ background: "#faf9ff", minHeight: "100vh" }}>

      {/* ── Search + filters ── */}
      <div style={{ background: "#faf9ff", padding: "40px 24px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.3)", color: "#7c3aed", borderRadius: 100, padding: "7px 18px", fontSize: 12, fontWeight: 600, backdropFilter: "blur(8px)" }}>
              <Sparkles size={13} /> Powered by O*NET · U.S. Department of Labor
            </div>
          </div>
          <div style={{ position: "relative", maxWidth: 660, margin: "0 auto 24px", transition: "transform 0.2s", transform: searchFocused ? "scale(1.02)" : "scale(1)" }}>
            <div style={{ display: "flex", alignItems: "center", background: searchFocused ? "rgba(124, 58, 237, 0.08)" : "rgba(124, 58, 237, 0.04)", border: searchFocused ? "1.5px solid #7c3aed" : "1.5px solid rgba(124, 58, 237, 0.2)", borderRadius: 18, padding: "14px 20px", gap: 12, backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", transition: "all 0.3s" }}>
              <Search size={20} color={searchFocused ? "#7c3aed" : "#a78bfa"} style={{ flexShrink: 0 }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Search career, skill, or keyword..." style={{ flex: 1, border: "none", outline: "none", fontSize: 16, color: "#111827",  fontFamily: "'DM Sans',sans-serif" } as any} />
              {search && <button onClick={() => setSearch("")} style={{ background: "rgba(124, 58, 237, 0.1)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#7c3aed", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(124, 58, 237, 0.15)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(124, 58, 237, 0.1)"}><X size={14} /></button>}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
            {DOMAINS.map(d => (
              <button key={d.value} onClick={() => setActiveDomain(d.value)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", border: activeDomain === d.value ? `1.5px solid ${d.color}` : "1.5px solid rgba(124, 58, 237, 0.2)", background: activeDomain === d.value ? `${d.color}15` : "rgba(124, 58, 237, 0.05)", color: activeDomain === d.value ? d.color : "#6b7280", backdropFilter: "blur(8px)", transition: "all 0.2s" }}>
                {d.emoji} {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {activeDomain !== "all" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #ede9fe", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "#7c3aed" }}>
                {activeDomainData?.emoji} {activeDomainData?.label}
                <button onClick={() => setActiveDomain("all")} style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", display: "flex", marginLeft: 4 }}><X size={12} /></button>
              </div>
            )}
            <p style={{ fontSize: 13, color: "#9ca3af" }}>{loading ? "Fetching careers..." : `${careers.length} of ${total}+ careers`}</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setSort(opt.value)} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", border: sort === opt.value ? "1.5px solid #7c3aed" : "1.5px solid #e5e7eb", background: sort === opt.value ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "#fff", color: sort === opt.value ? "#fff" : "#6b7280" }}>
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 0", gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", animation: "spin 1s linear infinite" }}>
              <Loader2 size={28} color="#fff" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: "#7c3aed" }}>Fetching live career data...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#fdf2f8", borderRadius: 20, border: "1.5px solid #fbcfe8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ color: "#9d174d", fontWeight: 700, fontSize: 16 }}>{error}</p>
            <button onClick={fetchCareers} style={{ marginTop: 20, background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Try Again</button>
          </div>
        )}

        {!loading && !error && careers.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#111827", fontFamily: "'Lora',serif" }}>No careers found</h3>
            <p style={{ color: "#6b7280", marginTop: 8 }}>Try a different keyword or clear the domain filter</p>
            <button onClick={() => { setSearch(""); setActiveDomain("all"); }} style={{ marginTop: 20, background: "linear-gradient(135deg,#7c3aed,#ec4899)", color: "#fff", border: "none", borderRadius: 12, padding: "10px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Clear Filters</button>
          </div>
        )}

        {!loading && !error && careers.length > 0 && (
          <>
            <StatsBar total={total} loaded={careers.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
              {careers.map((career, i) => (
                <CareerCard key={career.id} career={career} index={i} onOpen={setModalId} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Centered modal */}
      {modalId && <CareerDetailModal careerId={modalId} onClose={() => setModalId(null)} />}
    </div>
  );

  return (
    <div style={{ background: "#faf9ff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Lora:ital,wght@0,600;0,700;1,600;1,700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; }
        @keyframes cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: rgba(255,255,255,0.6) !important; }
      `}</style>
      {skipHero ? careersContent : (
        <ScrollExpandMedia
          mediaSrc="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1280&auto=format&fit=crop"
          bgImageSrc="https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?q=80&w=1920&auto=format&fit=crop"
          title="Explore Careers"
          subtitle="Thousands of real career paths with live salary data and growth outlooks"
          scrollToExpand="Scroll to explore"
        >
          {careersContent}
        </ScrollExpandMedia>
      )}
    </div>
  );
}



