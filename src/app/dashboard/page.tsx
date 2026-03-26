"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Brain, Target, Building2, Briefcase, TrendingUp,
  Award, ArrowRight, Sparkles, CheckCircle2,
  ChevronRight, Map, User, Lightbulb, Star,
  BookOpen, Zap, Heart, Compass,
} from "lucide-react";
import { useUser } from "../context/UserContext";

/* ─── Trait label map ───────────────────────────────────────── */
const TRAIT_LABELS: Record<string, string> = {
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
const tlabel = (k: string) =>
  TRAIT_LABELS[k] ?? k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

const PALETTE      = ["#7c3aed", "#0891b2", "#059669", "#d97706", "#db2777", "#4f46e5"];
const PALETTE_LIGHT= ["#ede9fe", "#cffafe", "#d1fae5", "#fef3c7", "#fce7f3", "#e0e7ff"];

/* ── Thinking-style personality map ────────────────────────── */
const STYLE_PERSONALITIES: Record<string, { traits: string[]; icon: string; color: string; bg: string }> = {
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

/* ── Default personality for unknown styles ─────────────────── */
const defaultPersonality = {
  icon: "✨", color: "#7c3aed", bg: "#ede9fe",
  traits: ["Unique blend of strengths", "Adaptable across contexts", "Natural problem-solver", "Continuous learner", "Values growth and purpose"],
};

/* ─── Animated counter ─────────────────────────────────────── */
function AnimNum({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1600, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, inView]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const HR = ({ style = {} }: { style?: React.CSSProperties }) => (
  <div style={{ height: 1, background: "rgba(0,0,0,0.07)", ...style }} />
);

const SectionLabel = ({ children, color = "#7c3aed" }: { children: React.ReactNode; color?: string }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.57rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color }}>
    <span style={{ display: "inline-block", width: 14, height: 1.5, background: color, borderRadius: 2 }} />
    {children}
  </span>
);

const Card = ({ children, style = {}, hover = false, className = "" }: {
  children: React.ReactNode; style?: React.CSSProperties; hover?: boolean; className?: string;
}) => (
  <motion.div className={className}
    whileHover={hover ? { y: -3 } : undefined}
    transition={{ duration: 0.2, ease: "easeOut" }}
    style={{
      background: "#ffffff", borderRadius: 20,
      border: "1px solid rgba(0,0,0,0.08)",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 28px rgba(0,0,0,0.055)",
      overflow: "hidden", ...style,
    }}>
    {children}
  </motion.div>
);

const IconBox = ({ icon, color, bg }: { icon: React.ReactNode; color: string; bg: string }) => (
  <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
    {icon}
  </div>
);

function AmbientGlows() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { size: 700, top: "-20%", left: "-15%", color: "rgba(124,58,237,0.04)" },
        { size: 500, top: "40%", right: "-12%", color: "rgba(8,145,178,0.03)" },
        { size: 400, bottom: "-10%", left: "30%", color: "rgba(217,119,6,0.03)" },
      ].map((g, i) => (
        <motion.div key={i}
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 18 + i * 4, repeat: Infinity, ease: "easeInOut", delay: i * 3 }}
          style={{ position: "absolute", width: g.size, height: g.size, borderRadius: "50%", background: `radial-gradient(circle, ${g.color} 0%, transparent 68%)`, ...(g as any) }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   1 · HERO — no card, raw layout, profile on right
═══════════════════════════════════════════════════════════════ */
function HeroSection({ name, email, isAssessed, thinkingStyle }: {
  name: string; email?: string; isAssessed: boolean; thinkingStyle?: string;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const initials = name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "U";
  const personality = thinkingStyle
    ? (STYLE_PERSONALITIES[thinkingStyle] ?? defaultPersonality)
    : defaultPersonality;

  return (
    <div style={{ marginBottom: "2.5rem", padding: "2rem 1rem 0", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>

        {/* ── Left: greeting + name ── */}
        <div style={{ flex: 1, minWidth: 240 }}>
          <motion.p
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            style={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.38)", margin: "0 0 0.4rem", fontWeight: 500, letterSpacing: "0.04em" }}>
            {greeting}&nbsp;&nbsp;·&nbsp;&nbsp;
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: "clamp(2.6rem,6vw,4rem)",
              fontWeight: 700, color: "#080808",
              margin: "0 0 0.5rem", letterSpacing: "-0.04em", lineHeight: 1.02,
            }}>
            Hello, {" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500" style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{name || "there"}.</span>
       
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16, duration: 0.5 }}
            style={{ fontSize: "clamp(0.85rem,1.8vw,0.95rem)", color: "rgba(0,0,0,0.42)", lineHeight: 1.75, margin: "0", maxWidth: "44ch" }}>
            {isAssessed
              ? "Your personalised career dashboard is ready. Here's everything about you."
              : "Discover your thinking style and unlock a career path built entirely around you."}
          </motion.p>

          {!isAssessed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}>
              <Link href="/aptitude">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    marginTop: "1.2rem", padding: "0.75rem 1.6rem", background: "#7c3aed", color: "#fff",
                    border: "none", borderRadius: 12, fontWeight: 700, fontSize: "0.84rem",
                    cursor: "pointer", fontFamily: "inherit",
                    display: "inline-flex", alignItems: "center", gap: 7,
                    boxShadow: "0 4px 18px rgba(124,58,237,0.32)",
                  }}>
                  <Sparkles size={14} /> Begin Assessment
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* ── Right: user profile card ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          style={{  
            borderRadius: 70,
            border: "1px solid rgba(0,0,0,0.09)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.05)",
            padding: "1.4rem 1.6rem",
            minWidth: 120, maxWidth: 160,
            display: "flex", flexDirection: "column", gap: "0.9rem",
          }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #7c3aed, #ff63f5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.9rem", fontWeight: 800, color: "#fff",
              fontFamily: "'Fraunces',serif",
              boxShadow: "0 4px 14px rgba(124,58,237,0.28)",
            }}>
              {initials}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Decorative separator */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: 1.5, background: "linear-gradient(90deg, #7c3aed, #0891b2, #059669, transparent)", marginTop: "2rem", borderRadius: 2, transformOrigin: "left" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2 · THINKING STYLE BANNER — full-width immersive
═══════════════════════════════════════════════════════════════ */
function ThinkingStyleBanner({ thinkingStyle, thinkingDesc, isAssessed }: {
  thinkingStyle?: string; thinkingDesc?: string; isAssessed: boolean;
}) {
  if (!isAssessed || !thinkingStyle) return null;

  const personality = STYLE_PERSONALITIES[thinkingStyle] ?? defaultPersonality;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>

      {/* Banner card — rich gradient bg */}
      <div style={{
        borderRadius: 22,
        background: `linear-gradient(135deg, ${personality.color}18 0%, ${personality.color}08 50%, #ffffff 100%)`,
        border: `1px solid ${personality.color}28`,
        boxShadow: `0 4px 32px ${personality.color}14, 0 1px 3px rgba(0,0,0,0.05)`,
        padding: "2.2rem 2.4rem",
        position: "relative", overflow: "hidden",
      }}>

        {/* Background decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${personality.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "40%", width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${personality.color}08 0%, transparent 70%)`, pointerEvents: "none" }} />

        {/* Large icon watermark */}
        <div style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", fontSize: "5rem", opacity: 0.08, userSelect: "none", pointerEvents: "none" }}>
          {personality.icon}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.9rem" }}>
            <div style={{ fontSize: "1.6rem" }}>{personality.icon}</div>
            <div>
              <SectionLabel color={personality.color}>Your Thinking Style</SectionLabel>
              <h2 style={{
                fontFamily: "'Fraunces',serif",
                fontSize: "clamp(1.4rem,3.5vw,2.2rem)",
                fontWeight: 700, color: "#0a0a0a",
                margin: "0.3rem 0 0", letterSpacing: "-0.03em", lineHeight: 1.1,
              }}>
                {thinkingStyle}
              </h2>
            </div>
          </div>

          {thinkingDesc && (
            <p style={{ fontSize: "clamp(0.82rem,1.8vw,0.9rem)", color: "rgba(0,0,0,0.52)", lineHeight: 1.85, maxWidth: "60ch", margin: "0 0 1.4rem" }}>
              {thinkingDesc}
            </p>
          )}

          {/* Personality traits row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {personality.traits.map((trait, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "#fff",
                  border: `1px solid ${personality.color}25`,
                  borderRadius: 99, padding: "0.38rem 0.85rem",
                  boxShadow: `0 1px 4px rgba(0,0,0,0.06)`,
                }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: personality.color, flexShrink: 0 }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "rgba(0,0,0,0.68)" }}>{trait}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3 · STAT CARDS
═══════════════════════════════════════════════════════════════ */
function StatCards({ topCareers }: { topCareers: string[] }) {
  const cards = [
    { icon: <Target size={16} />, label: "Career Matches", value: topCareers.length, suffix: "", sub: "Personalised for you", href: "/explore", accent: "#7c3aed", lightBg: "#ede9fe" },
    { icon: <Building2 size={16} />, label: "Institutes", value: 120, suffix: "+", sub: "Colleges & universities", href: "/institutes", accent: "#0891b2", lightBg: "#cffafe" },
    { icon: <Briefcase size={16} />, label: "Careers to Explore", value: 900, suffix: "+", sub: "O*NET verified database", href: "/explore", accent: "#059669", lightBg: "#d1fae5" },
  ];
  return (
    <div className="stat-grid" style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
      {cards.map((c, i) => (
        <Link key={i} href={c.href} style={{ textDecoration: "none" }}>
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            style={{
              background: "#fff", borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 24px rgba(0,0,0,0.05)",
              padding: "1.5rem 1.4rem", cursor: "pointer", position: "relative", overflow: "hidden",
            }}>
            <div style={{ position: "absolute", top: -28, right: -28, width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${c.lightBg} 0%, transparent 70%)`, pointerEvents: "none" }} />
            <IconBox icon={c.icon} color={c.accent} bg={c.lightBg} />
            <div style={{ marginTop: "1.1rem" }}>
              <div style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 800, fontFamily: "'Fraunces',serif", color: c.accent, lineHeight: 1, letterSpacing: "-0.03em" }}>
                <AnimNum to={c.value} suffix={c.suffix} />
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111", marginTop: "0.32rem" }}>{c.label}</div>
              <div style={{ fontSize: "0.61rem", color: "rgba(0,0,0,0.33)", marginTop: "0.18rem", display: "flex", alignItems: "center", gap: 3 }}>
                {c.sub} <ArrowRight size={9} />
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2.5, background: c.accent, opacity: 0.12 }} />
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4A · SKILLSET — HORIZONTAL BAR CHART
═══════════════════════════════════════════════════════════════ */
function SkillSnapshotCard({ existingSkills }: { existingSkills: { key: string; score: number }[] }) {
  const top = existingSkills.slice(0, 7);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <Card hover>
      <div style={{ padding: "1.5rem 1.5rem 1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <IconBox icon={<Brain size={15} />} color="#7c3aed" bg="#ede9fe" />
            <div>
              <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "#0a0a0a" }}>Existing Skillset</div>
              <div style={{ fontSize: "0.59rem", color: "rgba(0,0,0,0.34)", marginTop: 1 }}>From aptitude assessment</div>
            </div>
          </div>
          <Link href="/aptitude" style={{ fontSize: "0.61rem", fontWeight: 700, color: "#7c3aed", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
            Retake <ChevronRight size={10} />
          </Link>
        </div>
        <HR />
      </div>

      <div ref={ref} style={{ padding: "0 1.5rem 1.5rem" }}>
        {top.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>🧠</div>
            <p style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.38)", margin: "0 0 1rem", lineHeight: 1.6 }}>Take the assessment to reveal your skills</p>
            <Link href="/aptitude">
              <motion.button whileTap={{ scale: 0.97 }} style={{ padding: "0.5rem 1.1rem", background: "#ede9fe", color: "#7c3aed", border: "none", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Get Started →
              </motion.button>
            </Link>
          </div>
        ) : (
          <>
            {/* Axis ticks */}
            <div style={{ display: "flex", paddingLeft: 114, marginBottom: "0.45rem" }}>
              {[0, 25, 50, 75, 100].map(v => (
                <div key={v} style={{ flex: 1, textAlign: v === 0 ? "left" : "right" }}>
                  <span style={{ fontSize: "0.5rem", color: "rgba(0,0,0,0.2)", fontWeight: 600 }}>{v > 0 ? v : ""}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              {top.map((s, i) => {
                const color = PALETTE[i % PALETTE.length];
                return (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                    <span style={{ fontSize: "0.63rem", fontWeight: 600, color: "rgba(0,0,0,0.52)", width: 106, flexShrink: 0, textAlign: "right", lineHeight: 1.3 }}>
                      {tlabel(s.key)}
                    </span>
                    <div style={{ flex: 1, height: 9, background: "#f3f4f6", borderRadius: 99, overflow: "hidden", position: "relative" }}>
                      {[25, 50, 75].map(pct => (
                        <div key={pct} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.07)", zIndex: 0 }} />
                      ))}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: inView ? `${s.score}%` : "0%" }}
                        transition={{ duration: 1.9, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                        style={{ position: "relative", zIndex: 1, height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 8px ${color}30` }}
                      />
                    </div>
                    <span style={{ fontSize: "0.64rem", fontWeight: 800, color, width: 32, textAlign: "right", flexShrink: 0 }}>
                      {s.score}%
                    </span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: "1.2rem", padding: "0.55rem 0.85rem", background: "#f5f3ff", borderRadius: 10, border: "1px solid #e9d5ff" }}>
              <p style={{ fontSize: "0.59rem", color: "#7c3aed", fontWeight: 700, margin: 0 }}>✦ Traits scoring 50%+ on your assessment</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4B · CAREER MATCHES
═══════════════════════════════════════════════════════════════ */
function CareerMatchesCard({ topCareers, assessResult }: { topCareers: string[]; assessResult: any }) {
  const topCount = assessResult?.top_careers?.length ?? 0;
  return (
    <Card hover>
      <div style={{ padding: "1.5rem 1.5rem 1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <IconBox icon={<Award size={15} />} color="#0891b2" bg="#cffafe" />
            <div>
              <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "#0a0a0a" }}>Top Career Matches</div>
              <div style={{ fontSize: "0.59rem", color: "rgba(0,0,0,0.34)", marginTop: 1 }}>Personalised for you</div>
            </div>
          </div>
          <Link href="/explore" style={{ fontSize: "0.61rem", fontWeight: 700, color: "#0891b2", textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
            Explore all <ChevronRight size={10} />
          </Link>
        </div>
        <HR />
      </div>
      <div style={{ padding: "0 1.5rem 1.5rem" }}>
        {topCareers.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>🎯</div>
            <p style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.38)", margin: "0 0 1rem" }}>Complete assessment to see your matches</p>
            <Link href="/aptitude">
              <motion.button whileTap={{ scale: 0.97 }} style={{ padding: "0.5rem 1.1rem", background: "#cffafe", color: "#0891b2", border: "none", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                Get Started →
              </motion.button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.44rem" }}>
            {topCareers.slice(0, 7).map((name, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.06 + i * 0.05 }}
                whileHover={{ x: 3 }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0.68rem 0.9rem", borderRadius: 12,
                  background: i < topCount ? "#f5f3ff" : "#fafafa",
                  border: `1px solid ${i < topCount ? "#e9d5ff" : "rgba(0,0,0,0.06)"}`,
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: PALETTE[i % PALETTE.length], flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#111" }}>{name}</span>
                </div>
                <span style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.06em", borderRadius: 99, padding: "2px 8px", background: i < topCount ? "#ede9fe" : "#f3f4f6", color: i < topCount ? "#7c3aed" : "rgba(0,0,0,0.32)" }}>
                  {i < topCount ? "TOP MATCH" : "GOOD FIT"}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5 · SKILLS BANNER — Skills to Acquire from assessment
═══════════════════════════════════════════════════════════════ */
function SkillsBanner({ isAssessed, fallbackSkills }: { isAssessed: boolean; fallbackSkills: string[] }) {
  const skills = fallbackSkills.slice(0, 6);

  return (
    <Card style={{ marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
      {/* Top accent bar */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)", flexShrink: 0 }} />

      {/* Subtle dot-grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "22px 22px", pointerEvents: "none", borderRadius: 20,
      }} />

      <div style={{ padding: "2rem 2.2rem", position: "relative" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.6rem" }}>
          <div>
            <SectionLabel color="#d97706">Your Growth Roadmap</SectionLabel>
            <h3 style={{
              fontFamily: "'Fraunces',serif",
              fontSize: "clamp(1.15rem,2.8vw,1.6rem)",
              fontWeight: 700, color: "#0a0a0a",
              margin: "0.45rem 0 0.3rem", letterSpacing: "-0.025em",
            }}>
              Skills to Acquire
            </h3>
            <p style={{ fontSize: "0.68rem", color: "rgba(0,0,0,0.38)", margin: 0, lineHeight: 1.6 }}>
              {isAssessed
                ? "Identified from your aptitude gaps — build these to unlock your top career matches"
                : "Complete your assessment to get a personalised skill roadmap"}
            </p>
          </div>

          {isAssessed && (
            <Link href="/roadmaps">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "0.55rem 1.1rem", background: "#fffbeb",
                  border: "1px solid #fde68a", borderRadius: 10,
                  cursor: "pointer", fontSize: "0.7rem", fontWeight: 700,
                  color: "#b45309", textDecoration: "none",
                }}>
                <Map size={12} /> View Full Roadmap
              </motion.div>
            </Link>
          )}
        </div>

        {/* Skills grid or empty state */}
        {skills.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "0.75rem" }}>
              {skills.map((skill, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, type: "spring", stiffness: 260, damping: 20 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.65rem",
                    background: "#fff",
                    border: `1px solid ${PALETTE[i % PALETTE.length]}22`,
                    borderRadius: 14, padding: "0.8rem 1rem",
                    boxShadow: `0 2px 10px ${PALETTE[i % PALETTE.length]}10`,
                    position: "relative", overflow: "hidden",
                  }}>
                  {/* Soft color wash in corner */}
                  <div style={{
                    position: "absolute", top: -16, right: -16,
                    width: 60, height: 60, borderRadius: "50%",
                    background: PALETTE_LIGHT[i % PALETTE_LIGHT.length],
                    opacity: 0.6, pointerEvents: "none",
                  }} />
                  {/* Numbered badge */}
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: PALETTE[i % PALETTE.length],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.58rem", fontWeight: 800, color: "#fff",
                    boxShadow: `0 2px 6px ${PALETTE[i % PALETTE.length]}40`,
                    position: "relative",
                  }}>
                    {i + 1}
                  </div>
                  <span style={{
                    fontSize: "0.76rem", fontWeight: 700,
                    color: PALETTE[i % PALETTE.length],
                    lineHeight: 1.3, position: "relative",
                  }}>
                    {skill}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Footer callout */}
            <div style={{
              marginTop: "1.2rem", padding: "0.65rem 1rem",
              background: "#fffbeb", borderRadius: 10,
              border: "1px solid #fde68a",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: "0.9rem" }}>💡</span>
              <p style={{ fontSize: "0.61rem", color: "#92400e", fontWeight: 700, margin: 0 }}>
                These skills are prioritised by order — start with #1 and work your way down for maximum career impact.
              </p>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🗺️</div>
            <p style={{ fontSize: "0.83rem", color: "rgba(0,0,0,0.3)", fontStyle: "italic", margin: "0 0 1.2rem", lineHeight: 1.7 }}>
              Complete your assessment to unlock a personalised skill roadmap built just for you.
            </p>
            <Link href="/aptitude">
              <motion.button whileTap={{ scale: 0.97 }}
                style={{
                  padding: "0.65rem 1.4rem", background: "#fef3c7",
                  color: "#b45309", border: "1px solid #fde68a",
                  borderRadius: 10, fontSize: "0.75rem", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                Begin Assessment →
              </motion.button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6A · GROWTH AREAS — FIXED DONUT CHART
═══════════════════════════════════════════════════════════════ */
function GrowthCard({ needsGainSkills, skillMap }: { needsGainSkills: string[]; skillMap: Record<string, number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  if (needsGainSkills.length === 0 && Object.keys(skillMap).length > 0) return (
    <Card style={{ padding: "2rem 1.5rem" }}>
      <div style={{ textAlign: "center" }}>
        <CheckCircle2 size={34} color="#059669" style={{ marginBottom: 10 }} />
        <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(0,0,0,0.48)", margin: 0 }}>All traits above 50% — excellent!</p>
      </div>
    </Card>
  );

  if (needsGainSkills.length === 0) return (
    <Card>
      <div style={{ padding: "1.5rem 1.5rem 1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
          <IconBox icon={<TrendingUp size={15} />} color="#d97706" bg="#fef3c7" />
          <div>
            <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "#0a0a0a" }}>Growth Areas</div>
            <div style={{ fontSize: "0.59rem", color: "rgba(0,0,0,0.34)", marginTop: 1 }}>Traits below 50%</div>
          </div>
        </div>
        <HR />
      </div>
      <div style={{ padding: "0 1.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "2.2rem", marginBottom: "0.6rem" }}>📈</div>
        <p style={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.38)", margin: "0 0 1rem" }}>Complete assessment to discover growth areas</p>
        <Link href="/aptitude">
          <motion.button whileTap={{ scale: 0.97 }} style={{ padding: "0.5rem 1.1rem", background: "#fef3c7", color: "#b45309", border: "none", borderRadius: 99, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Get Started →
          </motion.button>
        </Link>
      </div>
    </Card>
  );

  const skills = needsGainSkills.slice(0, 6);

  /* ── Fixed pie math ──────────────────────────────────────────
     We assign a FIXED equal slice per skill (so visuals look clean),
     but label each with its actual score. Alternatively if you want
     proportional slices based on scores, replace `equalFrac` with
     `score / total`. Both approaches are shown below — using equal
     slices so the donut is always legible regardless of tiny scores.
  ─────────────────────────────────────────────────────────────── */
  const R = 52, CX = 70, CY = 70, strokeW = 18;
  const circumference = 2 * Math.PI * R;
  const gapDeg = 4; // gap between slices in degrees
  const gapLen = (gapDeg / 360) * circumference;
  const totalSlices = skills.length;
  const sliceLen = (circumference - totalSlices * gapLen) / totalSlices;

  type Seg = { key: string; score: number; color: string; lightBg: string; sliceLen: number; offset: number };
  const segs: Seg[] = skills.map((k, i) => ({
    key: k,
    score: skillMap[k] ?? 0,
    color: PALETTE[i % PALETTE.length],
    lightBg: PALETTE_LIGHT[i % PALETTE_LIGHT.length],
    sliceLen,
    // Each slice starts after: i * (sliceLen + gapLen), converted to dashOffset
    // dashOffset = circumference - start position (SVG draws clockwise from 3 o'clock, we rotate -90 to start at 12)
    offset: circumference - i * (sliceLen + gapLen),
  }));

  return (
    <Card hover>
      <div style={{ padding: "1.5rem 1.5rem 1.2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <IconBox icon={<TrendingUp size={15} />} color="#d97706" bg="#fef3c7" />
            <div>
              <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "#0a0a0a" }}>Growth Areas</div>
              <div style={{ fontSize: "0.59rem", color: "rgba(0,0,0,0.34)", marginTop: 1 }}>Traits below 50% · needs attention</div>
            </div>
          </div>
          <span style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.08em", color: "#d97706", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 99, padding: "3px 9px" }}>
            DEVELOP
          </span>
        </div>
        <HR />
      </div>

      <div ref={ref} style={{ padding: "0 1.5rem 1.5rem", display: "flex", alignItems: "center", gap: "1.4rem" }}>
        {/* ── Donut SVG ── */}
        <div style={{ flexShrink: 0 }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            {/* Background ring */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f3f4f6" strokeWidth={strokeW} />

            {segs.map((seg, i) => (
              <circle
                key={seg.key}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeW - 1}
                strokeLinecap="round"
                /* dasharray: visible slice length | rest of circumference (gap + other slices) */
                strokeDasharray={`${inView ? seg.sliceLen : 0} ${circumference}`}
                strokeDashoffset={seg.offset}
                style={{
                  transition: `stroke-dasharray 2s cubic-bezier(0.16,1,0.3,1) ${i * 160}ms`,
                  transform: "rotate(-90deg)",
                  transformOrigin: `${CX}px ${CY}px`,
                  filter: `drop-shadow(0 0 4px ${seg.color}40)`,
                }}
              />
            ))}

            {/* Centre label */}
            <text x={CX} y={CY - 7} textAnchor="middle" fill="rgba(0,0,0,0.35)" fontSize="7.5" fontWeight="700" fontFamily="DM Sans,sans-serif" letterSpacing="0.1em">NEEDS</text>
            <text x={CX} y={CY + 6} textAnchor="middle" fill="rgba(0,0,0,0.35)" fontSize="7.5" fontWeight="700" fontFamily="DM Sans,sans-serif" letterSpacing="0.1em">GROWTH</text>
          </svg>
        </div>

        {/* ── Legend ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.52rem", flex: 1 }}>
          {segs.map((seg, i) => (
            <motion.div key={seg.key}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.45 }}
              style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.67rem", fontWeight: 600, color: "rgba(0,0,0,0.58)", flex: 1 }}>{tlabel(seg.key)}</span>
              <span style={{ fontSize: "0.63rem", fontWeight: 800, color: seg.color, background: seg.lightBg, borderRadius: 6, padding: "1px 6px" }}>
                {seg.score}%
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6B · PERSONAL NOTE — truly personalised to the user
═══════════════════════════════════════════════════════════════ */
function PersonalNoteCard({ assessResult, name, thinkingStyle }: {
  assessResult: any; name: string; thinkingStyle?: string;
}) {
  const firstName = name.split(" ")[0] || "there";
  const topCareer = assessResult?.top_careers?.[0]?.name;
  const topSkills = assessResult?.existing_skills?.slice(0, 2)?.map((s: any) => tlabel(s.key)).join(" and ") ?? "";
  const personality = thinkingStyle ? (STYLE_PERSONALITIES[thinkingStyle] ?? defaultPersonality) : null;

  /* Build a note that references the user's actual data */
  let note = "";
  if (thinkingStyle && topCareer) {
    note = `${firstName}, as a ${thinkingStyle}, you naturally ${personality?.traits[0]?.toLowerCase() ?? "think differently from the crowd"}. Your profile points clearly toward a future in ${topCareer}${topSkills ? `, and the strengths you already carry — ${topSkills} — put you ahead of where most people start` : ""}. The path ahead isn't about finding who you are; it's about building on what you already know you're capable of.`;
  } else if (thinkingStyle) {
    note = `${firstName}, you carry the hallmarks of a ${thinkingStyle} — someone who ${personality?.traits[0]?.toLowerCase() ?? "approaches problems uniquely"}. That's not a small thing. The right career doesn't just use your skills; it amplifies them. Your assessment has revealed something real — now it's time to act on it.`;
  } else if (topCareer) {
    note = `${firstName}, your aptitude profile points strongly toward ${topCareer}. The traits you carry aren't just skills — they're the beginning of a career that will actually feel like you. Every data point here exists to help you move with clarity, not guesswork.`;
  } else {
    note = `${firstName}, once you complete your assessment, we'll write a note that speaks directly to your strengths, your thinking style, and the careers that are genuinely built for someone like you. It won't be generic — it'll be yours.`;
  }

  return (
    <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 3, background: "linear-gradient(90deg,#7c3aed,#0891b2,#059669,#d97706)", flexShrink: 0 }} />
      <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.1rem" }}>
          <motion.div
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{ width: 36, height: 36, borderRadius: 10, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
            ✉️
          </motion.div>
          <div>
            <SectionLabel color="#059669">Written for you, {firstName}</SectionLabel>
            <div style={{ fontSize: "0.83rem", fontWeight: 700, color: "#0a0a0a", marginTop: "0.3rem" }}>A Personal Note</div>
          </div>
        </div>

        <HR style={{ marginBottom: "1.2rem" }} />

        <div style={{ position: "relative", flex: 1 }}>
          <div style={{ position: "absolute", left: -2, top: -12, fontSize: "3.8rem", lineHeight: 1, color: "rgba(5,150,105,0.06)", fontFamily: "Georgia,serif", userSelect: "none", pointerEvents: "none" }}>"</div>
          <p style={{ fontSize: "clamp(0.82rem,1.8vw,0.9rem)", lineHeight: 1.95, fontStyle: "italic", fontFamily: "'Fraunces',Georgia,serif", color: "rgba(0,0,0,0.58)", margin: "0 0 1.2rem", paddingLeft: "0.85rem" }}>
            {note}
          </p>
        </div>

        <HR style={{ marginBottom: "0.9rem" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.56rem", fontWeight: 700, color: "rgba(0,0,0,0.2)", textTransform: "uppercase", letterSpacing: "0.13em" }}>Based on your aptitude profile</span>
          <Link href="/report" style={{ fontSize: "0.65rem", fontWeight: 700, color: "#059669", textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
            Full Report <ChevronRight size={10} />
          </Link>
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7 · CLOSING
═══════════════════════════════════════════════════════════════ */
function ClosingNote({ thinkingStyle, name }: { thinkingStyle?: string; name: string }) {
  const firstName = name.split(" ")[0] || "";
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.9 }}
      style={{ textAlign: "center", padding: "3rem 1rem 1.5rem" }}>
      <div style={{ width: 36, height: 1.5, background: "rgba(0,0,0,0.1)", margin: "0 auto 1.6rem", borderRadius: 2 }} />
      <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontSize: "clamp(0.88rem,2vw,1.05rem)", fontStyle: "italic", color: "rgba(0,0,0,0.26)", lineHeight: 2, maxWidth: "52ch", margin: "0 auto 0.9rem" }}>
        {thinkingStyle && firstName
          ? `Every ${thinkingStyle} has a path that's entirely their own, ${firstName} — yours is still unfolding. The best version of your career isn't found; it's built.`
          : `Your journey is just beginning. The careers, skills, and opportunities waiting for you are closer than you think.`}
      </p>
      <p style={{ fontSize: "0.58rem", color: "rgba(0,0,0,0.16)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>— WDIG Team</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const {
    userData, assessResult, skillMap, needsGainSkills,
    existingSkills, skillsToAcquire, topCareers, isAssessed, loading,
  } = useUser();

    console.log("skillsToAcquire:", skillsToAcquire);
  console.log("assessResult:", assessResult);
  
  const [ready, setReady] = useState(false);
  useEffect(() => { if (!loading) setTimeout(() => setReady(true), 80); }, [loading]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f8" }}>
      <div style={{ textAlign: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 36, height: 36, border: "2.5px solid #e9d5ff", borderTopColor: "#7c3aed", borderRadius: "50%", margin: "0 auto 1rem" }} />
        <p style={{ fontSize: "0.8rem", fontWeight: 500, color: "rgba(0,0,0,0.36)" }}>Loading your dashboard…</p>
      </div>
    </div>
  );

  const thinkingStyle = assessResult?.thinking_style?.primary?.label;
  const thinkingDesc  = assessResult?.thinking_style?.primary?.description;
  const firstName = userData.name.split(" ")[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,700;9..144,1,400;9..144,1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.18); border-radius: 99px; }
        ::-webkit-scrollbar-track { background: transparent; }
        .stat-grid { grid-template-columns: repeat(3,1fr) !important; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem; align-items: start; }
        @media (max-width: 720px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .two-col { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 460px) and (max-width: 720px) {
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      <AmbientGlows />

      {/* Warm off-white background + grain */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "#f7f7f8" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ position: "relative", zIndex: 1, fontFamily: "'DM Sans', sans-serif", maxWidth: 1060, margin: "0 auto", padding: "5.5rem 1.5rem 4rem" }}>

        {/* 1 · Hero — no card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <HeroSection
            name={userData.name}
            email={userData.email}
            isAssessed={isAssessed}
            thinkingStyle={thinkingStyle}
          />
        </motion.div>

        {/* 2 · Thinking style banner */}
        <ThinkingStyleBanner thinkingStyle={thinkingStyle} thinkingDesc={thinkingDesc} isAssessed={isAssessed} />

        {/* 3 · Stat cards */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.55 }}>
          <StatCards topCareers={topCareers} />
        </motion.div>

        {/* 4 · Skillset + Career matches */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19, duration: 0.55 }} className="two-col">
          <SkillSnapshotCard existingSkills={existingSkills} />
          <CareerMatchesCard topCareers={topCareers} assessResult={assessResult} />
        </motion.div>

        {/* 5 · Skills banner */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.55 }}>
          <SkillsBanner isAssessed={isAssessed} fallbackSkills={skillsToAcquire} />
        </motion.div>

        {/* 6 · Growth + Personal note */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.31, duration: 0.55 }} className="two-col">
          <GrowthCard needsGainSkills={needsGainSkills} skillMap={skillMap} />
          <PersonalNoteCard assessResult={assessResult} name={userData.name} thinkingStyle={thinkingStyle} />
        </motion.div>

        {/* 7 · Closing */}
        <ClosingNote thinkingStyle={thinkingStyle} name={userData.name} />

      </motion.div>
    </>
  );
}