"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const TYPE_IMAGES = {
  "Engineering":    "https://images.unsplash.com/photo-1581092160562-40aa08e12b17?w=600&auto=format&fit=crop",
  "University":     "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&auto=format&fit=crop",
  "Medical":        "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&auto=format&fit=crop",
  "Law":            "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop",
  "Management":     "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop",
  "Arts & Science": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&auto=format&fit=crop",
  "Institute":      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&auto=format&fit=crop",
};

const TYPE_COLORS = {
  "Engineering":    { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  "University":     { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
  "Medical":        { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  "Law":            { bg: "bg-amber-50",  text: "text-amber-700",  dot: "bg-amber-500" },
  "Management":     { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500" },
  "Arts & Science": { bg: "bg-pink-50",   text: "text-pink-700",   dot: "bg-pink-500" },
  "Institute":      { bg: "bg-gray-50",   text: "text-gray-700",   dot: "bg-gray-500" },
};

function getDefaultImage(type) {
  return TYPE_IMAGES[type] || TYPE_IMAGES["Institute"];
}

function getTypeColor(type) {
  return TYPE_COLORS[type] || TYPE_COLORS["Institute"];
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

export default function Institutes() {
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetch("/api/institutes")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.institutes || data.data || [];
        setInstitutes(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  async function handleViewInstitute(id) {
    setDetailLoading(true);
    setSelectedInstitute(null);
    try {
      const res = await fetch(`/api/institutes/${id}/details`);
      const data = await res.json();
      setSelectedInstitute(data);
    } catch (err) {
      console.error("Failed to load institute details:", err);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeModal() {
    setSelectedInstitute(null);
    setDetailLoading(false);
  }

  const cities = [...new Set(institutes.map((i) => i.city).filter(Boolean))].sort();
  const types = [...new Set(institutes.map((i) => i.type).filter(Boolean))].sort();

  const filteredInstitutes = institutes.filter((inst) =>
    inst.name?.toLowerCase().includes(search.toLowerCase()) &&
    (type === "" || inst.type === type) &&
    (cityFilter === "" || inst.city === cityFilter)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-3 h-3 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="text-gray-400 text-sm tracking-widest uppercase">Loading Institutes</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full min-h-screen">

      {/* Hero Header */}
      <section className="relative overflow-hidden py-10 px-4">

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-none">
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">
              Dream College
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Explore {institutes.length}+ top institutes across Maharashtra — with fees, placements & more.
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm px-4 md:px-20 py-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search institutes..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {(search || type || cityFilter) && (
            <button
              onClick={() => { setSearch(""); setType(""); setCityFilter(""); }}
              className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400 font-medium">
            {filteredInstitutes.length} results
          </span>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="px-4 md:px-20 py-10">
        {filteredInstitutes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg font-medium">No institutes found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {filteredInstitutes.map((inst) => {
              const tc = getTypeColor(inst.type);
              return (
                <div
                  key={inst.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                  onMouseEnter={() => setHoveredId(inst.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={inst.image || getDefaultImage(inst.type)}
                      alt={`${inst.name} campus`}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                      className="group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Type badge */}
                    <span className={`absolute top-3 left-3 ${tc.bg} ${tc.text} text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                      {inst.type}
                    </span>

                    {/* Rating on image */}
                    {inst.rating && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1">
                        <StarRating rating={inst.rating} />
                      </div>
                    )}

                    {/* City on image */}
                    <p className="absolute bottom-3 left-3 text-white text-xs font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {inst.city}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="font-bold text-gray-900 text-base leading-snug mb-3 line-clamp-2">{inst.name}</h2>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {inst.fees && (
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Fees</p>
                          <p className="text-gray-800 text-xs font-bold mt-0.5">{inst.fees}</p>
                        </div>
                      )}
                      {inst.placement && (
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Avg Package</p>
                          <p className="text-gray-800 text-xs font-bold mt-0.5">{inst.placement}</p>
                        </div>
                      )}
                    </div>

                    {/* Courses */}
                    {Array.isArray(inst.courses) && inst.courses.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {inst.courses.slice(0, 3).map((c) => (
                          <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{c}</span>
                        ))}
                        {inst.courses.length > 3 && (
                          <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">+{inst.courses.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* CTA Button */}
                    <button
                      onClick={() => inst.website ? window.open(inst.website, "_blank") : handleViewInstitute(inst.id)}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 bg-slate-900 text-white hover:bg-sky-600 flex items-center justify-center gap-2 group/btn"
                    >
                      Visit Website
                      <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {(detailLoading || selectedInstitute) && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle on mobile */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center z-10 transition"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {detailLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="flex gap-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <p className="text-gray-400 text-sm">Fetching details...</p>
              </div>
            ) : selectedInstitute && (
              <div>
                {/* Modal image */}
                <div className="relative h-52 rounded-t-3xl sm:rounded-t-2xl overflow-hidden">
                  <Image
                    src={selectedInstitute.image || getDefaultImage(selectedInstitute.type)}
                    alt={`${selectedInstitute.name} campus`}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-14">
                    <span className={`${getTypeColor(selectedInstitute.type).bg} ${getTypeColor(selectedInstitute.type).text} text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-2`}>
                      {selectedInstitute.type}
                    </span>
                    <h2 className="text-white font-black text-xl leading-tight">{selectedInstitute.name}</h2>
                    <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {selectedInstitute.city}, {selectedInstitute.state}
                    </p>
                  </div>
                </div>

                <div className="p-5">
                  {/* Rating */}
                  {selectedInstitute.rating && (
                    <div className="mb-4">
                      <StarRating rating={selectedInstitute.rating} />
                    </div>
                  )}

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {selectedInstitute.fees && (
                      <div className="bg-sky-50 border border-sky-100 rounded-xl p-3">
                        <p className="text-sky-500 text-[10px] uppercase tracking-wider font-bold">Annual Fees</p>
                        <p className="text-gray-900 font-bold text-sm mt-1">{selectedInstitute.fees}</p>
                      </div>
                    )}
                    {selectedInstitute.placement && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                        <p className="text-emerald-500 text-[10px] uppercase tracking-wider font-bold">Avg Package</p>
                        <p className="text-gray-900 font-bold text-sm mt-1">{selectedInstitute.placement}</p>
                      </div>
                    )}
                    {selectedInstitute.highest_package && (
                      <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
                        <p className="text-violet-500 text-[10px] uppercase tracking-wider font-bold">Highest Package</p>
                        <p className="text-gray-900 font-bold text-sm mt-1">{selectedInstitute.highest_package}</p>
                      </div>
                    )}
                    {selectedInstitute.established && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                        <p className="text-amber-500 text-[10px] uppercase tracking-wider font-bold">Established</p>
                        <p className="text-gray-900 font-bold text-sm mt-1">{selectedInstitute.established}</p>
                      </div>
                    )}
                  </div>

                  {/* Info list */}
                  <div className="space-y-3 text-sm mb-5">
                    {selectedInstitute.university && (
                      <div className="flex items-start gap-3 py-2 border-b border-gray-100">
                        <span className="text-gray-400 min-w-[90px] text-xs uppercase tracking-wide font-semibold pt-0.5">University</span>
                        <span className="text-gray-800 font-medium">{selectedInstitute.university}</span>
                      </div>
                    )}
                    {selectedInstitute.college_type && (
                      <div className="flex items-start gap-3 py-2 border-b border-gray-100">
                        <span className="text-gray-400 min-w-[90px] text-xs uppercase tracking-wide font-semibold pt-0.5">Type</span>
                        <span className="text-gray-800 font-medium">{selectedInstitute.college_type}</span>
                      </div>
                    )}
                    {selectedInstitute.cutoff && (
                      <div className="flex items-start gap-3 py-2 border-b border-gray-100">
                        <span className="text-gray-400 min-w-[90px] text-xs uppercase tracking-wide font-semibold pt-0.5">Cutoff</span>
                        <span className="text-gray-800 font-medium">{selectedInstitute.cutoff}</span>
                      </div>
                    )}
                    {Array.isArray(selectedInstitute.courses) && selectedInstitute.courses.length > 0 && (
                      <div className="flex items-start gap-3 py-2">
                        <span className="text-gray-400 min-w-[90px] text-xs uppercase tracking-wide font-semibold pt-0.5">Courses</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedInstitute.courses.map((c) => (
                            <span key={c} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Website Button */}
                  {selectedInstitute.website && (
                    <a
                      href={selectedInstitute.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors text-sm"
                    >
                      Visit Official Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}