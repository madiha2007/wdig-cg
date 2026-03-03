// backend/routes/report.js
// GET  /api/report/:firebase_uid       → generate + return report text
// GET  /api/report/:firebase_uid/pdf   → download as PDF

import express from "express";
import pool from "../db/index.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Build Claude prompt from DB row ───────────────────────────────────────────
function buildPrompt(prediction, traits) {
  const top        = prediction.top_careers    || [];
  const moderate   = prediction.moderate_careers || [];
  const dominant   = prediction.dominant_traits  || [];
  const dimScores  = prediction.dimension_scores || {};
  const suppression = prediction.suppression    || {};
  const flags      = suppression.flags          || [];
  const nt         = traits || {};

  const traitLines = dominant
    .map(t => `- ${t.label}: ${t.score}%`)
    .join("\n");

  const careerLines = top.slice(0, 3)
    .map((c, i) => `${i + 1}. ${c.name} (Match Score: ${c.score}%) — ${c.society_role}`)
    .join("\n");

  const moderateLines = moderate.slice(0, 3)
    .map(c => `- ${c.name} (${c.score}%)`)
    .join("\n");

  const suppressionLines = flags.length
    ? flags.map(f => `- ${f.title}: ${f.insight}`).join("\n")
    : "No significant suppression patterns detected.";

  const dimLines = Object.entries(dimScores)
    .map(([k, v]) => `${k}: ${v}/100`)
    .join(", ");

  return `You are a world-class career counselor and psychologist writing a deeply personalized aptitude and career report for a specific individual. Write in a warm, insightful, direct tone — like a brilliant mentor who genuinely understands this person. Every sentence must feel written specifically for THIS person based on their data. Do not be generic.

═══════════════════════════════
THEIR COMPLETE PROFILE
═══════════════════════════════

THINKING STYLE:
Primary: ${prediction.thinking_style_primary}
Secondary: ${prediction.thinking_style_secondary || "None detected"}

TOP 5 DOMINANT TRAITS:
${traitLines}

DIMENSION SCORES (out of 100):
${dimLines}

KEY TRAIT VALUES (0–1 scale):
- Creativity: ${nt.n_creativity?.toFixed(2) ?? "N/A"}
- Analytical: ${nt.n_analytical?.toFixed(2) ?? "N/A"}
- Empathy: ${nt.n_empathy?.toFixed(2) ?? "N/A"}
- Leadership: ${nt.n_leadership?.toFixed(2) ?? "N/A"}
- Risk Appetite: ${nt.n_risk_appetite?.toFixed(2) ?? "N/A"}
- Intrinsic Motivation: ${nt.n_intrinsic_motivation?.toFixed(2) ?? "N/A"}
- Purpose Drive: ${nt.n_purpose_drive?.toFixed(2) ?? "N/A"}
- Discipline: ${nt.n_discipline?.toFixed(2) ?? "N/A"}
- Resilience: ${nt.n_resilience?.toFixed(2) ?? "N/A"}
- Depth of Focus: ${nt.n_depth_focus?.toFixed(2) ?? "N/A"}
- Suppression Signal: ${nt.n_suppression_signal?.toFixed(2) ?? "N/A"}
- Childhood Divergence: ${nt.n_childhood_divergence?.toFixed(2) ?? "N/A"}
- Fear Avoidance: ${nt.n_fear_avoidance?.toFixed(2) ?? "N/A"}
- Societal Impact Awareness: ${nt.n_societal_impact_awareness?.toFixed(2) ?? "N/A"}
- Innovation Drive: ${nt.n_innovation_drive?.toFixed(2) ?? "N/A"}
- Self Awareness: ${nt.n_self_awareness?.toFixed(2) ?? "N/A"}
- Initiative: ${nt.n_initiative?.toFixed(2) ?? "N/A"}

TOP CAREER MATCHES:
${careerLines}

ALSO SCORED WELL IN:
${moderateLines}

SUPPRESSION ANALYSIS:
Has suppression: ${suppression.has_suppression}
Suppression level: ${suppression.suppression_level}/10
${suppressionLines}

═══════════════════════════════
REPORT INSTRUCTIONS
═══════════════════════════════

Write a complete, deeply personal aptitude report with EXACTLY these 5 sections.
Use these exact headers. Write in flowing paragraphs — NOT bullet points.
Each section should be 3–5 paragraphs. Be specific — reference their actual scores.

## 1. Who You Are
Write a rich personality breakdown. Describe how this person thinks, what drives them internally, how they relate to challenge, other people, and their own ambitions. Reference their thinking style and specific dominant traits naturally in prose. Make them feel deeply understood — like you've known them for years.

## 2. What's Holding You Back
${suppression.has_suppression
  ? "This person shows suppression patterns. Write compassionately but directly about what the data reveals — external pressure, unexplored passions, fear-driven choices, or a gap between who they are and the path they're on. Reference specific suppression flags. Help them see what they may not have allowed themselves to see."
  : "Write about the internal friction points visible in this profile — areas of low resilience, discipline, or self-awareness that could limit them if unaddressed. Be constructive and forward-looking, not discouraging."
}

## 3. What You Can Offer the World
Based on their societal impact awareness, empathy, innovation drive, and career matches — write specifically about what this person is positioned to contribute. What problems are they built to solve? What would the world look like if they fully showed up? Be inspiring and specific, not generic.

## 4. Your Career Roadmap
For each of the top 3 career matches, write:
- Why this career fits THIS person specifically (reference their traits)
- What the day-to-day actually looks like
- 4–5 concrete steps to get there from where they are now
- A realistic timeline

## 5. Your Educational Pathway
Based on their career roadmap, recommend specific streams, degrees, entrance exams, and institutions relevant to India. Include: which stream to choose in Class 11–12, which entrance exams to prepare for (JEE, NEET, CLAT, NID, NIFT, CAT, UPSC etc. as relevant), top college options, and a timeline from now to entering their field.

Close with a single powerful paragraph — a direct personal message to this individual about their potential and what's possible if they trust themselves. Make it memorable. No generic motivational quotes.`;
}

// ── GET /api/report/:firebase_uid ─────────────────────────────────────────────
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const { force } = req.query; // ?force=true to regenerate

    // 1. Get latest prediction
    const predRes = await pool.query(
      `SELECT p.*, t.n_creativity, t.n_analytical, t.n_empathy, t.n_leadership,
              t.n_risk_appetite, t.n_intrinsic_motivation, t.n_purpose_drive,
              t.n_discipline, t.n_resilience, t.n_depth_focus,
              t.n_suppression_signal, t.n_childhood_divergence, t.n_fear_avoidance,
              t.n_societal_impact_awareness, t.n_innovation_drive,
              t.n_self_awareness, t.n_initiative
       FROM predictions p
       LEFT JOIN trait_snapshots t ON t.session_id = p.session_id
       WHERE p.firebase_uid = $1
       ORDER BY p.created_at DESC
       LIMIT 1`,
      [firebase_uid]
    );

    if (predRes.rows.length === 0) {
      return res.status(404).json({
        error: "No test results found. Please take the assessment first."
      });
    }

    const prediction = predRes.rows[0];

    // 2. Check for cached report (skip if force=true)
    if (force !== "true") {
      const cached = await pool.query(
        `SELECT report_text, generated_at FROM reports WHERE prediction_id = $1`,
        [prediction.id]
      );

      if (cached.rows.length > 0) {
        console.log("📄 Returning cached report");

        // Increment view count
        await pool.query(
          `UPDATE reports SET viewed_count = viewed_count + 1 WHERE prediction_id = $1`,
          [prediction.id]
        );

        return res.json({
          report:                  cached.rows[0].report_text,
          prediction_id:           prediction.id,
          thinking_style_primary:  prediction.thinking_style_primary,
          generated_at:            cached.rows[0].generated_at,
          from_cache:              true,
        });
      }
    }

    // 3. Generate new report via Claude
    console.log("🤖 Generating report via Claude API...");

    const prompt = buildPrompt(prediction, prediction);

const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 4000,
});
const reportText = completion.choices[0].message.content;
const tokensUsed = completion.usage?.total_tokens || 0;

    // 4. Cache the report in DB
    await pool.query(
      `INSERT INTO reports (prediction_id, firebase_uid, report_text, model_used, tokens_used)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (prediction_id) DO UPDATE SET
         report_text  = EXCLUDED.report_text,
         generated_at = NOW(),
         tokens_used  = EXCLUDED.tokens_used`,
      [prediction.id, firebase_uid, reportText, "claude-sonnet-4-20250514", tokensUsed]
    );

    // 5. Log event
    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
       VALUES ($1, 'report_generated', $2, $3)`,
      [firebase_uid, prediction.session_id, JSON.stringify({ tokens_used: tokensUsed })]
    );

    console.log(`✅ Report generated — ${tokensUsed} tokens used`);

    res.json({
      report:                 reportText,
      prediction_id:          prediction.id,
      thinking_style_primary: prediction.thinking_style_primary,
      generated_at:           new Date().toISOString(),
      from_cache:             false,
    });

  } catch (err) {
    console.error("❌ Report error:", err.message);
    res.status(500).json({ error: "Report generation failed", detail: err.message });
  }
});

// ── GET /api/report/:firebase_uid/pdf ─────────────────────────────────────────
router.get("/:firebase_uid/pdf", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    // Get the report (generate if not cached)
    const reportRes = await fetch(
      `http://localhost:5000/api/report/${firebase_uid}`
    );

    if (!reportRes.ok) {
      return res.status(404).json({ error: "Report not found" });
    }

    const { report, thinking_style_primary } = await reportRes.json();

    // Ask Python to generate the PDF
    const pdfRes = await fetch("http://localhost:8000/generate-pdf", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ report, thinking_style_primary, firebase_uid }),
    });

    if (!pdfRes.ok) {
      throw new Error("PDF generation failed");
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    // Log PDF download
    await pool.query(
      `UPDATE reports SET downloaded_pdf = TRUE
       WHERE firebase_uid = $1
       ORDER BY generated_at DESC
       LIMIT 1`,
      [firebase_uid]
    );

    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, metadata)
       VALUES ($1, 'pdf_downloaded', $2)`,
      [firebase_uid, JSON.stringify({ thinking_style_primary })]
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="wdig-report.pdf"`
    );
    res.send(Buffer.from(pdfBuffer));

  } catch (err) {
    console.error("❌ PDF error:", err.message);
    res.status(500).json({ error: "PDF generation failed", detail: err.message });
  }
});

export default router;
