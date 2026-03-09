import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// GET /api/profile/:firebase_uid
router.get("/:firebase_uid", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id = $1",
      [req.params.firebase_uid]
    );
    res.json({ profile: rows[0] || null, completed: rows.length > 0 });
  } catch (err) {
    console.error("[profile GET]", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST /api/profile
router.post("/", async (req, res) => {
  const {
    user_id, current_stage, field,
    financial_situation, family_pressure, time_horizon,
    skills, free_time_activities, past_achievements,
    success_definition, ten_year_vision,
    secret_dream, biggest_blocker,
  } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id is required" });

  try {
    const { rows } = await pool.query(`
      INSERT INTO user_profiles (
        user_id, current_stage, field,
        financial_situation, family_pressure, time_horizon,
        skills, free_time_activities, past_achievements,
        success_definition, ten_year_vision,
        secret_dream, biggest_blocker
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      ON CONFLICT (user_id) DO UPDATE SET
        current_stage        = EXCLUDED.current_stage,
        field                = EXCLUDED.field,
        financial_situation  = EXCLUDED.financial_situation,
        family_pressure      = EXCLUDED.family_pressure,
        time_horizon         = EXCLUDED.time_horizon,
        skills               = EXCLUDED.skills,
        free_time_activities = EXCLUDED.free_time_activities,
        past_achievements    = EXCLUDED.past_achievements,
        success_definition   = EXCLUDED.success_definition,
        ten_year_vision      = EXCLUDED.ten_year_vision,
        secret_dream         = EXCLUDED.secret_dream,
        biggest_blocker      = EXCLUDED.biggest_blocker,
        updated_at           = NOW()
      RETURNING *
    `, [
      user_id, current_stage||null, field||null,
      financial_situation||null, family_pressure||null, time_horizon||null,
      skills||[], free_time_activities||[], past_achievements||[],
      success_definition||null, ten_year_vision||null,
      secret_dream||null, biggest_blocker||null,
    ]);

    res.json({ success: true, profile: rows[0] });
  } catch (err) {
    console.error("[profile POST]", err.message);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

export default router;