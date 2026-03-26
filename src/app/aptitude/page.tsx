"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { evaluateResponses } from "@/utils/evaluateResponses";
import { useAssessment } from "@/app/context/AssessmentContext";
import { auth } from "../../../firebase";
import ProfileGate from "../../components/ProfileGate";
import { useUser } from "@/app/context/UserContext";

/* ─── Section config ─────────────────────────────────────────────────── */
const SECTION_CONFIG: Record<string, { emoji: string; color: string; bg: string; label: string }> = {
  // ── Aptitude ──
  "Logical Reasoning":            { emoji: "🧩", color: "#6366f1", bg: "rgba(99,102,241,0.10)",   label: "Logic" },
  "Verbal Ability":               { emoji: "💬", color: "#0891b2", bg: "rgba(8,145,178,0.10)",    label: "Verbal" },
  "Verbal Reasoning":             { emoji: "📖", color: "#0891b2", bg: "rgba(8,145,178,0.10)",    label: "Verbal" },
  "Numerical Ability":            { emoji: "🔢", color: "#059669", bg: "rgba(5,150,105,0.10)",    label: "Numerical" },
  "Numerical Reasoning":          { emoji: "📊", color: "#059669", bg: "rgba(5,150,105,0.10)",    label: "Numerical" },
  "Spatial Reasoning":            { emoji: "📐", color: "#d97706", bg: "rgba(217,119,6,0.10)",    label: "Spatial" },
  // ── Personality & Self ──
  "Personality":                  { emoji: "🧠", color: "#7c3aed", bg: "rgba(124,58,237,0.10)",   label: "Personality" },
  "Personality & Work Style":     { emoji: "🎭", color: "#7c3aed", bg: "rgba(124,58,237,0.10)",   label: "Work Style" },
  "Motivation & Passion":         { emoji: "🔥", color: "#e11d48", bg: "rgba(225,29,72,0.10)",    label: "Motivation" },
  "Suppression & Self-Awareness": { emoji: "🪞", color: "#0e7490", bg: "rgba(14,116,144,0.10)",   label: "Self-Aware" },
  "Social Contribution & Values": { emoji: "🤝", color: "#16a34a", bg: "rgba(22,163,74,0.10)",    label: "Social" },
  "Learning Style":               { emoji: "🎓", color: "#ca8a04", bg: "rgba(202,138,4,0.10)",    label: "Learning" },
  // ── catch-all fallbacks by keyword ──
};

// Keyword-based fallback so any unrecognised title still gets a unique look
const KEYWORD_FALLBACKS: Array<{ kw: string; cfg: typeof SECTION_CONFIG[string] }> = [
  { kw: "logic",      cfg: { emoji: "🧩", color: "#6366f1", bg: "rgba(99,102,241,0.10)",  label: "Logic" } },
  { kw: "verbal",     cfg: { emoji: "📖", color: "#0891b2", bg: "rgba(8,145,178,0.10)",   label: "Verbal" } },
  { kw: "numer",      cfg: { emoji: "📊", color: "#059669", bg: "rgba(5,150,105,0.10)",   label: "Numerical" } },
  { kw: "spatial",    cfg: { emoji: "📐", color: "#d97706", bg: "rgba(217,119,6,0.10)",   label: "Spatial" } },
  { kw: "person",     cfg: { emoji: "🎭", color: "#7c3aed", bg: "rgba(124,58,237,0.10)",  label: "Personality" } },
  { kw: "motiv",      cfg: { emoji: "🔥", color: "#e11d48", bg: "rgba(225,29,72,0.10)",   label: "Motivation" } },
  { kw: "suppress",   cfg: { emoji: "🪞", color: "#0e7490", bg: "rgba(14,116,144,0.10)",  label: "Self-Aware" } },
  { kw: "social",     cfg: { emoji: "🤝", color: "#16a34a", bg: "rgba(22,163,74,0.10)",   label: "Social" } },
  { kw: "learn",      cfg: { emoji: "🎓", color: "#ca8a04", bg: "rgba(202,138,4,0.10)",   label: "Learning" } },
  { kw: "work",       cfg: { emoji: "💼", color: "#9333ea", bg: "rgba(147,51,234,0.10)",  label: "Work" } },
  { kw: "value",      cfg: { emoji: "⭐", color: "#16a34a", bg: "rgba(22,163,74,0.10)",   label: "Values" } },
  { kw: "creative",   cfg: { emoji: "🎨", color: "#db2777", bg: "rgba(219,39,119,0.10)",  label: "Creative" } },
  { kw: "empath",     cfg: { emoji: "💚", color: "#10b981", bg: "rgba(16,185,129,0.10)",  label: "Empathy" } },
  { kw: "analyt",     cfg: { emoji: "🔬", color: "#6366f1", bg: "rgba(99,102,241,0.10)",  label: "Analytical" } },
];

// Stable colour palette for truly unknown sections (cycles by index)
const FALLBACK_PALETTE = [
  { color: "#6366f1", bg: "rgba(99,102,241,0.10)",  emoji: "🔷" },
  { color: "#e11d48", bg: "rgba(225,29,72,0.10)",   emoji: "🔴" },
  { color: "#d97706", bg: "rgba(217,119,6,0.10)",   emoji: "🟠" },
  { color: "#16a34a", bg: "rgba(22,163,74,0.10)",   emoji: "🟢" },
  { color: "#0891b2", bg: "rgba(8,145,178,0.10)",   emoji: "🔵" },
  { color: "#7c3aed", bg: "rgba(124,58,237,0.10)",  emoji: "🟣" },
  { color: "#ca8a04", bg: "rgba(202,138,4,0.10)",   emoji: "🟡" },
  { color: "#0e7490", bg: "rgba(14,116,144,0.10)",  emoji: "🩵" },
];

// Cache so each unknown title always gets the same colour
const _unknownCache: Record<string, typeof SECTION_CONFIG[string]> = {};
let _unknownIdx = 0;

function getSec(title: string) {
  // 1. Exact match
  if (SECTION_CONFIG[title]) return SECTION_CONFIG[title];
  // 2. Keyword match (case-insensitive)
  const lower = title.toLowerCase();
  for (const { kw, cfg } of KEYWORD_FALLBACKS) {
    if (lower.includes(kw)) return cfg;
  }
  // 3. Stable fallback from palette
  if (!_unknownCache[title]) {
    const p = FALLBACK_PALETTE[_unknownIdx % FALLBACK_PALETTE.length];
    _unknownIdx++;
    _unknownCache[title] = { emoji: p.emoji, color: p.color, bg: p.bg, label: title.split(" ")[0] };
  }
  return _unknownCache[title];
}

/* ─── Streak messages ────────────────────────────────────────────────── */
const STREAK_MSGS: Record<number, string> = {
  3: "On a roll! 🔥", 5: "Unstoppable! ⚡", 7: "Blazing through! 🚀", 10: "Absolute legend! 🏆",
};

/* ─── Section complete messages ──────────────────────────────────────── */
const SECTION_DONE_MSGS = [
  "Section complete! You're flying. 🚀",
  "Nailed it! On to the next. ⚡",
  "Section done! Keep the momentum. 🔥",
  "Crushed it! One step closer. 💪",
];

/* ─── Floating particle ──────────────────────────────────────────────── */
function AnswerParticle({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const emojis = ["✓", "⚡", "✦", "●"];
  useEffect(() => {
    if (!trigger) return;
    const p = { id: trigger, x: 40 + Math.random() * 60, y: 20 + Math.random() * 40, emoji: emojis[Math.floor(Math.random() * emojis.length)] };
    setParticles(prev => [...prev, p]);
    setTimeout(() => setParticles(prev => prev.filter(x => x.id !== p.id)), 800);
  }, [trigger]);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, fontSize: "1.1rem", color: "#0A7B6B", fontWeight: 700, animation: "floatUp 0.8s ease-out forwards" }}>{p.emoji}</div>
      ))}
    </div>
  );
}

/* ─── Section Complete Overlay ───────────────────────────────────────── */
function SectionCompleteOverlay({ section, onContinue }: { section: string; onContinue: () => void }) {
  const sec = getSec(section);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,20,30,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @keyframes popIn { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(120px) rotate(360deg);opacity:0} }
      `}</style>
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{ position: "absolute", left: `${5 + (i * 5.5) % 90}%`, top: `${10 + (i * 7) % 40}%`, width: 8, height: 8, borderRadius: i % 3 === 0 ? "50%" : 2, background: ["#6366f1","#0A7B6B","#d97706","#0891b2","#7c3aed","#059669"][i % 6], animation: `confettiFall ${0.8 + (i % 5) * 0.2}s ease-out ${i * 0.07}s forwards` }} />
      ))}
      <div style={{ background: "#0D1B2A", border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 28, padding: "48px 52px", textAlign: "center", maxWidth: 420, animation: "popIn 0.4s cubic-bezier(.16,1,.3,1) both", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px", background: sec.bg, border: `2px solid ${sec.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>{sec.emoji}</div>
        <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: sec.color, marginBottom: 10 }}>Section Complete</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>{section}</h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 28, fontFamily: "'Plus Jakarta Sans', system-ui" }}>
          {SECTION_DONE_MSGS[Math.floor(Math.random() * SECTION_DONE_MSGS.length)]}
        </p>
        <button onClick={onContinue} style={{ background: `linear-gradient(135deg, ${sec.color}, ${sec.color}cc)`, border: "none", color: "#fff", padding: "13px 36px", borderRadius: 14, cursor: "pointer", fontWeight: 700, fontSize: "0.92rem", fontFamily: "'Plus Jakarta Sans', system-ui", boxShadow: `0 8px 24px ${sec.color}40` }}>
          Next Section →
        </button>
      </div>
    </div>
  );
}

/* ─── Streak Toast ───────────────────────────────────────────────────── */
function StreakToast({ streak }: { streak: number }) {
  const msg = STREAK_MSGS[streak];
  if (!msg) return null;
  return (
    <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #0A7B6B, #14B89A)", color: "#fff", borderRadius: 999, padding: "10px 24px", fontWeight: 700, fontSize: "0.88rem", zIndex: 200, boxShadow: "0 8px 28px rgba(10,123,107,0.45)", animation: "toastIn 0.35s cubic-bezier(.16,1,.3,1) both", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
      {msg}
    </div>
  );
}

/* ─── Question Card ──────────────────────────────────────────────────── */
function QuestionCard({ question, options, isPersonality, selectedOption, onSelect, questionNumber, totalInSection, sectionColor }: any) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e8edf3", borderRadius: 24, padding: "28px 28px 24px", boxShadow: "0 4px 24px rgba(13,27,42,0.07)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}66)` }} />
      <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: sectionColor, marginBottom: 12 }}>
        Question {questionNumber} of {totalInSection}
      </div>
      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 700, color: "#0D1B2A", lineHeight: 1.6, marginBottom: 24 }}>
        {question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((option: any, i: number) => {
          const label = isPersonality ? option.label : option;
          const isSelected = selectedOption === i;
          return (
            <button key={i} onClick={() => onSelect(i)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderRadius: 14, border: isSelected ? `2px solid ${sectionColor}` : "2px solid #e8edf3", background: isSelected ? `${sectionColor}0e` : "#fafbfc", cursor: "pointer", textAlign: "left", transition: "all 0.18s cubic-bezier(.16,1,.3,1)", transform: isSelected ? "scale(1.015)" : "scale(1)", boxShadow: isSelected ? `0 4px 16px ${sectionColor}22` : "none" }}>
              <span style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: isSelected ? sectionColor : "#e8edf3", color: isSelected ? "#fff" : "#7a8fa6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 800, transition: "all 0.18s" }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{ fontSize: "0.9rem", color: isSelected ? "#0D1B2A" : "#3d4f63", fontWeight: isSelected ? 600 : 400, fontFamily: "'Plus Jakarta Sans', system-ui", lineHeight: 1.5 }}>
                {label}
              </span>
              {isSelected && <span style={{ marginLeft: "auto", color: sectionColor, fontSize: "1.1rem" }}>✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main AptitudeTest ──────────────────────────────────────────────── */
const AptitudeTest = () => {
  const router = useRouter();
  const { finalizeAssessment, userProfile } = useAssessment()!;
  const { refreshUser } = useUser();

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [skippedQuestions, setSkippedQuestions] = useState(new Set<string>());
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [answerTimes, setAnswerTimes] = useState<Record<string, number>>({});
  const hasSubmitted = useRef(false);

  const [streak, setStreak] = useState(0);
  const [showStreakToast, setShowStreakToast] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [completedSectionName, setCompletedSectionName] = useState("");
  const [questionAnim, setQuestionAnim] = useState<"idle"|"out"|"in">("idle");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions`)
      .then(res => { if (!res.ok) throw new Error("API failed"); return res.json(); })
      .then(data => setQuestions(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setQuestionAnim("out");
    const t = setTimeout(() => setQuestionAnim("in"), 250);
    return () => clearTimeout(t);
  }, [currentQuestionIndex, currentSectionIndex]);

  const sections = useMemo(() => {
    if (!questions.length) return [];
    return Object.values(
      questions.reduce((acc: any, q: any) => {
        acc[q.section] ??= { title: q.section, questions: [] };
        acc[q.section].questions.push(q);
        return acc;
      }, {})
    );
  }, [questions]);

  if (!sections.length) return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ fontSize: "2.5rem", animation: "bob 1.8s ease infinite" }}>🧩</div>
      <p style={{ color: "#7a8fa6", fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: "0.85rem" }}>Loading your assessment…</p>
    </div>
  );

  const currentSection = sections[currentSectionIndex] as any;
  const currentQuestion = currentSection.questions[currentQuestionIndex] as any;
  const isPersonalityQuestion = typeof currentQuestion.options[0] === "object";
  const sec = getSec(currentSection.title);

  const totalQuestions: number = sections.reduce((sum: number, s: any) => sum + s.questions.length, 0);
  const totalAnswered = Object.keys(answers).length;
  const overallProgress = Math.round((totalAnswered / totalQuestions) * 100);

  /* ── Answer ── */
  const handleAnswerSelect = (index: number) => {
    if (questionStartTime) {
      setAnswerTimes((prev: any) => ({ ...prev, [currentQuestion.id]: (Date.now() - questionStartTime) / 1000 }));
    }
    setSelectedOption(index);
    const value = isPersonalityQuestion ? currentQuestion.options[index].label : index;
    setAnswers((prev: any) => ({ ...prev, [currentQuestion.id]: value }));
    setSkippedQuestions(prev => { const c = new Set(prev); c.delete(currentQuestion.id); return c; });
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (STREAK_MSGS[newStreak]) { setShowStreakToast(true); setTimeout(() => setShowStreakToast(false), 2000); }
    setParticleTrigger(Date.now());
  };

  const advanceQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < currentSection.questions.length) {
      setCurrentQuestionIndex(i => i + 1);
    } else if (currentSectionIndex + 1 < sections.length) {
      setCompletedSectionName(currentSection.title);
      setShowSectionComplete(true);
    } else {
      handleSubmit();
    }
  };

  const handleNext = () => { if (selectedOption === null) return; advanceQuestion(); };

  /* Restore the saved answer when navigating back */
  const restoreSelected = (sec: any, qIdx: number) => {
    const q = sec.questions[qIdx];
    if (answers[q.id] === undefined) { setSelectedOption(null); return; }
    const saved = answers[q.id];
    const idx = q.options.findIndex((opt: any, i: number) =>
      typeof opt === "object" ? opt.label === saved : i === saved
    );
    setSelectedOption(idx >= 0 ? idx : null);
  };

  const handlePrevious = () => {
    setStreak(0);
    if (currentQuestionIndex > 0) {
      const newIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIdx);
      restoreSelected(currentSection, newIdx);
    } else if (currentSectionIndex > 0) {
      const prevSec = sections[currentSectionIndex - 1] as any;
      const newQIdx = prevSec.questions.length - 1;
      setCurrentSectionIndex(i => i - 1);
      setCurrentQuestionIndex(newQIdx);
      restoreSelected(prevSec, newQIdx);
    }
  };

  const handleNotSure = () => {
    setStreak(0);
    setSkippedQuestions(prev => new Set(prev).add(currentQuestion.id));
    setSelectedOption(null);
    advanceQuestion();
  };

  const handleSectionContinue = () => {
    setShowSectionComplete(false);
    setCurrentSectionIndex(i => i + 1);
    setCurrentQuestionIndex(0);
    setStreak(0);
  };

  const handleSubmit = async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    const rawTraitScores = evaluateResponses(answers);
    const times = Object.values(answerTimes) as number[];
    const avgTime = times.reduce((a, b) => a + b, 0) / Math.max(times.length, 1);
    const confidence = Math.max(0, Math.min(1, 1 - avgTime / 20));
    const skipPenalty = skippedQuestions.size / totalQuestions;
    const adjustedConfidence = Math.max(0, Math.min(1, confidence - skipPenalty * 0.3));
    const finalResult = { traits: rawTraitScores.traits, meta: { ...rawTraitScores.meta, confidence: adjustedConfidence } };

    let mlResult = null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/predict`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers, firebase_uid: auth.currentUser?.uid || null }) });
      if (res.ok) { const data = await res.json(); mlResult = data.prediction; }
    } catch (err: any) { console.warn("ML API unavailable:", err.message); }

    finalizeAssessment(finalResult, answers, mlResult);
    await refreshUser();

    try {
      const { auth: fbAuth, db } = await import("../../../firebase");
      const { doc, setDoc, getDoc } = await import("firebase/firestore");
      const user = fbAuth.currentUser;
      if (user) {
        await setDoc(doc(db, "assessments", user.uid), { ...mlResult, normalizedTraits: userProfile?.normalizedTraits ?? finalResult.traits, savedAt: new Date().toISOString() });
        const actRef = doc(db, "activities", user.uid);
        const actSnap = await getDoc(actRef);
        const existing = actSnap.exists() ? (actSnap.data().items || []) : [];
        await setDoc(actRef, { items: [{ id: Date.now().toString(), type: "assessment", title: "Completed Aptitude Assessment", date: new Date().toISOString(), icon: "🧠" }, ...existing].slice(0, 20) });
      }
    } catch (err: any) { console.error("Firestore error:", err.message); }

    router.push("/results");
  };

  const isLastQuestion = currentSectionIndex === sections.length - 1 && currentQuestionIndex === currentSection.questions.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes floatUp { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-50px) scale(1.4)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(-12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes fadeSlideIn { 
          0%   { opacity:0; transform:translateY(22px) scale(0.985); }
          60%  { opacity:1; transform:translateY(-3px) scale(1.002); }
          100% { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fadeSlideOut {
          0%   { opacity:1; transform:translateY(0) scale(1); }
          100% { opacity:0; transform:translateY(-16px) scale(0.99); }
        }

        /* ── Responsive ── */
        .apt-body {
          max-width: 1000px;
          margin: 0 auto;
          padding: 16px 20px 48px;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 20px;
        }
        .sections-panel {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          align-content: start;
        }
        .section-card {
          background: rgba(255,255,255,0.5);
          border: 1.5px solid #e8edf3;
          border-radius: 14px;
          padding: 10px 12px;
          transition: all 0.18s cubic-bezier(.16,1,.3,1);
          backdrop-filter: blur(6px);
          outline: none;
          user-select: none;
        }
        .section-card:hover {
          background: rgba(255,255,255,0.85);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.09);
        }
        .section-card:active { transform: scale(0.97); }
        .section-card.active {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 20px rgba(0,0,0,0.09);
        }
        /* Tablet */
        @media (max-width: 768px) {
          .apt-body {
            grid-template-columns: 1fr;
          }
          .sections-panel {
            grid-template-columns: repeat(3, 1fr);
            order: 2;
          }
          .question-col { order: 1; }
        }
        /* Mobile */
        @media (max-width: 500px) {
          .sections-panel {
            grid-template-columns: repeat(2, 1fr);
          }
          .apt-header-inner {
            gap: 10px;
          }
        }
      `}</style>

      {showStreakToast && <StreakToast streak={streak} />}
      {showSectionComplete && <SectionCompleteOverlay section={completedSectionName} onContinue={handleSectionContinue} />}

      {/* ── PROGRESS BAR STRIP (below site nav, always visible) ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          padding: "10px 18px",
          display: "flex", alignItems: "center", gap: 14,
          boxShadow: "0 2px 16px rgba(13,27,42,0.07)",
        }}>
          {/* Section badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: sec.bg, border: `1px solid ${sec.color}40`, borderRadius: 10, padding: "6px 12px", flexShrink: 0 }}>
            <span style={{ fontSize: "1rem" }}>{sec.emoji}</span>
            <div>
              <div style={{ fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: sec.color }}>{sec.label || "Section"}</div>
              <div style={{ fontSize: "0.7rem", color: "#5D7A8A", fontWeight: 600 }}>{currentSection.title}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Overall Progress</span>
              <span style={{ fontSize: "0.72rem", color: "#0A7B6B", fontWeight: 800 }}>{overallProgress}%</span>
            </div>
            <div style={{ height: 7, background: "#e8edf3", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg, ${sec.color}, #14B89A)`, width: `${overallProgress}%`, transition: "width 0.5s cubic-bezier(.16,1,.3,1)", boxShadow: "0 0 8px rgba(20,184,154,0.4)" }} />
            </div>
          </div>

          {/* Streak badge */}
          {streak >= 2 && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.3)", borderRadius: 10, padding: "6px 12px", color: "#fb923c", fontSize: "0.8rem", fontWeight: 800, flexShrink: 0 }}>
              🔥 {streak}
            </div>
          )}

          {/* Q counter */}
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>
            <span style={{ color: "#0D1B2A", fontWeight: 800 }}>{totalAnswered}</span> / {totalQuestions}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="apt-body">

        {/* ── LEFT: Sections panel (2-col grid, lighter) ── */}
        <div className="sections-panel">
          <div style={{ gridColumn: "1/-1", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#94a3b8", paddingLeft: 2, marginBottom: 2 }}>Sections</div>

          {sections.map((section: any, sIndex: number) => {
            const s = getSec(section.title);
            const completed = section.questions.filter((q: any) => answers[q.id] !== undefined).length;
            const pct = Math.round((completed / section.questions.length) * 100);
            const isActive = sIndex === currentSectionIndex;

            return (
              <div
                key={section.title}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setCurrentSectionIndex(sIndex);
                  setCurrentQuestionIndex(0);
                  // restore selected option for first question of that section
                  const firstQ = section.questions[0];
                  if (answers[firstQ.id] !== undefined) {
                    const saved = answers[firstQ.id];
                    const idx = firstQ.options.findIndex((opt: any, i: number) =>
                      typeof opt === "object" ? opt.label === saved : i === saved
                    );
                    setSelectedOption(idx >= 0 ? idx : null);
                  } else {
                    setSelectedOption(null);
                  }
                }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") e.currentTarget.click(); }}
                className={`section-card${isActive ? " active" : ""}`}
                style={{ borderColor: isActive ? `${s.color}35` : "#e8edf3", boxShadow: isActive ? `0 2px 14px ${s.color}12` : "none", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: isActive ? s.bg : "#f0f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>{s.emoji}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, color: isActive ? "#0D1B2A" : "#7a8fa6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{section.title}</div>
                    <div style={{ fontSize: "0.58rem", color: "#94a3b8" }}>{completed}/{section.questions.length}</div>
                  </div>
                  {pct === 100 && <span style={{ marginLeft: "auto", color: "#059669", fontSize: "0.85rem", flexShrink: 0 }}>✓</span>}
                </div>

                {/* Mini progress bar */}
                <div style={{ height: 3, background: "#e8edf3", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#059669" : `linear-gradient(90deg, ${s.color}, ${s.color}aa)`, borderRadius: 99, transition: "width 0.4s" }} />
                </div>

                {/* Question dots — only active section */}
                {isActive && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 8 }}>
                    {section.questions.map((q: any, qIndex: number) => {
                      const answered = answers[q.id] !== undefined;
                      const skipped = skippedQuestions.has(q.id);
                      const isCurrent = qIndex === currentQuestionIndex;
                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            setCurrentSectionIndex(sIndex);
                            setCurrentQuestionIndex(qIndex);
                            setSelectedOption(answers[q.id] !== undefined ? section.questions[qIndex].options.findIndex((opt: any, i: number) => (typeof opt === "object" ? opt.label : i) === answers[q.id]) : null);
                          }}
                          style={{ width: 20, height: 20, borderRadius: 5, border: "none", cursor: "pointer", background: isCurrent ? s.color : answered ? "#059669" : skipped ? "#f59e0b" : "#e8edf3", color: isCurrent || answered ? "#fff" : "#7a8fa6", fontSize: "0.55rem", fontWeight: 700, transition: "all 0.15s", transform: isCurrent ? "scale(1.2)" : "scale(1)" }}
                        >
                          {qIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: Question column ── */}
        <div className="question-col" style={{ display: "flex", flexDirection: "column", gap: 16, animation: questionAnim === "in" ? "fadeSlideIn 0.55s cubic-bezier(.16,1,.3,1) both" : questionAnim === "out" ? "fadeSlideOut 0.2s ease-out both" : "none", position: "relative" }}>
          <AnswerParticle trigger={particleTrigger} />

          {/* Section header — light style (NO dark background) */}
          <div style={{ background: `linear-gradient(135deg, ${sec.color}12, ${sec.color}06)`, border: `1.5px solid ${sec.color}22`, borderRadius: 20, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: sec.bg, border: `1.5px solid ${sec.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", flexShrink: 0 }}>{sec.emoji}</div>
            <div>
              <div style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: sec.color }}>Now answering</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 800, color: "#0D1B2A" }}>{currentSection.title}</div>
            </div>
            {/* Section mini progress dots */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {currentSection.questions.map((_: any, i: number) => (
                <div key={i} style={{ width: i === currentQuestionIndex ? 18 : 6, height: 6, borderRadius: 99, background: i <= currentQuestionIndex ? sec.color : "#e8edf3", opacity: i > currentQuestionIndex ? 0.4 : 1, transition: "all 0.3s" }} />
              ))}
            </div>
          </div>

          {/* Question card */}
          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            isPersonality={isPersonalityQuestion}
            selectedOption={selectedOption}
            onSelect={handleAnswerSelect}
            questionNumber={currentQuestionIndex + 1}
            totalInSection={currentSection.questions.length}
            sectionColor={sec.color}
          />

          {/* Motivational blurb */}
          <div style={{ background: "rgba(10,123,107,0.06)", border: "1.5px solid rgba(10,123,107,0.12)", borderRadius: 14, padding: "12px 16px" }}>
            <p style={{ fontSize: "0.75rem", color: "#0A7B6B", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              {overallProgress < 25 ? "🌱 Great start! Take your time." : overallProgress < 50 ? "⚡ Quarter done! Keep going." : overallProgress < 75 ? "🔥 Halfway there! You're doing great." : overallProgress < 100 ? "🚀 Almost done! Finish strong." : "🎉 All done! Submitting…"}
            </p>
          </div>

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handlePrevious} style={{ flex: 1, padding: "13px", borderRadius: 14, border: "2px solid #e8edf3", background: "#fff", color: "#5D7A8A", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
              ← Back
            </button>
            <button onClick={handleNotSure} style={{ flex: 1, padding: "13px", borderRadius: 14, border: "2px solid #fde68a", background: "#fffbeb", color: "#92400e", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", transition: "all 0.15s", fontFamily: "'Plus Jakarta Sans', system-ui" }}>
              🤔 Not Sure
            </button>
            <button
              onClick={isLastQuestion ? handleSubmit : handleNext}
              disabled={selectedOption === null && !isLastQuestion}
              style={{ flex: 2, padding: "13px", borderRadius: 14, border: "none", background: selectedOption !== null ? `linear-gradient(135deg, ${sec.color}, ${sec.color}cc)` : "#e8edf3", color: selectedOption !== null ? "#fff" : "#94a3b8", fontWeight: 700, fontSize: "0.92rem", cursor: selectedOption !== null ? "pointer" : "not-allowed", transition: "all 0.2s", boxShadow: selectedOption !== null ? `0 6px 20px ${sec.color}35` : "none", fontFamily: "'Plus Jakarta Sans', system-ui" }}
            >
              {isLastQuestion ? "🎉 Submit Test" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AptitudePage() {
  return (
    <ProfileGate>
      <AptitudeTest />
    </ProfileGate>
  );
}