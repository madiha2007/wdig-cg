// Aptitude Questions – Insight-focused (Extended)
// 5 Sections × (6 Level 1 + 4 Level 2) = 50 Questions
// Trait-weighted for AI-based career mapping

//SR_L2_Q1...heheheh


export const aptitudeQuestions = [
  /* =========================
     1. LOGICAL REASONING (10)
     ========================= */
  { id: "LR_L1_Q1", section: "Logical Reasoning", level: 1, question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", options: ["Yes", "No", "Cannot be determined", "Only sometimes"], correctOption: 0, traits: { logical: 2, analytical: 1 } },
  // { id: "LR_L1_Q2", section: "Logical Reasoning", level: 1, question: "Which number completes the series: 2, 4, 8, 16, ?", options: ["18", "24", "32", "34"], correctOption: 2, traits: { logical: 2 } },
  // { id: "LR_L1_Q3", section: "Logical Reasoning", level: 1, question: "If today is Monday, what day will it be after 10 days?", options: ["Wednesday", "Thursday", "Friday", "Saturday"], correctOption: 1, traits: { logical: 1, analytical: 1 } },
  // { id: "LR_L1_Q4", section: "Logical Reasoning", level: 1, question: "Which one does not belong: Dog, Cat, Cow, Car?", options: ["Dog", "Cat", "Cow", "Car"], correctOption: 3, traits: { logical: 2 } },
  // { id: "LR_L1_Q5", section: "Logical Reasoning", level: 1, question: "Statements: All apples are fruits. Some fruits are sweet. Conclusion: Some apples are sweet.", options: ["True", "False", "Uncertain", "Invalid"], correctOption: 2, traits: { logical: 2, analytical: 1 } },
  // { id: "LR_L1_Q6", section: "Logical Reasoning", level: 1, question: "Find the odd one out: 3, 9, 27, 81, 100", options: ["3", "9", "27", "100"], correctOption: 3, traits: { logical: 2 } },

  { id: "LR_L2_Q1", section: "Logical Reasoning", level: 2, question: "A sequence follows ×2, +3 alternately. What is the next number after 5 → 13 → 29?", options: ["59", "61", "62", "65"], correctOption: 1, traits: { logical: 3, analytical: 2 } },
  // { id: "LR_L2_Q2", section: "Logical Reasoning", level: 2, question: "If A is taller than B and B is taller than C, which is always true?", options: ["C taller than A", "A taller than C", "B taller than A", "Cannot be determined"], correctOption: 1, traits: { logical: 3 } },
  // { id: "LR_L2_Q3", section: "Logical Reasoning", level: 2, question: "In a code language, CAT = 24. What is DOG? (A=1, B=2…)", options: ["26", "28", "30", "32"], correctOption: 0, traits: { logical: 3, analytical: 1 } },
  // { id: "LR_L2_Q4", section: "Logical Reasoning", level: 2, question: "Five people sit in a row. A is left of B, C is right of B. Who is in the middle?", options: ["A", "B", "C", "Cannot be determined"], correctOption: 1, traits: { logical: 3, analytical: 2 } },

  /* =========================
     2. QUANTITATIVE APTITUDE (10)
     ========================= */
  { id: "QA_L1_Q1", section: "Quantitative Aptitude", level: 1, question: "If a pen costs ₹10, what is the cost of 5 pens?", options: ["₹40", "₹50", "₹60", "₹70"], correctOption: 1, traits: { numerical: 2 } },
  // { id: "QA_L1_Q2", section: "Quantitative Aptitude", level: 1, question: "What is 20% of 200?", options: ["20", "30", "40", "50"], correctOption: 2, traits: { numerical: 2 } },
  // { id: "QA_L1_Q3", section: "Quantitative Aptitude", level: 1, question: "Which is greater: 3/4 or 2/3?", options: ["3/4", "2/3", "Equal", "Cannot say"], correctOption: 0, traits: { numerical: 1, analytical: 1 } },
  // { id: "QA_L1_Q4", section: "Quantitative Aptitude", level: 1, question: "If x = 5, what is 2x + 3?", options: ["10", "11", "13", "15"], correctOption: 2, traits: { numerical: 2 } },
  // { id: "QA_L1_Q5", section: "Quantitative Aptitude", level: 1, question: "What is the average of 2, 4, and 6?", options: ["3", "4", "5", "6"], correctOption: 1, traits: { numerical: 2 } },
  // { id: "QA_L1_Q6", section: "Quantitative Aptitude", level: 1, question: "If a dozen bananas cost ₹60, what is the cost of one banana?", options: ["₹4", "₹5", "₹6", "₹10"], correctOption: 1, traits: { numerical: 2 } },

  { id: "QA_L2_Q1", section: "Quantitative Aptitude", level: 2, question: "A train travels 120 km at two different speeds. What is the average speed formula used?", options: ["Arithmetic mean", "Harmonic mean", "Geometric mean", "Median"], correctOption: 1, traits: { numerical: 3, analytical: 2 } },
  // { id: "QA_L2_Q2", section: "Quantitative Aptitude", level: 2, question: "If the ratio of boys to girls is 3:2 and total students are 50, how many boys are there?", options: ["20", "25", "30", "35"], correctOption: 2, traits: { numerical: 3 } },
  // { id: "QA_L2_Q3", section: "Quantitative Aptitude", level: 2, question: "Simple interest on ₹1000 at 10% per annum for 2 years is?", options: ["₹100", "₹150", "₹200", "₹250"], correctOption: 2, traits: { numerical: 3 } },
  // { id: "QA_L2_Q4", section: "Quantitative Aptitude", level: 2, question: "If cost price = ₹400 and selling price = ₹500, what is the profit percentage?", options: ["20%", "25%", "30%", "40%"], correctOption: 1, traits: { numerical: 3, analytical: 1 } },

  /* =========================
     3. VERBAL ABILITY (10)
     ========================= */
  { id: "VA_L1_Q1", section: "Verbal Ability", level: 1, question: "Choose the synonym of 'Happy'.", options: ["Sad", "Angry", "Joyful", "Tired"], correctOption: 2, traits: { communication: 2 } },
  // { id: "VA_L1_Q2", section: "Verbal Ability", level: 1, question: "Choose the antonym of 'Strong'.", options: ["Powerful", "Weak", "Solid", "Brave"], correctOption: 1, traits: { communication: 2 } },
  // { id: "VA_L1_Q3", section: "Verbal Ability", level: 1, question: "Fill in the blank: She ___ to school every day.", options: ["go", "going", "goes", "gone"], correctOption: 2, traits: { comprehension: 2 } },
  // { id: "VA_L1_Q4", section: "Verbal Ability", level: 1, question: "Which word is correctly spelled?", options: ["Recieve", "Receive", "Receeve", "Receve"], correctOption: 1, traits: { comprehension: 1 } },
  // { id: "VA_L1_Q5", section: "Verbal Ability", level: 1, question: "Choose the correct plural of 'Child'.", options: ["Childs", "Childes", "Children", "Childrens"], correctOption: 2, traits: { comprehension: 2 } },
  // { id: "VA_L1_Q6", section: "Verbal Ability", level: 1, question: "Which sentence is grammatically correct?", options: ["He don't like tea", "He doesn't likes tea", "He doesn't like tea", "He don't likes tea"], correctOption: 2, traits: { comprehension: 2 } },

  { id: "VA_L2_Q1", section: "Verbal Ability", level: 2, question: "Choose the sentence with the best tone for a professional email.", options: ["Send this now", "Why is this late?", "Please share the update by today", "Do it fast"], correctOption: 2, traits: { communication: 3, emotional_intelligence: 1 } },
  // { id: "VA_L2_Q2", section: "Verbal Ability", level: 2, question: "Identify the figure of speech: 'Time is a thief'.", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], correctOption: 1, traits: { comprehension: 3 } },
  // { id: "VA_L2_Q3", section: "Verbal Ability", level: 2, question: "Choose the most concise sentence.", options: ["Due to the fact that", "Because", "Owing to the fact", "As a result of"], correctOption: 1, traits: { communication: 3 } },
  // { id: "VA_L2_Q4", section: "Verbal Ability", level: 2, question: "Which option best summarizes a paragraph?", options: ["Repeats details", "Adds opinion", "Captures main idea", "Quotes sentences"], correctOption: 2, traits: { comprehension: 3, analytical: 1 } },

  /* =========================
     4. SPATIAL REASONING (10)
     ========================= */
  { id: "SR_L1_Q1", section: "Spatial Reasoning", level: 1, question: "How many sides does a cube have?", options: ["4", "5", "6", "8"], correctOption: 2, traits: { spatial: 2 } },
  // { id: "SR_L1_Q2", section: "Spatial Reasoning", level: 1, question: "Which shape has all sides equal?", options: ["Rectangle", "Triangle", "Square", "Oval"], correctOption: 2, traits: { spatial: 2 } },
  // { id: "SR_L1_Q3", section: "Spatial Reasoning", level: 1, question: "Which object rolls easily?", options: ["Cube", "Cylinder", "Pyramid", "Cone"], correctOption: 1, traits: { spatial: 1 } },
  // { id: "SR_L1_Q4", section: "Spatial Reasoning", level: 1, question: "A clock rotated 180° will appear?", options: ["Same", "Upside down", "Mirror image", "Sideways"], correctOption: 1, traits: { spatial: 2 } },
  // { id: "SR_L1_Q5", section: "Spatial Reasoning", level: 1, question: "Which net can form a cube?", options: ["All squares", "6 connected squares", "Any rectangle", "5 squares"], correctOption: 1, traits: { spatial: 2 } },
  // { id: "SR_L1_Q6", section: "Spatial Reasoning", level: 1, question: "Which view shows the top of a pyramid?", options: ["Square", "Triangle", "Circle", "Hexagon"], correctOption: 1, traits: { spatial: 1 } },
//SR_L2_Q1...heheheh
  { id: "SR_L2_Q1", section: "Spatial Reasoning", level: 2, question: "A cube painted on all sides is cut into 27 cubes. How many have paint on exactly one face?", options: ["6", "8", "12", "18"], correctOption: 2, traits: { spatial: 3, analytical: 2 } },
  // { id: "SR_L2_Q2", section: "Spatial Reasoning", level: 2, question: "Which 3D shape has 1 vertex?", options: ["Cube", "Cone", "Cylinder", "Sphere"], correctOption: 1, traits: { spatial: 3 } },
  // { id: "SR_L2_Q3", section: "Spatial Reasoning", level: 2, question: "How many faces does a triangular prism have?", options: ["3", "4", "5", "6"], correctOption: 2, traits: { spatial: 3 } },
  // { id: "SR_L2_Q4", section: "Spatial Reasoning", level: 2, question: "Which rotation maps a shape onto itself?", options: ["90°", "180°", "270°", "None"], correctOption: 1, traits: { spatial: 3, analytical: 1 } },

  /* =========================
     5. PERSONALITY & WORK STYLE (10)
     ========================= */
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

  // {
  //   id: "PW_L1_Q2",
  //   section: "Personality & Work Style",
  //   level: 1,
  //   question: "You prefer tasks that are:",
  //   options: [
  //     { label: "Challenging", traits: { confidence: 2, growth_mindset: 1 } },
  //     { label: "Routine", traits: { discipline: 2 } },
  //     { label: "Unclear", traits: { adaptability: -1 } },
  //     { label: "Avoidable", traits: { motivation: -2 } }
  //   ]
  // },

  // {
  //   id: "PW_L1_Q3",
  //   section: "Personality & Work Style",
  //   level: 1,
  //   question: "When facing a problem, you:",
  //   options: [
  //     { label: "Try immediately", traits: { problem_solving: 2, initiative: 1 } },
  //     { label: "Ask for help", traits: { teamwork: 1, communication: 1 } },
  //     { label: "Wait", traits: { initiative: -1 } },
  //     { label: "Quit", traits: { resilience: -2 } }
  //   ]
  // },

  // {
  //   id: "PW_L1_Q4",
  //   section: "Personality & Work Style",
  //   level: 1,
  //   question: "You feel most productive when:",
  //   options: [
  //     { label: "Under pressure", traits: { stress_tolerance: 2 } },
  //     { label: "With clear goals", traits: { discipline: 2, planning: 1 } },
  //     { label: "Alone", traits: { independence: 1 } },
  //     { label: "Unsupervised", traits: { accountability: -1 } }
  //   ]
  // },

  // {
  //   id: "PW_L1_Q5",
  //   section: "Personality & Work Style",
  //   level: 1,
  //   question: "Feedback helps you:",
  //   options: [
  //     { label: "Improve", traits: { growth_mindset: 2 } },
  //     { label: "Feel bad", traits: { emotional_intelligence: -1 } },
  //     { label: "Ignore", traits: { accountability: -2 } },
  //     { label: "Avoid work", traits: { motivation: -2 } }
  //   ]
  // },

  // {
  //   id: "PW_L1_Q6",
  //   section: "Personality & Work Style",
  //   level: 1,
  //   question: "You handle stress by:",
  //   options: [
  //     { label: "Planning", traits: { emotional_intelligence: 2, discipline: 1 } },
  //     { label: "Avoiding", traits: { resilience: -1 } },
  //     { label: "Complaining", traits: { emotional_intelligence: -2 } },
  //     { label: "Ignoring", traits: { discipline: -2 } }
  //   ]
  // },

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

  // {
  //   id: "PW_L2_Q2",
  //   section: "Personality & Work Style",
  //   level: 2,
  //   question: "You disagree with your manager. You:",
  //   options: [
  //     { label: "Argue", traits: { communication: -1, emotional_intelligence: -1 } },
  //     { label: "Stay silent", traits: { confidence: -1 } },
  //     { label: "Explain calmly", traits: { communication: 2, emotional_intelligence: 2 } },
  //     { label: "Ignore", traits: { professionalism: -2 } }
  //   ]
  // },

  // {
  //   id: "PW_L2_Q3",
  //   section: "Personality & Work Style",
  //   level: 2,
  //   question: "How do you handle failure?",
  //   options: [
  //     { label: "Give up", traits: { resilience: -3 } },
  //     { label: "Reflect & retry", traits: { resilience: 3, growth_mindset: 2 } },
  //     { label: "Blame others", traits: { accountability: -2 } },
  //     { label: "Ignore", traits: { learning_orientation: -2 } }
  //   ]
  // },

  // {
  //   id: "PW_L2_Q4",
  //   section: "Personality & Work Style",
  //   level: 2,
  //   question: "You are given an ambiguous task. You:",
  //   options: [
  //     { label: "Wait", traits: { initiative: -2 } },
  //     { label: "Clarify & plan", traits: { initiative: 3, problem_solving: 2 } },
  //     { label: "Guess", traits: { risk_management: -1 } },
  //     { label: "Avoid", traits: { responsibility: -2 } }
  //   ]
  // }


];

// Total: 50 questions | 5 sections | 6 L1 + 4 L2 each
// Optimized for deep trait extraction & career prediction

// // Aptitude Questions – Insight-focused
// // 5 Sections × Level 1 & Level 2
// // Each question contributes weighted traits for career mapping

// export const aptitudeQuestions = [
//   /* =========================
//      1. LOGICAL REASONING
//      ========================= */
//   {
//     id: "LR_L1_Q1",
//     section: "Logical Reasoning",
//     level: 1,
//     question: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?",
//     options: ["Yes", "No", "Cannot be determined", "Only sometimes"],
//     correctOption: 0,
//     traits: { logical: 2, analytical: 1 }
//   },
//   {
//     id: "LR_L2_Q1",
//     section: "Logical Reasoning",
//     level: 2,
//     question: "A sequence follows the rule: ×2, +3, ×2, +3. What is the next number after 5 → 13 → 29 → ?",
//     options: ["61", "62", "59", "58"],
//     correctOption: 0,
//     traits: { logical: 3, analytical: 2 }
//   },

//   /* =========================
//      2. QUANTITATIVE APTITUDE
//      ========================= */
//   {
//     id: "QA_L1_Q1",
//     section: "Quantitative Aptitude",
//     level: 1,
//     question: "If a pen costs ₹10 and a notebook costs ₹30, how much will 3 pens and 2 notebooks cost?",
//     options: ["₹80", "₹90", "₹100", "₹110"],
//     correctOption: 2,
//     traits: { numerical: 2, analytical: 1 }
//   },
//   {
//     id: "QA_L2_Q1",
//     section: "Quantitative Aptitude",
//     level: 2,
//     question: "A train covers 60 km at 40 km/h and the next 60 km at 60 km/h. What is its average speed?",
//     options: ["48 km/h", "50 km/h", "52 km/h", "45 km/h"],
//     correctOption: 0,
//     traits: { numerical: 3, analytical: 2 }
//   },

//   /* =========================
//      3. VERBAL & COMMUNICATION
//      ========================= */
//   {
//     id: "VC_L1_Q1",
//     section: "Verbal Ability",
//     level: 1,
//     question: "Choose the word most similar in meaning to 'Resilient'.",
//     options: ["Weak", "Flexible", "Fragile", "Slow"],
//     correctOption: 1,
//     traits: { communication: 2, comprehension: 1 }
//   },
//   {
//     id: "VC_L2_Q1",
//     section: "Verbal Ability",
//     level: 2,
//     question: "Which sentence best improves clarity and tone?",
//     options: [
//       "I need the report fast.",
//       "Send the report now.",
//       "Could you please share the report by today?",
//       "Why is the report late?"
//     ],
//     correctOption: 2,
//     traits: { communication: 3, emotional_intelligence: 1 }
//   },

//   /* =========================
//      4. SPATIAL & VISUAL THINKING
//      ========================= */
//   {
//     id: "SV_L1_Q1",
//     section: "Spatial Reasoning",
//     level: 1,
//     question: "Which shape comes next if a square rotates 90° clockwise each step?",
//     options: ["Same orientation", "180° rotated", "90° rotated", "270° rotated"],
//     correctOption: 2,
//     traits: { spatial: 2, problem_solving: 1 }
//   },
//   {
//     id: "SV_L2_Q1",
//     section: "Spatial Reasoning",
//     level: 2,
//     question: "A cube is painted on all sides and cut into 27 smaller cubes. How many cubes have paint on exactly one face?",
//     options: ["6", "8", "12", "18"],
//     correctOption: 2,
//     traits: { spatial: 3, analytical: 2 }
//   },

//   /* =========================
//      5. PERSONALITY & WORK STYLE
//      ========================= */
//   {
//     id: "PW_L1_Q1",
//     section: "Personality & Work Style",
//     level: 1,
//     question: "When working in a team, you prefer to:",
//     options: [
//       "Take charge and lead",
//       "Support others quietly",
//       "Work independently",
//       "Avoid responsibility"
//     ],
//     correctOption: 0,
//     traits: { leadership: 2, confidence: 1 }
//   },
//   {
//     id: "PW_L2_Q1",
//     section: "Personality & Work Style",
//     level: 2,
//     question: "If a project is failing close to the deadline, what do you do first?",
//     options: [
//       "Blame poor planning",
//       "Re-plan and redistribute tasks",
//       "Wait for instructions",
//       "Quit the task"
//     ],
//     correctOption: 1,
//     traits: { leadership: 3, problem_solving: 2, emotional_intelligence: 1 }
//   }
// ];

// // Total questions: 10
// // Sections: 5 | Levels: 2 per section
// // Designed for maximum trait insight, not rote correctness
