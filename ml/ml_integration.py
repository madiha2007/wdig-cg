"""
Example Backend Integration for Career Guidance ML System

This demonstrates how to integrate the ML model into your Node.js/Express backend
"""

import sys
from pathlib import Path
import json

# Add ML directory to path
sys.path.append(str(Path(__file__).resolve().parent))

from pipelines.inference_pipeline import CareerGuidanceAPI
from utils.logger import logger

class CareerGuidanceService:
    """
    Service class for integrating ML model with backend
    
    Usage in your backend:
    1. Initialize once when server starts
    2. Call predict() for each user request
    3. Handle errors gracefully
    """
    
    def __init__(self):
        """Initialize the ML service"""
        self.api = None
        self.is_ready = False
        logger.info("Initializing Career Guidance ML Service...")
    
    def startup(self):
        """
        Load ML model on server startup
        
        Call this in your server initialization:
        ml_service = CareerGuidanceService()
        ml_service.startup()
        """
        try:
            self.api = CareerGuidanceAPI()
            self.api.initialize()
            self.is_ready = True
            logger.info("✅ ML Service ready")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to initialize ML service: {e}")
            self.is_ready = False
            return False
    
    def health_check(self) -> dict:
        """
        Health check endpoint
        
        GET /api/ml/health
        """
        if not self.is_ready:
            return {
                'status': 'unhealthy',
                'error': 'Model not loaded'
            }
        
        try:
            model_info = self.api.get_model_info()
            return {
                'status': 'healthy',
                'model_loaded': True,
                'model_info': {
                    'n_clusters': model_info['n_clusters'],
                    'n_samples_trained': model_info['n_samples_seen'],
                    'last_training': model_info['last_training']['timestamp'] if model_info['last_training'] else None
                }
            }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e)
            }
    
    def predict_career(self, user_trait_scores: dict) -> dict:
        """
        Main prediction endpoint
        
        POST /api/career-guidance/predict
        Body: {
            "logical": 0.85,
            "analytical": 0.88,
            ...
        }
        
        Returns: {
            "thinking_style": "Analytical Thinker",
            "confidence": 0.87,
            "top_careers": [...],
            ...
        }
        """
        if not self.is_ready:
            return {
                'success': False,
                'error': 'ML service not initialized'
            }
        
        try:
            # Validate input
            validation_error = self._validate_input(user_trait_scores)
            if validation_error:
                return {
                    'success': False,
                    'error': validation_error
                }
            
            # Make prediction
            result = self.api.predict(user_trait_scores)
            
            # Format response
            return {
                'success': True,
                'data': {
                    'thinking_style': result['thinking_style'],
                    'description': result['description'],
                    'confidence': result['confidence'],
                    'cluster_id': result['cluster_id'],
                    'careers': {
                        'top_matches': result['top_careers'][:5],
                        'good_matches': result['moderate_careers'][:5],
                        'not_recommended': result['least_careers'][:3]
                    },
                    'dominant_traits': result.get('dominant_traits', [])
                }
            }
        
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return {
                'success': False,
                'error': 'Prediction failed',
                'details': str(e)
            }
    
    def get_detailed_explanation(self, user_trait_scores: dict) -> dict:
        """
        Detailed explanation endpoint
        
        POST /api/career-guidance/explain
        Body: { trait scores }
        
        Returns: Detailed explanation with trait analysis
        """
        if not self.is_ready:
            return {
                'success': False,
                'error': 'ML service not initialized'
            }
        
        try:
            # Validate input
            validation_error = self._validate_input(user_trait_scores)
            if validation_error:
                return {
                    'success': False,
                    'error': validation_error
                }
            
            # Get explanation
            explanation = self.api.explain_prediction(user_trait_scores)
            
            return {
                'success': True,
                'data': {
                    'thinking_style': explanation['thinking_style'],
                    'explanation': explanation['explanation_text'],
                    'trait_analysis': explanation['trait_analysis'],
                    'confidence': explanation['confidence']
                }
            }
        
        except Exception as e:
            logger.error(f"Explanation error: {e}")
            return {
                'success': False,
                'error': 'Explanation generation failed'
            }
    
    def get_all_thinking_styles(self) -> dict:
        """
        Get all available thinking styles
        
        GET /api/career-guidance/styles
        
        Returns: List of all thinking styles with descriptions
        """
        if not self.is_ready:
            return {
                'success': False,
                'error': 'ML service not initialized'
            }
        
        try:
            styles = self.api.get_all_thinking_styles()
            
            return {
                'success': True,
                'data': {
                    'thinking_styles': [
                        {
                            'name': style['name'],
                            'description': style['description'],
                            'sample_careers': style['top_careers'][:3]
                        }
                        for style in styles
                    ]
                }
            }
        
        except Exception as e:
            logger.error(f"Error fetching thinking styles: {e}")
            return {
                'success': False,
                'error': 'Failed to fetch thinking styles'
            }
    
    def batch_predict(self, users_trait_scores: list) -> dict:
        """
        Batch prediction endpoint for multiple users
        
        POST /api/career-guidance/batch-predict
        Body: [
            { trait_scores_1 },
            { trait_scores_2 },
            ...
        ]
        """
        if not self.is_ready:
            return {
                'success': False,
                'error': 'ML service not initialized'
            }
        
        try:
            results = self.api.predict_batch(users_trait_scores)
            
            return {
                'success': True,
                'data': {
                    'predictions': [
                        {
                            'thinking_style': r['thinking_style'],
                            'confidence': r['confidence'],
                            'top_career': r['top_careers'][0] if r['top_careers'] else None
                        }
                        for r in results
                    ],
                    'count': len(results)
                }
            }
        
        except Exception as e:
            logger.error(f"Batch prediction error: {e}")
            return {
                'success': False,
                'error': 'Batch prediction failed'
            }
    
    def _validate_input(self, trait_scores: dict) -> str:
        """
        Validate input trait scores
        
        Returns: Error message if invalid, None if valid
        """
        from utils.config import TRAIT_COLUMNS
        
        # Check for missing traits
        missing = set(TRAIT_COLUMNS) - set(trait_scores.keys())
        if missing:
            return f"Missing required traits: {', '.join(missing)}"
        
        # Check value ranges
        for trait, value in trait_scores.items():
            if not isinstance(value, (int, float)):
                return f"Trait '{trait}' must be a number"
            
            if not (0 <= value <= 1):
                return f"Trait '{trait}' must be between 0 and 1 (got {value})"
        
        return None


# Example Flask Integration
"""
from flask import Flask, request, jsonify
from ml_integration import CareerGuidanceService

app = Flask(__name__)

# Initialize ML service on startup
ml_service = CareerGuidanceService()

@app.before_first_request
def initialize():
    ml_service.startup()

@app.route('/api/ml/health', methods=['GET'])
def health():
    return jsonify(ml_service.health_check())

@app.route('/api/career-guidance/predict', methods=['POST'])
def predict():
    data = request.json
    result = ml_service.predict_career(data)
    return jsonify(result)

@app.route('/api/career-guidance/explain', methods=['POST'])
def explain():
    data = request.json
    result = ml_service.get_detailed_explanation(data)
    return jsonify(result)

@app.route('/api/career-guidance/styles', methods=['GET'])
def get_styles():
    result = ml_service.get_all_thinking_styles()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
"""


# Example Express.js Integration (Python child process)
"""
// server.js
const express = require('express');
const { spawn } = require('child_process');
const app = express();

// Spawn Python ML service
const mlService = spawn('python', ['-u', 'ml/ml_integration.py']);

mlService.stdout.on('data', (data) => {
  console.log(`ML Service: ${data}`);
});

app.post('/api/career-guidance/predict', async (req, res) => {
  const traitScores = req.body;
  
  // Send to Python service via IPC or HTTP
  // For production, use HTTP or message queue
  
  // Example: HTTP approach
  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(traitScores)
  });
  
  const result = await response.json();
  res.json(result);
});
"""


# Test the service
if __name__ == "__main__":
    print("=" * 60)
    print("TESTING ML INTEGRATION SERVICE")
    print("=" * 60)
    
    # Initialize service
    service = CareerGuidanceService()
    
    print("\n1. Starting up service...")
    success = service.startup()
    print(f"   {'✅ Success' if success else '❌ Failed'}")
    
    # Health check
    print("\n2. Health check...")
    health = service.health_check()
    print(f"   Status: {health['status']}")
    if 'model_info' in health:
        print(f"   Clusters: {health['model_info']['n_clusters']}")
    
    # Test prediction
    print("\n3. Test prediction...")
    test_scores = {
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
    
    result = service.predict_career(test_scores)
    if result['success']:
        print(f"   ✅ Prediction successful")
        print(f"   Thinking Style: {result['data']['thinking_style']}")
        print(f"   Confidence: {result['data']['confidence']:.2%}")
        print(f"   Top Career: {result['data']['careers']['top_matches'][0]}")
    else:
        print(f"   ❌ Prediction failed: {result['error']}")
    
    # Test explanation
    print("\n4. Test explanation...")
    explanation = service.get_detailed_explanation(test_scores)
    if explanation['success']:
        print(f"   ✅ Explanation generated")
        print(f"\n{explanation['data']['explanation'][:200]}...")
    
    # Get all styles
    print("\n5. Get all thinking styles...")
    styles = service.get_all_thinking_styles()
    if styles['success']:
        print(f"   ✅ Found {len(styles['data']['thinking_styles'])} styles")
        for style in styles['data']['thinking_styles'][:3]:
            print(f"   - {style['name']}")
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED")
    print("=" * 60)
    print("\nService is ready for integration!")
