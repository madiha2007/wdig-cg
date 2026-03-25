"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "@/components/ui/layout-grid";

// ── Modal content (shown when card is clicked) ──────────────

const AptitudeContent = () => (
  <div>
    <h3 className="font-bold text-2xl text-gray-900 mb-1">AI Aptitude Test</h3>
    <p className="text-violet-500 font-semibold text-sm mb-3">Discover your strengths</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">
      Our intelligent assessment analyses your thinking style, personality, and
      hidden potential to match you with careers you'll genuinely love. Takes
      just 15 minutes — completely free.
    </p>
    <div className="flex gap-2 flex-wrap">
      <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full">15 min</span>
      <span className="bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">Free</span>
      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">AI Powered</span>
    </div>
  </div>
);

const RoadmapContent = () => (
  <div>
    <h3 className="font-bold text-2xl text-gray-900 mb-1">Career Roadmaps</h3>
    <p className="text-blue-500 font-semibold text-sm mb-3">Your step-by-step career plan</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">
      Get a crystal-clear plan for any career — exams to crack, skills to
      build, certifications to earn, and milestones to hit. No guesswork,
      just a clear path forward.
    </p>
    <div className="flex gap-2 flex-wrap">
      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">50+ Careers</span>
      <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">Step by Step</span>
    </div>
  </div>
);

const CollegeContent = () => (
  <div>
    <h3 className="font-bold text-2xl text-gray-900 mb-1">College Recommendations</h3>
    <p className="text-teal-500 font-semibold text-sm mb-3">Find the right institute for you</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">
      We recommend top colleges, institutes, and courses tailored to your
      career path, location, and budget — so every decision moves you closer
      to your dream.
    </p>
    <div className="flex gap-2 flex-wrap">
      <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">500+ Colleges</span>
      <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">Location Based</span>
    </div>
  </div>
);

const MentorContent = () => (
  <div>
    <h3 className="font-bold text-2xl text-gray-900 mb-1">Connect with Mentors</h3>
    <p className="text-orange-500 font-semibold text-sm mb-3">Learn from those who've been there</p>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">
      Connect with experienced professionals through 1-on-1 or community
      sessions. Get real-world advice, insider tips, and guidance no
      textbook can offer.
    </p>
    <div className="flex gap-2 flex-wrap">
      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">1-on-1 Sessions</span>
      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">Expert Mentors</span>
    </div>
  </div>
);

// ── Cards ───────────────────────────────────────────────────
const cards = [
  {
    id: 1,
    content: <AptitudeContent />,
    className: "md:col-span-2 h-64 md:h-72",
    thumbnail: "/assets/features/test.jpg",
    title: "AI Aptitude Test",
    subtitle: "Discover your strengths in 15 minutes",
  },
  {
    id: 2,
    content: <RoadmapContent />,
    className: "col-span-1 h-64 md:h-72",
    thumbnail: "/assets/features/careerroadmap.jpg",
    title: "Career Roadmaps",
    subtitle: "Step-by-step plans for any career",
  },
  {
    id: 3,
    content: <CollegeContent />,
    className: "col-span-1 h-64 md:h-72",
    thumbnail: "/assets/features/college.jpg",
    title: "College Recommendations",
    subtitle: "Find the right institute for you",
  },
  {
    id: 4,
    content: <MentorContent />,
    className: "md:col-span-2 h-64 md:h-72",
    thumbnail: "/assets/features/mentor.jpg",
    title: "Connect with Mentors",
    subtitle: "Learn from those who've been there",
  },
];

// ── Section ─────────────────────────────────────────────────
export function FeaturesGridSection() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg,#fff 0%,#f7f9fc 100%)",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{
            display: "inline-block",
            background: "linear-gradient(135deg,#dbeafe,#ede9fe)",
            color: "#1e5fa8", borderRadius: 999, padding: "5px 16px",
            fontSize: 11, fontWeight: 800, letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 16,
            border: "1px solid rgba(196,181,253,0.4)",
          }}>
            Everything You Need
          </span>
          <h2 style={{
            fontFamily: "'Lora', serif",
            fontSize: "clamp(28px,4vw,46px)",
            fontWeight: 600, color: "#1e2a3a", lineHeight: 1.2,
            marginBottom: 10,
          }}>
            One platform. Every answer<br />
            <span style={{
              background: "linear-gradient(135deg,#40c9ff,#e81cff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              about your future.
            </span>
          </h2>
          <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>
            Click any card to learn more
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <LayoutGrid cards={cards} />
        </motion.div>
      </div>
    </section>
  );
}