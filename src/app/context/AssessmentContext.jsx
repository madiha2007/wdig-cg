"use client";

import { createContext, useContext, useState } from "react";

const AssessmentContext = createContext(null);

/* 1️⃣ Trait limits (VERY IMPORTANT) */
const TRAIT_LIMITS = {
  logical: { min: 0, max: 100 },
  analytical: { min: 0, max: 100 },
  verbal: { min: 0, max: 100 },
  creativity: { min: 0, max: 20 },
  leadership: { min: 0, max: 10 },
};

/* 2️⃣ Normalize helper */
const normalizeTraits = (rawTraits) => {
  const normalized = {};

  for (const trait in rawTraits) {
    const { min, max } = TRAIT_LIMITS[trait];
    normalized[trait] = (rawTraits[trait] - min) / (max - min);
  }

  return normalized;
};

export const AssessmentProvider = ({ children }) => {
  /* 3️⃣ State */
  const [rawTraits, setRawTraits] = useState({});
  const [normalizedTraits, setNormalizedTraits] = useState({});
  const [userProfile, setUserProfile] = useState(null);

  /* 4️⃣ Finalize assessment (CALL THIS AFTER TEST) */
  const finalizeAssessment = (calculatedRawTraits) => {
    const normalized = normalizeTraits(calculatedRawTraits);

    setRawTraits(calculatedRawTraits);
    setNormalizedTraits(normalized);

    // ML-ready user profile
    setUserProfile({
      traits: normalized,
      featureVector: Object.values(normalized),
    });
  };

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

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used inside AssessmentProvider");
  }
  return context;
};
