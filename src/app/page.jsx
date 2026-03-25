
"use client";

import Image from "next/image";
import Roadmap, { RoadmapSection } from "@/components/RoadmapSection";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HeroSection } from "../components/HeroSection";
import { FeaturesGridSection } from "@/components/features-grid-section"

/* ─── DATA ──────────────────────────────────────────────── */

const features = [
  {
    icon: "/assets/features/testing.png",
    title: "AI Aptitude Test",
    desc: "Discover your strengths, thinking style, and hidden potential through our intelligent assessment.",
    grad: "linear-gradient(135deg,#3b82f6,#7c3aed)",
    glow: "rgba(124,58,237,0.30)",
    bg: "linear-gradient(135deg,rgba(247, 241, 248, 0.9),rgba(249, 241, 252, 0.9))",
    border: "rgba(196,181,253,0.5)",
  },
  {
    icon: "/assets/features/credibility.png",
    title: "Career Roadmaps",
    desc: "Get a crystal-clear, step-by-step plan for any career — exams, skills, milestones and all.",
    grad: "linear-gradient(135deg,#2563eb,#7c3aed)",
    glow: "rgba(37,99,235,0.30)",
    bg: "linear-gradient(135deg,rgba(247, 241, 248, 0.9),rgba(249, 241, 252, 0.9))",
    border: "rgba(165,180,252,0.5)",
  },
  {
    icon: "/assets/features/career-advancement.png",
    title: "College Recommendations",
    desc: "Find the best institutes tailored to your career path, location, and preferences.",
    grad: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    glow: "rgba(99,102,241,0.30)",
    bg: "linear-gradient(135deg,rgba(247, 241, 248, 0.9),rgba(249, 241, 252, 0.9))",
    border: "rgba(165,180,252,0.5)",
  },
  {
    icon: "/assets/features/connection.png",
    title: "Connect with Mentors",
    desc: "Learn from people who've already walked the path you want to walk.",
    grad: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    glow: "rgba(139,92,246,0.30)",
    bg: "linear-gradient(135deg,rgba(247, 241, 248, 0.9),rgba(249, 241, 252, 0.9))",
    border: "rgba(191,219,254,0.5)",
  },
];

const ROLE_WORDS = ["Engineer", "Designer", "Doctor", "Entrepreneur", "Artist", "Data Scientist", "Lawyer"];

// Quick 3-step strip inside hero — replaces the separate "How It Works" section
const QUICK_STEPS = [
  { icon: "🧪", label: "Take the test", sublabel: "15 min, free" },
  { icon: "🎯", label: "Get your match", sublabel: "AI-ranked careers" },
  { icon: "🗺️", label: "Follow your path", sublabel: "Full roadmap" },
];

/* ─── STABLE PARTICLE SEEDS ─────────────────────────────── */
const PARTICLE_SEEDS = [
  { x: 82.7, y: 23.1, size: 5.0, duration: 9.2, delay: 0.4, opacity: 0.28, dx: 8 },
  { x: 60.5, y: 8.0, size: 5.4, duration: 7.6, delay: 1.1, opacity: 0.35, dx: -6 },
  { x: 65.1, y: 95.2, size: 5.6, duration: 11.0, delay: 2.3, opacity: 0.22, dx: 5 },
  { x: 81.4, y: 74.0, size: 4.4, duration: 8.3, delay: 0.7, opacity: 0.45, dx: -9 },
  { x: 15.7, y: 72.2, size: 5.2, duration: 6.8, delay: 3.1, opacity: 0.18, dx: 7 },
  { x: 27.5, y: 36.5, size: 3.0, duration: 13.0, delay: 1.9, opacity: 0.30, dx: -4 },
  { x: 75.6, y: 16.7, size: 4.3, duration: 9.8, delay: 0.2, opacity: 0.50, dx: 10 },
  { x: 19.1, y: 92.8, size: 5.6, duration: 7.1, delay: 2.7, opacity: 0.25, dx: -7 },
  { x: 88.4, y: 34.4, size: 4.0, duration: 10.5, delay: 1.4, opacity: 0.38, dx: 6 },
  { x: 96.8, y: 66.9, size: 5.1, duration: 12.0, delay: 0.8, opacity: 0.32, dx: 8 },
  { x: 17.7, y: 25.0, size: 5.4, duration: 9.4, delay: 1.6, opacity: 0.42, dx: 9 },
  { x: 40.4, y: 91.9, size: 5.6, duration: 6.5, delay: 0.5, opacity: 0.18, dx: -8 },
];

/* ─── HOOKS ─────────────────────────────────────────────── */
function useTypewriter(words, speed = 100, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function useTilt() {
  const ref = useRef(null);
  const handleMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
    el.style.transition = "transform 0.1s ease";
  }, []);
  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    el.style.transition = "transform 0.5s ease";
  }, []);
  return { ref, handleMove, handleLeave };
}

/* ─── SUB-COMPONENTS ────────────────────────────────────── */

function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {PARTICLE_SEEDS.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -40, 0], x: [0, p.dx, 0], opacity: [p.opacity, Math.min(p.opacity * 2, 0.9), p.opacity], scale: [1, 1.3, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(139,92,246,${p.opacity * 2}), rgba(59,130,246,${p.opacity}))`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div style={{
      position: "fixed", left: pos.x - 200, top: pos.y - 200,
      width: 400, height: 400, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
      pointerEvents: "none", zIndex: 0,
      transition: "left 0.15s ease, top 0.15s ease",
    }} />
  );
}

function FeatureCard({ f, i }) {
  const { ref, handleMove, handleLeave } = useTilt();
  return (
    <motion.div
      custom={i}
      variants={{
        hidden: { opacity: 0, y: 40 },
        show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay: i * 0.12 } }),
      }}
      initial="hidden" whileInView="show" viewport={{ once: true }}
      ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{
        background: f.bg, border: `1px solid ${f.border}`,
        borderRadius: 24, padding: "32px 28px",
        cursor: "default", position: "relative", overflow: "hidden",
        backdropFilter: "blur(12px)", willChange: "transform",
      }}
    >
      {/* Shimmer sweep */}
      <div style={{
        position: "absolute", top: 0, left: "-60%", width: "40%", height: "100%",
        background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)",
        transform: "skewX(-20deg)",
        animation: `shimmer ${3 + i}s ease ${i * 0.7}s infinite`,
        pointerEvents: "none",
      }} />
      <motion.div
        whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.4 }}
        style={{
          width: 54, height: 54, borderRadius: 15,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 25, marginBottom: 20,
          boxShadow: `0 6px 20px ${f.glow}`,
        }}
      >
        <Image src={f.icon} alt={f.title} width={28} height={28} />
      </motion.div>
      
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", marginBottom: 10 }}>{f.title}</h3>
      <p style={{ fontSize: 13, color: "#7a8fa6", lineHeight: 1.75 }}>{f.desc}</p>
    </motion.div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
const F = { fontFamily: "'Nunito', sans-serif" };

export default function HomePage() {
  const router = useRouter();
  const [hasResult, setHasResult] = useState(false);
  // const typedRole = useTypewriter(ROLE_WORDS, 90, 1600);
  // const { scrollY } = useScroll();
  // const heroY = useTransform(scrollY, [0, 600], [0, 60]);
  // const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.5]);

  useEffect(() => {
    setHasResult(!!localStorage.getItem("aptitudeResult"));
  }, []);

  const go = (path) => router.push(path);

  return (
    <div style={{ ...F, color: "#1e2a3a", position: "relative" }}>
      <CursorGlow />

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes shimmer {
          0% { left: -60%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-blink { animation: blink 0.75s step-end infinite; }
        .hero-cta-btn {
          position: relative;
          overflow: hidden;
        }
        .hero-cta-btn::after {
          content: '';
          position: absolute;
          top: 50%; left: -75%;
          width: 50%; height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: skewX(-20deg) translateY(-50%);
          animation: shimmer 2.5s ease 1s infinite;
        }
      `}</style>

      {/* ── ANNOUNCEMENT BAR ── */}
      {/* <div className="bg-sky-900" style={{
        borderBottom: "1px solid #bfdbfe",
        color: "#ffffff", fontSize: 12, fontWeight: 700,
        textAlign: "center", padding: "8px 16px", letterSpacing: "0.04em",
      }}>
        <marquee behavior="scroll" direction="left" scrollamount="3">
          🚀&nbsp; AI Career Bot is now live — ask anything about your future &nbsp;·&nbsp;
          🎯&nbsp; Take the aptitude test and get your career match in minutes &nbsp;·&nbsp;
          ✨&nbsp; New: Career roadmaps updated for 2025
        </marquee>
      </div> */}

{/* Announcement bar stays above everything */}
<div style={{ position: 'relative', zIndex: 0 }}>
  <HeroSection />
</div>

<FeaturesGridSection />

      {/* ════════════════════════════════════════════
          ROADMAP  — the 7-level interactive journey
          This IS the "how it works" — no duplication
      ════════════════════════════════════════════ */}
      <RoadmapSection />

      {/* ════════════════════════════════════════════
          FINAL CTA  — one clean closer, not a repeat
          Different angle: reassurance + urgency
      ════════════════════════════════════════════ */}
   {/* ── FOOTER CTA ── */}
      {/* CHANGED: was yellow/peach → now blue→purple gradient to match theme */}
     <section className="bg-gradient-to-r from-violet-500 to-pink-500" style={{
        padding: "96px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Orb decorations */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.10) 0%,transparent 70%)", top: -200, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%)", bottom: -120, left: -60, pointerEvents: "none" }} />
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.06, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}
        >
          {/* Badge */}
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            borderRadius: 999,
            padding: "5px 16px",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 20,
            border: "1px solid rgba(255,255,255,0.35)",
          }}>
            Free &amp; Takes 15 Minutes
          </span>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Lora', serif",
            fontSize: "clamp(28px,4vw,46px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 16,
            fontStyle: "italic",
          }}>
            Ready to find your{" "}
            <span style={{
              background: "linear-gradient(135deg,#fde68a,#f9a8d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              path?
            </span>
          </h2>

          <p style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.8,
            marginBottom: 40,
            maxWidth: 420,
            margin: "0 auto 40px",
          }}>
            Your future starts with one honest test. Take it now — it's completely free.
          </p>

          {/* Button */}
          <button
            onClick={() => go(hasResult ? "/results" : "/aptitude")}
            className="hero-cta-btn"
            style={{
              background: "#fff",
              color: "#0f3460",
              border: "none",
              borderRadius: 999,
              padding: "18px 52px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              transition: "transform .2s, box-shadow .2s",
              ...F,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.03)"
              e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.32)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)"
              e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.25)"
            }}
          >

<span className="flex items-center gap-2">
  Take the Aptitude Test
  <Image src="/assets/test.png" alt="Test Icon" width={34} height={34} />
</span>
          </button>

        </motion.div>
      </section>
      
    </div>
  );
}