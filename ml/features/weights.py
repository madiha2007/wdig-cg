"""
Feature weighting strategies for thinking style classification
"""
import numpy as np
from typing import Dict, List
from utils.logger import logger

class FeatureWeights:
    """
    Manages feature weights for clustering
    """
    
    # Default weights based on domain knowledge
    DEFAULT_WEIGHTS = {
        "logical": 1.2,
        "analytical": 1.2,
        "numerical": 1.0,
        "verbal": 1.1,
        "spatial": 1.0,
        "creativity": 1.3,
        "discipline": 0.9,
        "resilience": 0.8,
        "independence": 0.9,
        "communication": 1.1,
        "leadership": 1.0,
    }
    
    # Career-focused weights (emphasize skills directly tied to careers)
    CAREER_FOCUSED_WEIGHTS = {
        "logical": 1.5,
        "analytical": 1.5,
        "numerical": 1.3,
        "verbal": 1.2,
        "spatial": 1.1,
        "creativity": 1.4,
        "discipline": 0.7,
        "resilience": 0.6,
        "independence": 0.8,
        "communication": 1.3,
        "leadership": 1.2,
    }
    
    # Balanced weights (equal consideration for all traits)
    BALANCED_WEIGHTS = {
        "logical": 1.0,
        "analytical": 1.0,
        "numerical": 1.0,
        "verbal": 1.0,
        "spatial": 1.0,
        "creativity": 1.0,
        "discipline": 1.0,
        "resilience": 1.0,
        "independence": 1.0,
        "communication": 1.0,
        "leadership": 1.0,
    }
    
    def __init__(self, strategy: str = 'default'):
        """
        Initialize feature weights
        
        Args:
            strategy: Weighting strategy ('default', 'career_focused', 'balanced', 'custom')
        """
        self.strategy = strategy
        self.weights = self._get_weights(strategy)
        logger.info(f"Initialized {strategy} feature weights")
    
    def _get_weights(self, strategy: str) -> Dict[str, float]:
        """Get weights based on strategy"""
        if strategy == 'default':
            return self.DEFAULT_WEIGHTS.copy()
        elif strategy == 'career_focused':
            return self.CAREER_FOCUSED_WEIGHTS.copy()
        elif strategy == 'balanced':
            return self.BALANCED_WEIGHTS.copy()
        else:
            logger.warning(f"Unknown strategy '{strategy}', using default")
            return self.DEFAULT_WEIGHTS.copy()
    
    def set_custom_weights(self, custom_weights: Dict[str, float]):
        """
        Set custom weights
        
        Args:
            custom_weights: Dictionary of feature weights
        """
        # Validate weights
        for trait in self.DEFAULT_WEIGHTS.keys():
            if trait not in custom_weights:
                logger.warning(f"Missing weight for '{trait}', using default")
                custom_weights[trait] = self.DEFAULT_WEIGHTS[trait]
        
        self.weights = custom_weights
        self.strategy = 'custom'
        logger.info("Custom weights applied")
    
    def get_weights(self) -> Dict[str, float]:
        """Get current weights"""
        return self.weights.copy()
    
    def normalize_weights(self) -> Dict[str, float]:
        """
        Get normalized weights (sum to 1)
        
        Returns:
            Normalized weights dictionary
        """
        total = sum(self.weights.values())
        if total == 0:
            logger.warning("Sum of weights is zero")
            return {k: 1.0 / len(self.weights) for k in self.weights.keys()}
        
        return {k: v / total for k, v in self.weights.items()}
    
    def apply_weights(self, data: np.ndarray, columns: List[str]) -> np.ndarray:
        """
        Apply weights to feature matrix
        
        Args:
            data: Feature matrix (n_samples, n_features)
            columns: Column names corresponding to features
        
        Returns:
            Weighted feature matrix
        """
        if data.shape[1] != len(columns):
            raise ValueError(f"Data has {data.shape[1]} features but {len(columns)} column names provided")
        
        weighted_data = data.copy()
        for idx, col in enumerate(columns):
            if col in self.weights:
                weighted_data[:, idx] *= self.weights[col]
            else:
                logger.warning(f"No weight defined for column '{col}'")
        
        logger.info(f"Applied {self.strategy} weights to {data.shape[0]} samples")
        return weighted_data
    
    def get_top_weighted_features(self, n: int = 5) -> List[tuple]:
        """
        Get top N features by weight
        
        Args:
            n: Number of top features to return
        
        Returns:
            List of (feature_name, weight) tuples
        """
        sorted_weights = sorted(self.weights.items(), key=lambda x: x[1], reverse=True)
        return sorted_weights[:n]
    
    def __repr__(self):
        return f"FeatureWeights(strategy='{self.strategy}', n_features={len(self.weights)})"
