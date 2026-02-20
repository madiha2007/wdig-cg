"""
Inference pipeline for production use
"""
import sys
from pathlib import Path
from typing import Dict, List

sys.path.append(str(Path(__file__).resolve().parent.parent))

from models.infer import ThinkingStylePredictor
from utils.logger import logger
import json

class CareerGuidanceAPI:
    """
    Production-ready API for career guidance predictions
    """
    
    def __init__(self):
        """Initialize the API"""
        self.predictor = ThinkingStylePredictor()
        self._loaded = False
    
    def initialize(self):
        """Load model and prepare for inference"""
        if not self._loaded:
            logger.info("Initializing Career Guidance API...")
            self.predictor.load()
            self._loaded = True
            logger.info("✅ API ready for predictions")
    
    def predict(self, trait_scores: Dict[str, float]) -> Dict:
        """
        Make a prediction for a single user
        
        Args:
            trait_scores: Dictionary mapping trait names to scores (0-1)
        
        Returns:
            Dictionary with thinking style and career recommendations
        """
        if not self._loaded:
            self.initialize()
        
        return self.predictor.predict_thinking_style(
            trait_scores,
            include_details=True
        )
    
    def predict_batch(self, trait_scores_list: List[Dict[str, float]]) -> List[Dict]:
        """
        Make predictions for multiple users
        
        Args:
            trait_scores_list: List of trait score dictionaries
        
        Returns:
            List of prediction dictionaries
        """
        if not self._loaded:
            self.initialize()
        
        return self.predictor.predict_batch(trait_scores_list, include_details=True)
    
    def get_thinking_style_info(self, cluster_id: int) -> Dict:
        """
        Get detailed information about a thinking style
        
        Args:
            cluster_id: Cluster/thinking style ID
        
        Returns:
            Dictionary with thinking style information
        """
        if not self._loaded:
            self.initialize()
        
        return self.predictor.model.get_thinking_style(cluster_id)
    
    def get_all_thinking_styles(self) -> List[Dict]:
        """
        Get information about all thinking styles
        
        Returns:
            List of thinking style dictionaries
        """
        if not self._loaded:
            self.initialize()
        
        summary = self.predictor.model.get_model_summary()
        n_clusters = summary['n_clusters']
        
        return [
            self.get_thinking_style_info(i)
            for i in range(n_clusters)
        ]
    
    def explain_prediction(self, trait_scores: Dict[str, float]) -> Dict:
        """
        Get detailed explanation of why a user got their prediction
        
        Args:
            trait_scores: User's trait scores
        
        Returns:
            Dictionary with explanation details
        """
        if not self._loaded:
            self.initialize()
        
        # Get prediction
        prediction = self.predict(trait_scores)
        
        # Build explanation
        cluster_id = prediction['cluster_id']
        cluster_profile = self.predictor.model.cluster_profiles_[cluster_id]
        
        # Compare user scores to cluster means
        user_vs_cluster = {}
        for trait, user_score in trait_scores.items():
            if trait in self.predictor.model.feature_names_:
                idx = self.predictor.model.feature_names_.index(trait)
                cluster_mean = cluster_profile['mean_values'][idx]
                difference = user_score - cluster_mean
                
                user_vs_cluster[trait] = {
                    'user_score': user_score,
                    'cluster_mean': cluster_mean,
                    'difference': difference,
                    'alignment': 'high' if abs(difference) < 0.15 else 'moderate' if abs(difference) < 0.3 else 'low'
                }
        
        explanation = {
            **prediction,
            'trait_analysis': user_vs_cluster,
            'explanation_text': self._generate_explanation_text(prediction, user_vs_cluster)
        }
        
        return explanation
    
    def _generate_explanation_text(self, prediction: Dict, trait_analysis: Dict) -> str:
        """Generate human-readable explanation"""
        lines = []
        
        lines.append(f"You have been identified as a '{prediction['thinking_style']}' thinker.")
        lines.append(f"\n{prediction['description']}")
        
        lines.append(f"\nYour profile shows strong alignment with:")
        dominant_traits = prediction.get('dominant_traits', [])[:3]
        for trait in dominant_traits:
            if trait in trait_analysis:
                score = trait_analysis[trait]['user_score']
                lines.append(f"  • {trait.title()}: {score:.2f}/1.00")
        
        lines.append(f"\nBased on this thinking style, you would excel in careers that require:")
        # Extract key characteristics from top careers
        top_careers = prediction.get('top_careers', [])[:3]
        for career in top_careers:
            lines.append(f"  • {career}")
        
        return "\n".join(lines)
    
    def get_model_info(self) -> Dict:
        """
        Get information about the loaded model
        
        Returns:
            Dictionary with model metadata
        """
        if not self._loaded:
            self.initialize()
        
        return self.predictor.get_model_info()

# Example usage functions
def example_single_prediction():
    """Example: Single user prediction"""
    logger.info("Example: Single User Prediction")
    logger.info("=" * 60)
    
    # Initialize API
    api = CareerGuidanceAPI()
    api.initialize()
    
    # Example user trait scores
    user_scores = {
        "logical": 0.85,
        "analytical": 0.88,
        "numerical": 0.82,
        "verbal": 0.45,
        "spatial": 0.71,
        "creativity": 0.38,
        "discipline": 0.76,
        "resilience": 0.68,
        "independence": 0.73,
        "communication": 0.42,
        "leadership": 0.51,
    }
    
    # Get prediction
    result = api.predict(user_scores)
    
    # Display results
    logger.info(f"\nThinking Style: {result['thinking_style']}")
    logger.info(f"Confidence: {result['confidence']:.2%}")
    logger.info(f"\nTop Career Matches:")
    for i, career in enumerate(result['top_careers'][:5], 1):
        logger.info(f"  {i}. {career}")
    
    return result

def example_batch_prediction():
    """Example: Batch prediction for multiple users"""
    logger.info("\nExample: Batch Prediction")
    logger.info("=" * 60)
    
    # Initialize API
    api = CareerGuidanceAPI()
    api.initialize()
    
    # Multiple users
    users = [
        {  # Analytical thinker
            "logical": 0.85, "analytical": 0.88, "numerical": 0.82,
            "verbal": 0.45, "spatial": 0.71, "creativity": 0.38,
            "discipline": 0.76, "resilience": 0.68, "independence": 0.73,
            "communication": 0.42, "leadership": 0.51,
        },
        {  # Creative innovator
            "logical": 0.48, "analytical": 0.51, "numerical": 0.44,
            "verbal": 0.78, "spatial": 0.39, "creativity": 0.82,
            "discipline": 0.58, "resilience": 0.71, "independence": 0.69,
            "communication": 0.81, "leadership": 0.64,
        }
    ]
    
    # Batch prediction
    results = api.predict_batch(users)
    
    # Display results
    for i, result in enumerate(results, 1):
        logger.info(f"\nUser {i}: {result['thinking_style']}")
        logger.info(f"  Top Career: {result['top_careers'][0]}")
    
    return results

def example_explanation():
    """Example: Detailed prediction explanation"""
    logger.info("\nExample: Prediction Explanation")
    logger.info("=" * 60)
    
    # Initialize API
    api = CareerGuidanceAPI()
    api.initialize()
    
    user_scores = {
        "logical": 0.85, "analytical": 0.88, "numerical": 0.82,
        "verbal": 0.45, "spatial": 0.71, "creativity": 0.38,
        "discipline": 0.76, "resilience": 0.68, "independence": 0.73,
        "communication": 0.42, "leadership": 0.51,
    }
    
    # Get explanation
    explanation = api.explain_prediction(user_scores)
    
    # Display
    logger.info(f"\n{explanation['explanation_text']}")
    
    return explanation

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Run inference pipeline examples')
    parser.add_argument('--example', type=str, 
                       choices=['single', 'batch', 'explain', 'all'],
                       default='all',
                       help='Which example to run (default: all)')
    
    args = parser.parse_args()
    
    if args.example in ['single', 'all']:
        example_single_prediction()
    
    if args.example in ['batch', 'all']:
        example_batch_prediction()
    
    if args.example in ['explain', 'all']:
        example_explanation()
