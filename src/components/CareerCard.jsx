"use client";

export default function CareerCard({ career }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition hover:-translate-y-2">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{career.title}</h3>
        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
          {career.category}
        </span>
      </div>

      {/* Demand */}
      <p className="mt-3 text-sm">
        {"🔥".repeat(career.demand)} Demand
      </p>

      {/* Salary */}
      <p className="mt-2">💰 {career.salary}</p>

      {/* Growth */}
      <div className="mt-2">
        <p className="text-sm mb-1">📈 Growth {career.growth}%</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all"
            style={{ width: `${career.growth}%` }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mt-4">
        {career.skills?.map((skill) => (
          <span
            key={skill}
            className="text-xs bg-gray-100 px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="mt-5 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition">
        Explore Career →
      </button>

    </div>
  );
}
