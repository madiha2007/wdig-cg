"use client";

import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from "react";
import { auth } from "../../../firebase"; // auth only — no db import

const API = "http://localhost:5000"; // your Node server

/* ── Types ──────────────────────────────────────────────────────────────── */
export interface UserData {
  name:       string;
  email:      string;
  location:   string;
  bio:        string;
  photoURL:   string | null;
  role:       string;
  createdAt:  string;
  interests:  string[];
  hobbies:    string[];
  ownedSkills: string[];
  // profile test fields
  current_stage?:       string;
  field?:               string;
  financial_situation?: string;
  family_pressure?:     string;
  time_horizon?:        string;
  skills?:              string[];
  secret_dream?:        string;
  biggest_blocker?:     string;
  success_definition?:  string;
  ten_year_vision?:     string;
}

export interface AssessmentResult {
  completed?:         boolean;
  thinking_style?: {
    primary?:   { label: string; description?: string };
    secondary?: { label: string };
  };
  top_careers?:      { name: string; emerging?: boolean }[];
  moderate_careers?: { name: string }[];
  dominant_traits?:  { trait: string; score: number }[];
  dimension_scores?: Record<string, number>;
  normalizedTraits?: Record<string, number>;
}

interface UserContextValue {
  uid:             string | null;
  userData:        UserData;
  assessResult:    AssessmentResult | null;
  loading:         boolean;

  refreshUser:     () => Promise<void>;
  saveUserData:    (partial: Partial<UserData>) => Promise<void>;
  saveOwnedSkills: (s: string[]) => Promise<void>;

  skillMap:           Record<string, number>;
  needsGainSkills:    string[];
  existingSkills:     { key: string; score: number }[];
  skillsToAcquire:    string[];
  topCareers:         string[];
  isAssessed:         boolean;
}

/* ── Defaults ───────────────────────────────────────────────────────────── */
const EMPTY_USER: UserData = {
  name: "", email: "", location: "", bio: "",
  photoURL: null, role: "Student",
  createdAt: "", interests: [], hobbies: [], ownedSkills: [],
};

const HIDDEN_TRAITS = [
  "suppression_signal", "pressure_conformity",
  "childhood_divergence", "fear_avoidance",
];

/* ── Parse skillsToAcquire from report text ─────────────────────────────── */
// Reads the "## Skillset to Build" section and pulls the skill names out.
// No new DB column needed — works from the cached report_text.
function parseSkillsToAcquire(reportText: string | null): string[] {
  if (!reportText) return [];
  const match = reportText.match(
    /## Skillset to Build\n+([\s\S]+?)(?=\n## |$)/i
  );
  if (!match) return [];
  // Extract bold phrases (**Skill Name**) — that's how LLaMA formats skill names
  const bolds = [...match[1].matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1].trim());
  if (bolds.length > 0) return bolds.slice(0, 6);
  // Fallback: grab first sentence of each paragraph as the skill name
  return match[1]
    .split(/\n\n+/)
    .map(p => p.split(".")[0].replace(/^\d+\.\s*/, "").trim())
    .filter(s => s.length > 2 && s.length < 60)
    .slice(0, 6);
}

const Ctx = createContext<UserContextValue | null>(null);

/* ── Provider ───────────────────────────────────────────────────────────── */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [uid,          setUid]          = useState<string | null>(null);
  const [userData,     setUserData]     = useState<UserData>(EMPTY_USER);
  const [assessResult, setAssessResult] = useState<AssessmentResult | null>(null);
  const [reportText,   setReportText]   = useState<string | null>(null);
  const [loading,      setLoading]      = useState(true);

  /* ── Fetch everything from your Node API in one call ──────────────────── */
const fetchAll = useCallback(async (firebaseUser: any) => {
  setLoading(true);
  try {
    const res = await fetch(`${API}/api/user/${firebaseUser.uid}/full`);
    if (!res.ok) throw new Error("Failed to fetch user data");
    const data = await res.json();

    /* ── user row → userData ── */
    const u = data.user || {};
    const p = data.profile || {};
    setUserData({
      ...EMPTY_USER,
      name:       u.display_name || firebaseUser.displayName || "",
      email:      u.email        || firebaseUser.email       || "",
      location:   u.location     || "",
      photoURL:   firebaseUser.photoURL || null,
      role:       u.age_group    || "Student",
      createdAt:  u.created_at   || "",
      interests:   Array.isArray(p.career_interests) ? p.career_interests : [],
      hobbies:     Array.isArray(p.hobbies)          ? p.hobbies          : [],
      ownedSkills: Array.isArray(p.owned_skills)     ? p.owned_skills     : [],
      current_stage:       p.current_stage       || "",
      field:               p.field               || "",
      financial_situation: p.financial_situation || "",
      family_pressure:     p.family_pressure     || "",
      time_horizon:        p.time_horizon        || "",
      skills:              p.skills              || [],
      secret_dream:        p.secret_dream        || "",
      biggest_blocker:     p.biggest_blocker     || "",
      success_definition:  p.success_definition  || "",
      ten_year_vision:     p.ten_year_vision      || "",
      bio: p.secret_dream ? `"${p.secret_dream.slice(0, 80)}"` : "",
    });

    /* ── prediction row ── */
    const pred = data.prediction;
    if (!pred) { setLoading(false); return; }

    setReportText(pred.report_text || null);

    // Build normalizedTraits from DB (needed for skill widgets regardless)
    const nt: Record<string, number> = {};
    const raw = typeof pred.normalized_traits === "string"
      ? JSON.parse(pred.normalized_traits)
      : (pred.normalized_traits || {});
    for (const [k, v] of Object.entries(raw)) {
      nt[k] = Math.round((v as number) * 100);
    }

    // ── SINGLE SOURCE OF TRUTH: always re-derive from /predict ──────────
    // Never trust the stored thinking_style_primary string — it may be stale.
    // The ML server is the only authority on what the thinking style label is.
    let freshPrediction: any = null;
    if (Object.keys(raw).length > 0) {
      try {
        const mlRes = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            traits: raw,  // raw normalized values (0–1), not the ×100 version
            firebase_uid: firebaseUser.uid,
          }),
        });
        if (mlRes.ok) {
          freshPrediction = await mlRes.json();
        }
      } catch {
        // ML server offline — fall back to stored labels below
      }
    }

    if (freshPrediction) {
      // Use fully fresh ML result — thinking style, careers, traits all consistent
      setAssessResult({
        completed: true,
        thinking_style:   freshPrediction.thinking_style,
        top_careers:      freshPrediction.top_careers      ?? [],
        moderate_careers: freshPrediction.moderate_careers ?? [],
        dominant_traits:  freshPrediction.dominant_traits  ?? [],
        dimension_scores: freshPrediction.dimension_scores ?? {},
        normalizedTraits: nt,  // keep ×100 version for skill widgets
      });
    } else {
      // Fallback: ML server unreachable, use stored DB values
      // This means thinking style may be stale but it's better than nothing
      setAssessResult({
        completed: true,
        thinking_style: {
          primary:   pred.thinking_style_primary
            ? { label: pred.thinking_style_primary }   : undefined,
          secondary: pred.thinking_style_secondary
            ? { label: pred.thinking_style_secondary } : undefined,
        },
        top_careers: typeof pred.top_careers === "string"
          ? JSON.parse(pred.top_careers)
          : (pred.top_careers || []),
        moderate_careers: typeof pred.moderate_careers === "string"
          ? JSON.parse(pred.moderate_careers)
          : (pred.moderate_careers || []),
        dominant_traits: typeof pred.dominant_traits === "string"
          ? JSON.parse(pred.dominant_traits)
          : (pred.dominant_traits || []),
        dimension_scores: typeof pred.dimension_scores === "string"
          ? JSON.parse(pred.dimension_scores)
          : (pred.dimension_scores || {}),
        normalizedTraits: nt,
      });
    }

  } catch (err) {
    console.error("[UserContext] fetchAll failed:", err);
  } finally {
    setLoading(false);
  }
}, []);

  /* ── Auth listener ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async u => {
      if (!u) { setUid(null); setLoading(false); return; }
      setUid(u.uid);
      await fetchAll(u);
    });
    return () => unsub();
  }, [fetchAll]);

  /* ── refreshUser ────────────────────────────────────────────────────────── */
  const refreshUser = useCallback(async () => {
    const u = auth.currentUser;
    if (u) await fetchAll(u);
  }, [fetchAll]);

  /* ── saveUserData — calls POST /api/profile ────────────────────────────── */
const saveUserData = useCallback(async (partial: Partial<UserData>) => {
  if (!uid) return;
  setUserData(prev => ({ ...prev, ...partial }));

  // If only updating tag arrays, use PATCH (lighter)
  const isTagOnly = Object.keys(partial).every(k =>
    ["interests", "hobbies", "ownedSkills"].includes(k)
  );

  if (isTagOnly) {
    await fetch(`${API}/api/profile/${uid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        career_interests: partial.interests,
        hobbies:          partial.hobbies,
        owned_skills:     partial.ownedSkills,
      }),
    }).catch(err => console.error("[UserContext] patch:", err));
  } else {
    await fetch(`${API}/api/profile`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:              uid,
        current_stage:        partial.current_stage,
        field:                partial.field,
        financial_situation:  partial.financial_situation,
        family_pressure:      partial.family_pressure,
        time_horizon:         partial.time_horizon,
        skills:               partial.skills,
        free_time_activities: partial.hobbies,
        past_achievements:    partial.past_achievements,
        success_definition:   partial.success_definition,
        ten_year_vision:      partial.ten_year_vision,
        secret_dream:         partial.secret_dream,
        biggest_blocker:      partial.biggest_blocker,
        career_interests:     partial.interests,
        hobbies:              partial.hobbies,
        owned_skills:         partial.ownedSkills,
      }),
    }).catch(err => console.error("[UserContext] saveUserData:", err));
  }
}, [uid]);

const saveOwnedSkills = useCallback(async (ownedSkills: string[]) => {
  await saveUserData({ ownedSkills });
}, [saveUserData]);

  /* ── Derived values ─────────────────────────────────────────────────────── */
  const skillMap: Record<string, number> = React.useMemo(() => {
    if (!assessResult?.normalizedTraits) return {};
    return Object.fromEntries(
      Object.entries(assessResult.normalizedTraits)
        .filter(([k]) => !HIDDEN_TRAITS.includes(k))
        .map(([k, v]) => [k, v as number])
    );
  }, [assessResult]);

  const needsGainSkills = React.useMemo(
    () => Object.entries(skillMap).filter(([, v]) => v < 50).map(([k]) => k),
    [skillMap]
  );

  const existingSkills = React.useMemo(
    () => Object.entries(skillMap)
      .filter(([, v]) => v >= 50)
      .sort(([, a], [, b]) => b - a)
      .map(([k, v]) => ({ key: k, score: v })),
    [skillMap]
  );

  const skillsToAcquire = React.useMemo(
    () => parseSkillsToAcquire(reportText),
    [reportText]
  );

  const topCareers = React.useMemo(() => {
    if (!assessResult) return [];
    return [
      ...(assessResult.top_careers      ?? []),
      ...(assessResult.moderate_careers ?? []),
    ].slice(0, 8).map(c => typeof c === "object" ? c.name : String(c));
  }, [assessResult]);

  const isAssessed = !!(assessResult?.completed || assessResult?.top_careers?.length);

const value: UserContextValue = {
  uid, userData, assessResult, loading,
  refreshUser, saveUserData, saveOwnedSkills,
  skillMap, needsGainSkills, existingSkills,
  skillsToAcquire, topCareers, isAssessed,
};

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}