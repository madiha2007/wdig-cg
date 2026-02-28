// aptitudeQuestions.js — IDs match what your frontend sends
// LR_Q1-5, QA_Q1-5, VA_Q1-5, SR_Q1-5, PW_Q1-10, MP_Q1-10, SA_Q1-10, CV_Q1-6, LS_Q1-4

export const aptitudeQuestions = [

  // ── SECTION 1: LOGICAL REASONING ─────────────────────────────────────────
  {
    id: "LR_Q1", section: "Logical Reasoning",
    question: "All roses are flowers. Some flowers fade quickly. Which conclusion must be true?",
    options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "All flowers are roses"],
    correctOption: 1, traits: { logical: 2, analytical: 1 }
  },
  {
    id: "LR_Q2", section: "Logical Reasoning",
    question: "If APPLE = 50 and MANGO = 50, what is GRAPE worth?",
    options: ["45", "50", "47", "55"],
    correctOption: 1, traits: { logical: 2, numerical: 1 }
  },
  {
    id: "LR_Q3", section: "Logical Reasoning",
    question: "A clock shows 3:15. What is the angle between the hands?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    correctOption: 1, traits: { logical: 2, spatial: 1 }
  },
  {
    id: "LR_Q4", section: "Logical Reasoning",
    question: "Find the odd one out: 2, 3, 5, 7, 9, 11",
    options: ["2", "9", "11", "5"],
    correctOption: 1, traits: { logical: 2, analytical: 1 }
  },
  {
    id: "LR_Q5", section: "Logical Reasoning",
    question: "If it takes 5 machines 5 minutes to make 5 widgets, how long for 100 machines to make 100 widgets?",
    options: ["100 minutes", "5 minutes", "10 minutes", "50 minutes"],
    correctOption: 1, traits: { logical: 2, numerical: 1 }
  },

  // ── SECTION 2: NUMERICAL / QUANTITATIVE ───────────────────────────────────
  {
    id: "QA_Q1", section: "Numerical Reasoning",
    question: "What is 15% of 280?",
    options: ["38", "42", "46", "52"],
    correctOption: 1, traits: { numerical: 2, analytical: 1 }
  },
  {
    id: "QA_Q2", section: "Numerical Reasoning",
    question: "A train travels 300km in 4 hours. How long to travel 525km at the same speed?",
    options: ["6h", "7h", "7.5h", "8h"],
    correctOption: 1, traits: { numerical: 2, logical: 1 }
  },
  {
    id: "QA_Q3", section: "Numerical Reasoning",
    question: "If 3x + 7 = 28, what is x?",
    options: ["5", "7", "9", "11"],
    correctOption: 1, traits: { numerical: 2, logical: 1 }
  },
  {
    id: "QA_Q4", section: "Numerical Reasoning",
    question: "A product costs ₹800 after a 20% discount. What was the original price?",
    options: ["₹960", "₹1000", "₹1050", "₹1100"],
    correctOption: 1, traits: { numerical: 3, analytical: 1 }
  },
  {
    id: "QA_Q5", section: "Numerical Reasoning",
    question: "Ratio of boys to girls is 3:2. If there are 30 boys, how many total students?",
    options: ["45", "50", "55", "60"],
    correctOption: 1, traits: { numerical: 2, logical: 1 }
  },

  // ── SECTION 3: VERBAL ────────────────────────────────────────────────────
  {
    id: "VA_Q1", section: "Verbal Reasoning",
    question: "Choose the word most similar in meaning to BENEVOLENT:",
    options: ["Strict", "Generous", "Aggressive", "Cautious"],
    correctOption: 1, traits: { verbal: 2, communication: 1 }
  },
  {
    id: "VA_Q2", section: "Verbal Reasoning",
    question: "Doctor : Hospital :: Teacher : ?",
    options: ["Student", "Education", "School", "Classroom"],
    correctOption: 2, traits: { verbal: 2, logical: 1 }
  },
  {
    id: "VA_Q3", section: "Verbal Reasoning",
    question: "Which sentence is grammatically correct?",
    options: ["She don't know.", "Neither are coming.", "The committee has made its decision.", "Everyone have done their homework."],
    correctOption: 2, traits: { verbal: 3, communication: 1 }
  },
  {
    id: "VA_Q4", section: "Verbal Reasoning",
    question: "Symphony : Composer :: Painting : ?",
    options: ["Museum", "Colour", "Artist", "Canvas"],
    correctOption: 2, traits: { verbal: 2, creativity: 1 }
  },
  {
    id: "VA_Q5", section: "Verbal Reasoning",
    question: "The scientist's findings were so ______ that they overturned decades of established theory.",
    options: ["mundane", "trivial", "revolutionary", "predictable"],
    correctOption: 2, traits: { verbal: 2, analytical: 1 }
  },

  // ── SECTION 4: SPATIAL REASONING ─────────────────────────────────────────
  {
    id: "SR_Q1", section: "Spatial Reasoning",
    question: "A cube has 6 faces. Opposite faces sum to 7. Top shows 5 — what's on the bottom?",
    options: ["1", "2", "3", "4"],
    correctOption: 1, traits: { spatial: 3, logical: 1 }
  },
  {
    id: "SR_Q2", section: "Spatial Reasoning",
    question: "How many cubes are needed to build a solid 3×3×3 cube?",
    options: ["9", "18", "27", "36"],
    correctOption: 2, traits: { spatial: 2, numerical: 1 }
  },
  {
    id: "SR_Q3", section: "Spatial Reasoning",
    question: "Fold a square paper diagonally twice, cut a triangle from the corner — how many holes when unfolded?",
    options: ["1", "2", "3", "4"],
    correctOption: 3, traits: { spatial: 3, analytical: 1 }
  },
  {
    id: "SR_Q4", section: "Spatial Reasoning",
    question: "A shape has 5 faces, 8 edges, 5 vertices. What is it?",
    options: ["Cube", "Triangular prism", "Square pyramid", "Tetrahedron"],
    correctOption: 2, traits: { spatial: 3, logical: 1 }
  },
  {
    id: "SR_Q5", section: "Spatial Reasoning",
    question: "Which 2D shape rotated around its axis of symmetry forms a sphere?",
    options: ["Square", "Rectangle", "Triangle", "Circle"],
    correctOption: 3, traits: { spatial: 3, analytical: 1 }
  },

  // ── SECTION 5: PERSONALITY & WORK STYLE ──────────────────────────────────
  {
    id: "PW_Q1", section: "Personality & Work Style",
    question: "When there's conflict in a team, you usually:",
    options: [
      { label: "Step in and help resolve it", traits: { leadership: 2, emotional_intelligence: 2, communication: 1 } },
      { label: "Avoid involvement", traits: { independence: 1, stress_tolerance: -1, pressure_conformity: 1 } },
      { label: "Support whoever you agree with", traits: { teamwork: 1 } },
      { label: "Listen to all sides before forming an opinion", traits: { analytical: 2, empathy: 2 } }
    ]
  },
  {
    id: "PW_Q2", section: "Personality & Work Style",
    question: "The work environment where you thrive most is:",
    options: [
      { label: "Fast-paced and unpredictable", traits: { adaptability: 3, risk_appetite: 2 } },
      { label: "Routine & structured", traits: { discipline: 2, accountability: 1 } },
      { label: "Creative and autonomous", traits: { creativity: 2, independence: 2, innovation_drive: 1 } },
      { label: "Collaborative and people-centred", traits: { teamwork: 2, communication: 2, empathy: 1 } }
    ]
  },
  {
    id: "PW_Q3", section: "Personality & Work Style",
    question: "When starting a new project with no instructions, you:",
    options: [
      { label: "Dive in immediately", traits: { initiative: 3, risk_appetite: 2 } },
      { label: "Research thoroughly before starting", traits: { analytical: 2, learning_orientation: 2 } },
      { label: "Ask someone experienced for help", traits: { communication: 1, teamwork: 1 } },
      { label: "Create a structured plan first", traits: { discipline: 2, analytical: 1, accountability: 1 } }
    ]
  },
  {
    id: "PW_Q4", section: "Personality & Work Style",
    question: "You do your best work when:",
    options: [
      { label: "Working alone quietly", traits: { independence: 3, depth_focus: 2 } },
      { label: "Collaborating closely with others", traits: { teamwork: 2, communication: 2 } },
      { label: "Leading a motivated team", traits: { leadership: 3, initiative: 1 } },
      { label: "Switching freely between solo and team work", traits: { adaptability: 2, independence: 1 } }
    ]
  },
  {
    id: "PW_Q5", section: "Personality & Work Style",
    question: "When you receive criticism on your work, you typically:",
    options: [
      { label: "Use it to improve", traits: { growth_mindset: 3, resilience: 2, accountability: 1 } },
      { label: "Feel hurt but recover quickly", traits: { resilience: 2, emotional_intelligence: 1 } },
      { label: "Push back if you disagree", traits: { confidence: 2, independence: 1 } },
      { label: "Accept it without much reaction", traits: { adaptability: 1, pressure_conformity: 1 } }
    ]
  },
  {
    id: "PW_Q6", section: "Personality & Work Style",
    question: "When you fail at something important, you tend to:",
    options: [
      { label: "Analyse what went wrong and try again", traits: { resilience: 3, analytical: 2, accountability: 2 } },
      { label: "Take a break then bounce back", traits: { resilience: 2, stress_tolerance: 1 } },
      { label: "Shut down completely", traits: { resilience: -2, stress_tolerance: -2 } },
      { label: "Move on quickly without dwelling", traits: { adaptability: 2, resilience: 1 } }
    ]
  },
  {
    id: "PW_Q7", section: "Personality & Work Style",
    question: "When a plan falls apart at the last minute, you:",
    options: [
      { label: "Re-plan and take charge", traits: { leadership: 2, initiative: 2, resilience: 2, accountability: 1 } },
      { label: "Stay calm and adapt", traits: { adaptability: 3, stress_tolerance: 2 } },
      { label: "Get frustrated but push through", traits: { resilience: 1, discipline: 1 } },
      { label: "Look to others for direction", traits: { teamwork: 1, pressure_conformity: 1 } }
    ]
  },
  {
    id: "PW_Q8", section: "Personality & Work Style",
    question: "When you disagree with someone in authority, you:",
    options: [
      { label: "Speak up clearly and professionally", traits: { confidence: 3, communication: 2, independence: 1 } },
      { label: "Calmly explain your reasoning", traits: { communication: 3, analytical: 1 } },
      { label: "Comply but express concern privately", traits: { pressure_conformity: 2, communication: 1 } },
      { label: "Just go along with it", traits: { pressure_conformity: 3, fear_avoidance: 1 } }
    ]
  },
  {
    id: "PW_Q9", section: "Personality & Work Style",
    question: "When a goal becomes extremely difficult, you usually:",
    options: [
      { label: "Push harder — difficulty motivates me", traits: { resilience: 3, discipline: 2, intrinsic_motivation: 2 } },
      { label: "Reassess and adjust the strategy", traits: { analytical: 2, adaptability: 2 } },
      { label: "Seek help from others", traits: { teamwork: 2, communication: 1 } },
      { label: "Give up", traits: { resilience: -3, discipline: -2 } }
    ]
  },
  {
    id: "PW_Q10", section: "Personality & Work Style",
    question: "You prefer to handle difficult situations by:",
    options: [
      { label: "Confronting them head-on", traits: { confidence: 2, resilience: 2, initiative: 1 } },
      { label: "Planning carefully before acting", traits: { analytical: 2, discipline: 2 } },
      { label: "Seeking support from trusted people", traits: { communication: 2, emotional_intelligence: 1 } },
      { label: "Avoid it entirely", traits: { fear_avoidance: 3, resilience: -2 } }
    ]
  },

  // ── SECTION 6: MOTIVATION & PASSION ──────────────────────────────────────
  {
    id: "MP_Q1", section: "Motivation & Passion",
    question: "When you're doing something you don't enjoy, time:",
    options: [
      { label: "Drags slowly", traits: { intrinsic_motivation: -1, passion_signal: -1 } },
      { label: "Passes okay — I stay disciplined", traits: { discipline: 2, accountability: 1 } },
      { label: "Passes quickly — I find meaning in anything", traits: { adaptability: 2, purpose_drive: 1 } },
      { label: "Varies depending on the day", traits: { adaptability: 1 } }
    ]
  },
  {
    id: "MP_Q2", section: "Motivation & Passion",
    question: "What drives you to learn something new?",
    options: [
      { label: "I genuinely want to master it", traits: { intrinsic_motivation: 3, depth_focus: 2, learning_orientation: 2 } },
      { label: "It's required for my career", traits: { accountability: 1, discipline: 1 } },
      { label: "Curiosity — I just want to know", traits: { learning_orientation: 3, intrinsic_motivation: 2 } },
      { label: "To impress others or stay competitive", traits: { fear_avoidance: 1, pressure_conformity: 1 } }
    ]
  },
  {
    id: "MP_Q3", section: "Motivation & Passion",
    question: "On a free day with no obligations, you typically:",
    options: [
      { label: "Work on something I'm passionate about", traits: { intrinsic_motivation: 3, passion_signal: 3 } },
      { label: "Rest and recharge completely", traits: { stress_tolerance: 1 } },
      { label: "Barely do anything", traits: { initiative: -1, intrinsic_motivation: -1 } },
      { label: "Learn, explore, or create something", traits: { learning_orientation: 2, creativity: 2, initiative: 1 } }
    ]
  },
  {
    id: "MP_Q4", section: "Motivation & Passion",
    question: "What matters most to you in a career?",
    options: [
      { label: "Financial security above everything", traits: { fear_avoidance: 2, pressure_conformity: 1 } },
      { label: "Doing work that truly excites me", traits: { intrinsic_motivation: 3, passion_signal: 2 } },
      { label: "Making a real difference in the world", traits: { purpose_drive: 3, societal_impact_awareness: 2 } },
      { label: "Growth, learning, and mastery", traits: { growth_mindset: 3, learning_orientation: 2 } }
    ]
  },
  {
    id: "MP_Q5", section: "Motivation & Passion",
    question: "The thought of failing publicly makes you feel:",
    options: [
      { label: "Anxiety about failing", traits: { fear_avoidance: 3, suppression_signal: 1 } },
      { label: "Uncomfortable but manageable", traits: { resilience: 1, fear_avoidance: 1 } },
      { label: "Indifferent — failure is part of the process", traits: { resilience: 2, risk_appetite: 2 } },
      { label: "Motivated to prove people wrong", traits: { resilience: 3, confidence: 2 } }
    ]
  },
  {
    id: "MP_Q6", section: "Motivation & Passion",
    question: "The last time you felt genuinely proud of yourself was when you:",
    options: [
      { label: "Solved a hard problem", traits: { analytical: 2, depth_focus: 2, intrinsic_motivation: 1 } },
      { label: "Helped someone meaningfully", traits: { helping_orientation: 3, empathy: 2 } },
      { label: "Created something original", traits: { creativity: 3, passion_signal: 2 } },
      { label: "Reached a goal through discipline", traits: { discipline: 2, accountability: 2, resilience: 1 } }
    ]
  },
  {
    id: "MP_Q7", section: "Motivation & Passion",
    question: "If you could spend 10,000 hours mastering one thing, it would be:",
    options: [
      { label: "Creating art, music, or stories", traits: { creativity: 3, passion_signal: 3, innovation_drive: 1 } },
      { label: "Understanding systems — science, tech, philosophy", traits: { analytical: 2, depth_focus: 2, intrinsic_motivation: 2 } },
      { label: "Leading and building organisations", traits: { leadership: 3, initiative: 2 } },
      { label: "Helping and healing people", traits: { empathy: 3, helping_orientation: 3 } }
    ]
  },
  {
    id: "MP_Q8", section: "Motivation & Passion",
    question: "Your current career direction was most influenced by:",
    options: [
      { label: "My own deep passion", traits: { intrinsic_motivation: 3, self_awareness: 2, suppression_signal: -1 } },
      { label: "My parents or peers suggested it", traits: { pressure_conformity: 3, suppression_signal: 2 } },
      { label: "It seemed practical and safe", traits: { fear_avoidance: 2, pressure_conformity: 1 } },
      { label: "It was the most logical choice given my skills", traits: { analytical: 1, self_awareness: 1 } }
    ]
  },
  {
    id: "MP_Q9", section: "Motivation & Passion",
    question: "After finishing a major task, you typically feel:",
    options: [
      { label: "Relief that it's finally over", traits: { intrinsic_motivation: -1, passion_signal: -1 } },
      { label: "Satisfied and proud", traits: { accountability: 2, intrinsic_motivation: 1 } },
      { label: "Energized and ready for the next thing", traits: { initiative: 3, passion_signal: 2, intrinsic_motivation: 2 } },
      { label: "Neutral — just part of the job", traits: { discipline: 1 } }
    ]
  },
  {
    id: "MP_Q10", section: "Motivation & Passion",
    question: "The idea of starting something completely new in an unknown field feels:",
    options: [
      { label: "Exciting — completely worth it", traits: { risk_appetite: 3, innovation_drive: 2, initiative: 2 } },
      { label: "Interesting but I'd need a safety net", traits: { risk_appetite: 1, adaptability: 1 } },
      { label: "Scary — I prefer what I know", traits: { fear_avoidance: 2, risk_appetite: -1 } },
      { label: "Pointless — I'd rather go deeper in what I know", traits: { depth_focus: 2, risk_appetite: -1 } }
    ]
  },

  // ── SECTION 7: SUPPRESSION & SELF-AWARENESS ──────────────────────────────
  {
    id: "SA_Q1", section: "Suppression & Self-Awareness",
    question: "As a child, you were most drawn to:",
    options: [
      { label: "Exploring, sports, or adventure", traits: { risk_appetite: 1, childhood_divergence: 1 } },
      { label: "Art, music, or storytelling", traits: { creativity: 2, childhood_divergence: 2, passion_signal: 1 } },
      { label: "Science, puzzles, or building things", traits: { analytical: 1, innovation_drive: 1 } },
      { label: "People — talking, connecting, helping", traits: { communication: 1, empathy: 1, helping_orientation: 1 } }
    ]
  },
  {
    id: "SA_Q2", section: "Suppression & Self-Awareness",
    question: "Your childhood dreams and your current path are:",
    options: [
      { label: "Very aligned", traits: { self_awareness: 2, intrinsic_motivation: 1 } },
      { label: "Somewhat connected", traits: { self_awareness: 1, adaptability: 1 } },
      { label: "Completely different", traits: { childhood_divergence: 3, suppression_signal: 1 } },
      { label: "I never really had a childhood dream", traits: { self_awareness: -1 } }
    ]
  },
  {
    id: "SA_Q3", section: "Suppression & Self-Awareness",
    question: "Have you ever given up on a passion because someone said it wasn't practical?",
    options: [
      { label: "Yes, and I still think about it", traits: { suppression_signal: 3, childhood_divergence: 2, passion_signal: 1 } },
      { label: "Yes, but I've moved on", traits: { suppression_signal: 1, adaptability: 1 } },
      { label: "No — I've always followed my beliefs", traits: { confidence: 2, independence: 2, suppression_signal: -1 } },
      { label: "No — practical advice shaped me for the better", traits: { pressure_conformity: 1 } }
    ]
  },
  {
    id: "SA_Q4", section: "Suppression & Self-Awareness",
    question: "The career you secretly wish you'd pursued involves:",
    options: [
      { label: "Connecting with and understanding people", traits: { empathy: 2, communication: 2, helping_orientation: 2 } },
      { label: "Creating something lasting and meaningful", traits: { creativity: 2, legacy_thinking: 2, passion_signal: 1 } },
      { label: "Solving big world problems", traits: { societal_impact_awareness: 2, purpose_drive: 2, innovation_drive: 1 } },
      { label: "I'm already on the path I want", traits: { self_awareness: 2, intrinsic_motivation: 1 } }
    ]
  },
  {
    id: "SA_Q5", section: "Suppression & Self-Awareness",
    question: "If you could live your life differently, you would:",
    options: [
      { label: "Yes, completely", traits: { childhood_divergence: 2, suppression_signal: 2 } },
      { label: "Change some key decisions", traits: { childhood_divergence: 1, self_awareness: 1 } },
      { label: "Keep most of it the same", traits: { self_awareness: 1, intrinsic_motivation: 1 } },
      { label: "Wouldn't change anything", traits: { self_awareness: 2, intrinsic_motivation: 2 } }
    ]
  },
  {
    id: "SA_Q6", section: "Suppression & Self-Awareness",
    question: "When it comes to knowing what you truly want in life, you feel:",
    options: [
      { label: "Very clear — I know exactly what I want", traits: { self_awareness: 3, purpose_drive: 1 } },
      { label: "Somewhat clear — I have a rough direction", traits: { self_awareness: 1 } },
      { label: "I'm not sure what I'd truly love", traits: { self_awareness: -1, suppression_signal: 1 } },
      { label: "Completely lost — I have no idea", traits: { self_awareness: -2, suppression_signal: 1 } }
    ]
  },
  {
    id: "SA_Q7", section: "Suppression & Self-Awareness",
    question: "When someone describes you really accurately, you:",
    options: [
      { label: "Feel deeply seen — that resonates", traits: { self_awareness: 2, emotional_intelligence: 1 } },
      { label: "Are surprised — I didn't know that about myself", traits: { self_awareness: -1 } },
      { label: "Question whether it's really true", traits: { confidence: -1 } },
      { label: "Think they're mostly right but missing something", traits: { self_awareness: 1 } }
    ]
  },
  {
    id: "SA_Q8", section: "Suppression & Self-Awareness",
    question: "Is there something you're naturally talented at that you've never pursued seriously?",
    options: [
      { label: "Yes — I've kept it completely to myself", traits: { suppression_signal: 3, childhood_divergence: 2 } },
      { label: "Yes — but I don't think it can be a career", traits: { suppression_signal: 2, fear_avoidance: 2 } },
      { label: "Yes — and I'm starting to pursue it", traits: { self_awareness: 2, initiative: 2, growth_mindset: 1 } },
      { label: "No — I've channeled my strengths into my work", traits: { intrinsic_motivation: 2, self_awareness: 1 } }
    ]
  },
  {
    id: "SA_Q9", section: "Suppression & Self-Awareness",
    question: "When things go wrong, you tend to:",
    options: [
      { label: "Take responsibility and fix it", traits: { accountability: 3, resilience: 2 } },
      { label: "Reflect on what I could have done differently", traits: { self_awareness: 2, analytical: 1 } },
      { label: "Look for external reasons", traits: { accountability: -1 } },
      { label: "A mix of all of the above", traits: { self_awareness: 1, adaptability: 1 } }
    ]
  },
  {
    id: "SA_Q10", section: "Suppression & Self-Awareness",
    question: "If you could give your younger self one piece of career advice:",
    options: [
      { label: "Follow your curiosity, not others' expectations", traits: { intrinsic_motivation: 2, self_awareness: 1 } },
      { label: "Be practical — passion doesn't always pay", traits: { fear_avoidance: 1, pressure_conformity: 1 } },
      { label: "Choose something completely different", traits: { suppression_signal: 2, childhood_divergence: 2 } },
      { label: "Explore more before deciding", traits: { growth_mindset: 2, risk_appetite: 1 } }
    ]
  },

  // ── SECTION 8: SOCIAL CONTRIBUTION & VALUES ───────────────────────────────
  {
    id: "CV_Q1", section: "Social Contribution & Values",
    question: "What matters most to you in your ideal life?",
    options: [
      { label: "Freedom and flexibility", traits: { independence: 2, risk_appetite: 1 } },
      { label: "Making a meaningful difference", traits: { purpose_drive: 3, societal_impact_awareness: 2 } },
      { label: "Financial security and stability", traits: { fear_avoidance: 1, accountability: 1 } },
      { label: "Mastery and being the best at something", traits: { depth_focus: 2, intrinsic_motivation: 1 } }
    ]
  },
  {
    id: "CV_Q2", section: "Social Contribution & Values",
    question: "The achievement you'd be most proud of is having:",
    options: [
      { label: "Helped someone overcome a real challenge", traits: { helping_orientation: 3, empathy: 2, societal_impact_awareness: 1 } },
      { label: "Built something that outlasts me", traits: { legacy_thinking: 3, innovation_drive: 2 } },
      { label: "Reached the top of my field", traits: { depth_focus: 2, confidence: 1 } },
      { label: "Changed how people see a problem", traits: { innovation_drive: 2, societal_impact_awareness: 2, creativity: 1 } }
    ]
  },
  {
    id: "CV_Q3", section: "Social Contribution & Values",
    question: "The domain you most want to contribute to:",
    options: [
      { label: "Technology and innovation", traits: { innovation_drive: 3, creativity: 1 } },
      { label: "Health and human wellbeing", traits: { helping_orientation: 2, societal_impact_awareness: 2, empathy: 1 } },
      { label: "Education and knowledge", traits: { learning_orientation: 2, societal_impact_awareness: 2, purpose_drive: 1 } },
      { label: "Environment and sustainability", traits: { societal_impact_awareness: 3, legacy_thinking: 2, purpose_drive: 1 } }
    ]
  },
  {
    id: "CV_Q4", section: "Social Contribution & Values",
    question: "In 30 years, you want to be remembered for:",
    options: [
      { label: "Lives you've meaningfully changed", traits: { helping_orientation: 3, societal_impact_awareness: 2, legacy_thinking: 2 } },
      { label: "A breakthrough that changed your field", traits: { innovation_drive: 3, legacy_thinking: 2 } },
      { label: "Building something that employed thousands", traits: { leadership: 2, initiative: 2, legacy_thinking: 1 } },
      { label: "Being the best at what you did", traits: { depth_focus: 2, discipline: 1 } }
    ]
  },
  {
    id: "CV_Q5", section: "Social Contribution & Values",
    question: "The type of work that gives you the deepest sense of purpose:",
    options: [
      { label: "Discovering truth through research", traits: { analytical: 2, depth_focus: 2, intrinsic_motivation: 2 } },
      { label: "Creating things that inspire others", traits: { creativity: 3, passion_signal: 2 } },
      { label: "Solving systemic problems at scale", traits: { societal_impact_awareness: 3, innovation_drive: 2, purpose_drive: 2 } },
      { label: "Directly supporting individuals in need", traits: { empathy: 3, helping_orientation: 3 } }
    ]
  },
  {
    id: "CV_Q6", section: "Social Contribution & Values",
    question: "If your dream career path had a 60% chance of failure, you would:",
    options: [
      { label: "Still pursue it wholeheartedly", traits: { risk_appetite: 3, intrinsic_motivation: 2, initiative: 2 } },
      { label: "Try it with a backup plan", traits: { risk_appetite: 1, analytical: 1 } },
      { label: "Choose the safer option", traits: { fear_avoidance: 2, risk_appetite: -1 } },
      { label: "Depends on the stakes involved", traits: { adaptability: 1, analytical: 1 } }
    ]
  },

  // ── SECTION 9: LEARNING STYLE ─────────────────────────────────────────────
  {
    id: "LS_Q1", section: "Learning Style",
    question: "When learning, do you prefer theory or practice?",
    options: [
      { label: "Theory first — I need to understand deeply", traits: { depth_focus: 2, analytical: 2 } },
      { label: "Practice first — I learn by doing", traits: { risk_appetite: 1, adaptability: 2 } },
      { label: "Both, depending on the situation", traits: { adaptability: 2, learning_orientation: 1 } },
      { label: "Neither — I learn by watching others", traits: { learning_orientation: 1 } }
    ]
  },
  {
    id: "LS_Q2", section: "Learning Style",
    question: "When you encounter a concept you don't understand, you:",
    options: [
      { label: "Research it obsessively until it clicks", traits: { depth_focus: 3, learning_orientation: 2 } },
      { label: "Ask someone to explain it simply", traits: { communication: 1, teamwork: 1 } },
      { label: "Skip it and come back later", traits: { adaptability: 1 } },
      { label: "Piece it together from context over time", traits: { analytical: 2, independence: 1 } }
    ]
  },
  {
    id: "LS_Q3", section: "Learning Style",
    question: "How do you feel about intellectual challenge?",
    options: [
      { label: "It's what I live for", traits: { intrinsic_motivation: 3, depth_focus: 2, learning_orientation: 2 } },
      { label: "I enjoy it in moderation", traits: { learning_orientation: 1, growth_mindset: 1 } },
      { label: "I prefer smooth, manageable work", traits: { stress_tolerance: 1, risk_appetite: -1 } },
      { label: "I avoid it when possible", traits: { fear_avoidance: 1, risk_appetite: -1 } }
    ]
  },
  {
    id: "LS_Q4", section: "Learning Style",
    question: "When presented with a complex problem, your first instinct is:",
    options: [
      { label: "Excited to explore multiple angles", traits: { creativity: 2, analytical: 2, innovation_drive: 1 } },
      { label: "Find the single right answer methodically", traits: { logical: 2, discipline: 1, analytical: 1 } },
      { label: "Ask what others think first", traits: { teamwork: 1, communication: 1 } },
      { label: "Feel overwhelmed and start small", traits: { stress_tolerance: -1, resilience: -1 } }
    ]
  }

];

// ── TRAIT RANGES for normalization ─────────────────────────────────────────────
export const traitRanges = {
  logical:                    { min: 0,  max: 12 },
  analytical:                 { min: 0,  max: 14 },
  numerical:                  { min: 0,  max: 12 },
  verbal:                     { min: 0,  max: 10 },
  spatial:                    { min: 0,  max: 13 },
  creativity:                 { min: 0,  max: 10 },
  discipline:                 { min: -4, max: 8  },
  resilience:                 { min: -6, max: 8  },
  independence:               { min: 0,  max: 10 },
  adaptability:               { min: 0,  max: 10 },
  growth_mindset:             { min: 0,  max: 6  },
  risk_appetite:              { min: -2, max: 9  },
  depth_focus:                { min: 0,  max: 12 },
  confidence:                 { min: -1, max: 7  },
  stress_tolerance:           { min: -2, max: 4  },
  accountability:             { min: -2, max: 9  },
  initiative:                 { min: -1, max: 8  },
  problem_solving:            { min: 0,  max: 4  },
  communication:              { min: 0,  max: 9  },
  leadership:                 { min: 0,  max: 10 },
  teamwork:                   { min: 0,  max: 6  },
  empathy:                    { min: 0,  max: 9  },
  emotional_intelligence:     { min: 0,  max: 6  },
  helping_orientation:        { min: 0,  max: 10 },
  intrinsic_motivation:       { min: -2, max: 10 },
  purpose_drive:              { min: 0,  max: 10 },
  passion_signal:             { min: -2, max: 8  },
  fear_avoidance:             { min: 0,  max: 8  },
  learning_orientation:       { min: 0,  max: 8  },
  suppression_signal:         { min: -1, max: 6  },
  pressure_conformity:        { min: 0,  max: 8  },
  childhood_divergence:       { min: 0,  max: 8  },
  self_awareness:             { min: -3, max: 9  },
  societal_impact_awareness:  { min: 0,  max: 12 },
  innovation_drive:           { min: 0,  max: 10 },
  legacy_thinking:            { min: 0,  max: 9  },
};
