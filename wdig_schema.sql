-- ============================================================
-- WDIG CAREER GUIDANCE — COMPLETE DATABASE SCHEMA
-- Run: psql -U postgres -d wdig_db -f schema.sql
-- ============================================================


-- ── SECTION 1: USERS ─────────────────────────────────────────────────────────
-- Synced from Firebase Auth. One row per registered user.

CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    firebase_uid    TEXT UNIQUE NOT NULL,
    email           TEXT,
    display_name    TEXT,
    age_group       TEXT,        -- "13-17", "18-22", "23-27", "28+"
    location        TEXT,        -- city/state, optional
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    last_active     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_uid ON users(firebase_uid);


-- ── SECTION 2: TEST SESSIONS ──────────────────────────────────────────────────
-- One row per test attempt. A user can take the test multiple times.

CREATE TABLE IF NOT EXISTS sessions (
    id              SERIAL PRIMARY KEY,
    firebase_uid    TEXT REFERENCES users(firebase_uid) ON DELETE CASCADE,
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    is_complete     BOOLEAN DEFAULT FALSE,
    time_taken_secs INTEGER,     -- how long they took to complete
    device_type     TEXT,        -- "mobile", "desktop", "tablet"
    app_version     TEXT         -- version of your app when test was taken
);

CREATE INDEX IF NOT EXISTS idx_sessions_uid ON sessions(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_sessions_complete ON sessions(is_complete);


-- ── SECTION 3: ANSWERS ───────────────────────────────────────────────────────
-- Every individual answer stored. Raw data for ML training later.

CREATE TABLE IF NOT EXISTS answers (
    id              SERIAL PRIMARY KEY,
    session_id      INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
    question_id     TEXT NOT NULL,      -- e.g. "LR_Q1", "PW_Q3"
    section         TEXT,               -- e.g. "Logical Reasoning", "Motivation & Passion"
    answer_value    TEXT NOT NULL,      -- option label or index as string
    answered_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_answers_session ON answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);


-- ── SECTION 4: RAW TRAITS ────────────────────────────────────────────────────
-- The computed trait scores before and after normalization.
-- Stored separately so ML can read them directly without recomputing.

CREATE TABLE IF NOT EXISTS trait_snapshots (
    id                  SERIAL PRIMARY KEY,
    session_id          INTEGER UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
    firebase_uid        TEXT REFERENCES users(firebase_uid) ON DELETE CASCADE,

    -- Raw (pre-normalization) integer scores
    raw_traits          JSONB NOT NULL,

    -- Normalized (0.0 to 1.0) float scores — the actual ML input vector
    normalized_traits   JSONB NOT NULL,

    -- Individual normalized values as columns for fast ML queries
    -- Cognitive
    n_logical           FLOAT, n_analytical        FLOAT, n_numerical   FLOAT,
    n_verbal            FLOAT, n_spatial            FLOAT,
    -- Personality
    n_creativity        FLOAT, n_discipline         FLOAT, n_resilience  FLOAT,
    n_independence      FLOAT, n_adaptability       FLOAT,
    n_growth_mindset    FLOAT, n_risk_appetite      FLOAT,
    n_depth_focus       FLOAT, n_confidence         FLOAT,
    n_stress_tolerance  FLOAT, n_accountability     FLOAT,
    n_initiative        FLOAT,
    -- Social
    n_communication     FLOAT, n_leadership         FLOAT, n_teamwork    FLOAT,
    n_empathy           FLOAT, n_emotional_intelligence FLOAT,
    n_helping_orientation FLOAT,
    -- Motivational
    n_intrinsic_motivation FLOAT, n_purpose_drive   FLOAT,
    n_passion_signal    FLOAT,   n_fear_avoidance   FLOAT,
    n_learning_orientation FLOAT,
    -- Suppression
    n_suppression_signal    FLOAT, n_pressure_conformity  FLOAT,
    n_childhood_divergence  FLOAT, n_self_awareness        FLOAT,
    -- Contribution
    n_societal_impact_awareness FLOAT, n_innovation_drive FLOAT,
    n_legacy_thinking           FLOAT,

    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_traits_uid     ON trait_snapshots(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_traits_session ON trait_snapshots(session_id);
-- Index for ML queries filtering by trait ranges
CREATE INDEX IF NOT EXISTS idx_traits_creativity   ON trait_snapshots(n_creativity);
CREATE INDEX IF NOT EXISTS idx_traits_analytical   ON trait_snapshots(n_analytical);
CREATE INDEX IF NOT EXISTS idx_traits_empathy      ON trait_snapshots(n_empathy);
CREATE INDEX IF NOT EXISTS idx_traits_suppression  ON trait_snapshots(n_suppression_signal);


-- ── SECTION 5: PREDICTIONS ───────────────────────────────────────────────────
-- The full ML output for each completed session.

CREATE TABLE IF NOT EXISTS predictions (
    id                      SERIAL PRIMARY KEY,
    session_id              INTEGER UNIQUE REFERENCES sessions(id) ON DELETE CASCADE,
    firebase_uid            TEXT REFERENCES users(firebase_uid) ON DELETE CASCADE,

    -- Thinking style
    thinking_style_primary      TEXT,
    thinking_style_secondary    TEXT,

    -- Career results (full arrays as JSONB)
    top_careers             JSONB,
    moderate_careers        JSONB,

    -- Top career names as columns for fast filtering/aggregation
    career_1                TEXT,
    career_2                TEXT,
    career_3                TEXT,

    -- Profile breakdown
    dominant_traits         JSONB,
    dimension_scores        JSONB,

    -- Suppression analysis
    suppression             JSONB,       -- { has_suppression, flags, levels }
    has_suppression         BOOLEAN DEFAULT FALSE,
    suppression_level       INTEGER,     -- 0-10

    -- ML metadata
    ml_version              TEXT DEFAULT '4.1',

    created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_predictions_uid      ON predictions(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_predictions_session  ON predictions(session_id);
CREATE INDEX IF NOT EXISTS idx_predictions_style    ON predictions(thinking_style_primary);
CREATE INDEX IF NOT EXISTS idx_predictions_career1  ON predictions(career_1);
CREATE INDEX IF NOT EXISTS idx_predictions_suppression ON predictions(has_suppression);


-- ── SECTION 6: REPORTS ───────────────────────────────────────────────────────
-- AI-generated aptitude reports (cached after first generation).

CREATE TABLE IF NOT EXISTS reports (
    id              SERIAL PRIMARY KEY,
    prediction_id   INTEGER UNIQUE REFERENCES predictions(id) ON DELETE CASCADE,
    firebase_uid    TEXT REFERENCES users(firebase_uid) ON DELETE CASCADE,
    report_text     TEXT NOT NULL,       -- full Claude-generated report
    model_used      TEXT DEFAULT 'claude-sonnet-4-20250514',
    tokens_used     INTEGER,
    generated_at    TIMESTAMPTZ DEFAULT NOW(),
    viewed_count    INTEGER DEFAULT 0,   -- how many times user viewed it
    downloaded_pdf  BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_reports_uid        ON reports(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_reports_prediction ON reports(prediction_id);


-- ── SECTION 7: FEEDBACK ──────────────────────────────────────────────────────
-- User ratings on their results. PRIMARY data for ML self-learning.

CREATE TABLE IF NOT EXISTS feedback (
    id                          SERIAL PRIMARY KEY,
    prediction_id               INTEGER REFERENCES predictions(id) ON DELETE CASCADE,
    firebase_uid                TEXT REFERENCES users(firebase_uid) ON DELETE CASCADE,

    -- Overall accuracy rating
    accuracy_rating             INTEGER CHECK (accuracy_rating BETWEEN 1 AND 5),

    -- Specific accuracy flags
    thinking_style_accurate     BOOLEAN,
    top_career_accurate         BOOLEAN,
    suppression_accurate        BOOLEAN,   -- did suppression insight feel right?

    -- Which career they actually relate to most
    preferred_career            TEXT,

    -- Open text
    comment                     TEXT,

    -- Outcome tracking (filled in later if user returns)
    actual_career_chosen        TEXT,      -- what they actually ended up doing
    outcome_reported_at         TIMESTAMPTZ,

    created_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_prediction ON feedback(prediction_id);
CREATE INDEX IF NOT EXISTS idx_feedback_uid        ON feedback(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_feedback_rating     ON feedback(accuracy_rating);


-- ── SECTION 8: ML TRAINING DATA ──────────────────────────────────────────────
-- Curated rows ready for model training. Populated by a background job
-- that joins trait_snapshots + predictions + feedback when rating >= 4.

CREATE TABLE IF NOT EXISTS ml_training_data (
    id                  SERIAL PRIMARY KEY,
    source_session_id   INTEGER REFERENCES sessions(id) ON DELETE SET NULL,
    firebase_uid        TEXT,   -- anonymized after 90 days

    -- Input vector (mirrors trait_snapshots columns)
    trait_vector        JSONB NOT NULL,

    -- Labels
    label_thinking_style    TEXT,   -- e.g. "creative_visionary"
    label_top_career        TEXT,   -- e.g. "UX Designer"
    label_suppression       BOOLEAN,

    -- Training metadata
    feedback_rating         INTEGER,        -- rating that qualified this row
    is_validated            BOOLEAN DEFAULT FALSE,  -- manually reviewed?
    split                   TEXT DEFAULT 'train',   -- "train", "val", "test"
    added_at                TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_style  ON ml_training_data(label_thinking_style);
CREATE INDEX IF NOT EXISTS idx_training_career ON ml_training_data(label_top_career);
CREATE INDEX IF NOT EXISTS idx_training_split  ON ml_training_data(split);


-- ── SECTION 9: MODEL VERSIONS ────────────────────────────────────────────────
-- Log of every ML model or rule update deployed.

CREATE TABLE IF NOT EXISTS model_versions (
    id              SERIAL PRIMARY KEY,
    version         TEXT UNIQUE NOT NULL,  -- e.g. "4.1", "5.0"
    description     TEXT,                  -- what changed
    deployed_at     TIMESTAMPTZ DEFAULT NOW(),
    training_rows   INTEGER,               -- how many rows trained on
    accuracy_score  FLOAT,                 -- validation accuracy if applicable
    is_active       BOOLEAN DEFAULT TRUE
);

-- Seed current version
INSERT INTO model_versions (version, description, training_rows)
VALUES ('4.1', 'Rule-based scoring with penalty system, fixed suppression thresholds', 0)
ON CONFLICT (version) DO NOTHING;


-- ── SECTION 10: CAREER POPULARITY LOGS ───────────────────────────────────────
-- Aggregate how often each career appears as top result.
-- Useful for product decisions and ML bias detection.

CREATE TABLE IF NOT EXISTS career_stats (
    career_name     TEXT PRIMARY KEY,
    times_top_1     INTEGER DEFAULT 0,
    times_top_3     INTEGER DEFAULT 0,
    times_top_5     INTEGER DEFAULT 0,
    avg_score       FLOAT,
    last_updated    TIMESTAMPTZ DEFAULT NOW()
);


-- ── SECTION 11: APP EVENTS LOG ───────────────────────────────────────────────
-- Lightweight event log for debugging and analytics.

CREATE TABLE IF NOT EXISTS app_events (
    id              SERIAL PRIMARY KEY,
    firebase_uid    TEXT,
    event_type      TEXT NOT NULL,  -- "test_started", "test_completed", "report_viewed", "pdf_downloaded", "feedback_submitted"
    session_id      INTEGER,
    metadata        JSONB,          -- any extra context
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_uid   ON app_events(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_events_type  ON app_events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_time  ON app_events(created_at);


-- ============================================================
-- VIEWS — useful pre-built queries for your backend/ML
-- ============================================================

-- Full profile view: join traits + predictions in one shot
CREATE OR REPLACE VIEW v_user_profiles AS
SELECT
    u.firebase_uid,
    u.email,
    u.age_group,
    p.thinking_style_primary,
    p.thinking_style_secondary,
    p.career_1,
    p.career_2,
    p.career_3,
    p.has_suppression,
    p.suppression_level,
    t.n_creativity,
    t.n_analytical,
    t.n_empathy,
    t.n_leadership,
    t.n_intrinsic_motivation,
    t.n_purpose_drive,
    t.n_suppression_signal,
    t.n_childhood_divergence,
    p.created_at AS test_date
FROM users u
JOIN sessions s ON s.firebase_uid = u.firebase_uid AND s.is_complete = TRUE
JOIN predictions p ON p.session_id = s.id
JOIN trait_snapshots t ON t.session_id = s.id
ORDER BY p.created_at DESC;


-- ML-ready training view: only high-rated feedback rows
CREATE OR REPLACE VIEW v_training_candidates AS
SELECT
    t.normalized_traits,
    t.n_creativity, t.n_analytical, t.n_empathy, t.n_leadership,
    t.n_intrinsic_motivation, t.n_purpose_drive, t.n_risk_appetite,
    t.n_depth_focus, t.n_suppression_signal, t.n_childhood_divergence,
    t.n_self_awareness, t.n_societal_impact_awareness, t.n_innovation_drive,
    p.thinking_style_primary AS label_style,
    p.career_1 AS label_career,
    p.has_suppression AS label_suppression,
    f.accuracy_rating
FROM trait_snapshots t
JOIN predictions p ON p.session_id = t.session_id
JOIN feedback f ON f.prediction_id = p.id
WHERE f.accuracy_rating >= 4   -- only keep rows where user agreed results were accurate
ORDER BY f.accuracy_rating DESC;


-- Career distribution view: see which careers are over/under-represented
CREATE OR REPLACE VIEW v_career_distribution AS
SELECT
    career_1 AS career,
    COUNT(*) AS times_recommended,
    ROUND(AVG(suppression_level), 1) AS avg_suppression
FROM predictions
WHERE career_1 IS NOT NULL
GROUP BY career_1
ORDER BY times_recommended DESC;
