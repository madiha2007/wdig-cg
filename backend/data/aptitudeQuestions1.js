// ============================================================
//  WDIG Career Guidance — aptitudeQuestions.js  (v3)
//  Place this at:  backend/data/aptitudeQuestions.js
//
//  Replaces BOTH your old aptitudeQuestions.js
//  AND personalityQuestions.js — everything is here now.
//
//  Total: 60 questions across 7 sections
// ============================================================

export const aptitudeQuestions = [

  // ╔══════════════════════════════════════════════╗
  // ║  SECTION 1 — LOGICAL REASONING (5)           ║
  // ╚══════════════════════════════════════════════╝

  {
    id: "LR_Q1", section: "Logical Reasoning", level: 1,
    question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?",
    options: ["Yes", "No", "Cannot be determined", "Only sometimes"],
    correctOption: 0,
    traits: { logical: 2, analytical: 1 }
  },
  {
    id: "LR_Q2", section: "Logical Reasoning", level: 1,
    question: "Which number completes the series: 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "34"],
    correctOption: 2,
    traits: { logical: 2 }
  },
  {
    id: "LR_Q3", section: "Logical Reasoning", level: 1,
    question: "Statements: All apples are fruits. Some fruits are sweet. Conclusion: Some apples are sweet.",
    options: ["True", "False", "Uncertain", "Invalid"],
    correctOption: 2,
    traits: { logical: 2, analytical: 1 }
  },
  {
    id: "LR_Q4", section: "Logical Reasoning", level: 2,
    question: "A sequence follows ×2, +3 alternately. What comes after 5 → 13 → 29?",
    options: ["59", "61", "62", "65"],
    correctOption: 1,
    traits: { logical: 3, analytical: 2 }
  },
  {
    id: "LR_Q5", section: "Logical Reasoning", level: 2,
    question: "Five people sit in a row. A is left of B, C is right of B. Who is in the middle?",
    options: ["A", "B", "C", "Cannot be determined"],
    correctOption: 1,
    traits: { logical: 3, analytical: 2 }
  },

  // ╔══════════════════════════════════════════════╗
  // ║  SECTION 2 — QUANTITATIVE APTITUDE (5)       ║
  // ╚══════════════════════════════════════════════╝

  {
    id: "QA_Q1", section: "Quantitative Aptitude", level: 1,
    question: "What is 20% of 200?",
    options: ["20", "30", "40", "50"],
    correctOption: 2,
    traits: { numerical: 2 }
  },
  {
    id: "QA_Q2", section: "Quantitative Aptitude", level: 1,
    question: "If x = 5, what is 2x + 3?",
    options: ["10", "11", "13", "15"],
    correctOption: 2,
    traits: { numerical: 2 }
  },
  {
    id: "QA_Q3", section: "Quantitative Aptitude", level: 1,
    question: "Which is greater: 3/4 or 2/3?",
    options: ["3/4", "2/3", "Equal", "Cannot say"],
    correctOption: 0,
    traits: { numerical: 1, analytical: 1 }
  },
  {
    id: "QA_Q4", section: "Quantitative Aptitude", level: 2,
    question: "If the ratio of boys to girls is 3:2 and total students are 50, how many boys?",
    options: ["20", "25", "30", "35"],
    correctOption: 2,
    traits: { numerical: 3 }
  },
  {
    id: "QA_Q5", section: "Quantitative Aptitude", level: 2,
    question: "Cost price = ₹400, selling price = ₹500. What is the profit percentage?",
    options: ["20%", "25%", "30%", "40%"],
    correctOption: 1,
    traits: { numerical: 3, analytical: 1 }
  },

  // ╔══════════════════════════════════════════════╗
  // ║  SECTION 3 — VERBAL ABILITY (5)              ║
  // ╚══════════════════════════════════════════════╝

  {
    id: "VA_Q1", section: "Verbal Ability", level: 1,
    question: "Choose the synonym of 'Happy'.",
    options: ["Sad", "Angry", "Joyful", "Tired"],
    correctOption: 2,
    traits: { verbal: 2 }
  },
  {
    id: "VA_Q2", section: "Verbal Ability", level: 1,
    question: "Which sentence is grammatically correct?",
    options: ["He don't like tea", "He doesn't likes tea", "He doesn't like tea", "He don't likes tea"],
    correctOption: 2,
    traits: { verbal: 2 }
  },
  {
    id: "VA_Q3", section: "Verbal Ability", level: 2,
    question: "Choose the best tone for a professional email.",
    options: ["Send this now", "Why is this late?", "Please share the update by today", "Do it fast"],
    correctOption: 2,
    traits: { verbal: 2, communication: 3, emotional_intelligence: 1 }
  },
  {
    id: "VA_Q4", section: "Verbal Ability", level: 2,
    question: "Identify the figure of speech: 'Time is a thief'.",
    options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
    correctOption: 1,
    traits: { verbal: 3, creativity: 1 }
  },
  {
    id: "VA_Q5", section: "Verbal Ability", level: 2,
    question: "Which option best summarizes a paragraph?",
    options: ["Repeats details", "Adds opinion", "Captures main idea", "Quotes sentences"],
    correctOption: 2,
    traits: { verbal: 3, analytical: 1 }
  },

  // ╔══════════════════════════════════════════════╗
  // ║  SECTION 4 — SPATIAL REASONING (5)           ║
  // ╚══════════════════════════════════════════════╝

  {
    id: "SR_Q1", section: "Spatial Reasoning", level: 1,
    question: "How many faces does a cube have?",
    options: ["4", "5", "6", "8"],
    correctOption: 2,
    traits: { spatial: 2 }
  },
  {
    id: "SR_Q2", section: "Spatial Reasoning", level: 1,
    question: "A clock rotated 180° will appear?",
    options: ["Same", "Upside down", "Mirror image", "Sideways"],
    correctOption: 1,
    traits: { spatial: 2 }
  },
  {
    id: "SR_Q3", section: "Spatial Reasoning", level: 1,
    question: "Which net can form a cube?",
    options: ["All squares", "6 connected squares", "Any rectangle", "5 squares"],
    correctOption: 1,
    traits: { spatial: 2 }
  },
  {
    id: "SR_Q4", section: "Spatial Reasoning", level: 2,
    question: "A cube painted on all sides is cut into 27 smaller cubes. How many have paint on exactly one face?",
    options: ["6", "8", "12", "18"],
    correctOption: 2,
    traits: { spatial: 3, analytical: 2 }
  },
  {
    id: "SR_Q5", section: "Spatial Reasoning", level: 2,
    question: "How many faces does a triangular prism have?",
    options: ["3", "4", "5", "6"],
    correctOption: 2,
    traits: { spatial: 3 }
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  SECTION 5 — PERSONALITY & WORK STYLE (10)                  ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "PW_Q1", section: "Personality & Work Style", level: 1,
    question: "In a group task, you usually:",
    options: [
      { label: "Lead the team",        traits: { leadership: 2, confidence: 1 } },
      { label: "Support others",       traits: { teamwork: 2, empathy: 1 } },
      { label: "Work independently",   traits: { independence: 2 } },
      { label: "Avoid involvement",    traits: { discipline: -2, intrinsic_motivation: -1 } }
    ]
  },
  {
    id: "PW_Q2", section: "Personality & Work Style", level: 1,
    question: "You prefer tasks that are:",
    options: [
      { label: "Challenging & complex",    traits: { growth_mindset: 2, confidence: 1 } },
      { label: "Routine & structured",     traits: { discipline: 2 } },
      { label: "Unclear & exploratory",    traits: { adaptability: 2, risk_appetite: 1 } },
      { label: "Easy to finish quickly",   traits: { depth_focus: -1, intrinsic_motivation: -1 } }
    ]
  },
  {
    id: "PW_Q3", section: "Personality & Work Style", level: 1,
    question: "When facing a difficult problem, you:",
    options: [
      { label: "Dive in immediately",               traits: { problem_solving: 2, initiative: 2 } },
      { label: "Seek help from others",             traits: { teamwork: 1, communication: 1 } },
      { label: "Wait for someone else to solve it", traits: { initiative: -2 } },
      { label: "Abandon the problem",               traits: { resilience: -3, accountability: -1 } }
    ]
  },
  {
    id: "PW_Q4", section: "Personality & Work Style", level: 1,
    question: "You feel most productive when:",
    options: [
      { label: "Working under pressure",   traits: { stress_tolerance: 2, resilience: 1 } },
      { label: "Following a clear plan",   traits: { discipline: 2 } },
      { label: "Working alone quietly",    traits: { independence: 2 } },
      { label: "No one is watching",       traits: { accountability: -2 } }
    ]
  },
  {
    id: "PW_Q5", section: "Personality & Work Style", level: 1,
    question: "When you receive critical feedback, you:",
    options: [
      { label: "Use it to improve",         traits: { growth_mindset: 2, emotional_intelligence: 1 } },
      { label: "Feel bad but move on",      traits: { resilience: 1 } },
      { label: "Dismiss it",                traits: { accountability: -2, growth_mindset: -1 } },
      { label: "Stop working entirely",     traits: { resilience: -3, intrinsic_motivation: -2 } }
    ]
  },
  {
    id: "PW_Q6", section: "Personality & Work Style", level: 1,
    question: "Under stress, you typically:",
    options: [
      { label: "Plan your way out",       traits: { emotional_intelligence: 2, discipline: 1 } },
      { label: "Talk to someone",         traits: { communication: 2, empathy: 1 } },
      { label: "Complain or vent",        traits: { emotional_intelligence: -2, resilience: -1 } },
      { label: "Shut down completely",    traits: { resilience: -3, discipline: -2 } }
    ]
  },
  {
    id: "PW_Q7", section: "Personality & Work Style", level: 2,
    question: "A project is failing close to the deadline. You:",
    options: [
      { label: "Blame the team",            traits: { accountability: -3, leadership: -1 } },
      { label: "Re-plan and take charge",   traits: { leadership: 3, problem_solving: 2, resilience: 1 } },
      { label: "Wait and hope it resolves", traits: { initiative: -2 } },
      { label: "Quietly exit",              traits: { resilience: -3, accountability: -2 } }
    ]
  },
  {
    id: "PW_Q8", section: "Personality & Work Style", level: 2,
    question: "You strongly disagree with a decision made by your manager. You:",
    options: [
      { label: "Argue loudly",                  traits: { communication: -2, emotional_intelligence: -2 } },
      { label: "Stay silent and comply",         traits: { confidence: -2, suppression_signal: 1 } },
      { label: "Calmly explain your reasoning",  traits: { communication: 3, emotional_intelligence: 2, confidence: 1 } },
      { label: "Ignore and do your own thing",   traits: { accountability: -2, independence: 1 } }
    ]
  },
  {
    id: "PW_Q9", section: "Personality & Work Style", level: 2,
    question: "How do you typically handle failure?",
    options: [
      { label: "Give up",                          traits: { resilience: -3, growth_mindset: -2 } },
      { label: "Reflect and try differently",      traits: { resilience: 3, growth_mindset: 2, analytical: 1 } },
      { label: "Blame external factors",           traits: { accountability: -3 } },
      { label: "Ignore it and move on",            traits: { growth_mindset: -1, emotional_intelligence: -1 } }
    ]
  },
  {
    id: "PW_Q10", section: "Personality & Work Style", level: 2,
    question: "You are given a completely ambiguous task with no instructions. You:",
    options: [
      { label: "Wait for clarity",       traits: { initiative: -2 } },
      { label: "Clarify, then plan",     traits: { initiative: 3, problem_solving: 2, communication: 1 } },
      { label: "Guess and proceed",      traits: { risk_appetite: 2, analytical: -1 } },
      { label: "Avoid it entirely",      traits: { accountability: -2, resilience: -1 } }
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  SECTION 6 — MOTIVATION & PASSION (10)                      ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "MP_Q1", section: "Motivation & Passion", level: 1,
    question: "When you work on something you truly love, time:",
    options: [
      { label: "Flies — I completely lose track",   traits: { intrinsic_motivation: 3, passion_signal: 2 } },
      { label: "Passes normally",                   traits: { intrinsic_motivation: 1 } },
      { label: "Drags slowly",                      traits: { intrinsic_motivation: -1 } },
      { label: "I rarely enjoy any work",           traits: { intrinsic_motivation: -2, passion_signal: -1 } }
    ]
  },
  {
    id: "MP_Q2", section: "Motivation & Passion", level: 1,
    question: "What mostly drives you to achieve something?",
    options: [
      { label: "I genuinely want to master it",        traits: { intrinsic_motivation: 3, growth_mindset: 1 } },
      { label: "Recognition and praise from others",   traits: { intrinsic_motivation: -1, leadership: 1 } },
      { label: "Avoiding failure or shame",            traits: { fear_avoidance: 3, suppression_signal: 1 } },
      { label: "Pressure from family or peers",        traits: { pressure_conformity: 3, fear_avoidance: 1 } }
    ]
  },
  {
    id: "MP_Q3", section: "Motivation & Passion", level: 1,
    question: "When nobody is watching or grading you, you:",
    options: [
      { label: "Still put in full effort",         traits: { intrinsic_motivation: 3, discipline: 2 } },
      { label: "Do just enough to get by",         traits: { intrinsic_motivation: 0 } },
      { label: "Barely do anything",               traits: { discipline: -2, intrinsic_motivation: -1 } },
      { label: "Work harder — I love the freedom", traits: { intrinsic_motivation: 3, independence: 2 } }
    ]
  },
  {
    id: "MP_Q4", section: "Motivation & Passion", level: 1,
    question: "When you imagine your ideal future, it looks like:",
    options: [
      { label: "A career I'm genuinely obsessed with", traits: { passion_signal: 3, purpose_drive: 2 } },
      { label: "Financial security above everything",  traits: { fear_avoidance: 2, purpose_drive: -1 } },
      { label: "Whatever makes my family proud",       traits: { pressure_conformity: 3, suppression_signal: 2 } },
      { label: "I haven't really thought about it",   traits: { purpose_drive: -1, passion_signal: -1 } }
    ]
  },
  {
    id: "MP_Q5", section: "Motivation & Passion", level: 1,
    question: "When you start a new project, the first thing you feel is:",
    options: [
      { label: "Excitement and curiosity",          traits: { intrinsic_motivation: 2, creativity: 1, growth_mindset: 1 } },
      { label: "Anxiety about failing",             traits: { fear_avoidance: 2, resilience: -1 } },
      { label: "Wondering what others will think",  traits: { pressure_conformity: 2 } },
      { label: "Indifference",                      traits: { intrinsic_motivation: -2 } }
    ]
  },
  {
    id: "MP_Q6", section: "Motivation & Passion", level: 1,
    question: "Your energy at the end of a day is highest when you:",
    options: [
      { label: "Solved a hard problem",        traits: { intrinsic_motivation: 2, analytical: 1, problem_solving: 1 } },
      { label: "Helped someone effectively",   traits: { helping_orientation: 2, empathy: 1 } },
      { label: "Created something new",        traits: { creativity: 2, innovation_drive: 1 } },
      { label: "Just finished and clocked out",traits: { intrinsic_motivation: -2 } }
    ]
  },
  {
    id: "MP_Q7", section: "Motivation & Passion", level: 2,
    question: "If money were not a concern, you would spend your days:",
    options: [
      { label: "Doing exactly what I do now",           traits: { intrinsic_motivation: 3, passion_signal: 3 } },
      { label: "Pursuing a completely different path",  traits: { suppression_signal: 3, childhood_divergence: 2 } },
      { label: "Helping communities or causes",         traits: { societal_impact_awareness: 3, helping_orientation: 2 } },
      { label: "Creating art, music, or stories",       traits: { creativity: 3, passion_signal: 2, suppression_signal: 1 } }
    ]
  },
  {
    id: "MP_Q8", section: "Motivation & Passion", level: 2,
    question: "You chose your current educational path because:",
    options: [
      { label: "It genuinely excites me",            traits: { intrinsic_motivation: 3, passion_signal: 2 } },
      { label: "It has good job prospects",          traits: { fear_avoidance: 2 } },
      { label: "My parents or peers suggested it",   traits: { pressure_conformity: 3, suppression_signal: 2 } },
      { label: "I had no strong preference",         traits: { passion_signal: -1, purpose_drive: -1 } }
    ]
  },
  {
    id: "MP_Q9", section: "Motivation & Passion", level: 2,
    question: "When you achieve a big goal, you mostly feel:",
    options: [
      { label: "Deep personal satisfaction",                    traits: { intrinsic_motivation: 3, purpose_drive: 1 } },
      { label: "Relief that it's finally over",                 traits: { fear_avoidance: 2 } },
      { label: "Need for others to notice and validate it",     traits: { pressure_conformity: 2, confidence: -1 } },
      { label: "Already thinking about the next challenge",     traits: { growth_mindset: 3, intrinsic_motivation: 2 } }
    ]
  },
  {
    id: "MP_Q10", section: "Motivation & Passion", level: 2,
    question: "The idea of a risky but deeply meaningful career feels:",
    options: [
      { label: "Exciting — completely worth it",        traits: { risk_appetite: 3, purpose_drive: 2, intrinsic_motivation: 1 } },
      { label: "Too unstable — I'd avoid it",           traits: { fear_avoidance: 3, risk_appetite: -1 } },
      { label: "I'd try it only if others approved",    traits: { pressure_conformity: 2, confidence: -1 } },
      { label: "I've never thought about meaning",      traits: { purpose_drive: -2, passion_signal: -1 } }
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  SECTION 7 — SUPPRESSION & SELF-AWARENESS (10)              ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "SA_Q1", section: "Suppression & Self-Awareness", level: 1,
    question: "As a child, you were most drawn to:",
    options: [
      { label: "Science, invention, or how things work",  traits: { logical: 1, innovation_drive: 1, childhood_divergence: 1 } },
      { label: "Art, music, stories, or performance",     traits: { creativity: 1, suppression_signal: 1, childhood_divergence: 1 } },
      { label: "Helping, healing, or teaching others",    traits: { helping_orientation: 1, empathy: 1, childhood_divergence: 1 } },
      { label: "Exploring, sports, or adventure",         traits: { risk_appetite: 1, adaptability: 1, childhood_divergence: 1 } }
    ]
  },
  {
    id: "SA_Q2", section: "Suppression & Self-Awareness", level: 1,
    question: "How different is your childhood dream from your current path?",
    options: [
      { label: "Very similar — I'm living it",   traits: { childhood_divergence: 0, suppression_signal: 0 } },
      { label: "Somewhat different",             traits: { childhood_divergence: 1, suppression_signal: 1 } },
      { label: "Completely different",           traits: { childhood_divergence: 3, suppression_signal: 2 } },
      { label: "I never had a clear dream",      traits: { childhood_divergence: 0, purpose_drive: -1 } }
    ]
  },
  {
    id: "SA_Q3", section: "Suppression & Self-Awareness", level: 1,
    question: "Was there ever something you loved doing that you stopped because others disapproved?",
    options: [
      { label: "Yes, and I still miss it deeply",  traits: { suppression_signal: 3, pressure_conformity: 2, childhood_divergence: 2 } },
      { label: "Yes, but I moved past it",         traits: { suppression_signal: 2, resilience: 1 } },
      { label: "Not really",                       traits: { suppression_signal: 0 } },
      { label: "I've always done what I love",     traits: { intrinsic_motivation: 2, independence: 1 } }
    ]
  },
  {
    id: "SA_Q4", section: "Suppression & Self-Awareness", level: 1,
    question: "People who know you best say your greatest strength is:",
    options: [
      { label: "Creative or artistic ability",              traits: { creativity: 2, suppression_signal: 1 } },
      { label: "Problem-solving or analytical thinking",    traits: { analytical: 2, logical: 1 } },
      { label: "Connecting with and understanding people",  traits: { empathy: 2, communication: 1 } },
      { label: "Leadership and forward thinking",           traits: { leadership: 2, purpose_drive: 1 } }
    ]
  },
  {
    id: "SA_Q5", section: "Suppression & Self-Awareness", level: 1,
    question: "Do you feel aligned with where you are in life right now?",
    options: [
      { label: "Yes, completely",                         traits: { purpose_drive: 2, suppression_signal: 0 } },
      { label: "Mostly, but something feels off",         traits: { suppression_signal: 2, self_awareness: 2 } },
      { label: "No — I feel like I'm missing something",  traits: { suppression_signal: 3, childhood_divergence: 1 } },
      { label: "I've never stopped to think about it",    traits: { self_awareness: -1, purpose_drive: -1 } }
    ]
  },
  {
    id: "SA_Q6", section: "Suppression & Self-Awareness", level: 1,
    question: "When you imagine a career you'd truly love, what stops you?",
    options: [
      { label: "Nothing — I'm already pursuing it",          traits: { intrinsic_motivation: 2, confidence: 1 } },
      { label: "Fear of failure or financial instability",   traits: { fear_avoidance: 3, suppression_signal: 2 } },
      { label: "Family expectations or social pressure",     traits: { pressure_conformity: 3, suppression_signal: 2 } },
      { label: "I'm not sure what I'd truly love",           traits: { self_awareness: -1, purpose_drive: -1 } }
    ]
  },
  {
    id: "SA_Q7", section: "Suppression & Self-Awareness", level: 2,
    question: "If a close friend said 'You were born to do X' — something you'd never considered — you would:",
    options: [
      { label: "Be curious and explore it",          traits: { self_awareness: 2, growth_mindset: 2, adaptability: 1 } },
      { label: "Dismiss it — I know myself",         traits: { self_awareness: -1 } },
      { label: "Feel deeply seen — that resonates",  traits: { suppression_signal: 3, self_awareness: 2 } },
      { label: "Feel anxious about changing course", traits: { fear_avoidance: 2, adaptability: -1 } }
    ]
  },
  {
    id: "SA_Q8", section: "Suppression & Self-Awareness", level: 2,
    question: "Is there a career that excites you that you've never told anyone about?",
    options: [
      { label: "Yes — I've kept it completely to myself",   traits: { suppression_signal: 3, fear_avoidance: 2, pressure_conformity: 1 } },
      { label: "I've shared it but been discouraged",       traits: { suppression_signal: 2, pressure_conformity: 2 } },
      { label: "I openly pursue what I love",               traits: { intrinsic_motivation: 2, confidence: 1 } },
      { label: "I have no secret interests",                traits: { suppression_signal: 0 } }
    ]
  },
  {
    id: "SA_Q9", section: "Suppression & Self-Awareness", level: 2,
    question: "Looking back, your biggest life decisions were mostly shaped by:",
    options: [
      { label: "What genuinely excited me",          traits: { intrinsic_motivation: 3, passion_signal: 2 } },
      { label: "What seemed safe or stable",         traits: { fear_avoidance: 3 } },
      { label: "What others expected of me",         traits: { pressure_conformity: 3, suppression_signal: 2 } },
      { label: "A mix of all of the above",          traits: { self_awareness: 2 } }
    ]
  },
  {
    id: "SA_Q10", section: "Suppression & Self-Awareness", level: 2,
    question: "If you could restart your educational journey with complete freedom, you would:",
    options: [
      { label: "Choose exactly the same path",                      traits: { intrinsic_motivation: 2, passion_signal: 1 } },
      { label: "Choose something completely different",             traits: { suppression_signal: 3, childhood_divergence: 3 } },
      { label: "Explore more creative or unconventional paths",     traits: { creativity: 2, suppression_signal: 2, risk_appetite: 1 } },
      { label: "I don't know — I've never imagined that",          traits: { self_awareness: -1, purpose_drive: -1 } }
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  SECTION 8 — SOCIAL CONTRIBUTION & VALUES (6)               ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "CV_Q1", section: "Social Contribution & Values", level: 1,
    question: "The most important thing a career should give you is:",
    options: [
      { label: "Financial wealth",              traits: { fear_avoidance: 1, purpose_drive: -1 } },
      { label: "Meaning and purpose",           traits: { purpose_drive: 3, societal_impact_awareness: 1 } },
      { label: "Status and recognition",        traits: { leadership: 1, purpose_drive: -1 } },
      { label: "Freedom and flexibility",       traits: { independence: 2, risk_appetite: 1 } }
    ]
  },
  {
    id: "CV_Q2", section: "Social Contribution & Values", level: 1,
    question: "You feel most proud of yourself when you:",
    options: [
      { label: "Helped someone overcome a real challenge",  traits: { helping_orientation: 3, empathy: 2 } },
      { label: "Built or created something original",       traits: { creativity: 2, innovation_drive: 2 } },
      { label: "Solved a genuinely complex problem",        traits: { analytical: 2, problem_solving: 2 } },
      { label: "Won a competition or received an award",    traits: { leadership: 1, confidence: 1 } }
    ]
  },
  {
    id: "CV_Q3", section: "Social Contribution & Values", level: 1,
    question: "If you could use your skills to change one thing, it would be:",
    options: [
      { label: "Healthcare or mental health",      traits: { helping_orientation: 3, empathy: 2, societal_impact_awareness: 2 } },
      { label: "Education and knowledge equity",   traits: { helping_orientation: 2, societal_impact_awareness: 2, legacy_thinking: 1 } },
      { label: "Climate and environment",          traits: { societal_impact_awareness: 3, innovation_drive: 2 } },
      { label: "Technology and innovation",        traits: { innovation_drive: 3, logical: 1 } }
    ]
  },
  {
    id: "CV_Q4", section: "Social Contribution & Values", level: 2,
    question: "You would rather leave behind:",
    options: [
      { label: "A product millions use daily",                       traits: { innovation_drive: 3, legacy_thinking: 2 } },
      { label: "Lives you've meaningfully changed",                  traits: { helping_orientation: 3, empathy: 2, legacy_thinking: 2 } },
      { label: "Knowledge or art that inspires future generations",  traits: { creativity: 2, legacy_thinking: 3 } },
      { label: "Significant personal wealth",                        traits: { purpose_drive: -1 } }
    ]
  },
  {
    id: "CV_Q5", section: "Social Contribution & Values", level: 2,
    question: "The kind of work that excites you most involves:",
    options: [
      { label: "Inventing or building new things",       traits: { innovation_drive: 3, creativity: 2 } },
      { label: "Understanding and serving people",       traits: { helping_orientation: 3, empathy: 2 } },
      { label: "Discovering truth through research",     traits: { analytical: 3, logical: 2 } },
      { label: "Leading change at large scale",          traits: { leadership: 3, societal_impact_awareness: 2 } }
    ]
  },
  {
    id: "CV_Q6", section: "Social Contribution & Values", level: 2,
    question: "If your career didn't pay well but had enormous social impact, you would:",
    options: [
      { label: "Still pursue it wholeheartedly",               traits: { purpose_drive: 3, societal_impact_awareness: 3, fear_avoidance: -1 } },
      { label: "Only if it becomes financially viable",        traits: { fear_avoidance: 2 } },
      { label: "Look for a balance between impact and income", traits: { analytical: 1, adaptability: 1 } },
      { label: "Prioritize income — impact can wait",          traits: { purpose_drive: -2, fear_avoidance: 2 } }
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  SECTION 9 — LEARNING STYLE & THINKING DEPTH (4)            ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "LS_Q1", section: "Learning Style & Thinking Depth", level: 1,
    question: "You are more naturally a:",
    options: [
      { label: "Specialist — go very deep into one thing",      traits: { depth_focus: 3, analytical: 1 } },
      { label: "Generalist — broad across many areas",          traits: { depth_focus: -1, adaptability: 2, creativity: 1 } },
      { label: "Both, depending on the situation",              traits: { depth_focus: 1, adaptability: 1 } },
      { label: "I've never thought about this",                 traits: { self_awareness: -1 } }
    ]
  },
  {
    id: "LS_Q2", section: "Learning Style & Thinking Depth", level: 1,
    question: "When you encounter a topic that confuses you, you:",
    options: [
      { label: "Dig deeper until you truly understand",  traits: { depth_focus: 3, growth_mindset: 2 } },
      { label: "Ask someone to explain it simply",       traits: { communication: 1, teamwork: 1 } },
      { label: "Move on and come back later",            traits: { adaptability: 1 } },
      { label: "Avoid it if possible",                   traits: { growth_mindset: -2, learning_orientation: -2 } }
    ]
  },
  {
    id: "LS_Q3", section: "Learning Style & Thinking Depth", level: 2,
    question: "How do you feel about working on things that have never been done before?",
    options: [
      { label: "It's what I live for",                      traits: { innovation_drive: 3, risk_appetite: 2, creativity: 2 } },
      { label: "Interesting but I prefer proven methods",   traits: { risk_appetite: -1, depth_focus: 1 } },
      { label: "Nervous — I prefer structure and clarity",  traits: { adaptability: -2, fear_avoidance: 1 } },
      { label: "I'd try it if I had enough support",        traits: { growth_mindset: 1, confidence: -1 } }
    ]
  },
  {
    id: "LS_Q4", section: "Learning Style & Thinking Depth", level: 2,
    question: "When given a question with no clear right answer, you feel:",
    options: [
      { label: "Energized — I love the ambiguity",             traits: { analytical: 2, risk_appetite: 2, growth_mindset: 2 } },
      { label: "Frustrated but I push through anyway",         traits: { resilience: 2, growth_mindset: 1 } },
      { label: "Uncomfortable — I prefer clear answers",       traits: { adaptability: -1, risk_appetite: -1 } },
      { label: "Excited to explore multiple angles",           traits: { creativity: 2, analytical: 2, depth_focus: 1 } }
    ]
  }

];