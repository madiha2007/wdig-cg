
// // "use client";
// // import { useState, useEffect, useRef, useCallback } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";

// // // ── Design tokens ─────────────────────────────────────────────────────────────
// // const T = {
// //   ink:      "#0D1B2A",
// //   inkMid:   "#2C3E50",
// //   inkLight: "#5D7A8A",
// //   teal:     "#0A7B6B",
// //   tealLight:"#E8F8F5",
// //   tealMid:  "#14B89A",
// //   gold:     "#C9962B",
// //   goldLight:"#FEF9EC",
// //   rose:     "#C0445A",
// //   roseLight:"#FDF0F2",
// //   sky:      "#1A6B9A",
// //   skyLight: "#EDF5FB",
// //   purple:   "#5B3FA0",
// //   purpleLight:"#F3EFFD",
// //   cream:    "#FAFAF8",
// //   white:    "#FFFFFF",
// //   border:   "rgba(13,27,42,0.08)",
// // };

// // const SECTION_PALETTE = [
// //   { accent: T.teal,   light: T.tealLight,   icon: "🧬" },  // Who You Are
// //   { accent: T.rose,   light: T.roseLight,   icon: "🔓" },  // What's Holding You Back
// //   { accent: T.gold,   light: T.goldLight,   icon: "🌍" },  // What You Offer
// //   { accent: T.sky,    light: T.skyLight,    icon: "🎯" },  // Careers Suggested
// //   { accent: T.purple, light: T.purpleLight, icon: "🗺️" },  // Career Roadmap
// //   { accent: T.teal,   light: T.tealLight,   icon: "🎓" },  // Educational Pathway
// //   { accent: T.gold,   light: T.goldLight,   icon: "⚡" },  // Skillset to Build
// // ];

// // // ── SVG figures ───────────────────────────────────────────────────────────────

// // function BrainFigure() {
// //   return (
// //     <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 120, height: 100 }}>
// //       <ellipse cx="60" cy="52" rx="46" ry="38" fill={T.tealLight} stroke={T.teal} strokeWidth="1.5" />
// //       <path d="M60 14 C60 14 48 22 46 36 C44 50 52 58 60 52 C68 58 76 50 74 36 C72 22 60 14 60 14Z" fill="white" stroke={T.teal} strokeWidth="1.2" />
// //       <line x1="60" y1="14" x2="60" y2="90" stroke={T.teal} strokeWidth="1" strokeDasharray="3 2" />
// //       <circle cx="44" cy="44" r="5" fill={T.tealMid} opacity="0.6" />
// //       <circle cx="76" cy="44" r="5" fill={T.tealMid} opacity="0.6" />
// //       <circle cx="60" cy="70" r="4" fill={T.gold} opacity="0.7" />
// //       <path d="M49 38 Q44 30 38 34" stroke={T.teal} strokeWidth="1" fill="none" />
// //       <path d="M71 38 Q76 30 82 34" stroke={T.teal} strokeWidth="1" fill="none" />
// //     </svg>
// //   );
// // }

// // function DimRadar({ scores }) {
// //   const dims = Object.entries(scores || {});
// //   if (dims.length === 0) return null;
// //   const cx = 80, cy = 80, R = 60;
// //   const n = dims.length;
// //   const pts = dims.map(([, v], i) => {
// //     const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
// //     const r = (v / 100) * R;
// //     return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), label: dims[i][0], val: v };
// //   });
// //   const polygon = pts.map(p => `${p.x},${p.y}`).join(" ");
// //   const gridLvls = [0.25, 0.5, 0.75, 1];
// //   return (
// //     <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" style={{ width: 160, height: 160 }}>
// //       {gridLvls.map(lvl => {
// //         const gpts = dims.map((_, i) => {
// //           const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
// //           return `${cx + lvl * R * Math.cos(angle)},${cy + lvl * R * Math.sin(angle)}`;
// //         }).join(" ");
// //         return <polygon key={lvl} points={gpts} fill="none" stroke={T.teal} strokeWidth="0.5" opacity="0.3" />;
// //       })}
// //       {dims.map((_, i) => {
// //         const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
// //         return <line key={i} x1={cx} y1={cy} x2={cx + R * Math.cos(angle)} y2={cy + R * Math.sin(angle)} stroke={T.teal} strokeWidth="0.5" opacity="0.3" />;
// //       })}
// //       <polygon points={polygon} fill={`${T.teal}28`} stroke={T.teal} strokeWidth="1.5" />
// //       {pts.map((p, i) => (
// //         <circle key={i} cx={p.x} cy={p.y} r="3" fill={T.teal} />
// //       ))}
// //       {pts.map((p, i) => {
// //         const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
// //         const lx = cx + (R + 14) * Math.cos(angle);
// //         const ly = cy + (R + 14) * Math.sin(angle);
// //         return (
// //           <text key={i} x={lx} y={ly + 3} textAnchor="middle" fontSize="7" fill={T.inkMid} fontFamily="system-ui">
// //             {p.label.slice(0, 4)}
// //           </text>
// //         );
// //       })}
// //     </svg>
// //   );
// // }

// // function CareerMindmap({ careers }) {
// //   if (!careers?.length) return null;
// //   const colors = [T.teal, T.sky, T.purple];
// //   return (
// //     <svg viewBox="0 0 420 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 420, height: "auto" }}>
// //       {/* centre node */}
// //       <ellipse cx="210" cy="140" rx="52" ry="28" fill={T.ink} />
// //       <text x="210" y="136" textAnchor="middle" fontSize="9" fill="white" fontFamily="Georgia,serif" fontWeight="700">Your Path</text>
// //       <text x="210" y="149" textAnchor="middle" fontSize="8" fill={`${T.tealMid}`} fontFamily="Georgia,serif">Career Matches</text>
// //       {careers.slice(0, 3).map((c, i) => {
// //         const angles = [-40, 0, 40];
// //         const angle = (angles[i] * Math.PI) / 180;
// //         const dist = 155;
// //         const x = 210 + dist * Math.cos(angle - Math.PI / 2) * (i === 1 ? 0 : 1) + (i === 0 ? -110 : i === 2 ? 110 : 0);
// //         const y = 140 + (i === 1 ? -110 : i === 0 ? -60 : -60);
// //         const col = colors[i];
// //         const mx = (210 + x) / 2;
// //         const my = (140 + y) / 2;
// //         const cx1 = 210 + (x - 210) * 0.4;
// //         const cy1 = 140;
// //         const cx2 = x;
// //         const cy2 = y + (y < 140 ? 20 : -20);
// //         return (
// //           <g key={i}>
// //             <path d={`M210,112 C${cx1},${my} ${cx2},${cy2} ${x},${y}`} stroke={col} strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
// //             <ellipse cx={x} cy={y} rx="58" ry="24" fill={col} fillOpacity="0.12" stroke={col} strokeWidth="1.5" />
// //             <text x={x} y={y - 3} textAnchor="middle" fontSize="8" fill={T.ink} fontFamily="Georgia,serif" fontWeight="700">{(c.name || "").slice(0, 20)}</text>
// //             <text x={x} y={y + 9} textAnchor="middle" fontSize="7" fill={col} fontFamily="system-ui">{c.score}% match</text>
// //             {/* sub-nodes: steps */}
// //             {(c.stream || []).slice(0, 2).map((s, j) => {
// //               const sx = x + (j === 0 ? -70 : 70);
// //               const sy = y + 50;
// //               return (
// //                 <g key={j}>
// //                   <line x1={x} y1={y + 24} x2={sx} y2={sy - 10} stroke={col} strokeWidth="1" opacity="0.5" />
// //                   <rect x={sx - 35} y={sy - 10} width="70" height="18" rx="9" fill="white" stroke={col} strokeWidth="1" opacity="0.8" />
// //                   <text x={sx} y={sy + 3} textAnchor="middle" fontSize="6.5" fill={T.inkMid} fontFamily="system-ui">{s.slice(0, 16)}</text>
// //                 </g>
// //               );
// //             })}
// //           </g>
// //         );
// //       })}
// //     </svg>
// //   );
// // }

// // function TraitRadialBar({ traits }) {
// //   if (!traits?.length) return null;
// //   const items = traits.slice(0, 6);
// //   const barH = 18, gap = 10, startY = 20;
// //   const totalH = items.length * (barH + gap) + startY;
// //   const maxW = 200;
// //   const colors = [T.teal, T.sky, T.purple, T.gold, T.rose, T.tealMid];
// //   return (
// //     <svg viewBox={`0 0 280 ${totalH}`} xmlns="http://www.w3.org/2000/svg" style={{ width: 280, height: totalH }}>
// //       {items.map(({ label, score }, i) => {
// //         const y = startY + i * (barH + gap);
// //         const w = (score / 100) * maxW;
// //         const col = colors[i % colors.length];
// //         return (
// //           <g key={i}>
// //             <text x="0" y={y + barH * 0.72} fontSize="8.5" fill={T.inkMid} fontFamily="system-ui" fontWeight="600">
// //               {(label || "").slice(0, 18)}
// //             </text>
// //             <rect x="0" y={y} width={maxW} height={barH} rx={barH / 2} fill={`${col}18`} transform="translate(78,0)" />
// //             <rect x="0" y={y} width={w} height={barH} rx={barH / 2} fill={col} opacity="0.8" transform="translate(78,0)" />
// //             <text x={maxW + 86} y={y + barH * 0.72} fontSize="8" fill={col} fontFamily="Georgia,serif" fontWeight="700">{score}%</text>
// //           </g>
// //         );
// //       })}
// //     </svg>
// //   );
// // }

// // function SuppBar({ level }) {
// //   const w = (level / 10) * 100;
// //   return (
// //     <svg viewBox="0 0 200 28" xmlns="http://www.w3.org/2000/svg" style={{ width: 200, height: 28 }}>
// //       <rect x="0" y="8" width="170" height="12" rx="6" fill={`${T.rose}25`} />
// //       <rect x="0" y="8" width={w * 1.7} height="12" rx="6" fill={T.rose} opacity="0.7" />
// //       <text x="178" y="18" fontSize="9" fill={T.rose} fontFamily="Georgia,serif" fontWeight="700">{level}/10</text>
// //     </svg>
// //   );
// // }

// // // ── Utility ────────────────────────────────────────────────────────────────────

// // function parseSections(text) {
// //   return (text || "").split(/^## /m).filter(Boolean).map(p => {
// //     const nl = p.indexOf("\n");
// //     return {
// //       heading: p.slice(0, nl).trim().replace(/^\d+\.\s*/, ""),
// //       body: p.slice(nl + 1).trim(),
// //     };
// //   });
// // }

// // function AnimBlock({ children, delay = 0, style = {} }) {
// //   const ref = useRef();
// //   const [vis, setVis] = useState(false);
// //   useEffect(() => {
// //     const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
// //     if (ref.current) obs.observe(ref.current);
// //     return () => obs.disconnect();
// //   }, []);
// //   return (
// //     <div ref={ref} style={{
// //       opacity: vis ? 1 : 0,
// //       transform: vis ? "none" : "translateY(24px)",
// //       transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
// //       ...style,
// //     }}>
// //       {children}
// //     </div>
// //   );
// // }

// // function SectionCard({ heading, body, accent, lightBg, icon, figure, reversed = false }) {
// //   return (
// //     <AnimBlock style={{ marginBottom: "2.5rem" }}>
// //       <div style={{
// //         background: T.white, borderRadius: 28,
// //         border: `1px solid ${accent}20`,
// //         boxShadow: `0 4px 40px ${accent}10`,
// //         overflow: "hidden",
// //       }}>
// //         {/* heading bar */}
// //         <div style={{
// //           background: lightBg,
// //           borderBottom: `1px solid ${accent}20`,
// //           padding: "1.5rem 2.25rem",
// //           display: "flex", alignItems: "center", gap: "0.75rem",
// //         }}>
// //           <div style={{
// //             width: 42, height: 42, borderRadius: 12,
// //             background: `${accent}20`,
// //             display: "flex", alignItems: "center", justifyContent: "center",
// //             fontSize: "1.3rem", flexShrink: 0,
// //           }}>{icon}</div>
// //           <h2 style={{
// //             fontFamily: "'Playfair Display',Georgia,serif",
// //             fontSize: "1.35rem", fontWeight: 700,
// //             color: T.ink, margin: 0,
// //           }}>{heading}</h2>
// //           <div style={{
// //             marginLeft: "auto", width: 36, height: 4, borderRadius: 2,
// //             background: `linear-gradient(90deg,${accent},${accent}55)`,
// //           }} />
// //         </div>
// //         {/* content */}
// //         <div style={{
// //           display: "grid",
// //           gridTemplateColumns: figure ? (reversed ? "auto 1fr" : "1fr auto") : "1fr",
// //           gap: "2rem", padding: "2rem 2.25rem", alignItems: "center",
// //         }}>
// //           {!reversed && <BodyText text={body} accent={accent} />}
// //           {figure && (
// //             <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
// //               {figure}
// //             </div>
// //           )}
// //           {reversed && <BodyText text={body} accent={accent} />}
// //         </div>
// //       </div>
// //     </AnimBlock>
// //   );
// // }

// // function BodyText({ text, accent }) {
// //   const paras = (text || "").split(/\n\n+/).filter(Boolean);
// //   return (
// //     <div>
// //       {paras.map((p, i) => {
// //         const clean = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");
// //         return (
// //           <p key={i} style={{
// //             fontSize: "0.94rem", lineHeight: 1.85,
// //             color: T.inkMid, margin: "0 0 1rem",
// //             fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
// //           }} dangerouslySetInnerHTML={{ __html: clean }} />
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // function CareerMatchGrid({ careers, moderate }) {
// //   const colors = [T.teal, T.sky, T.purple, T.gold, T.rose];
// //   return (
// //     <AnimBlock style={{ marginBottom: "2.5rem" }}>
// //       <div style={{ background: T.white, borderRadius: 28, border: `1px solid ${T.sky}20`, boxShadow: `0 4px 40px ${T.sky}10`, overflow: "hidden" }}>
// //         <div style={{ background: T.skyLight, borderBottom: `1px solid ${T.sky}20`, padding: "1.5rem 2.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
// //           <div style={{ width: 42, height: 42, borderRadius: 12, background: `${T.sky}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🎯</div>
// //           <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.35rem", fontWeight: 700, color: T.ink, margin: 0 }}>Careers Suggested to You</h2>
// //         </div>
// //         <div style={{ padding: "2rem 2.25rem" }}>
// //           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
// //             {(careers || []).map((c, i) => (
// //               <div key={i} style={{
// //                 borderRadius: 20, overflow: "hidden",
// //                 boxShadow: `0 4px 20px ${colors[i % 5]}18`,
// //                 border: `1.5px solid ${colors[i % 5]}30`,
// //               }}>
// //                 <div style={{ background: `linear-gradient(135deg,${colors[i % 5]},${colors[i % 5]}99)`, padding: "1.25rem 1.5rem" }}>
// //                   <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>
// //                     {c.domain || "Career"}
// //                   </div>
// //                   <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontWeight: 700, color: "white", lineHeight: 1.25, marginBottom: 8 }}>
// //                     {c.name}
// //                   </div>
// //                   <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", fontFamily: "Georgia,serif" }}>
// //                     {c.score}<span style={{ fontSize: "0.75rem", opacity: 0.7 }}>%</span>
// //                   </div>
// //                 </div>
// //                 <div style={{ background: T.white, padding: "1rem 1.5rem" }}>
// //                   <p style={{ fontSize: "0.8rem", color: T.inkLight, lineHeight: 1.65, margin: 0 }}>{c.society_role || ""}</p>
// //                   {c.emerging && (
// //                     <span style={{ display: "inline-block", marginTop: 8, fontSize: "0.62rem", fontWeight: 800, background: T.skyLight, color: T.sky, borderRadius: 999, padding: "0.2rem 0.6rem", letterSpacing: "0.1em" }}>✨ EMERGING</span>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           {moderate?.length > 0 && (
// //             <div>
// //               <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: T.inkLight, marginBottom: "0.85rem" }}>Also Worth Exploring</div>
// //               <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
// //                 {moderate.map((c, i) => (
// //                   <div key={i} style={{
// //                     background: T.purpleLight, borderRadius: 999,
// //                     padding: "0.35rem 1rem", fontSize: "0.8rem",
// //                     fontWeight: 600, color: T.purple,
// //                     border: `1px solid ${T.purple}30`,
// //                   }}>
// //                     {c.name} <span style={{ opacity: 0.6 }}>{c.score}%</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </AnimBlock>
// //   );
// // }

// // function RoadmapSection({ body, careers, accent }) {
// //   return (
// //     <AnimBlock style={{ marginBottom: "2.5rem" }}>
// //       <div style={{ background: T.white, borderRadius: 28, border: `1px solid ${accent}20`, boxShadow: `0 4px 40px ${accent}10`, overflow: "hidden" }}>
// //         <div style={{ background: T.purpleLight, borderBottom: `1px solid ${accent}20`, padding: "1.5rem 2.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
// //           <div style={{ width: 42, height: 42, borderRadius: 12, background: `${accent}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem" }}>🗺️</div>
// //           <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "1.35rem", fontWeight: 700, color: T.ink, margin: 0 }}>Career Roadmap</h2>
// //         </div>
// //         <div style={{ padding: "2rem 2.25rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "start" }}>
// //           <BodyText text={body} accent={accent} />
// //           <div style={{ flexShrink: 0 }}>
// //             <CareerMindmap careers={careers} />
// //           </div>
// //         </div>
// //       </div>
// //     </AnimBlock>
// //   );
// // }

// // function LoadingScreen() {
// //   return (
// //     <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.ink},#1A3A4A)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, fontFamily: "'Playfair Display',Georgia,serif" }}>
// //       <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
// //       <div style={{ fontSize: "3.5rem", animation: "bob 2s ease infinite" }}>✦</div>
// //       <div style={{ fontSize: "1.6rem", fontWeight: 700, color: T.white }}>Composing Your Report</div>
// //       <div style={{ display: "flex", gap: 8 }}>
// //         {[T.tealMid, T.gold, T.sky].map((c, i) => (
// //           <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, animation: `bob 1.2s ease ${i * 0.2}s infinite` }} />
// //         ))}
// //       </div>
// //       <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", fontFamily: "system-ui" }}>This takes about 20 seconds…</p>
// //     </div>
// //   );
// // }

// // // ── Main Page ─────────────────────────────────────────────────────────────────

// // export default function ReportPage() {
// //   const router = useRouter();
// //   const sp = useSearchParams();
// //   const uid = sp.get("uid");
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [dl, setDl] = useState(false);

// //   const fetchReport = useCallback((force = false) => {
// //     if (!uid) { router.push("/login"); return; }
// //     setLoading(true); setError(null);
// //     fetch(`http://localhost:5000/api/report/${uid}${force ? "?force=true" : ""}`)
// //       .then(r => { if (!r.ok) throw new Error("Failed to generate report"); return r.json(); })
// //       .then(d => { setData(d); setLoading(false); })
// //       .catch(e => { setError(e.message); setLoading(false); });
// //   }, [uid]);

// //   useEffect(() => { fetchReport(); }, [fetchReport]);

// //   const downloadPDF = async () => {
// //     try {
// //       setDl(true);
// //       const res = await fetch(`http://localhost:5000/api/report/${uid}/pdf`);
// //       if (!res.ok) throw new Error("PDF generation failed");
// //       const blob = await res.blob();
// //       const a = document.createElement("a");
// //       a.href = URL.createObjectURL(blob);
// //       a.download = "wdig-report.pdf"; a.click();
// //     } catch (e) { alert(e.message); } finally { setDl(false); }
// //   };

// //   if (loading) return <LoadingScreen />;
// //   if (error) return (
// //     <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${T.ink},#1A3A4A)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
// //       <div style={{ textAlign: "center", color: "white" }}>
// //         <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚠️</div>
// //         <div style={{ fontWeight: 700, marginBottom: 12 }}>{error}</div>
// //         <button onClick={() => fetchReport()} style={{ padding: "0.7rem 1.5rem", background: T.teal, color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 600 }}>Try Again</button>
// //       </div>
// //     </div>
// //   );
// //   if (!data) return null;

// //   const sections = parseSections(data.report || "");
// //   const dims = data.dimension_scores || {};
// //   const traits = data.dominant_traits || [];
// //   const careers = data.top_careers || [];
// //   const moderate = data.moderate_careers || [];
// //   const supp = data.suppression || {};

// //   // Map sections to their content
// //   const secMap = {};
// //   sections.forEach(s => { secMap[s.heading.toLowerCase().replace(/[^a-z]/g, "")] = s; });
// //   const find = (...keys) => sections.find(s => keys.some(k => s.heading.toLowerCase().includes(k))) || { heading: "", body: "" };

// //   const whoSec      = find("who you are", "who");
// //   const holdSec     = find("holding", "back");
// //   const worldSec    = find("offer", "world");
// //   const careerSec   = find("careers suggested", "career match");
// //   const roadSec     = find("roadmap");
// //   const eduSec      = find("educational", "pathway");
// //   const skillSec    = find("skillset", "skill");
// //   const conclusionSec = find("conclusion", "closing");

// //   return (
// //     <>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
// //         *{box-sizing:border-box;margin:0;padding:0}
// //         body{background:${T.cream}}
// //         @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
// //         @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
// //         ::-webkit-scrollbar{width:5px}
// //         ::-webkit-scrollbar-thumb{background:${T.teal}55;border-radius:99px}
// //       `}</style>

// //       <div style={{ fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", background: T.cream, minHeight: "100vh", color: T.ink }}>

// //         {/* ── HERO ── */}
// //         <div style={{
// //           background: `linear-gradient(160deg,${T.ink} 0%,#0D2E3A 50%,#1A3A4A 100%)`,
// //           padding: "0 0 0", position: "relative", overflow: "hidden",
// //         }}>
// //           {/* Large decorative circles */}
// //           {[["-80px", "auto", "-80px", "auto", 400, 400, T.teal, 0.07],
// //             ["auto", "-60px", "auto", "-60px", 300, 300, T.gold, 0.06],
// //             ["30%", "auto", "auto", "20%", 250, 250, T.sky, 0.05]
// //           ].map(([t, b, r, l, w, h, col, op], i) => (
// //             <div key={i} style={{ position: "absolute", top: t, bottom: b, right: r, left: l, width: w, height: h, borderRadius: "50%", background: `radial-gradient(circle,${col}${Math.round(op * 255).toString(16).padStart(2, "0")},transparent 65%)`, pointerEvents: "none" }} />
// //           ))}
// //           {/* Floating dots */}
// //           {[...Array(8)].map((_, i) => (
// //             <div key={i} style={{ position: "absolute", borderRadius: "50%", width: [5, 8, 4, 6, 7, 5, 6, 4][i], height: [5, 8, 4, 6, 7, 5, 6, 4][i], background: [T.tealMid, T.gold, T.sky, T.tealMid, T.gold, T.sky, T.tealMid, T.gold][i], opacity: 0.4, top: [`10%`, `62%`, `22%`, `75%`, `38%`, `15%`, `50%`, `85%`][i], left: [`7%`, `16%`, `70%`, `80%`, `45%`, `85%`, `28%`, `55%`][i], animation: `bob ${[2.2, 2.8, 2, 3, 2.5, 1.9, 2.6, 2.3][i]}s ease ${[0, .3, .6, .1, .5, .8, .2, .4][i]}s infinite` }} />
// //           ))}

// //           <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 0", position: "relative" }}>
// //             {/* Nav bar */}
// //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", flexWrap: "wrap", gap: 10 }}>
// //               <button onClick={() => router.push("/results")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", padding: "0.45rem 1rem", borderRadius: 10, cursor: "pointer", fontSize: "0.8rem", fontFamily: "system-ui" }}>← Results</button>
// //               <div style={{ display: "flex", gap: 8 }}>
// //                 <button onClick={() => fetchReport(true)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)", padding: "0.45rem 0.9rem", borderRadius: 10, cursor: "pointer", fontSize: "0.8rem" }}>↺ Regenerate</button>
// //                 <button onClick={downloadPDF} disabled={dl} style={{ background: `linear-gradient(135deg,${T.teal},${T.tealMid})`, border: "none", color: "white", padding: "0.45rem 1.25rem", borderRadius: 10, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700, opacity: dl ? 0.6 : 1 }}>
// //                   {dl ? "…" : "⬇ PDF"}
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Hero text */}
// //             <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "end" }}>
// //               <div>
// //                 <div style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", color: T.tealMid, marginBottom: "0.9rem", opacity: 0.9 }}>Aptitude Report</div>
// //                 <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.2rem,5.5vw,3.6rem)", fontWeight: 800, color: "white", lineHeight: 1.05, marginBottom: "1rem" }}>
// //                   {data.thinking_style_primary}
// //                 </h1>
// //                 {data.thinking_style_secondary && (
// //                   <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "0.4rem 1.1rem", marginBottom: "1.5rem" }}>
// //                     <span style={{ fontSize: "0.6rem", fontWeight: 800, color: T.tealMid, letterSpacing: "0.12em", textTransform: "uppercase" }}>Also</span>
// //                     <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{data.thinking_style_secondary}</span>
// //                   </div>
// //                 )}
// //                 {careers.length > 0 && (
// //                   <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "0.5rem" }}>
// //                     {careers.slice(0, 3).map((c, i) => (
// //                       <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${[T.tealMid, T.gold, T.sky][i]}44`, borderRadius: 999, padding: "0.35rem 1rem", fontSize: "0.74rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 6 }}>
// //                         <span style={{ color: [T.tealMid, T.gold, T.sky][i] }}>{"⭐🌟✨"[i]}</span>
// //                         {c.name}<span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem" }}>{c.score}%</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //               <div style={{ flexShrink: 0, opacity: 0.85 }}>
// //                 <BrainFigure />
// //               </div>
// //             </div>

// //             {/* Stats ribbon */}
// //             <div style={{ display: "flex", gap: 0, marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
// //               {[
// //                 { label: "Thinking Style", value: data.thinking_style_primary?.split(" ").slice(0, 2).join(" ") || "—" },
// //                 { label: "Top Career", value: careers[0]?.name || "—" },
// //                 { label: "Dimensions Analysed", value: `${Object.keys(dims).length}` },
// //                 { label: "Trait Match", value: `${careers[0]?.score || "—"}%` },
// //               ].map(({ label, value }, i) => (
// //                 <div key={i} style={{ flex: 1, padding: "1.25rem 1.5rem", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
// //                   <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "0.35rem" }}>{label}</div>
// //                   <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "rgba(255,255,255,0.82)", fontFamily: "'Playfair Display',serif" }}>{value}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* ── BODY ── */}
// //         <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 2rem 6rem" }}>

// //           {/* Dimension radar + trait bars side by side */}
// //           {(Object.keys(dims).length > 0 || traits.length > 0) && (
// //             <AnimBlock style={{ marginBottom: "2.5rem" }}>
// //               <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", background: T.white, borderRadius: 28, padding: "2rem 2.25rem", border: `1px solid ${T.teal}20`, boxShadow: `0 4px 40px ${T.teal}08` }}>
// //                 <div style={{ textAlign: "center" }}>
// //                   <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkLight, marginBottom: "0.5rem" }}>Dimension Profile</div>
// //                   <DimRadar scores={dims} />
// //                 </div>
// //                 <div>
// //                   <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkLight, marginBottom: "0.75rem" }}>Dominant Traits</div>
// //                   <TraitRadialBar traits={traits} />
// //                   {supp.has_suppression && (
// //                     <div style={{ marginTop: "1.25rem" }}>
// //                       <div style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.rose, marginBottom: "0.4rem" }}>Suppression Signal</div>
// //                       <SuppBar level={supp.suppression_level || 0} />
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </AnimBlock>
// //           )}

// //           {/* Section cards */}
// //           {whoSec.body && (
// //             <SectionCard heading={whoSec.heading || "Who You Are"} body={whoSec.body} accent={T.teal} lightBg={T.tealLight} icon="🧬" figure={<BrainFigure />} />
// //           )}

// //           {holdSec.body && (
// //             <SectionCard heading={holdSec.heading || "What's Holding You Back"} body={holdSec.body} accent={T.rose} lightBg={T.roseLight} icon="🔓" reversed />
// //           )}

// //           {worldSec.body && (
// //             <SectionCard heading={worldSec.heading || "What You Offer the World"} body={worldSec.body} accent={T.gold} lightBg={T.goldLight} icon="🌍" />
// //           )}

// //           {/* Career grid (special component) */}
// //           <CareerMatchGrid careers={careers} moderate={moderate} />

// //           {/* Roadmap with mindmap */}
// //           {roadSec.body && <RoadmapSection body={roadSec.body} careers={careers} accent={T.purple} />}

// //           {/* Education */}
// //           {eduSec.body && (
// //             <SectionCard heading={eduSec.heading || "Educational Pathway"} body={eduSec.body} accent={T.teal} lightBg={T.tealLight} icon="🎓" />
// //           )}

// //           {/* Skillset */}
// //           {skillSec.body && (
// //             <SectionCard heading={skillSec.heading || "Skillset to Build"} body={skillSec.body} accent={T.gold} lightBg={T.goldLight} icon="⚡" reversed />
// //           )}

// //           {/* Conclusion */}
// //           {conclusionSec.body && (
// //             <AnimBlock style={{ marginBottom: "2.5rem" }}>
// //               <div style={{
// //                 background: `linear-gradient(160deg,${T.ink} 0%,#0D2E3A 60%,#1A3A4A 100%)`,
// //                 borderRadius: 28, padding: "3rem 2.5rem",
// //                 position: "relative", overflow: "hidden",
// //                 textAlign: "center",
// //               }}>
// //                 <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 25% 60%,${T.teal}15,transparent 50%),radial-gradient(circle at 75% 25%,${T.gold}12,transparent 45%)`, pointerEvents: "none" }} />
// //                 <div style={{ fontSize: "2.5rem", marginBottom: "1.25rem", animation: "bob 3s ease infinite", display: "block", position: "relative" }}>✦</div>
// //                 <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: T.tealMid, marginBottom: "1.25rem", position: "relative" }}>Conclusion</div>
// //                 <div style={{ position: "relative", maxWidth: "58ch", margin: "0 auto" }}>
// //                   {(conclusionSec.body || "").split(/\n\n+/).filter(Boolean).map((p, i) => (
// //                     <p key={i} style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontStyle: "italic", color: "rgba(255,255,255,0.88)", lineHeight: 1.9, marginBottom: "1rem" }}>{p}</p>
// //                   ))}
// //                 </div>
// //                 <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "2rem", flexWrap: "wrap", position: "relative" }}>
// //                   <button onClick={downloadPDF} disabled={dl} style={{ background: `linear-gradient(135deg,${T.tealMid},${T.gold})`, border: "none", color: T.ink, padding: "0.85rem 2rem", borderRadius: 14, cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", opacity: dl ? 0.6 : 1 }}>
// //                     {dl ? "Generating…" : "⬇ Download PDF"}
// //                   </button>
// //                   <button onClick={() => router.push("/results")} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", padding: "0.85rem 2rem", borderRadius: 14, cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
// //                     ← Back to Results
// //                   </button>
// //                 </div>
// //               </div>
// //             </AnimBlock>
// //           )}

// //         </div>
// //       </div>
// //     </>
// //   );
// // }


// "use client";
// import { useState, useEffect, useRef, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const T = {
//   ink:"#0D1B2A",inkMid:"#2C3E50",inkLight:"#5D7A8A",
//   teal:"#0A7B6B",tealLight:"#E8F8F5",tealMid:"#14B89A",
//   gold:"#C9962B",goldLight:"#FEF9EC",
//   rose:"#C0445A",roseLight:"#FDF0F2",
//   sky:"#1A6B9A",skyLight:"#EDF5FB",
//   purple:"#5B3FA0",purpleLight:"#F3EFFD",
//   cream:"#FAFAF8",white:"#FFFFFF",
// };
// const CAREER_COLORS=["#0A7B6B","#1A6B9A","#5B3FA0","#C9962B","#C0445A"];
// const ROAD_COLORS=["#8CC63F","#00A88A","#1A6B9A","#0D1B2A"];

// function parseSections(text){
//   return(text||"").split(/^## /m).filter(Boolean).map(p=>{
//     const nl=p.indexOf("\n");
//     return{heading:p.slice(0,nl).trim().replace(/^\d+\.\s*/,""),body:p.slice(nl+1).trim()};
//   });
// }
// function findSec(sections,...keys){
//   return sections.find(s=>keys.some(k=>s.heading.toLowerCase().includes(k)))||{heading:"",body:""};
// }

// function Reveal({children,delay=0,style={}}){
//   const ref=useRef();const[vis,setVis]=useState(false);
//   useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.07});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
//   return<div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":"translateY(28px)",transition:`opacity .65s ease ${delay}s,transform .65s cubic-bezier(.16,1,.3,1) ${delay}s`,...style}}>{children}</div>;
// }

// function SectionHeader({title,icon,accent,lightBg}){
//   return(
//     <div style={{background:lightBg,padding:"1.4rem 2rem",display:"flex",alignItems:"center",gap:"0.85rem",borderBottom:`1px solid ${accent}18`}}>
//       <div style={{width:40,height:40,borderRadius:12,background:`${accent}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{icon}</div>
//       <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.3rem",fontWeight:700,color:T.ink,margin:0}}>{title}</h2>
//       <div style={{marginLeft:"auto",width:38,height:4,borderRadius:2,background:`linear-gradient(90deg,${accent},${accent}44)`}}/>
//     </div>
//   );
// }

// function BodyText({text,accent}){
//   const paras=(text||"").split(/\n\n+/).filter(Boolean);
//   return(
//     <div style={{padding:"1.5rem 2rem"}}>
//       {paras.map((p,i)=>{
//         const html=p.replace(/\*\*(.+?)\*\*/g,`<strong style="color:${accent}">$1</strong>`).replace(/\*(.+?)\*/g,"<em>$1</em>");
//         return<p key={i} style={{fontSize:"0.94rem",lineHeight:1.85,color:T.inkMid,margin:"0 0 0.9rem",fontFamily:"'Plus Jakarta Sans',system-ui"}} dangerouslySetInnerHTML={{__html:html}}/>;
//       })}
//     </div>
//   );
// }

// function PullQuote({text,accent}){
//   const first=(text||"").split(/\n\n/)[0].replace(/\*\*/g,"").trim().slice(0,220);
//   return(
//     <div style={{margin:"0 2rem",padding:"1.2rem 1.5rem",background:`${accent}0a`,borderLeft:`4px solid ${accent}`,borderRadius:"0 12px 12px 0",marginTop:"0.25rem"}}>
//       <p style={{fontSize:"0.96rem",lineHeight:1.8,fontStyle:"italic",color:T.inkMid,margin:0}}>{first}</p>
//     </div>
//   );
// }

// function StatChips({items,accent}){
//   return(
//     <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",padding:"0 2rem 1.5rem"}}>
//       {items.map((item,i)=>(
//         <div key={i} style={{background:`${accent}10`,border:`1px solid ${accent}28`,borderRadius:999,padding:"0.35rem 0.9rem",fontSize:"0.8rem",fontWeight:600,color:accent}}>{item}</div>
//       ))}
//     </div>
//   );
// }

// function RadarChart({scores,size=150}){
//   const[anim,setAnim]=useState(false);
//   useEffect(()=>{const t=setTimeout(()=>setAnim(true),300);return()=>clearTimeout(t);},[]);
//   const items=Object.entries(scores||{});const n=items.length;
//   if(!n)return null;
//   const cx=size/2,cy=size/2,R=size*0.37;
//   const pt=(i,frac)=>{const a=(Math.PI*2*i/n)-Math.PI/2;return[cx+frac*R*Math.cos(a),cy+frac*R*Math.sin(a)];};
//   const polyPts=(frac)=>items.map((_,i)=>pt(i,frac).join(",")).join(" ");
//   const dataPts=items.map(([,v],i)=>pt(i,anim?v/100:0));
//   const dataPath=dataPts.map((p,i)=>(i===0?`M${p}`:`L${p}`)).join(" ")+"Z";
//   const ICONS={cognitive:"🧠",personality:"⚙️",motivational:"🔥",social:"🤝",suppression:"🔓",contribution:"🌍"};
//   return(
//     <svg width={size} height={size} style={{overflow:"visible"}}>
//       {[.25,.5,.75,1].map(l=><polygon key={l} points={polyPts(l)} fill="none" stroke={T.teal} strokeWidth=".5" opacity=".2"/>)}
//       {items.map((_,i)=>{const[ex,ey]=pt(i,1);return<line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke={T.teal} strokeWidth=".5" opacity=".15"/>;})}
//       <path d={dataPath} fill={T.teal} fillOpacity=".18" stroke={T.teal} strokeWidth="1.5" style={{transition:"all 1.4s cubic-bezier(.16,1,.3,1)"}}/>
//       {dataPts.map(([px,py],i)=><circle key={i} cx={px} cy={py} r="3.5" fill={T.teal} style={{transition:"all 1.4s cubic-bezier(.16,1,.3,1)"}}/>)}
//       {items.map(([dim],i)=>{const[lx,ly]=pt(i,1.3);return<text key={i} x={lx} y={ly+3} textAnchor="middle" fontSize="7.5" fill={T.inkMid} fontFamily="system-ui">{ICONS[dim]||"•"} {dim.slice(0,4)}</text>;})}
//     </svg>
//   );
// }

// function TraitBar({label,score,color,index}){
//   const[w,setW]=useState(0);
//   useEffect(()=>{const t=setTimeout(()=>setW(score),200+index*70);return()=>clearTimeout(t);},[score,index]);
//   return(
//     <div style={{marginBottom:"0.7rem"}}>
//       <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.22rem"}}>
//         <span style={{fontSize:"0.78rem",fontWeight:600,color:T.inkMid}}>{label}</span>
//         <span style={{fontSize:"0.78rem",fontWeight:700,color}}>{score}%</span>
//       </div>
//       <div style={{height:8,background:`${color}18`,borderRadius:999,overflow:"hidden"}}>
//         <div style={{height:"100%",width:`${w}%`,borderRadius:999,background:`linear-gradient(90deg,${color},${color}99)`,boxShadow:`0 0 8px ${color}44`,transition:`width 1.1s cubic-bezier(.16,1,.3,1) ${index*50}ms`}}/>
//       </div>
//     </div>
//   );
// }

// function CareerCard({career,rank}){
//   const[hov,setHov]=useState(false);
//   const col=CAREER_COLORS[rank%CAREER_COLORS.length];
//   const badges=["🥇","🥈","🥉","4️⃣","5️⃣"];
//   return(
//     <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
//       style={{borderRadius:22,overflow:"hidden",cursor:"default",boxShadow:hov?`0 20px 50px ${col}28`:`0 4px 20px ${col}12`,border:`1.5px solid ${col}28`,transform:hov?"translateY(-5px)":"none",transition:"all .3s cubic-bezier(.16,1,.3,1)"}}>
//       <div style={{background:`linear-gradient(135deg,${col},${col}99)`,padding:"1.25rem 1.5rem",position:"relative"}}>
//         <div style={{position:"absolute",top:10,right:14,fontSize:"1.4rem"}}>{badges[rank]}</div>
//         <div style={{fontSize:"0.58rem",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)",marginBottom:5}}>{career.domain}</div>
//         <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700,color:"white",lineHeight:1.2,marginBottom:8,paddingRight:30}}>{career.name}</div>
//         <div style={{fontSize:"1.6rem",fontWeight:800,color:"white",fontFamily:"Georgia,serif"}}>{career.score}<span style={{fontSize:"0.7rem",opacity:0.65}}>%</span></div>
//       </div>
//       <div style={{background:T.white,padding:"1rem 1.5rem"}}>
//         <p style={{fontSize:"0.78rem",color:T.inkLight,lineHeight:1.65,margin:0}}>{career.society_role}</p>
//         {career.emerging&&<span style={{display:"inline-block",marginTop:8,fontSize:"0.6rem",fontWeight:800,background:T.skyLight,color:T.sky,borderRadius:999,padding:"0.2rem 0.6rem",letterSpacing:"0.1em"}}>✨ EMERGING</span>}
//       </div>
//     </div>
//   );
// }

// // ── ROADMAP INFOGRAPHIC ────────────────────────────────────────────────────────
// function RoadmapInfographic({careers}){
//   const steps=(careers||[]).slice(0,4);
//   const[animated,setAnimated]=useState(false);
//   const ref=useRef();
//   useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setAnimated(true)},{threshold:0.2});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
//   if(!steps.length)return null;

//   const totalW=700,stepW=totalW/steps.length,risePerStep=22,roadY=95,laneH=26;

//   return(
//     <div ref={ref} style={{background:T.white,padding:"0.25rem 0 0"}}>
//       <svg viewBox={`0 0 ${totalW} 230`} style={{width:"100%",height:"auto",overflow:"visible"}}>
//         {steps.map((step,i)=>{
//           const col=ROAD_COLORS[i%ROAD_COLORS.length];
//           const x0=i*stepW,x1=(i+1)*stepW;
//           const y0=roadY-i*risePerStep,y1=roadY-(i+1)*risePerStep;
//           const pts=`${x0},${y0-laneH/2} ${x1},${y1-laneH/2} ${x1},${y1+laneH/2} ${x0},${y0+laneH/2}`;
//           const midX=(x0+x1)/2,midY=(y0+y1)/2;
//           const poleBase=midY-laneH/2;
//           const poleTop=poleBase-38;
//           const flagTop=poleTop,flagBot=poleTop+18,flagTip=midX+22;
//           // dashes
//           const segLen=Math.sqrt((x1-x0)**2+(y1-y0)**2);
//           const nd=Math.floor(segLen/22);
//           const ddx=(x1-x0)/nd,ddy=(y1-y0)/nd;
//           return(
//             <g key={i}>
//               <polygon points={pts} fill="#CBD5DC"/>
//               {[...Array(nd-1)].map((_,d)=>(
//                 <line key={d} x1={x0+d*ddx+ddx*0.25} y1={y0+d*ddy} x2={x0+d*ddx+ddx*0.65} y2={y0+d*ddy+ddy*0.4} stroke="white" strokeWidth="2.5"/>
//               ))}
//               {/* pole */}
//               <line x1={midX} y1={poleBase} x2={midX} y2={poleTop+6} stroke={col} strokeWidth="1.5" strokeDasharray="3 2" opacity=".8"/>
//               {/* flag */}
//               <polygon points={`${midX},${flagTop} ${flagTip},${(flagTop+flagBot)/2} ${midX},${flagBot}`} fill={col}
//                 style={{transform:animated?"scaleX(1)":"scaleX(0)",transformOrigin:`${midX}px ${(flagTop+flagBot)/2}px`,transition:`transform 0.45s cubic-bezier(.34,1.56,.64,1) ${i*0.15+0.3}s`}}/>
//               {/* step number */}
//               <text x={midX-14} y={poleTop-6} fontFamily="Georgia,serif" fontWeight="800" fontSize="18" fill={col}
//                 opacity={animated?1:0} style={{transition:`opacity 0.3s ease ${i*0.15+0.55}s`}}>0{i+1}</text>
//             </g>
//           );
//         })}
//         {/* labels below road */}
//         {steps.map((step,i)=>{
//           const x=i*stepW+10;const col=ROAD_COLORS[i%ROAD_COLORS.length];
//           const labelY=roadY+36;
//           return(
//             <g key={`lbl${i}`} style={{opacity:animated?1:0,transition:`opacity 0.5s ease ${i*0.12+0.65}s`}}>
//               <text x={x} y={labelY} fontFamily="system-ui" fontWeight="700" fontSize="10" fill={T.ink}>{(step.name||"").slice(0,24)}</text>
//               <text x={x} y={labelY+13} fontFamily="system-ui" fontSize="9" fill={col}>{step.score}% match</text>
//             </g>
//           );
//         })}
//       </svg>

//       {/* Step detail cards */}
//       <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(steps.length,4)},1fr)`,gap:"0.75rem",padding:"0 1.5rem 1.5rem"}}>
//         {steps.map((step,i)=>{
//           const col=ROAD_COLORS[i%ROAD_COLORS.length];
//           return(
//             <div key={i} style={{background:`${col}09`,borderRadius:14,padding:"0.85rem 1rem",borderTop:`3px solid ${col}`,opacity:animated?1:0,transform:animated?"none":"translateY(10px)",transition:`all 0.5s ease ${i*0.1+0.7}s`}}>
//               <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:col,marginBottom:"0.3rem"}}>Path {i+1}</div>
//               <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.88rem",fontWeight:700,color:T.ink,marginBottom:"0.25rem"}}>{step.name}</div>
//               {step.stream?.length>0&&<div style={{fontSize:"0.72rem",color:T.inkLight}}>via {step.stream.slice(0,2).join(" · ")}</div>}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function SuppressionBand({supp}){
//   if(!supp?.has_suppression)return null;
//   return(
//     <Reveal>
//       <div style={{background:"linear-gradient(135deg,#fff7ed,#fdf0f2)",border:"1px solid #fcd34d",borderRadius:20,padding:"1.5rem 2rem",marginBottom:"1.75rem"}}>
//         <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
//           <span style={{fontSize:"1.5rem"}}>🔍</span>
//           <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#92400e"}}>Patterns Detected in Your Responses</div>
//         </div>
//         <div style={{display:"flex",flexWrap:"wrap",gap:"1.5rem",alignItems:"center"}}>
//           {supp.insights?.slice(0,2).map((insight,i)=>(
//             <p key={i} style={{fontSize:"0.88rem",lineHeight:1.75,color:"#78350f",margin:0,flex:1,minWidth:200}}>{insight}</p>
//           ))}
//           <div style={{display:"flex",gap:"1rem",flexShrink:0}}>
//             {[{l:"Suppression",v:supp.suppression_level},{l:"Fear-driven",v:supp.fear_level}]
//               .filter(x=>x.v!==undefined)
//               .map(({l,v})=>(
//                 <div key={l} style={{textAlign:"center"}}>
//                   <div style={{fontSize:"1.3rem",fontWeight:800,color:T.rose}}>{v}%</div>
//                   <div style={{fontSize:"0.65rem",color:"#b45309",textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </div>
//     </Reveal>
//   );
// }

// function SectionTransition({from,to}){
//   return(
//     <div style={{display:"flex",alignItems:"center",gap:"1rem",margin:"0.25rem 0 1.5rem",opacity:0.5}}>
//       <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${from}44,transparent)`}}/>
//       <div style={{width:7,height:7,borderRadius:"50%",background:to,flexShrink:0}}/>
//       <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${to}44,transparent)`}}/>
//     </div>
//   );
// }

// function LoadingScreen(){
//   return(
//     <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${T.ink},#0D2E3A)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,fontFamily:"'Playfair Display',Georgia,serif"}}>
//       <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
//       <div style={{fontSize:"3.5rem",animation:"bob 2s ease infinite"}}>✦</div>
//       <div style={{fontSize:"1.6rem",fontWeight:700,color:T.white}}>Composing Your Report</div>
//       <div style={{display:"flex",gap:8}}>{[T.tealMid,T.gold,T.sky].map((col,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:col,animation:`bob 1.2s ease ${i*.2}s infinite`}}/>)}</div>
//       <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",fontFamily:"system-ui"}}>Takes about 20 seconds…</p>
//     </div>
//   );
// }

// export default function ReportPage(){
//   const router=useRouter();const sp=useSearchParams();const uid=sp.get("uid");
//   const[data,setData]=useState(null);const[loading,setLoading]=useState(true);
//   const[error,setError]=useState(null);const[dl,setDl]=useState(false);

//   const fetchReport=useCallback((force=false)=>{
//     if(!uid){router.push("/login");return;}
//     setLoading(true);setError(null);
//     fetch(`http://localhost:5000/api/report/${uid}${force?"?force=true":""}`)
//       .then(r=>{if(!r.ok)throw new Error("Failed to load report");return r.json();})
//       .then(d=>{setData(d);setLoading(false);})
//       .catch(e=>{setError(e.message);setLoading(false);});
//   },[uid]);

//   useEffect(()=>{fetchReport();},[fetchReport]);

//   const downloadPDF=async()=>{
//     try{setDl(true);const res=await fetch(`http://localhost:5000/api/report/${uid}/pdf`);if(!res.ok)throw new Error("PDF failed");const blob=await res.blob();const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="wdig-report.pdf";a.click();}
//     catch(e){alert(e.message);}finally{setDl(false);}
//   };

//   if(loading)return<LoadingScreen/>;
//   if(error)return(
//     <div style={{minHeight:"100vh",background:T.ink,display:"flex",alignItems:"center",justifyContent:"center"}}>
//       <div style={{textAlign:"center",color:T.white}}>
//         <div style={{fontSize:"3rem",marginBottom:12}}>⚠️</div><p style={{marginBottom:16}}>{error}</p>
//         <button onClick={()=>fetchReport()} style={{padding:"0.7rem 1.5rem",background:T.teal,color:T.white,border:"none",borderRadius:12,cursor:"pointer",fontWeight:600}}>Try Again</button>
//       </div>
//     </div>
//   );
//   if(!data)return null;

//   const sections=parseSections(data.report||"");
//   const dims=data.dimension_scores||{};const traits=data.dominant_traits||[];
//   const careers=data.top_careers||[];const moderate=data.moderate_careers||[];
//   const supp=data.suppression||{};

//   const whoSec=findSec(sections,"who you are","who");
//   const holdSec=findSec(sections,"holding","back");
//   const worldSec=findSec(sections,"offer","world");
//   const careerSec=findSec(sections,"careers suggested","career match");
//   const roadSec=findSec(sections,"roadmap");
//   const eduSec=findSec(sections,"educational","pathway");
//   const skillSec=findSec(sections,"skillset","skill");
//   const concSec=findSec(sections,"conclusion","closing");

//   return(
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
//         *{box-sizing:border-box;margin:0;padding:0}body{background:${T.cream}}
//         @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
//         ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.teal}55;border-radius:99px}
//       `}</style>

//       <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:T.cream,minHeight:"100vh",color:T.ink}}>

//         {/* HERO */}
//         <div style={{background:`linear-gradient(160deg,${T.ink} 0%,#0D2E3A 55%,#1A3A4A 100%)`,position:"relative",overflow:"hidden"}}>
//           {[[-60,"auto",-60,"auto",380,T.teal,.08],["auto",-50,"auto",-50,260,T.gold,.07],["35%","auto","auto","25%",220,T.sky,.06]].map(([t,b,r,l,sz,col,op],i)=>(
//             <div key={i} style={{position:"absolute",top:t,bottom:b,right:r,left:l,width:sz,height:sz,borderRadius:"50%",background:`radial-gradient(circle,${col}${Math.round(op*255).toString(16).padStart(2,"0")},transparent 65%)`,pointerEvents:"none"}}/>
//           ))}
//           {[...Array(7)].map((_,i)=>(
//             <div key={i} style={{position:"absolute",borderRadius:"50%",width:[5,8,4,7,6,5,7][i],height:[5,8,4,7,6,5,7][i],background:[T.tealMid,T.gold,T.sky,T.tealMid,T.gold,T.sky,T.tealMid][i],opacity:.38,top:[`12%`,`62%`,`24%`,`78%`,`40%`,`16%`,`54%`][i],left:[`8%`,`17%`,`72%`,`82%`,`46%`,`87%`,`30%`][i],animation:`bob ${[2.2,2.8,2,3,2.5,1.9,2.6][i]}s ease ${[0,.3,.6,.1,.5,.8,.2][i]}s infinite`}}/>
//           ))}

//           <div style={{maxWidth:920,margin:"0 auto",padding:"2.75rem 2rem 0",position:"relative"}}>
//             <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2.75rem",flexWrap:"wrap",gap:10}}>
//               <button onClick={()=>router.push("/results")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",color:"rgba(255,255,255,0.7)",padding:"0.45rem 1rem",borderRadius:10,cursor:"pointer",fontSize:"0.8rem",fontFamily:"system-ui"}}>← Results</button>
//               <div style={{display:"flex",gap:8}}>
//                 <button onClick={()=>fetchReport(true)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.13)",color:"rgba(255,255,255,0.55)",padding:"0.45rem 0.9rem",borderRadius:10,cursor:"pointer",fontSize:"0.8rem"}}>↺</button>
//                 <button onClick={downloadPDF} disabled={dl} style={{background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",color:T.white,padding:"0.45rem 1.25rem",borderRadius:10,cursor:"pointer",fontSize:"0.82rem",fontWeight:700,opacity:dl?.6:1}}>{dl?"…":"⬇ PDF"}</button>
//               </div>
//             </div>

//             <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"1.5rem",alignItems:"end"}}>
//               <div>
//                 <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.28em",textTransform:"uppercase",color:T.tealMid,marginBottom:"0.85rem",opacity:.9}}>Aptitude Report</div>
//                 <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5.5vw,3.4rem)",fontWeight:800,color:T.white,lineHeight:1.05,marginBottom:"0.9rem"}}>{data.thinking_style_primary}</h1>
//                 {data.thinking_style_secondary&&(
//                   <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:999,padding:"0.4rem 1.1rem",marginBottom:"1.25rem"}}>
//                     <span style={{fontSize:"0.6rem",fontWeight:800,color:T.tealMid,letterSpacing:"0.12em",textTransform:"uppercase"}}>Also</span>
//                     <span style={{fontSize:"0.82rem",fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{data.thinking_style_secondary}</span>
//                   </div>
//                 )}
//                 <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:"0.25rem"}}>
//                   {careers.slice(0,3).map((c,i)=>(
//                     <div key={i} style={{background:"rgba(255,255,255,0.07)",border:`1px solid ${[T.tealMid,T.gold,T.sky][i]}40`,borderRadius:999,padding:"0.35rem 1rem",fontSize:"0.74rem",fontWeight:600,color:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",gap:6}}>
//                       <span style={{color:[T.tealMid,T.gold,T.sky][i]}}>{"⭐🌟✨"[i]}</span>
//                       {c.name}<span style={{color:"rgba(255,255,255,0.32)",fontSize:"0.68rem"}}>{c.score}%</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {Object.keys(dims).length>0&&<div style={{flexShrink:0,opacity:.75}}><RadarChart scores={dims} size={140}/></div>}
//             </div>

//             <div style={{display:"flex",marginTop:"2.5rem",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
//               {[{label:"Thinking Style",value:(data.thinking_style_primary||"—").split(" ").slice(0,3).join(" ")},{label:"Top Career",value:careers[0]?.name||"—"},{label:"Match Score",value:`${careers[0]?.score||"—"}%`},{label:"Dimensions",value:`${Object.keys(dims).length} analysed`}].map(({label,value},i)=>(
//                 <div key={i} style={{flex:1,padding:"1.1rem 1.25rem",borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none"}}>
//                   <div style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.38)",marginBottom:"0.3rem"}}>{label}</div>
//                   <div style={{fontSize:"0.85rem",fontWeight:700,color:"rgba(255,255,255,0.8)",fontFamily:"'Playfair Display',serif"}}>{value}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* BODY */}
//         <div style={{maxWidth:920,margin:"0 auto",padding:"2.75rem 2rem 6rem"}}>

//           {traits.length>0&&(
//             <Reveal>
//               <div style={{background:T.white,borderRadius:24,padding:"1.75rem 2rem",marginBottom:"1.75rem",border:`1px solid ${T.teal}18`,boxShadow:`0 4px 30px ${T.teal}08`}}>
//                 <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:T.inkLight,marginBottom:"1.1rem"}}>Dominant Traits</div>
//                 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"0 2.5rem"}}>
//                   {traits.slice(0,6).map(({label,score},i)=><TraitBar key={label} label={label} score={score} color={CAREER_COLORS[i%CAREER_COLORS.length]} index={i}/>)}
//                 </div>
//               </div>
//             </Reveal>
//           )}

//           <SuppressionBand supp={supp}/>
//           <SectionTransition from={T.teal} to={T.teal}/>

//           {/* WHO */}
//           {whoSec.body&&(
//             <Reveal>
//               <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.teal}18`,marginBottom:"1.75rem",boxShadow:`0 4px 40px ${T.teal}0d`}}>
//                 <SectionHeader title={whoSec.heading||"Who You Are"} icon="🧬" accent={T.teal} lightBg={T.tealLight}/>
//                 <div style={{background:T.white}}>
//                   <PullQuote text={whoSec.body} accent={T.teal}/>
//                   <BodyText text={whoSec.body.split(/\n\n/).slice(1).join("\n\n")} accent={T.teal}/>
//                 </div>
//               </div>
//             </Reveal>
//           )}
//           <SectionTransition from={T.teal} to={T.rose}/>

//           {/* HOLDING BACK */}
//           {holdSec.body&&(
//             <Reveal delay={.05}>
//               <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.rose}18`,marginBottom:"1.75rem",boxShadow:`0 4px 40px ${T.rose}0d`}}>
//                 <SectionHeader title={holdSec.heading||"What's Holding You Back"} icon="🔓" accent={T.rose} lightBg={T.roseLight}/>
//                 <div style={{background:T.white}}>
//                   <PullQuote text={holdSec.body} accent={T.rose}/>
//                   <BodyText text={holdSec.body.split(/\n\n/).slice(1).join("\n\n")} accent={T.rose}/>
//                 </div>
//               </div>
//             </Reveal>
//           )}
//           <SectionTransition from={T.rose} to={T.gold}/>

//           {/* WORLD OFFERING — dark card */}
//           {worldSec.body&&(
//             <Reveal delay={.05}>
//               <div style={{background:`linear-gradient(160deg,${T.ink},#0D2E3A)`,borderRadius:28,padding:"2rem 2.25rem",marginBottom:"1.75rem",position:"relative",overflow:"hidden"}}>
//                 <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 20% 50%,${T.teal}12,transparent 50%),radial-gradient(circle at 80% 20%,${T.gold}0f,transparent 45%)`,pointerEvents:"none"}}/>
//                 <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:T.tealMid,marginBottom:"0.75rem",position:"relative"}}>🌍 {worldSec.heading||"What You Offer the World"}</div>
//                 <div style={{position:"relative"}}>
//                   {worldSec.body.split(/\n\n+/).filter(Boolean).map((p,i)=>(
//                     <p key={i} style={{fontSize:"0.94rem",lineHeight:1.85,color:"rgba(255,255,255,0.82)",margin:"0 0 0.9rem",fontStyle:i===0?"italic":"normal",fontFamily:i===0?"'Playfair Display',serif":"'Plus Jakarta Sans',system-ui"}}>{p.replace(/\*\*/g,"")}</p>
//                   ))}
//                 </div>
//               </div>
//             </Reveal>
//           )}
//           <SectionTransition from={T.gold} to={T.sky}/>

//           {/* CAREERS */}
//           {careers.length>0&&(
//             <Reveal delay={.05}>
//               <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.sky}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.sky}0d`}}>
//                 <SectionHeader title="Careers Suggested to You" icon="🎯" accent={T.sky} lightBg={T.skyLight}/>
//                 <div style={{padding:"1.5rem 2rem"}}>
//                   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"1.1rem",marginBottom:"1.25rem"}}>
//                     {careers.map((c,i)=><CareerCard key={i} career={c} rank={i}/>)}
//                   </div>
//                   {moderate.length>0&&(
//                     <div style={{marginBottom:"1rem"}}>
//                       <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:T.inkLight,marginBottom:"0.7rem"}}>Also Worth Exploring</div>
//                       <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
//                         {moderate.map((m,i)=><div key={i} style={{background:T.purpleLight,border:`1px solid ${T.purple}28`,borderRadius:999,padding:"0.3rem 0.85rem",fontSize:"0.78rem",fontWeight:600,color:T.purple}}>{m.name} <span style={{opacity:.55}}>{m.score}%</span></div>)}
//                       </div>
//                     </div>
//                   )}
//                   {careerSec.body&&<BodyText text={careerSec.body} accent={T.sky}/>}
//                 </div>
//               </div>
//             </Reveal>
//           )}
//           <SectionTransition from={T.sky} to={T.purple}/>

//           {/* ROADMAP — infographic + prose */}
//           <Reveal delay={.05}>
//             <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.purple}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.purple}0d`}}>
//               <SectionHeader title="Career Roadmap" icon="🗺️" accent={T.purple} lightBg={T.purpleLight}/>
//               <div style={{borderBottom:`1px solid ${T.purple}10`}}>
//                 <RoadmapInfographic careers={careers}/>
//               </div>
//               {roadSec.body&&<BodyText text={roadSec.body} accent={T.purple}/>}
//             </div>
//           </Reveal>
//           <SectionTransition from={T.purple} to={T.teal}/>

//           {/* EDUCATION */}
//           {eduSec.body&&(
//             <Reveal delay={.05}>
//               <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.teal}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.teal}0d`}}>
//                 <SectionHeader title={eduSec.heading||"Educational Pathway"} icon="🎓" accent={T.teal} lightBg={T.tealLight}/>
//                 <PullQuote text={eduSec.body} accent={T.teal}/>
//                 <BodyText text={eduSec.body.split(/\n\n/).slice(1).join("\n\n")} accent={T.teal}/>
//                 {careers[0]?.stream?.length>0&&(
//                   <StatChips items={[...new Set(careers.slice(0,3).flatMap(c=>c.stream||[]))]} accent={T.teal}/>
//                 )}
//               </div>
//             </Reveal>
//           )}
//           <SectionTransition from={T.teal} to={T.gold}/>

//           {/* SKILLS */}
//           {skillSec.body&&(
//             <Reveal delay={.05}>
//               <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.gold}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.gold}0d`}}>
//                 <SectionHeader title={skillSec.heading||"Skillset to Build"} icon="⚡" accent={T.gold} lightBg={T.goldLight}/>
//                 <BodyText text={skillSec.body} accent={T.gold}/>
//               </div>
//             </Reveal>
//           )}
//           <SectionTransition from={T.gold} to={T.ink}/>

//           {/* CONCLUSION */}
//           {concSec.body&&(
//             <Reveal delay={.05}>
//               <div style={{background:`linear-gradient(160deg,${T.ink} 0%,#0D2E3A 60%,#1A3A4A 100%)`,borderRadius:28,padding:"3rem 2.5rem",position:"relative",overflow:"hidden",textAlign:"center",marginBottom:"1.75rem"}}>
//                 <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 25% 60%,${T.teal}12,transparent 50%),radial-gradient(circle at 75% 25%,${T.gold}0f,transparent 45%)`,pointerEvents:"none"}}/>
//                 <div style={{fontSize:"2.5rem",marginBottom:"1rem",animation:"bob 3s ease infinite",position:"relative"}}>✦</div>
//                 <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.6rem",fontWeight:400,letterSpacing:"0.22em",textTransform:"uppercase",color:T.tealMid,marginBottom:"1.5rem",position:"relative"}}>Conclusion</div>
//                 <div style={{position:"relative",maxWidth:"58ch",margin:"0 auto"}}>
//                   {concSec.body.split(/\n\n+/).filter(Boolean).map((p,i)=>(
//                     <p key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontStyle:"italic",color:"rgba(255,255,255,0.88)",lineHeight:1.9,marginBottom:"1rem"}}>{p.replace(/\*\*/g,"")}</p>
//                   ))}
//                 </div>
//                 <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:"2rem",flexWrap:"wrap",position:"relative"}}>
//                   <button onClick={downloadPDF} disabled={dl} style={{background:`linear-gradient(135deg,${T.tealMid},${T.gold})`,border:"none",color:T.ink,padding:"0.85rem 2rem",borderRadius:14,cursor:"pointer",fontWeight:700,fontSize:"0.9rem",opacity:dl?.6:1,fontFamily:"system-ui"}}>{dl?"Generating…":"⬇ Download PDF"}</button>
//                   <button onClick={()=>router.push("/results")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",color:"rgba(255,255,255,0.75)",padding:"0.85rem 2rem",borderRadius:14,cursor:"pointer",fontWeight:600,fontSize:"0.9rem",fontFamily:"system-ui"}}>← Results</button>
//                 </div>
//               </div>
//             </Reveal>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const T = {
  ink:"#0D1B2A",inkMid:"#2C3E50",inkLight:"#5D7A8A",
  teal:"#0A7B6B",tealLight:"#E8F8F5",tealMid:"#14B89A",
  gold:"#C9962B",goldLight:"#FEF9EC",
  rose:"#C0445A",roseLight:"#FDF0F2",
  sky:"#1A6B9A",skyLight:"#EDF5FB",
  purple:"#5B3FA0",purpleLight:"#F3EFFD",
  cream:"#FAFAF8",white:"#FFFFFF",
};
const CAREER_COLORS=["#0A7B6B","#1A6B9A","#5B3FA0","#C9962B","#C0445A"];
const ROAD_COLORS=["#8CC63F","#00A88A","#1A6B9A","#0D1B2A"];

function parseSections(text){
  return(text||"").split(/^## /m).filter(Boolean).map(p=>{
    const nl=p.indexOf("\n");
    return{heading:p.slice(0,nl).trim().replace(/^\d+\.\s*/,""),body:p.slice(nl+1).trim()};
  });
}
function findSec(sections,...keys){
  return sections.find(s=>keys.some(k=>s.heading.toLowerCase().includes(k)))||{heading:"",body:""};
}

function Reveal({children,delay=0,style={}}){
  const ref=useRef();const[vis,setVis]=useState(false);
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.07});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  return<div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":"translateY(28px)",transition:`opacity .65s ease ${delay}s,transform .65s cubic-bezier(.16,1,.3,1) ${delay}s`,...style}}>{children}</div>;
}

function SectionHeader({title,icon,accent,lightBg}){
  return(
    <div style={{background:lightBg,padding:"1.4rem 2rem",display:"flex",alignItems:"center",gap:"0.85rem",borderBottom:`1px solid ${accent}18`}}>
      <div style={{width:40,height:40,borderRadius:12,background:`${accent}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>{icon}</div>
      <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"1.3rem",fontWeight:700,color:T.ink,margin:0}}>{title}</h2>
      <div style={{marginLeft:"auto",width:38,height:4,borderRadius:2,background:`linear-gradient(90deg,${accent},${accent}44)`}}/>
    </div>
  );
}

function BodyText({text,accent}){
  const paras=(text||"").split(/\n\n+/).filter(Boolean);
  return(
    <div style={{padding:"1.5rem 2rem"}}>
      {paras.map((p,i)=>{
        const html=p.replace(/\*\*(.+?)\*\*/g,`<strong style="color:${accent}">$1</strong>`).replace(/\*(.+?)\*/g,"<em>$1</em>");
        return<p key={i} style={{fontSize:"0.94rem",lineHeight:1.85,color:T.inkMid,margin:"0 0 0.9rem",fontFamily:"'Plus Jakarta Sans',system-ui"}} dangerouslySetInnerHTML={{__html:html}}/>;
      })}
    </div>
  );
}

function PullQuote({text,accent}){
  const first=(text||"").split(/\n\n/)[0].replace(/\*\*/g,"").trim().slice(0,220);
  return(
    <div style={{margin:"0 2rem",padding:"1.2rem 1.5rem",background:`${accent}0a`,borderLeft:`4px solid ${accent}`,borderRadius:"0 12px 12px 0",marginTop:"0.25rem"}}>
      <p style={{fontSize:"0.96rem",lineHeight:1.8,fontStyle:"italic",color:T.inkMid,margin:0}}>{first}</p>
    </div>
  );
}

function StatChips({items,accent}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",padding:"0 2rem 1.5rem"}}>
      {items.map((item,i)=>(
        <div key={i} style={{background:`${accent}10`,border:`1px solid ${accent}28`,borderRadius:999,padding:"0.35rem 0.9rem",fontSize:"0.8rem",fontWeight:600,color:accent}}>{item}</div>
      ))}
    </div>
  );
}

function RadarChart({scores,size=150}){
  const[anim,setAnim]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),300);return()=>clearTimeout(t);},[]);
  const items=Object.entries(scores||{});const n=items.length;
  if(!n)return null;
  const cx=size/2,cy=size/2,R=size*0.37;
  const pt=(i,frac)=>{const a=(Math.PI*2*i/n)-Math.PI/2;return[cx+frac*R*Math.cos(a),cy+frac*R*Math.sin(a)];};
  const polyPts=(frac)=>items.map((_,i)=>pt(i,frac).join(",")).join(" ");
  const dataPts=items.map(([,v],i)=>pt(i,anim?v/100:0));
  const dataPath=dataPts.map((p,i)=>(i===0?`M${p}`:`L${p}`)).join(" ")+"Z";
  const ICONS={cognitive:"🧠",personality:"⚙️",motivational:"🔥",social:"🤝",suppression:"🔓",contribution:"🌍"};
  return(
    <svg width={size} height={size} style={{overflow:"visible"}}>
      {[.25,.5,.75,1].map(l=><polygon key={l} points={polyPts(l)} fill="none" stroke={T.teal} strokeWidth=".5" opacity=".2"/>)}
      {items.map((_,i)=>{const[ex,ey]=pt(i,1);return<line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke={T.teal} strokeWidth=".5" opacity=".15"/>;})}
      <path d={dataPath} fill={T.teal} fillOpacity=".18" stroke={T.teal} strokeWidth="1.5" style={{transition:"all 1.4s cubic-bezier(.16,1,.3,1)"}}/>
      {dataPts.map(([px,py],i)=><circle key={i} cx={px} cy={py} r="3.5" fill={T.teal} style={{transition:"all 1.4s cubic-bezier(.16,1,.3,1)"}}/>)}
      {items.map(([dim],i)=>{const[lx,ly]=pt(i,1.3);return<text key={i} x={lx} y={ly+3} textAnchor="middle" fontSize="7.5" fill={T.inkMid} fontFamily="system-ui">{ICONS[dim]||"•"} {dim.slice(0,4)}</text>;})}
    </svg>
  );
}

function TraitBar({label,score,color,index}){
  const[w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(score),200+index*70);return()=>clearTimeout(t);},[score,index]);
  return(
    <div style={{marginBottom:"0.7rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.22rem"}}>
        <span style={{fontSize:"0.78rem",fontWeight:600,color:T.inkMid}}>{label}</span>
        <span style={{fontSize:"0.78rem",fontWeight:700,color}}>{score}%</span>
      </div>
      <div style={{height:8,background:`${color}18`,borderRadius:999,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${w}%`,borderRadius:999,background:`linear-gradient(90deg,${color},${color}99)`,boxShadow:`0 0 8px ${color}44`,transition:`width 1.1s cubic-bezier(.16,1,.3,1) ${index*50}ms`}}/>
      </div>
    </div>
  );
}

function CareerCard({career,rank}){
  const[hov,setHov]=useState(false);
  const col=CAREER_COLORS[rank%CAREER_COLORS.length];
  const badges=["🥇","🥈","🥉","4️⃣","5️⃣"];
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{borderRadius:22,overflow:"hidden",cursor:"default",boxShadow:hov?`0 20px 50px ${col}28`:`0 4px 20px ${col}12`,border:`1.5px solid ${col}28`,transform:hov?"translateY(-5px)":"none",transition:"all .3s cubic-bezier(.16,1,.3,1)"}}>
      <div style={{background:`linear-gradient(135deg,${col},${col}99)`,padding:"1.25rem 1.5rem",position:"relative"}}>
        <div style={{position:"absolute",top:10,right:14,fontSize:"1.4rem"}}>{badges[rank]}</div>
        <div style={{fontSize:"0.58rem",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(255,255,255,0.65)",marginBottom:5}}>{career.domain}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontWeight:700,color:"white",lineHeight:1.2,marginBottom:8,paddingRight:30}}>{career.name}</div>
        <div style={{fontSize:"1.6rem",fontWeight:800,color:"white",fontFamily:"Georgia,serif"}}>{career.score}<span style={{fontSize:"0.7rem",opacity:0.65}}>%</span></div>
      </div>
      <div style={{background:T.white,padding:"1rem 1.5rem"}}>
        <p style={{fontSize:"0.78rem",color:T.inkLight,lineHeight:1.65,margin:0}}>{career.society_role}</p>
        {career.emerging&&<span style={{display:"inline-block",marginTop:8,fontSize:"0.6rem",fontWeight:800,background:T.skyLight,color:T.sky,borderRadius:999,padding:"0.2rem 0.6rem",letterSpacing:"0.1em"}}>✨ EMERGING</span>}
      </div>
    </div>
  );
}

// ── ROADMAP INFOGRAPHIC ────────────────────────────────────────────────────────
function RoadmapInfographic({careers}){
  const steps=(careers||[]).slice(0,4);
  const[animated,setAnimated]=useState(false);
  const ref=useRef();
  useEffect(()=>{const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setAnimated(true)},{threshold:0.2});if(ref.current)obs.observe(ref.current);return()=>obs.disconnect();},[]);
  if(!steps.length)return null;

  const totalW=700,stepW=totalW/steps.length,risePerStep=22,roadY=95,laneH=26;

  return(
    <div ref={ref} style={{background:T.white,padding:"0.25rem 0 0"}}>
      <svg viewBox={`0 0 ${totalW} 230`} style={{width:"100%",height:"auto",overflow:"visible"}}>
        {steps.map((step,i)=>{
          const col=ROAD_COLORS[i%ROAD_COLORS.length];
          const x0=i*stepW,x1=(i+1)*stepW;
          const y0=roadY-i*risePerStep,y1=roadY-(i+1)*risePerStep;
          const pts=`${x0},${y0-laneH/2} ${x1},${y1-laneH/2} ${x1},${y1+laneH/2} ${x0},${y0+laneH/2}`;
          const midX=(x0+x1)/2,midY=(y0+y1)/2;
          const poleBase=midY-laneH/2;
          const poleTop=poleBase-38;
          const flagTop=poleTop,flagBot=poleTop+18,flagTip=midX+22;
          // dashes
          const segLen=Math.sqrt((x1-x0)**2+(y1-y0)**2);
          const nd=Math.floor(segLen/22);
          const ddx=(x1-x0)/nd,ddy=(y1-y0)/nd;
          return(
            <g key={i}>
              <polygon points={pts} fill="#CBD5DC"/>
              {[...Array(nd-1)].map((_,d)=>(
                <line key={d} x1={x0+d*ddx+ddx*0.25} y1={y0+d*ddy} x2={x0+d*ddx+ddx*0.65} y2={y0+d*ddy+ddy*0.4} stroke="white" strokeWidth="2.5"/>
              ))}
              {/* pole */}
              <line x1={midX} y1={poleBase} x2={midX} y2={poleTop+6} stroke={col} strokeWidth="1.5" strokeDasharray="3 2" opacity=".8"/>
              {/* flag */}
              <polygon points={`${midX},${flagTop} ${flagTip},${(flagTop+flagBot)/2} ${midX},${flagBot}`} fill={col}
                style={{transform:animated?"scaleX(1)":"scaleX(0)",transformOrigin:`${midX}px ${(flagTop+flagBot)/2}px`,transition:`transform 0.45s cubic-bezier(.34,1.56,.64,1) ${i*0.15+0.3}s`}}/>
              {/* step number */}
              <text x={midX-14} y={poleTop-6} fontFamily="Georgia,serif" fontWeight="800" fontSize="18" fill={col}
                opacity={animated?1:0} style={{transition:`opacity 0.3s ease ${i*0.15+0.55}s`}}>0{i+1}</text>
            </g>
          );
        })}
        {/* labels below road */}
        {steps.map((step,i)=>{
          const x=i*stepW+10;const col=ROAD_COLORS[i%ROAD_COLORS.length];
          const labelY=roadY+36;
          return(
            <g key={`lbl${i}`} style={{opacity:animated?1:0,transition:`opacity 0.5s ease ${i*0.12+0.65}s`}}>
              <text x={x} y={labelY} fontFamily="system-ui" fontWeight="700" fontSize="10" fill={T.ink}>{(step.name||"").slice(0,24)}</text>
              <text x={x} y={labelY+13} fontFamily="system-ui" fontSize="9" fill={col}>{step.score}% match</text>
            </g>
          );
        })}
      </svg>

      {/* Step detail cards */}
      <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(steps.length,4)},1fr)`,gap:"0.75rem",padding:"0 1.5rem 1.5rem"}}>
        {steps.map((step,i)=>{
          const col=ROAD_COLORS[i%ROAD_COLORS.length];
          return(
            <div key={i} style={{background:`${col}09`,borderRadius:14,padding:"0.85rem 1rem",borderTop:`3px solid ${col}`,opacity:animated?1:0,transform:animated?"none":"translateY(10px)",transition:`all 0.5s ease ${i*0.1+0.7}s`}}>
              <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:col,marginBottom:"0.3rem"}}>Path {i+1}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.88rem",fontWeight:700,color:T.ink,marginBottom:"0.25rem"}}>{step.name}</div>
              {step.stream?.length>0&&<div style={{fontSize:"0.72rem",color:T.inkLight}}>via {step.stream.slice(0,2).join(" · ")}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SuppressionBand({supp}){
  if(!supp?.has_suppression)return null;
  return(
    <Reveal>
      <div style={{background:"linear-gradient(135deg,#fff7ed,#fdf0f2)",border:"1px solid #fcd34d",borderRadius:20,padding:"1.5rem 2rem",marginBottom:"1.75rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
          <span style={{fontSize:"1.5rem"}}>🔍</span>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700,color:"#92400e"}}>Patterns Detected in Your Responses</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:"1.5rem",alignItems:"center"}}>
          {supp.insights?.slice(0,2).map((insight,i)=>(
            <p key={i} style={{fontSize:"0.88rem",lineHeight:1.75,color:"#78350f",margin:0,flex:1,minWidth:200}}>{insight}</p>
          ))}
          <div style={{display:"flex",gap:"1rem",flexShrink:0}}>
            {[{l:"Suppression",v:supp.suppression_level},{l:"Fear-driven",v:supp.fear_level}]
              .filter(x=>x.v!==undefined)
              .map(({l,v})=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:"1.3rem",fontWeight:800,color:T.rose}}>{v}%</div>
                  <div style={{fontSize:"0.65rem",color:"#b45309",textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function SectionTransition({from,to}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:"1rem",margin:"0.25rem 0 1.5rem",opacity:0.5}}>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${from}44,transparent)`}}/>
      <div style={{width:7,height:7,borderRadius:"50%",background:to,flexShrink:0}}/>
      <div style={{flex:1,height:1,background:`linear-gradient(90deg,transparent,${to}44,transparent)`}}/>
    </div>
  );
}

function LoadingScreen(){
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${T.ink},#0D2E3A)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,fontFamily:"'Playfair Display',Georgia,serif"}}>
      <style>{`@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>
      <div style={{fontSize:"3.5rem",animation:"bob 2s ease infinite"}}>✦</div>
      <div style={{fontSize:"1.6rem",fontWeight:700,color:T.white}}>Composing Your Report</div>
      <div style={{display:"flex",gap:8}}>{[T.tealMid,T.gold,T.sky].map((col,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:col,animation:`bob 1.2s ease ${i*.2}s infinite`}}/>)}</div>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:"0.82rem",fontFamily:"system-ui"}}>Takes about 20 seconds…</p>
    </div>
  );
}

export default function ReportPage(){
  const router=useRouter();const sp=useSearchParams();const uid=sp.get("uid");
  const[data,setData]=useState(null);const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);const[dl,setDl]=useState(false);

  const fetchReport=useCallback((force=false)=>{
    if(!uid){router.push("/login");return;}
    setLoading(true);setError(null);
    fetch(`http://localhost:5000/api/report/${uid}${force?"?force=true":""}`)
      .then(r=>{if(!r.ok)throw new Error("Failed to load report");return r.json();})
      .then(d=>{setData(d);setLoading(false);})
      .catch(e=>{setError(e.message);setLoading(false);});
  },[uid]);

  useEffect(()=>{fetchReport();},[fetchReport]);

  const downloadPDF=async()=>{
    try{setDl(true);const res=await fetch(`http://localhost:5000/api/report/${uid}/pdf`);if(!res.ok)throw new Error("PDF failed");const blob=await res.blob();const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="wdig-report.pdf";a.click();}
    catch(e){alert(e.message);}finally{setDl(false);}
  };

  if(loading)return<LoadingScreen/>;
  if(error)return(
    <div style={{minHeight:"100vh",background:T.ink,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center",color:T.white}}>
        <div style={{fontSize:"3rem",marginBottom:12}}>⚠️</div><p style={{marginBottom:16}}>{error}</p>
        <button onClick={()=>fetchReport()} style={{padding:"0.7rem 1.5rem",background:T.teal,color:T.white,border:"none",borderRadius:12,cursor:"pointer",fontWeight:600}}>Try Again</button>
      </div>
    </div>
  );
  if(!data)return null;

  const sections=parseSections(data.report||"");
  const dims=data.dimension_scores||{};const traits=data.dominant_traits||[];
  const careers=data.top_careers||[];const moderate=data.moderate_careers||[];
  const supp=data.suppression||{};

  const whoSec=findSec(sections,"who you are","who");
  const holdSec=findSec(sections,"holding","back");
  const worldSec=findSec(sections,"offer","world");
  const careerSec=findSec(sections,"careers suggested","career match");
  const roadSec=findSec(sections,"roadmap");
  const eduSec=findSec(sections,"educational","pathway");
  const skillSec=findSec(sections,"skillset","skill");
  const concSec=findSec(sections,"conclusion","closing");

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:${T.cream}}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.teal}55;border-radius:99px}
      `}</style>

      <div style={{fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif",background:T.cream,minHeight:"100vh",color:T.ink}}>

        {/* HERO */}
        <div style={{background:`linear-gradient(160deg,${T.ink} 0%,#0D2E3A 55%,#1A3A4A 100%)`,position:"relative",overflow:"hidden"}}>
          {[[-60,"auto",-60,"auto",380,T.teal,.08],["auto",-50,"auto",-50,260,T.gold,.07],["35%","auto","auto","25%",220,T.sky,.06]].map(([t,b,r,l,sz,col,op],i)=>(
            <div key={i} style={{position:"absolute",top:t,bottom:b,right:r,left:l,width:sz,height:sz,borderRadius:"50%",background:`radial-gradient(circle,${col}${Math.round(op*255).toString(16).padStart(2,"0")},transparent 65%)`,pointerEvents:"none"}}/>
          ))}
          {[...Array(7)].map((_,i)=>(
            <div key={i} style={{position:"absolute",borderRadius:"50%",width:[5,8,4,7,6,5,7][i],height:[5,8,4,7,6,5,7][i],background:[T.tealMid,T.gold,T.sky,T.tealMid,T.gold,T.sky,T.tealMid][i],opacity:.38,top:[`12%`,`62%`,`24%`,`78%`,`40%`,`16%`,`54%`][i],left:[`8%`,`17%`,`72%`,`82%`,`46%`,`87%`,`30%`][i],animation:`bob ${[2.2,2.8,2,3,2.5,1.9,2.6][i]}s ease ${[0,.3,.6,.1,.5,.8,.2][i]}s infinite`}}/>
          ))}

          <div style={{maxWidth:920,margin:"0 auto",padding:"2.75rem 2rem 0",position:"relative"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2.75rem",flexWrap:"wrap",gap:10}}>
              <button onClick={()=>router.push("/results")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",color:"rgba(255,255,255,0.7)",padding:"0.45rem 1rem",borderRadius:10,cursor:"pointer",fontSize:"0.8rem",fontFamily:"system-ui"}}>← Results</button>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>fetchReport(true)} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.13)",color:"rgba(255,255,255,0.55)",padding:"0.45rem 0.9rem",borderRadius:10,cursor:"pointer",fontSize:"0.8rem"}}>↺</button>
                <button onClick={downloadPDF} disabled={dl} style={{background:`linear-gradient(135deg,${T.teal},${T.tealMid})`,border:"none",color:T.white,padding:"0.45rem 1.25rem",borderRadius:10,cursor:"pointer",fontSize:"0.82rem",fontWeight:700,opacity:dl?.6:1}}>{dl?"…":"⬇ PDF"}</button>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"1.5rem",alignItems:"end"}}>
              <div>
                <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.28em",textTransform:"uppercase",color:T.tealMid,marginBottom:"0.85rem",opacity:.9}}>Aptitude Report</div>
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5.5vw,3.4rem)",fontWeight:800,color:T.white,lineHeight:1.05,marginBottom:"0.9rem"}}>{data.thinking_style_primary}</h1>
                {data.thinking_style_secondary&&(
                  <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:999,padding:"0.4rem 1.1rem",marginBottom:"1.25rem"}}>
                    <span style={{fontSize:"0.6rem",fontWeight:800,color:T.tealMid,letterSpacing:"0.12em",textTransform:"uppercase"}}>Also</span>
                    <span style={{fontSize:"0.82rem",fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{data.thinking_style_secondary}</span>
                  </div>
                )}
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:"0.25rem"}}>
                  {careers.slice(0,3).map((c,i)=>(
                    <div key={i} style={{background:"rgba(255,255,255,0.07)",border:`1px solid ${[T.tealMid,T.gold,T.sky][i]}40`,borderRadius:999,padding:"0.35rem 1rem",fontSize:"0.74rem",fontWeight:600,color:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",gap:6}}>
                      <span style={{color:[T.tealMid,T.gold,T.sky][i]}}>{"⭐🌟✨"[i]}</span>
                      {c.name}<span style={{color:"rgba(255,255,255,0.32)",fontSize:"0.68rem"}}>{c.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {Object.keys(dims).length>0&&<div style={{flexShrink:0,opacity:.75}}><RadarChart scores={dims} size={140}/></div>}
            </div>

            <div style={{display:"flex",marginTop:"2.5rem",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
              {[{label:"Thinking Style",value:(data.thinking_style_primary||"—").split(" ").slice(0,3).join(" ")},{label:"Top Career",value:careers[0]?.name||"—"},{label:"Match Score",value:`${careers[0]?.score||"—"}%`},{label:"Dimensions",value:`${Object.keys(dims).length} analysed`}].map(({label,value},i)=>(
                <div key={i} style={{flex:1,padding:"1.1rem 1.25rem",borderRight:i<3?"1px solid rgba(255,255,255,0.06)":"none"}}>
                  <div style={{fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.38)",marginBottom:"0.3rem"}}>{label}</div>
                  <div style={{fontSize:"0.85rem",fontWeight:700,color:"rgba(255,255,255,0.8)",fontFamily:"'Playfair Display',serif"}}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div style={{maxWidth:920,margin:"0 auto",padding:"2.75rem 2rem 6rem"}}>

          {/* ── DIMENSION PROFILE CARD (radar left + traits right) ── */}
          {(traits.length>0||Object.keys(dims).length>0)&&(
            <Reveal>
              <div style={{background:T.white,borderRadius:24,border:`1px solid ${T.teal}18`,boxShadow:`0 4px 30px ${T.teal}08`,marginBottom:"1.75rem",overflow:"hidden"}}>
                {/* top label bar */}
                <div style={{background:T.tealLight,padding:"0.85rem 2rem",borderBottom:`1px solid ${T.teal}14`,display:"flex",gap:"2rem"}}>
                  {Object.keys(dims).length>0&&<span style={{fontSize:"0.62rem",fontWeight:800,letterSpacing:"0.14em",textTransform:"uppercase",color:T.teal}}>Dimension Profile</span>}
                  {traits.length>0&&<span style={{fontSize:"0.62rem",fontWeight:800,letterSpacing:"0.14em",textTransform:"uppercase",color:T.teal}}>Dominant Traits</span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:Object.keys(dims).length>0?"1fr 1.55fr":"1fr",gap:0}}>
                  {/* LEFT: Radar */}
                  {Object.keys(dims).length>0&&(
                    <div style={{padding:"1.75rem 1.5rem 1.75rem 2rem",borderRight:`1px solid ${T.teal}0f`,display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem"}}>
                      <RadarChart scores={dims} size={170}/>
                      {/* dim score pills */}
                      <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem",justifyContent:"center"}}>
                        {Object.entries(dims).map(([dim,val])=>(
                          <div key={dim} style={{fontSize:"0.65rem",fontWeight:700,background:`${T.teal}10`,color:T.teal,borderRadius:999,padding:"0.2rem 0.6rem",textTransform:"capitalize"}}>
                            {dim} {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* RIGHT: Trait bars */}
                  {traits.length>0&&(
                    <div style={{padding:"1.75rem 2rem 1.75rem 1.5rem"}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"0.1rem 2.5rem"}}>
                        {traits.slice(0,6).map(({label,score},i)=>(
                          <TraitBar key={label} label={label} score={score} color={CAREER_COLORS[i%CAREER_COLORS.length]} index={i}/>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          <SuppressionBand supp={supp}/>
          <SectionTransition from={T.teal} to={T.teal}/>

          {/* WHO */}
          {whoSec.body&&(
            <Reveal>
              <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.teal}18`,marginBottom:"1.75rem",boxShadow:`0 4px 40px ${T.teal}0d`}}>
                <SectionHeader title={whoSec.heading||"Who You Are"} icon="🧬" accent={T.teal} lightBg={T.tealLight}/>
                <div style={{background:T.white}}>
                  <PullQuote text={whoSec.body} accent={T.teal}/>
                  <BodyText text={whoSec.body.split(/\n\n/).slice(1).join("\n\n")} accent={T.teal}/>
                </div>
              </div>
            </Reveal>
          )}
          <SectionTransition from={T.teal} to={T.rose}/>

          {/* HOLDING BACK */}
          {holdSec.body&&(
            <Reveal delay={.05}>
              <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.rose}18`,marginBottom:"1.75rem",boxShadow:`0 4px 40px ${T.rose}0d`}}>
                <SectionHeader title={holdSec.heading||"What's Holding You Back"} icon="🔓" accent={T.rose} lightBg={T.roseLight}/>
                <div style={{background:T.white}}>
                  <PullQuote text={holdSec.body} accent={T.rose}/>
                  <BodyText text={holdSec.body.split(/\n\n/).slice(1).join("\n\n")} accent={T.rose}/>
                </div>
              </div>
            </Reveal>
          )}
          <SectionTransition from={T.rose} to={T.gold}/>

          {/* WORLD OFFERING — dark card */}
          {worldSec.body&&(
            <Reveal delay={.05}>
              <div style={{background:`linear-gradient(160deg,${T.ink},#0D2E3A)`,borderRadius:28,padding:"2rem 2.25rem",marginBottom:"1.75rem",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 20% 50%,${T.teal}12,transparent 50%),radial-gradient(circle at 80% 20%,${T.gold}0f,transparent 45%)`,pointerEvents:"none"}}/>
                <div style={{fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.18em",textTransform:"uppercase",color:T.tealMid,marginBottom:"0.75rem",position:"relative"}}>🌍 {worldSec.heading||"What You Offer the World"}</div>
                <div style={{position:"relative"}}>
                  {worldSec.body.split(/\n\n+/).filter(Boolean).map((p,i)=>(
                    <p key={i} style={{fontSize:"0.94rem",lineHeight:1.85,color:"rgba(255,255,255,0.82)",margin:"0 0 0.9rem",fontStyle:i===0?"italic":"normal",fontFamily:i===0?"'Playfair Display',serif":"'Plus Jakarta Sans',system-ui"}}>{p.replace(/\*\*/g,"")}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
          <SectionTransition from={T.gold} to={T.sky}/>

          {/* CAREERS */}
          {careers.length>0&&(
            <Reveal delay={.05}>
              <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.sky}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.sky}0d`}}>
                <SectionHeader title="Careers Suggested to You" icon="🎯" accent={T.sky} lightBg={T.skyLight}/>
                <div style={{padding:"1.5rem 2rem"}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"1.1rem",marginBottom:"1.25rem"}}>
                    {careers.map((c,i)=><CareerCard key={i} career={c} rank={i}/>)}
                  </div>
                  {moderate.length>0&&(
                    <div style={{marginBottom:"1rem"}}>
                      <div style={{fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:T.inkLight,marginBottom:"0.7rem"}}>Also Worth Exploring</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem"}}>
                        {moderate.map((m,i)=><div key={i} style={{background:T.purpleLight,border:`1px solid ${T.purple}28`,borderRadius:999,padding:"0.3rem 0.85rem",fontSize:"0.78rem",fontWeight:600,color:T.purple}}>{m.name} <span style={{opacity:.55}}>{m.score}%</span></div>)}
                      </div>
                    </div>
                  )}
                  {careerSec.body&&<BodyText text={careerSec.body} accent={T.sky}/>}
                </div>
              </div>
            </Reveal>
          )}
          <SectionTransition from={T.sky} to={T.purple}/>

          {/* ROADMAP — infographic + prose */}
          <Reveal delay={.05}>
            <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.purple}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.purple}0d`}}>
              <SectionHeader title="Career Roadmap" icon="🗺️" accent={T.purple} lightBg={T.purpleLight}/>
              <div style={{borderBottom:`1px solid ${T.purple}10`}}>
                <RoadmapInfographic careers={careers}/>
              </div>
              {roadSec.body&&<BodyText text={roadSec.body} accent={T.purple}/>}
            </div>
          </Reveal>
          <SectionTransition from={T.purple} to={T.teal}/>

          {/* EDUCATION */}
          {eduSec.body&&(
            <Reveal delay={.05}>
              <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.teal}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.teal}0d`}}>
                <SectionHeader title={eduSec.heading||"Educational Pathway"} icon="🎓" accent={T.teal} lightBg={T.tealLight}/>
                <PullQuote text={eduSec.body} accent={T.teal}/>
                <BodyText text={eduSec.body.split(/\n\n/).slice(1).join("\n\n")} accent={T.teal}/>
                {careers[0]?.stream?.length>0&&(
                  <StatChips items={[...new Set(careers.slice(0,3).flatMap(c=>c.stream||[]))]} accent={T.teal}/>
                )}
              </div>
            </Reveal>
          )}
          <SectionTransition from={T.teal} to={T.gold}/>

          {/* SKILLS */}
          {skillSec.body&&(
            <Reveal delay={.05}>
              <div style={{borderRadius:28,overflow:"hidden",border:`1.5px solid ${T.gold}18`,marginBottom:"1.75rem",background:T.white,boxShadow:`0 4px 40px ${T.gold}0d`}}>
                <SectionHeader title={skillSec.heading||"Skillset to Build"} icon="⚡" accent={T.gold} lightBg={T.goldLight}/>
                <BodyText text={skillSec.body} accent={T.gold}/>
              </div>
            </Reveal>
          )}
          <SectionTransition from={T.gold} to={T.ink}/>

          {/* CONCLUSION */}
          {concSec.body&&(
            <Reveal delay={.05}>
              <div style={{background:`linear-gradient(160deg,${T.ink} 0%,#0D2E3A 60%,#1A3A4A 100%)`,borderRadius:28,padding:"3rem 2.5rem",position:"relative",overflow:"hidden",textAlign:"center",marginBottom:"1.75rem"}}>
                <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 25% 60%,${T.teal}12,transparent 50%),radial-gradient(circle at 75% 25%,${T.gold}0f,transparent 45%)`,pointerEvents:"none"}}/>
                <div style={{fontSize:"2.5rem",marginBottom:"1rem",animation:"bob 3s ease infinite",position:"relative"}}>✦</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.6rem",fontWeight:400,letterSpacing:"0.22em",textTransform:"uppercase",color:T.tealMid,marginBottom:"1.5rem",position:"relative"}}>Conclusion</div>
                <div style={{position:"relative",maxWidth:"58ch",margin:"0 auto"}}>
                  {concSec.body.split(/\n\n+/).filter(Boolean).map((p,i)=>(
                    <p key={i} style={{fontFamily:"'Playfair Display',serif",fontSize:"1.05rem",fontStyle:"italic",color:"rgba(255,255,255,0.88)",lineHeight:1.9,marginBottom:"1rem"}}>{p.replace(/\*\*/g,"")}</p>
                  ))}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:"2rem",flexWrap:"wrap",position:"relative"}}>
                  <button onClick={downloadPDF} disabled={dl} style={{background:`linear-gradient(135deg,${T.tealMid},${T.gold})`,border:"none",color:T.ink,padding:"0.85rem 2rem",borderRadius:14,cursor:"pointer",fontWeight:700,fontSize:"0.9rem",opacity:dl?.6:1,fontFamily:"system-ui"}}>{dl?"Generating…":"⬇ Download PDF"}</button>
                  <button onClick={()=>router.push("/results")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.14)",color:"rgba(255,255,255,0.75)",padding:"0.85rem 2rem",borderRadius:14,cursor:"pointer",fontWeight:600,fontSize:"0.9rem",fontFamily:"system-ui"}}>← Results</button>
                </div>
              </div>
            </Reveal>
          )}

        </div>
      </div>
    </>
  );
}