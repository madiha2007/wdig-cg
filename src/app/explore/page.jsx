// // "use client";

// // import { useState } from "react";
// // import Navbar from "@/components/Navbar";
// // import CareerCard from "@/components/CareerCard";
// // import { careersData } from "@/data/careersData";
// // import { Search } from "lucide-react";

// // export default function ExploreCareersPage() {
// //   const [search, setSearch] = useState("");

// //   const filteredCareers = careersData.filter((career) =>
// //     career.title.toLowerCase().includes(search.toLowerCase()) ||
// //     career.domain?.toLowerCase().includes(search.toLowerCase()) ||
// //     career.skills?.some((skill) =>
// //       skill.toLowerCase().includes(search.toLowerCase())
// //     )
// //   );

// //   return (
// //     <div className="min-h-screen">

// //       <div className="px-6 py-10 max-w-7xl mx-auto">
// //         {/* Heading */}
// //         <div className="text-center">
// //           <h1 className="text-3xl font-bold">
// //             Explore Professional Careers
// //           </h1>
// //           <p className="text-gray-600 mt-2">
// //             Discover career paths from after 10th grade through professional success.
// //           </p>
// //         </div>

// //         {/* Search */}
// //         <div className="mt-6 flex items-center bg-blue-50 rounded-full px-4 py-3">
// //           <Search className="text-gray-400" size={20} />
// //           <input
// //             type="text"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             placeholder="Search and know more about the careers you like..."
// //             className="bg-transparent outline-none ml-3 w-full"
// //           />
// //         </div>

// //         {/* Results Count */}
// //         <p className="mt-4 text-sm text-gray-500">
// //           Showing {filteredCareers.length} careers
// //         </p>

// //         {/* Career Cards */}
// //         {filteredCareers.length === 0 ? (
// //           <p className="text-center text-gray-500 mt-10">
// //             No careers found 😕
// //           </p>
// //         ) : (
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
// //             {filteredCareers.map((career) => (
// //               <CareerCard key={career.id} career={career} />
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Navbar from "@/components/Navbar";
// import CareerCard from "@/components/CareerCard";
// import { Search, Loader2, SlidersHorizontal } from "lucide-react";

// const DOMAINS = [
//   { label: "All", value: "all", emoji: "🌐" },
//   { label: "Technology", value: "Technology", emoji: "💻" },
//   { label: "Medicine", value: "Medicine", emoji: "🩺" },
//   { label: "Engineering", value: "Engineering", emoji: "⚙️" },
//   { label: "Finance", value: "Finance", emoji: "💰" },
//   { label: "Law", value: "Law", emoji: "⚖️" },
//   { label: "Arts & Design", value: "Arts", emoji: "🎨" },
//   { label: "Education", value: "Education", emoji: "📚" },
//   { label: "Business", value: "Business", emoji: "📊" },
// ];

// const SORT_OPTIONS = [
//   { label: "Relevance", value: "relevance" },
//   { label: "Salary ↑", value: "salary_asc" },
//   { label: "Salary ↓", value: "salary_desc" },
//   { label: "Bright Outlook", value: "outlook" },
// ];

// export default function ExploreCareersPage() {
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [activeDomain, setActiveDomain] = useState("all");
//   const [sort, setSort] = useState("relevance");
//   const [careers, setCareers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [total, setTotal] = useState(0);

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(search), 400);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchCareers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const params = new URLSearchParams();
//       if (activeDomain !== "all") params.set("domain", activeDomain);
//       if (debouncedSearch) params.set("keyword", debouncedSearch);

//       const res = await fetch(`/api/careers?${params}`);
//       if (!res.ok) throw new Error("Failed to fetch careers");
//       const data = await res.json();
//       if (data.error) throw new Error(data.error);

//       let sorted = [...(data.careers || [])];
//       if (sort === "salary_asc") {
//         sorted.sort((a, b) => (a.salary?.median || 0) - (b.salary?.median || 0));
//       } else if (sort === "salary_desc") {
//         sorted.sort((a, b) => (b.salary?.median || 0) - (a.salary?.median || 0));
//       } else if (sort === "outlook") {
//         sorted.sort((a, b) => (b.bright_outlook ? 1 : 0) - (a.bright_outlook ? 1 : 0));
//       }

//       setCareers(sorted);
//       setTotal(data.total || sorted.length);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [activeDomain, debouncedSearch, sort]);

//   useEffect(() => {
//     fetchCareers();
//   }, [fetchCareers]);

//   return (
//     <div className="min-h-screen bg-[#f8f7f4]">

//       {/* Hero */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 text-white">
//         <div className="absolute inset-0 opacity-10"
//           style={{
//             backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
//               radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
//             backgroundSize: "60px 60px",
//           }}
//         />
//         <div className="relative px-6 py-16 max-w-5xl mx-auto text-center">
//           <span className="inline-block bg-white/10 border border-white/20 text-sm px-4 py-1 rounded-full mb-4 backdrop-blur-sm">
//             Powered by O*NET · U.S. Department of Labor
//           </span>
//           <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
//             Find Your <span className="text-yellow-300">Dream Career</span>
//           </h1>
//           <p className="text-blue-100 mt-4 text-lg max-w-2xl mx-auto">
//             Explore thousands of real career paths with live salary data, growth outlooks, and skill requirements.
//           </p>

//           {/* Search Bar */}
//           <div className="mt-8 flex items-center bg-white rounded-2xl px-5 py-4 shadow-2xl max-w-2xl mx-auto">
//             <Search className="text-gray-400 shrink-0" size={20} />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search careers, skills, or keywords..."
//               className="bg-transparent outline-none ml-3 w-full text-gray-800 placeholder-gray-400"
//             />
//             {search && (
//               <button
//                 onClick={() => setSearch("")}
//                 className="text-gray-400 hover:text-gray-600 text-sm ml-2"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="px-6 py-8 max-w-7xl mx-auto">

//         {/* Domain Filter Chips */}
//         <div className="flex items-center gap-2 flex-wrap">
//           {DOMAINS.map((d) => (
//             <button
//               key={d.value}
//               onClick={() => setActiveDomain(d.value)}
//               className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
//                 activeDomain === d.value
//                   ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
//                   : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
//               }`}
//             >
//               <span>{d.emoji}</span>
//               {d.label}
//             </button>
//           ))}

//           {/* Sort */}
//           <div className="ml-auto flex items-center gap-2">
//             <SlidersHorizontal size={16} className="text-gray-400" />
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
//             >
//               {SORT_OPTIONS.map((opt) => (
//                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Results Count */}
//         <div className="mt-5 flex items-center justify-between">
//           <p className="text-sm text-gray-500">
//             {loading ? "Loading careers..." : `Showing ${careers.length} of ${total}+ careers`}
//           </p>
//         </div>

//         {/* States */}
//         {loading && (
//           <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-400">
//             <Loader2 size={36} className="animate-spin text-indigo-500" />
//             <p className="text-sm">Fetching live career data from O*NET...</p>
//           </div>
//         )}

//         {error && (
//           <div className="mt-10 text-center py-16 bg-red-50 rounded-2xl border border-red-100">
//             <p className="text-red-500 font-medium">⚠️ {error}</p>
//             <p className="text-sm text-gray-500 mt-2">
//               Make sure your <code className="bg-gray-100 px-1 rounded">ONET_USERNAME</code> and{" "}
//               <code className="bg-gray-100 px-1 rounded">ONET_PASSWORD</code> are set in{" "}
//               <code className="bg-gray-100 px-1 rounded">.env.local</code>
//             </p>
//             <button
//               onClick={fetchCareers}
//               className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {!loading && !error && careers.length === 0 && (
//           <div className="mt-10 text-center py-24">
//             <p className="text-5xl">🔍</p>
//             <p className="text-gray-600 mt-4 font-medium">No careers found for "{search}"</p>
//             <p className="text-sm text-gray-400 mt-1">Try a different keyword or domain</p>
//           </div>
//         )}

//         {!loading && !error && careers.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//             {careers.map((career) => (
//               <CareerCard key={career.id} career={career} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Loader2, TrendingUp, Star, Zap, ChevronDown, X, Briefcase, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

/* ─── Domain Config ─────────────────────────────────────────── */
const DOMAINS = [
  { label: "All Fields", value: "all", emoji: "✦", color: "#6366f1" },
  { label: "Technology", value: "Technology", emoji: "💻", color: "#3b82f6" },
  { label: "Medicine", value: "Medicine", emoji: "🩺", color: "#ef4444" },
  { label: "Engineering", value: "Engineering", emoji: "⚙️", color: "#f59e0b" },
  { label: "Finance", value: "Finance", emoji: "💰", color: "#10b981" },
  { label: "Law", value: "Law", emoji: "⚖️", color: "#8b5cf6" },
  { label: "Arts & Design", value: "Arts", emoji: "🎨", color: "#ec4899" },
  { label: "Education", value: "Education", emoji: "📚", color: "#14b8a6" },
  { label: "Business", value: "Business", emoji: "📊", color: "#f97316" },
];

const SORT_OPTIONS = [
  { label: "Best Match", value: "relevance", icon: "✦" },
  { label: "Highest Pay", value: "salary_desc", icon: "↑" },
  { label: "Lowest Pay", value: "salary_asc", icon: "↓" },
  { label: "Bright Outlook", value: "outlook", icon: "★" },
];

const DOMAIN_STYLES = {
  Technology: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", pill: "#dbeafe" },
  Medicine:   { bg: "#fff1f2", text: "#be123c", border: "#fecdd3", pill: "#ffe4e6" },
  Engineering:{ bg: "#fffbeb", text: "#b45309", border: "#fde68a", pill: "#fef3c7" },
  Finance:    { bg: "#ecfdf5", text: "#065f46", border: "#a7f3d0", pill: "#d1fae5" },
  Law:        { bg: "#f5f3ff", text: "#5b21b6", border: "#ddd6fe", pill: "#ede9fe" },
  Arts:       { bg: "#fdf2f8", text: "#9d174d", border: "#fbcfe8", pill: "#fce7f3" },
  Education:  { bg: "#f0fdfa", text: "#0f766e", border: "#99f6e4", pill: "#ccfbf1" },
  Business:   { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", pill: "#ffedd5" },
};

const DEFAULT_STYLE = { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd", pill: "#e0f2fe" };

function fmt(n) {
  if (!n) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

/* ─── Floating orbs background ─────────────────────────────── */
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        top: "-200px", left: "-100px", animation: "drift1 18s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
        bottom: "10%", right: "-100px", animation: "drift2 22s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
        top: "40%", left: "40%", animation: "drift3 26s ease-in-out infinite"
      }} />
      <style>{`
        @keyframes drift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,20px)} }
        @keyframes drift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-40px)} }
      `}</style>
    </div>
  );
}

/* ─── Career Card ───────────────────────────────────────────── */
function CareerCard({ career, index }) {
  const [hovered, setHovered] = useState(false);
  const s = DOMAIN_STYLES[career.domain] || DEFAULT_STYLE;
  const median = fmt(career.salary?.median);
  const low = fmt(career.salary?.low);
  const high = fmt(career.salary?.high);

  return (
    <Link href={`/careers/${career.id}`} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          borderRadius: 20,
          border: `1.5px solid ${hovered ? s.border : "#e5e7eb"}`,
          padding: "24px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
          boxShadow: hovered
            ? `0 20px 60px rgba(99,102,241,0.12), 0 0 0 1px ${s.border}`
            : "0 2px 12px rgba(0,0,0,0.05)",
          animationDelay: `${index * 60}ms`,
          animation: "cardIn 0.5s ease forwards",
          opacity: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${s.text}, transparent)`,
          borderRadius: "20px 20px 0 0",
          opacity: hovered ? 1 : 0, transition: "opacity 0.3s"
        }} />

        {/* Domain badge + badges */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{
            background: s.bg, border: `1px solid ${s.border}`,
            color: s.text, borderRadius: 10, padding: "6px 12px",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.05em",
            textTransform: "uppercase", flexShrink: 0
          }}>
            {career.domain || "General"}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {career.bright_outlook && (
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "#fef9c3", color: "#854d0e", border: "1px solid #fde047",
                borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600
              }}>
                <Star size={9} fill="#eab308" color="#eab308" /> Bright
              </span>
            )}
            {career.in_demand && (
              <span style={{
                background: "#dcfce7", color: "#166534", border: "1px solid #86efac",
                borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600
              }}>🔥 Hot</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          marginTop: 16, fontSize: 18, fontWeight: 800, color: "#111827",
          lineHeight: 1.3, fontFamily: "'Playfair Display', Georgia, serif",
          transition: "color 0.2s",
          ...(hovered ? { color: s.text } : {})
        }}>{career.title}</h3>

        {/* Description */}
        {career.description && (
          <p style={{
            marginTop: 8, fontSize: 13, color: "#6b7280", lineHeight: 1.6,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
          }}>{career.description}</p>
        )}

        {/* Salary Box */}
        {median && (
          <div style={{
            marginTop: 16, padding: "12px 16px", background: s.bg,
            borderRadius: 12, border: `1px solid ${s.border}`
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{median}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>/ year</span>
            </div>
            {low && high && (
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                Range: {low} — {high}
              </div>
            )}
          </div>
        )}

        {/* Education */}
        {career.education && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
            <GraduationCap size={13} color="#9ca3af" />
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{career.education}</span>
          </div>
        )}

        {/* Growth */}
        {career.growth && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 6 }}>
            <TrendingUp size={13} color="#9ca3af" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{
              fontSize: 11, color: "#6b7280", lineHeight: 1.5,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
            }}>{career.growth}</span>
          </div>
        )}

        {/* Skills */}
        {career.skills?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
            {career.skills.slice(0, 4).map(skill => (
              <span key={skill} style={{
                background: s.pill, color: s.text, borderRadius: 20,
                padding: "3px 10px", fontSize: 11, fontWeight: 600,
                border: `1px solid ${s.border}`
              }}>{skill}</span>
            ))}
            {career.skills.length > 4 && (
              <span style={{
                background: "#f3f4f6", color: "#6b7280", borderRadius: 20,
                padding: "3px 10px", fontSize: 11, fontWeight: 600
              }}>+{career.skills.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: "auto", paddingTop: 16, borderTop: "1px solid #f3f4f6",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBlockStart: 16
        }}>
          <span style={{ fontSize: 11, color: "#d1d5db", fontFamily: "monospace" }}>
            #{career.id}
          </span>
          <span style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 700, color: s.text,
            transition: "gap 0.2s", ...(hovered ? { gap: 8 } : {})
          }}>
            Explore <ArrowRight size={14} />
          </span>
        </div>

        <style>{`
          @keyframes cardIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </Link>
  );
}

/* ─── Stats Bar ─────────────────────────────────────────────── */
function StatsBar({ total, loaded }) {
  return (
    <div style={{
      display: "flex", gap: 24, padding: "16px 24px",
      background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb",
      marginBottom: 24, alignItems: "center", boxShadow: "0 1px 8px rgba(0,0,0,0.04)"
    }}>
      {[
        { icon: "🎯", label: "Careers Found", value: loaded },
        { icon: "📊", label: "Total in O*NET", value: `${total}+` },
        { icon: "🇺🇸", label: "Data Source", value: "U.S. Dept. of Labor" },
        { icon: "🔄", label: "Updated", value: "Live" },
      ].map(s => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ExploreCareersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCareers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (activeDomain !== "all") params.set("domain", activeDomain);
      if (debouncedSearch) params.set("keyword", debouncedSearch);
      const res = await fetch(`/api/careers?${params}`);
      if (!res.ok) throw new Error("Failed to fetch careers");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      let sorted = [...(data.careers || [])];
      if (sort === "salary_asc") sorted.sort((a, b) => (a.salary?.median || 0) - (b.salary?.median || 0));
      else if (sort === "salary_desc") sorted.sort((a, b) => (b.salary?.median || 0) - (a.salary?.median || 0));
      else if (sort === "outlook") sorted.sort((a, b) => (b.bright_outlook ? 1 : 0) - (a.bright_outlook ? 1 : 0));
      setCareers(sorted);
      setTotal(data.total || sorted.length);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [activeDomain, debouncedSearch, sort]);

  useEffect(() => { fetchCareers(); }, [fetchCareers]);

  const activeDomainData = DOMAINS.find(d => d.value === activeDomain);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f4", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
      <Background />

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&family=DM+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root { scroll-behavior: smooth; }
      `}</style>

      {/* ── Hero ───────────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 1,
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #24243e 100%)",
        overflow: "hidden", paddingBottom: 60
      }}>
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        {/* Glowing spots */}
        <div style={{ position: "absolute", top: -80, left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -40, right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto", padding: "80px 24px 0" }}>
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.4)",
              color: "#a5b4fc", borderRadius: 100, padding: "8px 20px",
              fontSize: 13, fontWeight: 600, backdropFilter: "blur(8px)"
            }}>
              <Sparkles size={14} />
              Powered by O*NET · U.S. Department of Labor
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            textAlign: "center", fontSize: "clamp(36px, 6vw, 64px)",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 16
          }}>
            Discover Your{" "}
            <span style={{
              background: "linear-gradient(135deg, #818cf8, #c084fc, #f472b6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>Perfect Career</span>
          </h1>
          <p style={{
            textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: 17,
            lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px"
          }}>
            Explore thousands of real career paths with live salary data,
            growth outlooks, and the skills you'll need to succeed.
          </p>

          {/* Search */}
          <div style={{
            position: "relative", maxWidth: 680, margin: "0 auto",
            transition: "transform 0.2s",
            transform: searchFocused ? "scale(1.02)" : "scale(1)"
          }}>
            <div style={{
              position: "absolute", inset: -2, borderRadius: 20,
              background: searchFocused
                ? "linear-gradient(135deg, #6366f1, #ec4899)"
                : "transparent",
              transition: "all 0.3s", zIndex: -1
            }} />
            <div style={{
              display: "flex", alignItems: "center",
              background: "#fff", borderRadius: 18,
              padding: "16px 20px", gap: 12,
              boxShadow: searchFocused
                ? "0 20px 60px rgba(99,102,241,0.3)"
                : "0 8px 30px rgba(0,0,0,0.2)"
            }}>
              <Search size={20} color={searchFocused ? "#6366f1" : "#9ca3af"} style={{ transition: "color 0.2s", flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search by career, skill, or keyword..."
                style={{
                  flex: 1, border: "none", outline: "none", fontSize: 16,
                  color: "#111827", background: "transparent",
                  fontFamily: "'DM Sans', sans-serif"
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  background: "#f3f4f6", border: "none", borderRadius: "50%",
                  width: 28, height: 28, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#6b7280"
                }}>
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Domain pills inside hero */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
            marginTop: 28
          }}>
            {DOMAINS.map(d => (
              <button key={d.value} onClick={() => setActiveDomain(d.value)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                border: activeDomain === d.value
                  ? `1.5px solid ${d.color}`
                  : "1.5px solid rgba(255,255,255,0.15)",
                background: activeDomain === d.value
                  ? `${d.color}25`
                  : "rgba(255,255,255,0.07)",
                color: activeDomain === d.value ? "#fff" : "rgba(255,255,255,0.6)",
                transform: activeDomain === d.value ? "scale(1.05)" : "scale(1)",
                boxShadow: activeDomain === d.value ? `0 4px 20px ${d.color}40` : "none",
                backdropFilter: "blur(8px)"
              }}>
                <span>{d.emoji}</span> {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 24, flexWrap: "wrap", gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {activeDomain !== "all" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "#fff", border: "1.5px solid #e5e7eb",
                borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600, color: "#374151"
              }}>
                <span>{activeDomainData?.emoji}</span>
                {activeDomainData?.label}
                <button onClick={() => setActiveDomain("all")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", marginLeft: 4 }}>
                  <X size={12} />
                </button>
              </div>
            )}
            <p style={{ fontSize: 13, color: "#9ca3af" }}>
              {loading ? "Fetching careers..." : `${careers.length} of ${total}+ careers`}
            </p>
          </div>

          {/* Sort */}
          <div style={{ display: "flex", gap: 6 }}>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setSort(opt.value)} style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
                border: sort === opt.value ? "1.5px solid #6366f1" : "1.5px solid #e5e7eb",
                background: sort === opt.value ? "#6366f1" : "#fff",
                color: sort === opt.value ? "#fff" : "#6b7280"
              }}>
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", padding: "120px 0", gap: 16, color: "#9ca3af"
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #ec4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "spin 1s linear infinite"
            }}>
              <Loader2 size={32} color="#fff" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>Fetching live career data from O*NET...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: "#fff1f2", borderRadius: 20, border: "1.5px solid #fecdd3"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ color: "#be123c", fontWeight: 700, fontSize: 16 }}>{error}</p>
            <p style={{ color: "#9ca3af", fontSize: 13, marginTop: 8 }}>
              Check your <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>ONET_API_KEY</code> in <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>.env.local</code>
            </p>
            <button onClick={fetchCareers} style={{
              marginTop: 20, background: "#6366f1", color: "#fff",
              border: "none", borderRadius: 12, padding: "10px 24px",
              fontWeight: 600, fontSize: 14, cursor: "pointer"
            }}>Try Again</button>
          </div>
        )}

        {!loading && !error && careers.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 24px" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#111827", fontFamily: "'Playfair Display', serif" }}>
              No careers found
            </h3>
            <p style={{ color: "#6b7280", marginTop: 8 }}>Try a different keyword or clear the domain filter</p>
            <button onClick={() => { setSearch(""); setActiveDomain("all"); }} style={{
              marginTop: 20, background: "#6366f1", color: "#fff",
              border: "none", borderRadius: 12, padding: "10px 24px",
              fontWeight: 600, fontSize: 14, cursor: "pointer"
            }}>Clear Filters</button>
          </div>
        )}

        {!loading && !error && careers.length > 0 && (
          <>
            <StatsBar total={total} loaded={careers.length} />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20
            }}>
              {careers.map((career, i) => (
                <CareerCard key={career.id} career={career} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}