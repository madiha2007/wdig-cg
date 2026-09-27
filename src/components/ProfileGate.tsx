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

// Refined palette: deep charcoal text, muted sage/teal accent, warm off-white surfaces.
const COLORS = {
  overlay: "rgba(18, 24, 22, 0.34)",
  boxBg: "#FDFCFA",
  headerBg: "#FAF8F4",
  border: "rgba(19, 31, 28, 0.09)",
  accent: "#4B7A6C",
  accentSoft: "rgba(75, 122, 108, 0.10)",
  textPrimary: "#16211E",
  textMuted: "rgba(22, 33, 30, 0.60)",
  textFaint: "rgba(22, 33, 30, 0.40)",
  shadow: "0 24px 64px -16px rgba(18,28,26,0.28), 0 8px 20px -8px rgba(18,28,26,0.10)",
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
        background: COLORS.boxBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: "24px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: `2.5px solid ${COLORS.border}`,
          borderTop: `2.5px solid ${COLORS.accent}`,
          animation: "spin 0.85s linear infinite",
        }}
      />
      <p
        style={{
          color: COLORS.textMuted,
          fontFamily: "'Plus Jakarta Sans', system-ui",
          fontSize: "0.9rem",
          letterSpacing: "0.01em",
          margin: 0,
        }}
      >
        Getting things ready…
      </p>
    </div>
  );
}

/* ── Profile Modal — full-screen, non-dismissable ───────────────────────── */
function ProfileModal({ onComplete }: { onComplete: () => void }) {
  // Live completion percentage, reported up by the form via onProgressChange.
  const [progress, setProgress] = useState(0);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: COLORS.overlay,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "hidden",
        padding: "clamp(16px, 4vw, 48px) 20px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        @keyframes modalIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .pg-modal-card { border-radius: 16px !important; }
          .pg-modal-header { padding: 24px 22px 20px !important; }
          .pg-modal-body { padding: 22px 22px 28px !important; }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .pg-modal-header { padding: 30px 32px 22px !important; }
          .pg-modal-body { padding: 26px 32px 32px !important; }
        }
      `}</style>

      {/* ── The box: same top spacing/behavior, refined visual treatment ── */}
      <div
        className="pg-modal-card"
        style={{
          width: "100%",
          maxWidth: 640,
          maxHeight: "100%",
          display: "flex",
          flexDirection: "column",
          background: COLORS.boxBg,
          borderRadius: 22,
          border: `1px solid ${COLORS.border}`,
          boxShadow: COLORS.shadow,
          overflow: "hidden",
          animation: "modalIn 0.42s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        {/* ── Header — moved up from the form's hero section, recolored light ── */}
        <div
          className="pg-modal-header"
          style={{
            padding: "36px 40px 26px",
            textAlign: "left",
            borderBottom: `1px solid ${COLORS.border}`,
            background: COLORS.headerBg,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "0.64rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: COLORS.accent,
              marginBottom: 10,
              fontFamily: "'Plus Jakarta Sans', system-ui",
            }}
          >
            Your Profile
          </div>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(1.5rem, 3.4vw, 2rem)",
              fontWeight: 600,
              color: COLORS.textPrimary,
              lineHeight: 1.2,
              margin: "0 0 12px",
              letterSpacing: "-0.01em",
            }}
          >
            Tell us who you are
          </h1>

          <p
            style={{
              color: COLORS.textMuted,
              fontSize: "0.88rem",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 0 24px",
              fontFamily: "'Plus Jakarta Sans', system-ui",
            }}
          >
            This helps us personalise your career report. Takes 2–3 minutes.
            Your answers are private and only used to improve your
            recommendations.
          </p>

          {/* Progress bar */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  fontSize: "0.64rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: COLORS.textFaint,
                  fontFamily: "'Plus Jakarta Sans', system-ui",
                }}
              >
                Profile completion
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: COLORS.accent,
                  fontFamily: "'Plus Jakarta Sans', system-ui",
                }}
              >
                {progress}%
              </span>
            </div>
            <div
              style={{
                height: 5,
                background: COLORS.border,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 999,
                  background: COLORS.accent,
                  transition: "width .5s cubic-bezier(.16,1,.3,1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Form body — scrolls when content exceeds the box ── */}
        <div
          className="pg-modal-body"
          style={{
            padding: "30px 40px 40px",
            background: COLORS.boxBg,
            overflowY: "auto",
            flex: "1 1 auto",
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  textAlign: "center",
                  padding: "64px 0",
                  color: COLORS.textFaint,
                  fontFamily: "'Plus Jakarta Sans', system-ui",
                  fontSize: "0.85rem",
                }}
              >
                Loading profile form…
              </div>
            }
          >
            <CareerProfileFormClientWithCallback
              onComplete={onComplete}
              onProgressChange={setProgress}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/* ── Wrapper that calls onComplete after successful save ─────────────────── */
function CareerProfileFormClientWithCallback({
  onComplete,
  onProgressChange,
}: {
  onComplete: () => void;
  onProgressChange?: (progress: number) => void;
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

  return <CareerProfileFormClient onProgressChange={onProgressChange} />;
}