// "use client";

// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import CareerCard from "@/components/CareerCard";
// import { careersData } from "@/data/careersData";
// import { Search } from "lucide-react";

// export default function ExploreCareersPage() {
//   const [search, setSearch] = useState("");

//   const filteredCareers = careersData.filter((career) =>
//     career.title.toLowerCase().includes(search.toLowerCase()) ||
//     career.domain?.toLowerCase().includes(search.toLowerCase()) ||
//     career.skills?.some((skill) =>
//       skill.toLowerCase().includes(search.toLowerCase())
//     )
//   );

//   return (
//     <div className="min-h-screen">

//       <div className="px-6 py-10 max-w-7xl mx-auto">
//         {/* Heading */}
//         <div className="text-center">
//           <h1 className="text-3xl font-bold">
//             Explore Professional Careers
//           </h1>
//           <p className="text-gray-600 mt-2">
//             Discover career paths from after 10th grade through professional success.
//           </p>
//         </div>

//         {/* Search */}
//         <div className="mt-6 flex items-center bg-blue-50 rounded-full px-4 py-3">
//           <Search className="text-gray-400" size={20} />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search and know more about the careers you like..."
//             className="bg-transparent outline-none ml-3 w-full"
//           />
//         </div>

//         {/* Results Count */}
//         <p className="mt-4 text-sm text-gray-500">
//           Showing {filteredCareers.length} careers
//         </p>

//         {/* Career Cards */}
//         {filteredCareers.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">
//             No careers found 😕
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//             {filteredCareers.map((career) => (
//               <CareerCard key={career.id} career={career} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CareerCard from "@/components/CareerCard";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";

const DOMAINS = [
  { label: "All", value: "all", emoji: "🌐" },
  { label: "Technology", value: "Technology", emoji: "💻" },
  { label: "Medicine", value: "Medicine", emoji: "🩺" },
  { label: "Engineering", value: "Engineering", emoji: "⚙️" },
  { label: "Finance", value: "Finance", emoji: "💰" },
  { label: "Law", value: "Law", emoji: "⚖️" },
  { label: "Arts & Design", value: "Arts", emoji: "🎨" },
  { label: "Education", value: "Education", emoji: "📚" },
  { label: "Business", value: "Business", emoji: "📊" },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Salary ↑", value: "salary_asc" },
  { label: "Salary ↓", value: "salary_desc" },
  { label: "Bright Outlook", value: "outlook" },
];

export default function ExploreCareersPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCareers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeDomain !== "all") params.set("domain", activeDomain);
      if (debouncedSearch) params.set("keyword", debouncedSearch);

      const res = await fetch(`/api/careers?${params}`);
      if (!res.ok) throw new Error("Failed to fetch careers");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      let sorted = [...(data.careers || [])];
      if (sort === "salary_asc") {
        sorted.sort((a, b) => (a.salary?.median || 0) - (b.salary?.median || 0));
      } else if (sort === "salary_desc") {
        sorted.sort((a, b) => (b.salary?.median || 0) - (a.salary?.median || 0));
      } else if (sort === "outlook") {
        sorted.sort((a, b) => (b.bright_outlook ? 1 : 0) - (a.bright_outlook ? 1 : 0));
      }

      setCareers(sorted);
      setTotal(data.total || sorted.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeDomain, debouncedSearch, sort]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return (
    <div className="min-h-screen bg-[#f8f7f4]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative px-6 py-16 max-w-5xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-sm px-4 py-1 rounded-full mb-4 backdrop-blur-sm">
            Powered by O*NET · U.S. Department of Labor
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Find Your <span className="text-yellow-300">Dream Career</span>
          </h1>
          <p className="text-blue-100 mt-4 text-lg max-w-2xl mx-auto">
            Explore thousands of real career paths with live salary data, growth outlooks, and skill requirements.
          </p>

          {/* Search Bar */}
          <div className="mt-8 flex items-center bg-white rounded-2xl px-5 py-4 shadow-2xl max-w-2xl mx-auto">
            <Search className="text-gray-400 shrink-0" size={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers, skills, or keywords..."
              className="bg-transparent outline-none ml-3 w-full text-gray-800 placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-sm ml-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-7xl mx-auto">

        {/* Domain Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {DOMAINS.map((d) => (
            <button
              key={d.value}
              onClick={() => setActiveDomain(d.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeDomain === d.value
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              <span>{d.emoji}</span>
              {d.label}
            </button>
          ))}

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {loading ? "Loading careers..." : `Showing ${careers.length} of ${total}+ careers`}
          </p>
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-gray-400">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
            <p className="text-sm">Fetching live career data from O*NET...</p>
          </div>
        )}

        {error && (
          <div className="mt-10 text-center py-16 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-red-500 font-medium">⚠️ {error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure your <code className="bg-gray-100 px-1 rounded">ONET_USERNAME</code> and{" "}
              <code className="bg-gray-100 px-1 rounded">ONET_PASSWORD</code> are set in{" "}
              <code className="bg-gray-100 px-1 rounded">.env.local</code>
            </p>
            <button
              onClick={fetchCareers}
              className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && careers.length === 0 && (
          <div className="mt-10 text-center py-24">
            <p className="text-5xl">🔍</p>
            <p className="text-gray-600 mt-4 font-medium">No careers found for "{search}"</p>
            <p className="text-sm text-gray-400 mt-1">Try a different keyword or domain</p>
          </div>
        )}

        {!loading && !error && careers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {careers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}