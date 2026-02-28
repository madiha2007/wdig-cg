# """
# Feature normalization and preprocessing
# """
# import numpy as np
# import pandas as pd
# from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
# import joblib
# from pathlib import Path
# from typing import Tuple, Optional
# from utils.logger import logger

# class FeatureNormalizer:
#     """
#     Handles feature normalization with multiple scaling strategies
#     """
    
#     def __init__(self, method: str = 'standard'):
#         """
#         Initialize normalizer
        
#         Args:
#             method: Normalization method ('standard', 'minmax', 'robust')
#         """
#         self.method = method
#         self.scaler = None
#         self._initialize_scaler()
    
#     def _initialize_scaler(self):
#         """Initialize the appropriate scaler"""
#         if self.method == 'standard':
#             self.scaler = StandardScaler()
#         elif self.method == 'minmax':
#             self.scaler = MinMaxScaler()
#         elif self.method == 'robust':
#             self.scaler = RobustScaler()
#         else:
#             raise ValueError(f"Unknown normalization method: {self.method}")
        
#         logger.info(f"Initialized {self.method} scaler")
    
#     def fit(self, data: np.ndarray) -> 'FeatureNormalizer':
#         """
#         Fit the scaler to training data
        
#         Args:
#             data: Training feature matrix
        
#         Returns:
#             Self for chaining
#         """
#         self.scaler.fit(data)
#         logger.info(f"Scaler fitted on {data.shape[0]} samples, {data.shape[1]} features")
#         return self
    
#     def transform(self, data: np.ndarray) -> np.ndarray:
#         """
#         Transform data using fitted scaler
        
#         Args:
#             data: Feature matrix to transform
        
#         Returns:
#             Normalized feature matrix
#         """
#         if self.scaler is None:
#             raise RuntimeError("Scaler not fitted. Call fit() first.")
        
#         transformed = self.scaler.transform(data)
#         logger.info(f"Transformed {data.shape[0]} samples")
#         return transformed
    
#     def fit_transform(self, data: np.ndarray) -> np.ndarray:
#         """
#         Fit and transform in one step
        
#         Args:
#             data: Feature matrix
        
#         Returns:
#             Normalized feature matrix
#         """
#         self.fit(data)
#         return self.transform(data)
    
#     def inverse_transform(self, data: np.ndarray) -> np.ndarray:
#         """
#         Reverse the normalization
        
#         Args:
#             data: Normalized feature matrix
        
#         Returns:
#             Original scale feature matrix
#         """
#         if self.scaler is None:
#             raise RuntimeError("Scaler not fitted. Call fit() first.")
        
#         return self.scaler.inverse_transform(data)
    
#     def save(self, path: Path):
#         """
#         Save the fitted scaler
        
#         Args:
#             path: Path to save the scaler
#         """
#         if self.scaler is None:
#             raise RuntimeError("Cannot save unfitted scaler")
        
#         path.parent.mkdir(parents=True, exist_ok=True)
#         joblib.dump(self.scaler, path)
#         logger.info(f"Scaler saved to {path}")
    
#     @classmethod
#     def load(cls, path: Path, method: str = 'standard') -> 'FeatureNormalizer':
#         """
#         Load a saved scaler
        
#         Args:
#             path: Path to saved scaler
#             method: Normalization method (for initialization)
        
#         Returns:
#             Loaded FeatureNormalizer instance
#         """
#         normalizer = cls(method=method)
#         normalizer.scaler = joblib.load(path)
#         logger.info(f"Scaler loaded from {path}")
#         return normalizer

# def preprocess_features(data: pd.DataFrame, 
#                        trait_columns: list,
#                        handle_missing: str = 'drop',
#                        remove_outliers: bool = False,
#                        outlier_threshold: float = 3.0) -> Tuple[pd.DataFrame, np.ndarray]:
#     """
#     Comprehensive feature preprocessing pipeline
    
#     Args:
#         data: Input DataFrame
#         trait_columns: List of trait column names
#         handle_missing: How to handle missing values ('drop', 'mean', 'median')
#         remove_outliers: Whether to remove outliers
#         outlier_threshold: Z-score threshold for outlier removal
    
#     Returns:
#         Tuple of (processed DataFrame, removed indices)
#     """
#     from utils.helpers import detect_outliers
    
#     processed_data = data.copy()
#     removed_indices = np.array([])
    
#     # Handle missing values
#     missing_count = processed_data[trait_columns].isnull().sum().sum()
#     if missing_count > 0:
#         logger.warning(f"Found {missing_count} missing values")
        
#         if handle_missing == 'drop':
#             before_len = len(processed_data)
#             processed_data = processed_data.dropna(subset=trait_columns)
#             logger.info(f"Dropped {before_len - len(processed_data)} rows with missing values")
#         elif handle_missing == 'mean':
#             processed_data[trait_columns] = processed_data[trait_columns].fillna(
#                 processed_data[trait_columns].mean()
#             )
#             logger.info("Filled missing values with column means")
#         elif handle_missing == 'median':
#             processed_data[trait_columns] = processed_data[trait_columns].fillna(
#                 processed_data[trait_columns].median()
#             )
#             logger.info("Filled missing values with column medians")
    
#     # Remove outliers if requested
#     if remove_outliers:
#         feature_matrix = processed_data[trait_columns].values
#         outlier_mask = detect_outliers(feature_matrix, threshold=outlier_threshold)
        
#         if outlier_mask.any():
#             removed_indices = processed_data.index[outlier_mask].values
#             processed_data = processed_data[~outlier_mask]
#             logger.info(f"Removed {len(removed_indices)} outliers")
    
#     return processed_data, removed_indices



# ml/features/normalizer.py
# ============================================================
# True min-max normalization for all 35 traits.
# Mirrors the TRAIT_RANGES in predict.js exactly.
# Negative minimums are intentional — do not change.
# ============================================================

TRAIT_RANGES = {
    "logical":                  (0,   18),
    "analytical":               (0,   16),
    "numerical":                (0,   14),
    "verbal":                   (0,   14),
    "spatial":                  (0,   14),
    "creativity":               (-2,  10),
    "discipline":               (-8,   8),
    "resilience":               (-9,   8),
    "independence":             (0,    8),
    "adaptability":             (-5,   8),
    "growth_mindset":           (-5,  12),
    "risk_appetite":            (-4,  10),
    "depth_focus":              (-4,  10),
    "confidence":               (-4,   6),
    "stress_tolerance":         (0,    4),
    "accountability":           (-10,  2),
    "initiative":               (-8,   8),
    "problem_solving":          (0,   10),
    "intrinsic_motivation":     (-6,  14),
    "purpose_drive":            (-7,   8),
    "passion_signal":           (-3,  10),
    "fear_avoidance":           (0,   16),
    "learning_orientation":     (-4,   4),
    "communication":            (-4,  10),
    "leadership":               (-2,  10),
    "teamwork":                 (0,    4),
    "empathy":                  (0,   10),
    "emotional_intelligence":   (-5,   6),
    "helping_orientation":      (0,   12),
    "suppression_signal":       (0,   16),
    "pressure_conformity":      (0,   14),
    "childhood_divergence":     (0,    8),
    "self_awareness":           (-2,   6),
    "societal_impact_awareness":(-2,  12),
    "innovation_drive":         (0,   12),
    "legacy_thinking":          (-2,   8),
}


def normalize(trait: str, raw_value: float) -> float:
    """
    True min-max normalization.
    A raw value of -3 discipline becomes ~0.31, NOT 0.
    Output: 0.0 to 1.0
    """
    if trait not in TRAIT_RANGES:
        return 0.5  # unknown trait → neutral
    lo, hi = TRAIT_RANGES[trait]
    clamped = max(lo, min(hi, raw_value))
    return round((clamped - lo) / (hi - lo), 4)


def normalize_all(raw_traits: dict) -> dict:
    """Normalize a full trait dict. Input can have raw or already-normalized values."""
    return {trait: normalize(trait, value) for trait, value in raw_traits.items()}