"use client";
// ProfileGate.tsx — light theme, fully responsive
// Renders CareerProfileForm as a blocking modal over the aptitude page.

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebase";
import CareerProfileFormClient from "@/components/CareerProfileForm";

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
      setStatus("ok");
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.push("/login"); return; }
      await checkProfile(user.uid);
    });
    return () => unsub();
  }, [router]);

  const handleProfileComplete = () => setStatus("ok");

  if (status === "checking") return <CheckingScreen />;

  return (
    <>
      <div
        aria-hidden={status === "missing"}
        style={{
          visibility: status === "missing" ? "hidden" : "visible",
          pointerEvents: status === "missing" ? "none" : "auto",
        }}
      >
        {children}
      </div>

      {status === "missing" && (
        <ProfileModal onComplete={handleProfileComplete} />
      )}
    </>
  );
}

/* ── Checking screen ─────────────────────────────────────────────────────── */
function CheckingScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f7fa",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pg-spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "3px solid #dce4ee",
        borderTop: "3px solid #0A7B6B",
        animation: "pg-spin 0.85s linear infinite",
      }} />
      <p style={{ color: "#9AAAB8", fontSize: "0.85rem", fontWeight: 500, margin: 0 }}>
        Getting things ready…
      </p>
    </div>
  );
}

/* ── Profile Modal ───────────────────────────────────────────────────────── */
function ProfileModal({ onComplete }: { onComplete: () => void }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(13, 27, 42, 0.45)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      overflowY: "auto",
      overflowX: "hidden",
      padding: "24px 16px 48px",
      boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes pg-slideUp {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pg-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .pg-inner {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e4e9f0;
          width: 100%;
          max-width: 660px;
          overflow: hidden;
          box-shadow: 0 12px 48px rgba(13,27,42,0.14), 0 2px 8px rgba(13,27,42,0.06);
          animation: pg-slideUp 0.5s cubic-bezier(.16,1,.3,1) both;
        }

        .pg-head {
          background: linear-gradient(135deg, #f0faf7 0%, #fefcf5 100%);
          border-bottom: 1px solid #e4e9f0;
          padding: 28px 32px 24px;
          text-align: center;
        }

        .pg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #e6f5f1;
          border: 1px solid #b3dfd5;
          border-radius: 999px;
          padding: 5px 14px;
          margin-bottom: 16px;
          font-family: 'DM Sans', system-ui;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0A7B6B;
        }

        .pg-h1 {
          font-family: 'Lora', Georgia, serif;
          font-size: clamp(1.3rem, 4vw, 1.85rem);
          font-weight: 700;
          color: #0D1B2A;
          line-height: 1.25;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .pg-p {
          font-family: 'DM Sans', system-ui;
          font-size: 14px;
          color: #5D7A8A;
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto 22px;
        }

        .pg-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 4px;
        }
        .pg-step { display: flex; align-items: center; gap: 7px; }
        .pg-step-num {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #e6f5f1;
          border: 1.5px solid #b3dfd5;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #0A7B6B;
          font-family: 'DM Sans', system-ui;
          flex-shrink: 0;
        }
        .pg-step-lbl {
          font-size: 12px; color: #7a8fa6;
          font-weight: 500; font-family: 'DM Sans', system-ui;
        }
        .pg-sep { width: 22px; height: 1px; background: #dce4ee; margin: 0 4px; }

        .pg-body { padding: 28px 32px 32px; }

        .pg-shimmer-bar {
          height: 2px; border-radius: 999px;
          background: linear-gradient(90deg, #0A7B6B, #14B89A, #C9962B, #14B89A, #0A7B6B);
          background-size: 200% auto;
          animation: pg-shimmer 3s linear infinite;
          margin-bottom: 24px; opacity: 0.55;
        }

        .pg-foot {
          border-top: 1px solid #f0f4f8;
          padding: 16px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          background: #fafbfc;
        }
        .pg-foot-note {
          font-size: 12px; color: #9AAAB8;
          font-family: 'DM Sans', system-ui;
          display: flex; align-items: center; gap: 5px;
        }
        .pg-foot-dot {
          width: 6px; height: 6px;
          border-radius: 50%; background: #14B89A; flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 540px) {
          .pg-head { padding: 20px 18px 18px; }
          .pg-body { padding: 18px 18px 22px; }
          .pg-foot { padding: 14px 18px; flex-direction: column; align-items: stretch; }
          .pg-step-lbl { display: none; }
          .pg-sep { width: 12px; }
        }
      `}</style>

      <div className="pg-inner">

        {/* Header */}
        <div className="pg-head">
          <div className="pg-badge">🔒 Required before your assessment</div>
          <h1 className="pg-h1">Tell us a bit about yourself first</h1>
          <p className="pg-p">
            Your results will be deeply personalised based on your situation.
            Takes about 2 minutes and only needs to be done once.
          </p>
          <div className="pg-steps">
            {[
              { n: 1, label: "Who you are" },
              { n: 2, label: "Your situation" },
              { n: 3, label: "Your goals" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div className="pg-step">
                  <div className="pg-step-num">{s.n}</div>
                  <span className="pg-step-lbl">{s.label}</span>
                </div>
                {i < 2 && <div className="pg-sep" />}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="pg-body">
          <div className="pg-shimmer-bar" />
          <Suspense fallback={
            <div style={{
              padding: "60px 0",
              textAlign: "center",
              color: "#9AAAB8",
              fontFamily: "'DM Sans', system-ui",
              fontSize: "0.85rem",
            }}>
              Loading profile form…
            </div>
          }>
            <CareerProfileFormClientWithCallback onComplete={onComplete} />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="pg-foot">
          <div className="pg-foot-note">
            <div className="pg-foot-dot" />
            Saved securely · Only used to personalise your report
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Polls API until profile complete, then fires onComplete ─────────────── */
function CareerProfileFormClientWithCallback({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${user.uid}`);
        const { completed } = await res.json();
        if (completed) { clearInterval(interval); onComplete(); }
      } catch { /* ignore */ }
    }, 2000);
    return () => clearInterval(interval);
  }, [onComplete]);

  // If your CareerProfileFormClient accepts onComplete, pass it directly:
  // return <CareerProfileFormClient onComplete={onComplete} />;
  return <CareerProfileFormClient />;
}