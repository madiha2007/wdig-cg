/* ============================
   5. PERSONALITY & WORK STYLE
   ============================ */

export const personalityWorkStyleQuestions = [

  // ---------- LEVEL 1 ----------
  {
    id: "PW_L1_Q1",
    section: "Personality & Work Style",
    level: 1,
    question: "In a group task, you usually:",
    options: [
      { label: "Lead", traits: { leadership: 2, confidence: 1 } },
      { label: "Support", traits: { teamwork: 2 } },
      { label: "Work alone", traits: { independence: 2 } },
      { label: "Avoid work", traits: { discipline: -2 } }
    ]
  },

  {
    id: "PW_L1_Q2",
    section: "Personality & Work Style",
    level: 1,
    question: "You prefer tasks that are:",
    options: [
      { label: "Challenging", traits: { confidence: 2, growth_mindset: 1 } },
      { label: "Routine", traits: { discipline: 2 } },
      { label: "Unclear", traits: { adaptability: -1 } },
      { label: "Avoidable", traits: { motivation: -2 } }
    ]
  },

  {
    id: "PW_L1_Q3",
    section: "Personality & Work Style",
    level: 1,
    question: "When facing a problem, you:",
    options: [
      { label: "Try immediately", traits: { problem_solving: 2, initiative: 1 } },
      { label: "Ask for help", traits: { teamwork: 1, communication: 1 } },
      { label: "Wait", traits: { initiative: -1 } },
      { label: "Quit", traits: { resilience: -2 } }
    ]
  },

  {
    id: "PW_L1_Q4",
    section: "Personality & Work Style",
    level: 1,
    question: "You feel most productive when:",
    options: [
      { label: "Under pressure", traits: { stress_tolerance: 2 } },
      { label: "With clear goals", traits: { discipline: 2, planning: 1 } },
      { label: "Alone", traits: { independence: 1 } },
      { label: "Unsupervised", traits: { accountability: -1 } }
    ]
  },

  {
    id: "PW_L1_Q5",
    section: "Personality & Work Style",
    level: 1,
    question: "Feedback helps you:",
    options: [
      { label: "Improve", traits: { growth_mindset: 2 } },
      { label: "Feel bad", traits: { emotional_intelligence: -1 } },
      { label: "Ignore", traits: { accountability: -2 } },
      { label: "Avoid work", traits: { motivation: -2 } }
    ]
  },

  {
    id: "PW_L1_Q6",
    section: "Personality & Work Style",
    level: 1,
    question: "You handle stress by:",
    options: [
      { label: "Planning", traits: { emotional_intelligence: 2, discipline: 1 } },
      { label: "Avoiding", traits: { resilience: -1 } },
      { label: "Complaining", traits: { emotional_intelligence: -2 } },
      { label: "Ignoring", traits: { discipline: -2 } }
    ]
  },

  // ---------- LEVEL 2 ----------
  {
    id: "PW_L2_Q1",
    section: "Personality & Work Style",
    level: 2,
    question: "A project is failing near deadline. You:",
    options: [
      { label: "Blame", traits: { accountability: -2 } },
      { label: "Re-plan & act", traits: { leadership: 3, problem_solving: 2 } },
      { label: "Wait", traits: { initiative: -2 } },
      { label: "Quit", traits: { resilience: -3 } }
    ]
  },

  {
    id: "PW_L2_Q2",
    section: "Personality & Work Style",
    level: 2,
    question: "You disagree with your manager. You:",
    options: [
      { label: "Argue", traits: { communication: -1, emotional_intelligence: -1 } },
      { label: "Stay silent", traits: { confidence: -1 } },
      { label: "Explain calmly", traits: { communication: 2, emotional_intelligence: 2 } },
      { label: "Ignore", traits: { professionalism: -2 } }
    ]
  },

  {
    id: "PW_L2_Q3",
    section: "Personality & Work Style",
    level: 2,
    question: "How do you handle failure?",
    options: [
      { label: "Give up", traits: { resilience: -3 } },
      { label: "Reflect & retry", traits: { resilience: 3, growth_mindset: 2 } },
      { label: "Blame others", traits: { accountability: -2 } },
      { label: "Ignore", traits: { learning_orientation: -2 } }
    ]
  },

  {
    id: "PW_L2_Q4",
    section: "Personality & Work Style",
    level: 2,
    question: "You are given an ambiguous task. You:",
    options: [
      { label: "Wait", traits: { initiative: -2 } },
      { label: "Clarify & plan", traits: { initiative: 3, problem_solving: 2 } },
      { label: "Guess", traits: { risk_management: -1 } },
      { label: "Avoid", traits: { responsibility: -2 } }
    ]
  }
];
