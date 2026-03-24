"""
Career scoring matrix — v4
Each career has:
  - trait_weights: traits that contribute positively to fit
  - required_traits: if any of these are below threshold, score is penalized
  - domain/stream/society_role/emerging: metadata
"""

CAREER_MATRIX = {

    # ── TECHNOLOGY ───────────────────────────────────────────────

    "Software Engineer": {
        "trait_weights": {
            "logical": 3, "analytical": 3, "numerical": 2,
            "problem_solving": 3, "depth_focus": 2, "independence": 2,
            "growth_mindset": 2, "innovation_drive": 1
        },
        "required_traits": {"logical": 0.3, "analytical": 0.3},
        "domain": "Technology",
        "stream": ["Science (PCM)", "B.Tech CSE", "Computer Science"],
        "society_role": "Builds the digital infrastructure the world runs on",
        "emerging": False,
    },
    "AI/ML Engineer": {
        "trait_weights": {
            "logical": 3, "analytical": 3, "numerical": 3, "creativity": 2,
            "depth_focus": 3, "growth_mindset": 3, "innovation_drive": 3,
            "intrinsic_motivation": 2
        },
        "required_traits": {"logical": 0.3, "numerical": 0.3, "analytical": 0.3},
        "domain": "Technology",
        "stream": ["Science (PCM)", "B.Tech CSE/AI", "M.Tech AI"],
        "society_role": "Shapes how machines think and what future humanity looks like",
        "emerging": True,
    },
    "Cybersecurity Analyst": {
        "trait_weights": {
            "logical": 3, "analytical": 3, "problem_solving": 3,
            "depth_focus": 2, "risk_appetite": 2, "independence": 2,
            "growth_mindset": 2
        },
        "required_traits": {"logical": 0.3, "analytical": 0.3},
        "domain": "Technology",
        "stream": ["Science (PCM)", "B.Tech CSE", "Cybersecurity Diploma"],
        "society_role": "Protects people and organizations from digital threats",
        "emerging": False,
    },
    "Robotics Engineer": {
        "trait_weights": {
            "spatial": 3, "logical": 3, "numerical": 2, "analytical": 2,
            "innovation_drive": 3, "creativity": 2, "problem_solving": 2,
            "depth_focus": 2
        },
        "required_traits": {"spatial": 0.3, "logical": 0.3, "numerical": 0.25},
        "domain": "Technology",
        "stream": ["Science (PCM)", "B.Tech Mechanical/Electronics", "Robotics"],
        "society_role": "Creates machines that amplify human capability",
        "emerging": True,
    },
    "Data Scientist": {
        "trait_weights": {
            "numerical": 3, "analytical": 3, "logical": 2,
            "depth_focus": 3, "creativity": 1, "growth_mindset": 2,
            "problem_solving": 2
        },
        "required_traits": {"numerical": 0.35, "analytical": 0.35},
        "domain": "Technology",
        "stream": ["Science (PCM/PCB)", "Statistics", "B.Tech CSE"],
        "society_role": "Turns raw data into decisions that affect millions",
        "emerging": False,
    },
    "UX Designer": {
        "trait_weights": {
            "empathy": 3, "creativity": 3, "analytical": 2,
            "communication": 2, "helping_orientation": 2, "verbal": 1,
            "innovation_drive": 2, "self_awareness": 1
        },
        "required_traits": {"creativity": 0.35, "empathy": 0.3},
        "domain": "Design",
        "stream": ["Arts", "Design School", "B.Des", "Psychology + Design"],
        "society_role": "Makes technology human — bridges machines and people",
        "emerging": False,
    },
    "Game Designer": {
        "trait_weights": {
            "creativity": 3, "logical": 2, "spatial": 2, "analytical": 2,
            "innovation_drive": 3, "depth_focus": 2, "passion_signal": 3,
            "intrinsic_motivation": 2
        },
        "required_traits": {"creativity": 0.4},
        "domain": "Creative Arts",
        "stream": ["Any", "Game Design Schools", "B.Tech + Game Dev"],
        "society_role": "Creates worlds that educate, heal, and inspire billions",
        "emerging": True,
    },
    "Prompt Engineer": {
        "trait_weights": {
            "verbal": 3, "logical": 2, "creativity": 2,
            "analytical": 2, "adaptability": 2, "growth_mindset": 2,
            "innovation_drive": 2
        },
        "required_traits": {},
        "domain": "Technology",
        "stream": ["Any — skill-based field"],
        "society_role": "Teaches AI models to be more useful and less harmful",
        "emerging": True,
    },
    "Digital Ethicist": {
        "trait_weights": {
            "analytical": 2, "verbal": 3, "societal_impact_awareness": 3,
            "empathy": 2, "logical": 2, "legacy_thinking": 3,
            "purpose_drive": 2, "self_awareness": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3},
        "domain": "Technology",
        "stream": ["Arts/Philosophy", "Philosophy + CS", "Law + Tech"],
        "society_role": "Ensures technology serves humanity and doesn't harm it",
        "emerging": True,
    },
    "Quantum Computing Researcher": {
        "trait_weights": {
            "logical": 3, "numerical": 3, "analytical": 3,
            "depth_focus": 3, "innovation_drive": 2, "growth_mindset": 2,
            "intrinsic_motivation": 2
        },
        "required_traits": {"logical": 0.45, "numerical": 0.45, "analytical": 0.45},
        "domain": "Research",
        "stream": ["Science (PCM)", "Physics/Math PhD", "Quantum Computing programs"],
        "society_role": "Builds computing power that breaks current limits of what's solvable",
        "emerging": True,
    },

    # ── SCIENCE & RESEARCH ───────────────────────────────────────

    "Research Scientist": {
        "trait_weights": {
            "analytical": 3, "logical": 3, "depth_focus": 3, "numerical": 2,
            "independence": 2, "growth_mindset": 3, "innovation_drive": 2,
            "intrinsic_motivation": 2, "passion_signal": 2
        },
        "required_traits": {"analytical": 0.35, "depth_focus": 0.35},
        "domain": "Research",
        "stream": ["Science", "B.Sc + M.Sc + PhD", "IISc / TIFR"],
        "society_role": "Expands the frontiers of human knowledge",
        "emerging": False,
    },
    "Space Scientist": {
        "trait_weights": {
            "logical": 3, "numerical": 3, "spatial": 3, "analytical": 3,
            "depth_focus": 3, "passion_signal": 2, "innovation_drive": 2,
            "intrinsic_motivation": 3
        },
        "required_traits": {"logical": 0.4, "numerical": 0.4, "spatial": 0.35},
        "domain": "Research",
        "stream": ["Science (PCM)", "B.Tech Aerospace", "Physics PhD", "ISRO pathway"],
        "society_role": "Expands humanity's presence and understanding beyond Earth",
        "emerging": False,
    },
    "Neuroscientist": {
        "trait_weights": {
            "analytical": 3, "depth_focus": 3, "logical": 2, "numerical": 2,
            "innovation_drive": 2, "helping_orientation": 1, "growth_mindset": 2,
            "intrinsic_motivation": 2
        },
        "required_traits": {"analytical": 0.4, "depth_focus": 0.4},
        "domain": "Research",
        "stream": ["Science (PCB)", "B.Sc Neuroscience", "PhD Neuroscience"],
        "society_role": "Unlocks the mysteries of the brain to end suffering",
        "emerging": True,
    },
    "Biotech Engineer": {
        "trait_weights": {
            "logical": 2, "analytical": 3, "numerical": 2, "innovation_drive": 3,
            "depth_focus": 3, "societal_impact_awareness": 2, "growth_mindset": 2
        },
        "required_traits": {"analytical": 0.35, "numerical": 0.25},
        "domain": "Science",
        "stream": ["Science (PCB)", "B.Tech Biotechnology", "B.Sc Biology"],
        "society_role": "Engineers solutions to biological problems — from medicine to food",
        "emerging": True,
    },
    "Climate Tech Specialist": {
        "trait_weights": {
            "analytical": 3, "innovation_drive": 3, "societal_impact_awareness": 3,
            "purpose_drive": 3, "logical": 2, "legacy_thinking": 2,
            "passion_signal": 2, "intrinsic_motivation": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3, "purpose_drive": 0.25},
        "domain": "Environment",
        "stream": ["Science (PCM/PCB)", "Environmental Engineering", "Climate Policy"],
        "society_role": "Fights the largest existential threat humanity has ever faced",
        "emerging": True,
    },

    # ── HEALTHCARE ───────────────────────────────────────────────

    "Doctor (Physician)": {
        "trait_weights": {
            "analytical": 3, "empathy": 3, "helping_orientation": 3, "numerical": 2,
            "resilience": 3, "discipline": 3, "stress_tolerance": 3,
            "societal_impact_awareness": 2, "intrinsic_motivation": 2
        },
        "required_traits": {"empathy": 0.3, "helping_orientation": 0.3, "resilience": 0.3},
        "domain": "Healthcare",
        "stream": ["Science (PCB)", "MBBS", "NEET"],
        "society_role": "Heals, saves, and protects human life directly",
        "emerging": False,
    },
    "Mental Health Counsellor": {
        "trait_weights": {
            "empathy": 3, "emotional_intelligence": 3, "communication": 3,
            "helping_orientation": 3, "resilience": 2, "self_awareness": 2,
            "purpose_drive": 2, "intrinsic_motivation": 2
        },
        "required_traits": {"empathy": 0.35, "emotional_intelligence": 0.35},
        "domain": "Healthcare",
        "stream": ["Arts/Science", "Psychology", "M.A. Counselling"],
        "society_role": "Heals minds in a world facing a mental health crisis",
        "emerging": True,
    },
    "Public Health Specialist": {
        "trait_weights": {
            "societal_impact_awareness": 3, "analytical": 2, "communication": 2,
            "helping_orientation": 3, "leadership": 2, "purpose_drive": 3,
            "legacy_thinking": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3},
        "domain": "Healthcare",
        "stream": ["Science (PCB)", "MBBS", "MPH", "Sociology + Health"],
        "society_role": "Improves health outcomes for entire populations, not just individuals",
        "emerging": False,
    },

    # ── EDUCATION & SOCIAL IMPACT ────────────────────────────────

    "Educator / Teacher": {
        "trait_weights": {
            "communication": 3, "empathy": 3, "helping_orientation": 3,
            "verbal": 2, "legacy_thinking": 3, "societal_impact_awareness": 2,
            "patience": 2, "intrinsic_motivation": 2
        },
        "required_traits": {"communication": 0.35, "empathy": 0.3},
        "domain": "Education",
        "stream": ["Any stream", "B.Ed", "D.El.Ed"],
        "society_role": "Shapes every generation — the root of all other professions",
        "emerging": False,
    },
    "EdTech Product Designer": {
        "trait_weights": {
            "creativity": 3, "helping_orientation": 2, "innovation_drive": 3,
            "analytical": 2, "empathy": 2, "societal_impact_awareness": 2,
            "growth_mindset": 2
        },
        "required_traits": {"creativity": 0.35, "innovation_drive": 0.3},
        "domain": "Education",
        "stream": ["Any + Design/Tech", "B.Des", "BCA + Education background"],
        "society_role": "Democratizes access to quality education through technology",
        "emerging": True,
    },
    "Social Worker": {
        "trait_weights": {
            "empathy": 3, "helping_orientation": 3, "resilience": 2,
            "communication": 2, "societal_impact_awareness": 3, "purpose_drive": 3,
            "emotional_intelligence": 2
        },
        "required_traits": {"empathy": 0.35, "helping_orientation": 0.3, "societal_impact_awareness": 0.3},
        "domain": "Social Impact",
        "stream": ["Arts", "Social Work (MSW)", "Sociology"],
        "society_role": "Advocates for and uplifts the most vulnerable in society",
        "emerging": False,
    },
    "Development Sector Professional": {
        "trait_weights": {
            "societal_impact_awareness": 3, "leadership": 2, "communication": 2,
            "analytical": 2, "purpose_drive": 3, "legacy_thinking": 2,
            "empathy": 2, "intrinsic_motivation": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3, "purpose_drive": 0.25},
        "domain": "Social Impact",
        "stream": ["Any", "Development Studies", "Public Policy", "MBA (Social)"],
        "society_role": "Drives systemic change through NGOs, policy, and programs",
        "emerging": False,
    },

    # ── BUSINESS & ENTREPRENEURSHIP ──────────────────────────────

    "Entrepreneur": {
        "trait_weights": {
            "risk_appetite": 3, "leadership": 3, "innovation_drive": 3,
            "resilience": 3, "adaptability": 3, "initiative": 3,
            "problem_solving": 2, "purpose_drive": 2, "intrinsic_motivation": 3,
            "passion_signal": 2
        },
        "required_traits": {"risk_appetite": 0.3, "initiative": 0.35, "resilience": 0.35},
        "domain": "Business",
        "stream": ["Any stream", "B.Com/BBA/B.Tech + MBA optional"],
        "society_role": "Creates jobs, solves problems, and builds the future economy",
        "emerging": False,
    },
    "Product Manager": {
        "trait_weights": {
            "analytical": 3, "communication": 3, "leadership": 2, "empathy": 2,
            "problem_solving": 3, "adaptability": 2, "initiative": 2,
            "growth_mindset": 2
        },
        "required_traits": {"analytical": 0.3, "communication": 0.3},
        "domain": "Business",
        "stream": ["Any + MBA", "B.Tech + MBA", "Business + Tech"],
        "society_role": "Bridges user needs with technical capability to build impactful products",
        "emerging": False,
    },
    "Financial Analyst": {
        "trait_weights": {
            "numerical": 3, "analytical": 3, "logical": 2,
            "discipline": 2, "depth_focus": 2, "accountability": 2
        },
        "required_traits": {"numerical": 0.4, "analytical": 0.35},
        "domain": "Finance",
        "stream": ["Commerce", "B.Com", "CA", "CFA", "MBA Finance"],
        "society_role": "Allocates capital toward growth and security",
        "emerging": False,
    },
    "Sustainability Consultant": {
        "trait_weights": {
            "societal_impact_awareness": 3, "analytical": 2, "communication": 2,
            "legacy_thinking": 3, "innovation_drive": 2, "purpose_drive": 2,
            "intrinsic_motivation": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3},
        "domain": "Business",
        "stream": ["Any", "MBA Sustainability", "Environmental Studies + Business"],
        "society_role": "Makes organizations more responsible toward the planet",
        "emerging": True,
    },

    # ── CREATIVE & MEDIA ─────────────────────────────────────────

    "Filmmaker / Director": {
        "trait_weights": {
            "creativity": 3, "verbal": 2, "leadership": 2, "empathy": 2,
            "passion_signal": 3, "innovation_drive": 2, "legacy_thinking": 2,
            "intrinsic_motivation": 3, "self_awareness": 2
        },
        "required_traits": {"creativity": 0.45, "passion_signal": 0.35},
        "domain": "Creative Arts",
        "stream": ["Arts", "Film School", "Mass Communication", "FTII"],
        "society_role": "Shapes culture, sparks conversations, and preserves human stories",
        "emerging": False,
    },
    "Graphic & Motion Designer": {
        "trait_weights": {
            "creativity": 3, "spatial": 2, "innovation_drive": 2,
            "depth_focus": 1, "adaptability": 1, "passion_signal": 2
        },
        "required_traits": {"creativity": 0.4},
        "domain": "Creative Arts",
        "stream": ["Arts", "B.Des", "Fine Arts"],
        "society_role": "Gives ideas visual form — makes the invisible visible",
        "emerging": False,
    },
    "Content Creator / Journalist": {
        "trait_weights": {
            "verbal": 3, "creativity": 2, "communication": 3, "empathy": 2,
            "societal_impact_awareness": 2, "initiative": 2, "passion_signal": 2
        },
        "required_traits": {"verbal": 0.25, "communication": 0.3},
        "domain": "Media",
        "stream": ["Arts", "Mass Communication", "Journalism", "English Literature"],
        "society_role": "Informs, challenges, and holds power accountable",
        "emerging": False,
    },
    "Musician / Performing Artist": {
        "trait_weights": {
            "creativity": 3, "passion_signal": 3, "intrinsic_motivation": 3,
            "depth_focus": 2, "resilience": 2, "self_awareness": 2
        },
        "required_traits": {"creativity": 0.5, "passion_signal": 0.4, "intrinsic_motivation": 0.4},
        "domain": "Creative Arts",
        "stream": ["Arts", "Music School", "Performing Arts"],
        "society_role": "Moves hearts, preserves culture, and makes life worth living",
        "emerging": False,
    },

    # ── LAW & GOVERNANCE ─────────────────────────────────────────

    "Lawyer / Advocate": {
        "trait_weights": {
            "verbal": 3, "analytical": 3, "logical": 2, "communication": 3,
            "resilience": 2, "empathy": 1, "societal_impact_awareness": 2
        },
        "required_traits": {"verbal": 0.25, "analytical": 0.3, "communication": 0.3},
        "domain": "Law",
        "stream": ["Arts/Commerce/Science", "LLB", "NLU"],
        "society_role": "Defends rights, upholds justice, and shapes how society is governed",
        "emerging": False,
    },
    "Policy Analyst": {
        "trait_weights": {
            "analytical": 3, "verbal": 2, "societal_impact_awareness": 3,
            "logical": 2, "communication": 2, "purpose_drive": 3, "legacy_thinking": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3, "analytical": 0.3},
        "domain": "Law",
        "stream": ["Arts/Commerce", "Political Science", "Public Policy (MPP)"],
        "society_role": "Shapes the rules societies live by, at scale",
        "emerging": False,
    },
    "Civil Servant (IAS/IPS)": {
        "trait_weights": {
            "leadership": 3, "communication": 2, "resilience": 3, "discipline": 3,
            "societal_impact_awareness": 3, "analytical": 2, "purpose_drive": 3,
            "accountability": 2
        },
        "required_traits": {
            "societal_impact_awareness": 0.4,
            "purpose_drive": 0.35,
            "resilience": 0.4,
            "discipline": 0.4,
        },
        "domain": "Governance",
        "stream": ["Any stream", "UPSC Pathway"],
        "society_role": "Directly administers governance and public service at national scale",
        "emerging": False,
    },

    # ── DESIGN & URBAN ───────────────────────────────────────────

    "Urban Designer / City Planner": {
        "trait_weights": {
            "spatial": 3, "analytical": 2, "creativity": 2, "societal_impact_awareness": 3,
            "empathy": 2, "legacy_thinking": 2, "purpose_drive": 2
        },
        "required_traits": {"spatial": 0.3, "societal_impact_awareness": 0.3},
        "domain": "Design",
        "stream": ["Architecture", "Urban Planning", "B.Arch + M.Plan"],
        "society_role": "Designs the physical spaces billions live and breathe in",
        "emerging": False,
    },
    "Human-Computer Interaction Researcher": {
        "trait_weights": {
            "empathy": 3, "analytical": 2, "creativity": 2, "verbal": 2,
            "innovation_drive": 2, "helping_orientation": 2, "depth_focus": 2,
            "self_awareness": 2
        },
        "required_traits": {"empathy": 0.35, "analytical": 0.3},
        "domain": "Research",
        "stream": ["Any + Psychology + CS", "M.Des HCI", "Cognitive Science"],
        "society_role": "Makes the interface between humans and machines more humane",
        "emerging": True,
    },
    "Circular Economy Consultant": {
        "trait_weights": {
            "societal_impact_awareness": 3, "analytical": 2, "innovation_drive": 2,
            "legacy_thinking": 3, "communication": 2, "adaptability": 2,
            "purpose_drive": 2
        },
        "required_traits": {"societal_impact_awareness": 0.3},
        "domain": "Environment",
        "stream": ["Commerce/Science", "Environmental Management", "Sustainability MBA"],
        "society_role": "Redesigns how industry works so the planet can recover",
        "emerging": True,
    },
    "Longevity Researcher": {
        "trait_weights": {
            "analytical": 3, "depth_focus": 3, "innovation_drive": 3,
            "numerical": 2, "societal_impact_awareness": 2, "growth_mindset": 2,
            "intrinsic_motivation": 3
        },
        "required_traits": {"analytical": 0.4, "depth_focus": 0.4},
        "domain": "Science",
        "stream": ["Science (PCB)", "Biology + Biochemistry", "PhD Biogerontology"],
        "society_role": "Works toward extending healthy human lifespan",
        "emerging": True,
    },
    "Psychologist / Therapist": {
        "trait_weights": {
            "empathy": 3, "emotional_intelligence": 3, "self_awareness": 3,
            "helping_orientation": 3, "communication": 2, "depth_focus": 2,
            "intrinsic_motivation": 2, "resilience": 2
        },
        "required_traits": {"empathy": 0.4, "emotional_intelligence": 0.4},
        "domain": "Healthcare",
        "stream": ["Science/Arts", "B.A./B.Sc Psychology", "M.A. Psychology"],
        "society_role": "Understands and heals the human mind",
        "emerging": False,
    },
}


PENALTY_FACTOR = 0.55   # Score multiplied by this if required trait missing


def score_career(traits_normalized: dict, career_name: str) -> float:
    """
    Compute career fit score for a normalized trait profile.
    Applies penalty if required traits are below threshold.
    Returns 0-100.
    """
    career = CAREER_MATRIX.get(career_name)
    if not career:
        return 0.0

    weights = career["trait_weights"]
    required = career.get("required_traits", {})

    total_weight = sum(weights.values())
    if total_weight == 0:
        return 0.0

    weighted_score = sum(
        traits_normalized.get(trait, 0.5) * weight
        for trait, weight in weights.items()
    )

    base_score = (weighted_score / total_weight) * 100

    # Apply penalty for unmet required traits
    penalty = 1.0
    for trait, threshold in required.items():
        if traits_normalized.get(trait, 0) < threshold:
            penalty *= PENALTY_FACTOR

    return round(base_score * penalty, 1)


def rank_all_careers(traits_normalized: dict, adjustments: dict = None) -> list:
    """
    Score all careers, apply self-learning adjustments, and return ranked list.
    adjustments: { career_name: factor } where factor modifies the score (default 1.0)
    """
    if adjustments is None:
        adjustments = {}

    results = []
    for career_name in CAREER_MATRIX:
        base_score = score_career(traits_normalized, career_name)
        factor = adjustments.get(career_name, 1.0)
        adjusted_score = round(base_score * factor, 1)
        results.append({
            "name": career_name,
            "score": adjusted_score,
            "domain": CAREER_MATRIX[career_name]["domain"],
            "stream": CAREER_MATRIX[career_name]["stream"],
            "society_role": CAREER_MATRIX[career_name]["society_role"],
            "emerging": CAREER_MATRIX[career_name]["emerging"],
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results