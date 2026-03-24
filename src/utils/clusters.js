export const clusters = [
  {
    id: "analytical_thinker",
    name: "Analytical Thinker",
    vector: [
      0.9, // logical
      0.9, // analytical
      0.8, // numerical
      0.4, // verbal
      0.5, // spatial
      0.3, // creativity
      0.8, // discipline
      0.7, // resilience
      0.6, // independence
      0.4, // communication
      0.5 // leadership
    ],
    careers: {
      top: ["Data Scientist", "Software Engineer", "AI Researcher"],
      moderate: ["Business Analyst", "Economist"],
      least: ["Sales", "Performing Arts"],
    },
  },

  {
    id: "creative_communicator",
    name: "Creative Communicator",
    vector: [
      0.4,
      0.5,
      0.3,
      0.9,
      0.4,
      0.9,
      0.5,
      0.6,
      0.5,
      0.9,
      0.6
    ],
    careers: {
      top: ["Content Strategist", "UX Designer", "Journalist"],
      moderate: ["Marketing Specialist", "Brand Manager"],
      least: ["Mechanical Engineer"],
    },
  },

  {
    id: "leader_executor",
    name: "Leader & Executor",
    vector: [
      0.6,
      0.6,
      0.5,
      0.7,
      0.5,
      0.4,
      0.9,
      0.8,
      0.7,
      0.8,
      0.9
    ],
    careers: {
      top: ["Product Manager", "Startup Founder", "Operations Lead"],
      moderate: ["HR Manager", "Project Manager"],
      least: ["Pure Research Roles"],
    },
  },

  {
  id: "strategic_planner",
  name: "Strategic Planner",
  vector: [
    0.8, // logical
    0.8, // analytical
    0.6, // numerical
    0.6, // verbal
    0.5, // spatial
    0.4, // creativity
    0.9, // discipline
    0.8, // resilience
    0.6, // independence
    0.7, // communication
    0.8 // leadership
  ],
  careers: {
    top: ["Management Consultant", "Business Strategist", "Policy Analyst"],
    moderate: ["Product Manager", "Operations Manager"],
    least: ["Pure Creative Arts"]
  }
},

{
  id: "research_thinker",
  name: "Research-Oriented Thinker",
  vector: [
    0.9,
    0.85,
    0.8,
    0.4,
    0.6,
    0.5,
    0.7,
    0.8,
    0.8,
    0.4,
    0.3
  ],
  careers: {
    top: ["Academic Researcher", "Scientist", "R&D Engineer"],
    moderate: ["Data Analyst", "Economist"],
    least: ["Sales", "Public Relations"]
  }
},

{
  id: "visual_spatial_innovator",
  name: "Visual–Spatial Innovator",
  vector: [
    0.5,
    0.6,
    0.4,
    0.5,
    0.9,
    0.85,
    0.5,
    0.6,
    0.6,
    0.5,
    0.4
  ],
  careers: {
    top: ["Architect", "Game Designer", "Industrial Designer"],
    moderate: ["UX Designer", "Animator"],
    least: ["Accounting", "Pure Text-Based Roles"]
  }
},

{
  id: "social_influencer",
  name: "Social Influencer",
  vector: [
    0.4,
    0.5,
    0.3,
    0.9,
    0.4,
    0.7,
    0.6,
    0.7,
    0.5,
    0.95,
    0.8
  ],
  careers: {
    top: ["Public Relations Specialist", "HR Consultant", "Community Manager"],
    moderate: ["Sales Manager", "Corporate Trainer"],
    least: ["Backend Engineer"]
  }
},

{
  id: "practical_executor",
  name: "Practical Executor",
  vector: [
    0.6,
    0.6,
    0.5,
    0.5,
    0.6,
    0.3,
    0.95,
    0.85,
    0.7,
    0.6,
    0.6
  ],
  careers: {
    top: ["Operations Specialist", "Quality Engineer", "Logistics Manager"],
    moderate: ["Manufacturing Supervisor", "Technical Coordinator"],
    least: ["Abstract Research"]
  }
},

{
  id: "adaptive_explorer",
  name: "Adaptive Explorer",
  vector: [
    0.6,
    0.6,
    0.5,
    0.7,
    0.6,
    0.7,
    0.5,
    0.6,
    0.8,
    0.7,
    0.6
  ],
  careers: {
    top: ["Startup Generalist", "Product Associate", "Consulting Analyst"],
    moderate: ["Marketing Strategist", "Business Development"],
    least: ["Highly Repetitive Roles"]
  }
},

];


// 2️⃣ IMPORT TRAITS (or FEATURE_ORDER length)
import { TRAITS } from "./traits";

// 3️⃣ VALIDATION — AFTER clusters exists
clusters.forEach((c) => {
  if (!Array.isArray(c.vector)) {
    throw new Error(`Cluster ${c.id} has no vector`);
  }

  if (c.vector.length !== TRAITS.length) {
    throw new Error(
      `Cluster ${c.id} vector length ${c.vector.length} != ${TRAITS.length}`
    );
  }
});