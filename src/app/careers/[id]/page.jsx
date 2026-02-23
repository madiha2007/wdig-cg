// app/careers/[id]/page.jsx
import { ArrowLeft, TrendingUp, GraduationCap, ExternalLink, Star, Briefcase, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const ONET_BASE = "https://services.onetcenter.org/ws";

async function getCareerDetails(code) {
  const auth = Buffer.from(
    `${process.env.ONET_USERNAME}:${process.env.ONET_PASSWORD}`
  ).toString("base64");

  const headers = { Authorization: `Basic ${auth}`, Accept: "application/json" };

  const [detailRes, wagesRes, tasksRes, knowledgeRes] = await Promise.all([
    fetch(`${ONET_BASE}/occupations/${code}/summary`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/occupations/${code}/details/wages`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/occupations/${code}/details/tasks`, { headers, next: { revalidate: 3600 } }),
    fetch(`${ONET_BASE}/occupations/${code}/details/knowledge`, { headers, next: { revalidate: 3600 } }),
  ]);

  const detail = detailRes.ok ? await detailRes.json() : {};
  const wagesData = wagesRes.ok ? await wagesRes.json() : {};
  const tasksData = tasksRes.ok ? await tasksRes.json() : {};
  const knowledgeData = knowledgeRes.ok ? await knowledgeRes.json() : {};

  const nationalWage = wagesData.wages?.find((w) => w.scope === "National") || wagesData.wages?.[0];

  return {
    code,
    title: detail.title || code,
    description: detail.description || "",
    bright_outlook: detail.bright_outlook || false,
    in_demand: detail.in_demand || false,
    education: detail.education?.level_required?.category || [],
    skills: (detail.skills?.element || []).slice(0, 10),
    abilities: (detail.abilities?.element || []).slice(0, 6),
    tasks: (tasksData.task || []).slice(0, 8),
    knowledge: (knowledgeData.element || []).slice(0, 6),
    salary: nationalWage ? {
      median: nationalWage.annual_median,
      low: nationalWage.annual_10th_percentile,
      high: nationalWage.annual_90th_percentile,
      hourly_median: nationalWage.hourly_median,
    } : null,
    growth: detail.job_outlook?.outlook?.description || null,
    onet_link: `https://www.onetonline.org/link/summary/${code}`,
    related: (detail.related_occupations?.occupation || []).slice(0, 4),
  };
}

function formatSalary(amount) {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(amount);
}

export default async function CareerDetailPage({ params }) {
  const { id } = params;
  // O*NET codes use dots in URLs — convert hyphens back if needed
  const code = id.replace(/-/g, ".");

  let career;
  try {
    career = await getCareerDetails(code);
  } catch (err) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p className="text-red-500 text-lg">Failed to load career details.</p>
          <Link href="/explore-careers" className="mt-4 inline-block text-indigo-600 hover:underline">
            ← Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <Link
            href="/explore-careers"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Explore
          </Link>

          <div className="flex flex-wrap items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {career.bright_outlook && (
                  <span className="flex items-center gap-1 text-xs font-semibold bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 px-3 py-1 rounded-full">
                    <Star size={10} className="fill-yellow-300" />
                    Bright Outlook
                  </span>
                )}
                {career.in_demand && (
                  <span className="text-xs font-semibold bg-green-400/20 border border-green-400/30 text-green-300 px-3 py-1 rounded-full">
                    🔥 In Demand
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{career.title}</h1>
              <p className="text-blue-200 text-sm mt-2 font-mono">O*NET Code: {career.code}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Median Salary", value: formatSalary(career.salary?.median), sub: "per year" },
            { label: "Hourly Rate", value: career.salary?.hourly_median ? `$${career.salary.hourly_median}/hr` : "—", sub: "median" },
            { label: "Salary Low", value: formatSalary(career.salary?.low), sub: "10th percentile" },
            { label: "Salary High", value: formatSalary(career.salary?.high), sub: "90th percentile" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        {career.description && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About This Career</h2>
            <p className="text-gray-600 leading-relaxed">{career.description}</p>
          </div>
        )}

        {/* Growth Outlook */}
        {career.growth && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-indigo-600" />
              <h2 className="font-bold text-indigo-900">Job Outlook</h2>
            </div>
            <p className="text-indigo-800 text-sm leading-relaxed">{career.growth}</p>
          </div>
        )}

        {/* Education & Skills */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Education */}
          {career.education?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={18} className="text-gray-500" />
                <h2 className="font-bold text-gray-900">Education Required</h2>
              </div>
              <ul className="space-y-2">
                {career.education.map((edu) => (
                  <li key={edu.name} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                    {edu.name}
                    {edu.score && (
                      <span className="ml-auto text-xs text-gray-400">{Math.round(edu.score)}%</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top Skills */}
          {career.skills?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Top Skills</h2>
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill) => (
                  <span
                    key={skill.name || skill}
                    className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full font-medium border border-indigo-100"
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Tasks */}
        {career.tasks?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-gray-500" />
              <h2 className="font-bold text-gray-900">What You'll Do</h2>
            </div>
            <ul className="space-y-3">
              {career.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {task.name || task.statement || task}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Knowledge Areas */}
        {career.knowledge?.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Knowledge Areas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {career.knowledge.map((k) => (
                <div key={k.name || k} className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium border border-gray-100">
                  {k.name || k}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Careers */}
        {career.related?.length > 0 && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4">Related Careers</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {career.related.map((rel) => {
                const relId = rel.code?.replace(/\./g, "-");
                return (
                  <Link
                    key={rel.code}
                    href={`/careers/${relId}`}
                    className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group"
                  >
                    <p className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">{rel.title}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{rel.code}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* O*NET Link */}
        <div className="text-center pb-10">
          <a
            href={career.onet_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200"
          >
            View Full Profile on O*NET
            <ExternalLink size={15} />
          </a>
          <p className="text-xs text-gray-400 mt-3">
            Data sourced from O*NET OnLine, U.S. Department of Labor
          </p>
        </div>
      </div>
    </div>
  );
}