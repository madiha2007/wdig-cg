"use client";
// ─────────────────────────────────────────────────────────────────────────────
// ProfileGate.tsx  — UPDATED
//
// Instead of redirecting to /profile, this renders the CareerProfileForm
// as a full-screen blocking modal ON the current page.
// The test content is mounted behind it but completely inaccessible.
//
// USAGE in src/app/aptitude/page.jsx (unchanged):
//   import ProfileGate from "@/components/ProfileGate";
//   export default function AptitudePage() {
//     return <ProfileGate><YourExistingAptitudeComponent /></ProfileGate>;
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import CareerProfileFormClient from "@/components/CareerProfileForm";

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

  const checkProfile = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/${userId}`);
      const { completed } = await res.json();
      setStatus(completed ? "ok" : "missing");
    } catch {
      // If API unreachable, let them through
      setStatus("ok");
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.push("/login"); return; }
      setUid(user.uid);
      await checkProfile(user.uid);
    });
    return () => unsub();
  }, [router]);

  // Callback fired by CareerProfileForm when the user successfully saves
  const handleProfileComplete = () => {
    setStatus("ok");
  };

  if (status === "checking") return <CheckingScreen />;

  return (
    <>
      {/* The actual test — always mounted but visually hidden + aria-hidden when modal is open */}
      <div
        aria-hidden={status === "missing"}
        style={{
          visibility: status === "missing" ? "hidden" : "visible",
          pointerEvents: status === "missing" ? "none" : "auto",
        }}
      >
        {children}
      </div>

      {/* Blocking profile modal — rendered on top of the test */}
      {status === "missing" && (
        <ProfileModal onComplete={handleProfileComplete} />
      )}
    </>
  );
}

/* ── Checking screen ──────────────────────────────────────────────────────── */
function CheckingScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${T.ink}, #0D2E3A)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div style={{ fontSize: "2.5rem", animation: "bob 1.8s ease infinite" }}>✦</div>
      <p style={{ color: "rgba(255,255,255,0.45)", fontFamily: "system-ui", fontSize: "0.85rem" }}>
        Getting things ready…
      </p>
    </div>
  );
}

/* ── Profile Modal — full screen, no close button, no escape ──────────────── */
function ProfileModal({ onComplete }: { onComplete: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(10, 20, 30, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto",
        padding: "0",
      }}
    // No onClick dismiss — this modal is non-dismissable
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header strip — stays sticky at top */}
      <div style={{
        width: "100%",
        background: `linear-gradient(135deg, ${T.ink} 0%, #0D2E3A 100%)`,
        padding: "28px 32px 24px",
        textAlign: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}>
        {/* Lock icon + label */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: `${T.teal}20`, border: `1px solid ${T.teal}35`,
          borderRadius: 999, padding: "5px 14px", marginBottom: 14,
        }}>
          <span style={{ fontSize: "0.75rem" }}>🔒</span>
          <span style={{
            fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.22em",
            textTransform: "uppercase", color: T.tealMid,
          }}>
            Required before your test
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
          fontWeight: 800, color: T.white,
          lineHeight: 1.15, margin: "0 0 10px",
        }}>
          Complete your profile first
        </h1>

        <p style={{
          color: "rgba(255,255,255,0.48)",
          fontSize: "0.85rem", lineHeight: 1.7,
          maxWidth: 460, margin: "0 auto",
          fontFamily: "'Plus Jakarta Sans', system-ui",
        }}>
          Your results will be personalised based on your answers below.
          This takes ~2 minutes and only needs to be done once.
        </p>

        {/* Progress hint */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 6, marginTop: 16,
        }}>
          {["Who you are", "Your situation", "Your goals"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 22, height: 22, borderRadius: "50%",
                background: `${T.teal}25`, border: `1px solid ${T.teal}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.6rem", fontWeight: 700, color: T.tealMid,
              }}>{i + 1}</span>
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
                {step}
              </span>
              {i < 2 && (
                <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem", marginLeft: 2 }}>›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form body */}
      <div style={{
        width: "100%",
        maxWidth: 780,
        padding: "32px 24px 60px",
        animation: "slideUp 0.45s cubic-bezier(.16,1,.3,1) both",
      }}>
        {/*
          CareerProfileFormClient handles its own save to the API.
          Pass an onComplete prop so it can signal us when done.
          You may need to add onComplete support to your CareerProfileFormClient
          — see the note below.
        */}
        <Suspense fallback={
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)", fontFamily: "system-ui", fontSize: "0.85rem" }}>
            Loading profile form…
          </div>
        }>
          <CareerProfileFormClientWithCallback onComplete={onComplete} />
        </Suspense>
      </div>
    </div>
  );
}

/*
  ── Wrapper that intercepts the form's submit and calls onComplete ────────────
  
  Your CareerProfileFormClient likely has its own submit / save logic.
  The cleanest approach: add an optional `onComplete?: () => void` prop to
  CareerProfileFormClient that gets called after a successful save.

  If you can't modify CareerProfileFormClient right now, this wrapper polls
  the API every 2 s after mount and calls onComplete when completed = true.
*/
function CareerProfileFormClientWithCallback({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Poll every 2s — once the form saves, the API will return completed: true
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const res = await fetch(`http://localhost:5000/api/profile/${user.uid}`);
        const { completed } = await res.json();
        if (completed) {
          clearInterval(interval);
          onComplete();
        }
      } catch {
        // ignore
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  // If CareerProfileFormClient accepts onComplete, pass it directly:
  // return <CareerProfileFormClient onComplete={onComplete} />;

  return <CareerProfileFormClient />;
}