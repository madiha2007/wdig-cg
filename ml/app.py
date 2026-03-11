# """
# WDIG ML Engine — Flask Server v4.1
# Includes: /predict, /feedback, /health, /generate-pdf
# Run: python app.py from the ml/ directory
# """
# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import importlib.util
# import os
# import sys
# import io

# sys.path.insert(0, os.path.dirname(__file__))

# app = Flask(__name__)
# CORS(app)


# def get_pipeline():
#     spec = importlib.util.spec_from_file_location(
#         "inference_pipeline",
#         os.path.join(os.path.dirname(__file__), "pipelines", "inference_pipeline.py")
#     )
#     module = importlib.util.module_from_spec(spec)
#     spec.loader.exec_module(module)
#     return module


# def get_pdf_generator():
#     spec = importlib.util.spec_from_file_location(
#         "pdf_generator",
#         os.path.join(os.path.dirname(__file__), "pdf_generator.py")
#     )
#     module = importlib.util.module_from_spec(spec)
#     spec.loader.exec_module(module)
#     return module


# @app.route("/health")
# def health():
#     return jsonify({"status": "ok", "version": "4.1"})


# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         data = request.get_json()
#         traits = data.get("traits", {})
#         firebase_uid = data.get("firebase_uid")
#         if not traits:
#             return jsonify({"error": "traits object required"}), 400
#         pipeline = get_pipeline()
#         result = pipeline.predict(traits, firebase_uid)
#         return jsonify(result)
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# @app.route("/feedback", methods=["POST"])
# def feedback():
#     try:
#         data = request.get_json()
#         pipeline = get_pipeline()
#         pipeline.save_feedback(
#             firebase_uid=data.get("firebase_uid"),
#             top_career=data.get("top_career"),
#             thinking_style_id=data.get("thinking_style_id"),
#             rating=data.get("rating"),
#             comment=data.get("comment", ""),
#             traits=data.get("traits", {})
#         )
#         return jsonify({"success": True})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# @app.route("/generate-pdf", methods=["POST"])
# def generate_pdf_endpoint():
#     try:
#         data = request.get_json()
#         report_text = data.get("report", "")
#         thinking_style = data.get("thinking_style_primary", "Your Profile")

#         if not report_text:
#             return jsonify({"error": "report text required"}), 400

#         pdf_gen = get_pdf_generator()
#         pdf_bytes = pdf_gen.generate_pdf(report_text, thinking_style)

#         return send_file(
#             io.BytesIO(pdf_bytes),
#             mimetype="application/pdf",
#             as_attachment=True,
#             download_name="wdig-report.pdf"
#         )
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     print("🚀 WDIG ML Engine v4.1 running on port 8000")
#     app.run(port=8000, debug=False)


"""
WDIG ML Engine — FastAPI Server v5.0
Production-ready replacement for Flask app.py

Endpoints:
  GET  /health
  POST /predict
  POST /feedback
  POST /generate-pdf

Run (dev):
  uvicorn app:app --port 8000 --reload

Run (prod):
  gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
"""

import importlib.util
import io
import os
import sys
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# ── Path setup (same as before) ───────────────────────────────────────────────
sys.path.insert(0, os.path.dirname(__file__))


# ── Lazy module loaders ───────────────────────────────────────────────────────
# Mirrors your original get_pipeline() / get_pdf_generator() pattern,
# but cached after first load so we don't reload on every request.

_pipeline_module = None
_pdf_module = None


def get_pipeline():
    global _pipeline_module
    if _pipeline_module is None:
        spec = importlib.util.spec_from_file_location(
            "inference_pipeline",
            os.path.join(os.path.dirname(__file__), "pipelines", "inference_pipeline.py"),
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        _pipeline_module = mod
    return _pipeline_module


def get_pdf_generator():
    global _pdf_module
    if _pdf_module is None:
        spec = importlib.util.spec_from_file_location(
            "pdf_generator",
            os.path.join(os.path.dirname(__file__), "pdf_generator.py"),
        )
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        _pdf_module = mod
    return _pdf_module


# ── Lifespan: warm up modules at startup ─────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Pre-load heavy modules once at startup instead of on first request."""
    print("🚀 WDIG ML Engine v5.0 starting — warming up modules...")
    get_pipeline()
    get_pdf_generator()
    print("✅ Modules loaded. Ready.")
    yield
    # shutdown logic (if needed) goes here


# ── App init ──────────────────────────────────────────────────────────────────
app = FastAPI(
    title="WDIG ML Engine",
    version="5.0",
    description="Career recommendation & thinking style inference API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten this to your frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ────────────────────────────────────────────────

class PredictRequest(BaseModel):
    traits: dict[str, float] = Field(
        ...,
        description="Map of trait name → raw score (will be normalized internally)",
        example={"logical": 12, "creativity": 7, "empathy": 8},
    )
    firebase_uid: str | None = Field(None, description="Optional Firebase user ID")


class FeedbackRequest(BaseModel):
    firebase_uid: str | None = None
    top_career: str | None = None
    thinking_style_id: str | None = None
    rating: int | None = Field(None, ge=1, le=5, description="1–5 star rating")
    comment: str = ""
    traits: dict[str, float] = Field(default_factory=dict)


class GeneratePdfRequest(BaseModel):
    report: str = Field(..., description="Full markdown report text")
    thinking_style_primary: str = Field("Your Profile", description="Primary thinking style label")
    # Pass through any extra payload keys (top_careers, dimension_scores, etc.)
    top_careers: list[dict[str, Any]] = Field(default_factory=list)
    moderate_careers: list[dict[str, Any]] = Field(default_factory=list)
    dimension_scores: dict[str, float] = Field(default_factory=dict)
    dominant_traits: list[dict[str, Any]] = Field(default_factory=list)
    suppression: dict[str, Any] = Field(default_factory=dict)
    thinking_style_secondary: str = ""


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health", tags=["Meta"])
async def health():
    """Simple liveness check."""
    return {"status": "ok", "version": "5.0"}


@app.post("/predict", tags=["Inference"])
async def predict(body: PredictRequest):
    """
    Run the full ML inference pipeline.
    Returns thinking style, career rankings, suppression signals,
    dimension scores, and dominant traits.
    """
    try:
        pipeline = get_pipeline()
        result = pipeline.predict(body.traits, body.firebase_uid)
        return result
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/feedback", tags=["Feedback"])
async def feedback(body: FeedbackRequest):
    """
    Store user feedback about their career/thinking style result.
    Used for self-learning adjustments to the career scoring matrix.
    """
    try:
        pipeline = get_pipeline()
        pipeline.save_feedback(
            firebase_uid=body.firebase_uid,
            top_career=body.top_career,
            thinking_style_id=body.thinking_style_id,
            rating=body.rating,
            comment=body.comment,
            traits=body.traits,
        )
        return {"success": True}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/generate-pdf", tags=["PDF"])
async def generate_pdf_endpoint(body: GeneratePdfRequest):
    """
    Generate a styled PDF report from the report text and ML payload.
    Returns the PDF as a binary file download.
    """
    if not body.report:
        raise HTTPException(status_code=400, detail="report text required")

    try:
        pdf_gen = get_pdf_generator()
        # Pass full payload dict so pdf_generator can access all fields
        payload = body.model_dump()
        pdf_bytes = pdf_gen.generate_pdf(
            body.report,
            body.thinking_style_primary,
            payload=payload,
        )
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="wdig-report.pdf"'},
        )
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(exc))