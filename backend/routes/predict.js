// import express from "express";
// import { aptitudeQuestions } from "../data/aptitudeQuestions.js";
// import { personalityWorkStyleQuestions } from "../data/personalityQuestions.js";

// const router = express.Router();

// const MODEL_FEATURES = [
//   "logical", "analytical", "numerical", "verbal", "spatial",
//   "creativity", "discipline", "resilience", "independence",
//   "communication", "leadership"
// ];

// const TRAIT_MAP = {
//   // aptitude traits (direct matches)
//   logical:                "logical",
//   analytical:             "analytical",
//   numerical:              "numerical",
//   spatial:                "spatial",
//   communication:          "communication",

//   // aptitude traits (remapped)
//   comprehension:          "verbal",

//   // personality traits (direct matches)
//   discipline:             "discipline",
//   resilience:             "resilience",
//   independence:           "independence",
//   leadership:             "leadership",

//   // personality traits (remapped)
//   growth_mindset:         "creativity",
//   adaptability:           "creativity",
//   problem_solving:        "analytical",
//   emotional_intelligence: "communication",
//   teamwork:               "communication",
//   confidence:             "leadership",
//   initiative:             "leadership",
//   accountability:         "discipline",
//   planning:               "discipline",
//   stress_tolerance:       "resilience",
//   motivation:             "resilience",
//   autonomy:               "independence",
//   self_directed:          "independence",
// };

// const FEATURE_MAX = {
//   logical:       10,
//   analytical:    10,
//   numerical:     15,
//   verbal:        10,
//   spatial:       10,
//   creativity:    10,
//   discipline:    10,
//   resilience:    10,
//   independence:  10,
//   communication: 15,
//   leadership:    15,
// };

// function computeScores(answers) {
//   const rawTraits = {};

//   for (const [questionId, userAnswer] of Object.entries(answers)) {

//     // Aptitude questions (have correctOption)
//     const aq = aptitudeQuestions.find(q => q.id === questionId);
//     if (aq?.correctOption !== undefined) {
//       if (userAnswer === aq.correctOption && aq.traits) {
//         for (const [trait, weight] of Object.entries(aq.traits)) {
//           rawTraits[trait] = (rawTraits[trait] || 0) + weight;
//         }
//       }
//       continue;
//     }

//     // Personality questions
//     const pq = personalityWorkStyleQuestions.find(q => q.id === questionId);
//     if (pq) {
//       let selectedOption;

//       if (typeof userAnswer === "number") {
//         selectedOption = pq.options?.[userAnswer];
//       } else {
//         selectedOption = pq.options?.find(opt => opt.label === userAnswer);
//       }

//       if (selectedOption?.traits) {
//         for (const [trait, weight] of Object.entries(selectedOption.traits)) {
//           rawTraits[trait] = (rawTraits[trait] || 0) + weight;
//         }
//       }
//     }
//   }

//   // Map raw traits → 11 model features
//   const modelFeatures = {};
//   MODEL_FEATURES.forEach(f => modelFeatures[f] = 0);

//   for (const [rawTrait, value] of Object.entries(rawTraits)) {
//     const mappedFeature = TRAIT_MAP[rawTrait];
//     if (mappedFeature) {
//       modelFeatures[mappedFeature] = (modelFeatures[mappedFeature] || 0) + value;
//     }
//   }

//   // Normalize to 0–1
//   const normalizedFeatures = {};
//   for (const [feature, value] of Object.entries(modelFeatures)) {
//     const max = FEATURE_MAX[feature] ?? 10;
//     normalizedFeatures[feature] = Math.min(1, Math.max(0, value / max));
//   }

//   return { rawTraits, modelFeatures, normalizedFeatures };
// }

// router.post("/", async (req, res) => {
//   try {
//     const { answers } = req.body;

//     console.log("📥 Received answers:", JSON.stringify(answers, null, 2));

//     if (!answers || typeof answers !== "object") {
//       return res.status(400).json({ error: "answers object required" });
//     }

//     const { rawTraits, modelFeatures, normalizedFeatures } = computeScores(answers);

//     console.log("📊 Raw model features:", modelFeatures);
//     console.log("✅ Normalized features sent to Python:", normalizedFeatures);

//     const mlRes = await fetch("http://localhost:8000/predict", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         aptitudeTraits:    normalizedFeatures,
//         personalityTraits: {}
//       }),
//     });

//     if (!mlRes.ok) {
//       const errText = await mlRes.text();
//       throw new Error(`ML error: ${mlRes.status} — ${errText}`);
//     }

//     const prediction = await mlRes.json();

//     console.log("🤖 Python prediction:", prediction);

//     res.json({
//       rawTraits,
//       modelFeatures,
//       normalizedFeatures,
//       prediction
//     });

//   } catch (err) {
//     console.error("❌ Predict error:", err.message);
//     res.status(500).json({ error: "Prediction failed", detail: err.message });
//   }
// });

// export default router;



// ============================================================
//  backend/routes/predict.js  (v3)
//  
//  Changes from v1:
//  - Single question file (no more separate personalityQuestions.js)
//  - True min-max normalization (negatives preserved, not clamped)
//  - All 35 traits extracted and sent to Python
//  - No trait remapping/collapsing — Python gets the full picture
// ============================================================

import express from "express";
import { aptitudeQuestions } from "../data/aptitudeQuestions.js";

const router = express.Router();

// ── TRAIT RANGES ─────────────────────────────────────────────
// min/max based on maximum possible accumulation across 60 questions
// Negative minimums are INTENTIONAL — do not change to 0
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

// ── TRUE MIN-MAX NORMALIZATION ────────────────────────────────
// Output: 0.0 to 1.0 — negative raw values become low but non-zero
// A score of -3 discipline is NOT 0 — it's meaningfully low
function normalizeTrait(trait, rawValue) {
  const range = TRAIT_RANGES[trait];
  if (!range) return 0.5; // unknown trait → neutral
  const [lo, hi] = range;
  const clamped = Math.max(lo, Math.min(hi, rawValue));
  return parseFloat(((clamped - lo) / (hi - lo)).toFixed(4));
}

// ── FEATURE EXTRACTION ────────────────────────────────────────
function computeScores(answers) {
  const rawTraits = {};

  // Initialize all known traits to 0
  for (const trait of Object.keys(TRAIT_RANGES)) {
    rawTraits[trait] = 0;
  }

  // Build question lookup map
  const questionMap = {};
  for (const q of aptitudeQuestions) {
    questionMap[q.id] = q;
  }

  for (const [questionId, userAnswer] of Object.entries(answers)) {
    const question = questionMap[questionId];
    if (!question) continue;

    // ── Personality / scenario questions (options are objects)
    if (Array.isArray(question.options) && typeof question.options[0] === "object") {
      let selectedOption = null;

      if (typeof userAnswer === "number") {
        selectedOption = question.options[userAnswer];
      } else if (typeof userAnswer === "string") {
        selectedOption = question.options.find(o => o.label === userAnswer);
      }

      if (selectedOption?.traits) {
        for (const [trait, delta] of Object.entries(selectedOption.traits)) {
          if (rawTraits[trait] !== undefined) {
            rawTraits[trait] += delta;
          } else {
            rawTraits[trait] = delta; // handle any new traits gracefully
          }
        }
      }
    }

    // ── Cognitive questions (correct/incorrect)
    else {
      const selectedIndex = typeof userAnswer === "number" ? userAnswer : parseInt(userAnswer);
      const isCorrect = selectedIndex === question.correctOption;

      if (isCorrect && question.traits) {
        for (const [trait, points] of Object.entries(question.traits)) {
          if (rawTraits[trait] !== undefined) {
            rawTraits[trait] += points;
          }
        }
      }
      // Wrong answers = 0 points. No penalty on cognitive.
    }
  }

  // ── Normalize using true min-max
  const normalizedTraits = {};
  for (const [trait, value] of Object.entries(rawTraits)) {
    normalizedTraits[trait] = normalizeTrait(trait, value);
  }

  return { rawTraits, normalizedTraits };
}

// ── ROUTE ─────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { answers } = req.body;

    console.log("📥 Received answers:", JSON.stringify(answers, null, 2));

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers object required" });
    }

    const { rawTraits, normalizedTraits } = computeScores(answers);

    console.log("📊 Raw traits:", rawTraits);
    console.log("✅ Normalized traits sent to Python:", normalizedTraits);

    // Log suppression flags for debugging
    if (normalizedTraits.suppression_signal > 0.6)
      console.log("⚠️  HIGH suppression signal detected");
    if (normalizedTraits.fear_avoidance > 0.65 && normalizedTraits.intrinsic_motivation < 0.45)
      console.log("⚠️  FEAR-DRIVEN path detected");
    if (normalizedTraits.pressure_conformity > 0.6)
      console.log("⚠️  HIGH external pressure conformity detected");

    // Call Python ML
    const mlRes = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ traits: normalizedTraits }),
    });

    if (!mlRes.ok) {
      const errText = await mlRes.text();
      throw new Error(`ML error: ${mlRes.status} — ${errText}`);
    }

    const prediction = await mlRes.json();
    console.log("🤖 Python prediction:", prediction);

    res.json({
      rawTraits,
      normalizedTraits,
      prediction,
    });

  } catch (err) {
    console.error("❌ Predict error:", err.message);
    res.status(500).json({ error: "Prediction failed", detail: err.message });
  }
});

export default router;