// app/careers/[id]/page.jsx
import { ArrowLeft, TrendingUp, GraduationCap, ExternalLink, Star, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";

const ONET_BASE = "https://api-v2.onetcenter.org";

function safeStr(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.name || val.title || val.statement || "";
  return String(val);
}

async function getCareerDetails(code) {
  const headers = { "X-API-Key": process.env.ONET_API_KEY, Accept: "application/json" };
  const [overviewRes, outlookRes, skillsRes, eduRes, knowledgeRes, tasksRes] = await Promise.all([
    fetch(`${ONET_BASE}/mnm/careers/${code}/`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/job_outlook`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/skills`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/education`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/knowledge`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/online/occupations/${code}/summary/tasks`, { headers, next: { revalidate: 3600 } }),
  ]);
  const overview = overviewRes.ok ? await overviewRes.json() : {};
  const outlook = outlookRes.ok ? await outlookRes.json() : {};
  const skillsData = skillsRes.ok ? await skillsRes.json() : {};
  const eduData = eduRes.ok ? await eduRes.json() : {};
  const knowData = knowledgeRes.ok ? await knowledgeRes.json() : {};
  const tasksData = tasksRes.ok ? await tasksRes.json() : {};
  const wage = outlook.salary;
  const skills = (skillsData.element || []).slice(0, 10).map(safeStr).filter(Boolean);
  const knowledge = (knowData.element || []).slice(0, 6).map(safeStr).filter(Boolean);
  const tasks = (tasksData.task || []).slice(0, 8).map(safeStr).filter(Boolean);
  const rawAlso = overview.also_called?.title;
  const alsoCalled = Array.isArray(rawAlso) ? rawAlso.map(safeStr).filter(Boolean) : rawAlso ? [safeStr(rawAlso)] : [];
  const education = (eduData.education?.level_required?.category || []).map((e) => ({ name: safeStr(e), score: e?.score })).filter(e => e.name);
  return {
    code, title: safeStr(overview.title) || code, description: safeStr(overview.what_they_do),
    also_called: alsoCalled, bright_outlook: !!(overview.tags?.bright_outlook), in_demand: !!(overview.tags?.in_demand),
    education, skills, knowledge, tasks,
    salary: wage ? { median: wage.annual_median_over || wage.annual_median, low: wage.annual_10th_percentile, high: wage.annual_90th_percentile, hourly_median: wage.hourly_median } : null,
    growth: safeStr(outlook.outlook?.description), outlook_category: safeStr(outlook.outlook?.category),
    onet_link: `https://www.onetonline.org/link/summary/${code}`,
  };
}

function fmt(n) {
  if (!n) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function CareerDetailPage({ params }) {
  const { id } = await params;
  const code = id.replace(/-dot-/g, ".").replace(/--/g, ".");
  let career;
  try { career = await getCareerDetails(code); }
  catch (err) {
    return (
      <div style={{ background: "#f0f6ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
        <p style={{ color: "#ef4444", fontSize: 18 }}>Failed to load career details.</p>
        <Link href="/explore-careers" style={{ color: "#3b82f6", marginTop: 16 }}>← Back to Careers</Link>
      </div>
    );
  }

  const outlookMeta = {
    "Bright": { bg: "#f0fdf4", text: "#166534", border: "#86efac", dot: "#22c55e", label: "Growing Fast 🚀" },
    "Average": { bg: "#fefce8", text: "#854d0e", border: "#fde047", dot: "#eab308", label: "Steady Growth 📊" },
    "Below Average": { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", dot: "#ef4444", label: "Slower Growth ⚠️" },
  }[career.outlook_category] || { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", dot: "#3b82f6", label: "Outlook Available" };

  const knowledgeColors = [
    { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
    { bg: "#f0fdf4", text: "#166534", border: "#86efac" },
    { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
    { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
    { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4" },
  ];

  return (
    <div style={{ background: "#f0f6ff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Fraunces:wght@700;900&family=DM+Mono:wght@500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
        .au { animation: fadeUp 0.55s ease both; }
        .si { animation: scaleIn 0.4s ease both; }
        .skill-pill { transition: transform 0.2s, box-shadow 0.2s; }
        .skill-pill:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59,130,246,0.2); }
        .back-link:hover { background: rgba(255,255,255,0.95) !important; }
        .onet-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }

        /* ── Responsive layout ── */
        .salary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 24px;
        }
        .body-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        .knowledge-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .facts-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        @media (min-width: 640px) {
          .salary-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-top: 32px;
          }
        }

        @media (max-width: 768px) {
          .body-grid {
            grid-template-columns: 1fr;
          }
          .sidebar {
            position: static !important;
          }
        }

        @media (max-width: 480px) {
          .hero-padding {
            padding: 28px 16px 36px !important;
          }
          .body-padding {
            padding: 20px 16px 48px !important;
          }
          .card-padding {
            padding: 20px 18px !important;
          }
          .hero-title {
            font-size: 26px !important;
          }
          .salary-card-icon {
            width: 30px !important;
            height: 30px !important;
            font-size: 15px !important;
          }
          .salary-card-value {
            font-size: 16px !important;
          }
          .salary-card-label {
            font-size: 10px !important;
          }
        }
      `}</style>

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 50%, #ede9fe 100%)",
        position: "relative", overflow: "hidden", borderBottom: "1px solid #bfdbfe"
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(99,102,241,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "30%", width: 180, height: 180, borderRadius: "50%", background: "rgba(14,165,233,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20%", left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(168,85,247,0.06)", pointerEvents: "none" }} />

        <div className="hero-padding" style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "40px 24px 48px" }}>

          {/* Back link */}
          <Link href="/explore" className="back-link au" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#3b82f6", fontSize: 13, fontWeight: 700, textDecoration: "none",
            marginBottom: 24, background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)",
            border: "1px solid #bfdbfe", borderRadius: 100, padding: "8px 18px",
            transition: "background 0.2s"
          }}>
            <ArrowLeft size={13} /> Back to Explore
          </Link>

          {/* Badges */}
          <div className="au" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14, animationDelay: "0.05s" }}>
            {career.bright_outlook && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#fef9c3", border: "1.5px solid #fde047", color: "#854d0e", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>
                <Star size={9} fill="#eab308" color="#eab308" /> Bright Outlook
              </span>
            )}
            {career.in_demand && (
              <span style={{ background: "#dcfce7", border: "1.5px solid #86efac", color: "#166534", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>🔥 In Demand</span>
            )}
            {career.outlook_category && (
              <span style={{ background: outlookMeta.bg, border: `1.5px solid ${outlookMeta.border}`, color: outlookMeta.text, borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{outlookMeta.label}</span>
            )}
            <span style={{ background: "rgba(255,255,255,0.8)", border: "1px solid #e0e7ff", color: "#6366f1", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>
              O*NET {career.code}
            </span>
          </div>

          {/* Title */}
          <h1 className="au hero-title" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 900, color: "#1e3a5f", fontSize: "clamp(26px, 5vw, 52px)", lineHeight: 1.1, maxWidth: 700, animationDelay: "0.1s" }}>
            {career.title}
          </h1>
          {career.also_called.length > 0 && (
            <p className="au" style={{ color: "#64748b", fontSize: 13, marginTop: 8, animationDelay: "0.15s" }}>
              Also known as: <span style={{ color: "#475569", fontWeight: 600 }}>{career.also_called.join(" · ")}</span>
            </p>
          )}

          {/* Salary Cards — 2 col on mobile, 4 col on desktop */}
          {career.salary && (
            <div className="au salary-grid" style={{ animationDelay: "0.2s" }}>
              {[
                { label: "Median Annual", value: fmt(career.salary.median), icon: "💰", accent: "#3b82f6", accentBg: "#eff6ff", accentBorder: "#bfdbfe", big: true },
                { label: "Hourly Rate", value: career.salary.hourly_median ? `$${career.salary.hourly_median}/hr` : "—", icon: "⏱", accent: "#8b5cf6", accentBg: "#f5f3ff", accentBorder: "#ddd6fe" },
                { label: "Entry Level", value: fmt(career.salary.low), icon: "🌱", accent: "#10b981", accentBg: "#ecfdf5", accentBorder: "#a7f3d0" },
                { label: "Senior Level", value: fmt(career.salary.high), icon: "🏆", accent: "#f59e0b", accentBg: "#fffbeb", accentBorder: "#fde68a" },
              ].map(s => (
                <div key={s.label} style={{
                  background: "#fff", border: `2px solid ${s.big ? s.accentBorder : "#e5e7eb"}`,
                  borderRadius: 16, padding: "14px 10px", textAlign: "center",
                  boxShadow: s.big ? `0 4px 20px ${s.accent}20` : "0 2px 8px rgba(0,0,0,0.04)",
                  position: "relative", overflow: "hidden"
                }}>
                  {s.big && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${s.accent}, ${s.accentBorder})` }} />}
                  <div className="salary-card-icon" style={{ width: 34, height: 34, borderRadius: 10, margin: "0 auto 8px", background: s.accentBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, border: `1px solid ${s.accentBorder}` }}>{s.icon}</div>
                  <div className="salary-card-value" style={{ fontSize: "clamp(15px,3vw,22px)", fontWeight: 900, color: "#111827", fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
                  <div className="salary-card-label" style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div className="body-padding body-grid" style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* About */}
          {career.description && (
            <div className="au card-padding" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e0e7ff", padding: "28px", boxShadow: "0 2px 12px rgba(59,130,246,0.06)", borderLeft: "5px solid #3b82f6", animationDelay: "0.25s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>📋</div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f", fontFamily: "'Fraunces', serif" }}>About This Career</h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.85, fontSize: 14 }}>{career.description}</p>
            </div>
          )}

          {/* Outlook */}
          {career.growth && (
            <div className="au card-padding" style={{
              background: `linear-gradient(135deg, ${outlookMeta.bg} 0%, #fff 100%)`,
              border: `1.5px solid ${outlookMeta.border}`, borderRadius: 20, padding: "24px 28px",
              boxShadow: `0 4px 20px ${outlookMeta.dot}18`, animationDelay: "0.3s",
              position: "relative", overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: `${outlookMeta.dot}12`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: outlookMeta.dot, boxShadow: `0 0 0 4px ${outlookMeta.dot}30`, flexShrink: 0 }} />
                <TrendingUp size={15} color={outlookMeta.text} />
                <h2 style={{ fontSize: 14, fontWeight: 800, color: outlookMeta.text }}>Job Outlook — {career.outlook_category}</h2>
              </div>
              <p style={{ color: outlookMeta.text, fontSize: 14, lineHeight: 1.8, opacity: 0.9 }}>{career.growth}</p>
            </div>
          )}

          {/* Tasks */}
          {career.tasks.length > 0 && (
            <div className="au card-padding" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: "0.35s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fef3c7", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>⚡</div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f", fontFamily: "'Fraunces', serif" }}>What You'll Do Day-to-Day</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {career.tasks.map((task, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: i === 0 ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "#f1f5f9",
                        border: i === 0 ? "none" : "2px solid #e2e8f0",
                        color: i === 0 ? "#fff" : "#64748b",
                        fontSize: 11, fontWeight: 800, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>{i + 1}</div>
                      {i < career.tasks.length - 1 && (
                        <div style={{ width: 2, flex: 1, minHeight: 14, background: "#e2e8f0", margin: "3px 0" }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < career.tasks.length - 1 ? 14 : 0, paddingTop: 4 }}>
                      <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.65 }}>{task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {career.skills.length > 0 && (
            <div className="au card-padding" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: "0.4s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#ede9fe", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🛠</div>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f", fontFamily: "'Fraunces', serif" }}>Top Skills Required</h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {career.skills.map((skill, i) => (
                  <span key={i} className="skill-pill si" style={{
                    background: i < 3 ? "linear-gradient(135deg, #3b82f6, #6366f1)" : i < 6 ? "#eff6ff" : "#f8fafc",
                    color: i < 3 ? "#fff" : i < 6 ? "#1d4ed8" : "#475569",
                    border: i < 3 ? "none" : i < 6 ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                    borderRadius: 100, padding: i < 3 ? "8px 16px" : "6px 14px",
                    fontSize: i < 3 ? 13 : 12, fontWeight: 700, cursor: "default",
                    animationDelay: `${i * 0.04}s`,
                    boxShadow: i < 3 ? "0 2px 8px rgba(59,130,246,0.25)" : "none"
                  }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="sidebar" style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24 }}>

          {/* Education */}
          {career.education.length > 0 && (
            <div className="au card-padding" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: "0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <GraduationCap size={17} color="#fff" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1e3a5f" }}>Education Required</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {career.education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={12} color="#22c55e" />
                        <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{edu.name}</span>
                      </div>
                      {edu.score && <span style={{ fontSize: 11, fontWeight: 800, color: "#3b82f6" }}>{Math.round(edu.score)}%</span>}
                    </div>
                    {edu.score && (
                      <div style={{ height: 5, background: "#f1f5f9", borderRadius: 100, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 100, width: `${Math.round(edu.score)}%`, background: "linear-gradient(90deg, #3b82f6, #6366f1)" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge — 2 col grid, works on all screen sizes */}
          {career.knowledge.length > 0 && (
            <div className="au card-padding" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb", padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", animationDelay: "0.35s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #ec4899, #f43f5e)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={17} color="#fff" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1e3a5f" }}>Knowledge Areas</h3>
              </div>
              <div className="knowledge-grid">
                {career.knowledge.map((k, i) => {
                  const c = knowledgeColors[i % knowledgeColors.length];
                  return (
                    <div key={i} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "9px 10px", fontSize: 11, fontWeight: 700, color: c.text, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}>
                      <span style={{ marginTop: 1, fontSize: 7, flexShrink: 0 }}>◆</span> {k}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Facts */}
          <div className="au card-padding" style={{ background: "linear-gradient(135deg, #eff6ff, #e0f2fe)", borderRadius: 20, border: "1.5px solid #bfdbfe", padding: "20px 22px", animationDelay: "0.4s" }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: "#1e3a5f", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.07em" }}>Quick Facts</h3>
            <div className="facts-grid">
              {[
                { icon: "💼", label: "O*NET Code", value: career.code },
                { icon: "📈", label: "Outlook", value: career.outlook_category || "N/A" },
                { icon: "💵", label: "Median Pay", value: fmt(career.salary?.median) },
                { icon: "⏰", label: "Hourly", value: career.salary?.hourly_median ? `$${career.salary.hourly_median}/hr` : "—" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.75)", borderRadius: 10, border: "1px solid #dbeafe" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 13 }}>{f.icon}</span>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{f.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#1e3a5f", fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="au card-padding" style={{ background: "linear-gradient(135deg, #1e3a5f, #1d4ed8)", borderRadius: 20, padding: "24px 20px", textAlign: "center", boxShadow: "0 8px 28px rgba(29,78,216,0.25)", animationDelay: "0.45s", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div style={{ fontSize: 30, marginBottom: 8 }}>🌐</div>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Full Career Profile</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
              Explore wages by state, related occupations, and full competency data on O*NET.
            </p>
            <a href={career.onet_link} target="_blank" rel="noopener noreferrer" className="onet-btn" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#fff", color: "#1d4ed8", borderRadius: 12, padding: "12px 20px",
              fontWeight: 800, fontSize: 13, textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              View on O*NET <ExternalLink size={13} />
            </a>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 10 }}>Data: O*NET · U.S. Dept. of Labor</p>
          </div>
        </div>
      </div>
    </div>
  );
}