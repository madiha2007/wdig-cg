"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { evaluateResponses } from "@/utils/evaluateResponses";
import { useAssessment } from "@/app/context/AssessmentContext";
import { auth } from "../../../firebase";
import ProfileGate from "../../components/ProfileGate";
import { useUser } from "@/app/context/UserContext";

/* ─── Section config: icon + colour per section title ───────────────── */
const SECTION_CONFIG: Record<string, { emoji: string; color: string; bg: string; label: string }> = {
  "Logical Reasoning": { emoji: "🧩", color: "#6366f1", bg: "rgba(99,102,241,0.12)", label: "Logic" },
  "Verbal Ability": { emoji: "💬", color: "#0891b2", bg: "rgba(8,145,178,0.12)", label: "Verbal" },
  "Numerical Ability": { emoji: "🔢", color: "#059669", bg: "rgba(5,150,105,0.12)", label: "Numerical" },
  "Spatial Reasoning": { emoji: "📐", color: "#d97706", bg: "rgba(217,119,6,0.12)", label: "Spatial" },
  "Personality": { emoji: "🧠", color: "#7c3aed", bg: "rgba(124,58,237,0.12)", label: "Personality" },
};
const DEFAULT_SEC = { emoji: "✦", color: "#0A7B6B", bg: "rgba(10,123,107,0.12)", label: "" };
function getSec(title: string) { return SECTION_CONFIG[title] ?? DEFAULT_SEC; }

/* ─── Streak messages ────────────────────────────────────────────────── */
const STREAK_MSGS: Record<number, string> = {
  3: "On a roll! 🔥",
  5: "Unstoppable! ⚡",
  7: "Blazing through! 🚀",
  10: "Absolute legend! 🏆",
};

/* ─── Section complete celebrations ─────────────────────────────────── */
const SECTION_DONE_MSGS = [
  "Section complete! You're flying. 🚀",
  "Nailed it! On to the next. ⚡",
  "Section done! Keep the momentum. 🔥",
  "Crushed it! One step closer. 💪",
];

/* ─── Floating particle on answer ───────────────────────────────────── */
function AnswerParticle({ trigger }: { trigger: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const emojis = ["✓", "⚡", "✦", "●"];
  useEffect(() => {
    if (!trigger) return;
    const p = {
      id: trigger,
      x: 40 + Math.random() * 60,
      y: 20 + Math.random() * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    };
    setParticles(prev => [...prev, p]);
    setTimeout(() => setParticles(prev => prev.filter(x => x.id !== p.id)), 800);
  }, [trigger]);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          fontSize: "1.1rem", color: "#0A7B6B", fontWeight: 700,
          animation: "floatUp 0.8s ease-out forwards",
        }}>{p.emoji}</div>
      ))}
    </div>
  );
}

/* ─── Section Complete Overlay ───────────────────────────────────────── */
function SectionCompleteOverlay({ section, onContinue }: { section: string; onContinue: () => void }) {
  const sec = getSec(section);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(10,20,30,0.85)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <style>{`
        @keyframes popIn { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
        @keyframes confettiFall { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(120px) rotate(360deg);opacity:0} }
      `}</style>
      {/* Confetti dots */}
      {[...Array(18)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${5 + (i * 5.5) % 90}%`,
          top: `${10 + (i * 7) % 40}%`,
          width: 8, height: 8,
          borderRadius: i % 3 === 0 ? "50%" : 2,
          background: ["#6366f1", "#0A7B6B", "#d97706", "#0891b2", "#7c3aed", "#059669"][i % 6],
          animation: `confettiFall ${0.8 + (i % 5) * 0.2}s ease-out ${(i * 0.07)}s forwards`,
        }} />
      ))}

      <div style={{
        background: "#0D1B2A", border: "1.5px solid rgba(255,255,255,0.1)",
        borderRadius: 28, padding: "48px 52px", textAlign: "center",
        maxWidth: 420, animation: "popIn 0.4s cubic-bezier(.16,1,.3,1) both",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px",
          background: sec.bg, border: `2px solid ${sec.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem",
        }}>{sec.emoji}</div>

        <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: sec.color, marginBottom: 10 }}>
          Section Complete
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>
          {section}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: 28, fontFamily: "'Plus Jakarta Sans', system-ui" }}>
          {SECTION_DONE_MSGS[Math.floor(Math.random() * SECTION_DONE_MSGS.length)]}
        </p>

        <button
          onClick={onContinue}
          style={{
            background: `linear-gradient(135deg, ${sec.color}, ${sec.color}cc)`,
            border: "none", color: "#fff", padding: "13px 36px",
            borderRadius: 14, cursor: "pointer", fontWeight: 700,
            fontSize: "0.92rem", fontFamily: "'Plus Jakarta Sans', system-ui",
            boxShadow: `0 8px 24px ${sec.color}40`,
            transition: "all 0.2s",
          }}
        >
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
    <div style={{
      position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #0A7B6B, #14B89A)",
      color: "#fff", borderRadius: 999, padding: "10px 24px",
      fontWeight: 700, fontSize: "0.88rem", zIndex: 200,
      boxShadow: "0 8px 28px rgba(10,123,107,0.45)",
      animation: "toastIn 0.35s cubic-bezier(.16,1,.3,1) both",
      fontFamily: "'Plus Jakarta Sans', system-ui",
    }}>
      {msg}
    </div>
  );
}

/* ─── Question Card ──────────────────────────────────────────────────── */
function QuestionCard({
  question, options, isPersonality, selectedOption,
  onSelect, questionNumber, totalInSection, sectionColor,
}: any) {
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e8edf3",
      borderRadius: 24,
      padding: "28px 28px 24px",
      boxShadow: "0 4px 24px rgba(13,27,42,0.07)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Accent bar top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}66)` }} />

      {/* Q number */}
      <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: sectionColor, marginBottom: 12 }}>
        Question {questionNumber} of {totalInSection}
      </div>

      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(1rem, 2vw, 1.15rem)",
        fontWeight: 700, color: "#0D1B2A",
        lineHeight: 1.6, marginBottom: 24,
      }}>
        {question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((option: any, i: number) => {
          const label = isPersonality ? option.label : option;
          const isSelected = selectedOption === i;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 18px",
                borderRadius: 14,
                border: isSelected ? `2px solid ${sectionColor}` : "2px solid #e8edf3",
                background: isSelected ? `${sectionColor}0e` : "#fafbfc",
                cursor: "pointer", textAlign: "left",
                transition: "all 0.18s cubic-bezier(.16,1,.3,1)",
                transform: isSelected ? "scale(1.015)" : "scale(1)",
                boxShadow: isSelected ? `0 4px 16px ${sectionColor}22` : "none",
              }}
            >
              {/* Option letter */}
              <span style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: isSelected ? sectionColor : "#e8edf3",
                color: isSelected ? "#fff" : "#7a8fa6",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.72rem", fontWeight: 800,
                transition: "all 0.18s",
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span style={{
                fontSize: "0.9rem",
                color: isSelected ? "#0D1B2A" : "#3d4f63",
                fontWeight: isSelected ? 600 : 400,
                fontFamily: "'Plus Jakarta Sans', system-ui",
                lineHeight: 1.5,
              }}>
                {label}
              </span>
              {isSelected && (
                <span style={{ marginLeft: "auto", color: sectionColor, fontSize: "1.1rem" }}>✓</span>
              )}
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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  // Gamification state
  const [streak, setStreak] = useState(0);
  const [showStreakToast, setShowStreakToast] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [completedSectionName, setCompletedSectionName] = useState("");
  const [questionAnim, setQuestionAnim] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then(res => { if (!res.ok) throw new Error("API failed"); return res.json(); })
      .then(data => setQuestions(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    // Animate question in
    setQuestionAnim(false);
    const t = setTimeout(() => setQuestionAnim(true), 30);
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
    <div style={{ minHeight: "100vh", background: "#0D1B2A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ fontSize: "2.5rem", animation: "bob 1.8s ease infinite" }}>🧩</div>
      <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Plus Jakarta Sans', system-ui", fontSize: "0.85rem" }}>Loading your assessment…</p>
    </div>
  );

  const currentSection = sections[currentSectionIndex] as any;
  const currentQuestion = currentSection.questions[currentQuestionIndex] as any;
  const isPersonalityQuestion = typeof currentQuestion.options[0] === "object";
  const sec = getSec(currentSection.title);

  const totalQuestions: number = sections.reduce((sum: number, s: any) => sum + s.questions.length, 0);
  const totalAnswered = Object.keys(answers).length;
  const overallProgress = Math.round((totalAnswered / totalQuestions) * 100);

  const sectionProgress = sections.map((section: any) => {
    const completed = section.questions.filter((q: any) => answers[q.id] !== undefined).length;
    return { title: section.title, percentage: Math.round((completed / section.questions.length) * 100) };
  });

  /* ── Answer ── */
  const handleAnswerSelect = (index: number) => {
    if (questionStartTime) {
      setAnswerTimes((prev: any) => ({ ...prev, [currentQuestion.id]: (Date.now() - questionStartTime) / 1000 }));
    }
    setSelectedOption(index);
    const value = isPersonalityQuestion ? currentQuestion.options[index].label : index;
    setAnswers((prev: any) => ({ ...prev, [currentQuestion.id]: value }));
    setSkippedQuestions(prev => { const c = new Set(prev); c.delete(currentQuestion.id); return c; });

    // Streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    if (STREAK_MSGS[newStreak]) {
      setShowStreakToast(true);
      setTimeout(() => setShowStreakToast(false), 2000);
    }
    // Particle
    setParticleTrigger(Date.now());
  };

  /* ── Navigation ── */
  const advanceQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex + 1 < currentSection.questions.length) {
      setCurrentQuestionIndex(i => i + 1);
    } else if (currentSectionIndex + 1 < sections.length) {
      // Section complete!
      setCompletedSectionName(currentSection.title);
      setShowSectionComplete(true);
    } else {
      handleSubmit();
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    advanceQuestion();
  };

  const handlePrevious = () => {
    setStreak(0);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = sections[currentSectionIndex - 1] as any;
      setCurrentSectionIndex(i => i - 1);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
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

  /* ── Submit ── */
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
      const res = await fetch("http://localhost:5000/api/predict", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, firebase_uid: auth.currentUser?.uid || null }),
      });
      if (res.ok) { const data = await res.json(); mlResult = data.prediction; }
    } catch (err: any) { console.warn("ML API unavailable:", err.message); }

    finalizeAssessment(finalResult, answers, mlResult);
    await refreshUser();

    try {
      const { auth: fbAuth, db } = await import("../../../firebase");
      const { doc, setDoc, getDoc } = await import("firebase/firestore");
      const user = fbAuth.currentUser;
      if (user) {
        await setDoc(doc(db, "assessments", user.uid), {
          ...mlResult,
          normalizedTraits: userProfile?.normalizedTraits ?? finalResult.traits,
          savedAt: new Date().toISOString(),
        });
        const actRef = doc(db, "activities", user.uid);
        const actSnap = await getDoc(actRef);
        const existing = actSnap.exists() ? (actSnap.data().items || []) : [];
        await setDoc(actRef, {
          items: [{ id: Date.now().toString(), type: "assessment", title: "Completed Aptitude Assessment", date: new Date().toISOString(), icon: "🧠" }, ...existing].slice(0, 20),
        });
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
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      {/* Streak toast */}
      {showStreakToast && <StreakToast streak={streak} />}

      {/* Section complete overlay */}
      {showSectionComplete && <SectionCompleteOverlay section={completedSectionName} onContinue={handleSectionContinue} />}

      {/* ── TOP HEADER ── */}
      <div style={{
        background: "#0D1B2A",
        padding: "0 24px",
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, padding: "14px 0" }}>
          {/* Section badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: sec.bg, border: `1px solid ${sec.color}30`,
            borderRadius: 10, padding: "7px 14px",
          }}>
            <span style={{ fontSize: "1rem" }}>{sec.emoji}</span>
            <div>
              <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: sec.color }}>{sec.label || "Section"}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{currentSection.title}</div>
            </div>
          </div>

          {/* Progress bar — stretches */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Overall Progress
              </span>
              <span style={{ fontSize: "0.75rem", color: "#14B89A", fontWeight: 800 }}>{overallProgress}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 99,
                background: `linear-gradient(90deg, #0A7B6B, #14B89A)`,
                width: `${overallProgress}%`,
                transition: "width 0.5s cubic-bezier(.16,1,.3,1)",
                boxShadow: "0 0 10px rgba(20,184,154,0.5)",
              }} />
            </div>
          </div>

          {/* Streak badge */}
          {streak >= 2 && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)",
              borderRadius: 10, padding: "7px 14px",
              color: "#fb923c", fontSize: "0.8rem", fontWeight: 800,
            }}>
              🔥 {streak}
            </div>
          )}

          {/* Q counter */}
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap" }}>
            <span style={{ color: "#fff" }}>{totalAnswered}</span> / {totalQuestions}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 40px", display: "grid", gridTemplateColumns: "220px 1fr 200px", gap: 20 }}>

        {/* ── LEFT: Sections panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a8fa6", marginBottom: 4, paddingLeft: 4 }}>Sections</div>
          {sections.map((section: any, sIndex: number) => {
            const s = getSec(section.title);
            const completed = section.questions.filter((q: any) => answers[q.id] !== undefined).length;
            const pct = Math.round((completed / section.questions.length) * 100);
            const isActive = sIndex === currentSectionIndex;
            return (
              <div key={section.title} style={{
                background: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                border: isActive ? `2px solid ${s.color}40` : "1.5px solid #e8edf3",
                borderRadius: 16, padding: "12px 14px",
                boxShadow: isActive ? `0 4px 20px ${s.color}15` : "none",
                transition: "all 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: isActive ? s.bg : "#f0f4f8",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem",
                  }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: isActive ? "#0D1B2A" : "#5D7A8A" }}>{section.title}</div>
                    <div style={{ fontSize: "0.62rem", color: "#94a3b8" }}>{completed}/{section.questions.length}</div>
                  </div>
                  {pct === 100 && <span style={{ marginLeft: "auto", color: "#059669", fontSize: "0.9rem" }}>✓</span>}
                </div>
                <div style={{ height: 4, background: "#e8edf3", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}aa)`, borderRadius: 99, transition: "width 0.4s" }} />
                </div>
                {/* Question dots — only for active section */}
                {isActive && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 10 }}>
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
                          style={{
                            width: 22, height: 22, borderRadius: 6, border: "none", cursor: "pointer",
                            background: isCurrent ? s.color : answered ? "#059669" : skipped ? "#f59e0b" : "#e8edf3",
                            color: isCurrent || answered ? "#fff" : "#7a8fa6",
                            fontSize: "0.6rem", fontWeight: 700,
                            transition: "all 0.15s",
                            transform: isCurrent ? "scale(1.2)" : "scale(1)",
                          }}
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

        {/* ── CENTER: Question ── */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 16,
          animation: questionAnim ? "fadeSlideIn 0.3s ease both" : "none",
          position: "relative",
        }}>
          <AnswerParticle trigger={particleTrigger} />

          {/* Section header */}
          <div style={{
            background: `linear-gradient(135deg, ${sec.color}18, ${sec.color}08)`,
            border: `1.5px solid ${sec.color}25`,
            borderRadius: 20, padding: "16px 20px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: sec.bg, border: `1.5px solid ${sec.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>{sec.emoji}</div>
            <div>
              <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: sec.color }}>Now answering</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 800, color: "#0D1B2A" }}>{currentSection.title}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              {/* Section mini progress */}
              {currentSection.questions.map((_: any, i: number) => (
                <div key={i} style={{
                  width: i === currentQuestionIndex ? 20 : 7,
                  height: 7, borderRadius: 99,
                  background: i < currentQuestionIndex ? sec.color : i === currentQuestionIndex ? sec.color : "#e8edf3",
                  opacity: i > currentQuestionIndex ? 0.4 : 1,
                  transition: "all 0.3s",
                }} />
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

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handlePrevious}
              style={{
                flex: 1, padding: "13px", borderRadius: 14,
                border: "2px solid #e8edf3", background: "#fff",
                color: "#5D7A8A", fontWeight: 700, fontSize: "0.88rem",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "'Plus Jakarta Sans', system-ui",
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleNotSure}
              style={{
                flex: 1, padding: "13px", borderRadius: 14,
                border: "2px solid #fde68a", background: "#fffbeb",
                color: "#92400e", fontWeight: 700, fontSize: "0.88rem",
                cursor: "pointer", transition: "all 0.15s",
                fontFamily: "'Plus Jakarta Sans', system-ui",
              }}
            >
              🤔 Not Sure
            </button>
            <button
              onClick={isLastQuestion ? handleSubmit : handleNext}
              disabled={selectedOption === null && !isLastQuestion}
              style={{
                flex: 2, padding: "13px", borderRadius: 14, border: "none",
                background: selectedOption !== null
                  ? `linear-gradient(135deg, ${sec.color}, ${sec.color}cc)`
                  : "#e8edf3",
                color: selectedOption !== null ? "#fff" : "#94a3b8",
                fontWeight: 700, fontSize: "0.92rem",
                cursor: selectedOption !== null ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: selectedOption !== null ? `0 6px 20px ${sec.color}35` : "none",
                fontFamily: "'Plus Jakarta Sans', system-ui",
              }}
            >
              {isLastQuestion ? "🎉 Submit Test" : "Next →"}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Section progress ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7a8fa6", marginBottom: 4, paddingLeft: 4 }}>Your Progress</div>
          {sectionProgress.map((sec: any, i: number) => {
            const s = getSec(sec.title);
            return (
              <div key={sec.title} style={{
                background: "rgba(255,255,255,0.8)", border: "1.5px solid #e8edf3",
                borderRadius: 14, padding: "12px 14px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0D1B2A" }}>{s.emoji} {sec.title.split(" ")[0]}</span>
                  <span style={{ fontSize: "0.7rem", fontWeight: 800, color: sec.percentage === 100 ? "#059669" : s.color }}>{sec.percentage}%</span>
                </div>
                <div style={{ height: 5, background: "#e8edf3", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${sec.percentage}%`, background: sec.percentage === 100 ? "#059669" : `linear-gradient(90deg, ${s.color}, ${s.color}aa)`, borderRadius: 99, transition: "width 0.5s" }} />
                </div>
              </div>
            );
          })}

          {/* Motivational blurb */}
          <div style={{
            marginTop: 8, background: "rgba(10,123,107,0.07)",
            border: "1.5px solid rgba(10,123,107,0.15)",
            borderRadius: 14, padding: "14px",
          }}>
            <p style={{ fontSize: "0.75rem", color: "#0A7B6B", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
              {overallProgress < 25 ? "🌱 Great start! Take your time." :
                overallProgress < 50 ? "⚡ Quarter done! Keep going." :
                  overallProgress < 75 ? "🔥 Halfway there! You're doing great." :
                    overallProgress < 100 ? "🚀 Almost done! Finish strong." :
                      "🎉 All done! Submitting…"}
            </p>
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