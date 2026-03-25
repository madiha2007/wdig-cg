// app/careers/[id]/page.jsx
import { TrendingUp, GraduationCap, ExternalLink, CheckCircle2, BookOpen } from "lucide-react";
import Link from "next/link";
import CareerHero from "@/components/ui/career-hero";

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
    fetch(`${ONET_BASE}/mnm/careers/${code}/`,                         { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/job_outlook`,              { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/skills`,                   { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/education`,                { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/mnm/careers/${code}/knowledge`,                { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/online/occupations/${code}/summary/tasks`,     { headers, next: { revalidate: 3600 } }),
  ]);
  const overview   = overviewRes.ok  ? await overviewRes.json()  : {};
  const outlook    = outlookRes.ok   ? await outlookRes.json()   : {};
  const skillsData = skillsRes.ok    ? await skillsRes.json()    : {};
  const eduData    = eduRes.ok       ? await eduRes.json()       : {};
  const knowData   = knowledgeRes.ok ? await knowledgeRes.json() : {};
  const tasksData  = tasksRes.ok     ? await tasksRes.json()     : {};

  const wage      = outlook.salary;
  const skills    = (skillsData.element || []).slice(0, 10).map(safeStr).filter(Boolean);
  const knowledge = (knowData.element  || []).slice(0, 6).map(safeStr).filter(Boolean);
  const tasks     = (tasksData.task    || []).slice(0, 8).map(safeStr).filter(Boolean);
  const rawAlso   = overview.also_called?.title;
  const alsoCalled = Array.isArray(rawAlso) ? rawAlso.map(safeStr).filter(Boolean) : rawAlso ? [safeStr(rawAlso)] : [];
  const education = (eduData.education?.level_required?.category || []).map(e => ({ name: safeStr(e), score: e?.score })).filter(e => e.name);

  return {
    code, title: safeStr(overview.title) || code,
    description: safeStr(overview.what_they_do),
    also_called: alsoCalled,
    bright_outlook: !!(overview.tags?.bright_outlook),
    in_demand: !!(overview.tags?.in_demand),
    education, skills, knowledge, tasks,
    salary: wage ? { median: wage.annual_median_over || wage.annual_median, low: wage.annual_10th_percentile, high: wage.annual_90th_percentile, hourly_median: wage.hourly_median } : null,
    growth: safeStr(outlook.outlook?.description),
    outlook_category: safeStr(outlook.outlook?.category),
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
  catch {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", background: "#faf9ff" }}>
        <p style={{ color: "#ec4899", fontSize: 18 }}>Failed to load career details.</p>
        <Link href="/explore" style={{ color: "#7c3aed", marginTop: 16 }}>← Back to Careers</Link>
      </div>
    );
  }

  const outlookMeta = {
    "Bright":        { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe", dot: "#7c3aed", label: "Growing Fast 🚀" },
    "Average":       { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8", dot: "#ec4899", label: "Steady Growth 📊" },
    "Below Average": { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", dot: "#f97316", label: "Slower Growth ⚠️" },
  }[career.outlook_category] || { bg: "#f5f3ff", text: "#7c3aed", border: "#ddd6fe", dot: "#7c3aed", label: "Outlook Available" };

  const knowledgeColors = [
    { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
    { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8" },
    { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0" },
    { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
    { bg: "#faf5ff", text: "#7e22ce", border: "#e9d5ff" },
    { bg: "#ecfeff", text: "#0e7490", border: "#a5f3fc" },
  ];

  return (
    <div style={{ background: "#faf9ff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=Lora:wght@600;700;800&family=DM+Mono:wght@500&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)}       to{opacity:1;transform:scale(1)}      }
        .au  { animation: fadeUp  0.55s ease both; }
        .si  { animation: scaleIn 0.4s  ease both; }
        .skill-pill:hover { transform:translateY(-2px); box-shadow:0 4px 12px rgba(124,58,237,0.2); }
        .back-link:hover  { background:rgba(255,255,255,0.95) !important; }
        .onet-btn:hover   { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.15) !important; }
      `}</style>

      <CareerHero
        career={career}
        outlookMeta={outlookMeta}
      />

      {/* ── BODY ─────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

        {/* LEFT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* About */}
          {career.description && (
            <div className="au" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #ede9fe", padding: "28px", boxShadow: "0 2px 12px rgba(124,58,237,0.06)", borderLeft: "5px solid #7c3aed", animationDelay: "0.25s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f3ff", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📋</div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'Lora',serif" }}>About This Career</h2>
              </div>
              <p style={{ color: "#374151", lineHeight: 1.85, fontSize: 14.5 }}>{career.description}</p>
            </div>
          )}

          {/* Outlook */}
          {career.growth && (
            <div className="au" style={{ background: `linear-gradient(135deg,${outlookMeta.bg} 0%,#fff 100%)`, border: `1.5px solid ${outlookMeta.border}`, borderRadius: 20, padding: "24px 28px", boxShadow: `0 4px 20px ${outlookMeta.dot}18`, animationDelay: "0.3s", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: `${outlookMeta.dot}12`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: outlookMeta.dot, boxShadow: `0 0 0 4px ${outlookMeta.dot}30` }} />
                <TrendingUp size={16} color={outlookMeta.text} />
                <h2 style={{ fontSize: 15, fontWeight: 800, color: outlookMeta.text }}>Job Outlook — {career.outlook_category}</h2>
              </div>
              <p style={{ color: outlookMeta.text, fontSize: 14, lineHeight: 1.8, opacity: 0.9 }}>{career.growth}</p>
            </div>
          )}

          {/* Tasks */}
          {career.tasks.length > 0 && (
            <div className="au" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #ede9fe", padding: "28px", boxShadow: "0 2px 12px rgba(124,58,237,0.04)", animationDelay: "0.35s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fdf2f8", border: "1px solid #fbcfe8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⚡</div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'Lora',serif" }}>What You'll Do Day-to-Day</h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {career.tasks.map((task, i) => (
                  <div key={i} style={{ display: "flex", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "#f5f3ff", border: i === 0 ? "none" : "2px solid #ddd6fe", color: i === 0 ? "#fff" : "#7c3aed", fontSize: 12, fontWeight: 800, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                      {i < career.tasks.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 16, background: "#ede9fe", margin: "4px 0" }} />}
                    </div>
                    <div style={{ paddingBottom: i < career.tasks.length - 1 ? 16 : 0, paddingTop: 6 }}>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{task}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {career.skills.length > 0 && (
            <div className="au" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #ede9fe", padding: "28px", boxShadow: "0 2px 12px rgba(124,58,237,0.04)", animationDelay: "0.4s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f5f3ff", border: "1px solid #ddd6fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🛠</div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'Lora',serif" }}>Top Skills Required</h2>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {career.skills.map((skill, i) => (
                  <span key={i} className="skill-pill si" style={{
                    background: i < 3 ? "linear-gradient(135deg,#7c3aed,#ec4899)" : i < 6 ? "#f5f3ff" : "#faf9ff",
                    color: i < 3 ? "#fff" : i < 6 ? "#6d28d9" : "#7c3aed",
                    border: i < 3 ? "none" : i < 6 ? "1px solid #ddd6fe" : "1px solid #ede9fe",
                    borderRadius: 100, padding: i < 3 ? "9px 20px" : "7px 16px",
                    fontSize: i < 3 ? 14 : 13, fontWeight: 700, cursor: "default",
                    animationDelay: `${i * 0.04}s`,
                    boxShadow: i < 3 ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}>{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 24 }}>

          {/* Education */}
          {career.education.length > 0 && (
            <div className="au" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #ede9fe", padding: "22px", boxShadow: "0 2px 12px rgba(124,58,237,0.04)", animationDelay: "0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <GraduationCap size={17} color="#fff" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1e2a3a" }}>Education Required</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {career.education.map((edu, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <CheckCircle2 size={13} color="#7c3aed" />
                        <span style={{ fontSize: 12.5, color: "#374151", fontWeight: 600 }}>{edu.name}</span>
                      </div>
                      {edu.score && <span style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed" }}>{Math.round(edu.score)}%</span>}
                    </div>
                    {edu.score && (
                      <div style={{ height: 6, background: "#f5f3ff", borderRadius: 100, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 100, width: `${Math.round(edu.score)}%`, background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge */}
          {career.knowledge.length > 0 && (
            <div className="au" style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #ede9fe", padding: "22px", boxShadow: "0 2px 12px rgba(124,58,237,0.04)", animationDelay: "0.35s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg,#ec4899,#f43f5e)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={17} color="#fff" />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1e2a3a" }}>Knowledge Areas</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {career.knowledge.map((k, i) => {
                  const c = knowledgeColors[i % knowledgeColors.length];
                  return (
                    <div key={i} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 12, padding: "10px 11px", fontSize: 11.5, fontWeight: 700, color: c.text, lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 5 }}>
                      <span style={{ marginTop: 1, fontSize: 8 }}>◆</span> {k}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Facts */}
          <div className="au" style={{ background: "linear-gradient(135deg,#f5f3ff,#fdf2f8)", borderRadius: 20, border: "1.5px solid #ddd6fe", padding: "20px 22px", animationDelay: "0.4s" }}>
            <h3 style={{ fontSize: 12, fontWeight: 800, color: "#6d28d9", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.07em" }}>Quick Facts</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { icon: "💼", label: "O*NET Code", value: career.code },
                { icon: "📈", label: "Outlook",    value: career.outlook_category || "N/A" },
                { icon: "💵", label: "Median Pay", value: fmt(career.salary?.median) },
                { icon: "⏰", label: "Hourly",     value: career.salary?.hourly_median ? `$${career.salary.hourly_median}/hr` : "—" },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.75)", borderRadius: 10, border: "1px solid #ddd6fe" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{f.icon}</span>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{f.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#6d28d9", fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="au" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", borderRadius: 20, padding: "24px 20px", textAlign: "center", boxShadow: "0 8px 28px rgba(124,58,237,0.3)", animationDelay: "0.45s", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ fontSize: 32, marginBottom: 10 }}>🌐</div>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 8 }}>Full Career Profile</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 1.6, marginBottom: 18 }}>
              Explore wages by state, related occupations, and full competency data on O*NET.
            </p>
            <a href={career.onet_link} target="_blank" rel="noopener noreferrer" className="onet-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", color: "#7c3aed", borderRadius: 12, padding: "12px 20px", fontWeight: 800, fontSize: 13, textDecoration: "none", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              View on O*NET <ExternalLink size={13} />
            </a>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 12 }}>Data: O*NET · U.S. Dept. of Labor</p>
          </div>
        </div>
      </div>
    </div>
  );
}