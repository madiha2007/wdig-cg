"use client";

import { useState } from "react";
import trendingCareers from "@/data/trendingCareers";
import CareerCard from "@/components/CareerCard";
import FilterBar from "@/components/FilterBar";
import TrendingStrip from "@/components/TrendingStrip";

export default function TrendingCareersPage() {
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState(null);

  const filteredCareers = trendingCareers.filter((career) => {
    if (category !== "All" && career.category !== category) return false;
    if (tag && !career.tags.includes(tag)) return false;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="text-center py-20 bg-gradient-to-r from-black to-gray-800 text-white">
        <h1 className="text-4xl font-bold">🔥 Trending Careers</h1>
        <p className="mt-4 text-lg">
          Careers shaping the future of India & the world
        </p>
      </section>

      {/* Trending tags strip */}
      <TrendingStrip />

      {/* Filters */}
      <FilterBar
        activeCategory={category}
        setCategory={setCategory}
        activeTag={tag}
        setTag={setTag}
      />

      {/* Grid */}
      <section className="px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No careers match your filters 😕
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="text-center py-16 bg-gradient-to-r from-sky-300 to-fuchsia-300 ">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-fuchsia-900 bg-clip-text text-transparent">
          Not sure which career fits you?
        </h2>
        <button className="mt-6 px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
          Take Career Aptitude Test →
        </button>
      </section>

    </div>
  );
}
