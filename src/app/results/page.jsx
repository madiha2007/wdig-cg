"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAssessment } from "@/app/context/AssessmentContext";
import { auth } from "../../../firebase";

function humanLabel(key) {
  const LABELS = {
    logical: "Logical Reasoning", analytical: "Analytical Thinking",
    numerical: "Numerical Ability", verbal: "Verbal Ability",
    spatial: "Spatial Reasoning", creativity: "Creativity",
    discipline: "Discipline", resilience: "Resilience",
    independence: "Independence", adaptability: "Adaptability",
    growth_mindset: "Growth Mindset", risk_appetite: "Risk Appetite",
    depth_focus: "Depth of Focus", confidence: "Confidence",
    stress_tolerance: "Stress Tolerance", accountability: "Accountability",
    initiative: "Initiative", problem_solving: "Problem Solving",
    intrinsic_motivation: "Intrinsic Motivation", purpose_drive: "Purpose Drive",
    passion_signal: "Passion Signal", fear_avoidance: "Fear Avoidance",
    learning_orientation: "Learning Orientation", communication: "Communication",
    leadership: "Leadership", teamwork: "Teamwork",
    empathy: "Empathy", emotional_intelligence: "Emotional Intelligence",
    helping_orientation: "Helping Orientation", suppression_signal: "Suppression Signal",
    pressure_conformity: "Pressure Conformity", childhood_divergence: "Childhood Divergence",
    self_awareness: "Self Awareness", societal_impact_awareness: "Societal Impact",
    innovation_drive: "Innovation Drive", legacy_thinking: "Legacy Thinking",
  };
  return LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function buildSocietalBlurb(normalizedTraits = {}, topCareers = [], thinkingStyle = "") {
  const empathy    = (normalizedTraits.empathy ?? 0) * 100;
  const impact     = (normalizedTraits.societal_impact_awareness ?? 0) * 100;
  const innovation = (normalizedTraits.innovation_drive ?? 0) * 100;
  const leadership = (normalizedTraits.leadership ?? 0) * 100;
  const helping    = (normalizedTraits.helping_orientation ?? 0) * 100;
  const domains    = [...new Set((topCareers ?? []).slice(0, 3).map(c => c.domain).filter(Boolean))];
  const domainStr  = domains.length > 0 ? domains.join(" and ") : "your chosen field";
  let opening = "";
  if (impact > 70 && empathy > 65)      opening = "You carry an unusual blend of empathy and awareness — the kind that notices what others overlook.";
  else if (innovation > 72)             opening = "Your mind naturally gravitates toward building things that don't yet exist.";
  else if (leadership > 68)             opening = "People tend to look to you, often before you've even offered to lead.";
  else if (helping > 70)                opening = "At your core, you're someone who finds meaning in making things easier for others.";
  else                                   opening = `Your profile as a ${thinkingStyle || "thinker"} positions you for meaningful impact.`;
  const middle = `In the near future, you're likely to find your footing in ${domainStr} — not just as a practitioner, but as someone who reshapes how things are done within it.`;
  let close = "";
  if (impact > 65)      close = "The world will feel your contribution most when you stop waiting for permission to act on what you already sense is important.";
  else if (innovation > 65) close = "Your edge is originality — use it before the world standardises what you're imagining today.";
  else                   close = "Your biggest impact is still ahead, and it starts with the choices you're making right now.";
  return `${opening} ${middle} ${close}`;
}

function buildSkillCards(normalizedTraits = {}, topCareers = [], dominantTraits = []) {
  const SKILL_MAP = {
    creativity: "Creative Thinking", analytical: "Analytical Reasoning",
    logical: "Logical Deduction", communication: "Communication",
    leadership: "Leadership", empathy: "Empathy & EQ",
    problem_solving: "Problem Solving", innovation_drive: "Innovation Mindset",
    adaptability: "Adaptability", resilience: "Resilience",
    numerical: "Numerical Aptitude", verbal: "Verbal Fluency",
    spatial: "Spatial Reasoning", teamwork: "Teamwork",
    intrinsic_motivation: "Intrinsic Drive", depth_focus: "Deep Focus",
  };
  const existing = dominantTraits.filter(t => t.score >= 65 && SKILL_MAP[t.trait]).slice(0, 5)
    .map(t => ({ label: SKILL_MAP[t.trait] || humanLabel(t.trait), score: t.score }));
  const domains = (topCareers ?? []).slice(0, 3).map(c => c.domain ?? "");
  const acquire = [];
  if (domains.some(d => /tech|engineer|data|software/i.test(d)))   acquire.push("Computational Thinking", "Data Literacy", "Systems Design");
  if (domains.some(d => /business|finance|consult|manage/i.test(d))) acquire.push("Strategic Planning", "Financial Literacy", "Stakeholder Management");
  if (domains.some(d => /design|art|media|creat/i.test(d)))         acquire.push("Visual Communication", "Prototyping", "User Research");
  if (domains.some(d => /science|research|med|bio|chem/i.test(d)))  acquire.push("Research Methodology", "Statistical Analysis", "Scientific Writing");
  if (domains.some(d => /law|legal|policy/i.test(d)))               acquire.push("Legal Reasoning", "Argumentation", "Policy Analysis");
  const low = Object.entries(normalizedTraits).filter(([k, v]) => v < 0.45 && SKILL_MAP[k]).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([k]) => SKILL_MAP[k]);
  return { existing, toAcquire: [...new Set([...acquire, ...low])].slice(0, 5).map(l => ({ label: l })) };
}

// ── Sub-components ────────────────────────────────────────────────

function TraitBar({ name, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(score), 400 + delay); return () => clearTimeout(t); }, [score, delay]);
  const strong = score >= 65;
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>{name}</span>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: strong ? "#0d9488" : "#94a3b8" }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, width: `${w}%`,
          background: strong ? "linear-gradient(90deg,#0d9488,#38bdf8)" : "linear-gradient(90deg,#cbd5e1,#e2e8f0)",
          transition: `width 0.85s cubic-bezier(0.16,1,0.3,1) ${delay * 0.3}ms`,
        }} />
      </div>
    </div>
  );
}

function CareerCard({ career, tier, index }) {
  const cfg = {
    top:      { bg: "linear-gradient(135deg,#0d9488,#0891b2)", color: "#fff",     numBg: "rgba(255,255,255,0.18)", numColor: "#ccfbf1" },
    moderate: { bg: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff",     numBg: "rgba(255,255,255,0.15)", numColor: "#e0e7ff" },
    least:    { bg: "#f8fafc",                                  color: "#475569",  numBg: "#e2e8f0",               numColor: "#64748b", border: "1px solid #e2e8f0" },
  }[tier] || {};
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.75rem",
      padding: "0.85rem 1.1rem", borderRadius: 14, marginBottom: "0.6rem",
      background: cfg.bg, color: cfg.color, border: cfg.border || "none",
      boxShadow: tier === "top" ? "0 4px 16px rgba(13,148,136,0.22)" : tier === "moderate" ? "0 4px 14px rgba(99,102,241,0.18)" : "0 1px 4px rgba(0,0,0,0.05)",
      fontWeight: 500, fontSize: "0.88rem",
      transition: "transform 0.18s ease", cursor: "default",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "none"}
    >
      <span style={{ fontSize: "0.65rem", fontWeight: 800, background: cfg.numBg, color: cfg.numColor, padding: "0.2rem 0.5rem", borderRadius: 6, flexShrink: 0, fontFamily: "serif" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ flex: 1, lineHeight: 1.35 }}>{typeof career === "object" ? career.name : career}</span>
      {typeof career === "object" && career.emerging && (
        <span style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.1em", background: "rgba(255,255,255,0.22)", borderRadius: 999, padding: "0.15rem 0.5rem" }}>EMERGING</span>
      )}
    </div>
  );
}

function SectionLabel({ children, accent = "#0d9488" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
      <div style={{ width: 24, height: 2, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: accent }}>{children}</span>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.75rem", background: "#f8fafc" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #e2f0f7", borderTopColor: "#0d9488", animation: "rp-spin 0.8s linear infinite" }} />
      <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 600, color: "#0f2535" }}>Analysing your results…</p>
      <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Building your career profile</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

const ResultsPage = () => {
  const router = useRouter();
  const { userProfile, prediction } = useAssessment();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userProfile) { router.push("/aptitude"); return; }
    setTimeout(() => setVisible(true), 60);
  }, [userProfile]);

  if (!userProfile) return <LoadingScreen />;
  if (!prediction) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", background: "#f8fafc" }}>
        <LoadingScreen />
        <p style={{ fontSize: "0.82rem", color: "#94a3b8" }}>If this persists, check that the ML server is running on port 8000.</p>
        <button onClick={() => router.push("/aptitude")} style={{ padding: "0.6rem 1.5rem", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, cursor: "pointer", fontSize: "0.88rem", color: "#475569" }}>Retake Test</button>
      </div>
    );
  }

  const { thinking_style, top_careers, moderate_careers, suppression_analysis, dominant_traits, dimension_scores } = prediction;
  const normalizedTraits = userProfile.normalizedTraits ?? {};
  const primaryStyle   = thinking_style?.primary;
  const secondaryStyle = thinking_style?.secondary;

  const HIDDEN = ["suppression_signal", "pressure_conformity", "childhood_divergence", "fear_avoidance"];
  const traitBars = Object.entries(normalizedTraits)
    .filter(([k]) => !HIDDEN.includes(k))
    .map(([k, v]) => ({ key: k, name: humanLabel(k), score: Math.round(v * 100) }))
    .sort((a, b) => b.score - a.score).slice(0, 14);

  const societalBlurb = buildSocietalBlurb(normalizedTraits, top_careers, primaryStyle?.label);
  const { existing, toAcquire } = buildSkillCards(normalizedTraits, top_careers, dominant_traits ?? []);
  const dimIcons = { cognitive: "🧠", personality: "⚙️", motivational: "🔥", social: "🤝", suppression: "🔍", contribution: "🌍" };

  /* shared card style */
  const card = {
    background: "#fff",
    border: "1px solid #e8f0f7",
    borderRadius: 20,
    padding: "1.75rem 2rem",
    marginBottom: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 6px 24px rgba(0,0,0,0.04)",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes rp-spin { to { transform: rotate(360deg); } }
        @keyframes rp-fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        .rp-fade { opacity:0; animation: rp-fadeUp 0.55s ease forwards; }

        /* ── Responsive ── */
        .rp-container { max-width:1080px; margin:0 auto; padding:0 24px; }
        .rp-hero { display:grid; grid-template-columns:1fr auto; gap:2rem; align-items:center; }
        .rp-careers-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
        .rp-skills-grid  { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
        .rp-dim-grid     { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:1rem; }
        .rp-traits-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0 2.5rem; }

        @media (max-width: 768px) {
          .rp-container { padding: 0 16px; }
          .rp-hero { grid-template-columns: 1fr; }
          .rp-hero-icon { display: none; }
          .rp-careers-grid { grid-template-columns: 1fr; gap: 0; }
          .rp-skills-grid  { grid-template-columns: 1fr; }
          .rp-dim-grid     { grid-template-columns: repeat(3,1fr); }
        }
        @media (max-width: 480px) {
          .rp-container { padding: 0 14px; }
          .rp-dim-grid { grid-template-columns: repeat(2,1fr); }
          .rp-traits-grid { grid-template-columns: 1fr; gap: 0; }
          .rp-actions { flex-direction: column !important; }
          .rp-actions button, .rp-actions a { width: 100%; text-align: center; }
          .rp-uid { margin-left: 0 !important; }
        }
      `}</style>

      <div style={{
        fontFamily: "'DM Sans',sans-serif",
        background: "linear-gradient(160deg, #f0f9ff 0%, #f8fafc 40%, #fafaf9 100%)",
        minHeight: "100vh",
        color: "#0f172a",
        paddingTop: 80, paddingBottom: 80,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(12px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
      }}>
        <div className="rp-container">

          {/* ── 1. Hero ── */}
          <div className="rp-hero rp-fade" style={{ ...card, animationDelay: "0.05s", position: "relative", overflow: "hidden", marginBottom: "2rem",  marginTop: 30  }}>
            {/* Top accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#0d9488,#38bdf8,#818cf8)" }} />
            {/* Background orb */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle,rgba(13,148,136,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

            <div style={{ position: "relative"}}>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#0d9488", marginBottom: "0.65rem" }}>
                Your Thinking Style
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, lineHeight: 1.08,
                background: "linear-gradient(130deg,#0d9488 0%,#0284c7 60%,#6366f1 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: "1rem",
              }}>
                {primaryStyle?.label ?? "Your Profile"}
              </h1>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#64748b", maxWidth: "50ch" }}>
                {primaryStyle?.description}
              </p>
              {secondaryStyle && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  marginTop: "1.1rem", background: "#f0f9ff",
                  border: "1px solid #bae6fd", borderRadius: 999, padding: "0.35rem 1rem",
                }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#0284c7" }}>Also</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0369a1" }}>{secondaryStyle.label}</span>
                </div>
              )}
            </div>
            <div className="rp-hero-icon" style={{
              width: 90, height: 90, borderRadius: 22, flexShrink: 0,
              background: "linear-gradient(135deg,#ccfbf1,#bae6fd)",
              border: "1px solid rgba(13,148,136,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.6rem",
              boxShadow: "0 6px 24px rgba(13,148,136,0.14)",
            }}>🧩</div>
          </div>

          {/* ── 2. Suppression ── */}
          {suppression_analysis?.has_suppression && (
            <div className="rp-fade" style={{
              animationDelay: "0.12s", marginBottom: "1.5rem",
              background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
              border: "1px solid #fcd34d", borderRadius: 20, padding: "1.75rem 2rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🔍</span>
                <div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontWeight: 700, color: "#92400e" }}>
                    What You Might Not See About Yourself
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#b45309", marginTop: 2 }}>Detected from your response patterns</div>
                </div>
              </div>
              {suppression_analysis.insights.map((insight, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.7)", borderLeft: "3px solid #f59e0b", borderRadius: "0 12px 12px 0", padding: "1rem 1.25rem", marginBottom: "0.75rem", fontSize: "0.9rem", lineHeight: 1.75, color: "#78350f" }}>
                  {insight}
                </div>
              ))}
              <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                {[["Suppression", suppression_analysis.suppression_level], ["Fear-driven", suppression_analysis.fear_level], ["Ext. Pressure", suppression_analysis.pressure_level]].map(([label, value]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", fontWeight: 700, color: "#92400e" }}>{value}%</div>
                    <div style={{ fontSize: "0.62rem", color: "#b45309", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 3. Careers ── */}
          <div className="rp-fade" style={{ animationDelay: "0.18s", marginBottom: "1.5rem" }}>
            <SectionLabel>Career Recommendations</SectionLabel>
            <div className="rp-careers-grid">
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0f766e", background: "#ccfbf1", borderRadius: 999, padding: "0.3rem 0.85rem", marginBottom: "0.85rem" }}>
                  ★ Top Matches
                </div>
                {(top_careers ?? []).map((c, i) => <CareerCard key={i} career={c} tier="top" index={i} />)}
              </div>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4338ca", background: "#ede9fe", borderRadius: 999, padding: "0.3rem 0.85rem", marginBottom: "0.85rem" }}>
                  ◆ Good Fits
                </div>
                {(moderate_careers ?? []).map((c, i) => <CareerCard key={i} career={c} tier="moderate" index={i} />)}
              </div>
            </div>
          </div>

          {/* ── 4. Societal Offering ── */}
          <div className="rp-fade" style={{
            animationDelay: "0.22s", marginBottom: "1.5rem",
            background: "linear-gradient(135deg,#0f2535 0%,#0d4a3f 55%,#0c3a5c 100%)",
            borderRadius: 20, padding: "2rem 2.5rem", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(13,148,136,0.22) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.4rem" }}>🌱</span>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1rem", fontWeight: 700, color: "#6ee7b7" }}>
                What You're Likely to Offer the World
              </div>
            </div>
            <p style={{ fontSize: "0.93rem", lineHeight: 1.9, color: "rgba(255,255,255,0.78)", fontStyle: "italic", maxWidth: "60ch", position: "relative" }}>
              {societalBlurb}
            </p>
          </div>

          {/* ── 5. Skills ── */}
          <div className="rp-fade" style={{ animationDelay: "0.26s", marginBottom: "1.5rem" }}>
            <SectionLabel>Your Skill Landscape</SectionLabel>
            <div className="rp-skills-grid">
              {/* Existing */}
              <div style={{ ...card, marginBottom: 0, background: "linear-gradient(135deg,#f0fdf4,#ecfeff)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(13,148,136,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>✦</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontWeight: 700, color: "#0f2535" }}>Existing Strengths</div>
                </div>
                {(existing.length > 0 ? existing : [{ label: "Strong intrinsic drive" }, { label: "Self-directed learner" }]).map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#fff", border: "1px solid rgba(13,148,136,0.12)", borderRadius: 10, padding: "0.55rem 0.85rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0d9488", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#334155", flex: 1 }}>{item.label}</span>
                    {item.score !== undefined && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0d9488", background: "rgba(13,148,136,0.1)", borderRadius: 999, padding: "0.1rem 0.45rem" }}>{item.score}%</span>
                    )}
                  </div>
                ))}
              </div>
              {/* To Acquire */}
              <div style={{ ...card, marginBottom: 0, background: "linear-gradient(135deg,#faf5ff,#f0f9ff)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.1rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>◎</div>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.95rem", fontWeight: 700, color: "#0f2535" }}>Skills to Build</div>
                </div>
                {(toAcquire.length > 0 ? toAcquire : [{ label: "Domain-specific expertise" }, { label: "Applied project work" }]).map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#fff", border: "1px solid rgba(124,58,237,0.1)", borderRadius: 10, padding: "0.55rem 0.85rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#334155" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 6. Dominant Traits ── */}
          {dominant_traits?.length > 0 && (
            <div className="rp-fade" style={{ ...card, animationDelay: "0.3s" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 700, color: "#0f2535", marginBottom: "0.25rem" }}>Dominant Traits</div>
              <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginBottom: "1.25rem" }}>The traits that define your profile most strongly</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                {dominant_traits.map(({ trait, score }) => (
                  <div key={trait} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "linear-gradient(135deg,#ccfbf1,#bae6fd)", border: "1px solid rgba(13,148,136,0.15)", borderRadius: 999, padding: "0.4rem 0.9rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f766e" }}>{humanLabel(trait)}</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#fff", background: "linear-gradient(135deg,#0d9488,#38bdf8)", borderRadius: 999, padding: "0.1rem 0.45rem" }}>{score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 7. Dimension Scores ── */}
          {dimension_scores && (
            <div className="rp-fade" style={{ ...card, animationDelay: "0.36s" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 700, color: "#0f2535", marginBottom: "0.25rem" }}>Dimension Scores</div>
              <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginBottom: "1.4rem" }}>How you score across the 6 trait dimensions</div>
              <div className="rp-dim-grid">
                {Object.entries(dimension_scores).map(([dim, score]) => (
                  <div key={dim} style={{
                    background: "#f8fafc", border: "1px solid #e8f0f7", borderRadius: 16,
                    padding: "1.1rem 1rem", textAlign: "center",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(13,148,136,0.35)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,148,136,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8f0f7"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{dimIcons[dim] || "📊"}</div>
                    <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "#0d9488", lineHeight: 1 }}>{score}</div>
                    <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "capitalize", marginTop: "0.25rem" }}>{dim.replace(/_/g, " ")}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 8. Full Trait Profile ── */}
          {traitBars.length > 0 && (
            <div className="rp-fade" style={{ ...card, animationDelay: "0.42s" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 700, color: "#0f2535", marginBottom: "0.25rem" }}>Full Trait Profile</div>
              <div style={{ fontSize: "0.76rem", color: "#94a3b8", marginBottom: "1.4rem" }}>Your scores across all measured dimensions</div>
              <div className="rp-traits-grid">
                {traitBars.map((t, i) => <TraitBar key={t.key} name={t.name} score={t.score} delay={i * 50} />)}
              </div>
            </div>
          )}

          {/* ── 9. Actions ── */}
          <div className="rp-actions rp-fade" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginTop: "2.5rem", animationDelay: "0.5s" }}>
            <button onClick={() => router.push("/aptitude")} style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 600,
              padding: "0.8rem 1.75rem", borderRadius: 12,
              border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer",
              transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}
            >↩ Retake Test</button>

            <button onClick={() => { const uid = auth?.currentUser?.uid; uid ? router.push(`/report?uid=${uid}`) : router.push("/login"); }} style={{
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700,
              padding: "0.8rem 1.75rem", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#0d9488,#38bdf8)", color: "#fff", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(13,148,136,0.3)", transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(13,148,136,0.38)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,148,136,0.3)"; }}
            >📄 Generate Full Report →</button>

            <p className="rp-uid" style={{ fontSize: "0.68rem", color: "#cbd5e1", marginLeft: "auto", fontFamily: "monospace" }}>
              UID: {auth?.currentUser?.uid ?? "NOT LOGGED IN"}
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default ResultsPage;