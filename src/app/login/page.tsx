"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "../../../firebase";
import Image from "next/image";

/* ─── Animated background (warm pastel gradient + orbs) ─── */
function BgCanvas() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <motion.div
        animate={{ scale: [1, 1.08, 1], x: [0, 14, 0], y: [0, -10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-20%", left: "-12%",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,218,110,0.52) 0%, rgba(255,195,90,0.28) 40%, transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.06, 1], x: [0, -16, 0], y: [0, 12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        style={{
          position: "absolute", bottom: "-22%", right: "-14%",
          width: 640, height: 640, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160,230,210,0.42) 0%, rgba(120,200,180,0.2) 45%, transparent 70%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1], y: [0, 16, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute", top: "30%", left: "-6%",
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,180,155,0.26) 0%, transparent 68%)",
        }}
      />
      {/* Top right lavender */}
      <motion.div
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        style={{
          position: "absolute", top: "-10%", right: "-8%",
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,185,255,0.28) 0%, transparent 68%)",
        }}
      />
    </div>
  );
}

/* ─── Floating trust badges on right panel ─── */
const BADGES = [
  { emoji: "🎯", title: "AI Career Match",       sub: "Personalised just for you",   top: "13%", right: "5%" },
  { emoji: "🗺️", title: "Your Roadmap Ready",    sub: "Step-by-step career paths",   top: "44%", right: "4%" },
  { emoji: "🏆", title: "500+ Success Stories",  sub: "Students placed globally",    top: "72%", right: "6%" },
];

function TrustBadge({ emoji, title, sub, top, right, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, type: "spring", stiffness: 180, damping: 18 }}
      style={{
        position: "absolute", top, right,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 18,
        padding: "11px 16px",
        boxShadow: "0 6px 28px rgba(0,0,0,0.12)",
        border: "1px solid rgba(255,255,255,0.8)",
        display: "flex", alignItems: "center", gap: 11,
        minWidth: 188,
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", lineHeight: 1.25 }}>{title}</div>
        <div style={{ fontSize: 10.5, color: "#6b7280", fontWeight: 500, marginTop: 2 }}>{sub}</div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd]       = useState(false);
  const [form, setForm]             = useState({ email: "", password: "" });
  const [errors, setErrors]         = useState<any>({});
  const [loading, setLoading]       = useState(false);
  const [gLoading, setGLoading]     = useState(false);
  const [remember, setRemember]     = useState(false);

  const handleChange = (e: any) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er: any) => ({ ...er, [e.target.name]: "", general: "" }));
  };

  /* ── Email/Password sign-in ── */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const errs: any = {};
    if (!form.email.trim()) errs.email    = "Email is required";
    if (!form.password)     errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      const user = result.user;
      sessionStorage.setItem("user", JSON.stringify({ email: user.email, name: user.displayName, photo: user.photoURL }));
      sessionStorage.setItem("wdig_uid", user.uid);
      window.dispatchEvent(new Event("sessionUpdated"));
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setErrors({ email: "No account found with this email" });
      } else if (err.code === "auth/wrong-password") {
        setErrors({ password: "Incorrect password" });
      } else {
        setErrors({ general: err.message || "Sign-in failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Google sign-in ── */
  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setErrors({ general: err.message || "Google sign-in failed." });
    } finally {
      setGLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
        
        /* ── Inputs ── */
        .login-input {
          width: 100%; height: 52px;
          padding: 0 16px 0 46px;
          border-radius: 14px;
          border: 1.5px solid rgba(0,0,0,0.11);
          background: rgba(255,255,255,0.72);
          font-family: 'Nunito', sans-serif;
          font-size: 14px; font-weight: 600; color: #1e2a3a;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .login-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3.5px rgba(139,92,246,0.14);
          background: #fff;
        }
        .login-input::placeholder { color: #b8c4d0; font-weight: 500; }
        .login-input.err { border-color: #ef4444 !important; }
        .pwd-input { padding-right: 50px; }

        /* ── Sign-in button ── */
        @keyframes gradient-shift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes shimmer-btn {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        .sign-btn {
          position: relative; overflow: hidden;
          width: 100%; height: 52px; border: none; border-radius: 14px;
          background: linear-gradient(135deg, #3b1fa8, #6d28d9, #7c3aed, #9333ea);
          background-size: 300% 300%;
          animation: gradient-shift 4s ease infinite;
          font-family: 'Nunito', sans-serif;
          font-weight: 900; font-size: 15px; color: #fff; letter-spacing: 0.02em;
          cursor: pointer;
          box-shadow: 0 8px 28px rgba(109,40,217,0.4);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .sign-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(109,40,217,0.48);
        }
        .sign-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .sign-btn::after {
          content: '';
          position: absolute; top: -20%; left: -80%; height: 140%; width: 50%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: skewX(-18deg);
          animation: shimmer-btn 3s ease 1.5s infinite;
        }

        /* ── Google button ── */
        .google-btn {
          width: 100%; height: 52px; border-radius: 14px;
          border: 1.5px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.88);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'Nunito', sans-serif;
          font-weight: 700; font-size: 14px; color: #374151;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: box-shadow 0.18s, transform 0.18s, background 0.18s;
        }
        .google-btn:hover:not(:disabled) {
          background: #fff;
          box-shadow: 0 6px 22px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        .google-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* ── Divider ── */
        .divider {
          display: flex; align-items: center; gap: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 700; color: #b0bac8;
          margin: 20px 0;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: rgba(0,0,0,0.09);
        }

        /* ── Checkbox ── */
        .cbx {
          width: 18px; height: 18px; border-radius: 5px;
          border: 1.5px solid rgba(0,0,0,0.18); background: #fff;
          cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.15s, background 0.15s;
        }
        .cbx.on { background: #7c3aed; border-color: #7c3aed; }

        /* ── Error text ── */
        .err-txt {
          font-size: 11.5px; color: #ef4444;
          font-weight: 600; margin-top: 5px; padding-left: 2px;
        }

        @media (max-width: 720px) {
          .nav-links { display: none; }
          .right-panel { display: none !important; }
          .left-panel { border-radius: 24px !important; }
        }
      `}</style>

      {/* Full-page warm gradient background */}




        {/* ═══ PAGE BODY — below navbar ═══ */}


          {/* Card container */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: "100%", maxWidth: "100vw",
              borderRadius: 28,
              overflow: "hidden",
              display: "flex",
              minHeight: "100vh",
              boxShadow: "0 28px 80px rgba(0,0,0,0.16), 0 2px 0 rgba(255,255,255,0.9) inset",
            }}
          >

            {/* ══ LEFT — white form panel ══════════════════════════════ */}
            <div
              className="left-panel"
              style={{
                flex: "0 0 650px",
                background: "#fff",
                padding: "52px 120px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: "28px 0 0 28px",
              }}
            >

              {/* Heading */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4 }}>
                <h1 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 34, fontWeight: 400, color: "#0a0a0a",
                  lineHeight: 1.12, letterSpacing: "-0.025em",
                  marginBottom: 10,
                }}>
                  Welcome Back!
                </h1>
                <p style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, lineHeight: 1.65, marginBottom: 30 }}>
                  Enter your email and password to access your account.
                </p>
              </motion.div>

              {/* Google */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}>
                <button className="google-btn" onClick={handleGoogle} disabled={gLoading || loading}>
                  <svg width="19" height="19" viewBox="0 0 48 48" fill="none">
                    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
                    <path d="M6.3 14.7l7 5.1C15.2 16.6 19.3 14 24 14c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.6 7.4 6.3 14.7z" fill="#FF3D00"/>
                    <path d="M24 46c5.5 0 10.5-1.8 14.4-5l-6.7-5.5C29.8 37.3 27 38 24 38c-6 0-11.1-4-12.9-9.5l-7 5.4C7.5 41.8 15.2 46 24 46z" fill="#4CAF50"/>
                    <path d="M44.5 20H24v8.5h11.8c-.9 2.8-2.8 5.1-5.2 6.6l6.7 5.5c3.8-3.5 6.2-8.8 6.2-15.6 0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
                  </svg>
                  <span>{gLoading ? "Signing in…" : "Sign in with Google"}</span>
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                className="divider">or sign in with email</motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate>
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {/* Email */}
                  <div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#b8c4d0", pointerEvents: "none" }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                      </div>
                      <input
                        name="email" type="email" value={form.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className={`login-input${errors.email ? " err" : ""}`}
                        autoComplete="email"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="err-txt">
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Password */}
                  <div>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: "#b8c4d0", pointerEvents: "none" }}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <input
                        name="password" type={showPwd ? "text" : "password"}
                        value={form.password} onChange={handleChange}
                        placeholder="Password"
                        className={`login-input pwd-input${errors.password ? " err" : ""}`}
                        autoComplete="current-password"
                      />
                      <button
                        type="button" onClick={() => setShowPwd(v => !v)}
                        style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" }}
                      >
                        {showPwd
                          ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                    <AnimatePresence>
                      {errors.password && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="err-txt">
                          {errors.password}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Remember + Forgot */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "4px 0 2px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                      <div className={`cbx${remember ? " on" : ""}`} onClick={() => setRemember(v => !v)}>
                        {remember && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Remember Me</span>
                    </label>
                    <Link href="/forgot-password" style={{ fontSize: 13, color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>
                      Forgot your password?
                    </Link>
                  </div>

                  {/* General error */}
                  <AnimatePresence>
                    {errors.general && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, fontSize: 12.5, color: "#dc2626", fontWeight: 600 }}>
                        {errors.general}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button type="submit" className="sign-btn" disabled={loading || gLoading} style={{ marginTop: 4 }}>
                    {loading ? (
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                          style={{ display: "inline-block", width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
                        />
                        Signing in…
                      </span>
                    ) : "Sign In →"}
                  </button>

                </motion.div>
              </form>

              {/* Sign up link */}
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ textAlign: "center", fontSize: 13.5, color: "#6b7280", fontWeight: 600, marginTop: 24 }}
              >
                Don't have an account?{" "}
                <Link href="/signup" style={{ color: "#7c3aed", fontWeight: 800, textDecoration: "none" }}>
                  create your account
                </Link>
              </motion.p>
            </div>

            {/* ══ RIGHT — illustration + badges ══════════════════════════ */}
            <div
              className="right-panel"
              style={{
                flex: 1,
                position: "relative",
                overflow: "hidden",
                borderRadius: "20px",
                backgroundImage: "url('/bg10.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "80vh",
                margin: "90px 40px 30px 0",
              }}
            >
              </div>


          </motion.div>

    </>
  );
}