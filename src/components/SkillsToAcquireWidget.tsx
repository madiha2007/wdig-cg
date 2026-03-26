"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Sparkles, ChevronDown, ChevronUp,
  Lightbulb, CheckCircle2, Zap,
} from "lucide-react";
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

interface SkillInsight {
  why:        string;
  impact:     string;
  timeframe:  string;
  actionStep: string;
}

type InsightMap = Record<string, SkillInsight>;

/* ─── Robust JSON extractor ──────────────────────────────────────────────────
   Handles: markdown fences, leading text, trailing text, truncated JSON.
   Returns null if nothing parseable found.
─────────────────────────────────────────────────────────────────────────────── */
function extractJSON(raw: string): InsightMap | null {
  if (!raw || typeof raw !== "string") return null;

  // 1. Strip markdown fences
  let text = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  // 2. Find the outermost { … } block
  const start = text.indexOf("{");
  if (start === -1) return null;

  // Walk forward to find matching closing brace (handles nested objects)
  let depth = 0;
  let end   = -1;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) { end = i; break; }
    }
  }

  const jsonSlice = end !== -1 ? text.slice(start, end + 1) : text.slice(start);

  

  // 3. Try parsing as-is
  try {
    return JSON.parse(jsonSlice) as InsightMap;
  } catch {
    // 4. Attempt light repair: remove trailing comma before } or ]
    const repaired = jsonSlice
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
    try {
      return JSON.parse(repaired) as InsightMap;
    } catch {
      return null;
    }
  }
}

/* ─── Single Anthropic API call: skills + insights together ─────────────────
   By generating both in one prompt we eliminate the race condition and the
   second API round-trip that was causing "Unexpected end of JSON input".
─────────────────────────────────────────────────────────────────────────────── */



/* ─── Hover Tooltip ──────────────────────────────────────────────────────────── */
function InsightTooltip({
  skill,
  insight,
  visible,
  side = "top",
}: {
  skill:   string;
  insight: SkillInsight | null;
  visible: boolean;
  side?:   "top" | "bottom";
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: side === "top" ? 8 : -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: side === "top" ? 4 : -4, scale: 0.95 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{
            position:  "absolute",
            ...(side === "top" ? { bottom: "calc(100% + 12px)" } : { top: "calc(100% + 12px)" }),
            left:      "50%",
            transform: "translateX(-50%)",
            width:     268,
            background: "linear-gradient(145deg, #1e1b4b, #1a1040)",
            borderRadius: 14,
            padding:   "1rem 1.1rem",
            boxShadow: "0 16px 48px rgba(0,0,0,0.28), 0 0 0 1px rgba(124,58,237,0.3)",
            zIndex:    1000,
            pointerEvents: "none",
          }}
        >
          {/* Arrow */}
          <div style={{
            position: "absolute",
            ...(side === "top"
              ? { bottom: -6, borderTop: "6px solid #1e1b4b",    borderBottom: "none" }
              : { top:    -6, borderBottom: "6px solid #1e1b4b", borderTop:    "none" }),
            left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
          }} />

          {!insight ? (
            /* Loading shimmer */
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.6rem" }}>
                <Sparkles size={11} color="#a78bfa" />
                <span style={{ fontSize: "0.62rem", color: "#a78bfa", fontWeight: 600 }}>Generating insight…</span>
              </div>
              {[100, 80, 90].map((w, i) => (
                <div key={i} style={{
                  height: 8, borderRadius: 4, marginBottom: 6,
                  background: "rgba(167,139,250,0.15)",
                  width: `${w}%`,
                  animation: `shimmer 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }} />
              ))}
              <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
            </div>
          ) : (
            <div>
              {/* Skill name */}
              <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: "0.55rem" }}>
                {skill}
              </div>

              {/* Why */}
              <p style={{ fontSize: "0.72rem", color: "#e2e8f0", lineHeight: 1.65, margin: "0 0 0.7rem", fontStyle: "italic" }}>
                {insight.why}
              </p>

              {/* Impact */}
              <div style={{ background: "rgba(124,58,237,0.18)", borderRadius: 8, padding: "0.45rem 0.6rem", marginBottom: "0.55rem", border: "1px solid rgba(124,58,237,0.25)" }}>
                <div style={{ fontSize: "0.58rem", fontWeight: 800, color: "#c4b5fd", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
                  Unlocks
                </div>
                <p style={{ fontSize: "0.68rem", color: "#ddd6fe", margin: 0, lineHeight: 1.5 }}>{insight.impact}</p>
              </div>

              {/* Timeframe */}
              <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "0.4rem 0.55rem", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.55rem", fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                  ⏱ Timeline
                </div>
                <p style={{ fontSize: "0.64rem", color: "#cbd5e1", margin: 0, lineHeight: 1.4 }}>{insight.timeframe}</p>
              </div>

              {/* Action step */}
              <div style={{ background: "rgba(16,185,129,0.12)", borderRadius: 8, padding: "0.4rem 0.6rem", border: "1px solid rgba(16,185,129,0.22)" }}>
                <div style={{ fontSize: "0.55rem", fontWeight: 800, color: "#6ee7b7", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
                  ✦ First Step
                </div>
                <p style={{ fontSize: "0.65rem", color: "#a7f3d0", margin: 0, lineHeight: 1.4 }}>{insight.actionStep}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Skill Pill ─────────────────────────────────────────────────────────────── */
function SkillPill({
  item, index, insight, loadingInsights, color, lightBg,
}: {
  item:            SkillItem | string;
  index:           number;
  insight:         SkillInsight | null | undefined;
  loadingInsights: boolean;
  color:           string;
  lightBg:         string;
}) {
  const [hovered,     setHovered]     = useState(false);
  const [tooltipSide, setTooltipSide] = useState<"top" | "bottom">("top");
  const pillRef = useRef<HTMLDivElement>(null);

  const skillName      = typeof item === "object" ? item.skill : item;
  const hasInsight     = !!insight || loadingInsights;

const handleMouseEnter = () => {
  if (pillRef.current) {
    const rect = pillRef.current.getBoundingClientRect();
    setTooltipSide(rect.top < 320 ? "bottom" : "top");
  }
  setHovered(true);
};

  return (
    <div ref={pillRef} style={{ position: "relative", display: "inline-block" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.07, type: "spring", stiffness: 280, damping: 22 }}
        whileHover={{ y: -3, scale: 1.04 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "0.5rem 1rem",
          background: hovered ? lightBg : "#fff",
          border: `1.5px solid ${hovered ? color : color + "28"}`,
          borderRadius: 99,
          fontSize: "0.76rem", fontWeight: 700,
          color: color,
          cursor: "pointer",
          transition: "background 0.18s, border-color 0.18s",
          userSelect: "none",
          boxShadow: hovered
            ? `0 4px 18px ${color}22, 0 0 0 3px ${color}10`
            : `0 1px 4px rgba(0,0,0,0.05)`,
        }}
      >
        {/* Numbered badge */}
        <div style={{
          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
          background: color,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.55rem", fontWeight: 900, color: "#fff",
          boxShadow: `0 2px 6px ${color}44`,
        }}>
          {index + 1}
        </div>

        {skillName}

        {/* Hint icon — only show when we have or are loading an insight */}
        {hasInsight && (
          <motion.span
            animate={{ opacity: hovered ? 1 : 0.45 }}
            style={{ fontSize: "0.65rem", color, flexShrink: 0 }}
          >
            {loadingInsights && !insight ? <Sparkles size={10} /> : <span style={{ opacity: 0.7 }}>ⓘ</span>}
          </motion.span>
        )}
      </motion.div>

      {/* Tooltip — always render when we have data or are loading */}
      {hasInsight && (
        <InsightTooltip
          skill={skillName}
          insight={insight ?? null}
          visible={hovered}
          side={tooltipSide}
        />
      )}
    </div>
  );
}

/* ─── Palette ────────────────────────────────────────────────────────────────── */
const PALETTE       = ["#7c3aed","#0891b2","#059669","#d97706","#db2777","#4f46e5"];
const PALETTE_LIGHT = ["#ede9fe","#cffafe","#d1fae5","#fef3c7","#fce7f3","#e0e7ff"];

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {[110, 85, 130, 95, 115, 100].map((w, i) => (
        <div key={i} style={{
          height: 36, borderRadius: 99, background: "#f1f5f9", width: w,
          animation: "shimmer 1.5s ease-in-out infinite",
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
      <style>{`@keyframes shimmer{0%,100%{opacity:1}50%{opacity:0.35}}`}</style>
    </div>
  );
}
function parseGeminiOutput(raw: string): InsightMap {
  const parsed = extractJSON(raw);
  return parsed ?? {};
}


async function fetchSkillsWithInsights(skillNames: string[], userProfile?: object) {
  const prompt = `Give insights for these skills: ${skillNames.join(", ")}. User profile: ${JSON.stringify(userProfile ?? {})}. Format: why, impact, timeframe, actionStep.`;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  if (!data.output) return {};
  return parseGeminiOutput(data.output); // same as your Gemini parser
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN WIDGET
═══════════════════════════════════════════════════════════════════════════════ */
export function SkillsToAcquireWidget({
  isAssessed,
  fallbackSkills = [],
  userProfile    = {},
}: {
  isAssessed:     boolean;
  fallbackSkills: string[];
  userProfile?: {
    thinkingStyle?:  string;
    topCareers?:     string[];
    existingTraits?: string[];
    secretDream?:    string;
    field?:          string;
    name?:           string;
  };
}) {
  const [data,            setData]           = useState<SkillsGapData | null>(null);
  const [loading,         setLoading]        = useState(false);
  const [showDetails,     setShowDetails]    = useState(false);
  const [aiGenerated,     setAiGenerated]    = useState(false);

  // Insight state
  const [insightMap,      setInsightMap]     = useState<InsightMap>({});
  const [loadingInsights, setLoadingInsights]= useState(false);
  const [insightError,    setInsightError]   = useState<string | null>(null);
  const insightFetchedRef = useRef(false); // prevent double-fetch in StrictMode

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

  /* ── 1. Fetch skills-gap data ── */
  useEffect(() => {
    if (!isAssessed) return;
    const uid = auth?.currentUser?.uid;
    if (!uid) return;

    (async () => {
      setLoading(true);
      try {
        const cachedRes = await fetch(`${API_BASE}/api/skills-gap/${uid}/cached`);
        const cached    = await cachedRes.json();

        if (cached?.data?.skills_to_acquire?.length > 0) {
          setData(cached.data as SkillsGapData);
          setAiGenerated(false);
          setLoading(false);
          return;
        }

        const res  = await fetch(`${API_BASE}/api/skills-gap/${uid}`, { method: "POST" });
        const json = await res.json();
        if (json?.data) {
          setData(json.data);
          setAiGenerated(true);
        }
      } catch (err) {
        console.error("[SkillsToAcquireWidget] skills-gap fetch:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAssessed]);

  /* ── 2. Generate insights once skills are known ──
     We call this ONCE per widget mount — insights are generated alongside
     the skill list in a single Anthropic call, eliminating parse races.
  ── */
// ── REMOVE the `skills` state and the useEffect that sets it ──
// DELETE these:
//   const [skills, setSkills] = useState<string[]>([]);
//   useEffect(() => { setSkills(skillNames); }, [skillNames]);

// ── REPLACE the skillNames + fetchInsights block with this ──

const rawSkills: (SkillItem | string)[] =
  data?.skills_to_acquire?.length ? data.skills_to_acquire : fallbackSkills;

// Memoize skillNames so it's stable across renders
const skillNames = useMemo(
  () => rawSkills.map(s => (typeof s === "object" ? s.skill : s)),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(rawSkills)]
);

const fetchInsights = useCallback(async () => {
  if (skillNames.length === 0) return;           // guard: nothing to fetch
  setLoadingInsights(true);
  setInsightError(null);
  try {
    const map = await fetchSkillsWithInsights(skillNames, userProfile);
    setInsightMap(map);
  } catch (err) {
    setInsightError("Failed to load insights");
  } finally {
    setLoadingInsights(false);
  }
}, [skillNames, JSON.stringify(userProfile)]); // stringify avoids object ref churn

useEffect(() => {
  if (!isAssessed || skillNames.length === 0) return;
  fetchInsights();
}, [isAssessed, fetchInsights]);

  useEffect(() => {
    if (!isAssessed || skillNames.length === 0) return;
    fetchInsights();
  }, [isAssessed, fetchInsights]);

  /* ── Not assessed ── */
  if (!isAssessed) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendingUp size={16} color="#7c3aed" />
        </div>
        <div>
          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>Skillset to Acquire</h3>
          <p style={{ fontSize: "0.68rem", color: "#94a3b8", margin: "0.1rem 0 0" }}>Personalised to your career path</p>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
        <div style={{ fontSize: 36, marginBottom: "0.5rem" }}>📚</div>
        <p style={{ fontSize: "0.76rem", color: "#94a3b8", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
          Take the aptitude test to unlock a personalised skill roadmap built around your unique profile.
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

  /* ── Loading skills ── */
  if (loading) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <Sparkles size={13} color="#7c3aed" />
        <span style={{ fontSize: "0.72rem", color: "#7c3aed", fontWeight: 600 }}>Analysing your career-skill gap…</span>
      </div>
      <Skeleton />
    </div>
  );

  /* ── No skills yet (show skeleton while loading insights) ── */
  if (rawSkills.length === 0) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb", padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
        <Sparkles size={13} color="#7c3aed" />
        <span style={{ fontSize: "0.72rem", color: "#7c3aed", fontWeight: 600 }}>Building your skill roadmap…</span>
      </div>
      <Skeleton />
    </div>
  );

  /* ── Status badge label ── */
  const insightsBadge = () => {
    if (insightError) return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 99, padding: "0.25rem 0.7rem" }}>
        <span style={{ fontSize: "0.63rem", fontWeight: 700, color: "#e11d48" }}>
          ⚠ Couldn't load insights —{" "}
          <span
            onClick={() => { insightFetchedRef.current = false; fetchInsights(); }}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            retry
          </span>
        </span>
      </div>
    );
    if (loadingInsights) return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 99, padding: "0.25rem 0.7rem" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{ width: 10, height: 10, borderRadius: "50%", border: "1.5px solid #fbbf24", borderTopColor: "transparent" }}
        />
        <span style={{ fontSize: "0.63rem", fontWeight: 700, color: "#92400e" }}>Generating personalised insights…</span>
      </div>
    );
    if (Object.keys(insightMap).length > 0) return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 99, padding: "0.25rem 0.7rem" }}>
        <Zap size={10} color="#16a34a" />
        <span style={{ fontSize: "0.63rem", fontWeight: 700, color: "#16a34a" }}>Hover any skill to see why it matters for you</span>
      </div>
    );
    return null;
  };

  /* ── Full render ── */
  return (
    <div style={{
      background: "#fff", borderRadius: 20,
      border: "1px solid #e5e7eb", overflow: "visible",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
      position: "relative",
    }}>
      <div style={{ padding: "1.4rem 1.5rem 0" }}>

        {/* Header */}
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

        {/* Status badges row */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.9rem" }}>
          {aiGenerated && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "linear-gradient(135deg,#f5f3ff,#eff6ff)",
              border: "1px solid #ddd6fe", borderRadius: 99, padding: "0.25rem 0.7rem",
            }}>
              <Sparkles size={10} color="#7c3aed" />
              <span style={{ fontSize: "0.63rem", fontWeight: 700, color: "#5b21b6" }}>
                AI-analysed · cross-referenced with your profile
              </span>
            </div>
          )}
          {insightsBadge()}
        </div>

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

        {/* Skills pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", marginBottom: "1.2rem", position: "relative", zIndex: 10 }}>
          {rawSkills.map((item, i) => {
            const sName = typeof item === "object" ? item.skill : item;
            return (
              <SkillPill
                key={i}
                item={item}
                index={i}
                insight={insightMap[sName] ?? null}
                loadingInsights={loadingInsights}
                color={PALETTE[i % PALETTE.length]}
                lightBg={PALETTE_LIGHT[i % PALETTE_LIGHT.length]}
              />
            );
          })}
        </div>

        {/* Footer callout */}
        <div style={{
          marginBottom: "1.2rem", padding: "0.6rem 0.9rem",
          background: "#fffbeb", borderRadius: 10, border: "1px solid #fde68a",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: "0.85rem" }}>💡</span>
          <p style={{ fontSize: "0.61rem", color: "#92400e", fontWeight: 700, margin: 0 }}>
            Skills are ordered by priority — start with #1 for maximum career impact.
          </p>
        </div>
      </div>

      {/* Expandable already-have / hidden assets */}
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
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "1rem 1.5rem 1.25rem" }}>

                  {data.already_have?.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Skills you already have
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {data.already_have.map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#f0fdf4", border: "1px solid #a7f3d0", borderRadius: 10, padding: "0.55rem 0.75rem" }}>
                            <CheckCircle2 size={13} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#14532d" }}>{item.skill}</span>
                              <span style={{ fontSize: "0.65rem", color: "#16a34a", fontWeight: 500, marginLeft: 6 }}>({item.source})</span>
                              {item.note && <p style={{ fontSize: "0.66rem", color: "#4ade80", margin: "0.15rem 0 0", lineHeight: 1.4 }}>{item.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.hidden_assets?.length > 0 && (
                    <div>
                      <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.6rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Hidden strengths from your profile
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {data.hidden_assets.map((item, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "0.55rem 0.75rem" }}>
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

      <div style={{ height: "0.75rem" }} />
    </div>
  );
}

export default SkillsToAcquireWidget;