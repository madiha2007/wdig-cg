
"use client";

import Image from "next/image";
import Roadmap from "@/components/Roadmap";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

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
  const typedRole = useTypewriter(ROLE_WORDS, 90, 1600);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.5]);

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
      <div className="bg-sky-900" style={{
        borderBottom: "1px solid #bfdbfe",
        color: "#ffffff", fontSize: 12, fontWeight: 700,
        textAlign: "center", padding: "8px 16px", letterSpacing: "0.04em",
      }}>
        <marquee behavior="scroll" direction="left" scrollamount="3">
          🚀&nbsp; AI Career Bot is now live — ask anything about your future &nbsp;·&nbsp;
          🎯&nbsp; Take the aptitude test and get your career match in minutes &nbsp;·&nbsp;
          ✨&nbsp; New: Career roadmaps updated for 2025
        </marquee>
      </div>

      {/* ════════════════════════════════════════════
          HERO  — left: copy + CTA + 3-step strip
                  right: image
      ════════════════════════════════════════════ */}
      <section style={{
        background: "#ffffff",
        padding: "64px 24px 72px",
        position: "relative", overflow: "hidden",
        minHeight: "88vh", display: "flex", alignItems: "center",
      }}>
        <Particles />

        {/* Animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", width: 580, height: 580, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1) 0%,transparent 70%)", top: -200, right: -80, pointerEvents: "none" }}
        />
        <motion.div
          animate={{ scale: [1, 1.06, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,0.09) 0%,transparent 70%)", bottom: -100, left: -80, pointerEvents: "none" }}
        />
        <div style={{ position: "absolute", width: 280, height: 280, borderRadius: "50%", border: "1.5px dashed rgba(139,92,246,0.18)", top: "50%", right: "6%", transform: "translateY(-50%)", animation: "spin-slow 30s linear infinite", pointerEvents: "none" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>

          {/* ── Left ── */}
          <div style={{ flex: "1 1 380px" }}>

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(219,234,254,0.7)", backdropFilter: "blur(8px)", color: "#1e5fa8", borderRadius: 999, padding: "6px 16px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24, border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 2px 12px rgba(59,130,246,0.1)" }}
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }}
              />
              AI-Powered Career Guidance
            </motion.div>

            {/* Headline with typewriter */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, type: "spring", stiffness: 80 }}
              style={{
                fontFamily: "'Lora', serif",
                fontSize: "clamp(36px,5.5vw,60px)",
                fontWeight: 600,
                color: "#1e2a3a",
                lineHeight: 1.1,
                marginBottom: 18
              }}
            >
              Become the

              <span
                className="bg-gradient-to-r from-purple-500 to-pink-500 block"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                {typedRole}
                <span
                  className="cursor-blink"
                  style={{ WebkitTextFillColor: "#110d5c", color: "#0e2857" }}
                >
                  |
                </span>
              </span>

              <span
                style={{
                  color: "#7a8fa6",
                  fontSize: "0.7em",
                  fontWeight: 400
                }}
              >
                you were always meant to be.
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
              style={{ fontSize: 16, color: "#3d4f63", lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}
            >
              Our AI analyses your aptitude, personality, and goals to match you with careers you'll actually love — then maps out <strong>exactly</strong> how to get there.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }}
            >
              {hasResult ? (
                <button onClick={() => go("/results")} className="hero-cta-btn "
                  style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none", borderRadius: 999, padding: "16px 40px", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 30px rgba(34,197,94,0.35)", transition: "transform .2s, box-shadow .2s", ...F }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(34,197,94,0.46)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(34,197,94,0.35)"; }}
                >
                  View My Results ✓
                </button>
              ) : (
                <button onClick={() => go("/aptitude")} className="hero-cta-btn bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ color: "#fff", border: "none", borderRadius: 999, padding: "16px 40px", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 32px rgba(109,40,217,0.32)", transition: "transform .2s, box-shadow .2s", ...F, display: "inline-flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(109,40,217,0.44)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(109,40,217,0.32)"; }}
                >
                  Take the Aptitude Test <span style={{ fontSize: 20 }}>
                    <Image src="/assets/test.png" alt="Arrow Right" width={30} height={30} />
                  </span>
                </button>
              )}
            </motion.div>

          </div>

          {/* ── Right: hero image ── */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 70 }}
            style={{ flex: "1 1 320px", display: "flex", justifyContent: "center", position: "relative" }}
          >
            <div style={{ position: "relative", maxWidth: 500, width: "100%" }}>
              <div style={{ position: "absolute", inset: -20, borderRadius: 36, filter: "blur(24px)" }} />
              <Image
                src="/assets/hero.jpg"
                alt="Students exploring careers"
                width={980} height={880}
                style={{ borderRadius: 28, position: "relative", boxShadow: "0 24px 60px rgba(109,40,217,0.16)", width: "100%" }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)" }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "#c0cdd9", fontSize: 11, letterSpacing: "0.12em", fontWeight: 700, textAlign: "center" }}
          >
            ↓ &nbsp; SCROLL TO EXPLORE
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES  — what the platform offers
          (no CTA here — let user absorb first)
      ════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(180deg,#fff 0%,#f7f9fc 100%)", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            style={{ textAlign: "center", marginBottom: 60 }}
          >
            <span style={{ display: "inline-block", background: "linear-gradient(135deg,#dbeafe,#ede9fe)", color: "#1e5fa8", borderRadius: 999, padding: "5px 16px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16, border: "1px solid rgba(196,181,253,0.4)" }}>
              Everything You Need
            </span>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 600, color: "#1e2a3a", lineHeight: 1.2 }}>
              One platform. Every answer<br />
              <span style={{ background: "linear-gradient(135deg,#40c9ff,#e81cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                about your future.
              </span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 22 }}>
            {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          ROADMAP  — the 7-level interactive journey
          This IS the "how it works" — no duplication
      ════════════════════════════════════════════ */}
      <Roadmap />

      {/* ════════════════════════════════════════════
          FINAL CTA  — one clean closer, not a repeat
          Different angle: reassurance + urgency
      ════════════════════════════════════════════ */}
   {/* ── FOOTER CTA ── */}
      {/* CHANGED: was yellow/peach → now blue→purple gradient to match theme */}
      <section className="bg-sky-900" style={{
        
        padding: "96px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* White orb decorations */}
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%)", top: -200, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%)", bottom: -120, left: -60, pointerEvents: "none" }} />
        {/* Subtle dot grid */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.05, backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 560, margin: "0 auto", position: "relative", zIndex: 1 }}
        >
          {/* Badge — white frosted instead of yellow */}
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", borderRadius: 999, padding: "5px 16px", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, border: "1px solid rgba(255,255,255,0.3)" }}>
            Free &amp; Takes 15 Minutes
          </span>

          {/* Heading — white on dark */}
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(28px,4vw,46px)", fontWeight: 600, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
            Ready to find your path?
          </h2>

          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: 40, maxWidth: 420, margin: "0 auto 40px" }}>
            Your future starts with one honest test. Take it now — it's completely free.
          </p>

          {/* Button — white with blue text (inverted for contrast) */}
          <button
            onClick={() => go(hasResult ? "/results" : "/aptitude")}
            className="hero-cta-btn"
            style={{ background: "#fff", color: "#0369a1", border: "none", borderRadius: 999, padding: "18px 52px", fontSize: 16, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 32px rgba(0,0,0,0.2)", transition: "transform .2s, box-shadow .2s", ...F, display: "inline-flex", alignItems: "center", gap: 10 }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.03)"; e.currentTarget.style.boxShadow = "0 18px 44px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.2)"; }}
          >
            {hasResult ? "View My Results ✓" : "Take the Aptitude Test "}
            <span style={{ fontSize: 20 }}>{hasResult ? "" : "🚀"}</span>
          </button>

        </motion.div>
      </section>
    </div>
  );
}