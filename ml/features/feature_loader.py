# """
# Feature loading from database and CSV sources
# """
# import pandas as pd
# import sqlite3
# from pathlib import Path
# from typing import Tuple, Optional
# from utils.config import TRAIT_COLUMNS, DB_PATH, CSV_PATH
# from utils.logger import logger

# class FeatureLoader:
#     """
#     Loads and manages feature data from various sources
#     """
    
#     def __init__(self, db_path: Path = DB_PATH):
#         """
#         Initialize feature loader
        
#         Args:
#             db_path: Path to SQLite database
#         """
#         self.db_path = db_path
#         self.trait_columns = TRAIT_COLUMNS
    
#     def load_from_csv(self, csv_path: Path = CSV_PATH) -> pd.DataFrame:
#         """
#         Load training data from CSV file
        
#         Args:
#             csv_path: Path to CSV file
        
#         Returns:
#             DataFrame with trait data
#         """
#         try:
#             df = pd.read_csv(csv_path)
#             logger.info(f"Loaded {len(df)} samples from CSV: {csv_path}")
            
#             # Validate columns
#             required_cols = set(self.trait_columns + ["confidence"])
#             if not required_cols.issubset(df.columns):
#                 missing = required_cols - set(df.columns)
#                 raise ValueError(f"Missing required columns: {missing}")
            
#             return df
        
#         except FileNotFoundError:
#             logger.error(f"CSV file not found: {csv_path}")
#             raise
#         except Exception as e:
#             logger.error(f"Error loading CSV: {e}")
#             raise
    
#     def load_from_database(self, 
#                           table_name: str = 'ml_training_vectors',
#                           limit: Optional[int] = None) -> pd.DataFrame:
#         """
#         Load training data from database
        
#         Args:
#             table_name: Name of the database table
#             limit: Optional limit on number of rows
        
#         Returns:
#             DataFrame with trait data
#         """
#         try:
#             if not self.db_path.exists():
#                 logger.warning(f"Database not found: {self.db_path}")
#                 return pd.DataFrame()
            
#             conn = sqlite3.connect(self.db_path)
            
#             query = f"SELECT * FROM {table_name}"
#             if limit:
#                 query += f" LIMIT {limit}"
            
#             df = pd.read_sql_query(query, conn)
#             conn.close()
            
#             logger.info(f"Loaded {len(df)} samples from database table: {table_name}")
#             return df
        
#         except Exception as e:
#             logger.error(f"Error loading from database: {e}")
#             raise
    
#     def load_user_snapshot(self, user_id: str, test_id: Optional[str] = None) -> pd.DataFrame:
#         """
#         Load a specific user's trait snapshot
        
#         Args:
#             user_id: User identifier
#             test_id: Optional test identifier
        
#         Returns:
#             DataFrame with user's trait data
#         """
#         try:
#             conn = sqlite3.connect(self.db_path)
            
#             if test_id:
#                 query = f"""
#                     SELECT * FROM ml_trait_snapshot 
#                     WHERE user_id = ? AND test_id = ?
#                 """
#                 df = pd.read_sql_query(query, conn, params=(user_id, test_id))
#             else:
#                 query = f"""
#                     SELECT * FROM ml_trait_snapshot 
#                     WHERE user_id = ?
#                     ORDER BY created_at DESC
#                     LIMIT 1
#                 """
#                 df = pd.read_sql_query(query, conn, params=(user_id,))
            
#             conn.close()
            
#             if len(df) > 0:
#                 logger.info(f"Loaded snapshot for user {user_id}")
#             else:
#                 logger.warning(f"No snapshot found for user {user_id}")
            
#             return df
        
#         except Exception as e:
#             logger.error(f"Error loading user snapshot: {e}")
#             raise
    
#     def load_training_data(self, 
#                           source: str = 'csv',
#                           limit: Optional[int] = None) -> Tuple[pd.DataFrame, pd.Series]:
#         """
#         Load training data and separate features from confidence
        
#         Args:
#             source: Data source ('csv' or 'database')
#             limit: Optional limit on number of samples
        
#         Returns:
#             Tuple of (features DataFrame, confidence Series)
#         """
#         if source == 'csv':
#             data = self.load_from_csv()
#         elif source == 'database':
#             data = self.load_from_database(limit=limit)
#         else:
#             raise ValueError(f"Unknown source: {source}")
        
#         if data.empty:
#             logger.error("No training data loaded")
#             raise ValueError("No training data available")
        
#         # Separate features and confidence
#         features = data[self.trait_columns]
#         confidence = data['confidence'] if 'confidence' in data.columns else None
        
#         logger.info(f"Prepared {len(features)} training samples with {len(self.trait_columns)} features")
        
#         return features, confidence
    
#     def get_feature_statistics(self, data: pd.DataFrame) -> dict:
#         """
#         Calculate basic statistics for features
        
#         Args:
#             data: Feature DataFrame
        
#         Returns:
#             Dictionary with statistics
#         """
#         stats = {
#             'n_samples': len(data),
#             'n_features': len(self.trait_columns),
#             'feature_means': data[self.trait_columns].mean().to_dict(),
#             'feature_stds': data[self.trait_columns].std().to_dict(),
#             'feature_mins': data[self.trait_columns].min().to_dict(),
#             'feature_maxs': data[self.trait_columns].max().to_dict(),
#         }
        
#         logger.info(f"Calculated statistics for {stats['n_samples']} samples")
#         return stats
    
#     def save_to_database(self, 
#                         data: pd.DataFrame, 
#                         table_name: str = 'ml_training_vectors'):
#         """
#         Save data to database
        
#         Args:
#             data: DataFrame to save
#             table_name: Target table name
#         """
#         try:
#             conn = sqlite3.connect(self.db_path)
#             data.to_sql(table_name, conn, if_exists='append', index=False)
#             conn.close()
            
#             logger.info(f"Saved {len(data)} samples to database table: {table_name}")
        
#         except Exception as e:
#             logger.error(f"Error saving to database: {e}")
#             raise


# ml/features/feature_loader.py
# ============================================================
# Trait dimension groupings.
# Used by the inference pipeline to compute dimension scores
# and by the suppression detection engine.
# ============================================================

DIMENSIONS = {
    "cognitive": [
        "logical", "analytical", "numerical", "verbal", "spatial", "creativity"
    ],
    "personality": [
        "discipline", "resilience", "independence", "adaptability",
        "growth_mindset", "risk_appetite", "depth_focus", "confidence",
        "stress_tolerance", "accountability", "initiative", "problem_solving"
    ],
    "motivational": [
        "intrinsic_motivation", "purpose_drive", "passion_signal",
        "fear_avoidance", "learning_orientation"
    ],
    "social": [
        "communication", "leadership", "teamwork", "empathy",
        "emotional_intelligence", "helping_orientation"
    ],
    "suppression": [
        "suppression_signal", "pressure_conformity",
        "childhood_divergence", "self_awareness"
    ],
    "contribution": [
        "societal_impact_awareness", "innovation_drive", "legacy_thinking"
    ],
}

# Traits that should NEVER appear in dominant_traits display
# These are meta/suppression signals, not personal strengths
EXCLUDED_FROM_DOMINANT = {
    "suppression_signal",
    "pressure_conformity",
    "childhood_divergence",
    "fear_avoidance",        # fear is not a strength
    "stress_tolerance",      # too baseline
    "confidence",            # too generic
    "teamwork",              # too generic
}

# Human-readable labels for trait display
TRAIT_LABELS = {
    "logical":                  "Logical Reasoning",
    "analytical":               "Analytical Thinking",
    "numerical":                "Numerical Ability",
    "verbal":                   "Verbal Reasoning",
    "spatial":                  "Spatial Thinking",
    "creativity":               "Creativity",
    "discipline":               "Discipline",
    "resilience":               "Resilience",
    "independence":             "Independence",
    "adaptability":             "Adaptability",
    "growth_mindset":           "Growth Mindset",
    "risk_appetite":            "Risk Appetite",
    "depth_focus":              "Depth of Focus",
    "accountability":           "Accountability",
    "initiative":               "Initiative",
    "problem_solving":          "Problem Solving",
    "intrinsic_motivation":     "Intrinsic Motivation",
    "purpose_drive":            "Purpose Drive",
    "passion_signal":           "Passion",
    "learning_orientation":     "Learning Orientation",
    "communication":            "Communication",
    "leadership":               "Leadership",
    "empathy":                  "Empathy",
    "emotional_intelligence":   "Emotional Intelligence",
    "helping_orientation":      "Helping Orientation",
    "self_awareness":           "Self-Awareness",
    "societal_impact_awareness":"Societal Impact Awareness",
    "innovation_drive":         "Innovation Drive",
    "legacy_thinking":          "Legacy Thinking",
}


def get_dimension_scores(traits: dict) -> dict:
    """
    Compute average normalized score per dimension.
    Returns dict like { "cognitive": 72, "personality": 58, ... }
    Values are 0-100.
    """
    scores = {}
    for dim, trait_list in DIMENSIONS.items():
        values = [traits.get(t, 0.5) for t in trait_list]
        scores[dim] = round(sum(values) / len(values) * 100) if values else 50
    return scores


def get_dominant_traits(traits: dict, top_n: int = 5) -> list:
    """
    Return top N traits by normalized score.
    Excludes suppression/meta traits — only surfaces genuine strengths.
    """
    # Only score traits that are meaningful personal strengths
    scoreable = {
        k: v for k, v in traits.items()
        if k not in EXCLUDED_FROM_DOMINANT
        and k in TRAIT_LABELS   # only known, labelled traits
    }

    sorted_traits = sorted(scoreable.items(), key=lambda x: x[1], reverse=True)

    return [
        {
            "trait": t,
            "label": TRAIT_LABELS.get(t, t.replace("_", " ").title()),
            "score": round(v * 100)
        }
        for t, v in sorted_traits[:top_n]
    ]