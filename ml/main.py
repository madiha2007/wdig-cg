from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from pathlib import Path
import sys

# Import your existing config
sys.path.append(str(Path(__file__).parent))
from utils.config import THINKING_STYLES, FEATURE_WEIGHTS, MODELS_DIR

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# ── Load model & scaler ───────────────────────────────────────────────
model_data = joblib.load(MODELS_DIR / "model.pkl")
scaler     = joblib.load(MODELS_DIR / "scaler.pkl")

cluster_centers  = model_data["cluster_centers"]
cluster_profiles = model_data["cluster_profiles"]
FEATURE_NAMES    = model_data["feature_names"]

print(f"✅ Model loaded — {len(cluster_centers)} clusters")
print(f"✅ Features: {FEATURE_NAMES}")

# ── Input schema ─────────────────────────────────────────────────────
class ScoreInput(BaseModel):
    aptitudeTraits:    dict
    personalityTraits: dict

# ── Predict ──────────────────────────────────────────────────────────
@app.post("/predict")
def predict(data: ScoreInput):
    all_traits = {**data.aptitudeTraits, **data.personalityTraits}

    # Build feature vector in exact training order
    # Apply feature weights from config (same as training)
    features = np.array([[
        all_traits.get(f, 0) * FEATURE_WEIGHTS.get(f, 1.0)
        for f in FEATURE_NAMES
    ]])

    features_scaled = scaler.transform(features)

    # Find nearest cluster center
    distances = np.linalg.norm(features_scaled - cluster_centers, axis=1)
    cluster_id = int(np.argmin(distances))

    # Confidence relative to actual distances
    max_dist = float(np.max(distances)) if np.max(distances) > 0 else 1.0
    all_scores = {
        f"cluster_{i}": round((1 - float(d) / max_dist) * 100, 1)
        for i, d in enumerate(distances)
    }
    confidence = all_scores[f"cluster_{cluster_id}"]

    # Pull full style info from config
    style   = THINKING_STYLES.get(cluster_id, {
        "name": f"Style {cluster_id}",
        "description": "",
        "top_careers": [],
        "moderate_careers": [],
        "least_careers": []
    })
    profile = cluster_profiles.get(cluster_id, {})

    return {
        "cluster_id":       cluster_id,
        "thinking_style":   style["name"],
        "description":      style["description"],
        "top_careers":      style["top_careers"],
        "moderate_careers": style["moderate_careers"],
        "least_careers":    style["least_careers"],
        "confidence":       confidence,
        "dominant_traits":  profile.get("dominant_features", []),
        "all_scores":       all_scores,
        "mode":             "hierarchical_clustering"
    }

# ── Health ────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":        "ok",
        "n_clusters":    len(cluster_centers),
        "feature_names": FEATURE_NAMES,
    }