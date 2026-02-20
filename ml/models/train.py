"""
Training script for thinking style clustering model
"""
import numpy as np
import pandas as pd
from pathlib import Path
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from models.cluster_model import HierarchicalThinkingStyleModel
from features.feature_loader import FeatureLoader
from features.normalizer import FeatureNormalizer, preprocess_features
from features.weights import FeatureWeights
from utils.config import (
    TRAIT_COLUMNS, CLUSTERING_CONFIG, MODEL_PATH, 
    SCALER_PATH, MODEL_METADATA_PATH
)
from utils.logger import logger
from utils.helpers import validate_trait_data, get_cluster_statistics

def train_model(
    data_source: str = 'csv',
    normalization_method: str = 'standard',
    feature_weight_strategy: str = 'default',
    n_clusters: int = None,
    remove_outliers: bool = False,
    save_model: bool = True
) -> HierarchicalThinkingStyleModel:
    """
    Main training pipeline
    
    Args:
        data_source: Source of training data ('csv' or 'database')
        normalization_method: Feature normalization method ('standard', 'minmax', 'robust')
        feature_weight_strategy: Feature weighting strategy ('default', 'career_focused', 'balanced')
        n_clusters: Number of clusters (None for auto-detection)
        remove_outliers: Whether to remove outliers before training
        save_model: Whether to save the trained model
    
    Returns:
        Trained model instance
    """
    logger.info("=" * 60)
    logger.info("STARTING MODEL TRAINING")
    logger.info("=" * 60)
    
    # Step 1: Load training data
    logger.info("\n[1/6] Loading training data...")
    loader = FeatureLoader()
    features_df, confidence = loader.load_training_data(source=data_source)
    
    logger.info(f"Loaded {len(features_df)} training samples")
    logger.info(f"Features: {', '.join(TRAIT_COLUMNS)}")
    
    # Step 2: Validate data
    logger.info("\n[2/6] Validating data...")
    validate_trait_data(features_df, TRAIT_COLUMNS)
    
    # Step 3: Preprocess features
    logger.info("\n[3/6] Preprocessing features...")
    processed_df, removed_indices = preprocess_features(
        features_df,
        TRAIT_COLUMNS,
        handle_missing='drop',
        remove_outliers=remove_outliers,
        outlier_threshold=3.0
    )
    
    if len(removed_indices) > 0:
        logger.info(f"Removed {len(removed_indices)} outliers/invalid samples")
    
    # Step 4: Apply feature weights and normalization
    logger.info("\n[4/6] Applying feature weights and normalization...")
    
    # Apply weights
    weight_manager = FeatureWeights(strategy=feature_weight_strategy)
    X = processed_df[TRAIT_COLUMNS].values
    X_weighted = weight_manager.apply_weights(X, TRAIT_COLUMNS)
    
    # Normalize
    normalizer = FeatureNormalizer(method=normalization_method)
    X_normalized = normalizer.fit_transform(X_weighted)
    
    logger.info(f"Applied {feature_weight_strategy} weights and {normalization_method} normalization")
    
    # Step 5: Train clustering model
    logger.info("\n[5/6] Training hierarchical clustering model...")
    
    # Use config or provided parameters
    n_clusters = n_clusters or CLUSTERING_CONFIG['n_clusters']
    
    model = HierarchicalThinkingStyleModel(
        n_clusters=n_clusters,
        linkage_method=CLUSTERING_CONFIG['method'],
        distance_threshold=CLUSTERING_CONFIG.get('distance_threshold'),
        affinity='euclidean'
    )
    
    # Fit model
    labels = model.fit_predict(X_normalized, feature_names=TRAIT_COLUMNS)
    
    # Get cluster statistics
    logger.info("\n[Cluster Statistics]")
    stats_df = get_cluster_statistics(
        pd.DataFrame(X_normalized, columns=TRAIT_COLUMNS),
        labels,
        TRAIT_COLUMNS
    )
    
    for _, row in stats_df.iterrows():
        cluster_id = int(row['cluster_id'])
        size = row['size']
        percentage = (size / len(labels)) * 100
        logger.info(f"  Cluster {cluster_id}: {size} samples ({percentage:.1f}%)")
    
    # Step 6: Save model
    if save_model:
        logger.info("\n[6/6] Saving model and artifacts...")
        
        # Save model
        model.save(MODEL_PATH, MODEL_METADATA_PATH)
        
        # Save scaler
        normalizer.save(SCALER_PATH)
        
        logger.info("✅ Model and artifacts saved successfully")
    
    # Print summary
    logger.info("\n" + "=" * 60)
    logger.info("TRAINING COMPLETED")
    logger.info("=" * 60)
    
    summary = model.get_model_summary()
    logger.info(f"\nModel Summary:")
    logger.info(f"  - Clusters: {summary['n_clusters']}")
    logger.info(f"  - Training samples: {summary['n_samples_seen']}")
    logger.info(f"  - Linkage method: {summary['linkage_method']}")
    
    if summary['last_training']:
        metrics = summary['last_training']['metrics']
        logger.info(f"\nQuality Metrics:")
        logger.info(f"  - Silhouette Score: {metrics['silhouette_score']:.4f}")
        logger.info(f"  - Davies-Bouldin Index: {metrics['davies_bouldin_index']:.4f}")
        logger.info(f"  - Calinski-Harabasz Score: {metrics['calinski_harabasz_score']:.2f}")
    
    return model

def retrain_with_new_data(new_data_path: str):
    """
    Retrain model with additional data (self-learning)
    
    Args:
        new_data_path: Path to new training data CSV
    """
    logger.info("RETRAINING MODEL WITH NEW DATA")
    
    # Load existing model
    if not MODEL_PATH.exists():
        logger.error("No existing model found. Run initial training first.")
        return
    
    model = HierarchicalThinkingStyleModel.load(MODEL_PATH, MODEL_METADATA_PATH)
    normalizer = FeatureNormalizer.load(SCALER_PATH)
    
    # Load new data
    new_df = pd.read_csv(new_data_path)
    X_new = new_df[TRAIT_COLUMNS].values
    
    # Preprocess
    X_new_normalized = normalizer.transform(X_new)
    
    # Update model
    model.update(X_new_normalized)
    
    # Save updated model
    model.save(MODEL_PATH, MODEL_METADATA_PATH)
    
    logger.info("✅ Model retrained and saved")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train thinking style clustering model')
    parser.add_argument('--source', type=str, default='csv', 
                       choices=['csv', 'database'],
                       help='Data source (default: csv)')
    parser.add_argument('--norm', type=str, default='standard',
                       choices=['standard', 'minmax', 'robust'],
                       help='Normalization method (default: standard)')
    parser.add_argument('--weights', type=str, default='default',
                       choices=['default', 'career_focused', 'balanced'],
                       help='Feature weight strategy (default: default)')
    parser.add_argument('--clusters', type=int, default=None,
                       help='Number of clusters (default: auto from config)')
    parser.add_argument('--remove-outliers', action='store_true',
                       help='Remove outliers before training')
    parser.add_argument('--no-save', action='store_true',
                       help='Do not save the model')
    
    args = parser.parse_args()
    
    # Train model
    trained_model = train_model(
        data_source=args.source,
        normalization_method=args.norm,
        feature_weight_strategy=args.weights,
        n_clusters=args.clusters,
        remove_outliers=args.remove_outliers,
        save_model=not args.no_save
    )
    
    logger.info("\n🎉 Training pipeline completed successfully!")
