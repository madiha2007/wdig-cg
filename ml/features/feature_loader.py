
# ml/features/feature_loader.py
# ============================================================
# Trait dimension groupings.
# Used by the inference pipeline to compute dimension scores
# and by the suppression detection engine.
# ============================================================

DIMENSIONS = {
    "cognitive": [
        "logical", "analytical", "numerical", "verbal", "spatial", "creativity"
    ],
    "personality": [
        "discipline", "resilience", "independence", "adaptability",
        "growth_mindset", "risk_appetite", "depth_focus", "confidence",
        "stress_tolerance", "accountability", "initiative", "problem_solving"
    ],
    "motivational": [
        "intrinsic_motivation", "purpose_drive", "passion_signal",
        "fear_avoidance", "learning_orientation"
    ],
    "social": [
        "communication", "leadership", "teamwork", "empathy",
        "emotional_intelligence", "helping_orientation"
    ],
    "suppression": [
        "suppression_signal", "pressure_conformity",
        "childhood_divergence", "self_awareness"
    ],
    "contribution": [
        "societal_impact_awareness", "innovation_drive", "legacy_thinking"
    ],
}

# Traits that should NEVER appear in dominant_traits display
# These are meta/suppression signals, not personal strengths
EXCLUDED_FROM_DOMINANT = {
    "suppression_signal",
    "pressure_conformity",
    "childhood_divergence",
    "fear_avoidance",        # fear is not a strength
    "stress_tolerance",      # too baseline
    "confidence",            # too generic
    "teamwork",              # too generic
}

# Human-readable labels for trait display
TRAIT_LABELS = {
    "logical":                  "Logical Reasoning",
    "analytical":               "Analytical Thinking",
    "numerical":                "Numerical Ability",
    "verbal":                   "Verbal Reasoning",
    "spatial":                  "Spatial Thinking",
    "creativity":               "Creativity",
    "discipline":               "Discipline",
    "resilience":               "Resilience",
    "independence":             "Independence",
    "adaptability":             "Adaptability",
    "growth_mindset":           "Growth Mindset",
    "risk_appetite":            "Risk Appetite",
    "depth_focus":              "Depth of Focus",
    "accountability":           "Accountability",
    "initiative":               "Initiative",
    "problem_solving":          "Problem Solving",
    "intrinsic_motivation":     "Intrinsic Motivation",
    "purpose_drive":            "Purpose Drive",
    "passion_signal":           "Passion",
    "learning_orientation":     "Learning Orientation",
    "communication":            "Communication",
    "leadership":               "Leadership",
    "empathy":                  "Empathy",
    "emotional_intelligence":   "Emotional Intelligence",
    "helping_orientation":      "Helping Orientation",
    "self_awareness":           "Self-Awareness",
    "societal_impact_awareness":"Societal Impact Awareness",
    "innovation_drive":         "Innovation Drive",
    "legacy_thinking":          "Legacy Thinking",
}


def get_dimension_scores(traits: dict) -> dict:
    """
    Compute average normalized score per dimension.
    Returns dict like { "cognitive": 72, "personality": 58, ... }
    Values are 0-100.
    """
    scores = {}
    for dim, trait_list in DIMENSIONS.items():
        values = [traits.get(t, 0.5) for t in trait_list]
        scores[dim] = round(sum(values) / len(values) * 100) if values else 50
    return scores


def get_dominant_traits(traits: dict, top_n: int = 5) -> list:
    """
    Return top N traits by normalized score.
    Excludes suppression/meta traits — only surfaces genuine strengths.
    """
    # Only score traits that are meaningful personal strengths
    scoreable = {
        k: v for k, v in traits.items()
        if k not in EXCLUDED_FROM_DOMINANT
        and k in TRAIT_LABELS   # only known, labelled traits
    }

    sorted_traits = sorted(scoreable.items(), key=lambda x: x[1], reverse=True)

    return [
        {
            "trait": t,
            "label": TRAIT_LABELS.get(t, t.replace("_", " ").title()),
            "score": round(v * 100)
        }
        for t, v in sorted_traits[:top_n]
    ]