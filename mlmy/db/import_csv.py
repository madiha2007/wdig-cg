import sqlite3
import pandas as pd
from pathlib import Path

# Paths
DB_PATH = Path(__file__).resolve().parents[1] / "data" / "ml.db"
CSV_PATH = Path(__file__).resolve().parents[1] / "data" / "raw_exports" / "dummy_traits.csv"

TRAIT_COLUMNS = [
    "logical",
    "analytical",
    "numerical",
    "verbal",
    "spatial",
    "creativity",
    "discipline",
    "resilience",
    "independence",
    "communication",
    "leadership",
]

def import_csv():
    df = pd.read_csv(CSV_PATH)

    # Basic validation (prevents garbage data)
    required_cols = set(TRAIT_COLUMNS + ["confidence"])
    if not required_cols.issubset(df.columns):
        missing = required_cols - set(df.columns)
        raise ValueError(f"Missing required columns: {missing}")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    insert_query = f"""
        INSERT INTO ml_training_vectors (
            {", ".join(TRAIT_COLUMNS)},
            confidence
        )
        VALUES ({", ".join(["?"] * (len(TRAIT_COLUMNS) + 1))})
    """

    for _, row in df.iterrows():
        values = [row[col] for col in TRAIT_COLUMNS] + [row["confidence"]]
        cursor.execute(insert_query, values)

    conn.commit()
    conn.close()

    print(f"✅ Imported {len(df)} rows into ml_training_vectors")

if __name__ == "__main__":
    import_csv()
