// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAssessment } from "@/app/context/AssessmentContext";
// import { generateResults } from "@/utils/generateResults";

// const CareerBlock = ({ title, items }) => (
//   <div className="bg-gray-50 p-4 rounded-lg">
//     <h4 className="font-semibold mb-2">{title}</h4>
//     <ul className="list-disc list-inside text-sm">
//       {items.map((career) => (
//         <li key={career}>{career}</li>
//       ))}
//     </ul>
//   </div>
// );

// const ResultsPage = () => {
//   const router = useRouter();
//   const { normalizedTraits, userProfile, rawAnswers } = useAssessment();
//   const [clusterResults, setClusterResults] = useState(null);
//   const [usingFallback, setUsingFallback] = useState(false);

//   useEffect(() => {
//     if (!userProfile) {
//       router.push("/aptitude");
//       return;
//     }

//     const load = async () => {
//       const prevCount = console.warn;
//       // detect if fallback was used via the warn in generateResults
//       console.warn = (...args) => {
//         if (args[0]?.includes("falling back")) setUsingFallback(true);
//         prevCount(...args);
//       };

//     const results = await generateResults(
//       userProfile.featureVector,
//       userProfile.meta?.confidence ?? 0.5,
//       rawAnswers // ← add this
//     );

//       console.warn = prevCount;
//       setClusterResults(results);
//     };

//     load();
//   }, [userProfile]);

//   if (!userProfile || !clusterResults) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-500 text-lg">Analyzing your results...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-8 bg-gray-50">
//       <h1 className="text-4xl font-bold mb-6">Your Assessment Results</h1>

//       {usingFallback && (
//         <p className="text-sm text-yellow-600 mb-4">
//           ⚠️ Showing locally computed results (ML service unavailable)
//         </p>
//       )}

//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <h2 className="text-2xl font-semibold mb-4">Core Traits</h2>
//         <div className="space-y-2">
//           {userProfile?.normalizedTraits &&
//             Object.entries(userProfile.normalizedTraits)
//               .filter(([trait]) => trait !== "confidence")
//               .map(([trait, score]) => (
//                 <div key={trait} className="flex justify-between">
//                   <span className="capitalize">{trait.replace("_", " ")}</span>
//                   <span>{Math.round(score * 100)}%</span>
//                 </div>
//               ))}
//         </div>
//       </div>

//       {clusterResults.length > 0 && (
//         <div className="bg-white p-6 rounded-xl shadow mt-8">
//           <h2 className="text-2xl font-semibold mb-4">Career Recommendations</h2>
//           {clusterResults.map((cluster) => (
//             <div key={cluster.clusterId} className="mb-6">
//               <h3 className="text-xl font-bold">{cluster.clusterName}</h3>
//               <p className="text-sm text-gray-600 mb-3">
//                 Match Strength: {cluster.similarity}%
//               </p>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <CareerBlock title="Top Matches" items={cluster.careers.top} />
//                 <CareerBlock title="Moderate Matches" items={cluster.careers.moderate} />
//                 {cluster.careers.least.length > 0 && (
//                   <CareerBlock title="Least Matches" items={cluster.careers.least} />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="flex gap-4 mt-6">
//         <button
//           onClick={() => router.push("/aptitude")}
//           className="px-6 py-3 bg-gray-200 rounded-xl"
//         >
//           Retake Test
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ResultsPage;



// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useAssessment } from "@/app/context/AssessmentContext";
// import { generateResults } from "@/utils/generateResults";

// // ─── Helpers ────────────────────────────────────────────────────────────────

// const TRAIT_LABELS = {
//   analytical: "Analytical",
//   spatial: "Spatial Reasoning",
//   numerical: "Numerical",
//   verbal: "Verbal Comprehension",
//   memory: "Memory & Recall",
//   creative: "Creative Thinking",
//   mechanical: "Mechanical Aptitude",
//   social: "Social Acuity",
//   emotional: "Emotional Intelligence",
//   problem_solving: "Problem Solving",
//   abstract: "Abstract Reasoning",
// };

// function humanLabel(key) {
//   return TRAIT_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
// }

// function getDominantTraits(normalizedTraits) {
//   return Object.entries(normalizedTraits)
//     .filter(([k]) => k !== "confidence")
//     .sort(([, a], [, b]) => b - a)
//     .slice(0, 3)
//     .map(([k]) => humanLabel(k));
// }

// function getThinkingStyle(clusterResults) {
//   if (!clusterResults?.length) return "Analytical Thinker";
//   return clusterResults[0].clusterName ?? "Independent Problem Solver";
// }

// // ─── Components ─────────────────────────────────────────────────────────────

// function CircularRing({ percentage, size = 160, stroke = 11 }) {
//   const [current, setCurrent] = useState(0);
//   const radius = (size - stroke) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (current / 100) * circumference;

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       let val = 0;
//       const step = () => {
//         val += 1.4;
//         if (val >= percentage) { setCurrent(percentage); return; }
//         setCurrent(Math.round(val));
//         requestAnimationFrame(step);
//       };
//       requestAnimationFrame(step);
//     }, 700);
//     return () => clearTimeout(timeout);
//   }, [percentage]);

//   return (
//     <div className="rl-ring-wrap" style={{ width: size, height: size }}>
//       <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
//         <defs>
//           <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="0%">
//             <stop offset="0%" stopColor="#0d9488" />
//             <stop offset="100%" stopColor="#38bdf8" />
//           </linearGradient>
//         </defs>
//         <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e8f4f8" strokeWidth={stroke} />
//         <circle
//           cx={size/2} cy={size/2} r={radius} fill="none"
//           stroke="url(#rg1)" strokeWidth={stroke} strokeLinecap="round"
//           strokeDasharray={circumference} strokeDashoffset={offset}
//           style={{ transition: "stroke-dashoffset 0.04s linear" }}
//         />
//       </svg>
//       <div className="rl-ring-inner">
//         <span className="rl-ring-pct">{current}%</span>
//         <span className="rl-ring-sub">match</span>
//       </div>
//     </div>
//   );
// }

// function TraitBar({ name, score, delay = 0 }) {
//   const [w, setW] = useState(0);
//   useEffect(() => {
//     const t = setTimeout(() => setW(score), 500 + delay);
//     return () => clearTimeout(t);
//   }, [score, delay]);

//   const strong = score >= 68;
//   return (
//     <div className="rl-trait-row">
//       <div className="rl-trait-meta">
//         <span className="rl-trait-name">{name}</span>
//         <span className="rl-trait-val" style={{ color: strong ? "#0d9488" : "#94a3b8" }}>{score}%</span>
//       </div>
//       <div className="rl-trait-track">
//         <div
//           className="rl-trait-fill"
//           style={{
//             width: `${w}%`,
//             background: strong
//               ? "linear-gradient(90deg,#0d9488,#38bdf8)"
//               : "linear-gradient(90deg,#cbd5e1,#e2e8f0)",
//             transition: `width 0.75s cubic-bezier(0.16,1,0.3,1) ${delay * 0.4}ms`,
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// function ClusterBar({ name, score, delay = 0 }) {
//   const [w, setW] = useState(0);
//   useEffect(() => {
//     const t = setTimeout(() => setW(score), 800 + delay);
//     return () => clearTimeout(t);
//   }, [score, delay]);

//   return (
//     <div className="rl-cluster-row">
//       <span className="rl-cluster-name">{name}</span>
//       <div className="rl-cluster-track">
//         <div
//           className="rl-cluster-fill"
//           style={{
//             width: `${w}%`,
//             transition: `width 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
//           }}
//         />
//       </div>
//       <span className="rl-cluster-score">{score}</span>
//     </div>
//   );
// }

// function CareerCard({ career, tier }) {
//   return (
//     <div className={`rl-career-card rl-career-${tier}`}>
//       <span className="rl-career-dot" />
//       <span>{career}</span>
//     </div>
//   );
// }

// function LoadingScreen() {
//   return (
//     <div className="rl-loading">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600&display=swap');
//         .rl-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#f0f9ff; font-family:'Instrument Sans',sans-serif; }
//         .rl-loading-inner { text-align:center; display:flex; flex-direction:column; align-items:center; gap:0.75rem; }
//         .rl-spinner { width:44px; height:44px; border-radius:50%; border:3px solid #e2f0f7; border-top-color:#0d9488; animation:spin 0.8s linear infinite; }
//         @keyframes spin { to { transform:rotate(360deg); } }
//         .rl-loading-text { font-family:'Fraunces',serif; font-size:1.1rem; font-weight:600; color:#0f2535; }
//         .rl-loading-sub { font-size:0.82rem; color:#94a3b8; }
//       `}</style>
//       <div className="rl-loading-inner">
//         <div className="rl-spinner" />
//         <p className="rl-loading-text">Analyzing your results…</p>
//         <p className="rl-loading-sub">Matching your profile across career clusters</p>
//       </div>
//     </div>
//   );
// }

// // ─── Page ────────────────────────────────────────────────────────────────────

// const ResultsPage = () => {
//   const router = useRouter();
//   const { userProfile, rawAnswers } = useAssessment();
//   const [clusterResults, setClusterResults] = useState(null);
//   const [usingFallback, setUsingFallback] = useState(false);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     if (!userProfile) { router.push("/aptitude"); return; }

//     const load = async () => {
//       const prevWarn = console.warn;
//       console.warn = (...args) => {
//         if (args[0]?.includes("falling back")) setUsingFallback(true);
//         prevWarn(...args);
//       };
//       const results = await generateResults(
//         userProfile.featureVector,
//         userProfile.meta?.confidence ?? 0.5,
//         rawAnswers
//       );
//       console.warn = prevWarn;
//       setClusterResults(results);
//       setTimeout(() => setVisible(true), 60);
//     };

//     load();
//   }, [userProfile]);

//   if (!userProfile || !clusterResults) return <LoadingScreen />;

//   // ── Derived data ─────────────────────────────────────────────────────────
//   const traits = Object.entries(userProfile.normalizedTraits ?? {})
//     .filter(([k]) => k !== "confidence")
//     .map(([k, v]) => ({ key: k, name: humanLabel(k), score: Math.round(v * 100) }))
//     .sort((a, b) => b.score - a.score);

//   const dominant = getDominantTraits(userProfile.normalizedTraits ?? {});
//   const thinkingStyle = getThinkingStyle(clusterResults);
//   const topCluster = clusterResults[0];
//   const matchPct = topCluster?.similarity ?? 0;
//   const clusterOverview = clusterResults.map((c) => ({ name: c.clusterName, score: c.similarity }));

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600&display=swap');

//         :root {
//           --teal: #0d9488;
//           --sky: #38bdf8;
//           --teal-d: #0f766e;
//           --sky-d: #0284c7;
//           --grad: linear-gradient(135deg, var(--teal), var(--sky));
//           --bg: #f0f9ff;
//           --surface: #ffffff;
//           --border: #e2f0f7;
//           --text: #0f2535;
//           --muted: #64748b;
//           --faint: #94a3b8;
//         }

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'Instrument Sans', sans-serif; background: var(--bg); color: var(--text); }

//         .rl-page {
//           max-width: 1120px;
//           margin: 0 auto;
//           padding: 2rem 1.25rem 6rem;
//           opacity: 0;
//           transform: translateY(18px);
//           transition: opacity 0.55s ease, transform 0.55s ease;
//         }
//         .rl-page.rl-visible { opacity: 1; transform: translateY(0); }

//         /* Topbar */
//         .rl-topbar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 2.5rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid var(--border);
//         }
//         .rl-logo {
//           font-family: 'Fraunces', serif;
//           font-size: 1.2rem;
//           font-weight: 700;
//           background: var(--grad);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//         }
//         .rl-fallback-badge {
//           font-size: 0.72rem; font-weight: 600; color: #92400e;
//           background: #fef3c7; border: 1px solid #fde68a;
//           padding: 0.25rem 0.75rem; border-radius: 999px;
//         }
//         .rl-tag {
//           font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
//           color: var(--teal); background: #ccfbf1; padding: 0.22rem 0.7rem; border-radius: 999px;
//         }

//         /* Hero */
//         .rl-hero {
//           background: var(--surface);
//           border-radius: 28px;
//           padding: 2.75rem 3rem;
//           margin-bottom: 1.5rem;
//           border: 1px solid rgba(13,148,136,0.12);
//           box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(13,148,136,0.1);
//           display: grid;
//           grid-template-columns: 1fr auto;
//           gap: 2.5rem;
//           align-items: center;
//           position: relative;
//           overflow: hidden;
//         }
//         .rl-hero::after {
//           content: '';
//           position: absolute; top: -80px; right: -80px;
//           width: 260px; height: 260px; border-radius: 50%;
//           background: radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 65%);
//           pointer-events: none;
//         }
//         .rl-hero-eyebrow {
//           font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
//           color: var(--faint); margin-bottom: 0.6rem;
//         }
//         .rl-hero-title {
//           font-family: 'Fraunces', serif;
//           font-size: clamp(2rem, 4.5vw, 3.1rem);
//           font-weight: 700; line-height: 1.1;
//           background: linear-gradient(130deg, var(--teal-d) 0%, var(--sky-d) 100%);
//           -webkit-background-clip: text; -webkit-text-fill-color: transparent;
//           background-clip: text; margin-bottom: 1rem;
//         }
//         .rl-hero-desc { font-size: 0.97rem; line-height: 1.75; color: var(--muted); max-width: 52ch; }
//         .rl-hero-icon {
//           width: 96px; height: 96px; border-radius: 26px;
//           background: linear-gradient(135deg, #ccfbf1, #bae6fd);
//           display: flex; align-items: center; justify-content: center;
//           font-size: 2.75rem; flex-shrink: 0;
//           box-shadow: 0 6px 20px rgba(13,148,136,0.18);
//         }

//         /* Grids & cards */
//         .rl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
//         .rl-card {
//           background: var(--surface); border-radius: 22px; padding: 1.75rem 2rem;
//           border: 1px solid var(--border);
//           box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 6px 20px rgba(0,0,0,0.04);
//         }
//         .rl-card-title { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600; color: var(--text); margin-bottom: 0.2rem; }
//         .rl-card-sub { font-size: 0.78rem; color: var(--faint); margin-bottom: 1.5rem; }
//         .rl-ring-card { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }

//         /* Ring */
//         .rl-ring-wrap { position: relative; display: flex; align-items: center; justify-content: center; margin: 0.25rem 0 1rem; }
//         .rl-ring-inner { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 1px; }
//         .rl-ring-pct { font-family: 'Fraunces', serif; font-size: 2.1rem; font-weight: 700; color: var(--teal-d); line-height: 1; }
//         .rl-ring-sub { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--faint); }
//         .rl-ring-caption { font-size: 0.8rem; color: var(--muted); line-height: 1.5; max-width: 22ch; }

//         /* Pills */
//         .rl-dom-eyebrow { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--faint); margin-bottom: 0.7rem; }
//         .rl-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.75rem; }
//         .rl-pill {
//           font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.9rem; border-radius: 999px;
//           background: linear-gradient(135deg, #ccfbf1, #bae6fd); color: var(--teal-d);
//           border: 1px solid rgba(13,148,136,0.15);
//         }

//         /* Trait bars */
//         .rl-trait-row { margin-bottom: 0.85rem; }
//         .rl-trait-meta { display: flex; justify-content: space-between; margin-bottom: 0.28rem; }
//         .rl-trait-name { font-size: 0.8rem; font-weight: 500; color: var(--muted); }
//         .rl-trait-val { font-size: 0.78rem; font-weight: 600; }
//         .rl-trait-track { height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
//         .rl-trait-fill { height: 100%; border-radius: 999px; width: 0; }

//         /* Cluster bars */
//         .rl-cluster-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.65rem; }
//         .rl-cluster-name { font-size: 0.75rem; color: var(--muted); width: 150px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .rl-cluster-track { flex: 1; height: 5px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
//         .rl-cluster-fill { height: 100%; border-radius: 999px; background: var(--grad); width: 0; transition: width 0.75s cubic-bezier(0.16,1,0.3,1); }
//         .rl-cluster-score { font-size: 0.72rem; font-weight: 600; color: var(--faint); width: 26px; text-align: right; }

//         /* Career cards */
//         .rl-careers-grid { display: grid; grid-template-columns: 2fr 1.5fr 1fr; gap: 1.25rem; align-items: start; }
//         .rl-col-head { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.75rem; }
//         .rl-col-top .rl-col-head { color: var(--teal); }
//         .rl-col-moderate .rl-col-head { color: #64748b; }
//         .rl-col-least .rl-col-head { color: var(--faint); }
//         .rl-career-card {
//           display: flex; align-items: center; gap: 0.6rem;
//           padding: 0.8rem 1rem; border-radius: 12px; margin-bottom: 0.55rem;
//           font-weight: 500; font-size: 0.88rem; cursor: default;
//           transition: transform 0.18s ease, box-shadow 0.18s ease;
//         }
//         .rl-career-card:hover { transform: translateY(-2px); }
//         .rl-career-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
//         .rl-career-top { background: var(--grad); color: #fff; box-shadow: 0 4px 16px rgba(13,148,136,0.26); }
//         .rl-career-top .rl-career-dot { background: rgba(255,255,255,0.55); }
//         .rl-career-moderate { background: #f8fafc; border: 1px solid #e2e8f0; color: var(--muted); }
//         .rl-career-moderate .rl-career-dot { background: #94a3b8; }
//         .rl-career-least { background: #f8fafc; border: 1px solid #f1f5f9; color: var(--faint); font-size: 0.82rem; padding: 0.65rem 0.85rem; }
//         .rl-career-least .rl-career-dot { background: #e2e8f0; }

//         /* Cluster blocks */
//         .rl-cluster-block { margin-bottom: 2.5rem; padding-bottom: 2.5rem; border-bottom: 1px solid var(--border); }
//         .rl-cluster-block:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
//         .rl-cluster-block-name { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 600; margin-bottom: 0.25rem; }
//         .rl-cluster-match { font-size: 0.8rem; color: var(--faint); margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.6rem; }
//         .rl-match-bar-wrap { display: inline-block; height: 4px; width: 60px; background: #f1f5f9; border-radius: 99px; overflow: hidden; vertical-align: middle; }
//         .rl-match-bar-fill { height: 100%; background: var(--grad); border-radius: 99px; }

//         /* Actions */
//         .rl-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2.5rem; }
//         .rl-btn {
//           font-family: 'Instrument Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
//           padding: 0.75rem 1.75rem; border-radius: 12px; border: none; cursor: pointer;
//           transition: all 0.2s ease; text-decoration: none;
//           display: inline-flex; align-items: center; gap: 0.4rem;
//         }
//         .rl-btn-primary { background: var(--grad); color: #fff; box-shadow: 0 4px 16px rgba(13,148,136,0.3); }
//         .rl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,148,136,0.38); }
//         .rl-btn-secondary { background: #fff; color: var(--muted); border: 1px solid var(--border); }
//         .rl-btn-secondary:hover { background: #f8fafc; }
//         .rl-btn-ghost { background: transparent; color: var(--faint); border: 1px solid var(--border); }
//         .rl-btn-ghost:hover { color: var(--muted); }

//         /* Stagger */
//         .rl-fade { opacity: 0; transform: translateY(14px); animation: rlFadeUp 0.5s ease forwards; }
//         @keyframes rlFadeUp { to { opacity: 1; transform: none; } }

//         /* Responsive */
//         @media (max-width: 768px) {
//           .rl-hero { grid-template-columns: 1fr; padding: 1.75rem; }
//           .rl-hero-icon { width: 72px; height: 72px; font-size: 2rem; }
//           .rl-grid-2 { grid-template-columns: 1fr; }
//           .rl-careers-grid { grid-template-columns: 1fr; }
//           .rl-cluster-name { width: 110px; font-size: 0.7rem; }
//           .rl-card { padding: 1.25rem; }
//         }
//       `}</style>

//       <div className={`rl-page${visible ? " rl-visible" : ""}`}>

//         {/* Topbar */}
//         <div className="rl-topbar">
//           <span className="rl-logo">CareerLens</span>
//           {usingFallback
//             ? <span className="rl-fallback-badge">⚠️ Local results — ML service unavailable</span>
//             : <span className="rl-tag">Your Results</span>
//           }
//         </div>

//         {/* ── Hero ── */}
//         <div className="rl-hero rl-fade" style={{ animationDelay: "0.08s" }}>
//           <div>
//             <div className="rl-hero-eyebrow">Your Thinking Style</div>
//             <h1 className="rl-hero-title">{thinkingStyle}</h1>
//             <p className="rl-hero-desc">
//               {topCluster
//                 ? `Your profile aligns most strongly with the ${topCluster.clusterName} cluster, reflecting a distinctive blend of the cognitive traits below.`
//                 : "Your profile reflects a unique combination of cognitive strengths mapped across multiple career dimensions."}
//             </p>
//           </div>
//           <div className="rl-hero-icon">🧩</div>
//         </div>

//         {/* ── Ring + Dominant Traits ── */}
//         <div className="rl-grid-2">
//           <div className="rl-card rl-ring-card rl-fade" style={{ animationDelay: "0.18s" }}>
//             <div className="rl-card-title">Match Strength</div>
//             <div className="rl-card-sub">Top cluster alignment</div>
//             <CircularRing percentage={matchPct} size={156} stroke={11} />
//             <p className="rl-ring-caption">How closely your profile aligns with your best-fit career cluster.</p>
//           </div>

//           <div className="rl-card rl-fade" style={{ animationDelay: "0.26s" }}>
//             <div className="rl-card-title">Standout Strengths</div>
//             <div className="rl-card-sub">Your dominant traits at a glance</div>
//             <div className="rl-dom-eyebrow">Defining traits</div>
//             <div className="rl-pills">
//               {dominant.map((d) => <span key={d} className="rl-pill">{d}</span>)}
//             </div>
//             {clusterOverview.length > 1 && (
//               <>
//                 <div className="rl-dom-eyebrow">Cluster overview</div>
//                 {clusterOverview.map((c, i) => (
//                   <ClusterBar key={c.name} name={c.name} score={c.score} delay={i * 80} />
//                 ))}
//               </>
//             )}
//           </div>
//         </div>

//         {/* ── Core Traits ── */}
//         {traits.length > 0 && (
//           <div className="rl-card rl-fade" style={{ marginBottom: "1.5rem", animationDelay: "0.32s" }}>
//             <div className="rl-card-title">Core Traits Breakdown</div>
//             <div className="rl-card-sub">Your scores across all cognitive dimensions</div>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0 2.5rem" }}>
//               {traits.map((t, i) => (
//                 <TraitBar key={t.key} name={t.name} score={t.score} delay={i * 55} />
//               ))}
//             </div>
//           </div>
//         )}

//         {/* ── Career Recommendations ── */}
//         {clusterResults.length > 0 && (
//           <div className="rl-card rl-fade" style={{ marginBottom: "1.5rem", animationDelay: "0.4s" }}>
//             <div className="rl-card-title">Career Recommendations</div>
//             <div className="rl-card-sub">Paths ranked by compatibility with your profile</div>

//             {clusterResults.map((cluster) => (
//               <div key={cluster.clusterId} className="rl-cluster-block">
//                 <div className="rl-cluster-block-name">{cluster.clusterName}</div>
//                 <div className="rl-cluster-match">
//                   <span className="rl-match-bar-wrap">
//                     <span className="rl-match-bar-fill" style={{ width: `${cluster.similarity}%` }} />
//                   </span>
//                   {cluster.similarity}% match strength
//                 </div>

//                 <div className="rl-careers-grid">
//                   <div className="rl-col-top">
//                     <div className="rl-col-head">⭐ Top Matches</div>
//                     {cluster.careers.top.map((c) => (
//                       <CareerCard key={c} career={c} tier="top" />
//                     ))}
//                   </div>

//                   <div className="rl-col-moderate">
//                     <div className="rl-col-head">◎ Moderate</div>
//                     {cluster.careers.moderate.map((c) => (
//                       <CareerCard key={c} career={c} tier="moderate" />
//                     ))}
//                   </div>

//                   {cluster.careers.least?.length > 0 && (
//                     <div className="rl-col-least">
//                       <div className="rl-col-head">○ Least Matched</div>
//                       {cluster.careers.least.map((c) => (
//                         <CareerCard key={c} career={c} tier="least" />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* ── Actions ── */}
//         <div className="rl-actions rl-fade" style={{ animationDelay: "0.48s" }}>
//           <button className="rl-btn rl-btn-secondary" onClick={() => router.push("/aptitude")}>
//             ↩ Retake Test
//           </button>
//           <a href="/explore" className="rl-btn rl-btn-primary">
//             Explore Careers →
//           </a>
//           <button className="rl-btn rl-btn-ghost">
//             🔖 Save Results
//           </button>
//         </div>


//       </div>
//     </>
//   );
// };

// export default ResultsPage;



"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAssessment } from "@/app/context/AssessmentContext";
import { generateResults } from "@/utils/generateResults";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TRAIT_LABELS = {
  analytical: "Analytical",
  spatial: "Spatial Reasoning",
  numerical: "Numerical",
  verbal: "Verbal Comprehension",
  memory: "Memory & Recall",
  creative: "Creative Thinking",
  mechanical: "Mechanical Aptitude",
  social: "Social Acuity",
  emotional: "Emotional Intelligence",
  problem_solving: "Problem Solving",
  abstract: "Abstract Reasoning",
};

function humanLabel(key) {
  return TRAIT_LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDominantTraits(normalizedTraits) {
  return Object.entries(normalizedTraits)
    .filter(([k]) => k !== "confidence")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([k]) => humanLabel(k));
}

// Map a trait key to a short "why it suits you" reason
const TRAIT_REASONS = {
  analytical: "strong analytical thinking",
  spatial: "exceptional spatial reasoning",
  numerical: "high numerical aptitude",
  verbal: "strong verbal comprehension",
  memory: "sharp memory and recall",
  creative: "creative problem-solving ability",
  mechanical: "solid mechanical aptitude",
  social: "strong social awareness",
  emotional: "high emotional intelligence",
  problem_solving: "natural problem-solving instinct",
  abstract: "abstract reasoning ability",
};

function buildWhySuitsYou(dominant, clusterName) {
  const reasons = dominant
    .map((k) => TRAIT_REASONS[k] ?? humanLabel(k).toLowerCase())
    .join(", ");
  return `Careers in the ${clusterName} cluster suit you because of your ${reasons}. These strengths align directly with the core demands of these roles, giving you a natural head start.`;
}

// Tier config — distinct colors per tier
const TIER_CONFIG = {
  top: {
    label: "Top Matches",
    emoji: "★",
    cardBg: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
    cardColor: "#fff",
    dotColor: "rgba(255,255,255,0.5)",
    tagBg: "rgba(255,255,255,0.18)",
    tagColor: "#fff",
    headerColor: "#0f766e",
    headerBg: "#ccfbf1",
    border: "none",
    shadow: "0 6px 24px rgba(13,148,136,0.3)",
  },
  moderate: {
    label: "Good Fits",
    emoji: "◆",
    cardBg: "linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)",
    cardColor: "#fff",
    dotColor: "rgba(255,255,255,0.45)",
    tagBg: "rgba(255,255,255,0.18)",
    tagColor: "#fff",
    headerColor: "#6d28d9",
    headerBg: "#ede9fe",
    border: "none",
    shadow: "0 6px 24px rgba(124,58,237,0.25)",
  },
  least: {
    label: "Explore Later",
    emoji: "◇",
    cardBg: "#f8fafc",
    cardColor: "#64748b",
    dotColor: "#cbd5e1",
    tagBg: "#f1f5f9",
    tagColor: "#94a3b8",
    headerColor: "#94a3b8",
    headerBg: "#f1f5f9",
    border: "1px solid #e2e8f0",
    shadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TraitBar({ name, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), 400 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);
  const strong = score >= 68;
  return (
    <div className="rl-trait-row">
      <div className="rl-trait-meta">
        <span className="rl-trait-name">{name}</span>
        <span className="rl-trait-val" style={{ color: strong ? "#0d9488" : "#94a3b8" }}>{score}%</span>
      </div>
      <div className="rl-trait-track">
        <div className="rl-trait-fill" style={{
          width: `${w}%`,
          background: strong ? "linear-gradient(90deg,#0d9488,#38bdf8)" : "linear-gradient(90deg,#cbd5e1,#e2e8f0)",
          transition: `width 0.75s cubic-bezier(0.16,1,0.3,1) ${delay * 0.4}ms`,
        }} />
      </div>
    </div>
  );
}

function ClusterBar({ name, score, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(score), 700 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);
  return (
    <div className="rl-cluster-row">
      <span className="rl-cluster-name">{name}</span>
      <div className="rl-cluster-track">
        <div className="rl-cluster-fill" style={{
          width: `${w}%`,
          transition: `width 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }} />
      </div>
      <span className="rl-cluster-score">{score}</span>
    </div>
  );
}

function CareerCard({ career, tier, index }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <div
      className="rl-career-card"
      style={{
        background: cfg.cardBg,
        color: cfg.cardColor,
        border: cfg.border,
        boxShadow: cfg.shadow,
        animationDelay: `${0.05 * index}s`,
      }}
    >
      <span className="rl-career-dot" style={{ background: cfg.dotColor }} />
      <span className="rl-career-name">{career}</span>
    </div>
  );
}

function TierColumn({ tier, careers }) {
  const cfg = TIER_CONFIG[tier];
  if (!careers?.length) return null;
  return (
    <div className="rl-tier-col">
      <div className="rl-tier-header" style={{ color: cfg.headerColor, background: cfg.headerBg }}>
        <span>{cfg.emoji}</span>
        <span>{cfg.label}</span>
      </div>
      {careers.map((c, i) => (
        <CareerCard key={c} career={c} tier={tier} index={i} />
      ))}
    </div>
  );
}

function WhySuitsYou({ dominant, clusterName, normalizedTraits }) {
  const topEntries = Object.entries(normalizedTraits)
    .filter(([k]) => k !== "confidence")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const summary = buildWhySuitsYou(topEntries.map(([k]) => k), clusterName);

  return (
    <div className="rl-why-card">
      <div className="rl-why-header">
        <span className="rl-why-icon">💡</span>
        <div>
          <div className="rl-why-title">Why these careers suit you</div>
          <div className="rl-why-sub">Based on your cognitive profile</div>
        </div>
      </div>
      <p className="rl-why-body">{summary}</p>
      <div className="rl-why-traits">
        {topEntries.map(([k, v]) => (
          <div key={k} className="rl-why-trait-chip">
            <span className="rl-why-trait-label">{humanLabel(k)}</span>
            <span className="rl-why-trait-score">{Math.round(v * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Instrument Sans', sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          border: "3px solid #e2f0f7", borderTopColor: "#0d9488",
          animation: "rl-spin 0.8s linear infinite", margin: "0 auto 1rem",
        }} />
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", fontWeight: 600 }}>Analyzing your results…</p>
        <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "0.4rem" }}>Matching your profile across career clusters</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const ResultsPage = () => {
  const router = useRouter();
  const { userProfile, rawAnswers } = useAssessment();
  const [clusterResults, setClusterResults] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userProfile) { router.push("/aptitude"); return; }
    const load = async () => {
      const prevWarn = console.warn;
      console.warn = (...args) => {
        if (args[0]?.includes("falling back")) setUsingFallback(true);
        prevWarn(...args);
      };
      const results = await generateResults(
        userProfile.featureVector,
        userProfile.meta?.confidence ?? 0.5,
        rawAnswers
      );
      console.warn = prevWarn;
      setClusterResults(results);
      setTimeout(() => setVisible(true), 60);
    };
    load();
  }, [userProfile]);

  if (!userProfile || !clusterResults) return <LoadingScreen />;

  const traits = Object.entries(userProfile.normalizedTraits ?? {})
    .filter(([k]) => k !== "confidence")
    .map(([k, v]) => ({ key: k, name: humanLabel(k), score: Math.round(v * 100) }))
    .sort((a, b) => b.score - a.score);

  const dominant = getDominantTraits(userProfile.normalizedTraits ?? {});
  const topCluster = clusterResults[0];
  const thinkingStyle = topCluster?.clusterName ?? "Analytical Thinker";
  const clusterOverview = clusterResults.map((c) => ({ name: c.clusterName, score: c.similarity }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,700&family=Instrument+Sans:wght@400;500;600&display=swap');

        :root {
          --teal: #0d9488; --sky: #38bdf8;
          --teal-d: #0f766e; --sky-d: #0284c7;
          --grad: linear-gradient(135deg, var(--teal), var(--sky));
          --bg: #f0f9ff; --surface: #ffffff;
          --border: #e2f0f7; --text: #0f2535;
          --muted: #64748b; --faint: #94a3b8;
        }

        /* ── Reset only inside results ── */
        .rl-root *, .rl-root *::before, .rl-root *::after { box-sizing: border-box; }
        .rl-root { font-family: 'Instrument Sans', sans-serif; color: var(--text); }

        /* ── Page wrapper — does NOT touch navbar/footer ── */
        .rl-page {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .rl-page.rl-visible { opacity: 1; transform: none; }

        /* ── Fallback banner ── */
        .rl-fallback {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef3c7; border: 1px solid #fde68a;
          border-radius: 10px; padding: 0.6rem 1rem;
          font-size: 0.78rem; font-weight: 600; color: #92400e;
          margin-bottom: 1.5rem;
        }

        /* ── Hero banner ── */
        .rl-hero {
          background: var(--surface);
          border-radius: 24px;
          padding: 2.5rem 3rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(13,148,136,0.12);
          box-shadow: 0 2px 4px rgba(0,0,0,0.03), 0 10px 36px rgba(13,148,136,0.09);
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .rl-hero::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: var(--grad);
        }
        .rl-hero::after {
          content: '';
          position: absolute; top: -80px; right: -80px;
          width: 250px; height: 250px; border-radius: 50%;
          background: radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .rl-hero-eyebrow {
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--teal); margin-bottom: 0.55rem;
        }
        .rl-hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(1.9rem, 4vw, 2.9rem);
          font-weight: 700; line-height: 1.1;
          background: linear-gradient(130deg, var(--teal-d), var(--sky-d));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; margin-bottom: 0.9rem;
        }
        .rl-hero-desc { font-size: 0.95rem; line-height: 1.75; color: var(--muted); max-width: 50ch; }
        .rl-hero-icon {
          width: 92px; height: 92px; border-radius: 24px; flex-shrink: 0;
          background: linear-gradient(135deg, #ccfbf1, #bae6fd);
          display: flex; align-items: center; justify-content: center;
          font-size: 2.6rem;
          box-shadow: 0 4px 18px rgba(13,148,136,0.18);
        }

        /* ── Section headings ── */
        .rl-section-head {
          display: flex; align-items: baseline; gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .rl-section-title {
          font-family: 'Fraunces', serif; font-size: 1.35rem; font-weight: 700; color: var(--text);
        }
        .rl-section-sub { font-size: 0.78rem; color: var(--faint); }

        /* ── Careers grid ── */
        .rl-careers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
          align-items: start;
        }
        .rl-tier-col { display: flex; flex-direction: column; gap: 0; }
        .rl-tier-header {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; padding: 0.3rem 0.75rem;
          border-radius: 999px; margin-bottom: 0.85rem;
          width: fit-content;
        }
        .rl-career-card {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.85rem 1.1rem; border-radius: 14px;
          margin-bottom: 0.55rem; font-weight: 500; font-size: 0.9rem;
          cursor: default;
          transition: transform 0.18s ease, box-shadow 0.2s ease;
          animation: rl-fadeUp 0.4s ease both;
        }
        .rl-career-card:hover { transform: translateY(-3px); }
        .rl-career-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .rl-career-name { line-height: 1.3; }

        /* ── Why it suits you ── */
        .rl-why-card {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%);
          border: 1px solid rgba(13,148,136,0.15);
          border-radius: 20px; padding: 1.75rem 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 12px rgba(13,148,136,0.07);
        }
        .rl-why-header {
          display: flex; align-items: flex-start; gap: 0.9rem; margin-bottom: 1rem;
        }
        .rl-why-icon {
          font-size: 1.6rem; line-height: 1; margin-top: 2px; flex-shrink: 0;
        }
        .rl-why-title {
          font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 700;
          color: var(--teal-d); margin-bottom: 0.15rem;
        }
        .rl-why-sub { font-size: 0.75rem; color: var(--faint); }
        .rl-why-body {
          font-size: 0.93rem; line-height: 1.75; color: var(--muted);
          margin-bottom: 1.25rem;
        }
        .rl-why-traits { display: flex; flex-wrap: wrap; gap: 0.6rem; }
        .rl-why-trait-chip {
          display: flex; align-items: center; gap: 0.45rem;
          background: white; border: 1px solid rgba(13,148,136,0.15);
          border-radius: 999px; padding: 0.3rem 0.8rem;
        }
        .rl-why-trait-label { font-size: 0.78rem; font-weight: 600; color: var(--teal-d); }
        .rl-why-trait-score {
          font-size: 0.72rem; font-weight: 700; color: white;
          background: var(--grad); padding: 0.1rem 0.45rem;
          border-radius: 999px; line-height: 1.4;
        }

        /* ── Card wrapper ── */
        .rl-card {
          background: var(--surface); border-radius: 20px; padding: 1.75rem 2rem;
          border: 1px solid var(--border);
          box-shadow: 0 1px 3px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04);
          margin-bottom: 1.5rem;
        }
        .rl-card-title {
          font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 600;
          color: var(--text); margin-bottom: 0.2rem;
        }
        .rl-card-sub { font-size: 0.78rem; color: var(--faint); margin-bottom: 1.4rem; }

        /* ── Trait bars ── */
        .rl-trait-row { margin-bottom: 0.85rem; }
        .rl-trait-meta { display: flex; justify-content: space-between; margin-bottom: 0.28rem; }
        .rl-trait-name { font-size: 0.8rem; font-weight: 500; color: var(--muted); }
        .rl-trait-val { font-size: 0.78rem; font-weight: 600; }
        .rl-trait-track { height: 6px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .rl-trait-fill { height: 100%; border-radius: 999px; width: 0; }

        /* ── Cluster bars ── */
        .rl-cluster-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.65rem; }
        .rl-cluster-name { font-size: 0.75rem; color: var(--muted); width: 160px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rl-cluster-track { flex: 1; height: 5px; background: #f1f5f9; border-radius: 999px; overflow: hidden; }
        .rl-cluster-fill { height: 100%; border-radius: 999px; background: var(--grad); width: 0; transition: width 0.75s cubic-bezier(0.16,1,0.3,1); }
        .rl-cluster-score { font-size: 0.72rem; font-weight: 600; color: var(--faint); width: 28px; text-align: right; }

        /* ── Dominant trait pills ── */
        .rl-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .rl-pill {
          font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.9rem; border-radius: 999px;
          background: linear-gradient(135deg, #ccfbf1, #bae6fd);
          color: var(--teal-d); border: 1px solid rgba(13,148,136,0.15);
        }

        /* ── Actions ── */
        .rl-actions { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem; }
        .rl-btn {
          font-family: 'Instrument Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
          padding: 0.75rem 1.75rem; border-radius: 12px; border: none; cursor: pointer;
          transition: all 0.2s ease; text-decoration: none;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .rl-btn-primary { background: var(--grad); color: #fff; box-shadow: 0 4px 16px rgba(13,148,136,0.3); }
        .rl-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,148,136,0.38); }
        .rl-btn-secondary { background: #fff; color: var(--muted); border: 1px solid var(--border); }
        .rl-btn-secondary:hover { background: #f8fafc; }
        .rl-btn-ghost { background: transparent; color: var(--faint); border: 1px solid var(--border); }
        .rl-btn-ghost:hover { color: var(--muted); }

        /* ── Animations ── */
        .rl-fade { opacity: 0; transform: translateY(14px); animation: rl-fadeUp 0.5s ease forwards; }
        @keyframes rl-fadeUp { to { opacity: 1; transform: none; } }
        @keyframes rl-spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .rl-divider { height: 1px; background: var(--border); margin: 2rem 0; }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .rl-hero { grid-template-columns: 1fr; padding: 1.75rem; }
          .rl-hero-icon { width: 72px; height: 72px; font-size: 2rem; }
          .rl-careers-grid { grid-template-columns: 1fr; gap: 1rem; }
          .rl-cluster-name { width: 110px; }
          .rl-card { padding: 1.25rem; }
          .rl-page { padding: 1.5rem 1rem 3rem; }
        }
      `}</style>

      <div className="rl-root">
        <div className={`rl-page${visible ? " rl-visible" : ""}`}>

          {/* Fallback warning */}
          {usingFallback && (
            <div className="rl-fallback">
              ⚠️ Showing locally computed results — ML service is currently unavailable.
            </div>
          )}

          {/* ── 1. Hero: Thinking Style ── */}
          <div className="rl-hero rl-fade" style={{ animationDelay: "0.05s" }}>
            <div>
              <div className="rl-hero-eyebrow">Your Thinking Style</div>
              <h1 className="rl-hero-title">{thinkingStyle}</h1>
              <p className="rl-hero-desc">
                {topCluster
                  ? `Your profile aligns most strongly with the ${topCluster.clusterName} cluster, reflecting a distinctive blend of cognitive strengths that make you a natural fit for the careers below.`
                  : "Your profile reflects a unique combination of cognitive strengths across multiple career dimensions."}
              </p>
            </div>
            <div className="rl-hero-icon">🧩</div>
          </div>

          {/* ── 2. Career Recommendations ── */}
          {clusterResults.map((cluster, ci) => (
            <div key={cluster.clusterId} className={`rl-fade`} style={{ animationDelay: `${0.12 + ci * 0.06}s`, marginBottom: ci < clusterResults.length - 1 ? "2.5rem" : "2rem" }}>
              <div className="rl-section-head">
                <span className="rl-section-title">
                  {ci === 0 ? "Your Career Recommendations" : cluster.clusterName}
                </span>
                <span className="rl-section-sub">{cluster.similarity}% match</span>
              </div>

              <div className="rl-careers-grid">
                <TierColumn tier="top" careers={cluster.careers.top} />
                <TierColumn tier="moderate" careers={cluster.careers.moderate} />
                {cluster.careers.least?.length > 0 && (
                  <TierColumn tier="least" careers={cluster.careers.least} />
                )}
              </div>

              {/* Why it suits you — shown per cluster */}
              <WhySuitsYou
                dominant={dominant.map(h => Object.entries(TRAIT_LABELS).find(([,v]) => v === h)?.[0] ?? h.toLowerCase())}
                clusterName={cluster.clusterName}
                normalizedTraits={userProfile.normalizedTraits ?? {}}
              />

              {ci < clusterResults.length - 1 && <div className="rl-divider" />}
            </div>
          ))}

          {/* ── 3. Core Traits Breakdown ── */}
          {traits.length > 0 && (
            <div className="rl-card rl-fade" style={{ animationDelay: "0.35s" }}>
              <div className="rl-card-title">Your Cognitive Profile</div>
              <div className="rl-card-sub">Scores across all measured dimensions</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0 2.5rem" }}>
                {traits.map((t, i) => (
                  <TraitBar key={t.key} name={t.name} score={t.score} delay={i * 55} />
                ))}
              </div>
            </div>
          )}

          {/* ── 4. Dominant Traits + Cluster Overview ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem", animationDelay: "0.42s" }}
               className="rl-fade">
            {/* Dominant traits */}

            {/* Cluster overview */}
            {clusterOverview.length > 1 && (
              <div className="rl-card" style={{ margin: 0 }}>
                <div className="rl-card-title">Cluster Overview</div>
                <div className="rl-card-sub">How you scored across all career clusters</div>
                {clusterOverview.map((c, i) => (
                  <ClusterBar key={c.name} name={c.name} score={c.score} delay={i * 80} />
                ))}
              </div>
            )}
          </div>

          {/* ── 5. Actions ── */}
          <div className="rl-actions rl-fade" style={{ animationDelay: "0.5s" }}>
            <button className="rl-btn rl-btn-secondary" onClick={() => router.push("/aptitude")}>
              ↩ Retake Test
            </button>
            <a href="/explore" className="rl-btn rl-btn-primary">
              Explore Careers →
            </a>
            <button className="rl-btn rl-btn-ghost">
              🔖 Save Results
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default ResultsPage;