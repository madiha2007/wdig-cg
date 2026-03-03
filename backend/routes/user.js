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
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const userRes = await pool.query(
      `SELECT id, email, display_name, age_group, created_at, last_active
       FROM users WHERE firebase_uid = $1`,
      [firebase_uid]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM sessions WHERE firebase_uid = $1 AND is_complete = TRUE`,
      [firebase_uid]
    );

    res.json({
      user: userRes.rows[0],
      tests_taken: parseInt(countRes.rows[0].count),
    });
  } catch (err) {
    console.error("❌ User fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
