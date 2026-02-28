# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# import joblib
# import numpy as np
# from pathlib import Path
# import sys

# # Import your existing config
# sys.path.append(str(Path(__file__).parent))
# from utils.config import THINKING_STYLES, FEATURE_WEIGHTS, MODELS_DIR

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# # ── Load model & scaler ───────────────────────────────────────────────
# model_data = joblib.load(MODELS_DIR / "model.pkl")
# scaler     = joblib.load(MODELS_DIR / "scaler.pkl")

# cluster_centers  = model_data["cluster_centers"]
# cluster_profiles = model_data["cluster_profiles"]
# FEATURE_NAMES    = model_data["feature_names"]

# print(f"✅ Model loaded — {len(cluster_centers)} clusters")
# print(f"✅ Features: {FEATURE_NAMES}")

# # ── Input schema ─────────────────────────────────────────────────────
# class ScoreInput(BaseModel):
#     aptitudeTraits:    dict
#     personalityTraits: dict

# # ── Predict ──────────────────────────────────────────────────────────
# @app.post("/predict")
# def predict(data: ScoreInput):
#     all_traits = {**data.aptitudeTraits, **data.personalityTraits}

#     # Build feature vector in exact training order
#     # Apply feature weights from config (same as training)
#     features = np.array([[
#         all_traits.get(f, 0) * FEATURE_WEIGHTS.get(f, 1.0)
#         for f in FEATURE_NAMES
#     ]])

#     features_scaled = scaler.transform(features)

#     # Find nearest cluster center
#     distances = np.linalg.norm(features_scaled - cluster_centers, axis=1)
#     cluster_id = int(np.argmin(distances))

#     # Confidence relative to actual distances
#     max_dist = float(np.max(distances)) if np.max(distances) > 0 else 1.0
#     all_scores = {
#         f"cluster_{i}": round((1 - float(d) / max_dist) * 100, 1)
#         for i, d in enumerate(distances)
#     }
#     confidence = all_scores[f"cluster_{cluster_id}"]

#     # Pull full style info from config
#     style   = THINKING_STYLES.get(cluster_id, {
#         "name": f"Style {cluster_id}",
#         "description": "",
#         "top_careers": [],
#         "moderate_careers": [],
#         "least_careers": []
#     })
#     profile = cluster_profiles.get(cluster_id, {})

#     return {
#         "cluster_id":       cluster_id,
#         "thinking_style":   style["name"],
#         "description":      style["description"],
#         "top_careers":      style["top_careers"],
#         "moderate_careers": style["moderate_careers"],
#         "least_careers":    style["least_careers"],
#         "confidence":       confidence,
#         "dominant_traits":  profile.get("dominant_features", []),
#         "all_scores":       all_scores,
#         "mode":             "hierarchical_clustering"
#     }

# # ── Health ────────────────────────────────────────────────────────────
# @app.get("/health")
# def health():
#     return {
#         "status":        "ok",
#         "n_clusters":    len(cluster_centers),
#         "feature_names": FEATURE_NAMES,
#     }


# ml/app.py
# ============================================================
# Flask server for the ML engine.
# Runs on port 8000.
# Node.js predict.js calls http://localhost:8000/predict
#
# Start with:  python app.py
# Or with:     flask run --port=8000
# ============================================================

from flask import Flask, request, jsonify
from flask_cors import CORS

from pipelines.inference_pipeline import predict, save_feedback

app = Flask(__name__)
CORS(app)


@app.route("/predict", methods=["POST"])
def predict_route():
    """
    Receives normalized traits from Node.js and returns
    the full career guidance profile.

    Expected body: { "traits": { "logical": 0.8, "empathy": 0.6, ... } }
    """
    data = request.get_json()

    if not data or "traits" not in data:
        return jsonify({"error": "traits object required"}), 400

    traits = data["traits"]

    if not isinstance(traits, dict) or len(traits) == 0:
        return jsonify({"error": "traits must be a non-empty object"}), 400

    try:
        result = predict(traits)
        return jsonify(result)
    except Exception as e:
        print(f"[Predict] Error: {e}")
        return jsonify({"error": "Prediction failed", "detail": str(e)}), 500


@app.route("/feedback", methods=["POST"])
def feedback_route():
    """
    Receives user feedback on prediction accuracy.
    Used for self-learning — adjusts career scores over time.

    Expected body: {
        "traits": { ... },
        "top_career": "Software Engineer",
        "thinking_style": "analytical_innovator",
        "rating": 4,           // 1-5
        "comment": "..."       // optional
    }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "body required"}), 400

    success = save_feedback(
        traits         = data.get("traits", {}),
        top_career     = data.get("top_career", ""),
        thinking_style = data.get("thinking_style", ""),
        accuracy_rating= int(data.get("rating", 3)),
        user_comment   = data.get("comment", ""),
    )

    if success:
        return jsonify({"status": "saved", "message": "Feedback recorded. Thank you."})
    else:
        return jsonify({"status": "error", "message": "Could not save feedback"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "version": "3.0"})


if __name__ == "__main__":
    print("🚀 WDIG ML Engine v3.0 running on port 8000")
    app.run(port=8000, debug=True)