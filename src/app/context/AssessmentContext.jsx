// "use client";

// import { createContext, useContext, useState, useEffect } from "react";

// const AssessmentContext = createContext(null);

// const TRAIT_LIMITS = {
//   // Cognitive
//   logical: { min: 0, max: 10 },
//   analytical: { min: 0, max: 10 },
//   numerical: { min: 0, max: 10 },
//   verbal: { min: 0, max: 10 },
//   spatial: { min: 0, max: 10 },

//   // Behavioral
//   creativity: { min: 0, max: 10 },
//   discipline: { min: 0, max: 10 },
//   resilience: { min: -5, max: 5 },
//   independence: { min: -5, max: 5 },

//   // Social / Leadership
//   communication: { min: 0, max: 10 },
//   leadership: { min: 0, max: 10 },

//   // Meta (NOT part of vector)
//   confidence: { min: 0, max: 1 },
// };

// const normalizeTraits = (traits) => {
//   const normalized = {};
//   for (const trait in TRAIT_LIMITS) {
//     const value = traits[trait] ?? TRAIT_LIMITS[trait].min;
//     const { min, max } = TRAIT_LIMITS[trait];
//     normalized[trait] = Math.min(1, Math.max(0, (value - min) / (max - min))); // clamp 0–1
//   }
//   return normalized;
// };

// const FEATURE_ORDER = [
//   "logical",
//   "analytical",
//   "numerical",
//   "verbal",
//   "spatial",
//   "creativity",
//   "discipline",
//   "resilience",
//   "independence",
//   "communication",
//   "leadership",
// ];

// export const AssessmentProvider = ({ children }) => {
//   const [rawTraits, setRawTraits] = useState({});
//   const [normalizedTraits, setNormalizedTraits] = useState({});
//   const [userProfile, setUserProfile] = useState(null);
//   const [rawAnswers, setRawAnswers] = useState({});

//   const finalizeAssessment = (rawResult, answers) => {
//     setRawAnswers(answers);
//     const mergedTraits = {
//       ...rawResult.traits,
//       // confidence: rawResult.meta?.confidence ?? 0,
//     };

//     const normalized = normalizeTraits(mergedTraits);

//     const featureVector = FEATURE_ORDER.map(
//       (trait) => normalized[trait] ?? 0
//     );

//     // hard safety check
//     if (featureVector.length !== FEATURE_ORDER.length) {
//       throw new Error("Feature vector length mismatch");
//     }

//     const profile = {
//       rawTraits: mergedTraits,
//       normalizedTraits: normalized,
//       featureVector,
//       confidence: mergedTraits.confidence,
//       meta: {
//         ...rawResult.meta,
//         vectorVersion: "v1",
//       },
//     };

//     setRawTraits(mergedTraits);
//     setNormalizedTraits(normalized);
//     setUserProfile(profile);
//   };

//   useEffect(() => {
//   const saved = localStorage.getItem("userProfile");
//   if (saved) {
//     const parsed = JSON.parse(saved);
//     setUserProfile(parsed);
//     setRawTraits(parsed.rawTraits);
//     setNormalizedTraits(parsed.normalizedTraits);
//     setRawAnswers(parsed.rawAnswers ?? {}); // ← add this
//   }
// }, []);

// useEffect(() => {
//   if (userProfile) {
//     localStorage.setItem("userProfile", JSON.stringify({ ...userProfile, rawAnswers }));
//   }
// }, [userProfile, rawAnswers]);

//   return (
// // in the provider value:
// <AssessmentContext.Provider
//   value={{ rawTraits, normalizedTraits, userProfile, rawAnswers, finalizeAssessment }}
// >
//       {children}
//     </AssessmentContext.Provider>
//   );
// };

// export const useAssessment = () => useContext(AssessmentContext);


"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AssessmentContext = createContext(null);

// ── NEW: matches predict.js TRAIT_RANGES exactly ──────────────
const TRAIT_RANGES = {
  logical:                  [0,   18],
  analytical:               [0,   16],
  numerical:                [0,   14],
  verbal:                   [0,   14],
  spatial:                  [0,   14],
  creativity:               [-2,  10],
  discipline:               [-8,   8],
  resilience:               [-9,   8],
  independence:             [0,    8],
  adaptability:             [-5,   8],
  growth_mindset:           [-5,  12],
  risk_appetite:            [-4,  10],
  depth_focus:              [-4,  10],
  confidence:               [-4,   6],
  stress_tolerance:         [0,    4],
  accountability:           [-10,  2],
  initiative:               [-8,   8],
  problem_solving:          [0,   10],
  intrinsic_motivation:     [-6,  14],
  purpose_drive:            [-7,   8],
  passion_signal:           [-3,  10],
  fear_avoidance:           [0,   16],
  learning_orientation:     [-4,   4],
  communication:            [-4,  10],
  leadership:               [-2,  10],
  teamwork:                 [0,    4],
  empathy:                  [0,   10],
  emotional_intelligence:   [-5,   6],
  helping_orientation:      [0,   12],
  suppression_signal:       [0,   16],
  pressure_conformity:      [0,   14],
  childhood_divergence:     [0,    8],
  self_awareness:           [-2,   6],
  societal_impact_awareness:[-2,  12],
  innovation_drive:         [0,   12],
  legacy_thinking:          [-2,   8],
};

function normalizeTrait(trait, rawValue) {
  const range = TRAIT_RANGES[trait];
  if (!range) return 0.5;
  const [lo, hi] = range;
  const clamped = Math.max(lo, Math.min(hi, rawValue));
  return parseFloat(((clamped - lo) / (hi - lo)).toFixed(4));
}

function normalizeTraits(rawTraits) {
  const normalized = {};
  for (const [trait, value] of Object.entries(rawTraits)) {
    normalized[trait] = normalizeTrait(trait, value);
  }
  return normalized;
}

export const AssessmentProvider = ({ children }) => {
  const [userProfile, setUserProfile]   = useState(null);
  const [rawAnswers, setRawAnswers]     = useState({});
  const [prediction, setPrediction]     = useState(null); // ← stores Python ML result

  // ── finalizeAssessment: called from AptitudeTest on submit ──
  // rawResult = { traits: {}, meta: {} }  (from evaluateResponses)
  // answers   = the raw answers object
  // mlResult  = the full Python prediction response (from Node /api/predict)
  const finalizeAssessment = (rawResult, answers, mlResult = null) => {
    setRawAnswers(answers);

    const normalized = normalizeTraits(rawResult.traits ?? {});

    const profile = {
      rawTraits:        rawResult.traits ?? {},
      normalizedTraits: normalized,
      meta:             rawResult.meta ?? {},
    };

    setUserProfile(profile);

    if (mlResult) {
      setPrediction(mlResult);
    }
  };

  // ── Persist to localStorage ──────────────────────────────────
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