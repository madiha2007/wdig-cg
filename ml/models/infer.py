# """
# Inference script for predicting thinking styles and career recommendations
# """
# import numpy as np
# import pandas as pd
# from pathlib import Path
# import sys
# import json

# # Add parent directory to path
# sys.path.append(str(Path(__file__).resolve().parent.parent))

# from models.cluster_model import HierarchicalThinkingStyleModel
# from features.normalizer import FeatureNormalizer
# from features.weights import FeatureWeights
# from utils.config import (
#     TRAIT_COLUMNS, MODEL_PATH, SCALER_PATH, 
#     MODEL_METADATA_PATH
# )
# from utils.logger import logger

# class ThinkingStylePredictor:
#     """
#     Predictor for thinking styles and career recommendations
#     """
    
#     def __init__(self, 
#                  model_path: Path = MODEL_PATH,
#                  scaler_path: Path = SCALER_PATH,
#                  metadata_path: Path = MODEL_METADATA_PATH):
#         """
#         Initialize predictor
        
#         Args:
#             model_path: Path to saved model
#             scaler_path: Path to saved scaler
#             metadata_path: Path to model metadata
#         """
#         self.model_path = model_path
#         self.scaler_path = scaler_path
#         self.metadata_path = metadata_path
        
#         self.model = None
#         self.normalizer = None
#         self.is_loaded = False
    
#     def load(self):
#         """Load model and preprocessing artifacts"""
#         try:
#             logger.info("Loading model and preprocessing artifacts...")
            
#             # Load model
#             self.model = HierarchicalThinkingStyleModel.load(
#                 self.model_path, 
#                 self.metadata_path
#             )
            
#             # Load scaler
#             self.normalizer = FeatureNormalizer.load(self.scaler_path)
            
#             self.is_loaded = True
#             logger.info("✅ Model loaded successfully")
            
#         except FileNotFoundError as e:
#             logger.error(f"Model files not found: {e}")
#             logger.error("Please train the model first using train.py")
#             raise
#         except Exception as e:
#             logger.error(f"Error loading model: {e}")
#             raise
    
#     def predict_thinking_style(self, 
#                               trait_scores: dict,
#                               include_details: bool = True) -> dict:
#         """
#         Predict thinking style and career recommendations
        
#         Args:
#             trait_scores: Dictionary of trait scores (e.g., {'logical': 0.8, 'creativity': 0.6, ...})
#             include_details: Whether to include detailed cluster information
        
#         Returns:
#             Dictionary with predictions and recommendations
#         """
#         if not self.is_loaded:
#             self.load()
        
#         # Validate input
#         missing_traits = set(TRAIT_COLUMNS) - set(trait_scores.keys())
#         if missing_traits:
#             raise ValueError(f"Missing trait scores: {missing_traits}")
        
#         # Prepare feature vector
#         X = np.array([[trait_scores[trait] for trait in TRAIT_COLUMNS]])
        
#         # Apply same preprocessing as training
#         # Note: In production, you'd want to store and apply the same weights used in training
#         weight_manager = FeatureWeights(strategy='default')
#         X_weighted = weight_manager.apply_weights(X, TRAIT_COLUMNS)
#         X_normalized = self.normalizer.transform(X_weighted)
        
#         # Get career recommendations
#         recommendations = self.model.get_career_recommendations(X_normalized)
        
#         # Add trait scores to response
#         recommendations['trait_scores'] = trait_scores
        
#         # Add detailed cluster info if requested
#         if include_details and 'cluster_id' in recommendations:
#             cluster_id = recommendations['cluster_id']
#             if cluster_id in self.model.cluster_profiles_:
#                 recommendations['cluster_details'] = self.model.cluster_profiles_[cluster_id]
        
#         return recommendations
    
#     def predict_batch(self, 
#                      trait_scores_list: list,
#                      include_details: bool = False) -> list:
#         """
#         Predict for multiple users
        
#         Args:
#             trait_scores_list: List of trait score dictionaries
#             include_details: Whether to include detailed information
        
#         Returns:
#             List of prediction dictionaries
#         """
#         if not self.is_loaded:
#             self.load()
        
#         results = []
#         for i, trait_scores in enumerate(trait_scores_list):
#             try:
#                 prediction = self.predict_thinking_style(
#                     trait_scores,
#                     include_details=include_details
#                 )
#                 results.append(prediction)
#             except Exception as e:
#                 logger.error(f"Error predicting for sample {i}: {e}")
#                 results.append({'error': str(e)})
        
#         return results
    
#     def predict_from_dataframe(self, 
#                               df: pd.DataFrame,
#                               include_details: bool = False) -> pd.DataFrame:
#         """
#         Predict for a DataFrame of trait scores
        
#         Args:
#             df: DataFrame with trait columns
#             include_details: Whether to include detailed information
        
#         Returns:
#             DataFrame with predictions
#         """
#         if not self.is_loaded:
#             self.load()
        
#         # Validate columns
#         missing_cols = set(TRAIT_COLUMNS) - set(df.columns)
#         if missing_cols:
#             raise ValueError(f"Missing columns: {missing_cols}")
        
#         results = []
#         for _, row in df.iterrows():
#             trait_scores = row[TRAIT_COLUMNS].to_dict()
#             prediction = self.predict_thinking_style(
#                 trait_scores,
#                 include_details=include_details
#             )
#             results.append(prediction)
        
#         # Convert to DataFrame
#         results_df = pd.DataFrame(results)
        
#         return results_df
    
#     def get_model_info(self) -> dict:
#         """
#         Get information about the loaded model
        
#         Returns:
#             Dictionary with model information
#         """
#         if not self.is_loaded:
#             self.load()
        
#         return self.model.get_model_summary()

# def predict_for_user(trait_scores: dict, output_format: str = 'json') -> str:
#     """
#     Standalone prediction function
    
#     Args:
#         trait_scores: Dictionary of trait scores
#         output_format: Output format ('json' or 'text')
    
#     Returns:
#         Formatted prediction results
#     """
#     predictor = ThinkingStylePredictor()
#     predictor.load()
    
#     result = predictor.predict_thinking_style(trait_scores, include_details=True)
    
#     if output_format == 'json':
#         return json.dumps(result, indent=2)
#     else:
#         # Text format
#         output = []
#         output.append("=" * 60)
#         output.append("THINKING STYLE & CAREER RECOMMENDATIONS")
#         output.append("=" * 60)
#         output.append(f"\nThinking Style: {result['thinking_style']}")
#         output.append(f"Description: {result['description']}")
#         output.append(f"Confidence: {result['confidence']:.2%}")
        
#         output.append(f"\nDominant Traits: {', '.join(result.get('dominant_traits', []))}")
        
#         output.append("\n--- TOP CAREER MATCHES ---")
#         for i, career in enumerate(result.get('top_careers', []), 1):
#             output.append(f"{i}. {career}")
        
#         output.append("\n--- MODERATE CAREER MATCHES ---")
#         for i, career in enumerate(result.get('moderate_careers', []), 1):
#             output.append(f"{i}. {career}")
        
#         output.append("\n--- LEAST SUITABLE CAREERS ---")
#         for i, career in enumerate(result.get('least_careers', []), 1):
#             output.append(f"{i}. {career}")
        
#         output.append("\n" + "=" * 60)
        
#         return "\n".join(output)

# if __name__ == "__main__":
#     import argparse
    
#     parser = argparse.ArgumentParser(description='Predict thinking style and career recommendations')
#     parser.add_argument('--input', type=str, help='Path to JSON file with trait scores')
#     parser.add_argument('--format', type=str, default='json', 
#                        choices=['json', 'text'],
#                        help='Output format (default: json)')
    
#     # Allow individual trait scores as arguments
#     for trait in TRAIT_COLUMNS:
#         parser.add_argument(f'--{trait}', type=float, help=f'{trait} score (0-1)')
    
#     args = parser.parse_args()
    
#     # Determine input source
#     if args.input:
#         # Load from file
#         with open(args.input, 'r') as f:
#             trait_scores = json.load(f)
#     else:
#         # Build from command line arguments
#         trait_scores = {}
#         for trait in TRAIT_COLUMNS:
#             value = getattr(args, trait)
#             if value is not None:
#                 trait_scores[trait] = value
        
#         if not trait_scores:
#             print("Error: Please provide trait scores either via --input or individual --trait arguments")
#             parser.print_help()
#             sys.exit(1)
        
#         # Check for missing traits
#         missing = set(TRAIT_COLUMNS) - set(trait_scores.keys())
#         if missing:
#             print(f"Error: Missing trait scores: {missing}")
#             sys.exit(1)
    
#     # Make prediction
#     result = predict_for_user(trait_scores, output_format=args.format)
#     print(result)



# ml/models/infer.py
# ============================================================
# Thinking style derivation + suppression detection engine.
# Rule-based — NOT clustering — so every profile is unique.
# ============================================================


# ── THINKING STYLES ──────────────────────────────────────────
# Each style has a condition function that takes normalized traits (0-1)
# and returns True if this style applies.

THINKING_STYLES = [
    {
        "id": "analytical_innovator",
        "label": "Analytical Innovator",
        "description": "You think in systems and patterns, and you love building new ones. You don't just solve problems — you redesign them.",
        "condition": lambda t: t.get("analytical", 0) > 0.5 and t.get("innovation_drive", 0) > 0.4 and t.get("logical", 0) > 0.4,
        "key_traits": ["analytical", "innovation_drive", "logical"],
    },
    {
        "id": "empathetic_builder",
        "label": "Empathetic Builder",
        "description": "You understand people deeply and use that understanding to create things that genuinely help them. You build with humans at the center.",
        "condition": lambda t: t.get("empathy", 0) > 0.45 and t.get("helping_orientation", 0) > 0.4 and t.get("problem_solving", 0) > 0.4,
        "key_traits": ["empathy", "helping_orientation", "problem_solving"],
    },
    {
        "id": "creative_visionary",
        "label": "Creative Visionary",
        "description": "You see the world differently. Where others see what is, you see what could be — and you're compelled to make it real.",
        "condition": lambda t: t.get("creativity", 0) > 0.5 and (t.get("passion_signal", 0) > 0.4 or t.get("innovation_drive", 0) > 0.4),
        "key_traits": ["creativity", "passion_signal", "innovation_drive"],
    },
    {
        "id": "purpose_driven_leader",
        "label": "Purpose-Driven Leader",
        "description": "You don't just lead — you lead toward something that matters. You are motivated by impact far beyond personal gain.",
        "condition": lambda t: t.get("leadership", 0) > 0.5 and (t.get("purpose_drive", 0) > 0.4 or t.get("societal_impact_awareness", 0) > 0.45),
        "key_traits": ["leadership", "purpose_drive", "societal_impact_awareness"],
    },
    {
        "id": "deep_specialist",
        "label": "Deep Specialist",
        "description": "You go further than others in whatever you study. You don't just want to know — you want to master. The surface is never enough for you.",
        "condition": lambda t: t.get("depth_focus", 0) > 0.45 and t.get("growth_mindset", 0) > 0.45 and t.get("learning_orientation", 0) > 0.4,
        "key_traits": ["depth_focus", "growth_mindset", "learning_orientation"],
    },
    {
        "id": "resilient_executor",
        "label": "Resilient Executor",
        "description": "You get things done. When others pause, you push forward. Failure is data. Obstacles are problems to solve. You thrive under pressure.",
        "condition": lambda t: t.get("resilience", 0) > 0.5 and t.get("initiative", 0) > 0.5 and t.get("discipline", 0) > 0.45,
        "key_traits": ["resilience", "initiative", "discipline"],
    },
    {
        "id": "human_connector",
        "label": "Human Connector",
        "description": "People open up to you naturally. You read the room, bridge differences, and make complex ideas accessible. Your greatest tool is relationship.",
        "condition": lambda t: t.get("communication", 0) > 0.5 and t.get("empathy", 0) > 0.45 and t.get("emotional_intelligence", 0) > 0.5,
        "key_traits": ["communication", "empathy", "emotional_intelligence"],
    },
    {
        "id": "systems_thinker",
        "label": "Systems Thinker",
        "description": "You see the big picture without losing the details. You map how things connect, anticipate second-order effects, and find leverage points others miss.",
        "condition": lambda t: t.get("logical", 0) > 0.45 and t.get("analytical", 0) > 0.5 and t.get("depth_focus", 0) > 0.4,
        "key_traits": ["logical", "analytical", "depth_focus"],
    },
    {
        "id": "impact_seeker",
        "label": "Impact Seeker",
        "description": "You are fundamentally motivated by making a dent in the world. Titles and salaries matter far less to you than the difference you're making.",
        "condition": lambda t: t.get("societal_impact_awareness", 0) > 0.5 and (t.get("purpose_drive", 0) > 0.4 or t.get("legacy_thinking", 0) > 0.45),
        "key_traits": ["societal_impact_awareness", "purpose_drive", "legacy_thinking"],
    },
    {
        "id": "adaptive_explorer",
        "label": "Adaptive Explorer",
        "description": "You thrive in uncertainty. New domains, new challenges, new people — you adapt and learn fast. You're not looking for a career, you're looking for a journey.",
        "condition": lambda t: t.get("adaptability", 0) > 0.5 and (t.get("risk_appetite", 0) > 0.4 or t.get("growth_mindset", 0) > 0.5),
        "key_traits": ["adaptability", "risk_appetite", "growth_mindset"],
    },
    {
        "id": "grounded_achiever",
        "label": "Grounded Achiever",
        "description": "You set goals and reach them — quietly, reliably, and completely. You don't need applause. You need results. People trust you because you always follow through.",
        "condition": lambda t: t.get("accountability", 0) > 0.6 and t.get("discipline", 0) > 0.5 and t.get("resilience", 0) > 0.4,
        "key_traits": ["accountability", "discipline", "resilience"],
    },
    {
        "id": "compassionate_guide",
        "label": "Compassionate Guide",
        "description": "You have a rare ability to understand where others are emotionally, and guide them forward. You lead not with authority, but with presence.",
        "condition": lambda t: t.get("empathy", 0) > 0.45 and t.get("emotional_intelligence", 0) > 0.55 and t.get("helping_orientation", 0) > 0.35,
        "key_traits": ["empathy", "emotional_intelligence", "helping_orientation"],
    },
]


SMART_FALLBACKS = [
    {
        "condition": lambda t: t.get("accountability", 0) > 0.6 and t.get("resilience", 0) > 0.45 and t.get("discipline", 0) > 0.45,
        "id": "grounded_achiever",
        "label": "Grounded Achiever",
        "description": "You set goals and reach them — quietly, reliably, and completely. You don't need applause. You need results. People trust you because you always follow through.",
    },
    {
        "condition": lambda t: t.get("empathy", 0) > 0.45 and t.get("emotional_intelligence", 0) > 0.5,
        "id": "compassionate_guide",
        "label": "Compassionate Guide",
        "description": "You have a rare ability to understand where others are emotionally, and guide them forward. You lead not with authority, but with presence.",
    },
    {
        "condition": lambda t: t.get("intrinsic_motivation", 0) > 0.6 and t.get("societal_impact_awareness", 0) > 0.45,
        "id": "impact_seeker",
        "label": "Impact Seeker",
        "description": "You are fundamentally motivated by making a dent in the world. Titles and salaries matter far less to you than the difference you're making.",
    },
    {
        "condition": lambda t: t.get("creativity", 0) > 0.55,
        "id": "creative_visionary",
        "label": "Creative Visionary",
        "description": "You see the world differently. Where others see what is, you see what could be — and you're compelled to make it real.",
    },
    {
        "condition": lambda t: t.get("leadership", 0) > 0.55,
        "id": "purpose_driven_leader",
        "label": "Purpose-Driven Leader",
        "description": "You don't just lead — you lead toward something that matters. You are motivated by impact far beyond personal gain.",
    },
    {
        "condition": lambda t: t.get("analytical", 0) > 0.45 and t.get("numerical", 0) > 0.5,
        "id": "analytical_innovator",
        "label": "Analytical Innovator",
        "description": "You think in systems and patterns, and you love building new ones. You don't just solve problems — you redesign them.",
    },
]


def derive_thinking_style(traits: dict) -> dict:
    matched = []

    for style in THINKING_STYLES:
        try:
            if style["condition"](traits):
                key_score = sum(traits.get(k, 0) for k in style["key_traits"]) / len(style["key_traits"])
                matched.append((style, key_score))
        except Exception:
            pass

    matched.sort(key=lambda x: x[1], reverse=True)

    if not matched:
        for fb in SMART_FALLBACKS:
            try:
                if fb["condition"](traits):
                    return {
                        "primary": {
                            "id": fb["id"],
                            "label": fb["label"],
                            "description": fb["description"],
                        },
                        "secondary": None,
                    }
            except Exception:
                pass

        # Last resort: describe from top traits, excluding meta-traits
        display_traits = {k: v for k, v in traits.items() if k not in [
            "suppression_signal", "pressure_conformity", "childhood_divergence",
            "fear_avoidance", "self_awareness"
        ]}
        sorted_traits = sorted(display_traits.items(), key=lambda x: x[1], reverse=True)
        top = sorted_traits[0][0].replace("_", " ") if sorted_traits else "independence"
        second = sorted_traits[1][0].replace("_", " ") if len(sorted_traits) > 1 else None

        desc = (
            f"You show a natural orientation toward {top}"
            + (f" and {second}" if second else "")
            + ". Your profile is still taking shape — you haven't yet found the combination "
            "that fully activates you. That's not a weakness; it's an open door. "
            "The right environment and the right challenge could unlock something significant."
        )

        return {
            "primary": {
                "id": "emerging",
                "label": "Emerging Profile",
                "description": desc,
            },
            "secondary": None,
        }

    primary_style = matched[0][0]
    secondary_style = matched[1][0] if len(matched) > 1 else None

    return {
        "primary": {
            "id": primary_style["id"],
            "label": primary_style["label"],
            "description": primary_style["description"],
        },
        "secondary": {
            "id": secondary_style["id"],
            "label": secondary_style["label"],
            "description": secondary_style["description"],
        } if secondary_style else None,
    }


def detect_suppression(traits: dict) -> dict:
    flags = []
    insights = []

    suppression   = traits.get("suppression_signal", 0.5)
    pressure      = traits.get("pressure_conformity", 0.5)
    fear          = traits.get("fear_avoidance", 0.5)
    childhood_gap = traits.get("childhood_divergence", 0.5)
    intrinsic     = traits.get("intrinsic_motivation", 0.5)
    purpose       = traits.get("purpose_drive", 0.5)
    creativity    = traits.get("creativity", 0.5)
    cognitive_avg = (
        traits.get("logical", 0.5) +
        traits.get("analytical", 0.5) +
        traits.get("numerical", 0.5)
    ) / 3

    if suppression > 0.6:
        flags.append("SUPPRESSED_POTENTIAL")
        insights.append(
            "Your answers suggest you may have set aside something you genuinely love. "
            "This isn't a flaw — it happens to most people when the world tells them "
            "to be practical. But it's worth exploring what that thing is."
        )

    if fear > 0.65 and intrinsic < 0.45:
        flags.append("FEAR_DRIVEN_CHOICES")
        insights.append(
            "Several of your choices appear driven by avoiding failure or instability "
            "rather than moving toward what excites you. Fear is a powerful force — "
            "but it rarely leads somewhere you'd call home."
        )

    if pressure > 0.6:
        flags.append("EXTERNALLY_DRIVEN_PATH")
        insights.append(
            "Your answers suggest your current direction may be significantly shaped "
            "by what others expect of you — family, peers, or society. Your trait profile "
            "shows distinct strengths that may not align with that external path."
        )

    if childhood_gap > 0.5 and suppression > 0.5:
        flags.append("CHILDHOOD_DREAM_GAP")
        insights.append(
            "There's a noticeable gap between what you were drawn to as a child "
            "and where you are now. You don't need to go backwards — but that original "
            "interest often contains the clearest clue about what you're truly built for."
        )

    if cognitive_avg > 0.7 and purpose < 0.4:
        flags.append("HIGH_ABILITY_LOW_DIRECTION")
        insights.append(
            "You show strong cognitive ability but a relatively low sense of direction. "
            "This is common in people who were told to 'be smart' without ever being "
            "asked what they actually want to do with that intelligence."
        )

    if creativity > 0.65 and suppression > 0.55:
        flags.append("UNEXPLORED_CREATIVE_POTENTIAL")
        insights.append(
            "Your profile shows strong creative thinking, but combined with suppression "
            "signals this suggests creativity may be something you haven't fully "
            "pursued — or been encouraged to pursue."
        )

    return {
        "flags": flags,
        "insights": insights,
        "suppression_level": round(suppression * 100),
        "fear_level": round(fear * 100),
        "pressure_level": round(pressure * 100),
        "has_suppression": len(flags) > 0,
    }