// backend/routes/feedback.js
import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const {
      firebase_uid,
      session_id,
      accuracy_rating,
      thinking_style_accurate,
      top_career_accurate,
      suppression_accurate,
      preferred_career,
      comment,
    } = req.body;

    if (!accuracy_rating || accuracy_rating < 1 || accuracy_rating > 5) {
      return res.status(400).json({ error: "accuracy_rating must be 1–5" });
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Find prediction for this session
      const predRes = await client.query(
        `SELECT id, thinking_style_primary, career_1 FROM predictions
         WHERE session_id = $1 LIMIT 1`,
        [session_id]
      );

      if (predRes.rows.length === 0) {
        return res.status(404).json({ error: "No prediction found for this session" });
      }

      const pred = predRes.rows[0];

      // Save feedback
      await client.query(
        `INSERT INTO feedback (
          prediction_id, firebase_uid, accuracy_rating,
          thinking_style_accurate, top_career_accurate,
          suppression_accurate, preferred_career, comment
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          pred.id, firebase_uid || null, accuracy_rating,
          thinking_style_accurate ?? null,
          top_career_accurate ?? null,
          suppression_accurate ?? null,
          preferred_career || null,
          comment || null,
        ]
      );

      // If rating >= 4, add to ml_training_data automatically
      if (accuracy_rating >= 4) {
        const traitRes = await client.query(
          `SELECT normalized_traits FROM trait_snapshots WHERE session_id = $1`,
          [session_id]
        );

        if (traitRes.rows.length > 0) {
          await client.query(
            `INSERT INTO ml_training_data (
              source_session_id, firebase_uid,
              trait_vector, label_thinking_style,
              label_top_career, feedback_rating
            ) VALUES ($1,$2,$3,$4,$5,$6)`,
            [
              session_id,
              firebase_uid || null,
              traitRes.rows[0].normalized_traits,
              pred.thinking_style_primary,
              preferred_career || pred.career_1,
              accuracy_rating,
            ]
          );
          console.log("✅ Added to ML training data");
        }
      }

      // Log event
      await client.query(
        `INSERT INTO app_events (firebase_uid, event_type, session_id, metadata)
         VALUES ($1, 'feedback_submitted', $2, $3)`,
        [firebase_uid || null, session_id, JSON.stringify({ accuracy_rating })]
      );

      await client.query("COMMIT");
      res.json({ success: true });

    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error("❌ Feedback error:", err.message);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

export default router;
