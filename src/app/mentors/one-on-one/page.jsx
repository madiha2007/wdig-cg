"use client";

import { useState } from "react";
import mentors from "../../../data/mentors"; // adjust path according to your folder structure
import { Search } from "lucide-react";

export default function OneOnOneMentorsPage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");

  const filteredMentors = mentors.filter((mentor) => {
    const matchesDomain =
      domainFilter === "All" || mentor.domain === domainFilter;

    const matchesSearch =
      mentor.name.toLowerCase().includes(search.toLowerCase()) ||
      mentor.skills?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      ) ||
      mentor.company.toLowerCase().includes(search.toLowerCase());

    // Date is UI-only for now
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl font-extrabold mb-2">
          Find Your Perfect 1-on-1 <span className="text-sky-600">Mentors</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Connect with industry experts for personalized career guidance. Get tailored advice for your unique career path.
        </p>
      </section>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12 px-4">

        {/* SEARCH */}
        <div className="relative w-full md:w-[900px]">
          <input
            type="text"
            placeholder="Search mentors, skills, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-12 pr-5
              py-3
              text-base
              rounded-2xl
              border
              focus:outline-none
              focus:ring-2
              focus:ring-sky-500
            "
          />
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-sky-500"
          />
        </div>

        {/* CALENDAR */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full md:w-48 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* DOMAIN */}
        <select
          className="w-full md:w-56 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        >
          <option value="All">All Domains</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Data Science">Data Science</option>
          <option value="Product Management">Product Management</option>
        </select>
      </div>

      {/* MENTOR CARDS */}
      <section className="px-4 md:px-20 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="relative bg-white rounded-2xl p-6 shadow-lg
                         transition-all duration-300
                         hover:shadow-[0_0_30px_rgba(56,189,248,0.4)]"
            >
              {/* AI RECOMMENDED */}
              {mentor.recommended && (
                <span className="absolute top-4 right-4 text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  ⭐ Recommended
                </span>
              )}

              {/* HEADER */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold">{mentor.name}</h2>
                  <p className="text-sm text-gray-500">
                    {mentor.role} • {mentor.company}
                  </p>
                </div>
              </div>

              {/* DETAILS */}
              <p className="text-sm text-gray-600 mb-3">
                <b>Experience:</b> {mentor.experience}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-sm mb-2">
                ⭐ {mentor.rating} • {mentor.sessionType} session
              </p>

              <p className="font-semibold mb-4">
                ₹{mentor.price} / session
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <button className="flex-1 bg-sky-700 text-white py-2 rounded-xl font-semibold hover:opacity-90">
                  Book Session
                </button>
                <button className="flex-1 border border-sky-600 text-sky-600 py-2 rounded-xl font-semibold hover:bg-sky-50">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
