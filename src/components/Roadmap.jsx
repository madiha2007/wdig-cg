"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const roadmapData = [
  {
    level: "Level 1", title: "Discover Yourself", path: "/",
    description: "Kick off your journey by understanding who you truly are. Our interactive aptitude and personality tests uncover your natural strengths, interests, and hidden potential — helping you build clarity from day one.",
    img: "/roadmap/level1.png", tag: "Start Here 🌱",
    grad: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    iconBg: "linear-gradient(135deg,#dbeafe,#cffafe)",
  },
  {
    level: "Level 2", title: "Unlock Career Matches", path: "/",
    description: "Watch your possibilities open up! Based on your results, our AI instantly unlocks career paths that genuinely match your skills, mindset, and passions — no guesswork, only smart choices.",
    img: "/roadmap/level2.png", tag: "AI Powered 🤖",
    grad: "linear-gradient(135deg,#2563eb,#0ea5e9)",
    iconBg: "linear-gradient(135deg,#eff6ff,#e0f2fe)",
  },
  {
    level: "Level 3", title: "Choose Your Roadmap", path: "",
    description: "No more confusion about 'what next?'. Get crystal-clear, step-by-step roadmaps for each career, covering skills to learn, exams to crack, certifications to earn, and milestones to achieve.",
    img: "/roadmap/level3.png", tag: "Plan It 🗺️",
    grad: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
    iconBg: "linear-gradient(135deg,#e0f2fe,#cffafe)",
  },
  {
    level: "Level 4", title: "Explore Trending Careers", path: "",
    description: "See trending careers in your field of interest and get insights into emerging opportunities shaping the future of work. Stay ahead of the curve with real-time market data.",
    img: "/roadmap/level4.png", tag: "Trending 🔥",
    grad: "linear-gradient(135deg,#0369a1,#0ea5e9)",
    iconBg: "linear-gradient(135deg,#e0f2fe,#ecfeff)",
  },
  {
    level: "Level 5", title: "Explore Best Institutes", path: "/institute",
    description: "Find the right place to grow. We recommend top colleges, institutes, and courses tailored to your career path, preferences, and location — so every decision moves you forward.",
    img: "/roadmap/level5.png", tag: "Colleges 🏫",
    grad: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
    iconBg: "linear-gradient(135deg,#f0f9ff,#ecfeff)",
  },
  {
    level: "Level 6", title: "Connect With Mentors", path: "/mentor",
    description: "Learn from those who've already walked the path. Connect with experienced mentors through 1-on-1 or community sessions, get real-world advice, and gain insights no textbook can offer.",
    img: "/roadmap/level6.png", tag: "Mentorship 🤝",
    grad: "linear-gradient(135deg,#0369a1,#3b82f6)",
    iconBg: "linear-gradient(135deg,#f0f9ff,#dbeafe)",
  },
  {
    level: "Level 7", title: "Talk to AI Career Bot", path: "/chatbot",
    description: "Get instant career advice from our AI-powered chatbot. Ask questions, get personalised guidance, and explore career paths in real-time — available 24/7, no waiting.",
    img: "/roadmap/level7.png", tag: "AI Chat 💬",
    grad: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    iconBg: "linear-gradient(135deg,#dbeafe,#cffafe)",
  },
];

export default function Roadmap() {
  return (
    <section style={{ background: "#e0f2fe", padding: "88px 24px", fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)", top: -100, right: -100, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.07) 0%,transparent 70%)", bottom: -80, left: -80, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1020, margin: "0 auto", position: "relative" }}>

        {/* Section heading */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 72 }}>
          <span style={{ display: "inline-block", background: "linear-gradient(135deg,#dbeafe,#cffafe)", color: "#0369a1", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, border: "1px solid #bae6fd" }}>
            Your Journey
          </span>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 600, color: "#1e2a3a", lineHeight: 1.2, marginBottom: 12 }}>
            Your{" "}
            <span style={{ background: "linear-gradient(135deg,#40c9ff,#e81cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI-Powered
            </span>{" "}
            Career Journey
          </h2>
          <p style={{ fontSize: 15, color: "#7a8fa6", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
            Seven clear levels from self-discovery all the way to landing the career you love.
          </p>
        </motion.div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {roadmapData.map((step, index) => {
            const flip = index % 2 !== 0;
            return (
              <Link href={step.path || "#"} key={index} style={{ textDecoration: "none" }}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }} viewport={{ once: true }}
                  whileHover={{ y: -5, boxShadow: "0 20px 56px rgba(6,182,212,0.14)" }}
                  style={{ background: "#fff", border: "1px solid #bae6fd", borderRadius: 26, padding: "32px 36px", display: "flex", flexDirection: flip ? "row-reverse" : "row", alignItems: "center", gap: 40, boxShadow: "0 2px 16px rgba(14,165,233,0.07)", transition: "box-shadow 0.3s ease, transform 0.3s ease", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>

                  {/* Step number watermark */}
                  <div style={{ position: "absolute", [flip ? "left" : "right"]: 28, top: "50%", transform: "translateY(-50%)", fontSize: 96, fontFamily: "'Lora', serif", fontWeight: 600, color: "rgba(6,182,212,0.06)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Illustration */}
                  <motion.div style={{ flexShrink: 0, width: 130, position: "relative" }} whileHover={{ scale: 1.07, rotate: flip ? -3 : 3 }} transition={{ duration: 0.3 }}>
                    <div style={{ position: "absolute", inset: -8, borderRadius: "50%", background: step.iconBg, filter: "blur(12px)", opacity: 0.7 }} />
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: step.grad, color: "#fff", borderRadius: 999, padding: "3px 12px", fontSize: 10, fontWeight: 800, whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(6,182,212,0.28)", zIndex: 1 }}>
                      {step.level}
                    </div>
                    <Image src={step.img} alt={step.title} width={200} height={200}
                      style={{ width: "100%", height: "auto", position: "relative", filter: "drop-shadow(0 8px 18px rgba(6,182,212,0.2))" }} />
                  </motion.div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
                    <span style={{ display: "inline-block", background: "linear-gradient(135deg,#dbeafe,#cffafe)", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 999, padding: "3px 13px", fontSize: 11, fontWeight: 800, marginBottom: 12 }}>
                      {step.tag}
                    </span>
                    <h3 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(20px, 3vw, 27px)", fontWeight: 600, color: "#1e2a3a", lineHeight: 1.2, marginBottom: 10 }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#7a8fa6", lineHeight: 1.8, maxWidth: 500 }}>
                      {step.description}
                    </p>
                    {step.path && (
                      <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, background: step.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        Explore this step →
                      </div>
                    )}
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}