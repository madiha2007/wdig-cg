import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "ml.db"

def insert_snapshot(data):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO ml_trait_snapshot (
          user_id, test_id,
          logical, analytical, numerical, verbal, spatial,
          creativity, discipline, resilience, independence,
          communication, leadership,
          confidence
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, data)

    conn.commit()
    conn.close()
