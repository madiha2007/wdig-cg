"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAssessment } from "@/app/context/AssessmentContext";
import { auth } from "../../../firebase";

// ── Trait display labels ──────────────────────────────────────
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

// ── Sub-components ────────────────────────────────────────────

function TraitBar({ name, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), 400 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);
  const strong = score >= 65;
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.28rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#64748b" }}>{name}</span>
        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: strong ? "#0d9488" : "#94a3b8" }}>{score}%</span>
      </div>
      <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999, width: `${w}%`,
          background: strong ? "linear-gradient(90deg,#0d9488,#38bdf8)" : "linear-gradient(90deg,#cbd5e1,#e2e8f0)",
          transition: `width 0.75s cubic-bezier(0.16,1,0.3,1) ${delay * 0.4}ms`,
        }} />
      </div>
    </div>
  );
}

function CareerCard({ career, tier }) {
  const configs = {
    top:      { bg: "linear-gradient(135deg,#0d9488,#0891b2)", color: "#fff", dot: "rgba(255,255,255,0.5)", shadow: "0 6px 20px rgba(13,148,136,0.28)" },
    moderate: { bg: "linear-gradient(135deg,#7c3aed,#6366f1)", color: "#fff", dot: "rgba(255,255,255,0.45)", shadow: "0 4px 14px rgba(124,58,237,0.22)" },
    least:    { bg: "#f8fafc", color: "#64748b", dot: "#cbd5e1", shadow: "0 2px 6px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0" },
  };
  const cfg = configs[tier] || configs.moderate;

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.65rem",
      padding: "0.85rem 1.1rem", borderRadius: 14, marginBottom: "0.55rem",
      background: cfg.bg, color: cfg.color, border: cfg.border || "none",
      boxShadow: cfg.shadow, fontWeight: 500, fontSize: "0.9rem",
      transition: "transform 0.18s ease",
      cursor: "default",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "none"}
    >
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0, display: "inline-block" }} />
      <span style={{ lineHeight: 1.3 }}>
        {typeof career === "object" ? career.name : career}
      </span>
      {typeof career === "object" && career.emerging && (
        <span style={{
          marginLeft: "auto", fontSize: "0.6rem", fontWeight: 700,
          background: "rgba(255,255,255,0.22)", borderRadius: 999,
          padding: "0.15rem 0.5rem", letterSpacing: "0.06em"
        }}>EMERGING</span>
      )}
    </div>
  );
}

function SuppressionCard({ analysis }) {
  if (!analysis?.has_suppression) return null;

  return (
    <div style={{
      background: "linear-gradient(135deg, #fff7ed, #fef3c7)",
      border: "1px solid #fcd34d", borderRadius: 20,
      padding: "1.75rem 2rem", marginBottom: "1.5rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.6rem" }}>🔍</span>
        <div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.05rem", fontWeight: 700, color: "#92400e" }}>
            What You Might Not See About Yourself
          </div>
          <div style={{ fontSize: "0.75rem", color: "#b45309" }}>
            Detected from your response patterns
          </div>
        </div>
      </div>
      {analysis.insights.map((insight, i) => (
        <div key={i} style={{
          background: "rgba(255,255,255,0.7)", borderRadius: 12,
          padding: "1rem 1.25rem", marginBottom: "0.75rem",
          fontSize: "0.92rem", lineHeight: 1.75, color: "#78350f",
          borderLeft: "3px solid #f59e0b",
        }}>
          {insight}
        </div>
      ))}
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
        {[
          { label: "Suppression", value: analysis.suppression_level },
          { label: "Fear-driven", value: analysis.fear_level },
          { label: "External pressure", value: analysis.pressure_level },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#92400e" }}>{value}%</div>
            <div style={{ fontSize: "0.68rem", color: "#b45309", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DimensionCard({ scores }) {
  if (!scores) return null;
  const icons = {
    cognitive: "🧠", personality: "⚙️", motivational: "🔥",
    social: "🤝", suppression: "🔍", contribution: "🌍",
  };
  return (
    <div style={{
      background: "#fff", border: "1px solid #e2f0f7",
      borderRadius: 20, padding: "1.75rem 2rem", marginBottom: "1.5rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
    }}>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.2rem" }}>
        Dimension Scores
      </div>
      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "1.4rem" }}>
        How you score across the 6 trait dimensions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {Object.entries(scores).map(([dim, score]) => (
          <div key={dim} style={{
            background: "#f8fafc", borderRadius: 14,
            padding: "1rem", textAlign: "center",
          }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.3rem" }}>{icons[dim] || "📊"}</div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0d9488", fontFamily: "'Fraunces',serif" }}>{score}</div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "capitalize", marginTop: "0.2rem" }}>
              {dim.replace(/_/g, " ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "3px solid #e2f0f7", borderTopColor: "#0d9488",
          animation: "rl-spin 0.8s linear infinite", margin: "0 auto 1rem",
        }} />
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: "1.1rem", fontWeight: 600 }}>
          Analyzing your results…
        </p>
        <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.4rem" }}>
          Building your career profile
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

const ResultsPage = () => {
  const router = useRouter();
  const { userProfile, prediction } = useAssessment();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userProfile) { router.push("/aptitude"); return; }
    setTimeout(() => setVisible(true), 60);
  }, [userProfile]);

  if (!userProfile) return <LoadingScreen />;

  // ── If no prediction yet, show loading ──
  if (!prediction) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <LoadingScreen />
        <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
          If this persists, check that the ML server is running on port 8000.
        </p>
        <button
          onClick={() => router.push("/aptitude")}
          style={{ padding: "0.6rem 1.5rem", background: "#f1f5f9", borderRadius: 10, border: "none", cursor: "pointer" }}
        >
          Retake Test
        </button>
      </div>
    );
  }

  // ── Destructure new prediction shape ──────────────────────
  const {
    thinking_style,       // { primary: { id, label, description }, secondary: ... }
    top_careers,          // [{ name, score, domain, stream, society_role, emerging }]
    moderate_careers,
    suppression_analysis, // { flags, insights, suppression_level, fear_level, pressure_level, has_suppression }
    dominant_traits,      // [{ trait, score }]
    dimension_scores,     // { cognitive: 72, personality: 58, ... }
    normalizedTraits,     // from userProfile
  } = {
    ...prediction,
    normalizedTraits: userProfile.normalizedTraits ?? {},
  };

  const primaryStyle  = thinking_style?.primary;
  const secondaryStyle = thinking_style?.secondary;

  // Trait bars — show top 12 most interesting traits (exclude suppression meta-traits)
  const HIDDEN_FROM_BARS = ["suppression_signal", "pressure_conformity", "childhood_divergence", "fear_avoidance"];
  const traitBars = Object.entries(userProfile.normalizedTraits ?? {})
    .filter(([k]) => !HIDDEN_FROM_BARS.includes(k))
    .map(([k, v]) => ({ key: k, name: humanLabel(k), score: Math.round(v * 100) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 14);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600&display=swap');
        @keyframes rl-spin { to { transform: rotate(360deg); } }
        @keyframes rl-fadeUp { to { opacity: 1; transform: none; } }
        .rl-fade { opacity: 0; transform: translateY(14px); animation: rl-fadeUp 0.5s ease forwards; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ fontFamily: "'Instrument Sans',sans-serif", color: "#0f2535", maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem 5rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>

        {/* ── 1. Hero: Primary Thinking Style ── */}
        <div className="rl-fade" style={{
          animationDelay: "0.05s",
          background: "#fff", borderRadius: 24, padding: "2.5rem 3rem",
          marginBottom: "2rem", border: "1px solid rgba(13,148,136,0.12)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03), 0 10px 36px rgba(13,148,136,0.09)",
          display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* top accent line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#0d9488,#38bdf8)" }} />

          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#0d9488", marginBottom: "0.55rem" }}>
              Your Thinking Style
            </div>
            <h1 style={{
              fontFamily: "'Fraunces',serif", fontSize: "clamp(1.9rem,4vw,2.9rem)",
              fontWeight: 700, lineHeight: 1.1,
              background: "linear-gradient(130deg,#0f766e,#0284c7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", marginBottom: "0.9rem",
            }}>
              {primaryStyle?.label ?? "Your Profile"}
            </h1>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#64748b", maxWidth: "50ch" }}>
              {primaryStyle?.description}
            </p>

            {/* Secondary style badge */}
            {secondaryStyle && (
              <div style={{
                marginTop: "1rem", display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "#f0f9ff", border: "1px solid #bae6fd",
                borderRadius: 999, padding: "0.35rem 1rem",
              }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.1em" }}>Also:</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0369a1" }}>{secondaryStyle.label}</span>
              </div>
            )}
          </div>

          <div style={{
            width: 92, height: 92, borderRadius: 24, flexShrink: 0,
            background: "linear-gradient(135deg,#ccfbf1,#bae6fd)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.6rem", boxShadow: "0 4px 18px rgba(13,148,136,0.18)",
          }}>
            🧩
          </div>
        </div>

        {/* ── 2. Suppression Analysis (only if flags detected) ── */}
        {suppression_analysis?.has_suppression && (
          <div className="rl-fade" style={{ animationDelay: "0.12s" }}>
            <SuppressionCard analysis={suppression_analysis} />
          </div>
        )}

        {/* ── 3. Top Career Recommendations ── */}
        <div className="rl-fade" style={{ animationDelay: "0.18s", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: "1.35rem", fontWeight: 700 }}>
              Your Career Recommendations
            </span>
            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
              Ranked by fit with your full trait profile
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
            {/* Top careers */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#0f766e", background: "#ccfbf1", borderRadius: 999,
                padding: "0.3rem 0.75rem", marginBottom: "0.85rem",
              }}>★ Top Matches</div>
              {(top_careers ?? []).map((c, i) => (
                <CareerCard key={i} career={c} tier="top" />
              ))}
            </div>

            {/* Moderate careers */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#6d28d9", background: "#ede9fe", borderRadius: 999,
                padding: "0.3rem 0.75rem", marginBottom: "0.85rem",
              }}>◆ Good Fits</div>
              {(moderate_careers ?? []).map((c, i) => (
                <CareerCard key={i} career={c} tier="moderate" />
              ))}
            </div>

            {/* Society role column */}
            <div>
              <div style={{
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#94a3b8", marginBottom: "0.85rem",
              }}>🌍 Your Societal Role</div>
              {(top_careers ?? []).slice(0, 3).map((c, i) => (
                <div key={i} style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0",
                  borderRadius: 12, padding: "0.85rem 1rem", marginBottom: "0.55rem",
                  fontSize: "0.8rem", color: "#475569", lineHeight: 1.5,
                }}>
                  <div style={{ fontWeight: 600, color: "#0f2535", marginBottom: "0.25rem", fontSize: "0.82rem" }}>
                    {typeof c === "object" ? c.name : c}
                  </div>
                  {typeof c === "object" && c.society_role}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 4. Stream Suggestions ── */}
        {top_careers?.[0]?.stream && (
          <div className="rl-fade" style={{
            animationDelay: "0.24s",
            background: "linear-gradient(135deg,#f0fdf4,#ecfeff)",
            border: "1px solid rgba(13,148,136,0.15)", borderRadius: 20,
            padding: "1.75rem 2rem", marginBottom: "1.5rem",
          }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.05rem", fontWeight: 700, color: "#0f766e", marginBottom: "0.5rem" }}>
              📚 Recommended Educational Streams
            </div>
            <div style={{ fontSize: "0.85rem", color: "#047857", marginBottom: "1rem" }}>
              Based on your top career matches
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[...new Set((top_careers ?? []).slice(0, 3).flatMap(c => c.stream ?? []))].map((s, i) => (
                <span key={i} style={{
                  background: "white", border: "1px solid rgba(13,148,136,0.2)",
                  borderRadius: 999, padding: "0.35rem 0.9rem",
                  fontSize: "0.8rem", fontWeight: 600, color: "#0f766e",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── 5. Dominant Traits ── */}
        {dominant_traits?.length > 0 && (
          <div className="rl-fade" style={{
            animationDelay: "0.3s",
            background: "#fff", border: "1px solid #e2f0f7",
            borderRadius: 20, padding: "1.75rem 2rem", marginBottom: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.2rem" }}>
              Your Dominant Traits
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
              The traits that define your profile most strongly
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {dominant_traits.map(({ trait, score }) => (
                <div key={trait} style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: "linear-gradient(135deg,#ccfbf1,#bae6fd)",
                  border: "1px solid rgba(13,148,136,0.15)",
                  borderRadius: 999, padding: "0.45rem 1rem",
                }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f766e" }}>
                    {humanLabel(trait)}
                  </span>
                  <span style={{
                    fontSize: "0.72rem", fontWeight: 700, color: "#fff",
                    background: "linear-gradient(135deg,#0d9488,#38bdf8)",
                    borderRadius: 999, padding: "0.1rem 0.45rem",
                  }}>
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 6. Dimension Scores ── */}
        <div className="rl-fade" style={{ animationDelay: "0.36s" }}>
          <DimensionCard scores={dimension_scores} />
        </div>

        {/* ── 7. Full Trait Profile ── */}
        {traitBars.length > 0 && (
          <div className="rl-fade" style={{
            animationDelay: "0.42s",
            background: "#fff", border: "1px solid #e2f0f7",
            borderRadius: 20, padding: "1.75rem 2rem", marginBottom: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.2rem" }}>
              Full Trait Profile
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "1.4rem" }}>
              Your scores across all measured dimensions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "0 2.5rem" }}>
              {traitBars.map((t, i) => (
                <TraitBar key={t.key} name={t.name} score={t.score} delay={i * 55} />
              ))}
            </div>
          </div>
        )}

        {/* ── 8. Actions ── */}
        <div className="rl-fade" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "2rem", animationDelay: "0.5s" }}>
          <button
            onClick={() => router.push("/aptitude")}
            style={{
              fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.88rem", fontWeight: 600,
              padding: "0.75rem 1.75rem", borderRadius: 12, border: "1px solid #e2f0f7",
              background: "#fff", color: "#64748b", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            ↩ Retake Test
          </button>
          <button
            style={{
              fontFamily: "'Instrument Sans',sans-serif", fontSize: "0.88rem", fontWeight: 600,
              padding: "0.75rem 1.75rem", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg,#0d9488,#38bdf8)", color: "#fff",
              cursor: "pointer", boxShadow: "0 4px 16px rgba(13,148,136,0.3)",
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
            }}
          >
            Explore Careers →
          </button>

<p style={{fontSize: "0.7rem", color: "#94a3b8"}}>
  UID: {auth?.currentUser?.uid ?? "NOT LOGGED IN"}
</p>
          

<button onClick={() => {
  const uid = sessionStorage.getItem("wdig_uid", auth?.currentUser?.uid);
  if (uid) {
    router.push(`/report?uid=${auth?.currentUser?.uid}`);
  } else {
    router.push("/login");
  }
}}>
  📄 Generate My Full Report
</button>

        </div>

      </div>
    </>
  );
};

export default ResultsPage;