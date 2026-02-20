"""
Complete training pipeline with visualization and evaluation
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from models.train import train_model
from utils.logger import logger
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

def run_complete_training_pipeline(
    visualize: bool = True,
    save_plots: bool = True
):
    """
    Run the complete training pipeline with optional visualization
    
    Args:
        visualize: Whether to create visualizations
        save_plots: Whether to save plots to disk
    """
    logger.info("🚀 Starting complete training pipeline...")
    
    # Train the model
    model = train_model(
        data_source='csv',
        normalization_method='standard',
        feature_weight_strategy='default',
        remove_outliers=True,
        save_model=True
    )
    
    # Visualizations (if requested)
    if visualize:
        try:
            logger.info("\n📊 Creating visualizations...")
            create_training_visualizations(model, save_plots)
        except Exception as e:
            logger.warning(f"Could not create visualizations: {e}")
    
    logger.info("\n✅ Pipeline completed successfully!")
    return model

def create_training_visualizations(model, save_plots: bool = True):
    """
    Create visualizations of training results
    
    Args:
        model: Trained model
        save_plots: Whether to save plots
    """
    from pathlib import Path
    
    # Create output directory
    output_dir = Path(__file__).resolve().parent.parent / "visualizations"
    output_dir.mkdir(exist_ok=True)
    
    # 1. Cluster size distribution
    fig, ax = plt.subplots(figsize=(10, 6))
    
    summary = model.get_model_summary()
    cluster_sizes = summary['cluster_sizes']
    cluster_ids = list(range(len(cluster_sizes)))
    
    ax.bar(cluster_ids, cluster_sizes, color='steelblue', alpha=0.7)
    ax.set_xlabel('Cluster ID', fontsize=12)
    ax.set_ylabel('Number of Samples', fontsize=12)
    ax.set_title('Cluster Size Distribution', fontsize=14, fontweight='bold')
    ax.grid(axis='y', alpha=0.3)
    
    if save_plots:
        plt.savefig(output_dir / 'cluster_sizes.png', dpi=300, bbox_inches='tight')
        logger.info(f"  Saved: cluster_sizes.png")
    
    # 2. Cluster feature profiles (heatmap)
    if model.cluster_profiles_:
        fig, ax = plt.subplots(figsize=(12, 8))
        
        # Build feature matrix
        feature_data = []
        cluster_ids = sorted(model.cluster_profiles_.keys())
        
        for cluster_id in cluster_ids:
            profile = model.cluster_profiles_[cluster_id]
            feature_data.append(profile['mean_values'])
        
        feature_matrix = np.array(feature_data)
        
        # Create heatmap
        sns.heatmap(
            feature_matrix,
            xticklabels=model.feature_names_,
            yticklabels=[f"Cluster {i}" for i in cluster_ids],
            cmap='YlOrRd',
            annot=True,
            fmt='.2f',
            cbar_kws={'label': 'Mean Feature Value'},
            ax=ax
        )
        
        ax.set_title('Cluster Feature Profiles (Mean Values)', fontsize=14, fontweight='bold')
        plt.xticks(rotation=45, ha='right')
        
        if save_plots:
            plt.savefig(output_dir / 'cluster_profiles.png', dpi=300, bbox_inches='tight')
            logger.info(f"  Saved: cluster_profiles.png")
    
    # 3. Training metrics over time (if available)
    if len(model.training_history_) > 0:
        fig, axes = plt.subplots(1, 3, figsize=(15, 4))
        
        history = model.training_history_
        metrics_to_plot = [
            ('silhouette_score', 'Silhouette Score', 'higher is better'),
            ('davies_bouldin_index', 'Davies-Bouldin Index', 'lower is better'),
            ('calinski_harabasz_score', 'Calinski-Harabasz Score', 'higher is better')
        ]
        
        for idx, (metric_name, title, note) in enumerate(metrics_to_plot):
            values = [h['metrics'][metric_name] for h in history]
            timestamps = list(range(1, len(values) + 1))
            
            axes[idx].plot(timestamps, values, marker='o', linewidth=2, markersize=8)
            axes[idx].set_xlabel('Training Iteration', fontsize=10)
            axes[idx].set_ylabel(title, fontsize=10)
            axes[idx].set_title(f'{title}\n({note})', fontsize=11, fontweight='bold')
            axes[idx].grid(alpha=0.3)
        
        plt.tight_layout()
        
        if save_plots:
            plt.savefig(output_dir / 'training_metrics.png', dpi=300, bbox_inches='tight')
            logger.info(f"  Saved: training_metrics.png")
    
    logger.info(f"📁 Visualizations saved to: {output_dir}")
    
    if not save_plots:
        plt.show()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Run complete training pipeline')
    parser.add_argument('--no-viz', action='store_true',
                       help='Skip visualization generation')
    parser.add_argument('--show-plots', action='store_true',
                       help='Show plots instead of saving')
    
    args = parser.parse_args()
    
    run_complete_training_pipeline(
        visualize=not args.no_viz,
        save_plots=not args.show_plots
    )
