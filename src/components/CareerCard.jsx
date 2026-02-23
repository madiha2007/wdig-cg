// "use client";

// export default function CareerCard({ career }) {
//   return (
//     <div className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition hover:-translate-y-2">

//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-bold">{career.title}</h3>
//         <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
//           {career.category}
//         </span>
//       </div>

//       {/* Demand */}
//       <p className="mt-3 text-sm">
//         {"🔥".repeat(career.demand)} Demand
//       </p>

//       {/* Salary */}
//       <p className="mt-2">💰 {career.salary}</p>

//       {/* Growth */}
//       <div className="mt-2">
//         <p className="text-sm mb-1">📈 Growth {career.growth}%</p>
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div
//             className="bg-black h-2 rounded-full transition-all"
//             style={{ width: `${career.growth}%` }}
//           />
//         </div>
//       </div>

//       {/* Skills */}
//       <div className="flex flex-wrap gap-2 mt-4">
//         {career.skills?.map((skill) => (
//           <span
//             key={skill}
//             className="text-xs bg-gray-100 px-2 py-1 rounded"
//           >
//             {skill}
//           </span>
//         ))}
//       </div>

//       {/* CTA */}
//       <button className="mt-5 w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition">
//         Explore Career →
//       </button>

//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { TrendingUp, GraduationCap, Briefcase, ArrowRight, Star } from "lucide-react";

const DOMAIN_COLORS = {
  Technology: { bg: "bg-blue-50", accent: "text-blue-600", badge: "bg-blue-100 text-blue-700", border: "border-blue-100" },
  Medicine: { bg: "bg-rose-50", accent: "text-rose-600", badge: "bg-rose-100 text-rose-700", border: "border-rose-100" },
  Engineering: { bg: "bg-amber-50", accent: "text-amber-600", badge: "bg-amber-100 text-amber-700", border: "border-amber-100" },
  Finance: { bg: "bg-emerald-50", accent: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-100" },
  Law: { bg: "bg-purple-50", accent: "text-purple-600", badge: "bg-purple-100 text-purple-700", border: "border-purple-100" },
  Arts: { bg: "bg-pink-50", accent: "text-pink-600", badge: "bg-pink-100 text-pink-700", border: "border-pink-100" },
  Education: { bg: "bg-teal-50", accent: "text-teal-600", badge: "bg-teal-100 text-teal-700", border: "border-teal-100" },
  Business: { bg: "bg-orange-50", accent: "text-orange-600", badge: "bg-orange-100 text-orange-700", border: "border-orange-100" },
};

const DOMAIN_EMOJIS = {
  Technology: "💻", Medicine: "🩺", Engineering: "⚙️",
  Finance: "💰", Law: "⚖️", Arts: "🎨", Education: "📚", Business: "📊",
};

function formatSalary(amount) {
  if (!amount) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(amount);
}

export default function CareerCard({ career }) {
  const colors = DOMAIN_COLORS[career.domain] || DOMAIN_COLORS["Technology"];
  const emoji = DOMAIN_EMOJIS[career.domain] || "🎯";
  const medianSalary = formatSalary(career.salary?.median);
  const salaryLow = formatSalary(career.salary?.low);
  const salaryHigh = formatSalary(career.salary?.high);

  return (
    <Link href={`/careers/${career.id}`} className="group block">
      <div className={`relative h-full bg-white rounded-2xl border border-gray-100 p-6 
        shadow-sm hover:shadow-xl transition-all duration-300 
        hover:-translate-y-1 overflow-hidden`}
      >
        {/* Subtle domain color strip */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg.replace("bg-", "bg-gradient-to-r from-").replace("-50", "-300")} rounded-t-2xl`} />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl shrink-0`}>
            {emoji}
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            {career.bright_outlook && (
              <span className="flex items-center gap-1 text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                <Star size={10} className="fill-yellow-500 text-yellow-500" />
                Bright Outlook
              </span>
            )}
            {career.in_demand && (
              <span className="flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                🔥 In Demand
              </span>
            )}
          </div>
        </div>

        {/* Title & Domain */}
        <div className="mt-4">
          <span className={`text-xs font-semibold uppercase tracking-wider ${colors.accent}`}>
            {career.domain}
          </span>
          <h3 className="mt-1 text-gray-900 font-bold text-lg leading-snug group-hover:text-indigo-700 transition-colors">
            {career.title}
          </h3>
          {career.description && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
              {career.description}
            </p>
          )}
        </div>

        {/* Salary */}
        {medianSalary && (
          <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{medianSalary}</span>
              <span className="text-xs text-gray-400">/year median</span>
            </div>
            {salaryLow && salaryHigh && (
              <p className="text-xs text-gray-400 mt-1">
                Range: {salaryLow} – {salaryHigh}
              </p>
            )}
          </div>
        )}

        {/* Education */}
        {career.education && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <GraduationCap size={14} className="shrink-0 text-gray-400" />
            <span className="line-clamp-1">{career.education}</span>
          </div>
        )}

        {/* Growth */}
        {career.growth && (
          <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
            <TrendingUp size={14} className="shrink-0 mt-0.5 text-gray-400" />
            <span className="line-clamp-2 text-xs">{career.growth}</span>
          </div>
        )}

        {/* Skills */}
        {career.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {career.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.badge}`}
              >
                {skill}
              </span>
            ))}
            {career.skills.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-500">
                +{career.skills.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="flex items-center gap-1 text-sm font-medium text-gray-400">
            <Briefcase size={13} />
            O*NET #{career.id}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
            View Details
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}