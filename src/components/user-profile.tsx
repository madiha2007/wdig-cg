"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User, Mail, Phone, GraduationCap, MapPin, Edit3,
  Clock, Bell, Moon, LogOut, Sparkles, CheckCircle2,
  Settings, Download, Share2, Calendar, Briefcase,
  X, Camera, Save, Loader2, Plus, Music, Target,
} from "lucide-react";
import { useUser, UserData } from "../app/context/UserContext"; // adjust path
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const initials = (n: string) =>
  n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const relTime = (ts: any) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 60)    return `${m}m ago`;
  if (m < 1440)  return `${Math.floor(m / 60)}h ago`;
  if (m < 10080) return `${Math.floor(m / 1440)}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

/* ─── Toggle ──────────────────────────────────────────────────────────────── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <motion.button
      onClick={onToggle}
      style={{
        position: "relative", width: 44, height: 24, borderRadius: 99,
        border: "none", background: on ? "#2563eb" : "#cbd5e1",
        cursor: "pointer", flexShrink: 0, padding: 0,
      }}
    >
      <motion.div
        animate={{ x: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        style={{
          position: "absolute", top: 2, width: 20, height: 20,
          borderRadius: "50%", background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
        }}
      />
    </motion.button>
  );
}

/* ─── Tag Input ───────────────────────────────────────────────────────────── */
function TagInput({
  label: lbl, icon, tags = [], onUpdate, placeholder, color = "#2563eb",
}: {
  label: string; icon: React.ReactNode; tags: string[];
  onUpdate: (t: string[]) => void; placeholder: string; color?: string;
}) {
  const [val, setVal] = useState("");
  const safeTags = tags ?? [];

  const add = () => {
    const v = val.trim();
    if (v && !safeTags.includes(v)) onUpdate([...safeTags, v]);
    setVal("");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ color }}>{icon}</span>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
          {lbl}
        </h3>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.9rem" }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder={placeholder}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          style={{
            flex: 1, padding: "0.6rem 0.9rem", borderRadius: 10,
            border: "1.5px solid #e2e8f0", background: "#f8fafc",
            fontSize: "0.82rem", color: "#0f172a", outline: "none",
            fontFamily: "inherit", transition: "border-color 0.2s",
          }}
          onFocus={e => (e.target.style.borderColor = color)}
          onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
        />
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={add}
          type="button"
          style={{
            padding: "0.6rem 1rem", borderRadius: 10, border: "none",
            background: color, color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            fontSize: "0.78rem", fontWeight: 700, fontFamily: "inherit",
          }}
        >
          <Plus size={13} /> Add
        </motion.button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        <AnimatePresence>
          {safeTags.map(t => (
            <motion.span
              key={t}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "0.28rem 0.7rem", borderRadius: 99,
                background: `${color}12`, border: `1.5px solid ${color}25`,
                fontSize: "0.76rem", fontWeight: 600, color: "#1e293b",
              }}
            >
              {t}
              <button
                onClick={() => onUpdate(safeTags.filter(x => x !== t))}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, display: "flex", color: "#94a3b8", lineHeight: 1,
                }}
              >
                <X size={10} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {safeTags.length === 0 && (
          <span style={{ fontSize: "0.74rem", color: "#94a3b8", fontStyle: "italic" }}>
            No {lbl.toLowerCase()} added yet
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Edit Field ──────────────────────────────────────────────────────────── */
function EditField({
  lbl, icon, value, onChange, placeholder, type = "text",
}: {
  lbl: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{
        display: "flex", alignItems: "center", gap: 5,
        fontSize: "0.68rem", fontWeight: 700, color: "#64748b",
        marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.08em",
      }}>
        {icon} {lbl}
      </label>
      <input
        type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%", padding: "0.65rem 0.9rem", borderRadius: 10,
          border: `1.5px solid ${focus ? "#2563eb" : "#e2e8f0"}`,
          background: "#f8fafc", fontSize: "0.85rem", color: "#0f172a",
          outline: "none", fontFamily: "inherit", boxSizing: "border-box",
          transition: "border-color 0.18s",
        }}
      />
    </div>
  );
}

/* ─── Edit Modal ──────────────────────────────────────────────────────────── */
function EditModal({
  open, onClose, userData, onSave,
}: {
  open: boolean; onClose: () => void;
  userData: UserData; onSave: (d: Partial<UserData>) => Promise<void>;
}) {
  const [form, setForm] = useState(userData);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(userData.photoURL);

  useEffect(() => { setForm(userData); setPreview(userData.photoURL); }, [userData]);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setPreview(r.result as string);
    r.readAsDataURL(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await onSave({ ...form, photoURL: preview });
    setSaving(false); onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 50, display: "flex",
            alignItems: "center", justifyContent: "center", padding: "1rem",
            background: "rgba(2,6,23,0.6)", backdropFilter: "blur(8px)", overflowY: "auto",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 340 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 24, maxWidth: 580, width: "100%",
              boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
              overflow: "hidden", margin: "2rem 0",
            }}
          >
            <div style={{ height: 4, background: "linear-gradient(90deg,#2563eb,#7c3aed)" }} />
            <div style={{
              padding: "1.5rem 1.75rem 1.25rem",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Edit Profile
                  </h2>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.15rem" }}>
                    Keep your information up to date
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    border: "1px solid #e2e8f0", background: "#f8fafc",
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#64748b",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <form onSubmit={submit} style={{ padding: "1.5rem 1.75rem" }}>
              {/* Avatar */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%", padding: 3,
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                  }}>
                    <div style={{
                      width: "100%", height: "100%", borderRadius: "50%",
                      overflow: "hidden", background: "#eff6ff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {preview
                        ? <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <User size={28} color="#2563eb" />}
                    </div>
                  </div>
                  <label
                    htmlFor="modal-avatar"
                    style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 26, height: 26, borderRadius: "50%",
                      background: "#2563eb", display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: "pointer", border: "2px solid #fff",
                    }}
                  >
                    <Camera size={11} color="#fff" />
                    <input
                      id="modal-avatar" type="file" accept="image/*"
                      onChange={handleImg} style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem 1rem" }}>
                <EditField
                  lbl="Full Name" icon={<User size={11} />}
                  value={form.name} onChange={v => setForm(p => ({ ...p, name: v }))}
                  placeholder="Your name"
                />
                <div>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8",
                    marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>
                    <Mail size={11} /> Email
                    <span style={{ background: "#f1f5f9", borderRadius: 99, padding: "0.05rem 0.4rem", fontSize: "0.6rem", marginLeft: 2 }}>
                      locked
                    </span>
                  </label>
                  <div style={{
                    padding: "0.65rem 0.9rem", background: "#f8fafc",
                    borderRadius: 10, border: "1px solid #f1f5f9",
                    color: "#94a3b8", fontSize: "0.82rem",
                  }}>
                    {form.email}
                  </div>
                </div>
                <EditField
                  lbl="Phone" icon={<Phone size={11} />}
                  value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))}
                  placeholder="+91 98765 43210" type="tel"
                />
                <EditField
                  lbl="Location" icon={<MapPin size={11} />}
                  value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))}
                  placeholder="City, Country"
                />
              </div>

              {[
                {
                  lbl: "Current Status", icon: <Briefcase size={11} />, key: "role",
                  opts: ["Student", "Working", "Freelancer", "Job Seeker", "Other"],
                },
                {
                  lbl: "Education", icon: <GraduationCap size={11} />, key: "education",
                  opts: ["High School", "Undergraduate", "Graduate", "Postgraduate", "Professional"],
                },
              ].map(({ lbl, icon, key, opts }) => (
                <div key={key} style={{ marginTop: "0.85rem" }}>
                  <label style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: "0.68rem", fontWeight: 700, color: "#64748b",
                    marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>
                    {icon} {lbl}
                  </label>
                  <select
                    value={(form as any)[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "0.65rem 0.9rem", borderRadius: 10,
                      border: "1px solid #e2e8f0", background: "#f8fafc",
                      fontSize: "0.85rem", color: "#0f172a", outline: "none", fontFamily: "inherit",
                    }}
                  >
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}

              <div style={{ marginTop: "0.85rem" }}>
                <label style={{
                  fontSize: "0.68rem", fontWeight: 700, color: "#64748b",
                  display: "block", marginBottom: "0.35rem",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  About You
                </label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  placeholder="Tell the world what drives you..."
                  style={{
                    width: "100%", padding: "0.65rem 0.9rem", borderRadius: 10,
                    border: "1px solid #e2e8f0", background: "#f8fafc",
                    fontSize: "0.85rem", color: "#0f172a", resize: "none",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.65rem", marginTop: "1.4rem" }}>
                <button
                  type="button" onClick={onClose}
                  style={{
                    flex: 1, padding: "0.7rem", borderRadius: 11,
                    border: "1px solid #e2e8f0", background: "#f8fafc",
                    color: "#64748b", fontWeight: 600, fontSize: "0.83rem",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit" disabled={saving} whileTap={{ scale: 0.96 }}
                  style={{
                    flex: 2, padding: "0.7rem", borderRadius: 11, border: "none",
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff",
                    fontWeight: 700, fontSize: "0.83rem",
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "0.4rem", fontFamily: "inherit", opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving
                    ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                    : <><Save size={13} /> Save Changes</>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                                              */
/* ──────────────────────────────────────────────────────────────────────────── */
export default function UserProfile() {
  const { uid, userData, assessResult, loading, saveUserData, isAssessed } = useUser();

  const [acts, setActs]             = useState<any[]>([]);
  const [editOpen, setEditOpen]     = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [notifs, setNotifs]         = useState(true);
  const [dark, setDark]             = useState(false);
  const [toast, setToast]           = useState(false);
  const [ready, setReady]           = useState(false);

  /* ── Activity feed ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!uid) return;
    getDoc(doc(db, "activities", uid)).then(s => {
      if (s.exists()) setActs((s.data().items || []).slice(0, 6));
    });
  }, [uid]);

  useEffect(() => { if (!loading) setTimeout(() => setReady(true), 80); }, [loading]);

  const logAct = async (type: string, title: string, icon: string) => {
    if (!uid) return;
    const ref = doc(db, "activities", uid);
    const s   = await getDoc(ref);
    const ex  = s.exists() ? (s.data().items || []) : [];
    const up  = [
      { id: Date.now().toString(), type, title, date: new Date().toISOString(), icon },
      ...ex,
    ].slice(0, 20);
    await setDoc(ref, { items: up });
    setActs(up.slice(0, 6));
  };

  /* ── Save handlers ─────────────────────────────────────────────────────── */
  const saveProfile = async (upd: Partial<UserData>) => {
    await saveUserData(upd);
    logAct("profile", "Updated profile", "👤");
  };

  const saveInterests = async (interests: string[]) => {
    await saveUserData({ interests });
    logAct("interest", "Updated career interests", "💡");
  };

  const saveHobbies = async (hobbies: string[]) => {
    await saveUserData({ hobbies });
    logAct("hobby", "Updated hobbies", "🎨");
  };

  const saveOwnedSkills = async (ownedSkills: string[]) => {
    await saveUserData({ ownedSkills });
    logAct("skill", "Updated owned skills", "⚙️");
  };

  /* ── Share ─────────────────────────────────────────────────────────────── */
  const shareProfile = async () => {
    const text = `${userData.name} — Career Profile\nThinking Style: ${
      assessResult?.thinking_style?.primary?.label ?? "Unknown"
    }\nvia Where Do I Go?`;
    if (navigator.share) {
      try { await navigator.share({ title: `${userData.name}'s Profile`, text }); } catch { }
    } else {
      await navigator.clipboard.writeText(text);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }
  };

  /* ── Download plain-text summary ──────────────────────────────────────── */
  const downloadSummary = () => {
    const lines = [
      "══════════════════════════════════",
      "         YOUR PROFILE SUMMARY",
      "══════════════════════════════════",
      `Name:      ${userData.name}`,
      `Email:     ${userData.email}`,
      `Role:      ${userData.role}`,
      `Education: ${userData.education}`,
      `Location:  ${userData.location}`,
      "",
      "── Bio ────────────────────────────",
      userData.bio || "(not set)",
      "",
      "── Career Interests ───────────────",
      userData.interests.join(", ") || "(none)",
      "",
      "── Hobbies ────────────────────────",
      userData.hobbies.join(", ") || "(none)",
      "",
      "── Skills I Own ───────────────────",
      (userData.ownedSkills ?? []).join(", ") || "(none)",
      "",
      "══════════════════════════════════",
      "  Where Do I Go? Career Platform",
      "══════════════════════════════════",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    const a   = document.createElement("a");
    a.href     = url;
    a.download = `${userData.name.replace(/\s+/g, "_")}_Profile.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const joined = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "";

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f7ff" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #bfdbfe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1e40af" }}>Loading profile…</p>
      </div>
    </div>
  );

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0;transform:translateY(20px) } to { opacity:1;transform:translateY(0) } }
        .card { opacity:0; animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards }
        * { box-sizing: border-box }
        ::-webkit-scrollbar { height:4px; width:4px }
        ::-webkit-scrollbar-thumb { background:#bfdbfe; border-radius:99px }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#f0f7ff 0%,#fafbff 40%,#f5f3ff 100%)",
        fontFamily: "'Sora',sans-serif", color: "#0f172a",
        opacity: ready ? 1 : 0, transition: "opacity 0.5s ease", overflowX: "hidden",
      }}>
        {/* Mesh BG */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.06) 0%,transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.06) 0%,transparent 70%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 6rem" }}>

          {/* ══ HERO CARD ══ */}
          <div
            className="card"
            style={{
              animationDelay: "0s", background: "#fff", borderRadius: 24,
              marginBottom: "1.5rem", overflow: "hidden",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 8px 32px rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.08)",
            }}
          >
            <div style={{ height: 5, background: "linear-gradient(90deg,#2563eb 0%,#7c3aed 50%,#2563eb 100%)" }} />
            <div style={{ padding: "2rem 2.25rem" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "1.75rem" }}>

                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 108, height: 108, borderRadius: "50%", padding: 3, background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {userData.photoURL
                        ? <img src={userData.photoURL} alt={userData.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <span style={{ fontSize: "2rem", fontWeight: 800, background: "linear-gradient(135deg,#2563eb,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{initials(userData.name)}</span>}
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 5, right: 5, width: 14, height: 14, borderRadius: "50%", background: "#3b82f6", border: "2.5px solid #fff" }} />
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.65rem", marginBottom: "0.5rem" }}>
                    <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 400, color: "#0f172a", margin: 0 }}>
                      {userData.name || "Your Name"}
                    </h1>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "0.22rem 0.75rem", borderRadius: 99,
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      color: "#fff", fontSize: "0.67rem", fontWeight: 700,
                      letterSpacing: "0.04em", textTransform: "uppercase",
                    }}>
                      <Sparkles size={9} />{userData.role}
                    </span>
                    {isAssessed && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "0.22rem 0.75rem", borderRadius: 99,
                        background: "#dcfce7", color: "#166534",
                        fontSize: "0.67rem", fontWeight: 700,
                      }}>
                        <CheckCircle2 size={9} /> Assessed
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem 1.1rem", color: "#64748b", fontSize: "0.78rem", marginBottom: "0.75rem" }}>
                    {[
                      { icon: <Mail size={11} />, val: userData.email },
                      userData.location && { icon: <MapPin size={11} />, val: userData.location },
                      userData.phone && { icon: <Phone size={11} />, val: userData.phone },
                      joined && { icon: <Calendar size={11} />, val: `Joined ${joined}` },
                      userData.education && { icon: <GraduationCap size={11} />, val: userData.education },
                    ].filter(Boolean).map((item: any, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {item.icon}{item.val}
                      </span>
                    ))}
                  </div>

                  {userData.bio && (
                    <p style={{ fontSize: "0.82rem", lineHeight: 1.7, color: "#475569", maxWidth: "52ch", margin: 0 }}>
                      {userData.bio}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setEditOpen(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "0.6rem 1.2rem", borderRadius: 11,
                    border: "1.5px solid #2563eb", background: "transparent",
                    color: "#2563eb", fontWeight: 700, fontSize: "0.78rem",
                    cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
                  }}
                >
                  <Edit3 size={13} /> Edit Profile
                </motion.button>
              </div>

              {/* Thinking style chip */}
              {assessResult?.thinking_style?.primary && (
                <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.9rem",
                    padding: "0.7rem 1.2rem", borderRadius: 14,
                    background: "linear-gradient(135deg,#eff6ff,#f5f3ff)",
                    border: "1px solid #bfdbfe",
                  }}>
                    <span style={{ fontSize: "1.5rem" }}>🧩</span>
                    <div>
                      <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2563eb", margin: "0 0 0.1rem" }}>
                        Thinking Style
                      </p>
                      <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "0.95rem", color: "#0f172a", margin: 0 }}>
                        {assessResult.thinking_style.primary.label}
                      </p>
                      {assessResult.thinking_style.secondary && (
                        <p style={{ fontSize: "0.68rem", color: "#7c3aed", margin: "0.08rem 0 0" }}>
                          Also: {assessResult.thinking_style.secondary.label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ══ TWO-COLUMN BODY ══ */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 280px", gap: "1.5rem", alignItems: "start" }}>

            {/* ── LEFT: interests + hobbies + owned skills ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Career Interests */}
              <div className="card" style={{
                animationDelay: "0.08s", background: "#fff", borderRadius: 20,
                padding: "1.75rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border: "1px solid rgba(37,99,235,0.07)",
              }}>
                <TagInput
                  label="Career Interests"
                  icon={<Target size={16} />}
                  tags={userData.interests}
                  onUpdate={saveInterests}
                  placeholder="e.g. UI/UX Design, Data Science…"
                  color="#2563eb"
                />
              </div>

              {/* Hobbies */}
              <div className="card" style={{
                animationDelay: "0.13s", background: "#fff", borderRadius: 20,
                padding: "1.75rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.07)",
              }}>
                <TagInput
                  label="Hobbies & Interests"
                  icon={<Music size={16} />}
                  tags={userData.hobbies}
                  onUpdate={saveHobbies}
                  placeholder="e.g. Photography, Reading…"
                  color="#7c3aed"
                />
              </div>

              {/* Skills You Own */}
              <div className="card" style={{
                animationDelay: "0.18s", background: "#fff", borderRadius: 20,
                padding: "1.75rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(10,123,107,0.06)",
                border: "1px solid rgba(10,123,107,0.09)",
              }}>
                <TagInput
                  label="Skills I Own"
                  icon={<Sparkles size={16} />}
                  tags={userData.ownedSkills ?? []}
                  onUpdate={saveOwnedSkills}
                  placeholder="e.g. Python, Figma, Public Speaking…"
                  color="#0A7B6B"
                />
              </div>

              {/* Nudge: take aptitude test if not assessed */}
              {!isAssessed && (
                <div className="card" style={{
                  animationDelay: "0.23s",
                  background: "linear-gradient(135deg,#eff6ff,#f5f3ff)",
                  borderRadius: 20, padding: "1.5rem 1.75rem",
                  border: "1.5px solid #bfdbfe",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.6rem" }}>
                    <span style={{ fontSize: "1.4rem" }}>🧠</span>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e3a8a", margin: 0 }}>
                      Unlock your full profile
                    </h3>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#3730a3", lineHeight: 1.65, margin: "0 0 1rem" }}>
                    Take the aptitude test to see your skill strengths, growth areas, and top career matches — all personalised to you.
                  </p>
                  <a
                    href="/aptitude"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "0.6rem 1.25rem", borderRadius: 11, border: "none",
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff",
                      fontWeight: 700, fontSize: "0.8rem", textDecoration: "none",
                    }}
                  >
                    Take Aptitude Test →
                  </a>
                </div>
              )}
            </div>

            {/* ── RIGHT: activity + quick settings ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* Recent Activity */}
              <div className="card" style={{
                animationDelay: "0.1s", background: "#fff", borderRadius: 20,
                padding: "1.5rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border: "1px solid rgba(37,99,235,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={13} color="#64748b" />
                  </div>
                  <h2 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    Recent Activity
                  </h2>
                </div>
                {acts.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                    {acts.map((a, i) => (
                      <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", position: "relative" }}>
                        {i < acts.length - 1 && (
                          <div style={{ position: "absolute", left: 14, top: 28, width: 1, height: "calc(100% + 0.7rem)", background: "linear-gradient(to bottom,#bfdbfe,transparent)" }} />
                        )}
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", flexShrink: 0, zIndex: 1 }}>
                          {a.icon || "📌"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: "0.76rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.08rem", lineHeight: 1.4 }}>{a.title}</p>
                          <p style={{ fontSize: "0.66rem", color: "#94a3b8", margin: 0 }}>{relTime(a.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.76rem", color: "#94a3b8", textAlign: "center", fontStyle: "italic", margin: "0.5rem 0" }}>
                    No activity yet.
                  </p>
                )}
              </div>

              {/* Quick Settings */}
              <div className="card" style={{
                animationDelay: "0.16s", background: "#fff", borderRadius: 20,
                padding: "1.5rem",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(37,99,235,0.06)",
                border: "1px solid rgba(37,99,235,0.07)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Settings size={13} color="#64748b" />
                  </div>
                  <h2 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    Quick Settings
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {[
                    { lbl: "Notifications", icon: <Bell size={13} color="#64748b" />, val: notifs, set: () => setNotifs(p => !p) },
                    { lbl: "Dark Mode",     icon: <Moon size={13} color="#64748b" />, val: dark,   set: () => setDark(p => !p) },
                  ].map(({ lbl, icon, val, set }) => (
                    <div key={lbl} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.8rem", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                        {icon}<span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#334155" }}>{lbl}</span>
                      </div>
                      <Toggle on={val} onToggle={set} />
                    </div>
                  ))}

                  {[
                    { lbl: "Download Summary", icon: <Download size={13} color="#2563eb" />, onClick: downloadSummary },
                    { lbl: "Share Profile",    icon: <Share2   size={13} color="#7c3aed" />, onClick: shareProfile },
                  ].map(({ lbl, icon, onClick }) => (
                    <motion.button key={lbl} whileTap={{ scale: 0.97 }} onClick={onClick}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.8rem", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "#334155" }}>{lbl}</span>
                      {icon}
                    </motion.button>
                  ))}

                  <div style={{ height: 1, background: "#f1f5f9", margin: "0.1rem 0" }} />

                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setLogoutOpen(true)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.8rem", borderRadius: 10, background: "#fff5f5", border: "1px solid #fee2e2", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#dc2626" }}>Sign Out</span>
                    <LogOut size={13} color="#dc2626" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modals ── */}
        <EditModal open={editOpen} onClose={() => setEditOpen(false)} userData={userData} onSave={saveProfile} />

        <AnimatePresence>
          {logoutOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(2,6,23,0.55)", backdropFilter: "blur(8px)" }}
              onClick={() => setLogoutOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                style={{ background: "#fff", borderRadius: 22, padding: "2rem", maxWidth: 360, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.14)", textAlign: "center" }}
              >
                <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.9rem" }}>
                  <LogOut size={20} color="#dc2626" />
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.25rem", color: "#0f172a", marginBottom: "0.4rem" }}>Sign out?</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                  You'll need to sign back in to access your profile and results.
                </p>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button onClick={() => setLogoutOpen(false)}
                    style={{ flex: 1, padding: "0.7rem", borderRadius: 11, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => { auth.signOut(); setLogoutOpen(false); }}
                    style={{ flex: 1, padding: "0.7rem", borderRadius: 11, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", fontFamily: "inherit" }}>
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", color: "#fff", padding: "0.7rem 1.4rem", borderRadius: 99, boxShadow: "0 8px 24px rgba(29,78,216,0.28)", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}
            >
              <CheckCircle2 size={13} /> Copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}