"""
Hierarchical Clustering Model for Thinking Style Classification

This model uses unsupervised hierarchical clustering to automatically
identify thinking style patterns and assign users to career-suitable clusters.
"""
import numpy as np
import pandas as pd
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score, davies_bouldin_score, calinski_harabasz_score
from scipy.cluster.hierarchy import dendrogram, linkage
from typing import Dict, Optional, Tuple
import joblib
from pathlib import Path
import json
from datetime import datetime

from utils.logger import logger
from utils.config import CLUSTERING_CONFIG, THINKING_STYLES, TRAIT_COLUMNS

def convert_numpy(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj

class HierarchicalThinkingStyleModel:
    """
    Unsupervised hierarchical clustering model for thinking style classification
    with self-learning capabilities through continuous data accumulation
    """
    
    def __init__(self, 
                 n_clusters: int = 8,
                 linkage_method: str = 'ward',
                 distance_threshold: Optional[float] = None,
                 affinity: str = 'euclidean'):
        """
        Initialize the clustering model
        
        Args:
            n_clusters: Number of thinking style clusters (default: 8)
            linkage_method: Hierarchical clustering linkage ('ward', 'complete', 'average', 'single')
            distance_threshold: Distance threshold for automatic cluster determination
            affinity: Distance metric ('euclidean', 'manhattan', 'cosine')
        """
        self.n_clusters = n_clusters if distance_threshold is None else None
        self.linkage_method = linkage_method
        self.distance_threshold = distance_threshold
        self.affinity = affinity
        
        # Initialize model
        self.model = AgglomerativeClustering(
            n_clusters=self.n_clusters,
            linkage=self.linkage_method,
            distance_threshold=self.distance_threshold,
            metric=self.affinity
        )
        
        # Model state
        self.is_fitted = False
        self.cluster_centers_ = None
        self.cluster_profiles_ = None
        self.feature_names_ = None
        self.n_samples_seen_ = 0
        self.training_history_ = []
        
        logger.info(f"Initialized hierarchical clustering model with {n_clusters or 'auto'} clusters")
    
    def fit(self, X: np.ndarray, feature_names: list = None) -> 'HierarchicalThinkingStyleModel':
        """
        Fit the clustering model to training data
        
        Args:
            X: Training feature matrix (n_samples, n_features)
            feature_names: Optional list of feature names
        
        Returns:
            Self for method chaining
        """
        logger.info(f"Fitting model on {X.shape[0]} samples with {X.shape[1]} features")
        
        # Store feature names
        self.feature_names_ = feature_names or [f"feature_{i}" for i in range(X.shape[1])]
        
        # Fit the model
        self.model.fit(X)
        
        # Calculate cluster centers
        labels = self.model.labels_
        self.cluster_centers_ = self._calculate_cluster_centers(X, labels)
        
        # Generate cluster profiles
        self.cluster_profiles_ = self._generate_cluster_profiles(X, labels)
        
        # Update model state
        self.is_fitted = True
        self.n_samples_seen_ += X.shape[0]
        
        # Calculate quality metrics
        metrics = self._calculate_clustering_metrics(X, labels)
        
        # Record training history
        self.training_history_.append({
            'timestamp': datetime.now().isoformat(),
            'n_samples': X.shape[0],
            'n_clusters': len(np.unique(labels)),
            'metrics': metrics
        })
        
        logger.info(f"✅ Model fitted successfully with {len(np.unique(labels))} clusters")
        logger.info(f"   Silhouette Score: {metrics['silhouette_score']:.4f}")
        logger.info(f"   Davies-Bouldin Index: {metrics['davies_bouldin_index']:.4f}")
        logger.info(f"   Calinski-Harabasz Score: {metrics['calinski_harabasz_score']:.2f}")
        
        return self
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict cluster labels for new data
        
        Note: Hierarchical clustering doesn't have a predict method by default.
        We assign samples to the nearest cluster center.
        
        Args:
            X: Feature matrix (n_samples, n_features)
        
        Returns:
            Predicted cluster labels
        """
        if not self.is_fitted:
            raise RuntimeError("Model not fitted. Call fit() first.")
        
        # Calculate distances to all cluster centers
        distances = np.zeros((X.shape[0], len(self.cluster_centers_)))
        for i, center in enumerate(self.cluster_centers_):
            distances[:, i] = np.linalg.norm(X - center, axis=1)
        
        # Assign to nearest cluster
        labels = np.argmin(distances, axis=1)
        
        logger.info(f"Predicted labels for {X.shape[0]} samples")
        return labels
    
    def fit_predict(self, X: np.ndarray, feature_names: list = None) -> np.ndarray:
        """
        Fit model and predict labels in one step
        
        Args:
            X: Feature matrix
            feature_names: Optional feature names
        
        Returns:
            Cluster labels
        """
        self.fit(X, feature_names)
        return self.model.labels_
    
    def _calculate_cluster_centers(self, X: np.ndarray, labels: np.ndarray) -> np.ndarray:
        """Calculate centroid for each cluster"""
        n_clusters = len(np.unique(labels))
        centers = np.zeros((n_clusters, X.shape[1]))
        
        for i in range(n_clusters):
            cluster_samples = X[labels == i]
            if len(cluster_samples) > 0:
                centers[i] = cluster_samples.mean(axis=0)
        
        logger.info(f"Calculated {n_clusters} cluster centers")
        return centers
    
    def _generate_cluster_profiles(self, X: np.ndarray, labels: np.ndarray) -> Dict:
        """
        Generate detailed profiles for each cluster
        
        Returns:
            Dictionary with cluster statistics and characteristics
        """
        n_clusters = len(np.unique(labels))
        profiles = {}
        
        for i in range(n_clusters):
            cluster_samples = X[labels == i]
            
            if len(cluster_samples) == 0:
                continue
            
            # Calculate statistics
            profile = {
                'cluster_id': i,
                'size': len(cluster_samples),
                'percentage': len(cluster_samples) / len(X) * 100,
                'mean_values': cluster_samples.mean(axis=0).tolist(),
                'std_values': cluster_samples.std(axis=0).tolist(),
                'min_values': cluster_samples.min(axis=0).tolist(),
                'max_values': cluster_samples.max(axis=0).tolist(),
            }
            
            # Add feature-specific insights
            if self.feature_names_:
                profile['feature_means'] = {
                    self.feature_names_[j]: float(cluster_samples.mean(axis=0)[j])
                    for j in range(len(self.feature_names_))
                }
                
                # Identify dominant features (top 3)
                feature_means = cluster_samples.mean(axis=0)
                top_features_idx = np.argsort(feature_means)[-3:][::-1]
                profile['dominant_features'] = [
                    self.feature_names_[idx] for idx in top_features_idx
                ]
            
            profiles[i] = profile
        
        logger.info(f"Generated profiles for {n_clusters} clusters")
        return profiles
    
    def _calculate_clustering_metrics(self, X: np.ndarray, labels: np.ndarray) -> Dict:
        """
        Calculate quality metrics for clustering
        
        Returns:
            Dictionary with various clustering quality metrics
        """
        n_clusters = len(np.unique(labels))
        
        metrics = {}
        
        # Silhouette Score (higher is better, range [-1, 1])
        if n_clusters > 1 and n_clusters < len(X):
            metrics['silhouette_score'] = silhouette_score(X, labels)
        else:
            metrics['silhouette_score'] = 0.0
        
        # Davies-Bouldin Index (lower is better)
        if n_clusters > 1:
            metrics['davies_bouldin_index'] = davies_bouldin_score(X, labels)
        else:
            metrics['davies_bouldin_index'] = 0.0
        
        # Calinski-Harabasz Score (higher is better)
        if n_clusters > 1:
            metrics['calinski_harabasz_score'] = calinski_harabasz_score(X, labels)
        else:
            metrics['calinski_harabasz_score'] = 0.0
        
        # Cluster size statistics
        cluster_sizes = [np.sum(labels == i) for i in range(n_clusters)]
        metrics['cluster_sizes'] = cluster_sizes
        metrics['min_cluster_size'] = min(cluster_sizes)
        metrics['max_cluster_size'] = max(cluster_sizes)
        metrics['avg_cluster_size'] = np.mean(cluster_sizes)
        metrics['cluster_size_std'] = np.std(cluster_sizes)
        
        return metrics
    
    def update(self, X_new: np.ndarray) -> 'HierarchicalThinkingStyleModel':
        """
        Self-learning: Update model with new data
        
        This method enables continuous learning by retraining on accumulated data
        
        Args:
            X_new: New training samples
        
        Returns:
            Self for method chaining
        """
        logger.info(f"Updating model with {X_new.shape[0]} new samples")
        
        # For hierarchical clustering, we need to retrain with all data
        # In production, you might want to keep a running dataset or use incremental methods
        
        if not self.is_fitted:
            logger.warning("Model not fitted yet. Calling fit() instead.")
            return self.fit(X_new)
        
        # This is a simplified update - in production, accumulate all training data
        logger.info("Re-fitting model with new data (simplified approach)")
        self.fit(X_new, self.feature_names_)
        
        return self
    
    def get_thinking_style(self, cluster_id: int) -> Dict:
        """
        Get thinking style information for a cluster
        
        Args:
            cluster_id: Cluster identifier
        
        Returns:
            Dictionary with thinking style information
        """
        if cluster_id in THINKING_STYLES:
            style = THINKING_STYLES[cluster_id].copy()
        else:
            # Generate generic style info
            style = {
                'name': f'Thinking Style {cluster_id}',
                'description': 'Unique combination of traits',
                'top_careers': [],
                'moderate_careers': [],
                'least_careers': []
            }
        
        # Add cluster profile if available
        if self.cluster_profiles_ and cluster_id in self.cluster_profiles_:
            style['cluster_profile'] = self.cluster_profiles_[cluster_id]
        
        return style
    
    def get_career_recommendations(self, X: np.ndarray) -> Dict:
        """
        Get career recommendations for a user's trait profile
        
        Args:
            X: User's feature vector (1, n_features)
        
        Returns:
            Dictionary with career recommendations
        """
        if not self.is_fitted:
            raise RuntimeError("Model not fitted. Call fit() first.")
        
        # Predict cluster
        cluster_id = self.predict(X)[0]
        
        # Get thinking style
        thinking_style = self.get_thinking_style(cluster_id)
        
        # Calculate confidence (distance to cluster center)
        center = self.cluster_centers_[cluster_id]
        distance = np.linalg.norm(X[0] - center)
        max_distance = np.sqrt(X.shape[1])  # Maximum possible distance
        confidence = max(0, 1 - (distance / max_distance))
        
        return {
            'cluster_id': int(cluster_id),
            'thinking_style': thinking_style['name'],
            'description': thinking_style['description'],
            'confidence': float(confidence),
            'top_careers': thinking_style.get('top_careers', []),
            'moderate_careers': thinking_style.get('moderate_careers', []),
            'least_careers': thinking_style.get('least_careers', []),
            'dominant_traits': self.cluster_profiles_[cluster_id]['dominant_features'] 
                              if cluster_id in self.cluster_profiles_ else []
        }
    
    def save(self, model_path: Path, metadata_path: Path):
        """
        Save the trained model and metadata
        
        Args:
            model_path: Path to save the model
            metadata_path: Path to save metadata
        """
        if not self.is_fitted:
            raise RuntimeError("Cannot save unfitted model")
        
        # Save model
        model_data = {
            'model': self.model,
            'cluster_centers': self.cluster_centers_,
            'cluster_profiles': self.cluster_profiles_,
            'feature_names': self.feature_names_,
        }
        joblib.dump(model_data, model_path)
        
        # Save metadata
        metadata = {
            'n_clusters': self.n_clusters or len(np.unique(self.model.labels_)),
            'linkage_method': self.linkage_method,
            'distance_threshold': self.distance_threshold,
            'affinity': self.affinity,
            'n_samples_seen': self.n_samples_seen_,
            'training_history': self.training_history_,
            'created_at': datetime.now().isoformat(),
            'model_version': '1.0.0'
        }
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2, default=convert_numpy)
        
        logger.info(f"✅ Model saved to {model_path}")
        logger.info(f"✅ Metadata saved to {metadata_path}")
    
    @classmethod
    def load(cls, model_path: Path, metadata_path: Path) -> 'HierarchicalThinkingStyleModel':
        """
        Load a saved model
        
        Args:
            model_path: Path to saved model
            metadata_path: Path to metadata
        
        Returns:
            Loaded model instance
        """
        # Load metadata
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        # Create instance
        instance = cls(
            n_clusters=metadata['n_clusters'],
            linkage_method=metadata['linkage_method'],
            distance_threshold=metadata.get('distance_threshold'),
            affinity=metadata.get('affinity', 'euclidean')
        )
        
        # Load model data
        model_data = joblib.load(model_path)
        instance.model = model_data['model']
        instance.cluster_centers_ = model_data['cluster_centers']
        instance.cluster_profiles_ = model_data['cluster_profiles']
        instance.feature_names_ = model_data['feature_names']
        instance.is_fitted = True
        instance.n_samples_seen_ = metadata['n_samples_seen']
        instance.training_history_ = metadata['training_history']
        
        logger.info(f"✅ Model loaded from {model_path}")
        logger.info(f"   Model trained on {instance.n_samples_seen_} samples")
        
        return instance
    
    def get_model_summary(self) -> Dict:
        """
        Get a summary of the model
        
        Returns:
            Dictionary with model information
        """
        if not self.is_fitted:
            return {'status': 'Not fitted'}
        
        return {
            'status': 'Fitted',
            'n_clusters': len(np.unique(self.model.labels_)),
            'n_samples_seen': self.n_samples_seen_,
            'feature_names': self.feature_names_,
            'linkage_method': self.linkage_method,
            'last_training': self.training_history_[-1] if self.training_history_ else None,
            'cluster_sizes': [self.cluster_profiles_[i]['size'] 
                            for i in sorted(self.cluster_profiles_.keys())]
        }
