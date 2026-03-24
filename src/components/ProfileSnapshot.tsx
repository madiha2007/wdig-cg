// ─────────────────────────────────────────────────────────────────────────────
// ProfileSnapshot.tsx  →  src/components/ProfileSnapshot.tsx
// A personalised 2-3 sentence card shown at the top of the report page.
//
// USAGE in src/app/report/page.jsx — add these 2 things:
//
//   1. Import at top:
//      import ProfileSnapshot from "@/components/ProfileSnapshot";
//
//   2. Inside ReportPage(), find the <div data-body ...> section.
//      Add as the FIRST child inside it, before the dimension profile card:
//      <ProfileSnapshot uid={uid} isPdf={isPdf} />
//
//      Note: uid comes from:  const uid = sp.get("uid") || "";
//      You already have this from useSearchParams() in your report page.
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useEffect, useState } from "react";

const T = {
  ink: "#0D1B2A", inkMid: "#2C3E50", inkLight: "#5D7A8A",
  teal: "#0A7B6B", tealLight: "#E8F8F5", tealMid: "#14B89A",
  gold: "#C9962B", goldLight: "#FEF9EC",
  white: "#FFFFFF",
};

// ── Human-readable label maps ─────────────────────────────────────────────────
const STAGE_LABELS: Record<string, string> = {
  school_9_10:    "a Class 9–10 student",
  school_11_12:   "a Class 11–12 student",
  ug:             "an undergraduate student",
  pg:             "a postgraduate student",
  professional:   "a working professional",
  career_changer: "someone navigating a career change",
};
const FINANCE_LABELS: Record<string, string> = {
  need_income_soon: "need a stable income soon",
  some_runway:      "have some time before needing income",
  full_support:     "have full family support on timeline",
};
const PRESSURE_LABELS: Record<string, string> = {
  high:     "under significant family pressure about your career path",
  moderate: "navigating some family expectations around your career",
  free:     "fortunate to have full freedom in your career choice",
};
const HORIZON_LABELS: Record<string, string> = {
  "1_2_years": "1–2 years",
  "3_5_years": "3–5 years",
  "6_8_years": "6–8 years",
};
const SUCCESS_LABELS: Record<string, string> = {
  financial_freedom:   "financial freedom",
  real_impact:         "making a real impact on the world",
  being_best:          "being the best at what you do",
  balance:             "work-life balance and inner peace",
  solving_problems:    "solving hard problems",
  creative_expression: "creative expression and recognition",
};
const VISION_LABELS: Record<string, string> = {
  own_business:   "running your own business",
  top_company:    "leading a team in a top company",
  research:       "doing deep research or academia",
  freelance:      "working independently",
  public_service: "serving the public",
  figuring_out:   "still figuring out the path",
};

interface Profile {
  current_stage?: string;
  field?: string;
  financial_situation?: string;
  family_pressure?: string;
  time_horizon?: string;
  skills?: string[];
  success_definition?: string;
  ten_year_vision?: string;
  secret_dream?: string;
  biggest_blocker?: string;
}

// ── Sentence builder — creates 2-3 natural sentences from profile data ────────
function buildSnapshot(p: Profile): string[] {
  const sentences: string[] = [];

  // Sentence 1 — who they are + context
  const stagePart = STAGE_LABELS[p.current_stage || ""] || "someone at a career crossroads";
  const fieldPart = p.field ? ` in ${p.field.replace(/_/g, " ")}` : "";
  const financePart = FINANCE_LABELS[p.financial_situation || ""];
  const pressurePart = PRESSURE_LABELS[p.family_pressure || ""];

  if (financePart && pressurePart) {
    sentences.push(
      `You're ${stagePart}${fieldPart} who ${financePart}, and you're ${pressurePart} — this report is written with that reality fully in mind.`
    );
  } else if (stagePart) {
    sentences.push(
      `You're ${stagePart}${fieldPart} — this report is built around where you actually are right now, not a generic template.`
    );
  }

  // Sentence 2 — time horizon + vision
  const horizonPart = HORIZON_LABELS[p.time_horizon || ""];
  const visionPart = VISION_LABELS[p.ten_year_vision || ""];
  const successPart = SUCCESS_LABELS[p.success_definition || ""];

  if (horizonPart && visionPart) {
    sentences.push(
      `You've said you can invest ${horizonPart} in building your path, and in ten years you see yourself ${visionPart} — the career roadmap below is built around that window and that goal.`
    );
  } else if (successPart) {
    sentences.push(
      `You defined success as ${successPart} — every recommendation in this report has been weighted with that definition at the centre.`
    );
  }

  // Sentence 3 — the dream / blocker (most personal, most powerful)
  if (p.secret_dream && p.secret_dream.trim().length > 5) {
    if (p.biggest_blocker && p.biggest_blocker.trim().length > 5) {
      sentences.push(
        `You mentioned wanting to ${p.secret_dream.trim().replace(/\.$/, "")} — and that ${p.biggest_blocker.trim().replace(/\.$/, "")} is what's standing in the way. That tension is real, and this report speaks directly to it.`
      );
    } else {
      sentences.push(
        `You mentioned wanting to ${p.secret_dream.trim().replace(/\.$/, "")} — that's not a footnote here, it's part of the lens through which your results have been interpreted.`
      );
    }
  }

  return sentences.filter(Boolean);
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProfileSnapshot({ uid, isPdf = false }: { uid: string; isPdf?: boolean }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    fetch(`http://localhost:5000/api/profile/${uid}`)
      .then(r => r.json())
      .then(({ profile }) => setProfile(profile || null))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [uid]);

  // Don't render if no profile or still loading
  if (loading || !profile) return null;

  const sentences = buildSnapshot(profile);
  if (sentences.length === 0) return null;

  const hasSkills = (profile.skills || []).length > 0;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${T.teal}0e, ${T.gold}08)`,
      border: `1.5px solid ${T.teal}22`,
      borderRadius: 20,
      padding: "1.5rem 1.75rem",
      marginBottom: "1.75rem",
      position: "relative",
      overflow: "hidden",
      opacity: isPdf ? 1 : undefined,
      animation: isPdf ? "none" : "fadeUp .6s cubic-bezier(.16,1,.3,1) both",
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

      {/* Decorative quote mark */}
      <div style={{
        position: "absolute", top: -8, left: 16,
        fontSize: "5rem", lineHeight: 1, color: `${T.teal}10`,
        fontFamily: "Georgia, serif", pointerEvents: "none", userSelect: "none",
      }}>"</div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `${T.teal}18`, border: `1.5px solid ${T.teal}30`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem",
        }}>🪞</div>
        <div>
          <div style={{
            fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.2em",
            textTransform: "uppercase", color: T.tealMid,
          }}>Written for you specifically</div>
        </div>

        {/* Skills pill — shown if they have skills */}
        {hasSkills && (
          <div style={{
            marginLeft: "auto",
            background: `${T.gold}15`, border: `1px solid ${T.gold}30`,
            borderRadius: 999, padding: "0.25rem 0.75rem",
            fontSize: "0.65rem", fontWeight: 700, color: T.gold,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            ⚡ {profile.skills!.slice(0, 2).map(s => s.replace(/_/g, " ")).join(", ")}
            {profile.skills!.length > 2 && ` +${profile.skills!.length - 2} more`}
          </div>
        )}
      </div>

      {/* The sentences */}
      <div style={{ position: "relative" }}>
        {sentences.map((s, i) => (
          <p key={i} style={{
            fontSize: "0.92rem",
            lineHeight: 1.85,
            color: i === sentences.length - 1 && (profile.secret_dream?.length ?? 0) > 5
              ? T.inkMid  // last sentence (dream) slightly more prominent
              : "#3D5A6E",
            fontStyle: i === sentences.length - 1 && (profile.secret_dream?.length ?? 0) > 5
              ? "italic"
              : "normal",
            fontFamily: "'Plus Jakarta Sans', system-ui",
            margin: `0 0 ${i < sentences.length - 1 ? "0.75rem" : "0"}`,
          }}>
            {/* Highlight key parts */}
            {s}
          </p>
        ))}
      </div>

      {/* Bottom bar — time horizon + vision summary chips */}
      {(profile.time_horizon || profile.ten_year_vision || profile.success_definition) && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.4rem",
          marginTop: "1rem", paddingTop: "0.85rem",
          borderTop: `1px solid ${T.teal}15`,
        }}>
          {profile.time_horizon && (
            <span style={{
              background: `${T.teal}10`, border: `1px solid ${T.teal}20`,
              borderRadius: 999, padding: "0.22rem 0.65rem",
              fontSize: "0.68rem", fontWeight: 600, color: T.teal,
            }}>
              ⏱ {HORIZON_LABELS[profile.time_horizon]} horizon
            </span>
          )}
          {profile.success_definition && (
            <span style={{
              background: `${T.gold}10`, border: `1px solid ${T.gold}20`,
              borderRadius: 999, padding: "0.22rem 0.65rem",
              fontSize: "0.68rem", fontWeight: 600, color: T.gold,
            }}>
              🎯 {SUCCESS_LABELS[profile.success_definition]}
            </span>
          )}
          {profile.ten_year_vision && (
            <span style={{
              background: "rgba(93,122,138,0.1)", border: "1px solid rgba(93,122,138,0.2)",
              borderRadius: 999, padding: "0.22rem 0.65rem",
              fontSize: "0.68rem", fontWeight: 600, color: T.inkLight,
            }}>
              🔮 {VISION_LABELS[profile.ten_year_vision]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}