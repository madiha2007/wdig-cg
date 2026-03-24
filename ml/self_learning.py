"""
WDIG ML Engine — self_learning.py
Self-Learning Edition (Ratings-Free)
======================================
Signals used:
  1. Alignment ratio  — did the user's pre-results career choice match
                        their primary or secondary thinking style?
  2. Engagement depth — did the user download the PDF or return to re-read?

Ratings are intentionally NOT used anywhere in this file.
Every user who completes the pop-up contributes a training event automatically.
"""

import os
import logging
from datetime import datetime, timezone
from typing import Optional

import psycopg2
import psycopg2.extras

logger = logging.getLogger(__name__)

# ── Config ────────────────────────────────────────────────────────────────────
RETRAIN_EVERY        = 100      # trigger after every N completed pop-up events
MIN_ENGAGEMENT_SECS  = 120      # sessions shorter than this are excluded
MIN_CLASH_COUNT      = 5        # minimum clash events before penalising a career
PRIMARY_BOOST        = 0.12     # max boost when career aligns with primary style
SECONDARY_BOOST      = 0.06     # max boost when career aligns with secondary style
CLASH_PENALTY        = -0.08    # max penalty when career clashes with both styles
ENGAGEMENT_BONUS     = 0.04     # additional boost for PDF download / re-view

DB_DSN = os.environ.get("DATABASE_URL", "postgresql://postgres@localhost/wdig_db")


# ── DB helpers ────────────────────────────────────────────────────────────────

def _conn():
    return psycopg2.connect(DB_DSN, cursor_factory=psycopg2.extras.RealDictCursor)


def get_event_count() -> int:
    """Count completed pop-up events (every user who saw results)."""
    with _conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT COUNT(*) AS cnt
            FROM   feedback
            WHERE  career_chosen_pre_results IS NOT NULL
              AND  time_taken_secs >= %s
        """, (MIN_ENGAGEMENT_SECS,))
        row = cur.fetchone()
        return int(row["cnt"]) if row else 0


def get_last_retrain_count() -> int:
    """Return the event count recorded at the last retrain, or 0."""
    with _conn() as conn, conn.cursor() as cur:
        cur.execute("""
            SELECT event_count_at_run
            FROM   retrain_log
            ORDER  BY triggered_at DESC
            LIMIT  1
        """)
        row = cur.fetchone()
        return int(row["event_count_at_run"]) if row else 0


# ── Alignment check ───────────────────────────────────────────────────────────

def _top_careers_for_style(style: str, cur) -> list[str]:
    """
    Pull the top careers associated with a thinking style from ml_training_data.
    Assumes ml_training_data has columns: thinking_style, career_label.
    Returns up to 10 career labels ranked by frequency.
    """
    cur.execute("""
        SELECT career_label
        FROM   ml_training_data
        WHERE  thinking_style = %s
        GROUP  BY career_label
        ORDER  BY COUNT(*) DESC
        LIMIT  10
    """, (style,))
    return [r["career_label"] for r in cur.fetchall()]


def compute_alignment(
    career_chosen: str,
    style_primary: str,
    style_secondary: Optional[str],
    cur,
) -> str:
    """
    Returns 'primary', 'secondary', or 'clash'.
    """
    primary_careers = _top_careers_for_style(style_primary, cur)
    if career_chosen in primary_careers:
        return "primary"

    if style_secondary:
        secondary_careers = _top_careers_for_style(style_secondary, cur)
        if career_chosen in secondary_careers:
            return "secondary"

    return "clash"


def record_alignment_event(
    feedback_id: int,
    thinking_style: str,
    career_label: str,
    alignment_type: str,
    conn,
):
    """Upsert one event into style_career_affinity."""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO style_career_affinity
                        (thinking_style, career_label, alignment_type, event_count, last_updated)
            VALUES      (%s, %s, %s, 1, NOW())
            ON CONFLICT (thinking_style, career_label, alignment_type)
            DO UPDATE SET
                event_count  = style_career_affinity.event_count + 1,
                last_updated = NOW()
        """, (thinking_style, career_label, alignment_type))
    conn.commit()


# ── Engagement depth ──────────────────────────────────────────────────────────

def get_engagement_bonus(session_id: str, cur) -> float:
    """
    Read reports table for this session.
    Returns ENGAGEMENT_BONUS if PDF downloaded or viewed more than once, else 0.
    """
    cur.execute("""
        SELECT downloaded_pdf, viewed_count
        FROM   reports
        WHERE  session_id = %s
        LIMIT  1
    """, (session_id,))
    row = cur.fetchone()
    if not row:
        return 0.0
    if row["downloaded_pdf"] or (row["viewed_count"] is not None and row["viewed_count"] > 1):
        return ENGAGEMENT_BONUS
    return 0.0


# ── Factor computation ────────────────────────────────────────────────────────

def compute_adjustment_factors(since_event_count: int) -> dict:
    """
    Compute primary_factor, secondary_factor, clash_factor
    from feedback rows collected since the last retrain.
    """
    with _conn() as conn, conn.cursor() as cur:
        # Fetch qualifying feedback rows since last retrain baseline
        cur.execute("""
            SELECT f.id,
                   f.session_id,
                   f.career_chosen_pre_results,
                   p.thinking_style_primary,
                   p.thinking_style_secondary
            FROM   feedback f
            JOIN   predictions p ON p.session_id = f.session_id
            WHERE  f.career_chosen_pre_results IS NOT NULL
              AND  f.time_taken_secs >= %s
            ORDER  BY f.id ASC
        """, (MIN_ENGAGEMENT_SECS,))
        rows = cur.fetchall()

    if not rows:
        logger.info("No qualifying feedback rows — skipping factor computation.")
        return {"primary_factor": 0.0, "secondary_factor": 0.0, "clash_factor": 0.0}

    primary_count   = 0
    secondary_count = 0
    clash_count     = 0
    engagement_sum  = 0.0

    with _conn() as conn, conn.cursor() as cur:
        for row in rows:
            alignment = compute_alignment(
                row["career_chosen_pre_results"],
                row["thinking_style_primary"],
                row["thinking_style_secondary"],
                cur,
            )

            if alignment == "primary":
                primary_count += 1
            elif alignment == "secondary":
                secondary_count += 1
            else:
                clash_count += 1

            # Record individual event for affinity table
            record_alignment_event(
                feedback_id    = row["id"],
                thinking_style = row["thinking_style_primary"],
                career_label   = row["career_chosen_pre_results"],
                alignment_type = alignment,
                conn           = conn,
            )

            # Engagement depth
            engagement_sum += get_engagement_bonus(row["session_id"], cur)

    total = len(rows)
    primary_ratio   = primary_count   / total
    secondary_ratio = secondary_count / total
    clash_ratio     = clash_count     / total
    avg_engagement  = engagement_sum  / total

    # Scale factors proportionally
    primary_factor   = round(primary_ratio   * PRIMARY_BOOST   + avg_engagement, 4)
    secondary_factor = round(secondary_ratio * SECONDARY_BOOST + avg_engagement, 4)
    clash_factor     = round(
        CLASH_PENALTY * clash_ratio if clash_count >= MIN_CLASH_COUNT else 0.0,
        4,
    )

    logger.info(
        "Factors computed — primary: %s  secondary: %s  clash: %s",
        primary_factor, secondary_factor, clash_factor,
    )
    return {
        "primary_factor":   primary_factor,
        "secondary_factor": secondary_factor,
        "clash_factor":     clash_factor,
    }


# ── Retrain cycle ─────────────────────────────────────────────────────────────

def maybe_retrain() -> Optional[dict]:
    """
    Call this after every feedback save.
    Returns the new factors dict if a retrain ran, else None.
    """
    current_count  = get_event_count()
    last_count     = get_last_retrain_count()
    events_since   = current_count - last_count

    if events_since < RETRAIN_EVERY:
        logger.debug(
            "Retrain not due yet — %d/%d events since last cycle.",
            events_since, RETRAIN_EVERY,
        )
        return None

    logger.info("Retrain triggered at event count %d.", current_count)
    factors = compute_adjustment_factors(since_event_count=last_count)

    # Log the retrain
    with _conn() as conn, conn.cursor() as cur:
        cur.execute("""
            INSERT INTO retrain_log
                        (triggered_at, event_count_at_run,
                         primary_factor, secondary_factor, clash_factor, notes)
            VALUES      (NOW(), %s, %s, %s, %s, %s)
        """, (
            current_count,
            factors["primary_factor"],
            factors["secondary_factor"],
            factors["clash_factor"],
            "Auto-retrain: behavioural signals only (no ratings)",
        ))
        conn.commit()

    return factors


# ── Style recommendation ──────────────────────────────────────────────────────

def recommend_style_to_show(
    style_primary:   str,
    style_secondary: Optional[str],
    career_chosen:   str,
) -> dict:
    """
    Given a user's primary style, secondary style, and pre-results career choice,
    return which style to emphasise in the results page and why.

    Return shape:
    {
        "recommended_style": str,
        "alignment":         "primary" | "secondary" | "clash",
        "message":           str,        # shown on the results screen
    }
    """
    with _conn() as conn, conn.cursor() as cur:
        alignment = compute_alignment(career_chosen, style_primary, style_secondary, cur)

    if alignment == "primary":
        return {
            "recommended_style": style_primary,
            "alignment":         "primary",
            "message":           (
                f"Great news — your interest in {career_chosen} is a strong match "
                f"for your {style_primary} thinking style!"
            ),
        }

    if alignment == "secondary" and style_secondary:
        return {
            "recommended_style": style_secondary,
            "alignment":         "secondary",
            "message":           (
                f"Interesting! {career_chosen} aligns closely with your secondary "
                f"{style_secondary} thinking style. We've highlighted that angle for you."
            ),
        }

    # Clash — show both styles, surface the tension constructively
    message_parts = [
        f"Your thinking style strongly points toward {style_primary}",
    ]
    if style_secondary:
        message_parts.append(f"with a secondary lean toward {style_secondary}")
    message_parts.append(
        f"— but your interest in {career_chosen} shows a different passion. "
        "We've shown you how both paths could work together."
    )

    return {
        "recommended_style": style_primary,          # default to primary for results layout
        "alignment":         "clash",
        "message":           " ".join(message_parts),
    }