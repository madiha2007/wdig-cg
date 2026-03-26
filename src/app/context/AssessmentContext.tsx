"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  rawTraits: Record<string, number>;
  normalizedTraits: Record<string, number>;
  meta: Record<string, any>;
}

interface AssessmentContextValue {
  userProfile: UserProfile | null;
  rawAnswers: Record<string, any>;
  prediction: any | null;
  setPrediction: (val: any) => void;
  finalizeAssessment: (rawResult: any, answers: any, mlResult?: any) => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

const TRAIT_RANGES: Record<string, [number, number]> = {
  logical: [0, 18],
  analytical: [0, 16],
  numerical: [0, 14],
  verbal: [0, 14],
  spatial: [0, 14],
  creativity: [-2, 10],
  discipline: [-8, 8],
  resilience: [-9, 8],
  independence: [0, 8],
  adaptability: [-5, 8],
  growth_mindset: [-5, 12],
  risk_appetite: [-4, 10],
  depth_focus: [-4, 10],
  confidence: [-4, 6],
  stress_tolerance: [0, 4],
  accountability: [-10, 2],
  initiative: [-8, 8],
  problem_solving: [0, 10],
  intrinsic_motivation: [-6, 14],
  purpose_drive: [-7, 8],
  passion_signal: [-3, 10],
  fear_avoidance: [0, 16],
  learning_orientation: [-4, 4],
  communication: [-4, 10],
  leadership: [-2, 10],
  teamwork: [0, 4],
  empathy: [0, 10],
  emotional_intelligence: [-5, 6],
  helping_orientation: [0, 12],
  suppression_signal: [0, 16],
  pressure_conformity: [0, 14],
  childhood_divergence: [0, 8],
  self_awareness: [-2, 6],
  societal_impact_awareness: [-2, 12],
  innovation_drive: [0, 12],
  legacy_thinking: [-2, 8],
};

function normalizeTrait(trait: string, rawValue: number): number {
  const range = TRAIT_RANGES[trait];
  if (!range) return 0.5;
  const [lo, hi] = range;
  const clamped = Math.max(lo, Math.min(hi, rawValue));
  return parseFloat(((clamped - lo) / (hi - lo)).toFixed(4));
}

function normalizeTraits(rawTraits: Record<string, number>): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [trait, value] of Object.entries(rawTraits)) {
    normalized[trait] = normalizeTrait(trait, value);
  }
  return normalized;
}

export const AssessmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [rawAnswers, setRawAnswers] = useState<Record<string, any>>({});
  const [prediction, setPrediction] = useState<any | null>(null);

  const finalizeAssessment = (rawResult: any, answers: any, mlResult: any = null) => {
    setRawAnswers(answers);
    const normalized = normalizeTraits(rawResult.traits ?? {});
    const profile: UserProfile = {
      rawTraits: rawResult.traits ?? {},
      normalizedTraits: normalized,
      meta: rawResult.meta ?? {},
    };
    setUserProfile(profile);
    if (mlResult) setPrediction(mlResult);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wdig_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed.profile ?? null);
        setRawAnswers(parsed.rawAnswers ?? {});
        setPrediction(parsed.prediction ?? null);
      }
    } catch (e) {
      console.warn("Could not restore profile:", e);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      try {
        localStorage.setItem("wdig_profile", JSON.stringify({
          profile: userProfile,
          rawAnswers,
          prediction,
        }));
      } catch (e) {
        console.warn("Could not save profile:", e);
      }
    }
  }, [userProfile, rawAnswers, prediction]);

  return (
    <AssessmentContext.Provider value={{
      userProfile,
      rawAnswers,
      prediction,
      setPrediction,
      finalizeAssessment,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => useContext(AssessmentContext);