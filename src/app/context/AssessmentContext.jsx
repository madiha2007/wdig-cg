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

//   // Meta
//   confidence: { min: 0, max: 1 }, // derived from time
// };


// const normalizeTraits = (traits) => {
//   const normalized = {};

//   for (const trait in TRAIT_LIMITS) {
//     const value = traits[trait] ?? TRAIT_LIMITS[trait].min;
//     const { min, max } = TRAIT_LIMITS[trait];
//     normalized[trait] = (value - min) / (max - min);
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

//   const finalizeAssessment = (rawResult) => {

//     // 🔹 merge traits + confidence
// const mergedTraits = {
//   ...rawResult.traits,
//   confidence: rawResult.meta?.confidence ?? 0,
// };


//     const normalized = normalizeTraits(mergedTraits);

// const featureVector = FEATURE_ORDER.map(
//   trait => normalized[trait] ?? 0
// );


//     const profile = {
//       rawTraits: mergedTraits,
//       normalizedTraits: normalized,
//       featureVector,
//       confidence,
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
//     const saved = localStorage.getItem("userProfile");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setUserProfile(parsed);
//       setRawTraits(parsed.rawTraits);
//       setNormalizedTraits(parsed.normalizedTraits);
//     }
//   }, []);

//   useEffect(() => {
//     if (userProfile) {
//       localStorage.setItem("userProfile", JSON.stringify(userProfile));
//     }
//   }, [userProfile]);

//   return (
//     <AssessmentContext.Provider
//       value={{
//         rawTraits,
//         normalizedTraits,
//         userProfile,
//         finalizeAssessment,
//       }}
//     >
//       {children}
//     </AssessmentContext.Provider>
//   );
// };

// export const useAssessment = () => useContext(AssessmentContext);



"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AssessmentContext = createContext(null);

const TRAIT_LIMITS = {
  // Cognitive
  logical: { min: 0, max: 10 },
  analytical: { min: 0, max: 10 },
  numerical: { min: 0, max: 10 },
  verbal: { min: 0, max: 10 },
  spatial: { min: 0, max: 10 },

  // Behavioral
  creativity: { min: 0, max: 10 },
  discipline: { min: 0, max: 10 },
  resilience: { min: -5, max: 5 },
  independence: { min: -5, max: 5 },

  // Social / Leadership
  communication: { min: 0, max: 10 },
  leadership: { min: 0, max: 10 },

  // Meta (NOT part of vector)
  confidence: { min: 0, max: 1 },
};

const normalizeTraits = (traits) => {
  const normalized = {};

  for (const trait in TRAIT_LIMITS) {
    const value = traits[trait] ?? TRAIT_LIMITS[trait].min;
    const { min, max } = TRAIT_LIMITS[trait];
    normalized[trait] = (value - min) / (max - min);
  }

  return normalized;
};

const FEATURE_ORDER = [
  "logical",
  "analytical",
  "numerical",
  "verbal",
  "spatial",
  "creativity",
  "discipline",
  "resilience",
  "independence",
  "communication",
  "leadership",
];

export const AssessmentProvider = ({ children }) => {
  const [rawTraits, setRawTraits] = useState({});
  const [normalizedTraits, setNormalizedTraits] = useState({});
  const [userProfile, setUserProfile] = useState(null);

  const finalizeAssessment = (rawResult) => {
    const mergedTraits = {
      ...rawResult.traits,
      // confidence: rawResult.meta?.confidence ?? 0,
    };

    const normalized = normalizeTraits(mergedTraits);

    const featureVector = FEATURE_ORDER.map(
      (trait) => normalized[trait] ?? 0
    );

    // hard safety check
    if (featureVector.length !== FEATURE_ORDER.length) {
      throw new Error("Feature vector length mismatch");
    }

    const profile = {
      rawTraits: mergedTraits,
      normalizedTraits: normalized,
      featureVector,
      confidence: mergedTraits.confidence,
      meta: {
        ...rawResult.meta,
        vectorVersion: "v1",
      },
    };

    setRawTraits(mergedTraits);
    setNormalizedTraits(normalized);
    setUserProfile(profile);
  };

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserProfile(parsed);
      setRawTraits(parsed.rawTraits);
      setNormalizedTraits(parsed.normalizedTraits);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem("userProfile", JSON.stringify(userProfile));
    }
  }, [userProfile]);

  return (
    <AssessmentContext.Provider
      value={{
        rawTraits,
        normalizedTraits,
        userProfile,
        finalizeAssessment,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => useContext(AssessmentContext);
