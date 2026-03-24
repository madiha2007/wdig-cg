import express from "express";
import pool from "../db/index.js";
import { aptitudeQuestions } from "../data/aptitudeQuestions.js";

const router = express.Router();

// ── TRAIT RANGES ─────────────────────────────────────────────
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
function normalizeTrait(trait, rawValue) {
  const range = TRAIT_RANGES[trait];
  if (!range) return 0.5;
  const [lo, hi] = range;
  const clamped = Math.max(lo, Math.min(hi, rawValue));
  return parseFloat(((clamped - lo) / (hi - lo)).toFixed(4));
}

// ── FEATURE EXTRACTION ────────────────────────────────────────
function computeScores(answers) {
  const rawTraits = {};

  for (const trait of Object.keys(TRAIT_RANGES)) {
    rawTraits[trait] = 0;
  }

  const questionMap = {};
  for (const q of aptitudeQuestions) {
    questionMap[q.id] = q;
  }

  for (const [questionId, userAnswer] of Object.entries(answers)) {
    const question = questionMap[questionId];
    if (!question) continue;

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
            rawTraits[trait] = delta;
          }
        }
      }
    } else {
      const selectedIndex = typeof userAnswer === "number" ? userAnswer : parseInt(userAnswer);
      const isCorrect = selectedIndex === question.correctOption;

      if (isCorrect && question.traits) {
        for (const [trait, points] of Object.entries(question.traits)) {
          if (rawTraits[trait] !== undefined) {
            rawTraits[trait] += points;
          }
        }
      }
    }
  }

  const normalizedTraits = {};
  for (const [trait, value] of Object.entries(rawTraits)) {
    normalizedTraits[trait] = normalizeTrait(trait, value);
  }

  return { rawTraits, normalizedTraits };
}

// ── SAVE ALL TO DATABASE ──────────────────────────────────────
async function saveAllToDatabase(firebase_uid, answers, rawTraits, normalizedTraits, prediction) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Ensure user exists
    if (firebase_uid) {
      await client.query(
        `INSERT INTO users (firebase_uid) VALUES ($1)
         ON CONFLICT (firebase_uid) DO UPDATE SET last_active = NOW()`,
        [firebase_uid]
      );
    }

    // 2. Create completed session
    const sessionRes = await client.query(
      `INSERT INTO sessions (firebase_uid, completed_at, is_complete)
       VALUES ($1, NOW(), TRUE) RETURNING id`,
      [firebase_uid || null]
    );
    const sessionId = sessionRes.rows[0].id;

    // 3. Save every answer
    for (const [questionId, answerValue] of Object.entries(answers)) {
      const q = aptitudeQuestions.find(q => q.id === questionId);
      await client.query(
        `INSERT INTO answers (session_id, question_id, section, answer_value)
         VALUES ($1, $2, $3, $4)`,
        [sessionId, questionId, q?.section || null, String(answerValue)]
      );
    }

    // 4. Save trait snapshot
    const nt = normalizedTraits;
    await client.query(
      `INSERT INTO trait_snapshots (
        session_id, firebase_uid, raw_traits, normalized_traits,
        n_logical, n_analytical, n_numerical, n_verbal, n_spatial,
        n_creativity, n_discipline, n_resilience, n_independence, n_adaptability,
        n_growth_mindset, n_risk_appetite, n_depth_focus, n_confidence,
        n_stress_tolerance, n_accountability, n_initiative,
        n_communication, n_leadership, n_teamwork, n_empathy,
        n_emotional_intelligence, n_helping_orientation,
        n_intrinsic_motivation, n_purpose_drive, n_passion_signal,
        n_fear_avoidance, n_learning_orientation,
        n_suppression_signal, n_pressure_conformity,
        n_childhood_divergence, n_self_awareness,
        n_societal_impact_awareness, n_innovation_drive, n_legacy_thinking
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39
      )`,
      [
        sessionId, firebase_uid || null,
        JSON.stringify(rawTraits), JSON.stringify(normalizedTraits),
        nt.logical,        nt.analytical,     nt.numerical,  nt.verbal,    nt.spatial,
        nt.creativity,     nt.discipline,     nt.resilience, nt.independence, nt.adaptability,
        nt.growth_mindset, nt.risk_appetite,  nt.depth_focus, nt.confidence,
        nt.stress_tolerance, nt.accountability, nt.initiative,
        nt.communication,  nt.leadership,     nt.teamwork,   nt.empathy,
        nt.emotional_intelligence, nt.helping_orientation,
        nt.intrinsic_motivation,   nt.purpose_drive, nt.passion_signal,
        nt.fear_avoidance,         nt.learning_orientation,
        nt.suppression_signal,     nt.pressure_conformity,
        nt.childhood_divergence,   nt.self_awareness,
        nt.societal_impact_awareness, nt.innovation_drive, nt.legacy_thinking,
      ]
    );

    // 5. Save prediction
    const top = prediction.top_careers || [];
    const suppression = prediction.suppression || {};
    await client.query(
      `INSERT INTO predictions (
        session_id, firebase_uid,
        thinking_style_primary, thinking_style_secondary,
        top_careers, moderate_careers,
        career_1, career_2, career_3,
        dominant_traits, dimension_scores,
        suppression, has_suppression, suppression_level, ml_version
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        sessionId, firebase_uid || null,
        prediction.thinking_style?.primary?.label   || null,
        prediction.thinking_style?.secondary?.label || null,
        JSON.stringify(top),
        JSON.stringify(prediction.moderate_careers || []),
        top[0]?.name || null, top[1]?.name || null, top[2]?.name || null,
        JSON.stringify(prediction.dominant_traits  || []),
        JSON.stringify(prediction.dimension_scores || {}),
        JSON.stringify(suppression),
        suppression.has_suppression   || false,
        suppression.suppression_level || 0,
        prediction.version || "4.1",
      ]
    );

    // 6. Update career stats
    for (let i = 0; i < Math.min(top.length, 5); i++) {
      const career = top[i];
      await client.query(
        `INSERT INTO career_stats (career_name, times_top_1, times_top_3, times_top_5, avg_score)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (career_name) DO UPDATE SET
           times_top_1  = career_stats.times_top_1  + $2,
           times_top_3  = career_stats.times_top_3  + $3,
           times_top_5  = career_stats.times_top_5  + $4,
           avg_score    = (career_stats.avg_score + $5) / 2,
           last_updated = NOW()`,
        [career.name, i === 0 ? 1 : 0, i < 3 ? 1 : 0, 1, career.score]
      );
    }

    // 7. Log app event
    await client.query(
      `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
       VALUES ($1, 'test_completed', $2, $3)`,
      [
        firebase_uid || null,
        sessionId,
        JSON.stringify({
          thinking_style:  prediction.thinking_style?.primary?.id,
          top_career:      top[0]?.name,
          has_suppression: suppression.has_suppression,
        }),
      ]
    );

    await client.query("COMMIT");
    console.log("✅ Saved to DB — session:", sessionId);
    return sessionId;

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ DB save failed:", err.message);
    return null;
  } finally {
    client.release();
  }
}

// ── ROUTE ─────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { answers, firebase_uid } = req.body;

    console.log("📥 Received answers:", JSON.stringify(answers, null, 2));

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers object required" });
    }

    const { rawTraits, normalizedTraits } = computeScores(answers);

    console.log("📊 Raw traits:", rawTraits);
    console.log("✅ Normalized traits sent to Python:", normalizedTraits);

    if (normalizedTraits.suppression_signal > 0.6)
      console.log("⚠️  HIGH suppression signal detected");
    if (normalizedTraits.fear_avoidance > 0.65 && normalizedTraits.intrinsic_motivation < 0.45)
      console.log("⚠️  FEAR-DRIVEN path detected");
    if (normalizedTraits.pressure_conformity > 0.6)
      console.log("⚠️  HIGH external pressure conformity detected");

    const mlRes = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ traits: normalizedTraits, firebase_uid }),
    });

    if (!mlRes.ok) {
      const errText = await mlRes.text();
      throw new Error(`ML error: ${mlRes.status} — ${errText}`);
    }

    const prediction = await mlRes.json();
    console.log("🤖 Python prediction:", prediction);

    // Save to DB — non-blocking
    saveAllToDatabase(firebase_uid, answers, rawTraits, normalizedTraits, prediction)
      .catch(err => console.error("DB save error:", err.message));

    res.json({ rawTraits, normalizedTraits, prediction });

  } catch (err) {
    console.error("❌ Predict error:", err.message);
    res.status(500).json({ error: "Prediction failed", detail: err.message });
  }
});

export default router;