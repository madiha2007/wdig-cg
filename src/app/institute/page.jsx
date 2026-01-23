"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Institutes() {
  const [institutes, setInstitutes] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/institutes")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch institutes");
        return res.json();
      })
      .then((data) => {
        setInstitutes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  fetch("/api/institutes")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched institutes:", data);
      setInstitutes(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setError(err.message);
      setLoading(false);
    });
}, []);


  const filteredInstitutes = institutes.filter((inst) => {
    return (
      inst.name.toLowerCase().includes(search.toLowerCase()) &&
      (type === "" || inst.type === type) &&
      (stateFilter === "" || inst.state === stateFilter) &&
      (cityFilter === "" || inst.city === cityFilter)
    );
  });

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading institutes...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="w-full min-h-screen">

      {/* Header */}
      <section className="text-center py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
          Explore <span className="text-sky-600">Top Institutes</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Search institutes based on location, type, and courses.
        </p>
      </section>

      {/* Filters */}
      <section className="px-4 md:px-20 mb-8">
        <div className="rounded-2xl shadow-md p-6 grid gap-4 md:grid-cols-5 bg-skySoft">
          <input
            type="text"
            placeholder="Search institute name..."
            className="border rounded-lg px-4 py-3 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded-lg px-4 py-3 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Engineering">Engineering</option>
            <option value="University">University</option>
            <option value="Coaching">Coaching</option>
          </select>

          <select
            className="border rounded-lg px-4 py-3 w-full"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Delhi">Delhi</option>
          </select>

          <select
            className="border rounded-lg px-4 py-3 w-full"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Tiruchirappalli">Tiruchirappalli</option>
            <option value="Delhi">Delhi</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setType("");
              setStateFilter("");
              setCityFilter("");
            }}
            className="bg-gradient-to-r from-sky-300 via-purple-300 to-fuchsia-300 text-gray-800 rounded-lg font-semibold"
          >
            Reset
          </button>
        </div>
      </section>

      {/* Institutes Cards */}
      <section className="px-4 md:px-20 pb-16">
        {filteredInstitutes.length === 0 ? (
          <p className="text-center text-gray-500">No institutes found 😕</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInstitutes.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition"
              >
                {/* Image */}
                <div className="w-full h-44 relative rounded-t-2xl overflow-hidden">
                  <Image
                    src={inst.image || "/default.jpg"} // Ensure /public/default.jpg exists
                    alt={inst.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold">{inst.name}</h2>
                  <p className="text-sm text-gray-500 mb-3">
                    {inst.city}, {inst.state}
                  </p>

                  <div className="text-sm text-gray-700 space-y-2">
                    <p><b>Type:</b> {inst.type}</p>
                    <p><b>Fees:</b> {inst.fees || "N/A"}</p>
                    <p><b>Placement:</b> {inst.placement || "N/A"}</p>
                    <p>
                      <b>Courses:</b>{" "}
                      {Array.isArray(inst.courses)
                        ? inst.courses.join(", ")
                        : "Coming soon"}
                    </p>
                  </div>

                  <button className="mt-5 w-full bg-black text-white py-2 rounded-xl font-semibold">
                    View Institute
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
