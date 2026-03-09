"use client";
// ─────────────────────────────────────────────────────────────────────────────
// ProfileGate.tsx
// Drop this component at the TOP of your aptitude test page.
// It checks if the user has filled out their profile.
// If not → shows a full-screen blocking modal.
// If yes → renders children normally.
//
// USAGE in src/app/aptitude/page.jsx:
//   import ProfileGate from "@/components/ProfileGate";
//   export default function AptitudePage() {
//     return <ProfileGate><YourExistingAptitudeComponent /></ProfileGate>;
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";

const T = {
  ink: "#0D1B2A", inkMid: "#2C3E50", inkLight: "#5D7A8A",
  teal: "#0A7B6B", tealLight: "#E8F8F5", tealMid: "#14B89A",
  gold: "#C9962B", cream: "#FAFAF8", white: "#FFFFFF",
};

interface Props { children: React.ReactNode; }

export default function ProfileGate({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "missing" | "ok">("checking");
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.push("/login"); return; }
      setUid(user.uid);
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${user.uid}`);
        const { completed } = await res.json();
        setStatus(completed ? "ok" : "missing");
      } catch {
        // If API fails, let them through — don't block the test
        setStatus("ok");
      }
    });
    return () => unsub();
  }, [router]);

  if (status === "checking") return <CheckingScreen />;
  if (status === "missing") return <ProfileMissingModal uid={uid} onContinue={() => setStatus("ok")} />;
  return <>{children}</>;
}

// ── Checking screen ───────────────────────────────────────────────────────────
function CheckingScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${T.ink}, #0D2E3A)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ fontSize: "2.5rem", animation: "bob 1.8s ease infinite" }}>✦</div>
      <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "system-ui", fontSize: "0.85rem" }}>
        Getting things ready…
      </p>
    </div>
  );
}

// ── The blocking modal shown when profile is missing ─────────────────────────
function ProfileMissingModal({ uid, onContinue }: { uid: string | null; onContinue: () => void }) {
  const router = useRouter();
  const [skipping, setSkipping] = useState(false);

  const handleSkip = async () => {
    // Allow them to skip but track that they skipped
    setSkipping(true);
    // Save a minimal placeholder so we don't ask again this session
    // We just let them through — profile stays empty
    onContinue();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${T.ink} 0%, #0D2E3A 60%, #1A3A4A 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      {/* Background blobs */}
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.teal}10, transparent 65%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T.gold}0c, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{
        maxWidth: 520, width: "100%",
        animation: "fadeUp .5s cubic-bezier(.16,1,.3,1) both",
      }}>

        {/* Icon */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", width: 72, height: 72, borderRadius: 20,
            background: `${T.teal}20`, border: `1.5px solid ${T.teal}40`,
            alignItems: "center", justifyContent: "center",
            fontSize: "2rem", animation: "bob 3s ease infinite",
          }}>🧩</div>
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.28em",
            textTransform: "uppercase", color: T.tealMid, marginBottom: "0.6rem",
          }}>One quick step first</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 800, color: T.white, lineHeight: 1.1, marginBottom: "1rem",
          }}>Tell us who you are</h1>
          <p style={{
            color: "rgba(255,255,255,0.5)", fontSize: "0.9rem",
            lineHeight: 1.75, maxWidth: 400, margin: "0 auto",
          }}>
            Your aptitude test results are only as good as the context behind them.
            A 2-minute profile makes your report <em style={{ color: "rgba(255,255,255,0.75)" }}>dramatically more personal</em> — your career matches, roadmap, and advice will all be tailored to your real situation.
          </p>
        </div>

        {/* What you'll fill in — preview chips */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20, padding: "1.25rem 1.5rem",
          marginBottom: "1.75rem",
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: T.tealMid, marginBottom: "0.85rem" }}>
            What you'll tell us (takes ~2 min)
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {[
              "📚 Your stage (school / college / working)",
              "💰 Financial situation",
              "👨‍👩‍👧 Family pressure level",
              "⏱️ Time you can invest",
              "⚡ Skills you already have",
              "🎯 What success means to you",
              "🔮 Your 10-year vision",
              "💭 Your secret dream",
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 999, padding: "0.3rem 0.75rem",
                fontSize: "0.72rem", color: "rgba(255,255,255,0.7)",
              }}>{item}</div>
            ))}
          </div>
        </div>

        {/* Impact preview */}
        <div style={{
          background: `${T.teal}12`,
          border: `1px solid ${T.teal}30`,
          borderRadius: 16, padding: "1rem 1.25rem",
          marginBottom: "1.75rem",
          display: "flex", gap: "0.75rem", alignItems: "flex-start",
        }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>✨</span>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: 0 }}>
            Your report will include a <strong style={{ color: T.tealMid }}>personalised snapshot</strong> — 2–3 sentences written specifically about your situation, dream, and what's holding you back. Without a profile, this section won't exist.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <button
            onClick={() => router.push("/profile?from=aptitude")}
            style={{
              background: `linear-gradient(135deg, ${T.teal}, ${T.tealMid})`,
              border: "none", color: T.white,
              padding: "1rem", borderRadius: 14,
              cursor: "pointer", fontWeight: 700, fontSize: "0.95rem",
              fontFamily: "'Plus Jakarta Sans', system-ui",
              boxShadow: `0 8px 28px ${T.teal}40`,
              transition: "all .2s ease",
            }}
          >
            Fill in my profile first →
          </button>

          <button
            onClick={handleSkip}
            disabled={skipping}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.35)",
              padding: "0.75rem", borderRadius: 14,
              cursor: "pointer", fontSize: "0.78rem",
              fontFamily: "system-ui",
              transition: "all .2s ease",
            }}
          >
            Skip for now — take the test without a profile
          </button>
        </div>

        <p style={{
          textAlign: "center", color: "rgba(255,255,255,0.2)",
          fontSize: "0.66rem", marginTop: "1rem", lineHeight: 1.5,
        }}>
          You can always fill in your profile later from the profile page.
        </p>
      </div>
    </div>
  );
}
