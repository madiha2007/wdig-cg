import express from "express";
import pool from "../db/index.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Profile context builder ───────────────────────────────────────────────────
// Converts raw DB profile row into rich human-readable text for the AI prompt
function buildProfileContext(profile) {
  if (!profile) return "";

  const STAGE = {
    school_9_10:    "School student (Class 9–10)",
    school_11_12:   "School student (Class 11–12)",
    ug:             "Undergraduate student",
    pg:             "Postgraduate student",
    professional:   "Working professional",
    career_changer: "Career changer / Gap year",
  };
  const FINANCE = {
    need_income_soon: "Needs stable income as soon as possible",
    some_runway:      "Has some time before needing income",
    full_support:     "Has full family support — timeline is flexible",
  };
  const PRESSURE = {
    high:     "Very high — a specific career is expected by family",
    moderate: "Moderate — family has preferences but they have some say",
    free:     "Full freedom — completely their own choice",
  };
  const HORIZON = {
    "1_2_years": "Wants to start earning within 1–2 years",
    "3_5_years": "Okay with 3–5 year investment",
    "6_8_years": "Willing to invest 6–8 years for the right path",
  };
  const SUCCESS = {
    financial_freedom:   "Financial freedom and wealth",
    real_impact:         "Making a real impact on society",
    being_best:          "Being the best at what they do",
    balance:             "Work-life balance and inner peace",
    solving_problems:    "Solving hard problems and discovering things",
    creative_expression: "Creative expression and recognition",
  };
  const VISION = {
    own_business:   "Running their own business",
    top_company:    "Leading a team in a top company",
    research:       "Doing deep research or academia",
    freelance:      "Working independently / freelancing",
    public_service: "Serving the public (government, NGO, healthcare)",
    figuring_out:   "Still figuring it out",
  };

  const skills      = (profile.skills               || []).map(s => s.replace(/_/g, " ")).join(", ") || "None listed";
  const freeTime    = (profile.free_time_activities  || []).map(s => s.replace(/_/g, " ")).join(", ") || "None listed";
  const achievements= (profile.past_achievements    || []).map(s => s.replace(/_/g, " ")).join(", ") || "None listed";

  return `
╔══════════════════════════════════════════════════════════════╗
  PERSONAL PROFILE — use this to personalise EVERY section
╚══════════════════════════════════════════════════════════════╝

Life Stage    : ${STAGE[profile.current_stage]         || profile.current_stage    || "Not specified"}
Field/Stream  : ${profile.field?.replace(/_/g, " ")    || "Not specified"}
Finances      : ${FINANCE[profile.financial_situation]  || profile.financial_situation || "Not specified"}
Family Pressure: ${PRESSURE[profile.family_pressure]   || profile.family_pressure  || "Not specified"}
Time Horizon  : ${HORIZON[profile.time_horizon]         || profile.time_horizon     || "Not specified"}

Self-Reported Skills   : ${skills}
Free Time Activities   : ${freeTime}
Past Achievements      : ${achievements}

What success means     : ${SUCCESS[profile.success_definition] || profile.success_definition || "Not specified"}
10-Year vision         : ${VISION[profile.ten_year_vision]     || profile.ten_year_vision     || "Not specified"}

Secret dream  : "${profile.secret_dream    || "Not shared"}"
Biggest blocker: "${profile.biggest_blocker || "Not shared"}"

══════════════════════════════════════════════════════════════
INSTRUCTIONS FOR USING THIS PROFILE:
1. Reference their life stage when recommending timelines.
2. Use their financial situation to prioritise faster vs longer paths.
3. If family pressure is high, acknowledge it directly — don't ignore it.
4. Their secret dream and biggest blocker must appear in the report,
   especially in "What's Holding You Back" and the Personal Note.
5. Their self-reported skills validate or contrast with aptitude scores —
   mention any interesting matches or surprises.
6. Weight career recommendations toward their 10-year vision.
══════════════════════════════════════════════════════════════
`;
}

// ── Main prompt builder ───────────────────────────────────────────────────────
function buildPrompt(prediction, traits, profile) {
  const top       = prediction.top_careers      || [];
  const moderate  = prediction.moderate_careers || [];
  const dominant  = prediction.dominant_traits  || [];
  const dimScores = prediction.dimension_scores || {};
  const supp      = prediction.suppression      || {};
  const flags     = supp.flags                  || [];
  const nt        = traits                       || {};

  const traitLines = dominant
    .map(t => `- ${t.label}: ${t.score}%`)
    .join("\n");

  const topCareerLines = top.slice(0, 3)
    .map((c, i) => `${i + 1}. ${c.name} (Match: ${c.score}%, Domain: ${c.domain || "—"}, Society Role: ${c.society_role || "—"})`)
    .join("\n");

  const moderateLines = moderate.slice(0, 4)
    .map(c => `- ${c.name} (${c.score}%)`)
    .join("\n");

  const suppressionLines = flags.length
    ? flags.map(f => `- ${f.title}: ${f.insight}`).join("\n")
    : "No significant suppression patterns detected.";

  const dimLines = Object.entries(dimScores)
    .map(([k, v]) => `${k}: ${v}/100`)
    .join(", ");

  const streams = [...new Set(top.slice(0, 3).flatMap(c => c.stream ?? []))];
  const streamLine = streams.length ? streams.join(", ") : "Not specified";

  // Build the profile section — empty string if no profile
  const profileSection = buildProfileContext(profile);

  return `You are a world-class career counsellor and psychologist writing a deeply personal aptitude report. Your tone is warm, direct, and evidence-based. Never be generic. Speak like a mentor who has studied this person carefully. Use phrases like "your data suggests", "it seems likely", "you may find". Reference actual scores and career matches throughout.

${profileSection}

═══════════════════════════════
APTITUDE TEST RESULTS
═══════════════════════════════

THINKING STYLE:
Primary: ${prediction.thinking_style_primary}
Secondary: ${prediction.thinking_style_secondary || "None detected"}

TOP DOMINANT TRAITS:
${traitLines}

DIMENSION SCORES (out of 100):
${dimLines}

KEY TRAIT VALUES (0–1 scale):
Creativity: ${nt.n_creativity?.toFixed(2) ?? "N/A"} | Analytical: ${nt.n_analytical?.toFixed(2) ?? "N/A"} | Empathy: ${nt.n_empathy?.toFixed(2) ?? "N/A"}
Leadership: ${nt.n_leadership?.toFixed(2) ?? "N/A"} | Risk Appetite: ${nt.n_risk_appetite?.toFixed(2) ?? "N/A"} | Intrinsic Motivation: ${nt.n_intrinsic_motivation?.toFixed(2) ?? "N/A"}
Purpose Drive: ${nt.n_purpose_drive?.toFixed(2) ?? "N/A"} | Discipline: ${nt.n_discipline?.toFixed(2) ?? "N/A"} | Resilience: ${nt.n_resilience?.toFixed(2) ?? "N/A"}
Depth of Focus: ${nt.n_depth_focus?.toFixed(2) ?? "N/A"} | Societal Impact: ${nt.n_societal_impact_awareness?.toFixed(2) ?? "N/A"} | Innovation Drive: ${nt.n_innovation_drive?.toFixed(2) ?? "N/A"}
Self-Awareness: ${nt.n_self_awareness?.toFixed(2) ?? "N/A"} | Initiative: ${nt.n_initiative?.toFixed(2) ?? "N/A"} | Suppression Signal: ${nt.n_suppression_signal?.toFixed(2) ?? "N/A"}
Childhood Divergence: ${nt.n_childhood_divergence?.toFixed(2) ?? "N/A"} | Fear Avoidance: ${nt.n_fear_avoidance?.toFixed(2) ?? "N/A"}

TOP CAREER MATCHES (from aptitude test):
${topCareerLines}

ALSO SCORED WELL IN:
${moderateLines}

EDUCATIONAL STREAMS SUGGESTED:
${streamLine}

SUPPRESSION ANALYSIS:
Has suppression: ${supp.has_suppression || false}
Suppression level: ${supp.suppression_level ?? 0}/10
${suppressionLines}

═══════════════════════════════════════════════════
REPORT STRUCTURE — YOU MUST WRITE ALL 8 SECTIONS
═══════════════════════════════════════════════════

CRITICAL RULES:
- Use EXACTLY these ## headers, spelled exactly as written
- Write in flowing paragraphs — NO bullet points inside prose
- Sections 1–7: 2–4 paragraphs each
- Section 8 (Personal Note): EXACTLY 2–3 sentences — no more, no less
- DO NOT skip any section. All 8 must appear in order.
- Be specific — reference actual scores, traits, and profile data

## Who You Are
Describe how this person thinks, processes information, and engages with challenge.
Reference their thinking style (${prediction.thinking_style_primary}) and top traits naturally.
${profile ? `They are ${profile.current_stage || "a student"} in ${profile.field || "their field"} — ground the description in their real situation, not generic observations.` : ""}
Help them feel seen — not labelled. Frame everything as observation, not prescription.

## What's Holding You Back
${supp.has_suppression
  ? `This person shows suppression patterns (level: ${supp.suppression_level}/10). Write with compassion about what the data reveals.`
  : `Write about internal friction points — areas of lower resilience or self-awareness that could limit them.`
}
${profile?.biggest_blocker ? `IMPORTANT: They said their biggest blocker is "${profile.biggest_blocker}" — address this directly and honestly, not generically.` : ""}
${profile?.family_pressure === "high" ? `They face significant family pressure about career — acknowledge this tension and give them a realistic way to think about navigating it.` : ""}

## What You Offer the World
Based on societal impact awareness (${nt.n_societal_impact_awareness?.toFixed(2) ?? "N/A"}), empathy (${nt.n_empathy?.toFixed(2) ?? "N/A"}), innovation drive, and top careers — write specifically about the contribution this person is positioned to make.
${profile?.success_definition ? `They defined success as "${profile.success_definition}" — weave this into the section.` : ""}

## Careers Suggested to You
For each top 3 career: why it fits THIS specific person (cite traits + ${profile?.skills?.length ? `their self-reported skills: ${profile.skills.join(", ")}` : "aptitude scores"}), what the work looks like day-to-day, why it's a natural extension of who they are.
Then briefly mention the moderate fits and what they have in common with this person's profile.

## Career Roadmap
For each top career: 4–5 concrete steps from where they are NOW to working in that field.
${profile ? `They are a ${profile.current_stage || "student"}, financial situation: ${profile.financial_situation || "unspecified"}, time horizon: ${profile.time_horizon || "unspecified"}. Make timelines match this reality — don't give a 8-year roadmap to someone who needs income in 1–2 years.` : ""}
Write as narrative — cover skill-building, exposure, and entry points. Reference streams: ${streamLine}.

## Educational Pathway
Specific streams, degrees, entrance exams, institution types for India.
${profile?.current_stage?.includes("school") ? `They are in school — be specific about which stream for Class 11–12 and exactly why.` : ""}
Only mention relevant exams (JEE/NEET/CLAT/NID/NIFT/CAT/UPSC etc.). Write as narrative, not checklist.

## Skillset to Build
4–6 specific skills to develop based on career matches and trait gaps.
${profile?.skills?.length ? `They already have: ${profile.skills.join(", ")} — build on these, don't repeat them.` : ""}
For each skill: why it matters for their specific path and exactly how to start building it.
End with a short note on their existing strengths.

## Conclusion
One memorable closing section — a direct, personal message about what their data suggests is possible.
Reference thinking style and 1–2 strongest traits. Make it feel like the last thing a great mentor says before the student walks out the door. Honest, warm, specific. No generic motivational clichés.

## Personal Note
THIS SECTION IS MANDATORY. Write EXACTLY 2–3 sentences. Not 1. Not 4. Exactly 2 or 3.
Speak directly to this person as "you". This is the most intimate part of the report.
${profile?.secret_dream && profile.secret_dream.trim().length > 3
  ? `You MUST reference their secret dream ("${profile.secret_dream}") and their biggest blocker ("${profile.biggest_blocker || "unstated"}"). Connect it to a specific trait from their aptitude data that makes this dream more achievable than they think.`
  : `Reference their thinking style (${prediction.thinking_style_primary}) and one specific score that reveals something they may not know about themselves.`
}
Format: Write the sentences directly — no heading repetition, no preamble, just the 2–3 sentences.
Tone: A mentor who has read every word. Warm but unflinching. Specific. Zero clichés.`;
}

// ── GET /api/report/:firebase_uid ─────────────────────────────────────────────
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const { force } = req.query;

    // 1. Get latest prediction + traits
    const predRes = await pool.query(
      `SELECT p.*,
              t.n_creativity, t.n_analytical, t.n_empathy, t.n_leadership,
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
      return res.status(404).json({ error: "No test results found. Please take the assessment first." });
    }

    const prediction = predRes.rows[0];

    // 2. ── Fetch user profile ─────────────────────────────────────────────────
    let userProfile = null;
    try {
      const profileRes = await pool.query(
        "SELECT * FROM user_profiles WHERE user_id = $1",
        [firebase_uid]
      );
      userProfile = profileRes.rows[0] || null;
      if (userProfile) {
        console.log(`📋 Profile found for ${firebase_uid} — personalising report`);
      } else {
        console.log(`⚠️  No profile for ${firebase_uid} — generating generic report`);
      }
    } catch (profileErr) {
      console.warn("Could not fetch profile:", profileErr.message);
    }

    // 3. Return cached report if available (skip cache if force=true)
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
        return res.json({
          report:                   cached.rows[0].report_text,
          prediction_id:            prediction.id,
          thinking_style_primary:   prediction.thinking_style_primary,
          thinking_style_secondary: prediction.thinking_style_secondary,
          top_careers:              prediction.top_careers,
          moderate_careers:         prediction.moderate_careers,
          dominant_traits:          prediction.dominant_traits,
          dimension_scores:         prediction.dimension_scores,
          suppression:              prediction.suppression,
          generated_at:             cached.rows[0].generated_at,
          from_cache:               true,
          has_profile:              !!userProfile,
        });
      }
    }

    // 4. Generate report with full profile context
    console.log("🤖 Generating report via Groq/LLaMA...");
    const prompt = buildPrompt(prediction, prediction, userProfile);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 6500, // increased — 8 sections need room, Personal Note must not be cut
    });

    const reportText = completion.choices[0].message.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    // 5. Cache
    await pool.query(
      `INSERT INTO reports (prediction_id, firebase_uid, report_text, model_used, tokens_used)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (prediction_id) DO UPDATE SET
         report_text  = EXCLUDED.report_text,
         generated_at = NOW(),
         tokens_used  = EXCLUDED.tokens_used`,
      [prediction.id, firebase_uid, reportText, "llama-3.3-70b-versatile", tokensUsed]
    );

    // 6. Log
    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
       VALUES ($1, 'report_generated', $2, $3)`,
      [firebase_uid, prediction.session_id, JSON.stringify({
        tokens_used: tokensUsed,
        has_profile: !!userProfile,
        profile_completeness: userProfile ? Object.values(userProfile).filter(Boolean).length : 0,
      })]
    );

    console.log(`✅ Report generated — ${tokensUsed} tokens | profile: ${!!userProfile}`);

    res.json({
      report:                   reportText,
      prediction_id:            prediction.id,
      thinking_style_primary:   prediction.thinking_style_primary,
      thinking_style_secondary: prediction.thinking_style_secondary,
      top_careers:              prediction.top_careers,
      moderate_careers:         prediction.moderate_careers,
      dominant_traits:          prediction.dominant_traits,
      dimension_scores:         prediction.dimension_scores,
      suppression:              prediction.suppression,
      generated_at:             new Date().toISOString(),
      from_cache:               false,
      has_profile:              !!userProfile,
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

    const reportRes = await fetch(`http://localhost:5000/api/report/${firebase_uid}`);
    if (!reportRes.ok) {
      return res.status(404).json({ error: "Report not found" });
    }
    const reportData = await reportRes.json();

    const pdfRes = await fetch("http://127.0.0.1:5000/api/pdf/generate", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...reportData, firebase_uid }),
    });

    if (!pdfRes.ok) {
      const errText = await pdfRes.text();
      throw new Error(`PDF generation failed: ${errText}`);
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

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
      [firebase_uid, JSON.stringify({ thinking_style_primary: reportData.thinking_style_primary })]
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