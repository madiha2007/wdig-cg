-- Add this to your existing schema.sql, or run it separately
-- psql -U postgres -d wdig_db -f schema_reports.sql

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    prediction_id INTEGER UNIQUE REFERENCES predictions(id) ON DELETE CASCADE,
    firebase_uid TEXT REFERENCES users(firebase_uid) ON DELETE CASCADE,
    report_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_uid ON reports(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_reports_prediction ON reports(prediction_id);
