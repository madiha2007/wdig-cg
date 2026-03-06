// // // backend/routes/report.js
// // // GET  /api/report/:firebase_uid       → generate + return report text
// // // GET  /api/report/:firebase_uid/pdf   → download as PDF

// // import express from "express";
// // import pool from "../db/index.js";
// // import Groq from "groq-sdk";

// // const router = express.Router();
// // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // // ── Build Claude prompt from DB row ───────────────────────────────────────────
// // function buildPrompt(prediction, traits) {
// //   const top        = prediction.top_careers    || [];
// //   const moderate   = prediction.moderate_careers || [];
// //   const dominant   = prediction.dominant_traits  || [];
// //   const dimScores  = prediction.dimension_scores || {};
// //   const suppression = prediction.suppression    || {};
// //   const flags      = suppression.flags          || [];
// //   const nt         = traits || {};

// //   const traitLines = dominant
// //     .map(t => `- ${t.label}: ${t.score}%`)
// //     .join("\n");

// //   const careerLines = top.slice(0, 3)
// //     .map((c, i) => `${i + 1}. ${c.name} (Match Score: ${c.score}%) — ${c.society_role}`)
// //     .join("\n");

// //   const moderateLines = moderate.slice(0, 3)
// //     .map(c => `- ${c.name} (${c.score}%)`)
// //     .join("\n");

// //   const suppressionLines = flags.length
// //     ? flags.map(f => `- ${f.title}: ${f.insight}`).join("\n")
// //     : "No significant suppression patterns detected.";

// //   const dimLines = Object.entries(dimScores)
// //     .map(([k, v]) => `${k}: ${v}/100`)
// //     .join(", ");

// //   return `You are a world-class career counselor and psychologist writing a deeply personalized aptitude and career report for a specific individual. Write in a warm, insightful, direct tone — like a brilliant mentor who genuinely understands this person. Every sentence must feel written specifically for THIS person based on their data. Do not be generic.

// // ═══════════════════════════════
// // THEIR COMPLETE PROFILE
// // ═══════════════════════════════

// // THINKING STYLE:
// // Primary: ${prediction.thinking_style_primary}
// // Secondary: ${prediction.thinking_style_secondary || "None detected"}

// // TOP 5 DOMINANT TRAITS:
// // ${traitLines}

// // DIMENSION SCORES (out of 100):
// // ${dimLines}

// // KEY TRAIT VALUES (0–1 scale):
// // - Creativity: ${nt.n_creativity?.toFixed(2) ?? "N/A"}
// // - Analytical: ${nt.n_analytical?.toFixed(2) ?? "N/A"}
// // - Empathy: ${nt.n_empathy?.toFixed(2) ?? "N/A"}
// // - Leadership: ${nt.n_leadership?.toFixed(2) ?? "N/A"}
// // - Risk Appetite: ${nt.n_risk_appetite?.toFixed(2) ?? "N/A"}
// // - Intrinsic Motivation: ${nt.n_intrinsic_motivation?.toFixed(2) ?? "N/A"}
// // - Purpose Drive: ${nt.n_purpose_drive?.toFixed(2) ?? "N/A"}
// // - Discipline: ${nt.n_discipline?.toFixed(2) ?? "N/A"}
// // - Resilience: ${nt.n_resilience?.toFixed(2) ?? "N/A"}
// // - Depth of Focus: ${nt.n_depth_focus?.toFixed(2) ?? "N/A"}
// // - Suppression Signal: ${nt.n_suppression_signal?.toFixed(2) ?? "N/A"}
// // - Childhood Divergence: ${nt.n_childhood_divergence?.toFixed(2) ?? "N/A"}
// // - Fear Avoidance: ${nt.n_fear_avoidance?.toFixed(2) ?? "N/A"}
// // - Societal Impact Awareness: ${nt.n_societal_impact_awareness?.toFixed(2) ?? "N/A"}
// // - Innovation Drive: ${nt.n_innovation_drive?.toFixed(2) ?? "N/A"}
// // - Self Awareness: ${nt.n_self_awareness?.toFixed(2) ?? "N/A"}
// // - Initiative: ${nt.n_initiative?.toFixed(2) ?? "N/A"}

// // TOP CAREER MATCHES:
// // ${careerLines}

// // ALSO SCORED WELL IN:
// // ${moderateLines}

// // SUPPRESSION ANALYSIS:
// // Has suppression: ${suppression.has_suppression}
// // Suppression level: ${suppression.suppression_level}/10
// // ${suppressionLines}

// // ═══════════════════════════════
// // REPORT INSTRUCTIONS
// // ═══════════════════════════════

// // Write a complete, deeply personal aptitude report with EXACTLY these 5 sections.
// // Use these exact headers. Write in flowing paragraphs — NOT bullet points.
// // Each section should be 3–5 paragraphs. Be specific — reference their actual scores.

// // ## 1. Who You Are
// // Write a rich personality breakdown. Describe how this person thinks, what drives them internally, how they relate to challenge, other people, and their own ambitions. Reference their thinking style and specific dominant traits naturally in prose. Make them feel deeply understood — like you've known them for years.

// // ## 2. What's Holding You Back
// // ${suppression.has_suppression
// //   ? "This person shows suppression patterns. Write compassionately but directly about what the data reveals — external pressure, unexplored passions, fear-driven choices, or a gap between who they are and the path they're on. Reference specific suppression flags. Help them see what they may not have allowed themselves to see."
// //   : "Write about the internal friction points visible in this profile — areas of low resilience, discipline, or self-awareness that could limit them if unaddressed. Be constructive and forward-looking, not discouraging."
// // }

// // ## 3. What You Can Offer the World
// // Based on their societal impact awareness, empathy, innovation drive, and career matches — write specifically about what this person is positioned to contribute. What problems are they built to solve? What would the world look like if they fully showed up? Be inspiring and specific, not generic.

// // ## 4. Your Career Roadmap
// // For each of the top 3 career matches, write:
// // - Why this career fits THIS person specifically (reference their traits)
// // - What the day-to-day actually looks like
// // - 4–5 concrete steps to get there from where they are now
// // - A realistic timeline

// // ## 5. Your Educational Pathway
// // Based on their career roadmap, recommend specific streams, degrees, entrance exams, and institutions relevant to India. Include: which stream to choose in Class 11–12, which entrance exams to prepare for (JEE, NEET, CLAT, NID, NIFT, CAT, UPSC etc. as relevant), top college options, and a timeline from now to entering their field.

// // Close with a single powerful paragraph — a direct personal message to this individual about their potential and what's possible if they trust themselves. Make it memorable. No generic motivational quotes.`;
// // }

// // // ── GET /api/report/:firebase_uid ─────────────────────────────────────────────
// // router.get("/:firebase_uid", async (req, res) => {
// //   try {
// //     const { firebase_uid } = req.params;
// //     const { force } = req.query; // ?force=true to regenerate

// //     // 1. Get latest prediction
// //     const predRes = await pool.query(
// //       `SELECT p.*, t.n_creativity, t.n_analytical, t.n_empathy, t.n_leadership,
// //               t.n_risk_appetite, t.n_intrinsic_motivation, t.n_purpose_drive,
// //               t.n_discipline, t.n_resilience, t.n_depth_focus,
// //               t.n_suppression_signal, t.n_childhood_divergence, t.n_fear_avoidance,
// //               t.n_societal_impact_awareness, t.n_innovation_drive,
// //               t.n_self_awareness, t.n_initiative
// //        FROM predictions p
// //        LEFT JOIN trait_snapshots t ON t.session_id = p.session_id
// //        WHERE p.firebase_uid = $1
// //        ORDER BY p.created_at DESC
// //        LIMIT 1`,
// //       [firebase_uid]
// //     );

// //     if (predRes.rows.length === 0) {
// //       return res.status(404).json({
// //         error: "No test results found. Please take the assessment first."
// //       });
// //     }

// //     const prediction = predRes.rows[0];

// //     // 2. Check for cached report (skip if force=true)
// //     if (force !== "true") {
// //       const cached = await pool.query(
// //         `SELECT report_text, generated_at FROM reports WHERE prediction_id = $1`,
// //         [prediction.id]
// //       );

// //       if (cached.rows.length > 0) {
// //         console.log("📄 Returning cached report");

// //         // Increment view count
// //         await pool.query(
// //           `UPDATE reports SET viewed_count = viewed_count + 1 WHERE prediction_id = $1`,
// //           [prediction.id]
// //         );

// //         return res.json({
// //           report:                  cached.rows[0].report_text,
// //           prediction_id:           prediction.id,
// //           thinking_style_primary:  prediction.thinking_style_primary,
// //           generated_at:            cached.rows[0].generated_at,
// //           from_cache:              true,
// //         });
// //       }
// //     }

// //     // 3. Generate new report via Claude
// //     console.log("🤖 Generating report via Claude API...");

// //     const prompt = buildPrompt(prediction, prediction);

// // const completion = await groq.chat.completions.create({
// //   model: "llama-3.3-70b-versatile",
// //   messages: [{ role: "user", content: prompt }],
// //   max_tokens: 4000,
// // });
// // const reportText = completion.choices[0].message.content;
// // const tokensUsed = completion.usage?.total_tokens || 0;

// //     // 4. Cache the report in DB
// //     await pool.query(
// //       `INSERT INTO reports (prediction_id, firebase_uid, report_text, model_used, tokens_used)
// //        VALUES ($1, $2, $3, $4, $5)
// //        ON CONFLICT (prediction_id) DO UPDATE SET
// //          report_text  = EXCLUDED.report_text,
// //          generated_at = NOW(),
// //          tokens_used  = EXCLUDED.tokens_used`,
// //       [prediction.id, firebase_uid, reportText, "claude-sonnet-4-20250514", tokensUsed]
// //     );

// //     // 5. Log event
// //     await pool.query(
// //       `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
// //        VALUES ($1, 'report_generated', $2, $3)`,
// //       [firebase_uid, prediction.session_id, JSON.stringify({ tokens_used: tokensUsed })]
// //     );

// //     console.log(`✅ Report generated — ${tokensUsed} tokens used`);

// //     res.json({
// //       report:                 reportText,
// //       prediction_id:          prediction.id,
// //       thinking_style_primary: prediction.thinking_style_primary,
// //       generated_at:           new Date().toISOString(),
// //       from_cache:             false,
// //     });

// //   } catch (err) {
// //     console.error("❌ Report error:", err.message);
// //     res.status(500).json({ error: "Report generation failed", detail: err.message });
// //   }
// // });

// // // ── GET /api/report/:firebase_uid/pdf ─────────────────────────────────────────
// // router.get("/:firebase_uid/pdf", async (req, res) => {
// //   try {
// //     const { firebase_uid } = req.params;

// //     // Get the report (generate if not cached)
// //     const reportRes = await fetch(
// //       `http://localhost:5000/api/report/${firebase_uid}`
// //     );

// //     if (!reportRes.ok) {
// //       return res.status(404).json({ error: "Report not found" });
// //     }

// //     const { report, thinking_style_primary } = await reportRes.json();

// //     // Ask Python to generate the PDF
// //     const pdfRes = await fetch("http://localhost:8000/generate-pdf", {
// //       method:  "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body:    JSON.stringify({ report, thinking_style_primary, firebase_uid }),
// //     });

// //     if (!pdfRes.ok) {
// //       throw new Error("PDF generation failed");
// //     }

// //     const pdfBuffer = await pdfRes.arrayBuffer();

// //     // Log PDF download
// // await pool.query(
// //   `UPDATE reports SET downloaded_pdf = TRUE
// //    WHERE id = (
// //      SELECT id FROM reports WHERE firebase_uid = $1
// //      ORDER BY generated_at DESC LIMIT 1
// //    )`,
// //   [firebase_uid]
// // );

// //     await pool.query(
// //       `INSERT INTO app_events (firebase_uid, event_type, metadata)
// //        VALUES ($1, 'pdf_downloaded', $2)`,
// //       [firebase_uid, JSON.stringify({ thinking_style_primary })]
// //     );

// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="wdig-report.pdf"`
// //     );
// //     res.send(Buffer.from(pdfBuffer));

// //   } catch (err) {
// //     console.error("❌ PDF error:", err.message);
// //     res.status(500).json({ error: "PDF generation failed", detail: err.message });
// //   }
// // });

// // export default router;


// // backend/routes/report.js
// // GET  /api/report/:firebase_uid       → generate + return report JSON
// // GET  /api/report/:firebase_uid/pdf   → download as PDF

// import express from "express";
// import pool from "../db/index.js";
// import Groq from "groq-sdk";

// const router = express.Router();
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// // ── Prompt builder ────────────────────────────────────────────────────────────
// function buildPrompt(prediction, traits) {
//   const top       = prediction.top_careers      || [];
//   const moderate  = prediction.moderate_careers || [];
//   const dominant  = prediction.dominant_traits  || [];
//   const dimScores = prediction.dimension_scores || {};
//   const supp      = prediction.suppression      || {};
//   const flags     = supp.flags                  || [];
//   const nt        = traits                       || {};

//   const traitLines = dominant
//     .map(t => `- ${t.label}: ${t.score}%`)
//     .join("\n");

//   const topCareerLines = top.slice(0, 3)
//     .map((c, i) => `${i + 1}. ${c.name} (Match: ${c.score}%, Domain: ${c.domain || "—"}, Society Role: ${c.society_role || "—"})`)
//     .join("\n");

//   const moderateLines = moderate.slice(0, 4)
//     .map(c => `- ${c.name} (${c.score}%)`)
//     .join("\n");

//   const suppressionLines = flags.length
//     ? flags.map(f => `- ${f.title}: ${f.insight}`).join("\n")
//     : "No significant suppression patterns detected.";

//   const dimLines = Object.entries(dimScores)
//     .map(([k, v]) => `${k}: ${v}/100`)
//     .join(", ");

//   const streams = [...new Set(top.slice(0, 3).flatMap(c => c.stream ?? []))];
//   const streamLine = streams.length ? streams.join(", ") : "Not specified";

//   return `You are a thoughtful, world-class career counsellor and psychologist. You're writing a deeply personal aptitude report for a real individual based on psychometric data. Your tone is warm, direct, humble, and evidence-based. Never be preachy or generic. Speak as if you're a mentor who has studied this person carefully — but always frame your observations as insights, not verdicts. Use phrases like "your data suggests", "it seems likely", "you may find", etc. Be specific — reference their actual scores, thinking style, and career matches.

// ═══════════════════════════════
// THEIR COMPLETE PROFILE
// ═══════════════════════════════

// THINKING STYLE:
// Primary: ${prediction.thinking_style_primary}
// Secondary: ${prediction.thinking_style_secondary || "None detected"}

// TOP DOMINANT TRAITS:
// ${traitLines}

// DIMENSION SCORES (out of 100):
// ${dimLines}

// KEY TRAIT VALUES (0–1 scale):
// Creativity: ${nt.n_creativity?.toFixed(2) ?? "N/A"} | Analytical: ${nt.n_analytical?.toFixed(2) ?? "N/A"} | Empathy: ${nt.n_empathy?.toFixed(2) ?? "N/A"}
// Leadership: ${nt.n_leadership?.toFixed(2) ?? "N/A"} | Risk Appetite: ${nt.n_risk_appetite?.toFixed(2) ?? "N/A"} | Intrinsic Motivation: ${nt.n_intrinsic_motivation?.toFixed(2) ?? "N/A"}
// Purpose Drive: ${nt.n_purpose_drive?.toFixed(2) ?? "N/A"} | Discipline: ${nt.n_discipline?.toFixed(2) ?? "N/A"} | Resilience: ${nt.n_resilience?.toFixed(2) ?? "N/A"}
// Depth of Focus: ${nt.n_depth_focus?.toFixed(2) ?? "N/A"} | Societal Impact: ${nt.n_societal_impact_awareness?.toFixed(2) ?? "N/A"} | Innovation Drive: ${nt.n_innovation_drive?.toFixed(2) ?? "N/A"}
// Self-Awareness: ${nt.n_self_awareness?.toFixed(2) ?? "N/A"} | Initiative: ${nt.n_initiative?.toFixed(2) ?? "N/A"} | Suppression Signal: ${nt.n_suppression_signal?.toFixed(2) ?? "N/A"}
// Childhood Divergence: ${nt.n_childhood_divergence?.toFixed(2) ?? "N/A"} | Fear Avoidance: ${nt.n_fear_avoidance?.toFixed(2) ?? "N/A"}

// TOP CAREER MATCHES:
// ${topCareerLines}

// ALSO SCORED WELL IN:
// ${moderateLines}

// EDUCATIONAL STREAMS SUGGESTED:
// ${streamLine}

// SUPPRESSION ANALYSIS:
// Has suppression: ${supp.has_suppression || false}
// Suppression level: ${supp.suppression_level ?? 0}/10
// ${suppressionLines}

// ═══════════════════════════════
// REPORT STRUCTURE — FOLLOW EXACTLY
// ═══════════════════════════════

// Write the report with EXACTLY these 7 sections using these exact ## headers.
// Write in flowing, readable paragraphs. NO bullet points inside the prose itself.
// Each section: 2–4 focused paragraphs. Be specific. Reference actual data.

// ## Who You Are
// Describe how this person thinks, processes information, engages with challenge, and relates to others. Reference their thinking style (${prediction.thinking_style_primary}) and their top dominant traits naturally. Help them feel seen — not labelled. Frame everything as observation, not prescription.

// ## What's Holding You Back
// ${supp.has_suppression
//   ? `This person shows suppression patterns (level: ${supp.suppression_level}/10). Write with compassion and directness about what the data reveals — external pressure, unexplored interests, fear-driven choices, or a gap between their authentic self and the path they're on. Reference the specific flags detected. Help them see what they may not have let themselves acknowledge yet. Frame as gentle observation, not criticism.`
//   : `Write about the internal friction points visible in this profile — areas of lower resilience, discipline, or self-awareness that could limit them if left unexamined. Be constructive and forward-looking. Frame these as growth edges, not weaknesses.`
// }

// ## What You Offer the World
// Based on their societal impact awareness, empathy, innovation drive, purpose drive, and top career matches — write specifically about the kind of contribution this person is positioned to make. What problems are they well-suited to engage with? What does their combination of traits make uniquely possible? Keep it grounded — inspiring without being vague.

// ## Careers Suggested to You
// For each of the top 3 career matches, dedicate a paragraph to: why this career fits THIS person specifically (reference their traits), what the work actually looks like day-to-day, and what makes it a natural extension of who they are. Then briefly mention the moderate fits and what they have in common with this person's profile.

// ## Career Roadmap
// For each top career, provide 4–5 concrete, actionable steps to get from where they are now to working in that field. Include realistic timelines. Write as a roadmap narrative — not a list — describing the journey. Cover skill-building, exposure, and entry points. Reference the educational streams where relevant (${streamLine}).

// ## Educational Pathway
// Based on the career roadmap: recommend specific streams, degrees, entrance exams, and institution types relevant to India. Cover:
// - Which stream to choose in Class 11–12 and why it fits this person
// - Which entrance exams to prepare for (JEE, NEET, CLAT, NID, NIFT, CAT, UPSC, etc. — only what's relevant)
// - Types of colleges and degree programs to target
// - A broad timeline from now through entering their field
// - Any alternative or emerging pathways worth considering

// Write this as a flowing educational narrative, not a checklist.

// ## Skillset to Build
// Based on the career matches and the trait gaps visible in this profile, write about 4–6 specific skills this person would benefit from developing. For each skill, explain why it matters for their particular path and how they can start building it. Be honest about where their profile shows lower scores — but frame it as opportunity. End with a short encouraging note about their existing strengths.

// ## Conclusion
// Write a single, memorable closing section — a direct, personal message to this individual about what their data suggests is possible. Reference their thinking style and one or two of their strongest traits. Make it feel like the last thing a great mentor says before the student walks out the door. Honest, warm, specific, and forward-looking. No generic motivational clichés.`;
// }

// // ── GET /api/report/:firebase_uid ─────────────────────────────────────────────
// router.get("/:firebase_uid", async (req, res) => {
//   try {
//     const { firebase_uid } = req.params;
//     const { force } = req.query;

//     // 1. Get latest prediction + traits
//     const predRes = await pool.query(
//       `SELECT p.*,
//               t.n_creativity, t.n_analytical, t.n_empathy, t.n_leadership,
//               t.n_risk_appetite, t.n_intrinsic_motivation, t.n_purpose_drive,
//               t.n_discipline, t.n_resilience, t.n_depth_focus,
//               t.n_suppression_signal, t.n_childhood_divergence, t.n_fear_avoidance,
//               t.n_societal_impact_awareness, t.n_innovation_drive,
//               t.n_self_awareness, t.n_initiative
//        FROM predictions p
//        LEFT JOIN trait_snapshots t ON t.session_id = p.session_id
//        WHERE p.firebase_uid = $1
//        ORDER BY p.created_at DESC
//        LIMIT 1`,
//       [firebase_uid]
//     );

//     if (predRes.rows.length === 0) {
//       return res.status(404).json({ error: "No test results found. Please take the assessment first." });
//     }

//     const prediction = predRes.rows[0];

//     // 2. Return cached report if available
//     if (force !== "true") {
//       const cached = await pool.query(
//         `SELECT report_text, generated_at FROM reports WHERE prediction_id = $1`,
//         [prediction.id]
//       );
//       if (cached.rows.length > 0) {
//         console.log("📄 Returning cached report");
//         await pool.query(
//           `UPDATE reports SET viewed_count = viewed_count + 1 WHERE prediction_id = $1`,
//           [prediction.id]
//         );
//         return res.json({
//           report:                  cached.rows[0].report_text,
//           prediction_id:           prediction.id,
//           thinking_style_primary:  prediction.thinking_style_primary,
//           thinking_style_secondary: prediction.thinking_style_secondary,
//           top_careers:             prediction.top_careers,
//           moderate_careers:        prediction.moderate_careers,
//           dominant_traits:         prediction.dominant_traits,
//           dimension_scores:        prediction.dimension_scores,
//           suppression:             prediction.suppression,
//           generated_at:            cached.rows[0].generated_at,
//           from_cache:              true,
//         });
//       }
//     }

//     // 3. Generate report
//     console.log("🤖 Generating report via Groq/LLaMA...");
//     const prompt = buildPrompt(prediction, prediction);

//     const completion = await groq.chat.completions.create({
//       model: "llama-3.3-70b-versatile",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 5000,
//     });

//     const reportText = completion.choices[0].message.content;
//     const tokensUsed = completion.usage?.total_tokens || 0;

//     // 4. Cache
//     await pool.query(
//       `INSERT INTO reports (prediction_id, firebase_uid, report_text, model_used, tokens_used)
//        VALUES ($1, $2, $3, $4, $5)
//        ON CONFLICT (prediction_id) DO UPDATE SET
//          report_text  = EXCLUDED.report_text,
//          generated_at = NOW(),
//          tokens_used  = EXCLUDED.tokens_used`,
//       [prediction.id, firebase_uid, reportText, "llama-3.3-70b-versatile", tokensUsed]
//     );

//     // 5. Log
//     await pool.query(
//       `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
//        VALUES ($1, 'report_generated', $2, $3)`,
//       [firebase_uid, prediction.session_id, JSON.stringify({ tokens_used: tokensUsed })]
//     );

//     console.log(`✅ Report generated — ${tokensUsed} tokens`);

//     res.json({
//       report:                  reportText,
//       prediction_id:           prediction.id,
//       thinking_style_primary:  prediction.thinking_style_primary,
//       thinking_style_secondary: prediction.thinking_style_secondary,
//       top_careers:             prediction.top_careers,
//       moderate_careers:        prediction.moderate_careers,
//       dominant_traits:         prediction.dominant_traits,
//       dimension_scores:        prediction.dimension_scores,
//       suppression:             prediction.suppression,
//       generated_at:            new Date().toISOString(),
//       from_cache:              false,
//     });

//   } catch (err) {
//     console.error("❌ Report error:", err.message);
//     res.status(500).json({ error: "Report generation failed", detail: err.message });
//   }
// });

// // ── GET /api/report/:firebase_uid/pdf ─────────────────────────────────────────
// router.get("/:firebase_uid/pdf", async (req, res) => {
//   try {
//     const { firebase_uid } = req.params;

//     const reportRes = await fetch(`http://localhost:5000/api/report/${firebase_uid}`);
//     if (!reportRes.ok) return res.status(404).json({ error: "Report not found" });

//     const reportData = await reportRes.json();

//     const pdfRes = await fetch("http://localhost:8000/generate-pdf", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(reportData),
//     });

//     if (!pdfRes.ok) throw new Error("PDF generation failed");

//     const pdfBuffer = await pdfRes.arrayBuffer();

//     await pool.query(
//       `UPDATE reports SET downloaded_pdf = TRUE
//        WHERE id = (SELECT id FROM reports WHERE firebase_uid = $1 ORDER BY generated_at DESC LIMIT 1)`,
//       [firebase_uid]
//     );

//     await pool.query(
//       `INSERT INTO app_events (firebase_uid, event_type, metadata) VALUES ($1, 'pdf_downloaded', $2)`,
//       [firebase_uid, JSON.stringify({ thinking_style_primary: reportData.thinking_style_primary })]
//     );

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename="wdig-report.pdf"`);
//     res.send(Buffer.from(pdfBuffer));

//   } catch (err) {
//     console.error("❌ PDF error:", err.message);
//     res.status(500).json({ error: "PDF generation failed", detail: err.message });
//   }
// });

// export default router;

// backend/routes/report.js
// GET  /api/report/:firebase_uid        → generate + return report + full prediction data
// GET  /api/report/:firebase_uid/pdf    → download as PDF

import express from "express";
import pool from "../db/index.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Build prompt from DB row ──────────────────────────────────────────────────
function buildPrompt(prediction, traits) {
  const top       = prediction.top_careers      || [];
  const moderate  = prediction.moderate_careers || [];
  const dominant  = prediction.dominant_traits  || [];
  const dimScores = prediction.dimension_scores || {};
  const supp      = prediction.suppression      || {};
  const flags     = supp.flags                  || [];
  const nt        = traits || {};

  const traitLines = dominant
    .map(t => `- ${t.label ?? t.trait}: ${t.score}%`)
    .join("\n");

  const careerLines = top.slice(0, 3)
    .map((c, i) => `${i + 1}. ${c.name} (Match: ${c.score}%) — ${c.society_role ?? ""}`)
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

  return `You are a world-class career counselor and psychologist writing a deeply personalized aptitude report for a specific individual. Write in a warm, insightful, direct tone — like a brilliant mentor. Frame everything as observations and suggestions, never verdicts. Every sentence must feel written for THIS person specifically based on their data.

═══════════════════════════════
THEIR COMPLETE PROFILE
═══════════════════════════════

THINKING STYLE:
Primary: ${prediction.thinking_style_primary}
Secondary: ${prediction.thinking_style_secondary || "None detected"}

TOP DOMINANT TRAITS:
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
Has suppression: ${supp.has_suppression}
Suppression level: ${supp.suppression_level ?? 0}/10
${suppressionLines}

═══════════════════════════════
REPORT INSTRUCTIONS
═══════════════════════════════

Write a complete, deeply personal report with EXACTLY these 7 sections.
Use EXACTLY these headers (copy them verbatim including the ## and number).
Write in flowing paragraphs — NOT bullet points. 3–4 paragraphs per section.
Be specific — reference their actual scores and traits. Tone: warm mentor, not verdict-giver.
Frame as "it seems like…", "you appear to…", "this suggests…" — observations, not facts.

## 1. Who You Are
Describe how this person thinks, what drives them, how they relate to challenge, people, and ambitions. Reference their thinking style and dominant traits naturally in prose.

## 2. What's Holding You Back
${supp.has_suppression
  ? "This person shows suppression patterns. Write compassionately but directly about what the data suggests — external pressure, unexplored passions, fear-driven choices. Reference specific suppression flags. Help them see what they may not have allowed themselves to see."
  : "Write about the internal friction points in this profile — areas where lower scores in resilience, discipline, or self-awareness could limit them if unaddressed. Be constructive and forward-looking."
}

## 3. What You Offer the World
Based on their societal impact awareness, empathy, innovation drive, and career matches — write specifically about what this person seems positioned to contribute. What problems appear built for them to solve? Be inspiring and specific.

## 4. Careers Suggested to You
For each of the top 3 career matches, write 1–2 paragraphs explaining why it fits this person specifically (reference their traits), what the day-to-day actually looks like, and why it seems like a natural extension of who they are.

## 5. Career Roadmap
For each top career, give 4–5 concrete numbered steps to get there. Include realistic timelines. Format as: "1. [Step] (Timeline)" — one step per line. Cover what to do in Year 1, Year 2–3, and Year 4+.

## 6. Educational Pathway
Recommend specific streams for Class 11–12, relevant entrance exams for India (JEE, NEET, CLAT, NID, NIFT, CAT, UPSC etc. as relevant), top college options, and a timeline from now to entering their field. Format as numbered steps like the roadmap.

## 7. Skillset to Build
List 6–8 specific skills this person should develop to pursue their top careers. For each skill, write one sentence explaining why it matters for their specific profile. Format as: "Skill Name — why it matters for you."

## 8. Conclusion
Write a single powerful closing section — 2 paragraphs maximum. A direct personal message to this individual about their potential and what's possible if they trust themselves. Warm, memorable, specific to their data. No generic motivational quotes.`;
}

// ── Parse dominant_traits regardless of shape ─────────────────────────────────
// DB may store { trait, score } or { label, score } — normalise to { label, score }
function normaliseDominantTraits(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map(t => ({
    label: t.label ?? t.trait ?? "Unknown",
    score: t.score ?? 0,
  }));
}

// ── GET /api/report/:firebase_uid ─────────────────────────────────────────────
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const { force } = req.query;

    // 1. Get latest prediction + trait snapshot
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
        error: "No test results found. Please take the assessment first.",
      });
    }

    const prediction = predRes.rows[0];

    // Normalise dominant_traits shape once
    prediction.dominant_traits = normaliseDominantTraits(prediction.dominant_traits);

    // 2. Check cache
    if (force !== "true") {
      const cached = await pool.query(
        `SELECT report_text, generated_at FROM reports WHERE prediction_id = $1`,
        [prediction.id]
      );

      if (cached.rows.length > 0) {
        console.log("📄 Returning cached report");
        await pool.query(
          `UPDATE reports SET viewed_count = viewed_count + 1 WHERE prediction_id = $1`,
          [prediction.id]
        );

        // ✅ FIX: return full prediction data alongside report text
        return res.json(buildResponsePayload(cached.rows[0].report_text, prediction, true));
      }
    }

    // 3. Generate via Groq
    console.log("🤖 Generating report via Groq...");
    const prompt = buildPrompt(prediction, prediction);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
    });

    const reportText = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // 4. Cache
    await pool.query(
      `INSERT INTO reports (prediction_id, firebase_uid, report_text, model_used, tokens_used)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (prediction_id) DO UPDATE SET
         report_text  = EXCLUDED.report_text,
         generated_at = NOW(),
         tokens_used  = EXCLUDED.tokens_used`,
      [prediction.id, firebase_uid, reportText, "llama-3.3-70b-versatile", tokensUsed]
    );

    // 5. Log
    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
       VALUES ($1, 'report_generated', $2, $3)`,
      [firebase_uid, prediction.session_id, JSON.stringify({ tokens_used: tokensUsed })]
    );

    console.log(`✅ Report generated — ${tokensUsed} tokens`);

    // ✅ FIX: return full prediction data
    return res.json(buildResponsePayload(reportText, prediction, false));

  } catch (err) {
    console.error("❌ Report error:", err.message);
    res.status(500).json({ error: "Report generation failed", detail: err.message });
  }
});

// ── Build the full response payload ──────────────────────────────────────────
// This is the FIX: previously the route only returned { report, prediction_id,
// thinking_style_primary } — the report page had no careers/traits/dimensions/suppression
// so skills cards, dimension profile, and career cards were all blank.
function buildResponsePayload(reportText, prediction, fromCache) {
  return {
    // Report text
    report:                    reportText,
    from_cache:                fromCache,
    generated_at:              new Date().toISOString(),

    // Identity
    prediction_id:             prediction.id,
    thinking_style_primary:    prediction.thinking_style_primary,
    thinking_style_secondary:  prediction.thinking_style_secondary ?? null,

    // ✅ Career data (was missing — caused blank career cards on report page)
    top_careers:               prediction.top_careers    ?? [],
    moderate_careers:          prediction.moderate_careers ?? [],

    // ✅ Trait data (was missing — caused blank skills + dominant trait sections)
    dominant_traits:           prediction.dominant_traits ?? [],

    // ✅ Dimension scores (was missing — caused blank dimension profile)
    dimension_scores:          prediction.dimension_scores ?? {},

    // ✅ Suppression (was missing — caused blank "holding you back" section)
    suppression:               prediction.suppression ?? {},

    // ✅ Raw normalised traits for skills inference on the frontend
    normalised_traits: {
      creativity:               prediction.n_creativity               ?? null,
      analytical:               prediction.n_analytical               ?? null,
      empathy:                  prediction.n_empathy                  ?? null,
      leadership:               prediction.n_leadership               ?? null,
      risk_appetite:            prediction.n_risk_appetite            ?? null,
      intrinsic_motivation:     prediction.n_intrinsic_motivation     ?? null,
      purpose_drive:            prediction.n_purpose_drive            ?? null,
      discipline:               prediction.n_discipline               ?? null,
      resilience:               prediction.n_resilience               ?? null,
      depth_focus:              prediction.n_depth_focus              ?? null,
      suppression_signal:       prediction.n_suppression_signal       ?? null,
      childhood_divergence:     prediction.n_childhood_divergence     ?? null,
      fear_avoidance:           prediction.n_fear_avoidance           ?? null,
      societal_impact_awareness:prediction.n_societal_impact_awareness?? null,
      innovation_drive:         prediction.n_innovation_drive         ?? null,
      self_awareness:           prediction.n_self_awareness           ?? null,
      initiative:               prediction.n_initiative               ?? null,
    },
  };
}

// ── GET /api/report/:firebase_uid/pdf ─────────────────────────────────────────
router.get("/:firebase_uid/pdf", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    // Re-use the same report endpoint to get full payload
    const reportRes = await fetch(
      `http://localhost:5000/api/report/${firebase_uid}`
    );

    if (!reportRes.ok) {
      return res.status(404).json({ error: "Report not found" });
    }

    const payload = await reportRes.json();

    // Forward full payload to Python PDF generator
    const pdfRes = await fetch("http://localhost:8000/generate-pdf", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),   // ✅ full payload, not just report text
    });

    if (!pdfRes.ok) {
      const errText = await pdfRes.text();
      throw new Error(`PDF generation failed: ${errText}`);
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    // Log download
    await pool.query(
      `UPDATE reports SET downloaded_pdf = TRUE
       WHERE id = (
         SELECT id FROM reports WHERE firebase_uid = $1
         ORDER BY generated_at DESC LIMIT 1
       )`,
      [firebase_uid]
    );

    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, metadata)
       VALUES ($1, 'pdf_downloaded', $2)`,
      [firebase_uid, JSON.stringify({ thinking_style_primary: payload.thinking_style_primary })]
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="wdig-report.pdf"`);
    res.send(Buffer.from(pdfBuffer));

  } catch (err) {
    console.error("❌ PDF error:", err.message);
    res.status(500).json({ error: "PDF generation failed", detail: err.message });
  }
});

export default router;