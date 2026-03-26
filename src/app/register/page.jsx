"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { motion, AnimatePresence } from "framer-motion";

/* ─── PARTICLES ─── */
const PARTICLE_SEEDS = [
  { x: 5.2,  y: 22.1, size: 4.0, duration: 9.2,  delay: 0.4, opacity: 0.20, dx: 8  },
  { x: 94.5, y: 8.0,  size: 4.8, duration: 7.6,  delay: 1.1, opacity: 0.25, dx: -6 },
  { x: 3.1,  y: 88.2, size: 4.5, duration: 11.0, delay: 2.3, opacity: 0.16, dx: 5  },
  { x: 93.4, y: 70.0, size: 3.8, duration: 8.3,  delay: 0.7, opacity: 0.30, dx: -9 },
  { x: 88.6, y: 40.7, size: 4.2, duration: 9.8,  delay: 0.2, opacity: 0.38, dx: 10 },
  { x: 4.1,  y: 55.8, size: 5.0, duration: 7.1,  delay: 2.7, opacity: 0.18, dx: -7 },
  { x: 97.8, y: 50.9, size: 4.3, duration: 12.0, delay: 0.8, opacity: 0.22, dx: 8  },
  { x: 7.7,  y: 35.0, size: 3.6, duration: 9.4,  delay: 1.6, opacity: 0.28, dx: 9  },
];

function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {PARTICLE_SEEDS.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -40, 0], x: [0, p.dx, 0], opacity: [p.opacity, Math.min(p.opacity * 2, 0.7), p.opacity], scale: [1, 1.3, 1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: `radial-gradient(circle, rgba(139,92,246,${p.opacity * 2}), rgba(59,130,246,${p.opacity}))`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div style={{
      position: "fixed", left: pos.x - 200, top: pos.y - 200,
      width: 400, height: 400, borderRadius: "50%",
      background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
      pointerEvents: "none", zIndex: 0,
      transition: "left 0.15s ease, top 0.15s ease",
    }} />
  );
}

/* ─── PERKS (left panel) ─── */
const PERKS = [
  { icon: "🧪", title: "AI Aptitude Test", desc: "Discover your strengths in just 15 minutes" },
  { icon: "🎯", title: "Personalized Roadmaps", desc: "Step-by-step career plans built for you" },
  { icon: "🏫", title: "College Recommendations", desc: "Top institutes matched to your goals" },
  { icon: "🤝", title: "Expert Mentors", desc: "Connect with pros who've been there" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 2-step form

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Full name is required";
    if (!form.email.includes("@")) err.email = "Enter a valid email";
    if (!form.phone.match(/^[0-9]{10}$/)) err.phone = "Enter a valid 10-digit phone number";
    if (form.password.length < 6) err.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) err.confirmPassword = "Passwords do not match";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep1 = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Full name is required";
    if (!form.email.includes("@")) err.email = "Enter a valid email";
    if (!form.phone.match(/^[0-9]{10}$/)) err.phone = "Enter a valid 10-digit phone number";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      await updateProfile(userCred.user, { displayName: form.name.trim() });

      sessionStorage.setItem("user", JSON.stringify({ name: form.name.trim(), email: userCred.user.email, uid: userCred.user.uid }));
      sessionStorage.setItem("wdig_uid", userCred.user.uid);

      const ref = doc(db, "users", userCred.user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          name: form.name.trim(),
          email: userCred.user.email || "",
          phone: form.phone.trim(),
          education: "Undergraduate",
          location: "",
          bio: "",
          photoURL: userCred.user.photoURL || null,
          role: "Student",
          createdAt: new Date().toISOString(),
          interests: [],
          hobbies: [],
        });
      }

      window.dispatchEvent(new Event("sessionUpdated"));
      router.push("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") setErrors({ email: "Email already registered" });
      else if (err.code === "auth/weak-password") setErrors({ password: "Use at least 6 characters" });
      else if (err.code === "auth/invalid-email") setErrors({ email: "Invalid email address" });
      else if (err.code === "auth/network-request-failed") setErrors({ general: "Network error. Check your connection." });
      else setErrors({ general: `Error: ${err.code || err.message}` });
    } finally {
      setLoading(false);
    }
  };

  /* Password strength */
  const pwStrength = (() => {
    const pw = form.password;
    if (!pw) return { label: "", color: "transparent", width: "0%" };
    if (pw.length < 6) return { label: "Too short", color: "#ef4444", width: "25%" };
    if (pw.length < 8) return { label: "Weak", color: "#f97316", width: "50%" };
    if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: "Fair", color: "#eab308", width: "70%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  })();

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: "#f8f9ff", position: "relative", overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Lora:ital,wght@1,600;1,700&display=swap');

        @keyframes shimmer {
          0% { left: -60%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 120%; opacity: 0; }
        }
        @keyframes float-orb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.04); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .input-field {
          width: 100%;
          padding: 13px 16px;
          border-radius: 14px;
          border: 1.5px solid rgba(0,0,0,0.12);
          background: rgba(255,255,255,0.7);
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          color: #1e2a3a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #fff;
        }
        .input-field::placeholder { color: #aab4c4; }

        .submit-btn {
          position: relative; overflow: hidden;
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b82f6, #7c3aed, #ec4899);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          font-family: 'Nunito', sans-serif;
          font-weight: 800; font-size: 15px;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 6px 24px rgba(59,130,246,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(59,130,246,0.45);
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .submit-btn::after {
          content: '';
          position: absolute; top: 50%; left: -75%;
          width: 50%; height: 200%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg) translateY(-50%);
          animation: shimmer 2.5s ease 1s infinite;
        }

        .back-btn {
          background: none; border: 1.5px solid rgba(0,0,0,0.12);
          border-radius: 14px; padding: 14px;
          width: 100%;
          font-family: 'Nunito', sans-serif;
          font-weight: 700; font-size: 14px; color: #6b7280;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .back-btn:hover { background: rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.2); }

        @keyframes gradient-shift {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .show-pwd-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none;
          font-family: 'Nunito', sans-serif;
          font-size: 12px; font-weight: 700;
          color: #3b82f6; cursor: pointer;
          padding: 4px 6px;
        }

        .step-dot {
          width: 8px; height: 8px; border-radius: 50%;
          transition: all 0.3s ease;
        }
        .step-dot.active {
          width: 24px; border-radius: 4px;
          background: linear-gradient(90deg, #3b82f6, #7c3aed);
        }
        .step-dot.done { background: #22c55e; }
        .step-dot.inactive { background: rgba(0,0,0,0.12); }
      `}</style>

      <CursorGlow />
      <Particles />

      {/* BG Orbs */}
      <div style={{ position: "fixed", top: -120, left: -80, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)", pointerEvents: "none", animation: "float-orb 9s ease-in-out infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.09) 0%, transparent 70%)", pointerEvents: "none", animation: "float-orb 11s ease-in-out 3s infinite", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 0 }} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", minHeight: "100vh", display: "flex", alignItems: "center", gap: 48, position: "relative", zIndex: 1 }}>

        {/* LEFT PANEL */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ flex: 1, position: "relative" }}
          className="hidden lg:block"
        >
          {/* Rotating rings */}
          <div style={{ position: "absolute", top: "50%", left: "55%", width: 380, height: 380, transform: "translate(-50%,-50%)", border: "1px dashed rgba(59,130,246,0.15)", borderRadius: "50%", animation: "spin-slow 25s linear infinite", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "55%", width: 260, height: 260, transform: "translate(-50%,-50%)", border: "1px dashed rgba(139,92,246,0.12)", borderRadius: "50%", animation: "spin-slow 18s linear reverse infinite", pointerEvents: "none" }} />

          <div style={{ paddingLeft: 40, paddingTop: 20, position: "relative" }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(236,72,153,0.10))",
                border: "1px solid rgba(59,130,246,0.25)",
                borderRadius: 999, padding: "6px 16px",
                fontSize: 11, fontWeight: 800, color: "#2563eb",
                letterSpacing: "0.08em", textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
              Free · No Credit Card · 2 Minutes
            </motion.div>

            <h1 style={{ fontSize: "clamp(30px,3.5vw,46px)", fontFamily: "'Lora', serif", fontStyle: "italic", fontWeight: 700, lineHeight: 1.2, marginBottom: 8, color: "#1e2a3a" }}>
              Start your journey to
            </h1>
            <h1 style={{ fontSize: "clamp(30px,3.5vw,46px)", fontFamily: "'Lora', serif", fontStyle: "italic", fontWeight: 700, lineHeight: 1.2, marginBottom: 24, background: "linear-gradient(135deg, #3b82f6, #7c3aed, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Career Success.
            </h1>
            <p style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.8, maxWidth: 360, marginBottom: 36 }}>
              Join thousands of students discovering their perfect career path with AI-powered guidance.
            </p>

            {/* Perk cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
              {PERKS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(59,130,246,0.12)",
                    borderRadius: 16, padding: "14px 18px",
                    boxShadow: "0 2px 12px rgba(59,130,246,0.06)",
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, flexShrink: 0,
                  }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1e2a3a" }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{p.desc}</div>
                  </div>
                  {/* Check */}
                  <div style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
                    ✓
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* RIGHT CARD */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}
        >
          <div style={{
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(59,130,246,0.15)",
            borderRadius: 28,
            padding: "38px 38px",
            boxShadow: "0 20px 60px rgba(59,130,246,0.10), 0 4px 20px rgba(0,0,0,0.06)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top gradient bar */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #3b82f6, #7c3aed, #ec4899)", borderRadius: "28px 28px 0 0" }} />

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: 25, fontWeight: 700, color: "#1e2a3a", marginBottom: 6 }}>
                Create your free account
              </h2>
              <p style={{ color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
                Your career journey starts here
              </p>
            </div>

            {/* Step dots */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
              <div className={`step-dot ${step === 1 ? "active" : "done"}`} />
              <div className={`step-dot ${step === 2 ? "active" : step > 2 ? "done" : "inactive"}`} />
              <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
                Step {step} of 2 — {step === 1 ? "Your info" : "Set password"}
              </span>
            </div>

            {errors.general && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12, color: "#ef4444", marginBottom: 16, fontWeight: 600 }}>
                ⚠ {errors.general}
              </motion.p>
            )}

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleNext}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Name */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Full name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Aisha Patel"
                      className="input-field"
                    />
                    <AnimatePresence>
                      {errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>⚠ {errors.name}</motion.p>}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Email address</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="you@example.com"
                      className="input-field"
                    />
                    <AnimatePresence>
                      {errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>⚠ {errors.email}</motion.p>}
                    </AnimatePresence>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Phone number</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="10-digit number"
                      className="input-field"
                    />
                    <AnimatePresence>
                      {errors.phone && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>⚠ {errors.phone}</motion.p>}
                    </AnimatePresence>
                  </div>

                  <button type="submit" className="submit-btn" style={{ marginTop: 4 }}>
                    Continue →
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Hi message */}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))",
                    border: "1px solid rgba(59,130,246,0.15)",
                    borderRadius: 14, padding: "12px 16px",
                    fontSize: 13, fontWeight: 700, color: "#2563eb",
                  }}>
                    👋 Hey {form.name.split(" ")[0]}! Just one more step.
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Create password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 6 characters"
                        className="input-field"
                        style={{ paddingRight: 70 }}
                      />
                      <button type="button" className="show-pwd-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {/* Strength bar */}
                    {form.password && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                          <motion.div
                            animate={{ width: pwStrength.width }}
                            transition={{ duration: 0.3 }}
                            style={{ height: "100%", borderRadius: 99, background: pwStrength.color }}
                          />
                        </div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: pwStrength.color, marginTop: 4 }}>{pwStrength.label}</p>
                      </div>
                    )}
                    <AnimatePresence>
                      {errors.password && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>⚠ {errors.password}</motion.p>}
                    </AnimatePresence>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Confirm password</label>
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      className="input-field"
                    />
                    <AnimatePresence>
                      {errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ fontSize: 12, color: "#ef4444", marginTop: 5, fontWeight: 600 }}>⚠ {errors.confirmPassword}</motion.p>}
                    </AnimatePresence>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 4 }}>
                    {loading ? "Creating your account…" : "Create Account 🚀"}
                  </button>

                  <button type="button" className="back-btn" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", marginTop: 22, fontWeight: 600 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#3b82f6", fontWeight: 800, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}