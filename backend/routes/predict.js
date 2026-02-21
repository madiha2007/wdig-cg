import express from "express";
import { aptitudeQuestions } from "../data/aptitudeQuestions.js";
import { personalityWorkStyleQuestions } from "../data/personalityQuestions.js";

const router = express.Router();

const MODEL_FEATURES = [
  "logical", "analytical", "numerical", "verbal", "spatial",
  "creativity", "discipline", "resilience", "independence",
  "communication", "leadership"
];

const TRAIT_MAP = {
  // aptitude traits (direct matches)
  logical:                "logical",
  analytical:             "analytical",
  numerical:              "numerical",
  spatial:                "spatial",
  communication:          "communication",

  // aptitude traits (remapped)
  comprehension:          "verbal",

  // personality traits (direct matches)
  discipline:             "discipline",
  resilience:             "resilience",
  independence:           "independence",
  leadership:             "leadership",

  // personality traits (remapped)
  growth_mindset:         "creativity",
  adaptability:           "creativity",
  problem_solving:        "analytical",
  emotional_intelligence: "communication",
  teamwork:               "communication",
  confidence:             "leadership",
  initiative:             "leadership",
  accountability:         "discipline",
  planning:               "discipline",
  stress_tolerance:       "resilience",
  motivation:             "resilience",
  autonomy:               "independence",
  self_directed:          "independence",
};

const FEATURE_MAX = {
  logical:       10,
  analytical:    10,
  numerical:     15,
  verbal:        10,
  spatial:       10,
  creativity:    10,
  discipline:    10,
  resilience:    10,
  independence:  10,
  communication: 15,
  leadership:    15,
};

function computeScores(answers) {
  const rawTraits = {};

  for (const [questionId, userAnswer] of Object.entries(answers)) {

    // Aptitude questions (have correctOption)
    const aq = aptitudeQuestions.find(q => q.id === questionId);
    if (aq?.correctOption !== undefined) {
      if (userAnswer === aq.correctOption && aq.traits) {
        for (const [trait, weight] of Object.entries(aq.traits)) {
          rawTraits[trait] = (rawTraits[trait] || 0) + weight;
        }
      }
      continue;
    }

    // Personality questions
    const pq = personalityWorkStyleQuestions.find(q => q.id === questionId);
    if (pq) {
      let selectedOption;

      if (typeof userAnswer === "number") {
        selectedOption = pq.options?.[userAnswer];
      } else {
        selectedOption = pq.options?.find(opt => opt.label === userAnswer);
      }

      if (selectedOption?.traits) {
        for (const [trait, weight] of Object.entries(selectedOption.traits)) {
          rawTraits[trait] = (rawTraits[trait] || 0) + weight;
        }
      }
    }
  }

  // Map raw traits → 11 model features
  const modelFeatures = {};
  MODEL_FEATURES.forEach(f => modelFeatures[f] = 0);

  for (const [rawTrait, value] of Object.entries(rawTraits)) {
    const mappedFeature = TRAIT_MAP[rawTrait];
    if (mappedFeature) {
      modelFeatures[mappedFeature] = (modelFeatures[mappedFeature] || 0) + value;
    }
  }

  // Normalize to 0–1
  const normalizedFeatures = {};
  for (const [feature, value] of Object.entries(modelFeatures)) {
    const max = FEATURE_MAX[feature] ?? 10;
    normalizedFeatures[feature] = Math.min(1, Math.max(0, value / max));
  }

  return { rawTraits, modelFeatures, normalizedFeatures };
}

router.post("/", async (req, res) => {
  try {
    const { answers } = req.body;

    console.log("📥 Received answers:", JSON.stringify(answers, null, 2));

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers object required" });
    }

    const { rawTraits, modelFeatures, normalizedFeatures } = computeScores(answers);

    console.log("📊 Raw model features:", modelFeatures);
    console.log("✅ Normalized features sent to Python:", normalizedFeatures);

    const mlRes = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aptitudeTraits:    normalizedFeatures,
        personalityTraits: {}
      }),
    });

    if (!mlRes.ok) {
      const errText = await mlRes.text();
      throw new Error(`ML error: ${mlRes.status} — ${errText}`);
    }

    const prediction = await mlRes.json();

    console.log("🤖 Python prediction:", prediction);

    res.json({
      rawTraits,
      modelFeatures,
      normalizedFeatures,
      prediction
    });

  } catch (err) {
    console.error("❌ Predict error:", err.message);
    res.status(500).json({ error: "Prediction failed", detail: err.message });
  }
});

export default router;