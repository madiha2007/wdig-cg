// backend/routes/user.js
import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// POST /api/user/sync — call after every Firebase login
router.post("/sync", async (req, res) => {
  try {
    const { firebase_uid, email, display_name, age_group, location } = req.body;

    if (!firebase_uid) {
      return res.status(400).json({ error: "firebase_uid required" });
    }

    await pool.query(
      `INSERT INTO users (firebase_uid, email, display_name, age_group, location)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (firebase_uid) DO UPDATE SET
         email        = COALESCE(EXCLUDED.email, users.email),
         display_name = COALESCE(EXCLUDED.display_name, users.display_name),
         last_active  = NOW()`,
      [firebase_uid, email || null, display_name || null, age_group || null, location || null]
    );

    // Log login event
    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, metadata)
       VALUES ($1, 'user_login', $2)`,
      [firebase_uid, JSON.stringify({ email })]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ User sync error:", err.message);
    res.status(500).json({ error: "Sync failed" });
  }
});

// GET /api/user/:firebase_uid — get user profile + test history summary
// GET /api/user/:firebase_uid/full
// Returns: user row + profile row + latest prediction + report skills
router.get("/:firebase_uid/full", async (req, res) => {
  const { firebase_uid } = req.params;

  try {
    const [userRes, profileRes, predRes, sessionRes] = await Promise.all([
      pool.query(
        `SELECT email, display_name, age_group, location, created_at
         FROM users WHERE firebase_uid = $1`,
        [firebase_uid]
      ),
      pool.query(
        `SELECT * FROM user_profiles WHERE user_id = $1`,
        [firebase_uid]
      ),
      pool.query(
        `SELECT p.thinking_style_primary, p.thinking_style_secondary,
                p.top_careers, p.moderate_careers,
                p.dominant_traits, p.dimension_scores, p.suppression,
                t.normalized_traits,
                r.report_text
         FROM predictions p
         LEFT JOIN trait_snapshots t ON t.session_id = p.session_id
         LEFT JOIN reports r ON r.prediction_id = p.id
         WHERE p.firebase_uid = $1
         ORDER BY p.created_at DESC LIMIT 1`,
        [firebase_uid]
      ),
      pool.query(
        `SELECT COUNT(*) FROM sessions
         WHERE firebase_uid = $1 AND is_complete = TRUE`,
        [firebase_uid]
      ),
    ]);

    // ✅ SAFE processing BEFORE sending response
    const user = userRes.rows[0] || null;
    const profile = profileRes.rows[0] || null;
    const prediction = predRes.rows[0] || null;
    const tests_taken = parseInt(sessionRes.rows[0]?.count || 0);

    // ✅ SEND ONLY ONCE
    return res.json({
      user,
      profile,
      prediction,
      tests_taken,
    });

  } catch (err) {
    console.error("[user/full]", err);

    // ✅ prevent double send
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to fetch user data" });
    }
  }
});

export default router;
