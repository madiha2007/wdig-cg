"use client";

import { useState } from "react";
import communitySessions from "../../../data/communitySessions";
import { Calendar, Clock, Users, Search } from "lucide-react";

export default function CommunitySessionsPage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");

  const filteredSessions = communitySessions.filter((session) => {
    const matchesDomain =
      domainFilter === "All" || session.domain === domainFilter;

    const matchesSearch =
      session.title.toLowerCase().includes(search.toLowerCase()) ||
      session.skills?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      ) ||
      session.company.toLowerCase().includes(search.toLowerCase());

    // Date is UI-only for now
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl font-extrabold mb-2">
          Community <span className="text-fuchsia-600">Sessions</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Join interactive group discussions with multiple mentors and students. Learn from diverse perspectives and build your network.
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

      {/* SESSIONS GRID */}
      <section className="px-4 md:px-20 pb-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="relative bg-white rounded-2xl overflow-hidden shadow-lg
                         transition-all duration-300
                         hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              {/* IMAGE */}
              <img
                src={session.image}
                alt={session.title}
                className="w-full h-40 object-cover"
              />

              {/* RECOMMENDED */}
              {session.recommended && (
                <span className="absolute top-4 right-4 text-xs bg-sky-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                  ⭐ Recommended
                </span>
              )}

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="text-lg font-bold mb-1">{session.title}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  {session.host} • {session.company}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {session.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* META */}
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {session.date} • {session.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {session.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    {session.seats} seats
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col gap-2">

                  {/* SOLD OUT LABEL */}
                  {session.seats === 0 && (
                    <span className="text-xs text-red-500 font-semibold text-center">
                      Sold Out
                    </span>
                  )}

                  <div className="flex gap-3">
                    {/* PRIMARY BUTTON */}
                    <button
                      disabled={session.seats === 0}
                      className={`flex-1 py-2 rounded-xl font-semibold transition
                        ${
                          session.seats === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-fuchsia-600 text-white hover:opacity-90"
                        }`}
                    >
                      {session.seats === 0
                        ? "Sold Out"
                        : session.price === "Free"
                        ? "Join Free"
                        : "Register"}
                    </button>

                    {/* SECONDARY BUTTON */}
                    <button
                      disabled={session.seats === 0}
                      className={`flex-1 py-2 rounded-xl font-semibold border transition
                        ${
                          session.seats === 0
                            ? "border-gray-300 text-gray-400 cursor-not-allowed"
                            : "border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50"
                        }`}
                    >
                      View Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
