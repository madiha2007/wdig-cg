// backend/routes/history.js
import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// GET /api/history/:firebase_uid — full test history
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { firebase_uid } = req.params;

    const result = await pool.query(
      `SELECT
         p.id AS prediction_id,
         p.session_id,
         p.thinking_style_primary,
         p.thinking_style_secondary,
         p.career_1, p.career_2, p.career_3,
         p.top_careers,
         p.dominant_traits,
         p.has_suppression,
         p.suppression_level,
         p.dimension_scores,
         p.ml_version,
         p.created_at,
         r.report_text IS NOT NULL AS has_report
       FROM predictions p
       LEFT JOIN reports r ON r.prediction_id = p.id
       WHERE p.firebase_uid = $1
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [firebase_uid]
    );

    // Log view event
    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, metadata)
       VALUES ($1, 'history_viewed', $2)`,
      [firebase_uid, JSON.stringify({ count: result.rows.length })]
    );

    res.json({ history: result.rows });
  } catch (err) {
    console.error("❌ History error:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// DELETE /api/history/:session_id — user deletes a result
router.delete("/:session_id", async (req, res) => {
  try {
    const { session_id } = req.params;
    const { firebase_uid } = req.body;

    // Verify ownership
    const check = await pool.query(
      `SELECT firebase_uid FROM sessions WHERE id = $1`,
      [session_id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }
    if (check.rows[0].firebase_uid !== firebase_uid) {
      return res.status(403).json({ error: "Not your session" });
    }

    // Deleting session cascades to answers, trait_snapshots, predictions, reports
    await pool.query(`DELETE FROM sessions WHERE id = $1`, [session_id]);

    await pool.query(
      `INSERT INTO app_events (firebase_uid, event_type, metadata)
       VALUES ($1, 'result_deleted', $2)`,
      [firebase_uid, JSON.stringify({ session_id })]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
