import sqlite3
import pandas as pd
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "ml.db"

def load_training_data():
    conn = sqlite3.connect(DB_PATH)

    df = pd.read_sql("""
        SELECT
          logical, analytical, numerical, verbal, spatial,
          creativity, discipline, resilience, independence,
          communication, leadership,
          confidence
        FROM ml_trait_snapshot
    """, conn)

    conn.close()
    return df
