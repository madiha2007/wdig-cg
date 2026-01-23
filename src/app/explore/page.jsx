"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import CareerCard from "@/components/CareerCard";
import { careersData } from "@/data/careersData";
import { Search } from "lucide-react";

export default function ExploreCareersPage() {
  const [search, setSearch] = useState("");

  const filteredCareers = careersData.filter((career) =>
    career.title.toLowerCase().includes(search.toLowerCase()) ||
    career.domain?.toLowerCase().includes(search.toLowerCase()) ||
    career.skills?.some((skill) =>
      skill.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen">

      <div className="px-6 py-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Explore Professional Careers
          </h1>
          <p className="text-gray-600 mt-2">
            Discover career paths from after 10th grade through professional success.
          </p>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center bg-blue-50 rounded-full px-4 py-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search and know more about the careers you like..."
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>

        {/* Results Count */}
        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredCareers.length} careers
        </p>

        {/* Career Cards */}
        {filteredCareers.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No careers found 😕
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredCareers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
