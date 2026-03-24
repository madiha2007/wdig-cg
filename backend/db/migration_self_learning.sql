-- ============================================================
-- WDIG Self-Learning Migration — run once against wdig_db
-- Safe to re-run: uses IF NOT EXISTS / DO $$ blocks throughout
-- ============================================================

-- 1. Add new columns to feedback table
ALTER TABLE feedback
    ADD COLUMN IF NOT EXISTS career_chosen_pre_results TEXT,
    ADD COLUMN IF NOT EXISTS time_taken_secs           INTEGER,
    ADD COLUMN IF NOT EXISTS popup_shown_at            TIMESTAMPTZ;

-- 2. Style-career affinity tracking table
CREATE TABLE IF NOT EXISTS style_career_affinity (
    id                  SERIAL PRIMARY KEY,
    thinking_style      TEXT        NOT NULL,
    career_label        TEXT        NOT NULL,
    alignment_type      TEXT        NOT NULL CHECK (alignment_type IN ('primary', 'secondary', 'clash')),
    event_count         INTEGER     NOT NULL DEFAULT 0,
    last_updated        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (thinking_style, career_label, alignment_type)
);

-- 3. Retrain log table
CREATE TABLE IF NOT EXISTS retrain_log (
    id                  SERIAL PRIMARY KEY,
    triggered_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_count_at_run  INTEGER,
    primary_factor      FLOAT,
    secondary_factor    FLOAT,
    clash_factor        FLOAT,
    notes               TEXT
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_career_pre
    ON feedback (career_chosen_pre_results)
    WHERE career_chosen_pre_results IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_feedback_time_taken
    ON feedback (time_taken_secs);

CREATE INDEX IF NOT EXISTS idx_affinity_style
    ON style_career_affinity (thinking_style, alignment_type);

CREATE INDEX IF NOT EXISTS idx_retrain_log_triggered
    ON retrain_log (triggered_at DESC);

-- Done
SELECT 'Migration complete' AS status;
