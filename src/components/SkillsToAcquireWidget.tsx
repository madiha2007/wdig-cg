"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Sparkles, ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from "lucide-react";
import { auth } from "../../firebase";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface SkillItem {
  skill:            string;
  career_relevance: string;
}
interface AlreadyHave {
  skill:  string;
  source: string;
  note:   string;
}
interface HiddenAsset {
  asset: string;
  why:   string;
}
interface SkillsGapData {
  skills_to_acquire:  (SkillItem | string)[];
  already_have:       AlreadyHave[];
  hidden_assets:      HiddenAsset[];
  priority_focus:     string;
  thinking_style_fit: string;
}

/* ─── Skill Pill with hover tooltip ────────────────────────────────────────── */
function SkillPill({ item }: { item: SkillItem | string }) {
  const [hovered, setHovered] = useState(false);

  const skillName     = typeof item === "object" ? item.skill            : item;
  const relevanceText = typeof item === "object" ? item.career_relevance : null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "0.38rem 0.85rem",
          background: "linear-gradient(135deg,#f5f3ff,#eff6ff)",
          border: `1.5px solid ${hovered && relevanceText ? "#7c3aed" : "#ddd6fe"}`,
          borderRadius: 99, fontSize: "0.74rem", fontWeight: 700,
          color: "#5b21b6", cursor: relevanceText ? "pointer" : "default",
          transition: "border-color 0.15s",
          userSelect: "none",
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", flexShrink: 0 }} />
        {skillName}
        {relevanceText && (
          <span style={{ fontSize: "0.6rem", color: "#a78bfa", marginLeft: 2 }}>ⓘ</span>
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && relevanceText && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: 4,  scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 220,
              background: "#1e1b4b",
              borderRadius: 10,
              padding: "0.6rem 0.8rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              zIndex: 100,
              pointerEvents: "none",
            }}
          >
            {/* Arrow */}
            <div style={{
              position: "absolute", bottom: -5, left: "50%",
              transform: "translateX(-50%)",
              width: 10, height: 10,
              background: "#1e1b4b",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }} />
            <p style={{
              fontSize: "0.68rem", color: "#c4b5fd",
              margin: 0, lineHeight: 1.55, fontWeight: 500,
            }}>
              {relevanceText}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Skeleton loader ───────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {[110, 85, 130, 95, 115].map((w, i) => (
        <div key={i} style={{
          height: 30, borderRadius: 99, background: "#f1f5f9",
          width: w,
          animation: "shimmer 1.5s ease-in-out infinite",
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
      <style>{`
        @keyframes shimmer { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
      `}</style>
    </div>
  );
}

/* ─── Header (shared across empty states) ───────────────────────────────────── */
function Header() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendingUp size={16} color="#7c3aed" />
        </div>
        <div>
          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Skillset to Acquire</h3>
          <p style={{ fontSize: "0.68rem", color: "#94a3b8", margin: "0.1rem 0 0" }}>From your career report</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN WIDGET
═══════════════════════════════════════════════════════════════════════════════ */
export function SkillsToAcquireWidget({
  isAssessed,
  fallbackSkills = [],
}: {
  isAssessed:     boolean;
  fallbackSkills: string[];
}) {
  const [data,        setData]        = useState<SkillsGapData | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  useEffect(() => {
    if (!isAssessed) return;
    const uid = auth?.currentUser?.uid;
    if (!uid) return;

    (async () => {
      setLoading(true);
      try {
        // 1. Try cached first
        const cachedRes = await fetch(`${API_BASE}/api/skills-gap/${uid}/cached`);
        const cached    = await cachedRes.json();

        if (cached?.data?.skills_to_acquire?.length > 0) {
          setData(cached.data as SkillsGapData);
          setAiGenerated(false);
          setLoading(false);
          return; // Done — never regenerate
        }

        // 2. No cache → generate once
        const res  = await fetch(`${API_BASE}/api/skills-gap/${uid}`, { method: "POST" });
        const json = await res.json();
        if (json?.data) {
          setData(json.data);
          setAiGenerated(true);
        }
      } catch (err) {
        console.error("[SkillsToAcquireWidget]", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAssessed]);

  /* Which skills to display */
  const rawSkills: (SkillItem | string)[] =
    data?.skills_to_acquire?.length
      ? data.skills_to_acquire
      : fallbackSkills;

  /* ── Not assessed ── */
  if (!isAssessed) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Header />
      <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
        <div style={{ fontSize: 36, marginBottom: "0.5rem" }}>📚</div>
        <p style={{ fontSize: "0.76rem", color: "#94a3b8", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
          Take the aptitude test and generate your report to see the skills you should build toward your career goals
        </p>
        <Link href="/aptitude">
          <motion.button whileTap={{ scale: 0.96 }}
            style={{ padding: "0.5rem 1.2rem", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", borderRadius: 99, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
            Get Started →
          </motion.button>
        </Link>
      </div>
    </div>
  );

  /* ── Loading ── */
  if (loading) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Header />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <Sparkles size={13} color="#7c3aed" />
        <span style={{ fontSize: "0.72rem", color: "#7c3aed", fontWeight: 600 }}>Analysing your career-skill gap…</span>
      </div>
      <Skeleton />
    </div>
  );

  /* ── No skills ── */
/* ── No skills ── */
  if (rawSkills.length === 0) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <Header />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <Sparkles size={13} color="#7c3aed" />
        <span style={{ fontSize: "0.72rem", color: "#7c3aed", fontWeight: 600 }}>Analysing your career-skill gap…</span>
      </div>
      <Skeleton />
    </div>
  );

  /* ── Full render ── */
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1px solid #e5e7eb", overflow: "visible",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "1.25rem 1.5rem 0" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} color="#7c3aed" />
            </div>
            <div>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>
                Skillset to Acquire
              </h3>
              <p style={{ fontSize: "0.68rem", color: "#94a3b8", margin: "0.1rem 0 0" }}>
                {aiGenerated ? "AI-matched to your careers & profile" : "Personalised to your career path"}
              </p>
            </div>
          </div>
          <Link href="/report" style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>
            View report →
          </Link>
        </div>

        {/* AI badge */}
        {aiGenerated && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "linear-gradient(135deg,#f5f3ff,#eff6ff)",
            border: "1px solid #ddd6fe", borderRadius: 99,
            padding: "0.25rem 0.7rem", marginBottom: "0.9rem",
          }}>
            <Sparkles size={10} color="#7c3aed" />
            <span style={{ fontSize: "0.64rem", fontWeight: 700, color: "#5b21b6" }}>
              AI-analysed · cross-referenced with your skills & hobbies
            </span>
          </div>
        )}

        {/* Hover hint */}
        {rawSkills.some(s => typeof s === "object" && (s as SkillItem).career_relevance) && (
          <p style={{ fontSize: "0.63rem", color: "#a78bfa", margin: "0 0 0.65rem", fontWeight: 500 }}>
            ⓘ Hover any skill to see how it connects to your career
          </p>
        )}

        {/* Priority focus */}
        {data?.priority_focus && (
          <div style={{
            background: "linear-gradient(135deg,#faf5ff,#eff6ff)",
            border: "1px solid #ddd6fe", borderRadius: 12,
            padding: "0.65rem 0.9rem", marginBottom: "1rem",
            display: "flex", gap: 8, alignItems: "flex-start",
          }}>
            <Lightbulb size={13} color="#7c3aed" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: "0.7rem", color: "#5b21b6", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
              {data.priority_focus}
            </p>
          </div>
        )}

        {/* Skills pills with tooltips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.1rem", position: "relative", zIndex: 10 }}>
          {rawSkills.map((item, i) => (
            <SkillPill key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Expandable section */}
      {data && (data.already_have?.length > 0 || data.hidden_assets?.length > 0) && (
        <>
          <button
            onClick={() => setShowDetails(d => !d)}
            style={{
              width: "100%", padding: "0.6rem 1.5rem",
              background: "#faf5ff", border: "none",
              borderTop: "1px solid #f3e8ff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#7c3aed" }}>
              {showDetails ? "Hide" : "See"} what you already have ✦
            </span>
            {showDetails ? <ChevronUp size={13} color="#7c3aed" /> : <ChevronDown size={13} color="#7c3aed" />}
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{   height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "1rem 1.5rem 1.25rem" }}>

                  {/* Already have */}
                  {data.already_have?.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Skills you already have
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {data.already_have.map((item, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            background: "#f0fdf4", border: "1px solid #a7f3d0",
                            borderRadius: 10, padding: "0.55rem 0.75rem",
                          }}>
                            <CheckCircle2 size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#14532d" }}>{item.skill}</span>
                              <span style={{ fontSize: "0.65rem", color: "#16a34a", fontWeight: 500, marginLeft: 6 }}>({item.source})</span>
                              {item.note && (
                                <p style={{ fontSize: "0.66rem", color: "#4ade80", margin: "0.15rem 0 0", lineHeight: 1.4 }}>{item.note}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden assets */}
                  {data.hidden_assets?.length > 0 && (
                    <div>
                      <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Hidden strengths from your profile
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {data.hidden_assets.map((item, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "flex-start", gap: 8,
                            background: "#fffbeb", border: "1px solid #fde68a",
                            borderRadius: 10, padding: "0.55rem 0.75rem",
                          }}>
                            <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>✦</span>
                            <div>
                              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#92400e" }}>{item.asset}</span>
                              <p style={{ fontSize: "0.66rem", color: "#b45309", margin: "0.15rem 0 0", lineHeight: 1.4 }}>{item.why}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Thinking style fit */}
                  {data.thinking_style_fit && (
                    <div style={{ marginTop: "0.9rem", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "0.6rem 0.8rem" }}>
                      <p style={{ fontSize: "0.68rem", color: "#1d4ed8", fontWeight: 600, margin: 0 }}>
                        🧠 {data.thinking_style_fit}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Bottom padding */}
      <div style={{ height: "0.75rem" }} />
    </div>
  );
}

export default SkillsToAcquireWidget;