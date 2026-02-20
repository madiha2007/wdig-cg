"""
Inference script for predicting thinking styles and career recommendations
"""
import numpy as np
import pandas as pd
from pathlib import Path
import sys
import json

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from models.cluster_model import HierarchicalThinkingStyleModel
from features.normalizer import FeatureNormalizer
from features.weights import FeatureWeights
from utils.config import (
    TRAIT_COLUMNS, MODEL_PATH, SCALER_PATH, 
    MODEL_METADATA_PATH
)
from utils.logger import logger

class ThinkingStylePredictor:
    """
    Predictor for thinking styles and career recommendations
    """
    
    def __init__(self, 
                 model_path: Path = MODEL_PATH,
                 scaler_path: Path = SCALER_PATH,
                 metadata_path: Path = MODEL_METADATA_PATH):
        """
        Initialize predictor
        
        Args:
            model_path: Path to saved model
            scaler_path: Path to saved scaler
            metadata_path: Path to model metadata
        """
        self.model_path = model_path
        self.scaler_path = scaler_path
        self.metadata_path = metadata_path
        
        self.model = None
        self.normalizer = None
        self.is_loaded = False
    
    def load(self):
        """Load model and preprocessing artifacts"""
        try:
            logger.info("Loading model and preprocessing artifacts...")
            
            # Load model
            self.model = HierarchicalThinkingStyleModel.load(
                self.model_path, 
                self.metadata_path
            )
            
            # Load scaler
            self.normalizer = FeatureNormalizer.load(self.scaler_path)
            
            self.is_loaded = True
            logger.info("✅ Model loaded successfully")
            
        except FileNotFoundError as e:
            logger.error(f"Model files not found: {e}")
            logger.error("Please train the model first using train.py")
            raise
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def predict_thinking_style(self, 
                              trait_scores: dict,
                              include_details: bool = True) -> dict:
        """
        Predict thinking style and career recommendations
        
        Args:
            trait_scores: Dictionary of trait scores (e.g., {'logical': 0.8, 'creativity': 0.6, ...})
            include_details: Whether to include detailed cluster information
        
        Returns:
            Dictionary with predictions and recommendations
        """
        if not self.is_loaded:
            self.load()
        
        # Validate input
        missing_traits = set(TRAIT_COLUMNS) - set(trait_scores.keys())
        if missing_traits:
            raise ValueError(f"Missing trait scores: {missing_traits}")
        
        # Prepare feature vector
        X = np.array([[trait_scores[trait] for trait in TRAIT_COLUMNS]])
        
        # Apply same preprocessing as training
        # Note: In production, you'd want to store and apply the same weights used in training
        weight_manager = FeatureWeights(strategy='default')
        X_weighted = weight_manager.apply_weights(X, TRAIT_COLUMNS)
        X_normalized = self.normalizer.transform(X_weighted)
        
        # Get career recommendations
        recommendations = self.model.get_career_recommendations(X_normalized)
        
        # Add trait scores to response
        recommendations['trait_scores'] = trait_scores
        
        # Add detailed cluster info if requested
        if include_details and 'cluster_id' in recommendations:
            cluster_id = recommendations['cluster_id']
            if cluster_id in self.model.cluster_profiles_:
                recommendations['cluster_details'] = self.model.cluster_profiles_[cluster_id]
        
        return recommendations
    
    def predict_batch(self, 
                     trait_scores_list: list,
                     include_details: bool = False) -> list:
        """
        Predict for multiple users
        
        Args:
            trait_scores_list: List of trait score dictionaries
            include_details: Whether to include detailed information
        
        Returns:
            List of prediction dictionaries
        """
        if not self.is_loaded:
            self.load()
        
        results = []
        for i, trait_scores in enumerate(trait_scores_list):
            try:
                prediction = self.predict_thinking_style(
                    trait_scores,
                    include_details=include_details
                )
                results.append(prediction)
            except Exception as e:
                logger.error(f"Error predicting for sample {i}: {e}")
                results.append({'error': str(e)})
        
        return results
    
    def predict_from_dataframe(self, 
                              df: pd.DataFrame,
                              include_details: bool = False) -> pd.DataFrame:
        """
        Predict for a DataFrame of trait scores
        
        Args:
            df: DataFrame with trait columns
            include_details: Whether to include detailed information
        
        Returns:
            DataFrame with predictions
        """
        if not self.is_loaded:
            self.load()
        
        # Validate columns
        missing_cols = set(TRAIT_COLUMNS) - set(df.columns)
        if missing_cols:
            raise ValueError(f"Missing columns: {missing_cols}")
        
        results = []
        for _, row in df.iterrows():
            trait_scores = row[TRAIT_COLUMNS].to_dict()
            prediction = self.predict_thinking_style(
                trait_scores,
                include_details=include_details
            )
            results.append(prediction)
        
        # Convert to DataFrame
        results_df = pd.DataFrame(results)
        
        return results_df
    
    def get_model_info(self) -> dict:
        """
        Get information about the loaded model
        
        Returns:
            Dictionary with model information
        """
        if not self.is_loaded:
            self.load()
        
        return self.model.get_model_summary()

def predict_for_user(trait_scores: dict, output_format: str = 'json') -> str:
    """
    Standalone prediction function
    
    Args:
        trait_scores: Dictionary of trait scores
        output_format: Output format ('json' or 'text')
    
    Returns:
        Formatted prediction results
    """
    predictor = ThinkingStylePredictor()
    predictor.load()
    
    result = predictor.predict_thinking_style(trait_scores, include_details=True)
    
    if output_format == 'json':
        return json.dumps(result, indent=2)
    else:
        # Text format
        output = []
        output.append("=" * 60)
        output.append("THINKING STYLE & CAREER RECOMMENDATIONS")
        output.append("=" * 60)
        output.append(f"\nThinking Style: {result['thinking_style']}")
        output.append(f"Description: {result['description']}")
        output.append(f"Confidence: {result['confidence']:.2%}")
        
        output.append(f"\nDominant Traits: {', '.join(result.get('dominant_traits', []))}")
        
        output.append("\n--- TOP CAREER MATCHES ---")
        for i, career in enumerate(result.get('top_careers', []), 1):
            output.append(f"{i}. {career}")
        
        output.append("\n--- MODERATE CAREER MATCHES ---")
        for i, career in enumerate(result.get('moderate_careers', []), 1):
            output.append(f"{i}. {career}")
        
        output.append("\n--- LEAST SUITABLE CAREERS ---")
        for i, career in enumerate(result.get('least_careers', []), 1):
            output.append(f"{i}. {career}")
        
        output.append("\n" + "=" * 60)
        
        return "\n".join(output)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Predict thinking style and career recommendations')
    parser.add_argument('--input', type=str, help='Path to JSON file with trait scores')
    parser.add_argument('--format', type=str, default='json', 
                       choices=['json', 'text'],
                       help='Output format (default: json)')
    
    # Allow individual trait scores as arguments
    for trait in TRAIT_COLUMNS:
        parser.add_argument(f'--{trait}', type=float, help=f'{trait} score (0-1)')
    
    args = parser.parse_args()
    
    # Determine input source
    if args.input:
        # Load from file
        with open(args.input, 'r') as f:
            trait_scores = json.load(f)
    else:
        # Build from command line arguments
        trait_scores = {}
        for trait in TRAIT_COLUMNS:
            value = getattr(args, trait)
            if value is not None:
                trait_scores[trait] = value
        
        if not trait_scores:
            print("Error: Please provide trait scores either via --input or individual --trait arguments")
            parser.print_help()
            sys.exit(1)
        
        # Check for missing traits
        missing = set(TRAIT_COLUMNS) - set(trait_scores.keys())
        if missing:
            print(f"Error: Missing trait scores: {missing}")
            sys.exit(1)
    
    # Make prediction
    result = predict_for_user(trait_scores, output_format=args.format)
    print(result)
