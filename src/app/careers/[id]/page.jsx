// // app/careers/[id]/page.jsx
// import { ArrowLeft, TrendingUp, GraduationCap, ExternalLink, Star, Briefcase, CheckCircle2 } from "lucide-react";
// import Link from "next/link";
// import Navbar from "@/components/Navbar";

// const ONET_BASE = "https://api-v2.onetcenter.org";

// function safeStr(val) {
//   if (!val) return "";
//   if (typeof val === "string") return val;
//   if (typeof val === "object") return val.name || val.title || val.statement || "";
//   return String(val);
// }

// async function getCareerDetails(code) {
//   const headers = {
//     "X-API-Key": process.env.ONET_API_KEY,
//     Accept: "application/json",
//   };

//   const [overviewRes, outlookRes, skillsRes, eduRes, knowledgeRes, tasksRes] =
//     await Promise.all([
//       fetch(`${ONET_BASE}/mnm/careers/${code}/`, { headers, next: { revalidate: 3600 } }),
//       fetch(`${ONET_BASE}/mnm/careers/${code}/job_outlook`, { headers, next: { revalidate: 3600 } }),
//       fetch(`${ONET_BASE}/mnm/careers/${code}/skills`, { headers, next: { revalidate: 3600 } }),
//       fetch(`${ONET_BASE}/mnm/careers/${code}/education`, { headers, next: { revalidate: 3600 } }),
//       fetch(`${ONET_BASE}/mnm/careers/${code}/knowledge`, { headers, next: { revalidate: 3600 } }),
//       fetch(`${ONET_BASE}/online/occupations/${code}/summary/tasks`, { headers, next: { revalidate: 3600 } }),
//     ]);

//   const overview   = overviewRes.ok   ? await overviewRes.json()   : {};
//   const outlook    = outlookRes.ok    ? await outlookRes.json()    : {};
//   const skillsData = skillsRes.ok     ? await skillsRes.json()     : {};
//   const eduData    = eduRes.ok        ? await eduRes.json()        : {};
//   const knowData   = knowledgeRes.ok  ? await knowledgeRes.json()  : {};
//   const tasksData  = tasksRes.ok      ? await tasksRes.json()      : {};

//   const wage = outlook.salary;

//   // Safely normalize arrays of objects to strings
//   const skills = (skillsData.element || []).slice(0, 10).map(safeStr).filter(Boolean);
//   const knowledge = (knowData.element || []).slice(0, 6).map(safeStr).filter(Boolean);
//   const tasks = (tasksData.task || []).slice(0, 8).map(safeStr).filter(Boolean);

//   // also_called.title can be a string or array
//   const rawAlso = overview.also_called?.title;
//   const alsoCalled = Array.isArray(rawAlso)
//     ? rawAlso.map(safeStr).filter(Boolean)
//     : rawAlso ? [safeStr(rawAlso)] : [];

//   // Education: array of {name, score} objects
//   const education = (eduData.education?.level_required?.category || []).map((e) => ({
//     name: safeStr(e),
//     score: e?.score,
//   })).filter((e) => e.name);

//   return {
//     code,
//     title: safeStr(overview.title) || code,
//     description: safeStr(overview.what_they_do),
//     also_called: alsoCalled,
//     bright_outlook: !!(overview.tags?.bright_outlook),
//     in_demand: !!(overview.tags?.in_demand),
//     education,
//     skills,
//     knowledge,
//     tasks,
//     salary: wage ? {
//       median: wage.annual_median_over || wage.annual_median,
//       low: wage.annual_10th_percentile,
//       high: wage.annual_90th_percentile,
//       hourly_median: wage.hourly_median,
//     } : null,
//     growth: safeStr(outlook.outlook?.description),
//     outlook_category: safeStr(outlook.outlook?.category),
//     onet_link: `https://www.onetonline.org/link/summary/${code}`,
//   };
// }

// function formatSalary(amount) {
//   if (!amount) return "—";
//   return new Intl.NumberFormat("en-US", {
//     style: "currency", currency: "USD", maximumFractionDigits: 0,
//   }).format(amount);
// }

// const OUTLOOK_COLORS = {
//   "Bright": "bg-green-50 text-green-800 border-green-200",
//   "Average": "bg-yellow-50 text-yellow-800 border-yellow-200",
//   "Below Average": "bg-red-50 text-red-800 border-red-200",
// };

// export default async function CareerDetailPage({ params }) {
//   const { id } = await params;
//   const code = id.replace(/-dot-/g, ".").replace(/--/g, ".");

//   let career;
//   try {
//     career = await getCareerDetails(code);
//   } catch (err) {
//     return (
//       <div className="min-h-screen bg-[#f8f7f4]">
//         <Navbar />
//         <div className="max-w-4xl mx-auto px-6 py-20 text-center">
//           <p className="text-red-500 text-lg">Failed to load career details.</p>
//           <Link href="/explore-careers" className="mt-4 inline-block text-indigo-600 hover:underline">
//             ← Back to Careers
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#f8f7f4]">

//       {/* Hero */}
//       <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 text-white">
//         <div className="max-w-5xl mx-auto px-6 py-12">
//           <Link href="/explore-careers" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
//             <ArrowLeft size={16} />
//             Back to Explore
//           </Link>

//           <div className="flex flex-wrap items-start gap-3 mb-3">
//             {career.bright_outlook && (
//               <span className="flex items-center gap-1 text-xs font-semibold bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 px-3 py-1 rounded-full">
//                 <Star size={10} className="fill-yellow-300" /> Bright Outlook
//               </span>
//             )}
//             {career.in_demand && (
//               <span className="text-xs font-semibold bg-green-400/20 border border-green-400/30 text-green-300 px-3 py-1 rounded-full">
//                 🔥 In Demand
//               </span>
//             )}
//             {career.outlook_category && (
//               <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${OUTLOOK_COLORS[career.outlook_category] || "bg-white/10 text-white border-white/20"}`}>
//                 📈 {career.outlook_category} Outlook
//               </span>
//             )}
//           </div>

//           <h1 className="text-3xl md:text-4xl font-bold">{career.title}</h1>
//           {career.also_called.length > 0 && (
//             <p className="text-blue-200 text-sm mt-2">
//               Also called: {career.also_called.join(", ")}
//             </p>
//           )}
//           <p className="text-blue-300 text-xs mt-1 font-mono">O*NET Code: {career.code}</p>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

//         {/* Salary Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {[
//             { label: "Median Salary", value: formatSalary(career.salary?.median), sub: "per year" },
//             { label: "Hourly Rate", value: career.salary?.hourly_median ? `$${career.salary.hourly_median}/hr` : "—", sub: "median" },
//             { label: "Entry Level", value: formatSalary(career.salary?.low), sub: "10th percentile" },
//             { label: "Experienced", value: formatSalary(career.salary?.high), sub: "90th percentile" },
//           ].map((stat) => (
//             <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
//               <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
//               <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
//               <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
//             </div>
//           ))}
//         </div>

//         {/* Description */}
//         {career.description && (
//           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//             <h2 className="text-lg font-bold text-gray-900 mb-3">About This Career</h2>
//             <p className="text-gray-600 leading-relaxed">{career.description}</p>
//           </div>
//         )}

//         {/* Growth Outlook */}
//         {career.growth && (
//           <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
//             <div className="flex items-center gap-2 mb-2">
//               <TrendingUp size={18} className="text-indigo-600" />
//               <h2 className="font-bold text-indigo-900">Job Outlook</h2>
//             </div>
//             <p className="text-indigo-800 text-sm leading-relaxed">{career.growth}</p>
//           </div>
//         )}

//         {/* Education & Skills */}
//         <div className="grid md:grid-cols-2 gap-6">
//           {career.education.length > 0 && (
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <div className="flex items-center gap-2 mb-4">
//                 <GraduationCap size={18} className="text-gray-500" />
//                 <h2 className="font-bold text-gray-900">Education Required</h2>
//               </div>
//               <ul className="space-y-2">
//                 {career.education.map((edu, i) => (
//                   <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
//                     <CheckCircle2 size={14} className="text-green-500 shrink-0" />
//                     {edu.name}
//                     {edu.score && (
//                       <span className="ml-auto text-xs text-gray-400">{Math.round(edu.score)}%</span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {career.skills.length > 0 && (
//             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//               <h2 className="font-bold text-gray-900 mb-4">Top Skills</h2>
//               <div className="flex flex-wrap gap-2">
//                 {career.skills.map((skill, i) => (
//                   <span key={i} className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium border border-indigo-100">
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Tasks */}
//         {career.tasks.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//             <div className="flex items-center gap-2 mb-4">
//               <Briefcase size={18} className="text-gray-500" />
//               <h2 className="font-bold text-gray-900">What You'll Do</h2>
//             </div>
//             <ul className="space-y-3">
//               {career.tasks.map((task, i) => (
//                 <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
//                   <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
//                     {i + 1}
//                   </span>
//                   {task}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}

//         {/* Knowledge Areas */}
//         {career.knowledge.length > 0 && (
//           <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
//             <h2 className="font-bold text-gray-900 mb-4">Knowledge Areas</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//               {career.knowledge.map((k, i) => (
//                 <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium border border-gray-100">
//                   {k}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* O*NET Link */}
//         <div className="text-center pb-10">
//           <a
//             href={career.onet_link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200"
//           >
//             View Full Profile on O*NET
//             <ExternalLink size={15} />
//           </a>
//           <p className="text-xs text-gray-400 mt-3">Data sourced from O*NET OnLine, U.S. Department of Labor</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// app/careers/[id]/page.jsx
import { ArrowLeft, TrendingUp, GraduationCap, ExternalLink, Star, Briefcase, CheckCircle2, Zap, DollarSign, BarChart3, BookOpen } from "lucide-react";
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
  const overview   = overviewRes.ok   ? await overviewRes.json()   : {};
  const outlook    = outlookRes.ok    ? await outlookRes.json()    : {};
  const skillsData = skillsRes.ok     ? await skillsRes.json()     : {};
  const eduData    = eduRes.ok        ? await eduRes.json()        : {};
  const knowData   = knowledgeRes.ok  ? await knowledgeRes.json()  : {};
  const tasksData  = tasksRes.ok      ? await tasksRes.json()      : {};
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
      <div style={{ minHeight: "100vh", background: "#f8f7f4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#ef4444", fontSize: 18 }}>Failed to load career details.</p>
        <Link href="/explore-careers" style={{ color: "#6366f1", marginTop: 16 }}>← Back to Careers</Link>
      </div>
    );
  }

  const outlookColor = {
    "Bright": { bg: "#f0fdf4", text: "#166534", border: "#86efac", dot: "#22c55e" },
    "Average": { bg: "#fefce8", text: "#854d0e", border: "#fde047", dot: "#eab308" },
    "Below Average": { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", dot: "#ef4444" },
  }[career.outlook_category] || { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe", dot: "#8b5cf6" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&family=DM+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .slide-in { animation: slideIn 0.5s ease forwards; }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%)",
        position: "relative", overflow: "hidden"
      }}>
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.4,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: -100, right: "15%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -60, left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "48px 24px 64px" }}>
          <Link href="/explore-careers" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600,
            textDecoration: "none", marginBottom: 32,
            transition: "color 0.2s",
          }}>
            <ArrowLeft size={15} /> Back to Explore
          </Link>

          {/* Tags */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }} className="fade-up">
            {career.bright_outlook && (
              <span style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.4)",
                color: "#fde047", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700
              }}>
                <Star size={11} fill="#fde047" /> Bright Outlook
              </span>
            )}
            {career.in_demand && (
              <span style={{
                background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)",
                color: "#86efac", borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700
              }}>🔥 In Demand</span>
            )}
            {career.outlook_category && (
              <span style={{
                background: outlookColor.bg, border: `1px solid ${outlookColor.border}`,
                color: outlookColor.text, borderRadius: 100, padding: "6px 16px", fontSize: 12, fontWeight: 700
              }}>📈 {career.outlook_category} Outlook</span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#fff",
            fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1, maxWidth: 760,
            animation: "fadeUp 0.7s 0.1s ease both"
          }}>{career.title}</h1>

          {career.also_called.length > 0 && (
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 12, animation: "fadeUp 0.7s 0.2s ease both" }}>
              Also known as: <span style={{ color: "rgba(255,255,255,0.65)" }}>{career.also_called.join(" · ")}</span>
            </p>
          )}
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 8, fontFamily: "'DM Mono', monospace", animation: "fadeUp 0.7s 0.3s ease both" }}>
            O*NET · {career.code}
          </p>

          {/* Salary Hero Strip */}
          {career.salary && (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16, marginTop: 40, animation: "fadeUp 0.7s 0.4s ease both"
            }}>
              {[
                { label: "Median Annual", value: fmt(career.salary.median), icon: "💰", highlight: true },
                { label: "Hourly Rate", value: career.salary.hourly_median ? `$${career.salary.hourly_median}/hr` : "—", icon: "⏱" },
                { label: "Entry Level", value: fmt(career.salary.low), icon: "🌱" },
                { label: "Senior Level", value: fmt(career.salary.high), icon: "🏆" },
              ].map(s => (
                <div key={s.label} style={{
                  background: s.highlight ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)",
                  border: s.highlight ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16, padding: "20px 20px", textAlign: "center"
                }}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: s.highlight ? 26 : 20, fontWeight: 900, color: s.highlight ? "#a5b4fc" : "#fff", fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>

        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* About */}
          {career.description && (
            <Section title="About This Career" icon="📋">
              <p style={{ color: "#374151", lineHeight: 1.8, fontSize: 15 }}>{career.description}</p>
            </Section>
          )}

          {/* Job Outlook */}
          {career.growth && (
            <div style={{
              background: `linear-gradient(135deg, ${outlookColor.bg}, #fff)`,
              border: `1.5px solid ${outlookColor.border}`,
              borderRadius: 20, padding: "24px 28px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: outlookColor.dot, boxShadow: `0 0 8px ${outlookColor.dot}` }} />
                <TrendingUp size={18} color={outlookColor.text} />
                <h2 style={{ fontSize: 16, fontWeight: 800, color: outlookColor.text }}>Job Outlook — {career.outlook_category}</h2>
              </div>
              <p style={{ color: outlookColor.text, fontSize: 14, lineHeight: 1.8, opacity: 0.85 }}>{career.growth}</p>
            </div>
          )}

          {/* Tasks */}
          {career.tasks.length > 0 && (
            <Section title="What You'll Do Day-to-Day" icon="⚡">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {career.tasks.map((task, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "14px 16px", background: "#f8f9ff",
                    borderRadius: 12, border: "1px solid #e8eaf6",
                    animation: `fadeUp 0.5s ${i * 60}ms ease both`
                  }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "#fff", fontSize: 12, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>{i + 1}</span>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{task}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Skills */}
          {career.skills.length > 0 && (
            <Section title="Top Skills Required" icon="🛠">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {career.skills.map((skill, i) => (
                  <span key={i} style={{
                    background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
                    color: "#4338ca", border: "1px solid #c7d2fe",
                    borderRadius: 100, padding: "8px 18px",
                    fontSize: 13, fontWeight: 700,
                    animation: `scaleIn 0.4s ${i * 40}ms ease both`
                  }}>{skill}</span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

          {/* Education Card */}
          {career.education.length > 0 && (
            <div style={{
              background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb",
              padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <GraduationCap size={18} color="#fff" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Education Required</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {career.education.map((edu, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{edu.name}</span>
                    {edu.score && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: "#6366f1",
                        background: "#eef2ff", borderRadius: 100, padding: "2px 8px"
                      }}>{Math.round(edu.score)}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Areas */}
          {career.knowledge.length > 0 && (
            <div style={{
              background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb",
              padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <BookOpen size={18} color="#fff" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>Knowledge Areas</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {career.knowledge.map((k, i) => (
                  <div key={i} style={{
                    background: "#fdf2f8", border: "1px solid #fbcfe8",
                    borderRadius: 10, padding: "10px 12px",
                    fontSize: 12, fontWeight: 600, color: "#9d174d",
                    lineHeight: 1.4
                  }}>{k}</div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div style={{
            background: "linear-gradient(135deg, #0f0c29, #1a1a3e)",
            borderRadius: 20, padding: "28px 24px", textAlign: "center",
            boxShadow: "0 8px 32px rgba(99,102,241,0.25)"
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🌐</div>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Full Career Profile</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>
              View the complete O*NET profile with detailed competency data, wages by state, and related occupations.
            </p>
            <a href={career.onet_link} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", borderRadius: 14, padding: "14px 20px",
              fontWeight: 700, fontSize: 14, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              transition: "transform 0.2s"
            }}>
              View on O*NET <ExternalLink size={14} />
            </a>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 14 }}>
              Data: O*NET OnLine · U.S. Dept. of Labor
            </p>
          </div>
        </div>
      </div>

      {/* Mobile stickies hidden in this server version, handled by client layout if needed */}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, border: "1.5px solid #e5e7eb",
      padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.05)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", fontFamily: "'DM Sans', sans-serif" }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

