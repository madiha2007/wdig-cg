"""
WDIG ML Inference Pipeline v4.0
Everything inlined to avoid __pycache__ issues.
"""

import sqlite3
import json
import os
from datetime import datetime

# ── TRAIT EXCLUSIONS (meta/suppression traits not shown as "strengths") ────────
EXCLUDED_FROM_DOMINANT = {
    "suppression_signal", "pressure_conformity", "childhood_divergence",
    "fear_avoidance", "self_awareness"
}

TRAIT_LABELS = {
    "logical": "Logical Reasoning",
    "analytical": "Analytical Thinking",
    "numerical": "Numerical Ability",
    "verbal": "Verbal Reasoning",
    "spatial": "Spatial Thinking",
    "creativity": "Creative Thinking",
    "discipline": "Discipline",
    "resilience": "Resilience",
    "independence": "Independence",
    "adaptability": "Adaptability",
    "growth_mindset": "Growth Mindset",
    "risk_appetite": "Risk Appetite",
    "depth_focus": "Depth of Focus",
    "confidence": "Confidence",
    "stress_tolerance": "Stress Tolerance",
    "accountability": "Accountability",
    "initiative": "Initiative",
    "problem_solving": "Problem Solving",
    "communication": "Communication",
    "leadership": "Leadership",
    "teamwork": "Teamwork",
    "empathy": "Empathy",
    "emotional_intelligence": "Emotional Intelligence",
    "helping_orientation": "Helping Orientation",
    "intrinsic_motivation": "Intrinsic Motivation",
    "purpose_drive": "Purpose Drive",
    "passion_signal": "Passion Signal",
    "learning_orientation": "Learning Orientation",
    "societal_impact_awareness": "Societal Impact Awareness",
    "innovation_drive": "Innovation Drive",
    "legacy_thinking": "Legacy Thinking",
}

# ── THINKING STYLES ────────────────────────────────────────────────────────────
THINKING_STYLES = [
    {
        "id": "analytical_innovator",
        "label": "Analytical Innovator",
        "description": "You think in systems and patterns and love building new ones. You don't just solve problems — you redesign them.",
        "condition": lambda t: t.get("analytical", 0) > 0.6 and t.get("innovation_drive", 0) > 0.5 and t.get("logical", 0) > 0.5
    },
    {
        "id": "creative_visionary",
        "label": "Creative Visionary",
        "description": "You see possibility where others see walls. Your ideas often arrive before the world is ready for them.",
        "condition": lambda t: t.get("creativity", 0) > 0.55 and t.get("innovation_drive", 0) > 0.45
    },
    {
        "id": "purpose_driven_leader",
        "label": "Purpose-Driven Leader",
        "description": "You lead with values, not ego. People follow you because you actually care about where you're going.",
        "condition": lambda t: t.get("leadership", 0) > 0.55 and t.get("purpose_drive", 0) > 0.4
    },
    {
        "id": "empathetic_builder",
        "label": "Empathetic Builder",
        "description": "You build for people, not just for outcomes. You feel the problem before you solve it.",
        "condition": lambda t: t.get("empathy", 0) > 0.55 and t.get("helping_orientation", 0) > 0.45 and t.get("initiative", 0) > 0.35
    },
    {
        "id": "deep_specialist",
        "label": "Deep Specialist",
        "description": "You go further than most people are willing to go. Mastery isn't a goal — it's a minimum standard.",
        "condition": lambda t: t.get("depth_focus", 0) > 0.6 and t.get("independence", 0) > 0.45
    },
    {
        "id": "strategic_communicator",
        "label": "Strategic Communicator",
        "description": "You don't just express ideas — you move people with them. Words, timing, and framing are your instruments.",
        "condition": lambda t: t.get("communication", 0) > 0.6 and t.get("analytical", 0) > 0.45 and t.get("leadership", 0) > 0.35
    },
    {
        "id": "resilient_executor",
        "label": "Resilient Executor",
        "description": "You get things done when others give up. Your reliability isn't a personality trait — it's a superpower.",
        "condition": lambda t: t.get("resilience", 0) > 0.55 and t.get("discipline", 0) > 0.5 and t.get("accountability", 0) > 0.45
    },
    {
        "id": "human_connector",
        "label": "Human Connector",
        "description": "You bring people together effortlessly. You understand dynamics before they happen.",
        "condition": lambda t: t.get("communication", 0) > 0.55 and t.get("empathy", 0) > 0.45 and t.get("emotional_intelligence", 0) > 0.45
    },
    {
        "id": "grounded_achiever",
        "label": "Grounded Achiever",
        "description": "You set goals and reach them — quietly, reliably, completely. People trust you because you always follow through.",
        "condition": lambda t: t.get("accountability", 0) > 0.6 and t.get("discipline", 0) > 0.5 and t.get("resilience", 0) > 0.4
    },
    {
        "id": "compassionate_guide",
        "label": "Compassionate Guide",
        "description": "You help people find their way — not by pushing, but by understanding them deeply.",
        "condition": lambda t: t.get("empathy", 0) > 0.6 and t.get("emotional_intelligence", 0) > 0.5
    },
]

# Smart fallbacks — triggered only with minimum guards
SMART_FALLBACKS = [
    {
        "id": "grounded_achiever",
        "label": "Grounded Achiever",
        "description": "You set goals and reach them reliably. People trust you because you follow through.",
        "condition": lambda t: t.get("accountability", 0) > 0.6 and t.get("resilience", 0) > 0.45 and t.get("discipline", 0) > 0.45
    },
    {
        "id": "creative_visionary",
        "label": "Creative Visionary",
        "description": "You see possibility where others see walls. Ideas come naturally to you.",
        "condition": lambda t: t.get("creativity", 0) > 0.55
    },
    {
        "id": "purpose_driven_leader",
        "label": "Purpose-Driven Leader",
        "description": "You lead with values and pull others toward meaningful goals.",
        "condition": lambda t: t.get("leadership", 0) > 0.55
    },
    {
        "id": "deep_specialist",
        "label": "Deep Specialist",
        "description": "You prefer going very deep rather than broad. Mastery is your mode.",
        "condition": lambda t: t.get("depth_focus", 0) > 0.55
    },
]


def derive_thinking_style(traits: dict) -> dict:
    primary = None
    secondary = None

    for style in THINKING_STYLES:
        if style["condition"](traits):
            if primary is None:
                primary = style
            elif secondary is None:
                secondary = style
                break

    if primary is None:
        for fallback in SMART_FALLBACKS:
            if fallback["condition"](traits):
                primary = fallback
                break

    if primary is None:
        top = sorted(
            [(k, v) for k, v in traits.items() if k not in EXCLUDED_FROM_DOMINANT],
            key=lambda x: x[1], reverse=True
        )[:2]
        label1 = TRAIT_LABELS.get(top[0][0], top[0][0]) if top else "curiosity"
        label2 = TRAIT_LABELS.get(top[1][0], top[1][0]) if len(top) > 1 else "adaptability"
        primary = {
            "id": "emerging_profile",
            "label": "Emerging Profile",
            "description": f"Your profile is still taking shape. Your strongest signals are {label1} and {label2} — a rare combination that doesn't fit any single archetype yet."
        }

    return {
        "primary": {"id": primary["id"], "label": primary["label"], "description": primary["description"]},
        "secondary": {"id": secondary["id"], "label": secondary["label"], "description": secondary["description"]} if secondary else None
    }


# ── SUPPRESSION DETECTION ──────────────────────────────────────────────────────
def detect_suppression(traits: dict) -> dict:
    flags = []

    suppression = traits.get("suppression_signal", 0)
    conformity  = traits.get("pressure_conformity", 0)
    childhood   = traits.get("childhood_divergence", 0)
    fear        = traits.get("fear_avoidance", 0)
    self_aw     = traits.get("self_awareness", 0)
    intrinsic   = traits.get("intrinsic_motivation", 0)
    creativity  = traits.get("creativity", 0)
    risk        = traits.get("risk_appetite", 0)

    level    = round(suppression * 10)
    pressure = round(conformity * 10)

    # Flag 1 — External pressure (suppression OR conformity above low threshold)
    if suppression > 0.4 or conformity > 0.35:
        flags.append({
            "type": "external_pressure",
            "title": "External Pressure Detected",
            "insight": "Your answers suggest your current path may have been shaped more by others' expectations than your own. This is worth reflecting on seriously."
        })

    # Flag 2 — Childhood gap
    if childhood > 0.4 and intrinsic < 0.5:
        flags.append({
            "type": "childhood_gap",
            "title": "Childhood Dream Gap",
            "insight": "There's a significant distance between what you may have wanted as a child and where you're currently headed. That divergence often signals suppressed potential waiting to be rediscovered."
        })

    # Flag 3 — Fear-driven path
    if fear > 0.35 and risk < 0.4:
        flags.append({
            "type": "fear_driven_path",
            "title": "Fear-Driven Choices",
            "insight": "Your responses suggest some career choices may be driven more by avoiding failure or discomfort than by pursuing what genuinely excites you."
        })

    # Flag 4 — Creative suppression
    if creativity > 0.5 and suppression > 0.35:
        flags.append({
            "type": "creative_suppression",
            "title": "Creative Potential Being Suppressed",
            "insight": "You show strong creative thinking, but your answers suggest you may not be channeling it fully — possibly due to external pressure or self-doubt. This is one of the most common sources of long-term career dissatisfaction."
        })

    # Flag 5 — Very high suppression signal standalone
    if suppression > 0.7 and not any(f["type"] == "external_pressure" for f in flags):
        flags.append({
            "type": "high_suppression",
            "title": "Strong Suppression Signal",
            "insight": "Your overall response pattern shows a very high suppression signal — meaning significant parts of your interests or potential may be being held back or unexpressed."
        })

    # Flag 6 — Low self-awareness
    if self_aw < 0.3:
        flags.append({
            "type": "low_self_awareness",
            "title": "Self-Awareness is Low",
            "insight": "Your responses suggest you may not yet have a clear picture of your own strengths and motivations. This is the starting point — not a weakness. Awareness is the first step."
        })

    return {
        "has_suppression": len(flags) > 0,
        "suppression_level": level,
        "pressure_level": pressure,
        "flags": flags
    }


# ── CAREER MATRIX ──────────────────────────────────────────────────────────────
CAREER_MATRIX = {
    # TECHNOLOGY
    "Software Engineer": {
        "trait_weights": {"logical": 3, "analytical": 3, "numerical": 2, "problem_solving": 3, "depth_focus": 2, "independence": 2, "growth_mindset": 2},
        "required_traits": {"logical": 0.4, "analytical": 0.35, "numerical": 0.3},
        "society_role": "Builds the digital infrastructure that powers modern life",
        "stream": ["Science", "B.Tech CS", "BCA"],
        "domain": "Technology"
    },
    "AI/ML Engineer": {
        "trait_weights": {"logical": 3, "analytical": 4, "numerical": 3, "creativity": 2, "depth_focus": 3, "innovation_drive": 2, "growth_mindset": 2},
        "required_traits": {"analytical": 0.45, "numerical": 0.4, "logical": 0.4},
        "society_role": "Builds intelligent systems that augment human capability",
        "stream": ["Science", "B.Tech CS/Data Science", "M.Tech AI"],
        "domain": "Technology"
    },
    "Cybersecurity Analyst": {
        "trait_weights": {"logical": 3, "analytical": 3, "depth_focus": 3, "risk_appetite": 2, "independence": 2, "accountability": 2},
        "required_traits": {"logical": 0.4, "analytical": 0.4},
        "society_role": "Protects digital systems and individual privacy",
        "stream": ["Science", "B.Tech CS", "CEH Certification"],
        "domain": "Technology"
    },
    "UX Designer": {
        "trait_weights": {"creativity": 4, "empathy": 4, "communication": 2, "analytical": 2, "depth_focus": 2, "innovation_drive": 2},
        "required_traits": {"creativity": 0.4, "empathy": 0.35},
        "society_role": "Makes technology human — ensuring tools serve people, not the other way",
        "stream": ["Any", "B.Des", "Interaction Design"],
        "domain": "Technology"
    },
    "Prompt Engineer / AI Trainer": {
        "trait_weights": {"verbal": 3, "creativity": 2, "analytical": 2, "communication": 2, "innovation_drive": 2, "learning_orientation": 2},
        "required_traits": {"verbal": 0.3, "creativity": 0.3},
        "society_role": "Shapes how AI systems communicate and reason — defining the future of human-AI interaction",
        "stream": ["Any", "Language + Tech background"],
        "domain": "Technology",
        "emerging": True
    },
    "Quantum Computing Researcher": {
        "trait_weights": {"logical": 4, "analytical": 4, "numerical": 4, "depth_focus": 4, "innovation_drive": 3, "growth_mindset": 2},
        "required_traits": {"logical": 0.55, "numerical": 0.5, "analytical": 0.5},
        "society_role": "Unlocking computational power that could solve problems impossible today",
        "stream": ["Science", "B.Tech/M.Sc Physics/CS", "PhD"],
        "domain": "Technology",
        "emerging": True
    },
    # HEALTHCARE & SCIENCE
    "Doctor (MBBS/MD)": {
        "trait_weights": {"analytical": 3, "empathy": 3, "resilience": 3, "discipline": 3, "helping_orientation": 3, "stress_tolerance": 2, "accountability": 2},
        "required_traits": {"empathy": 0.35, "discipline": 0.4, "resilience": 0.35},
        "society_role": "Restores health and dignity to human life at its most vulnerable",
        "stream": ["Science (Bio)", "NEET", "MBBS"],
        "domain": "Healthcare"
    },
    "Mental Health Counsellor": {
        "trait_weights": {"empathy": 4, "communication": 3, "emotional_intelligence": 4, "helping_orientation": 3, "depth_focus": 2, "self_awareness": 2},
        "required_traits": {"empathy": 0.4, "emotional_intelligence": 0.35},
        "society_role": "Heals minds in a world facing a mental health crisis",
        "stream": ["Arts/Science", "Psychology", "M.A. Counselling"],
        "domain": "Healthcare"
    },
    "Psychologist / Therapist": {
        "trait_weights": {"empathy": 4, "analytical": 2, "communication": 3, "depth_focus": 3, "emotional_intelligence": 3, "helping_orientation": 2},
        "required_traits": {"empathy": 0.4, "depth_focus": 0.35},
        "society_role": "Helps people understand their minds and live more fully",
        "stream": ["Arts/Science", "B.A./B.Sc Psychology", "M.A./M.Sc"],
        "domain": "Healthcare"
    },
    "Longevity Researcher": {
        "trait_weights": {"analytical": 4, "depth_focus": 4, "numerical": 2, "innovation_drive": 3, "legacy_thinking": 3, "growth_mindset": 2},
        "required_traits": {"analytical": 0.5, "depth_focus": 0.45},
        "society_role": "Working to extend healthy human lifespan — one of the most impactful scientific frontiers",
        "stream": ["Science", "MBBS/B.Sc + PhD Biomedical"],
        "domain": "Healthcare",
        "emerging": True
    },
    # BUSINESS & ENTREPRENEURSHIP
    "Entrepreneur": {
        "trait_weights": {"initiative": 4, "risk_appetite": 3, "leadership": 3, "resilience": 3, "creativity": 2, "innovation_drive": 3, "accountability": 2},
        "required_traits": {"initiative": 0.45, "risk_appetite": 0.35},
        "society_role": "Creates jobs, solves problems, and builds the future economy",
        "stream": ["Any", "BBA/B.Tech + MBA optional"],
        "domain": "Business"
    },
    "Product Manager": {
        "trait_weights": {"analytical": 3, "communication": 3, "leadership": 3, "empathy": 2, "initiative": 2, "adaptability": 2, "accountability": 2},
        "required_traits": {"communication": 0.4, "analytical": 0.35, "leadership": 0.35},
        "society_role": "Decides what gets built — and why — shaping products used by millions",
        "stream": ["Any", "B.Tech + MBA or Product Bootcamp"],
        "domain": "Business"
    },
    "Management Consultant": {
        "trait_weights": {"analytical": 3, "communication": 3, "logical": 2, "leadership": 2, "adaptability": 2, "accountability": 2, "depth_focus": 2},
        "required_traits": {"analytical": 0.4, "communication": 0.4},
        "society_role": "Helps organizations solve their hardest problems and make better decisions",
        "stream": ["Any", "BBA/B.Tech + MBA"],
        "domain": "Business"
    },
    # SOCIAL IMPACT & GOVERNANCE
    "Civil Servant (IAS/IPS)": {
        "trait_weights": {"leadership": 3, "resilience": 3, "discipline": 3, "societal_impact_awareness": 3, "purpose_drive": 3, "accountability": 2, "communication": 2},
        "required_traits": {"societal_impact_awareness": 0.4, "purpose_drive": 0.35, "resilience": 0.4, "discipline": 0.4},
        "society_role": "Directly administers governance and public service at national scale",
        "stream": ["Any", "UPSC Pathway"],
        "domain": "Governance"
    },
    "Development Sector Professional": {
        "trait_weights": {"societal_impact_awareness": 4, "empathy": 3, "communication": 2, "resilience": 2, "purpose_drive": 3, "helping_orientation": 3},
        "required_traits": {"societal_impact_awareness": 0.4, "empathy": 0.35},
        "society_role": "Works at the intersection of policy, people, and change",
        "stream": ["Any", "BA Social Work / Public Policy"],
        "domain": "Social Impact"
    },
    "Public Health Specialist": {
        "trait_weights": {"analytical": 2, "societal_impact_awareness": 3, "empathy": 2, "purpose_drive": 3, "communication": 2, "helping_orientation": 2},
        "required_traits": {"societal_impact_awareness": 0.35, "purpose_drive": 0.3},
        "society_role": "Protects entire populations — not just individual patients",
        "stream": ["Science", "MBBS or B.Sc + MPH"],
        "domain": "Healthcare"
    },
    # CREATIVE & MEDIA
    "Content Creator / Journalist": {
        "trait_weights": {"verbal": 3, "creativity": 3, "communication": 3, "passion_signal": 2, "analytical": 1, "societal_impact_awareness": 2},
        "required_traits": {"verbal": 0.35, "creativity": 0.3, "communication": 0.35},
        "society_role": "Shapes public discourse and brings stories that matter to light",
        "stream": ["Arts", "Mass Comm", "Journalism"],
        "domain": "Media"
    },
    "Filmmaker / Director": {
        "trait_weights": {"creativity": 4, "leadership": 2, "communication": 3, "empathy": 2, "passion_signal": 3, "innovation_drive": 2},
        "required_traits": {"creativity": 0.45, "passion_signal": 0.35},
        "society_role": "Creates cultural artifacts that shape how society sees itself",
        "stream": ["Arts", "Film School", "FTII/SRFTI"],
        "domain": "Media",
        "emerging": False
    },
    "Game Designer": {
        "trait_weights": {"creativity": 4, "analytical": 2, "innovation_drive": 3, "depth_focus": 2, "passion_signal": 2, "spatial": 2},
        "required_traits": {"creativity": 0.4, "innovation_drive": 0.35},
        "society_role": "Creates immersive experiences that entertain, educate, and connect billions",
        "stream": ["Science/Arts", "B.Des Game Design / B.Tech + indie dev"],
        "domain": "Technology",
        "emerging": True
    },
    # EDUCATION & RESEARCH
    "Researcher / Academic": {
        "trait_weights": {"analytical": 4, "depth_focus": 4, "logical": 3, "growth_mindset": 2, "intrinsic_motivation": 3, "learning_orientation": 3},
        "required_traits": {"analytical": 0.45, "depth_focus": 0.4, "intrinsic_motivation": 0.4},
        "society_role": "Expands the frontier of human knowledge — everything we have came from researchers",
        "stream": ["Any", "B.Sc/B.Tech + M.Sc/PhD"],
        "domain": "Education & Research"
    },
    "Educator / Teacher": {
        "trait_weights": {"communication": 3, "empathy": 3, "helping_orientation": 3, "patience": 2, "creativity": 2, "societal_impact_awareness": 2},
        "required_traits": {"communication": 0.4, "helping_orientation": 0.35},
        "society_role": "Multiplies human potential — every teacher shapes hundreds of lives",
        "stream": ["Any", "B.Ed / Subject Specialization"],
        "domain": "Education & Research"
    },
    # ENGINEERING & INFRASTRUCTURE
    "Civil Engineer": {
        "trait_weights": {"spatial": 3, "numerical": 3, "logical": 2, "analytical": 2, "discipline": 2, "accountability": 2},
        "required_traits": {"spatial": 0.35, "numerical": 0.35, "logical": 0.35},
        "society_role": "Builds the physical world — bridges, roads, cities — that everyone depends on",
        "stream": ["Science", "B.Tech Civil"],
        "domain": "Engineering"
    },
    "Aerospace Engineer": {
        "trait_weights": {"spatial": 4, "numerical": 4, "logical": 3, "analytical": 3, "depth_focus": 3, "innovation_drive": 2},
        "required_traits": {"spatial": 0.45, "numerical": 0.45, "logical": 0.4},
        "society_role": "Pushes humanity beyond atmospheric limits — aviation, satellites, space",
        "stream": ["Science", "B.Tech Aerospace"],
        "domain": "Engineering"
    },
    # FINANCE & LAW
    "Chartered Accountant / Financial Analyst": {
        "trait_weights": {"numerical": 4, "analytical": 3, "discipline": 3, "accountability": 3, "depth_focus": 2, "logical": 2},
        "required_traits": {"numerical": 0.45, "discipline": 0.4, "accountability": 0.4},
        "society_role": "Ensures financial systems work honestly and efficiently for businesses and individuals",
        "stream": ["Commerce", "CA/CFA/B.Com"],
        "domain": "Finance"
    },
    "Lawyer / Legal Advocate": {
        "trait_weights": {"verbal": 4, "analytical": 3, "logical": 3, "communication": 3, "resilience": 2, "accountability": 2},
        "required_traits": {"verbal": 0.4, "analytical": 0.4, "communication": 0.4},
        "society_role": "Defends rights, resolves disputes, and makes the legal system work for people",
        "stream": ["Any", "BA LLB / LLB"],
        "domain": "Law"
    },
    # SUSTAINABILITY & FUTURE
    "Climate Tech Specialist": {
        "trait_weights": {"analytical": 3, "innovation_drive": 3, "societal_impact_awareness": 4, "depth_focus": 2, "purpose_drive": 3, "legacy_thinking": 2},
        "required_traits": {"societal_impact_awareness": 0.4, "innovation_drive": 0.35},
        "society_role": "Building technologies to mitigate the most critical threat humanity has faced",
        "stream": ["Science/Engineering", "B.Tech + Sustainability specialization"],
        "domain": "Sustainability",
        "emerging": True
    },
    "Sustainability Consultant": {
        "trait_weights": {"analytical": 2, "communication": 2, "societal_impact_awareness": 3, "purpose_drive": 3, "innovation_drive": 2, "leadership": 2},
        "required_traits": {"societal_impact_awareness": 0.4, "purpose_drive": 0.3},
        "society_role": "Helps organizations reduce harm and build for the long term",
        "stream": ["Any", "MBA Sustainability / Environmental Science"],
        "domain": "Sustainability",
        "emerging": True
    },
    "Circular Economy Consultant": {
        "trait_weights": {"analytical": 2, "innovation_drive": 3, "societal_impact_awareness": 3, "creativity": 2, "purpose_drive": 2},
        "required_traits": {"societal_impact_awareness": 0.35, "innovation_drive": 0.3},
        "society_role": "Redesigns economic systems to eliminate waste and regenerate value",
        "stream": ["Any", "MBA / Environmental Science"],
        "domain": "Sustainability",
        "emerging": True
    },
    # EMERGING / NEW FIELDS
    "Digital Ethicist": {
        "trait_weights": {"analytical": 3, "verbal": 2, "societal_impact_awareness": 4, "depth_focus": 3, "communication": 2, "purpose_drive": 3},
        "required_traits": {"societal_impact_awareness": 0.45, "analytical": 0.4},
        "society_role": "Ensures AI and tech systems serve humanity rather than exploit it",
        "stream": ["Any", "Philosophy + Tech or Law + Tech"],
        "domain": "Technology",
        "emerging": True
    },
    "Space Scientist / Researcher": {
        "trait_weights": {"logical": 4, "numerical": 4, "analytical": 4, "spatial": 3, "depth_focus": 4, "innovation_drive": 3},
        "required_traits": {"logical": 0.55, "numerical": 0.5, "analytical": 0.5, "depth_focus": 0.5},
        "society_role": "Expanding humanity's understanding of the universe and enabling interplanetary civilization",
        "stream": ["Science", "B.Sc Physics/Astronomy + M.Sc/PhD"],
        "domain": "Science"
    },
    "Bioinformatics Scientist": {
        "trait_weights": {"analytical": 4, "numerical": 3, "logical": 3, "depth_focus": 3, "innovation_drive": 2, "growth_mindset": 2},
        "required_traits": {"analytical": 0.45, "numerical": 0.4},
        "society_role": "Using data science to decode biology — accelerating medicine and genomics",
        "stream": ["Science", "B.Sc Bioinformatics/Biotech + M.Sc/PhD"],
        "domain": "Science",
        "emerging": True
    },
}


def rank_all_careers(traits: dict) -> list:
    results = []
    for career, config in CAREER_MATRIX.items():
        weights = config.get("trait_weights", {})
        required = config.get("required_traits", {})

        # Compute weighted score
        total_weight = sum(weights.values())
        raw_score = sum(traits.get(t, 0) * w for t, w in weights.items())
        score = (raw_score / total_weight * 100) if total_weight > 0 else 0

        # Apply penalty for missing required traits
        penalty = 1.0
        for req_trait, threshold in required.items():
            if traits.get(req_trait, 0) < threshold:
                penalty *= 0.55

        final_score = round(score * penalty, 1)

        results.append({
            "name": career,
            "score": final_score,
            "domain": config.get("domain", "Other"),
            "stream": config.get("stream", []),
            "society_role": config.get("society_role", ""),
            "emerging": config.get("emerging", False),
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def get_dimension_scores(traits: dict) -> dict:
    dimensions = {
        "cognitive": ["logical", "analytical", "numerical", "verbal", "spatial"],
        "personality": ["discipline", "resilience", "independence", "adaptability", "growth_mindset", "risk_appetite", "depth_focus", "confidence", "stress_tolerance", "accountability", "initiative", "problem_solving"],
        "motivational": ["intrinsic_motivation", "purpose_drive", "passion_signal", "fear_avoidance", "learning_orientation"],
        "social": ["communication", "leadership", "teamwork", "empathy", "emotional_intelligence", "helping_orientation"],
        "suppression": ["suppression_signal", "pressure_conformity", "childhood_divergence", "self_awareness"],
        "contribution": ["societal_impact_awareness", "innovation_drive", "legacy_thinking"],
    }
    scores = {}
    for dim, trait_list in dimensions.items():
        values = [traits.get(t, 0.5) for t in trait_list]
        scores[dim] = round(sum(values) / len(values) * 100) if values else 50
    return scores


def get_dominant_traits(traits: dict, top_n: int = 5) -> list:
    filtered = {k: v for k, v in traits.items() if k not in EXCLUDED_FROM_DOMINANT}
    sorted_traits = sorted(filtered.items(), key=lambda x: x[1], reverse=True)
    return [
        {"trait": t, "label": TRAIT_LABELS.get(t, t), "score": round(v * 100)}
        for t, v in sorted_traits[:top_n]
    ]


# ── SELF-LEARNING (SQLite) ─────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "ml.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firebase_uid TEXT,
            top_career TEXT,
            thinking_style_id TEXT,
            rating INTEGER,
            comment TEXT,
            traits TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()


def save_feedback(firebase_uid, top_career, thinking_style_id, rating, comment, traits):
    init_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO feedback (firebase_uid, top_career, thinking_style_id, rating, comment, traits, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (firebase_uid, top_career, thinking_style_id, rating, comment, json.dumps(traits), datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()


# ── MAIN PREDICT FUNCTION ──────────────────────────────────────────────────────
def predict(traits: dict, firebase_uid: str = None) -> dict:
    thinking_style = derive_thinking_style(traits)
    suppression = detect_suppression(traits)
    all_careers = rank_all_careers(traits)
    top_careers = all_careers[:5]
    moderate_careers = all_careers[5:12]
    dimension_scores = get_dimension_scores(traits)
    dominant_traits = get_dominant_traits(traits)

    return {
        "thinking_style": thinking_style,
        "suppression": suppression,
        "top_careers": top_careers,
        "moderate_careers": moderate_careers,
        "dimension_scores": dimension_scores,
        "dominant_traits": dominant_traits,
        "firebase_uid": firebase_uid,
        "version": "4.0"
    }
