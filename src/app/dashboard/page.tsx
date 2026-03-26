"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Target, Map, TrendingUp, Award,
  ArrowRight, Sparkles, CheckCircle2, Clock,
  Zap, Star, BarChart2,
} from "lucide-react";
import { useUser } from "../context/UserContext"; // adjust path
import { SkillsToAcquireWidget } from "../../components/SkillsToAcquireWidget";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface WidgetConfig { id: string; enabled: boolean; order: number; }

const DEFAULT_WIDGETS: WidgetConfig[] = [
  { id: "skillSnapshot",  enabled: true,  order: 0 },
  { id: "skillsToAcquire", enabled: true, order: 1 },
  { id: "careerMatches",  enabled: true,  order: 2 },
  { id: "roadmapLinks",   enabled: true,  order: 3 },
  { id: "quickActions",   enabled: true,  order: 4 },
  { id: "activityFeed",   enabled: true,  order: 5 },
  { id: "growthAreas",    enabled: true,  order: 6 },
];

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
const label = (k: string) =>
  TRAIT_LABELS[k] ?? k.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

/* ─── Animated counter ───────────────────────────────────────────────────── */
function Counter({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / (duration / 16));
    const t = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [to, duration]);
  return <>{val}</>;
}

/* ─── Skill mini-bar ─────────────────────────────────────────────────────── */
function MiniBar({ score, color }: { score: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), 300);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ height: 4, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", flex: 1 }}>
      <motion.div
        initial={{ width: 0 }} animate={{ width: `${w}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: "100%", borderRadius: 99, background: color }}
      />
    </div>
  );
}

/* ─── Card shell ─────────────────────────────────────────────────────────── */
function Card({ children, style = {}, className = "" }: {
  children: React.ReactNode; style?: React.CSSProperties; className?: string;
}) {
  return (
    <div className={className} style={{
      background: "#fff", borderRadius: 20, border: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04)",
      overflow: "hidden", ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Section header ─────────────────────────────────────────────────────── */
function SectionHeader({ icon, title, subtitle, action }: {
  icon: React.ReactNode; title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.01em" }}>{title}</h3>
          {subtitle && <p style={{ fontSize: "0.68rem", color: "#94a3b8", margin: "0.1rem 0 0" }}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ─── Empty state ────────────────────────────────────────────────────────── */
function EmptyState({ icon, text, link, small = false }: {
  icon: string; text: string; link?: string; small?: boolean;
}) {
  return (
    <div style={{ textAlign: "center", padding: small ? "1rem 0" : "1.5rem 0" }}>
      <div style={{ fontSize: small ? 28 : 36, marginBottom: "0.5rem" }}>{icon}</div>
      <p style={{ fontSize: "0.76rem", color: "#94a3b8", margin: "0 0 0.75rem", lineHeight: 1.5 }}>{text}</p>
      {link && (
        <Link href={link}>
          <motion.button whileTap={{ scale: 0.96 }}
            style={{ padding: "0.5rem 1.2rem", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", border: "none", borderRadius: 99, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", fontFamily: "inherit" }}>
            Get Started →
          </motion.button>
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WIDGET: Existing Skill Snapshot
   Source: aptitude test → normalizedTraits (score ≥ 50)
═══════════════════════════════════════════════════════════════════════════ */
function SkillSnapshot({ existingSkills }: { existingSkills: { key: string; score: number }[] }) {
  const top = existingSkills.slice(0, 8);

  if (top.length === 0) return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader
        icon={<Brain size={16} color="#2563eb" />}
        title="Existing Skillset"
        subtitle="From your aptitude test"
      />
      <EmptyState icon="🧠" text="Take the aptitude test to reveal your existing skills" link="/aptitude" />
    </Card>
  );

  return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader
        icon={<Brain size={16} color="#2563eb" />}
        title="Existing Skillset"
        subtitle="Skills you already have — from your aptitude test"
        action={
          <Link href="/aptitude" style={{ fontSize: "0.68rem", fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>
            Retake →
          </Link>
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {top.map((s, i) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748b", minWidth: 130, flexShrink: 0 }}>
              {label(s.key)}
            </span>
            <MiniBar
              score={s.score}
              color={s.score >= 75 ? "#2563eb" : s.score >= 60 ? "#7c3aed" : "#10b981"}
            />
            <span style={{
              fontSize: "0.68rem", fontWeight: 800,
              color: s.score >= 75 ? "#2563eb" : s.score >= 60 ? "#7c3aed" : "#10b981",
              minWidth: 30, textAlign: "right",
            }}>
              {s.score}%
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "0.9rem", padding: "0.6rem 0.8rem", background: "#eff6ff", borderRadius: 10, border: "1px solid #bfdbfe" }}>
        <p style={{ fontSize: "0.68rem", color: "#1d4ed8", fontWeight: 600, margin: 0 }}>
          ✦ These are traits scoring 50%+ on your aptitude assessment — skills you can leverage right now.
        </p>
      </div>
    </Card>
  );
}

/* ─── Widget: Growth Areas (low aptitude scores) ─────────────────────────── */
function GrowthAreasWidget({ needsGainSkills, skillMap }: {
  needsGainSkills: string[]; skillMap: Record<string, number>;
}) {
  if (needsGainSkills.length === 0 && Object.keys(skillMap).length > 0) return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader icon={<CheckCircle2 size={16} color="#22c55e" />} title="Aptitude Growth Areas" />
      <div style={{ textAlign: "center", padding: "1.2rem 0" }}>
        <CheckCircle2 size={28} color="#22c55e" style={{ marginBottom: 8 }} />
        <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>
          All aptitude traits score above 50% — great work!
        </p>
      </div>
    </Card>
  );

  if (needsGainSkills.length === 0) return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader icon={<TrendingUp size={16} color="#f59e0b" />} title="Aptitude Growth Areas" />
      <EmptyState icon="📈" text="Complete the assessment to discover growth areas" link="/aptitude" small />
    </Card>
  );

  return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader
        icon={<TrendingUp size={16} color="#f59e0b" />}
        title="Aptitude Growth Areas"
        subtitle="Traits below 50% — worth developing"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {needsGainSkills.slice(0, 5).map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#92400e" }}>
              {i + 1}
            </div>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "#64748b", minWidth: 110, flexShrink: 0 }}>
              {label(k)}
            </span>
            <MiniBar score={skillMap[k] ?? 0} color="#f59e0b" />
            <span style={{ fontSize: "0.66rem", fontWeight: 800, color: "#d97706", minWidth: 28, textAlign: "right" }}>
              {skillMap[k] ?? 0}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Widget: Career Matches ─────────────────────────────────────────────── */
function CareerMatchesWidget({ topCareers, assessResult }: {
  topCareers: string[]; assessResult: any;
}) {
  if (topCareers.length === 0) return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader icon={<Award size={16} color="#7c3aed" />} title="Career Matches" />
      <EmptyState icon="🎯" text="Complete the assessment to see your top career matches" link="/aptitude" />
    </Card>
  );

  const topCount = assessResult?.top_careers?.length ?? 0;
  return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader
        icon={<Award size={16} color="#7c3aed" />}
        title="Your Top Career Matches"
        action={
          <Link href="/explore" style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>
            Explore all →
          </Link>
        }
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {topCareers.slice(0, 6).map((name, i) => (
          <motion.div
            key={i} whileHover={{ x: 4 }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.6rem 0.8rem",
              background: i < topCount ? "linear-gradient(135deg,#eff6ff,#f5f3ff)" : "#f8fafc",
              borderRadius: 10,
              border: i < topCount ? "1px solid #bfdbfe" : "1px solid #f1f5f9",
              cursor: "default", transition: "background 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{i < topCount ? "⭐" : "◆"}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a" }}>{name}</span>
            </div>
            <span style={{
              fontSize: "0.62rem", fontWeight: 700,
              color: i < topCount ? "#2563eb" : "#94a3b8",
              background: i < topCount ? "#dbeafe" : "#f1f5f9",
              borderRadius: 99, padding: "2px 8px",
            }}>
              {i < topCount ? "Top Match" : "Good Fit"}
            </span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Widget: Roadmap Links ──────────────────────────────────────────────── */
function RoadmapLinksWidget({ topCareers }: { topCareers: string[] }) {
  return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader
        icon={<Map size={16} color="#10b981" />}
        title="Career Roadmaps"
        subtitle="Step-by-step paths for your goals"
      />
      {topCareers.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {topCareers.slice(0, 6).map((name, i) => (
            <Link
              key={i}
              href={`/roadmaps?career=${encodeURIComponent(name)}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "0.45rem 0.9rem", background: "#f0fdf4",
                border: "1.5px solid #a7f3d0", borderRadius: 99,
                fontSize: "0.73rem", fontWeight: 700, color: "#065f46",
                textDecoration: "none", transition: "all 0.2s",
              }}
            >
              <ArrowRight size={10} /> {name}
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🗺"
          text="Complete your assessment to unlock personalised roadmaps"
          link="/aptitude"
          small
        />
      )}
    </Card>
  );
}

/* ─── Widget: Quick Actions ──────────────────────────────────────────────── */
function QuickActionsWidget({ isAssessed }: { isAssessed: boolean }) {
  const actions = [
    { icon: "🧠", title: "Aptitude Test",   desc: isAssessed ? "Retake the test" : "Start your assessment",  href: "/aptitude",   color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
    { icon: "🎯", title: "Explore Careers", desc: isAssessed ? "See your matches"  : "Browse all careers",    href: "/explore",    color: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6" },
    { icon: "🏛",  title: "Find Colleges",  desc: "Institutes that fit your goals",                           href: "/institutes", color: "#ecfdf5", border: "#a7f3d0", text: "#065f46" },
    { icon: "🗺",  title: "Career Roadmaps",desc: "Step-by-step guidance",                                    href: "/roadmaps",   color: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
    { icon: "👥",  title: "Find Mentors",   desc: "Connect with industry experts",                            href: "/mentors",    color: "#fff1f2", border: "#fecdd3", text: "#be123c" },
    { icon: "👤",  title: "Your Profile",   desc: "View & edit your profile",                                 href: "/profile",    color: "#f8fafc", border: "#e2e8f0", text: "#334155" },
  ];

  return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader icon={<Zap size={16} color="#f59e0b" />} title="Quick Actions" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem" }}>
        {actions.map(a => (
          <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
            <motion.div
              whileHover={{ y: -3, boxShadow: `0 8px 24px ${a.border}80` }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "0.9rem", background: a.color,
                border: `1.5px solid ${a.border}`, borderRadius: 14,
                cursor: "pointer", transition: "box-shadow 0.2s",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: "0.4rem" }}>{a.icon}</div>
              <p style={{ fontSize: "0.75rem", fontWeight: 800, color: a.text, margin: "0 0 0.15rem" }}>{a.title}</p>
              <p style={{ fontSize: "0.63rem", color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>{a.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

/* ─── Widget: Activity Feed ──────────────────────────────────────────────── */
function ActivityFeedWidget({ acts }: { acts: any[] }) {
  const relTime = (ts: any) => {
    if (!ts) return "";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const m = Math.floor((Date.now() - d.getTime()) / 60000);
    if (m < 60)   return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m / 60)}h ago`;
    return `${Math.floor(m / 1440)}d ago`;
  };

  return (
    <Card style={{ padding: "1.5rem" }}>
      <SectionHeader icon={<Clock size={16} color="#64748b" />} title="Recent Activity" />
      {acts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {acts.slice(0, 5).map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", flexShrink: 0 }}>
                {a.icon || "📌"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.74rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.05rem" }}>{a.title}</p>
                <p style={{ fontSize: "0.64rem", color: "#94a3b8", margin: 0 }}>{relTime(a.date)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: "0.74rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic", padding: "1rem 0" }}>
          No activity yet. Take the aptitude test to get started!
        </p>
      )}
    </Card>
  );
}

/* ─── Greeting ───────────────────────────────────────────────────────────── */
function Greeting({ name, isAssessed, thinkingStyle }: {
  name: string; isAssessed: boolean; thinkingStyle?: string;
}) {
  const hour = new Date().getHours();
  const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h1 style={{
        fontFamily: "'DM Serif Display',serif",
        fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 400,
        color: "#0f172a", margin: "0 0 0.4rem", letterSpacing: "-0.02em",
      }}>
        {time},{" "}
        <span style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {name || "there"}
        </span>{" "}👋
      </h1>
      {isAssessed && thinkingStyle ? (
        <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>
          Your thinking style is <strong style={{ color: "#2563eb" }}>{thinkingStyle}</strong>. Here's your personalised dashboard.
        </p>
      ) : (
        <p style={{ fontSize: "0.88rem", color: "#64748b", margin: 0 }}>
          Take the aptitude test to unlock your personalised career dashboard.
        </p>
      )}
    </div>
  );
}

/* ─── Progress banner ────────────────────────────────────────────────────── */
function ProgressBanner({ isAssessed, progress }: { isAssessed: boolean; progress: number }) {
  if (isAssessed) return null;
  return (
    <div style={{
      marginBottom: "1.5rem",
      background: "linear-gradient(135deg,#eff6ff,#f5f3ff)",
      border: "1.5px solid #bfdbfe", borderRadius: 18,
      padding: "1.25rem 1.5rem", display: "flex",
      alignItems: "center", gap: "1.25rem", flexWrap: "wrap",
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 800, fontSize: "0.88rem", color: "#1e3a8a", margin: "0 0 0.5rem" }}>
          {progress > 0
            ? "Complete your aptitude test to unlock full personalisation"
            : "Take the aptitude test to power your dashboard"}
        </p>
        {progress > 0 && (
          <div style={{ height: 6, background: "#dbeafe", borderRadius: 99, overflow: "hidden", maxWidth: 300 }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#2563eb,#7c3aed)" }}
            />
          </div>
        )}
      </div>
      <Link href="/aptitude">
        <motion.button whileTap={{ scale: 0.96 }}
          style={{
            padding: "0.65rem 1.4rem",
            background: "linear-gradient(135deg,#2563eb,#7c3aed)",
            color: "#fff", border: "none", borderRadius: 11,
            fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center",
            gap: 6, whiteSpace: "nowrap",
          }}
        >
          <Sparkles size={13} /> {progress > 0 ? "Resume Test" : "Start Test"}
        </motion.button>
      </Link>
    </div>
  );
}

/* ─── Stats row ──────────────────────────────────────────────────────────── */
function StatsRow({ skillMap, topCareers, skillsToAcquire }: {
  skillMap: Record<string, number>; topCareers: string[]; skillsToAcquire: string[];
}) {
  const existing = Object.entries(skillMap).filter(([, v]) => v >= 50).length;
  const stats = [
    { icon: "🎯", label: "Career Matches",      value: topCareers.length,      color: "#7c3aed", bg: "#f5f3ff",  border: "#ddd6fe" },
    { icon: "✦",  label: "Existing Skills",      value: existing,               color: "#2563eb", bg: "#eff6ff",  border: "#bfdbfe" },
    { icon: "◎",  label: "Skills to Acquire",    value: skillsToAcquire.length, color: "#7c3aed", bg: "#faf5ff",  border: "#ddd6fe" },
    { icon: "⚡",  label: "Growth Areas",         value: Object.entries(skillMap).filter(([, v]) => v < 50).length, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "#fff", borderRadius: 18, padding: "1.2rem 1rem",
            border: `1.5px solid ${s.border}`,
            boxShadow: `0 2px 12px ${s.border}80`,
            textAlign: "center", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -12, right: -12, width: 60, height: 60, borderRadius: "50%", background: s.bg, opacity: 0.6 }} />
          <div style={{ fontSize: 22, marginBottom: "0.5rem" }}>{s.icon}</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: s.color, fontFamily: "monospace", lineHeight: 1 }}>
            <Counter to={s.value} />
          </div>
          <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600, marginTop: "0.35rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Widget toggle panel ────────────────────────────────────────────────── */
function WidgetPanel({ widgets, setWidgets }: {
  widgets: WidgetConfig[]; setWidgets: (w: WidgetConfig[]) => void;
}) {
  const LABELS: Record<string, string> = {
    skillSnapshot:   "Existing Skillset",
    skillsToAcquire: "Skills to Acquire",
    careerMatches:   "Career Matches",
    roadmapLinks:    "Career Roadmaps",
    quickActions:    "Quick Actions",
    activityFeed:    "Recent Activity",
    growthAreas:     "Aptitude Growth Areas",
  };
  const toggle = (id: string) =>
    setWidgets(widgets.map(w => w.id === id ? { ...w, enabled: !w.enabled } : w));

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
      style={{
        position: "absolute", top: "100%", right: 0, marginTop: 8,
        background: "#fff", borderRadius: 16, border: "1.5px solid #e2e8f0",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12)", padding: "1rem",
        zIndex: 50, minWidth: 240,
      }}
    >
      <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0f172a", margin: "0 0 0.75rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Customise Dashboard
      </p>
      {widgets.map(w => (
        <label
          key={w.id}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer" }}
        >
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#334155" }}>{LABELS[w.id]}</span>
          <div
            onClick={() => toggle(w.id)}
            style={{ width: 36, height: 20, borderRadius: 99, background: w.enabled ? "#2563eb" : "#cbd5e1", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
          >
            <motion.div
              animate={{ x: w.enabled ? 18 : 2 }}
              transition={{ type: "spring", stiffness: 600, damping: 35 }}
              style={{ position: "absolute", top: 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
            />
          </div>
        </label>
      ))}
    </motion.div>
  );
}

/* ─── Profile completeness ───────────────────────────────────────────────── */
function ProfileStrengthCard({ userData, isAssessed }: {
  userData: any; isAssessed: boolean;
}) {
  const checks = [
    { label: "Name",           done: !!userData.name },
    { label: "Bio",            done: !!userData.bio },
    { label: "Location",       done: !!userData.location },
    { label: "Career Interests", done: userData.interests.length > 0 },
    { label: "Aptitude Test",  done: isAssessed },
  ];
  const pct = Math.round((checks.filter(c => c.done).length / checks.length) * 100);

  return (
    <Card style={{ padding: "1.25rem" }}>
      <SectionHeader icon={<Star size={15} color="#f59e0b" />} title="Profile Strength" />
      <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", marginBottom: "0.85rem" }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: "100%", borderRadius: 99, background: pct === 100 ? "#22c55e" : "linear-gradient(90deg,#2563eb,#7c3aed)" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {c.done
              ? <CheckCircle2 size={13} color="#22c55e" />
              : <div style={{ width: 13, height: 13, borderRadius: "50%", border: "1.5px solid #e2e8f0" }} />}
            <span style={{ fontSize: "0.72rem", color: c.done ? "#334155" : "#94a3b8", fontWeight: c.done ? 600 : 400 }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
      {pct < 100 && (
        <Link
          href="/profile"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: "0.85rem", padding: "0.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: "0.72rem", fontWeight: 700, color: "#2563eb", textDecoration: "none" }}
        >
          Complete Profile <ArrowRight size={11} />
        </Link>
      )}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const {
    userData, assessResult, skillMap, needsGainSkills, existingSkills,
    skillsToAcquire, topCareers, isAssessed, loading,
  } = useUser();

  const [acts, setActs]                       = useState<any[]>([]);
  const [progress, setProgress]               = useState(0);
  const [widgets, setWidgets]                 = useState<WidgetConfig[]>(DEFAULT_WIDGETS);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [ready, setReady]                     = useState(false);

  /* Load / persist widget config */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dashboardWidgets_v2");
      if (saved) setWidgets(JSON.parse(saved));
    } catch { }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("dashboardWidgets_v2", JSON.stringify(widgets)); } catch { }
  }, [widgets]);

  /* Progress from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aptitudeProgress");
      if (saved) setProgress(Math.min(Number(saved), 99));
    } catch { }
  }, []);

  /* Activity feed */
  useEffect(() => {
    if (!userData.email) return;
    import("firebase/firestore").then(async ({ doc, getDoc }) => {
      const { db }   = await import("../../../firebase");
      const { auth } = await import("../../../firebase");
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const snap = await getDoc(doc(db, "activities", uid));
      if (snap.exists()) setActs((snap.data().items || []).slice(0, 5));
    });
  }, [userData.email]);

  useEffect(() => { if (!loading) setTimeout(() => setReady(true), 80); }, [loading]);

  const isEnabled = (id: string) => widgets.find(w => w.id === id)?.enabled ?? true;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f7ff" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #bfdbfe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1e40af" }}>Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#f0f7ff 0%,#fafbff 40%,#f5f3ff 100%)",
        fontFamily: "'Sora',sans-serif",
        opacity: ready ? 1 : 0, transition: "opacity 0.4s ease",
      }}>
        {/* Mesh BG */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-15%", right: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.05) 0%,transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-8%", left: "-4%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.05) 0%,transparent 70%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1080, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" , margin: "5rem "}}>
            <Greeting
              name={userData.name.split(" ")[0]}
              isAssessed={isAssessed}
              thinkingStyle={assessResult?.thinking_style?.primary?.label}
            />
            <div style={{ position: "relative", flexShrink: 0 }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowWidgetPanel(p => !p)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.6rem 1.1rem", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 11, fontWeight: 700, fontSize: "0.75rem", color: "#334155", cursor: "pointer", fontFamily: "inherit" }}
              >
                <BarChart2 size={13} /> Customise
              </motion.button>
              <AnimatePresence>
                {showWidgetPanel && (
                  <WidgetPanel widgets={widgets} setWidgets={setWidgets} />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress banner */}
          <ProgressBanner isAssessed={isAssessed} progress={progress} />

          {/* Stats */}
          <StatsRow skillMap={skillMap} topCareers={topCareers} skillsToAcquire={skillsToAcquire} />

          {/* Widget grid */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: "1.25rem", alignItems: "start" }}>

            {/* LEFT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {isEnabled("quickActions") && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
                  <QuickActionsWidget isAssessed={isAssessed} />
                </motion.div>
              )}

              {/* ── SKILLS SECTION: existing + to-acquire side by side ── */}
              {(isEnabled("skillSnapshot") || isEnabled("skillsToAcquire")) && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.13, duration: 0.5 }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}
                >
                  {isEnabled("skillSnapshot") && (
                    <SkillSnapshot existingSkills={existingSkills} />
                  )}
{isEnabled("skillsToAcquire") && (
  <SkillsToAcquireWidget
    isAssessed={isAssessed}
    fallbackSkills={skillsToAcquire}   // ← was: skillsToAcquire={skillsToAcquire}
  />
)}
                </motion.div>
              )}

              {isEnabled("careerMatches") && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.5 }}>
                  <CareerMatchesWidget topCareers={topCareers} assessResult={assessResult} />
                </motion.div>
              )}

              {isEnabled("roadmapLinks") && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}>
                  <RoadmapLinksWidget topCareers={topCareers} />
                </motion.div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              {isEnabled("activityFeed") && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}>
                  <ActivityFeedWidget acts={acts} />
                </motion.div>
              )}

              {isEnabled("growthAreas") && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17, duration: 0.5 }}>
                  <GrowthAreasWidget needsGainSkills={needsGainSkills} skillMap={skillMap} />
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.5 }}>
                <ProfileStrengthCard userData={userData} isAssessed={isAssessed} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}