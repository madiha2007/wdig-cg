"""
WDIG ML Engine — FastAPI Server v5.1 — Self-Learning Edition
=============================================================
Endpoints:
  POST /predict                — run ML inference
  POST /feedback               — save pop-up answer + trigger retrain
  POST /generate-pdf           — generate PDF report
  GET  /health                 — server health + retrain stats
  GET  /admin/retrain-status   — retrain log + event counts
  POST /admin/force-retrain    — manually trigger retrain (admin only)
  GET  /admin/feedback-stats   — per-career affinity breakdown
  GET  /admin/clash-patterns   — careers clashing with thinking styles
"""

import importlib.util
import io
import os
import sys
from contextlib import asynccontextmanager
from typing import Any, Optional

import psycopg2
import psycopg2.extras
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from self_learning import (
    RETRAIN_EVERY,
    compute_adjustment_factors,
    get_event_count,
    get_last_retrain_count,
    maybe_retrain,
    recommend_style_to_show,
)

sys.path.insert(0, os.path.dirname(__file__))

# ── DB helper (psycopg2, consistent with self_learning.py) ───────────────────

DB_DSN = os.environ.get("DATABASE_URL", "postgresql://postgres@localhost/wdig_db")


def _db_conn():
    return psycopg2.connect(DB_DSN, cursor_factory=psycopg2.extras.RealDictCursor)


# ── Lazy module loaders (cached after first load) ─────────────────────────────

_pipeline_module   = None
_pdf_module        = None


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


# ── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 WDIG ML Engine v5.1 (Self-Learning) starting...")
    get_pipeline()
    get_pdf_generator()
    print("✅ Modules loaded. Ready.")
    yield


# ── App init ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="WDIG ML Engine",
    version="5.1",
    description="Career recommendation, thinking style inference, and self-learning API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Admin secret ──────────────────────────────────────────────────────────────

ADMIN_SECRET = os.environ.get("WDIG_ADMIN_SECRET", "changeme-in-prod")


def _check_admin(x_admin_secret: str = None):
    if x_admin_secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Invalid admin secret")


# ── Request / Response schemas ────────────────────────────────────────────────

class PredictRequest(BaseModel):
    traits: dict[str, float] = Field(
        ...,
        description="Map of trait name → normalized score (0.0 – 1.0)",
        example={"logical": 0.8, "creativity": 0.6, "empathy": 0.5},
    )
    firebase_uid: str | None = Field(None, description="Optional Firebase user ID")


class FeedbackRequest(BaseModel):
    session_id:                str
    career_chosen_pre_results: Optional[str]   = None   # user's pop-up answer
    time_taken_secs:           Optional[int]   = None   # quiz duration in seconds
    # Optional fields kept for legacy compatibility — not used in retrain logic
    firebase_uid:              Optional[str]   = None
    top_career:                Optional[str]   = None
    thinking_style_id:         Optional[str]   = None
    comment:                   str             = ""
    traits:                    dict[str, float] = Field(default_factory=dict)
    thinking_style_primary:    Optional[str]   = None
    thinking_style_secondary:  Optional[str]   = None
    style_shown:               Optional[str]   = None
    prediction_id:             Optional[int]   = None


class GeneratePdfRequest(BaseModel):
    report:                   str = Field(..., description="Full markdown report text")
    thinking_style_primary:   str = Field("Your Profile")
    top_careers:              list[dict[str, Any]] = Field(default_factory=list)
    moderate_careers:         list[dict[str, Any]] = Field(default_factory=list)
    dimension_scores:         dict[str, float]     = Field(default_factory=dict)
    dominant_traits:          list[dict[str, Any]] = Field(default_factory=list)
    suppression:              dict[str, Any]       = Field(default_factory=dict)
    thinking_style_secondary: str = ""


# ── Core routes ───────────────────────────────────────────────────────────────

@app.get("/health", tags=["Meta"])
def health():
    current = get_event_count()
    last    = get_last_retrain_count()
    return {
        "status":                    "ok",
        "version":                   "5.1",
        "completed_popup_events":    current,
        "events_until_next_retrain": max(0, RETRAIN_EVERY - (current - last)),
    }


@app.post("/predict", tags=["Inference"])
def predict(body: PredictRequest):
    """
    Run the full ML inference pipeline.
    recommend_style_to_show is called AFTER the pop-up (via /feedback),
    not here, because the user hasn't answered the pop-up yet at predict time.
    """
    try:
        pipeline = get_pipeline()
        result   = pipeline.predict(body.traits, body.firebase_uid)
        return result
    except Exception as exc:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/feedback", tags=["Inference"])
def save_feedback(payload: FeedbackRequest):
    """
    Saves the user's pop-up career choice and triggers a retrain cycle if due.
    Returns the recommended style to show on the results page.
    No ratings used anywhere.
    """
    with _db_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            INSERT INTO feedback
                (session_id, career_chosen_pre_results, time_taken_secs, popup_shown_at)
            VALUES (%s, %s, %s, NOW())
            ON CONFLICT (session_id) DO UPDATE SET
                career_chosen_pre_results = EXCLUDED.career_chosen_pre_results,
                time_taken_secs           = EXCLUDED.time_taken_secs,
                popup_shown_at            = NOW()
        """, (
            payload.session_id,
            payload.career_chosen_pre_results,
            payload.time_taken_secs,
        ))
        conn.commit()

    # Compute which style to show (only if we have all three values)
    style_rec = None
    if (
        payload.career_chosen_pre_results
        and payload.thinking_style_primary
    ):
        style_rec = recommend_style_to_show(
            style_primary   = payload.thinking_style_primary,
            style_secondary = payload.thinking_style_secondary,
            career_chosen   = payload.career_chosen_pre_results,
        )

    # Trigger retrain cycle if 100 new events have accumulated
    retrain_result = maybe_retrain()

    return {
        "status":            "saved",
        "style_recommendation": style_rec,       # None if pop-up not yet answered
        "retrain_ran":       retrain_result is not None,
        "retrain_factors":   retrain_result,
    }


@app.post("/generate-pdf", tags=["PDF"])
def generate_pdf_endpoint(body: GeneratePdfRequest):
    if not body.report:
        raise HTTPException(status_code=400, detail="report text required")
    try:
        pdf_gen  = get_pdf_generator()
        payload  = body.model_dump()
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


# ── Admin routes ──────────────────────────────────────────────────────────────

@app.get("/admin/retrain-status", tags=["Admin"])
def retrain_status(x_admin_secret: str = Header(None)):
    _check_admin(x_admin_secret)
    current = get_event_count()
    last    = get_last_retrain_count()

    with _db_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT triggered_at, primary_factor, secondary_factor, clash_factor,
                   event_count_at_run, notes
            FROM   retrain_log
            ORDER  BY triggered_at DESC
            LIMIT  1
        """)
        row = cur.fetchone()

    return {
        "current_event_count":       current,
        "last_retrain_at_count":     last,
        "events_until_next_retrain": max(0, RETRAIN_EVERY - (current - last)),
        "last_retrain":              dict(row) if row else None,
    }


@app.post("/admin/force-retrain", tags=["Admin"])
def force_retrain(x_admin_secret: str = Header(None)):
    _check_admin(x_admin_secret)
    current = get_event_count()
    factors = compute_adjustment_factors(since_event_count=0)

    with _db_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            INSERT INTO retrain_log
                (triggered_at, event_count_at_run,
                 primary_factor, secondary_factor, clash_factor, notes)
            VALUES (NOW(), %s, %s, %s, %s, %s)
        """, (
            current,
            factors["primary_factor"],
            factors["secondary_factor"],
            factors["clash_factor"],
            "Manual force-retrain via admin endpoint",
        ))
        conn.commit()

    return {"status": "retrain_complete", "factors": factors}


@app.get("/admin/feedback-stats", tags=["Admin"])
def feedback_stats(x_admin_secret: str = Header(None)):
    """
    Per-career affinity breakdown from style_career_affinity table.
    Shows how often each career aligns with primary/secondary/clash.
    """
    _check_admin(x_admin_secret)

    with _db_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT
                thinking_style,
                career_label,
                alignment_type,
                event_count,
                last_updated
            FROM   style_career_affinity
            ORDER  BY thinking_style, event_count DESC
        """)
        rows = [dict(r) for r in cur.fetchall()]

        cur.execute("SELECT COUNT(*) AS cnt FROM feedback WHERE career_chosen_pre_results IS NOT NULL")
        total = cur.fetchone()["cnt"]

    return {"career_affinity": rows, "total_popup_events": total}


@app.get("/admin/clash-patterns", tags=["Admin"])
def clash_patterns(x_admin_secret: str = Header(None)):
    """
    Returns careers that consistently clash with a thinking style.
    Useful for spotting where predictions don't match real user aspirations.
    """
    _check_admin(x_admin_secret)

    with _db_conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT
                thinking_style,
                career_label,
                event_count,
                ROUND(
                    event_count::numeric /
                    NULLIF(SUM(event_count) OVER (PARTITION BY thinking_style), 0) * 100,
                    1
                ) AS clash_pct
            FROM   style_career_affinity
            WHERE  alignment_type = 'clash'
            ORDER  BY thinking_style, event_count DESC
        """)
        rows = [dict(r) for r in cur.fetchall()]

    return {
        "clash_patterns": rows,
        "note": "clash_pct = % of interactions where this career clashed with the thinking style",
    }