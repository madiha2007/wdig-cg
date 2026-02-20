"""
Feature normalization and preprocessing
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
import joblib
from pathlib import Path
from typing import Tuple, Optional
from utils.logger import logger

class FeatureNormalizer:
    """
    Handles feature normalization with multiple scaling strategies
    """
    
    def __init__(self, method: str = 'standard'):
        """
        Initialize normalizer
        
        Args:
            method: Normalization method ('standard', 'minmax', 'robust')
        """
        self.method = method
        self.scaler = None
        self._initialize_scaler()
    
    def _initialize_scaler(self):
        """Initialize the appropriate scaler"""
        if self.method == 'standard':
            self.scaler = StandardScaler()
        elif self.method == 'minmax':
            self.scaler = MinMaxScaler()
        elif self.method == 'robust':
            self.scaler = RobustScaler()
        else:
            raise ValueError(f"Unknown normalization method: {self.method}")
        
        logger.info(f"Initialized {self.method} scaler")
    
    def fit(self, data: np.ndarray) -> 'FeatureNormalizer':
        """
        Fit the scaler to training data
        
        Args:
            data: Training feature matrix
        
        Returns:
            Self for chaining
        """
        self.scaler.fit(data)
        logger.info(f"Scaler fitted on {data.shape[0]} samples, {data.shape[1]} features")
        return self
    
    def transform(self, data: np.ndarray) -> np.ndarray:
        """
        Transform data using fitted scaler
        
        Args:
            data: Feature matrix to transform
        
        Returns:
            Normalized feature matrix
        """
        if self.scaler is None:
            raise RuntimeError("Scaler not fitted. Call fit() first.")
        
        transformed = self.scaler.transform(data)
        logger.info(f"Transformed {data.shape[0]} samples")
        return transformed
    
    def fit_transform(self, data: np.ndarray) -> np.ndarray:
        """
        Fit and transform in one step
        
        Args:
            data: Feature matrix
        
        Returns:
            Normalized feature matrix
        """
        self.fit(data)
        return self.transform(data)
    
    def inverse_transform(self, data: np.ndarray) -> np.ndarray:
        """
        Reverse the normalization
        
        Args:
            data: Normalized feature matrix
        
        Returns:
            Original scale feature matrix
        """
        if self.scaler is None:
            raise RuntimeError("Scaler not fitted. Call fit() first.")
        
        return self.scaler.inverse_transform(data)
    
    def save(self, path: Path):
        """
        Save the fitted scaler
        
        Args:
            path: Path to save the scaler
        """
        if self.scaler is None:
            raise RuntimeError("Cannot save unfitted scaler")
        
        path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.scaler, path)
        logger.info(f"Scaler saved to {path}")
    
    @classmethod
    def load(cls, path: Path, method: str = 'standard') -> 'FeatureNormalizer':
        """
        Load a saved scaler
        
        Args:
            path: Path to saved scaler
            method: Normalization method (for initialization)
        
        Returns:
            Loaded FeatureNormalizer instance
        """
        normalizer = cls(method=method)
        normalizer.scaler = joblib.load(path)
        logger.info(f"Scaler loaded from {path}")
        return normalizer

def preprocess_features(data: pd.DataFrame, 
                       trait_columns: list,
                       handle_missing: str = 'drop',
                       remove_outliers: bool = False,
                       outlier_threshold: float = 3.0) -> Tuple[pd.DataFrame, np.ndarray]:
    """
    Comprehensive feature preprocessing pipeline
    
    Args:
        data: Input DataFrame
        trait_columns: List of trait column names
        handle_missing: How to handle missing values ('drop', 'mean', 'median')
        remove_outliers: Whether to remove outliers
        outlier_threshold: Z-score threshold for outlier removal
    
    Returns:
        Tuple of (processed DataFrame, removed indices)
    """
    from utils.helpers import detect_outliers
    
    processed_data = data.copy()
    removed_indices = np.array([])
    
    # Handle missing values
    missing_count = processed_data[trait_columns].isnull().sum().sum()
    if missing_count > 0:
        logger.warning(f"Found {missing_count} missing values")
        
        if handle_missing == 'drop':
            before_len = len(processed_data)
            processed_data = processed_data.dropna(subset=trait_columns)
            logger.info(f"Dropped {before_len - len(processed_data)} rows with missing values")
        elif handle_missing == 'mean':
            processed_data[trait_columns] = processed_data[trait_columns].fillna(
                processed_data[trait_columns].mean()
            )
            logger.info("Filled missing values with column means")
        elif handle_missing == 'median':
            processed_data[trait_columns] = processed_data[trait_columns].fillna(
                processed_data[trait_columns].median()
            )
            logger.info("Filled missing values with column medians")
    
    # Remove outliers if requested
    if remove_outliers:
        feature_matrix = processed_data[trait_columns].values
        outlier_mask = detect_outliers(feature_matrix, threshold=outlier_threshold)
        
        if outlier_mask.any():
            removed_indices = processed_data.index[outlier_mask].values
            processed_data = processed_data[~outlier_mask]
            logger.info(f"Removed {len(removed_indices)} outliers")
    
    return processed_data, removed_indices
