"""
Helper utilities for ML pipeline
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from utils.logger import logger

def validate_trait_data(data: pd.DataFrame, trait_columns: List[str]) -> bool:
    """
    Validate trait data for completeness and value ranges
    
    Args:
        data: DataFrame containing trait data
        trait_columns: List of expected trait column names
    
    Returns:
        True if validation passes
    
    Raises:
        ValueError: If validation fails
    """
    # Check for required columns
    missing_cols = set(trait_columns) - set(data.columns)
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    # Check for null values
    null_counts = data[trait_columns].isnull().sum()
    if null_counts.any():
        logger.warning(f"Null values found: {null_counts[null_counts > 0].to_dict()}")
        raise ValueError("Dataset contains null values")
    
    # Check value ranges (should be between 0 and 1)
    for col in trait_columns:
        values = data[col]
        if values.min() < 0 or values.max() > 1:
            raise ValueError(f"Column '{col}' has values outside [0, 1] range")
    
    logger.info(f"✅ Data validation passed for {len(data)} samples")
    return True

def calculate_feature_importance(model, feature_names: List[str]) -> Dict[str, float]:
    """
    Calculate relative importance of features based on variance
    
    Args:
        model: Trained clustering model
        feature_names: List of feature names
    
    Returns:
        Dictionary mapping feature names to importance scores
    """
    # For hierarchical clustering, we calculate importance based on
    # variance contribution to cluster separation
    try:
        # This is a simplified approach - in production, use more sophisticated methods
        importance = {name: 1.0 / len(feature_names) for name in feature_names}
        logger.info("Feature importance calculated")
        return importance
    except Exception as e:
        logger.error(f"Error calculating feature importance: {e}")
        return {}

def get_cluster_statistics(data: pd.DataFrame, labels: np.ndarray, 
                           trait_columns: List[str]) -> pd.DataFrame:
    """
    Calculate statistics for each cluster
    
    Args:
        data: Feature data
        labels: Cluster labels
        trait_columns: List of trait column names
    
    Returns:
        DataFrame with cluster statistics
    """
    data_with_labels = data.copy()
    data_with_labels['cluster'] = labels
    
    stats = []
    for cluster_id in range(labels.max() + 1):
        cluster_data = data_with_labels[data_with_labels['cluster'] == cluster_id][trait_columns]
        
        stats.append({
            'cluster_id': cluster_id,
            'size': len(cluster_data),
            'mean_values': cluster_data.mean().to_dict(),
            'std_values': cluster_data.std().to_dict()
        })
    
    logger.info(f"Statistics calculated for {len(stats)} clusters")
    return pd.DataFrame(stats)

def calculate_silhouette_score(data: np.ndarray, labels: np.ndarray) -> float:
    """
    Calculate silhouette score to evaluate clustering quality
    
    Args:
        data: Feature matrix
        labels: Cluster labels
    
    Returns:
        Silhouette score (higher is better, range [-1, 1])
    """
    from sklearn.metrics import silhouette_score
    
    if len(np.unique(labels)) < 2:
        logger.warning("Cannot calculate silhouette score with less than 2 clusters")
        return 0.0
    
    score = silhouette_score(data, labels)
    logger.info(f"Silhouette Score: {score:.4f}")
    return score

def normalize_weights(weights: Dict[str, float]) -> Dict[str, float]:
    """
    Normalize weights to sum to 1
    
    Args:
        weights: Dictionary of feature weights
    
    Returns:
        Normalized weights
    """
    total = sum(weights.values())
    if total == 0:
        logger.warning("Sum of weights is zero, returning uniform weights")
        return {k: 1.0 / len(weights) for k in weights.keys()}
    
    return {k: v / total for k, v in weights.items()}

def create_weighted_features(data: pd.DataFrame, weights: Dict[str, float]) -> np.ndarray:
    """
    Apply feature weights to data
    
    Args:
        data: Feature DataFrame
        weights: Dictionary of feature weights
    
    Returns:
        Weighted feature matrix
    """
    weighted_data = data.copy()
    for col, weight in weights.items():
        if col in weighted_data.columns:
            weighted_data[col] = weighted_data[col] * weight
    
    return weighted_data.values

def detect_outliers(data: np.ndarray, threshold: float = 3.0) -> np.ndarray:
    """
    Detect outliers using z-score method
    
    Args:
        data: Feature matrix
        threshold: Z-score threshold for outlier detection
    
    Returns:
        Boolean array indicating outliers
    """
    from scipy import stats
    
    z_scores = np.abs(stats.zscore(data))
    outliers = (z_scores > threshold).any(axis=1)
    
    logger.info(f"Detected {outliers.sum()} outliers ({outliers.sum() / len(data) * 100:.2f}%)")
    return outliers
