// backend/routes/skillsGap.js
import express from "express";
import pool from "../db/index.js";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY1 });

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: build the AI prompt
───────────────────────────────────────────────────────────────────────────── */
function buildSkillsGapPrompt({
  thinkingStylePrimary,
  thinkingStyleSecondary,
  topCareers,
  moderateCareers,
  normalizedTraits,
  dominantTraits,
  existingSkills,
  hobbies,
  ageGroup,
}) {
  const parseList = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === "string") return v.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    return [];
  };

  const skillsList    = parseList(existingSkills);
  const hobbiesList   = parseList(hobbies);
  const topNames      = (topCareers     ?? []).map(c => (typeof c === "object" ? c.name : c)).filter(Boolean);
  const moderateNames = (moderateCareers ?? []).map(c => (typeof c === "object" ? c.name : c)).filter(Boolean);
  const allCareers    = [...new Set([...topNames, ...moderateNames])].slice(0, 8);

  const traitSummary = normalizedTraits
    ? Object.entries(normalizedTraits)
        .filter(([, v]) => v > 0.05)
        .sort(([, a], [, b]) => b - a)
        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${Math.round(v * 100)}%`)
        .slice(0, 20)
        .join(", ")
    : "not available";

  const dominantSummary = (dominantTraits ?? [])
    .slice(0, 6)
    .map(t => `${(t.trait || t.label || "").replace(/_/g, " ")} (${t.score}%)`)
    .join(", ");

  const weakTraits = normalizedTraits
    ? Object.entries(normalizedTraits)
        .filter(([, v]) => v < 0.4)
        .sort(([, a], [, b]) => a - b)
        .map(([k]) => k.replace(/_/g, " "))
        .slice(0, 6)
        .join(", ")
    : "none identified";

  return `You are a senior career strategist who has helped thousands of students identify exactly which skills they need to build for their chosen careers. You are precise, honest, and specific — never generic.

A student has completed a deep psychometric and aptitude assessment. Your job is to produce a surgical skills gap analysis: what specific skills they must build, why each one matters for THEIR specific careers, and what they already have working in their favour.

## STUDENT PROFILE

**Thinking Style (Primary):** ${thinkingStylePrimary ?? "Not identified"}
**Thinking Style (Secondary):** ${thinkingStyleSecondary ?? "None"}
**Age Group:** ${ageGroup ?? "Student"}

**Target Careers (priority order):**
${allCareers.length > 0 ? allCareers.map((c, i) => `${i + 1}. ${c}`).join("\n") : "Not yet identified"}

**Dominant Strengths (from assessment):**
${dominantSummary || "None recorded"}

**Full Trait Scores (higher = stronger):**
${traitSummary}

**Traits scoring below 40% (potential gaps):**
${weakTraits}

**Self-reported Skills:**
${skillsList.length > 0 ? skillsList.map(s => `- ${s}`).join("\n") : "None recorded"}

**Hobbies & Interests:**
${hobbiesList.length > 0 ? hobbiesList.map(h => `- ${h}`).join("\n") : "None recorded"}

---

## INSTRUCTIONS

Think step by step:

STEP 1 — For each of the top 3 careers, list the 3–4 most critical non-negotiable skills a candidate MUST have to get hired and excel. Be role-specific (e.g. for Doctor: "Clinical Reasoning & Differential Diagnosis", not just "critical thinking").

STEP 2 — Cross-reference with the student's existing skills, hobbies, and traits. Mark which required skills they already partially or fully have. Identify transferable skills from hobbies (e.g. photography → visual storytelling, teaching → communication & simplification).

STEP 3 — The gap = required skills minus what they already have. Prioritise this list by: (a) highest leverage for their #1 career, (b) most underdeveloped given their weak traits.

STEP 4 — For each skill to acquire, write one precise sentence explaining exactly HOW it will help them succeed in their specific career path — not a generic benefit, but a career-specific connection. Name the career explicitly.

STEP 5 — Identify 2–3 hidden assets: strengths from their hobbies or trait profile that most students in their position don't realise are valuable.

## OUTPUT FORMAT

Respond ONLY with a valid JSON object. No markdown, no explanation, no preamble, no trailing text.

{
  "skills_to_acquire": [
    {
      "skill": "Exact Skill Name",
      "career_relevance": "One precise sentence: how this skill directly helps them in [specific career name] — mention the career by name."
    }
  ],
  "already_have": [
    {
      "skill": "Skill Name",
      "source": "self-reported / from hobby: [hobby name] / from trait: [trait name]",
      "note": "One sentence on how this existing skill gives them an edge."
    }
  ],
  "hidden_assets": [
    {
      "asset": "Asset Name",
      "why": "One sentence: why this is surprisingly valuable for their career path, and most peers won't have it."
    }
  ],
  "priority_focus": "Name the single most important skill to build first. Explain why in one sentence, referencing their thinking style and top career.",
  "thinking_style_fit": "One sentence on a specific advantage their ${thinkingStylePrimary} thinking style gives them in their chosen careers — be concrete, not complimentary."
}

Hard rules:
- skills_to_acquire: exactly 5–7 items. Each must be specific and role-relevant.
- Do NOT include any skill the student clearly already has in skills_to_acquire.
- career_relevance MUST name the specific career (e.g. "As a Management Consultant...").
- already_have: only list items with real evidence from the profile — do not invent.
- hidden_assets: max 3. Only include if genuinely non-obvious.
- No filler phrases like "it's important to", "this will help you", "in today's world".`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Route: POST /api/skills-gap/:firebase_uid
   Generates ONCE — if result already in DB, returns it without calling AI
───────────────────────────────────────────────────────────────────────────── */
router.post("/:firebase_uid", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    // ── 0. Already generated? Return immediately, no AI call ─────────────────
    const existing = await pool.query(
      `SELECT skills_to_acquire, skills_gap_full, updated_at
       FROM reports
       WHERE firebase_uid = $1 AND skills_to_acquire IS NOT NULL
       ORDER BY updated_at DESC LIMIT 1`,
      [firebase_uid]
    );

    if (existing.rows[0]?.skills_to_acquire) {
      const fullData = existing.rows[0].skills_gap_full
        ? (typeof existing.rows[0].skills_gap_full === "string"
            ? JSON.parse(existing.rows[0].skills_gap_full)
            : existing.rows[0].skills_gap_full)
        : { skills_to_acquire: existing.rows[0].skills_to_acquire };

      return res.json({ success: true, data: fullData, cached: true });
    }

    // ── 1. Fetch from DB ─────────────────────────────────────────────────────
    const [predRes, profileRes, userRes] = await Promise.all([
      pool.query(
        `SELECT p.thinking_style_primary, p.thinking_style_secondary,
                p.top_careers, p.moderate_careers,
                p.dominant_traits,
                t.normalized_traits
         FROM predictions p
         LEFT JOIN trait_snapshots t ON t.session_id = p.session_id
         WHERE p.firebase_uid = $1
         ORDER BY p.created_at DESC
         LIMIT 1`,
        [firebase_uid]
      ),
      pool.query(
        `SELECT skills, hobbies, career_interests AS interests FROM user_profiles WHERE user_id = $1`,
        [firebase_uid]
      ),
      pool.query(
        `SELECT age_group FROM users WHERE firebase_uid = $1`,
        [firebase_uid]
      ),
    ]);

    const pred    = predRes.rows[0]    || {};
    const profile = profileRes.rows[0] || {};
    const user    = userRes.rows[0]    || {};

    // ── 2. Build & call AI ───────────────────────────────────────────────────
    const prompt = buildSkillsGapPrompt({
      thinkingStylePrimary:   pred.thinking_style_primary?.label   ?? pred.thinking_style_primary,
      thinkingStyleSecondary: pred.thinking_style_secondary?.label ?? pred.thinking_style_secondary,
      topCareers:             pred.top_careers      ?? [],
      moderateCareers:        pred.moderate_careers ?? [],
      normalizedTraits:       pred.normalized_traits ?? {},
      dominantTraits:         pred.dominant_traits   ?? [],
      existingSkills:         profile.skills   ?? [],
      hobbies:                profile.hobbies  ?? [],
      ageGroup:               user.age_group,
    });

    const message = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      max_tokens:  1200,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "You are a JSON API. Respond ONLY with raw JSON. No markdown, no backticks, no explanation. Just the JSON object.",
        },
        { role: "user", content: prompt }
      ],
    });

    const raw     = message.choices?.[0]?.message?.content ?? "{}";
    console.log("RAW GROQ RESPONSE:", raw);
    const cleaned = raw
      .replace(/^```[\w]*\n?/m, "")   // strip opening fence (```json or ```)
      .replace(/```[\s]*$/m, "")       // strip closing fence
      .trim();
    const parsed  = JSON.parse(cleaned);

    // ── 3. Persist to DB — one time ──────────────────────────────────────────
    if (parsed.skills_to_acquire?.length > 0) {
      const skillNames = parsed.skills_to_acquire.map(s =>
        typeof s === "object" ? s.skill : s
      );

      // Try with skills_gap_full column first
      await pool.query(
        `UPDATE reports
         SET skills_to_acquire = $1,
             skills_gap_full   = $2,
             updated_at        = NOW()
         WHERE firebase_uid = $3`,
        [JSON.stringify(skillNames), JSON.stringify(parsed), firebase_uid]
      ).catch(() =>
        // Fallback if skills_gap_full column doesn't exist yet
        pool.query(
          `UPDATE reports SET skills_to_acquire = $1, updated_at = NOW() WHERE firebase_uid = $2`,
          [JSON.stringify(skillNames), firebase_uid]
        )
      );
    }

    res.json({ success: true, data: parsed, cached: false });

  } catch (err) {
    console.error("❌ [skills-gap]", err.message);
    res.status(500).json({ error: "Skills gap analysis failed", detail: err.message });
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   Route: GET /api/skills-gap/:firebase_uid/cached
───────────────────────────────────────────────────────────────────────────── */
router.get("/:firebase_uid/cached", async (req, res) => {
  const { firebase_uid } = req.params;
  try {
    const result = await pool.query(
      `SELECT skills_to_acquire, skills_gap_full, updated_at
       FROM reports
       WHERE firebase_uid = $1 AND skills_to_acquire IS NOT NULL
       ORDER BY updated_at DESC LIMIT 1`,
      [firebase_uid]
    );

    if (!result.rows[0]?.skills_to_acquire) {
      return res.json({ success: true, data: null });
    }

    const fullData = result.rows[0].skills_gap_full
      ? (typeof result.rows[0].skills_gap_full === "string"
          ? JSON.parse(result.rows[0].skills_gap_full)
          : result.rows[0].skills_gap_full)
      : { skills_to_acquire: result.rows[0].skills_to_acquire };

    res.json({
      success: true,
      data:    { ...fullData, cached_at: result.rows[0].updated_at },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;