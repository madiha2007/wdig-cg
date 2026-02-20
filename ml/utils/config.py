"""
Configuration for ML Pipeline
"""
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models" / "saved"
DB_PATH = DATA_DIR / "ml.db"
CSV_PATH = DATA_DIR / "raw_exports" / "dummy_traits.csv"

# Ensure directories exist
MODELS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Trait columns
TRAIT_COLUMNS = [
    "logical",
    "analytical",
    "numerical",
    "verbal",
    "spatial",
    "creativity",
    "discipline",
    "resilience",
    "independence",
    "communication",
    "leadership",
]

# Clustering parameters
CLUSTERING_CONFIG = {
    "method": "ward",  # Hierarchical clustering linkage method
    "n_clusters": 8,  # Number of thinking style clusters
    "min_samples": 10,  # Minimum samples to form a valid cluster
    "distance_threshold": None,  # Auto-determine optimal distance
}

# Feature weights (can be tuned based on domain knowledge)
FEATURE_WEIGHTS = {
    "logical": 1.2,
    "analytical": 1.2,
    "numerical": 1.0,
    "verbal": 1.1,
    "spatial": 1.0,
    "creativity": 1.3,
    "discipline": 0.9,
    "resilience": 0.8,
    "independence": 0.9,
    "communication": 1.1,
    "leadership": 1.0,
}

# Thinking style profiles (maps cluster characteristics to thinking styles)
THINKING_STYLES = {
    0: {
        "name": "Analytical Thinker",
        "description": "Strong logical, analytical, and numerical skills",
        "top_careers": [
            "Data Scientist",
            "Software Engineer",
            "Quantitative Analyst",
            "Research Scientist",
            "Systems Architect"
        ],
        "moderate_careers": [
            "Business Analyst",
            "Financial Analyst",
            "Operations Manager",
            "Product Manager",
            "Consultant"
        ],
        "least_careers": [
            "Creative Writer",
            "Artist",
            "Social Worker",
            "Event Planner",
            "Marketing Specialist"
        ]
    },
    1: {
        "name": "Creative Innovator",
        "description": "High creativity with strong verbal and spatial abilities",
        "top_careers": [
            "UX/UI Designer",
            "Creative Director",
            "Architect",
            "Marketing Manager",
            "Content Strategist"
        ],
        "moderate_careers": [
            "Product Designer",
            "Brand Manager",
            "Copywriter",
            "Graphic Designer",
            "Social Media Manager"
        ],
        "least_careers": [
            "Accountant",
            "Data Analyst",
            "Software Developer",
            "Auditor",
            "Compliance Officer"
        ]
    },
    2: {
        "name": "Strategic Leader",
        "description": "Balanced analytical and leadership skills",
        "top_careers": [
            "CEO/Executive",
            "Management Consultant",
            "Strategy Director",
            "Business Development Manager",
            "Operations Director"
        ],
        "moderate_careers": [
            "Project Manager",
            "Team Lead",
            "Sales Manager",
            "HR Director",
            "Product Owner"
        ],
        "least_careers": [
            "Laboratory Technician",
            "Librarian",
            "Data Entry Specialist",
            "Quality Assurance Tester",
            "Research Assistant"
        ]
    },
    3: {
        "name": "Technical Specialist",
        "description": "Strong technical, spatial, and numerical skills",
        "top_careers": [
            "Mechanical Engineer",
            "Electrical Engineer",
            "CAD Designer",
            "Robotics Engineer",
            "Civil Engineer"
        ],
        "moderate_careers": [
            "Industrial Designer",
            "Manufacturing Engineer",
            "Quality Engineer",
            "Systems Engineer",
            "Technical Writer"
        ],
        "least_careers": [
            "Sales Representative",
            "Public Relations Specialist",
            "Event Coordinator",
            "Customer Service Manager",
            "Recruiter"
        ]
    },
    4: {
        "name": "Communicator",
        "description": "Excellent verbal and communication abilities",
        "top_careers": [
            "Public Relations Manager",
            "Communications Director",
            "Journalist",
            "Teacher/Educator",
            "Lawyer"
        ],
        "moderate_careers": [
            "Content Writer",
            "Marketing Coordinator",
            "Training Specialist",
            "Customer Success Manager",
            "Brand Ambassador"
        ],
        "least_careers": [
            "Software Developer",
            "Mechanical Engineer",
            "Statistician",
            "Biomedical Engineer",
            "Actuary"
        ]
    },
    5: {
        "name": "Balanced Generalist",
        "description": "Well-rounded skills across all dimensions",
        "top_careers": [
            "Product Manager",
            "Entrepreneur",
            "General Manager",
            "Business Consultant",
            "Project Coordinator"
        ],
        "moderate_careers": [
            "Account Manager",
            "Operations Analyst",
            "Human Resources Manager",
            "Business Development",
            "Administrative Manager"
        ],
        "least_careers": [
            "Research Mathematician",
            "Quantum Physicist",
            "Neurosurgeon",
            "Classical Musician",
            "Professional Athlete"
        ]
    },
    6: {
        "name": "Empathetic Organizer",
        "description": "Strong discipline, communication, and resilience",
        "top_careers": [
            "Healthcare Administrator",
            "Social Worker",
            "Non-Profit Director",
            "School Counselor",
            "Human Resources Manager"
        ],
        "moderate_careers": [
            "Case Manager",
            "Program Coordinator",
            "Community Outreach",
            "Patient Advocate",
            "Mental Health Counselor"
        ],
        "least_careers": [
            "Investment Banker",
            "Corporate Lawyer",
            "Hedge Fund Manager",
            "Day Trader",
            "Venture Capitalist"
        ]
    },
    7: {
        "name": "Independent Problem Solver",
        "description": "High independence with strong analytical abilities",
        "top_careers": [
            "Research Scientist",
            "Independent Consultant",
            "Software Architect",
            "Freelance Developer",
            "Technical Writer"
        ],
        "moderate_careers": [
            "Data Analyst",
            "Cybersecurity Specialist",
            "Systems Administrator",
            "Quality Assurance Engineer",
            "Database Administrator"
        ],
        "least_careers": [
            "Sales Manager",
            "Event Planner",
            "Customer Service Director",
            "Retail Manager",
            "Hospitality Manager"
        ]
    }
}

# Model persistence
MODEL_METADATA_PATH = MODELS_DIR / "metadata.json"
MODEL_PATH = MODELS_DIR / "model.pkl"
SCALER_PATH = MODELS_DIR / "scaler.pkl"

# Logging
LOG_LEVEL = "INFO"
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
