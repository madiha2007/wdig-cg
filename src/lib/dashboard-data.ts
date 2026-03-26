/* ─── Trait label map ─────────────────────────────────────── */
export const TRAIT_LABELS: Record<string, string> = {
  logical: "Logical Reasoning", analytical: "Analytical Thinking",
  numerical: "Numerical Ability", verbal: "Verbal Ability",
  spatial: "Spatial Reasoning", creativity: "Creativity",
  discipline: "Discipline", resilience: "Resilience",
  adaptability: "Adaptability", growth_mindset: "Growth Mindset",
  confidence: "Confidence", leadership: "Leadership",
  communication: "Communication", teamwork: "Teamwork",
  empathy: "Empathy", problem_solving: "Problem Solving",
  initiative: "Initiative", emotional_intelligence: "EQ",
  intrinsic_motivation: "Intrinsic Drive", purpose_drive: "Purpose Drive",
  independence: "Independence", depth_focus: "Deep Focus",
};

export const tlabel = (k: string) =>
  TRAIT_LABELS[k] ?? k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

export const PALETTE_COLORS = [
  { color: "dash-violet", light: "dash-violet-light", hex: "#7c3aed", lightHex: "#ede9fe" },
  { color: "dash-cyan", light: "dash-cyan-light", hex: "#0891b2", lightHex: "#cffafe" },
  { color: "dash-emerald", light: "dash-emerald-light", hex: "#059669", lightHex: "#d1fae5" },
  { color: "dash-amber", light: "dash-amber-light", hex: "#d97706", lightHex: "#fef3c7" },
  { color: "dash-pink", light: "dash-pink-light", hex: "#db2777", lightHex: "#fce7f3" },
  { color: "dash-indigo", light: "dash-indigo-light", hex: "#4f46e5", lightHex: "#e0e7ff" },
];

export type PersonalityType = {
  icon: string;
  color: string;
  bg: string;
  traits: string[];
};

export const STYLE_PERSONALITIES: Record<string, PersonalityType> = {
  "Analytical Thinker": {
    icon: "🔬", color: "#0891b2", bg: "#cffafe",
    traits: ["Detail-oriented & precise", "Thrives on data and logic", "Methodical problem-solver", "Values accuracy over speed", "Natural at spotting patterns"],
  },
  "Creative Visionary": {
    icon: "🎨", color: "#db2777", bg: "#fce7f3",
    traits: ["Thinks outside the box", "Highly imaginative", "Comfortable with ambiguity", "Connects unrelated ideas", "Driven by curiosity"],
  },
  "Strategic Leader": {
    icon: "🧭", color: "#7c3aed", bg: "#ede9fe",
    traits: ["Big-picture thinker", "Natural delegator", "Goal-driven & decisive", "Inspires others easily", "Plans several steps ahead"],
  },
  "Empathetic Communicator": {
    icon: "💬", color: "#059669", bg: "#d1fae5",
    traits: ["Deeply attuned to others", "Excellent listener", "Builds trust quickly", "Resolves conflict gracefully", "Thrives in collaborative spaces"],
  },
  "Practical Executor": {
    icon: "⚙️", color: "#d97706", bg: "#fef3c7",
    traits: ["Gets things done reliably", "Action-oriented mindset", "Organised & disciplined", "Focuses on real-world results", "Respects systems and process"],
  },
  "Curious Explorer": {
    icon: "🔭", color: "#4f46e5", bg: "#e0e7ff",
    traits: ["Loves learning for its own sake", "Questions everything", "Adapts to new environments fast", "Broad knowledge base", "Energised by the unknown"],
  },
};

export const defaultPersonality: PersonalityType = {
  icon: "✨", color: "#7c3aed", bg: "#ede9fe",
  traits: ["Unique blend of strengths", "Adaptable across contexts", "Natural problem-solver", "Continuous learner", "Values growth and purpose"],
};

/* ─── Mock data for demo ─────────────────────────────────── */
export const MOCK_DATA = {
  name: "Arjun Mehta",
  email: "arjun@example.com",
  isAssessed: true,
  thinkingStyle: "Strategic Leader",
  thinkingDesc: "You see the forest when others focus on trees. Your mind naturally maps systems, anticipates consequences, and charts paths forward. This cognitive pattern makes you exceptionally suited for roles requiring vision and execution.",
  topCareers: [
    "Product Manager", "Management Consultant", "Business Analyst",
    "UX Strategist", "Operations Director", "Entrepreneur",
    "Data Scientist", "Program Manager",
  ],
  existingSkills: [
    { key: "leadership", score: 88 },
    { key: "problem_solving", score: 82 },
    { key: "analytical", score: 78 },
    { key: "communication", score: 75 },
    { key: "initiative", score: 71 },
    { key: "adaptability", score: 67 },
    { key: "creativity", score: 63 },
  ],
  needsGainSkills: ["numerical", "discipline", "depth_focus", "resilience", "empathy"],
  skillMap: {
    numerical: 38, discipline: 42, depth_focus: 35, resilience: 44, empathy: 40,
    leadership: 88, problem_solving: 82, analytical: 78, communication: 75,
  } as Record<string, number>,
  skillsToAcquire: [
    "Data Analysis & Interpretation",
    "Stakeholder Management",
    "Financial Modelling",
    "Agile Methodology",
    "Strategic Storytelling",
    "Systems Thinking",
  ],
};
