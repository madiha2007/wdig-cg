"use client";
// ProfileGate.tsx
// Renders the CareerProfileForm as a full-screen BLOCKING modal ON the current page.
// The test content is mounted behind it but completely inaccessible until profile is complete.

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import CareerProfileFormClient from "@/components/CareerProfileForm";

const T = {
  ink: "#0D1B2A",
  inkMid: "#2C3E50",
  inkLight: "#5D7A8A",
  teal: "#0A7B6B",
  tealLight: "#E8F8F5",
  tealMid: "#14B89A",
  gold: "#C9962B",
  cream: "#FAFAF8",
  white: "#FFFFFF",
};

interface Props {
  children: React.ReactNode;
}

export default function ProfileGate({ children }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "missing" | "ok">("checking");

  const checkProfile = async (userId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${userId}`);
      const { completed } = await res.json();
      setStatus(completed ? "ok" : "missing");
    } catch {
      // If API unreachable, let them through
      setStatus("ok");
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
      await checkProfile(user.uid);
    });
    return () => unsub();
  }, [router]);

  const handleProfileComplete = () => {
    setStatus("ok");
  };

  if (status === "checking") return <CheckingScreen />;

  return (
    <>
      {/* Actual test — always mounted, hidden when profile modal is open */}
      <div
        aria-hidden={status === "missing"}
        style={{
          visibility: status === "missing" ? "hidden" : "visible",
          pointerEvents: status === "missing" ? "none" : "auto",
        }}
      >
        {children}
      </div>

      {/* Blocking profile modal */}
      {status === "missing" && (
        <ProfileModal onComplete={handleProfileComplete} />
      )}
    </>
  );
}

/* ── Checking screen ─────────────────────────────────────────────────────── */
function CheckingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.ink}, #0D2E3A)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <style>{`
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `3px solid ${T.teal}30`,
          borderTop: `3px solid ${T.tealMid}`,
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p
        style={{
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Plus Jakarta Sans', system-ui",
          fontSize: "0.85rem",
          letterSpacing: "0.02em",
        }}
      >
        Getting things ready…
      </p>
    </div>
  );
}

/* ── Profile Modal — full-screen, non-dismissable ───────────────────────── */
function ProfileModal({ onComplete }: { onComplete: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(8, 15, 25, 0.82)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes headerFadeIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stepPop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(10,123,107,0.3); }
          50%       { box-shadow: 0 0 0 6px rgba(10,123,107,0); }
        }
      `}</style>

      {/* ── Sticky header ── */}
      <div
        style={{
          width: "100%",
          background: `linear-gradient(160deg, #0B1E2D 0%, #0D2E3A 60%, #0B2228 100%)`,
          padding: "32px 24px 28px",
          textAlign: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          animation: "headerFadeIn 0.5s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        {/* Lock badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: `${T.teal}18`,
            border: `1.5px solid ${T.teal}35`,
            borderRadius: 999,
            padding: "6px 16px",
            marginBottom: 18,
            animation: "pulse-border 2.5s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>🔒</span>
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.tealMid,
              fontFamily: "'Plus Jakarta Sans', system-ui",
            }}
          >
            Required before your assessment
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 800,
            color: T.white,
            lineHeight: 1.2,
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}
        >
          Tell us a bit about yourself first
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.42)",
            fontSize: "0.875rem",
            lineHeight: 1.75,
            maxWidth: 480,
            margin: "0 auto 24px",
            fontFamily: "'Plus Jakarta Sans', system-ui",
          }}
        >
          Your results will be deeply personalised based on your situation.
          This takes about 2 minutes and only needs to be done once.
        </p>

        {/* Step indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {[
            { label: "Who you are", icon: "👤" },
            { label: "Your situation", icon: "🌍" },
            { label: "Your goals", icon: "🎯" },
          ].map((step, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  animation: `stepPop 0.4s cubic-bezier(.16,1,.3,1) ${i * 0.1}s both`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `${T.teal}20`,
                    border: `1.5px solid ${T.teal}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {step.icon}
                </div>
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "rgba(255,255,255,0.38)",
                    fontWeight: 600,
                    fontFamily: "'Plus Jakarta Sans', system-ui",
                    letterSpacing: "0.01em",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background: "rgba(255,255,255,0.1)",
                    margin: "0 8px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Form body ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 800,
          padding: "36px 24px 80px",
          animation: "modalSlideUp 0.55s cubic-bezier(.16,1,.3,1) 0.1s both",
        }}
      >
        {/* Decorative top accent on the form area */}
        <div
          style={{
            height: 3,
            borderRadius: 99,
            background: `linear-gradient(90deg, transparent, ${T.teal}, ${T.tealMid}, ${T.gold}, transparent)`,
            backgroundSize: "200% auto",
            animation: "shimmer 3s linear infinite",
            marginBottom: 28,
            opacity: 0.6,
          }}
        />

        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                padding: "80px 0",
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'Plus Jakarta Sans', system-ui",
                fontSize: "0.85rem",
              }}
            >
              Loading profile form…
            </div>
          }
        >
          <CareerProfileFormClientWithCallback onComplete={onComplete} />
        </Suspense>
      </div>
    </div>
  );
}

/* ── Wrapper that calls onComplete after successful save ─────────────────── */
function CareerProfileFormClientWithCallback({
  onComplete,
}: {
  onComplete: () => void;
}) {
  useEffect(() => {
    // Poll every 2s — once the form saves, the API returns completed: true
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${user.uid}`
        );
        const { completed } = await res.json();
        if (completed) {
          clearInterval(interval);
          onComplete();
        }
      } catch {
        // ignore polling errors
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  // If CareerProfileFormClient accepts onComplete, pass it directly:
  // return <CareerProfileFormClient onComplete={onComplete} />;
  return <CareerProfileFormClient />;
} 