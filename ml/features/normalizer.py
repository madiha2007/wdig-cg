
# ml/features/normalizer.py
# ============================================================
# True min-max normalization for all 35 traits.
# Mirrors the TRAIT_RANGES in predict.js exactly.
# Negative minimums are intentional — do not change.
# ============================================================

TRAIT_RANGES = {
    "logical":                  (0,   18),
    "analytical":               (0,   16),
    "numerical":                (0,   14),
    "verbal":                   (0,   14),
    "spatial":                  (0,   14),
    "creativity":               (-2,  10),
    "discipline":               (-8,   8),
    "resilience":               (-9,   8),
    "independence":             (0,    8),
    "adaptability":             (-5,   8),
    "growth_mindset":           (-5,  12),
    "risk_appetite":            (-4,  10),
    "depth_focus":              (-4,  10),
    "confidence":               (-4,   6),
    "stress_tolerance":         (0,    4),
    "accountability":           (-10,  2),
    "initiative":               (-8,   8),
    "problem_solving":          (0,   10),
    "intrinsic_motivation":     (-6,  14),
    "purpose_drive":            (-7,   8),
    "passion_signal":           (-3,  10),
    "fear_avoidance":           (0,   16),
    "learning_orientation":     (-4,   4),
    "communication":            (-4,  10),
    "leadership":               (-2,  10),
    "teamwork":                 (0,    4),
    "empathy":                  (0,   10),
    "emotional_intelligence":   (-5,   6),
    "helping_orientation":      (0,   12),
    "suppression_signal":       (0,   16),
    "pressure_conformity":      (0,   14),
    "childhood_divergence":     (0,    8),
    "self_awareness":           (-2,   6),
    "societal_impact_awareness":(-2,  12),
    "innovation_drive":         (0,   12),
    "legacy_thinking":          (-2,   8),
}


def normalize(trait: str, raw_value: float) -> float:
    """
    True min-max normalization.
    A raw value of -3 discipline becomes ~0.31, NOT 0.
    Output: 0.0 to 1.0
    """
    if trait not in TRAIT_RANGES:
        return 0.5  # unknown trait → neutral
    lo, hi = TRAIT_RANGES[trait]
    clamped = max(lo, min(hi, raw_value))
    return round((clamped - lo) / (hi - lo), 4)


def normalize_all(raw_traits: dict) -> dict:
    """Normalize a full trait dict. Input can have raw or already-normalized values."""
    return {trait: normalize(trait, value) for trait, value in raw_traits.items()}