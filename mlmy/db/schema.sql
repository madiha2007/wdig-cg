-- Table: ML training snapshots
CREATE TABLE IF NOT EXISTS ml_trait_snapshot (
  snapshot_id INTEGER PRIMARY KEY AUTOINCREMENT,

  user_id INTEGER,
  test_id INTEGER,

  -- 11 TRAITS (ONLY FEATURES)
  logical REAL NOT NULL,
  analytical REAL NOT NULL,
  numerical REAL NOT NULL,
  verbal REAL NOT NULL,
  spatial REAL NOT NULL,
  creativity REAL NOT NULL,
  discipline REAL NOT NULL,
  resilience REAL NOT NULL,
  independence REAL NOT NULL,
  communication REAL NOT NULL,
  leadership REAL NOT NULL,

  -- Reliability weight (NOT a feature)
  confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Thinking profile definitions
CREATE TABLE IF NOT EXISTS thinking_profiles (
  profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_name TEXT NOT NULL,
  description TEXT
);

-- User ↔ Profile mapping (soft clustering)
CREATE TABLE IF NOT EXISTS user_profile_mapping (
  mapping_id INTEGER PRIMARY KEY AUTOINCREMENT,
  snapshot_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  membership_score REAL NOT NULL,

  FOREIGN KEY (snapshot_id) REFERENCES ml_trait_snapshot(snapshot_id),
  FOREIGN KEY (profile_id) REFERENCES thinking_profiles(profile_id)
);
