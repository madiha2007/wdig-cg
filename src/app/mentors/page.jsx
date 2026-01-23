"use client"; // needed because we use useRouter for navigation

import { useRouter } from "next/navigation";
import { Clock, Video, Calendar } from "lucide-react";

export default function MentorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <section className="text-center py-14 px-4">
        <h1 className="text-4xl font-extrabold mb-3">
          Mentorship <span className="text-sky-600">Programs</span>
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Choose how you want to learn — personalized 1-on-1 guidance or
          collaborative community sessions.
        </p>
      </section>

      {/* CARDS */}
      <section className="px-4 md:px-20 pb-20">
        <div className="grid gap-20 md:grid-cols-2 max-w-5xl mx-auto">

          {/* ONE ON ONE CARD */}
          <div className="relative group">
            {/* Glow Layer */}
            <div className="absolute -inset-[2px] rounded-2xl 
                bg-gradient-to-r from-sky-400 to-blue-600 
                blur opacity-30 group-hover:opacity-60 transition">
            </div>

            {/* Card */}
            <div className="relative bg-white rounded-2xl p-6 shadow-lg transition">
              {/* Top Row */}
              <div className="flex justify-between items-center mb-4">
                <img
                  src="/icons/one-on-one.png"
                  alt="One on One"
                  className="w-10 h-10"
                />
                <span className="bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Paid Sessions
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">1-on-1 Mentorship</h2>
              <p className="text-gray-600 mb-5">
                Get personalized career guidance from industry mentors tailored
                to your goals, skills, and career stage.
              </p>

              <div className="space-y-3 text-sm text-gray-700 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>30–60 minutes per session</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video size={16} />
                  <span>Video call or chat support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Flexible scheduling</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/mentors/one-on-one")}
                className="w-full bg-sky-700 text-white py-2 rounded-xl font-semibold hover:opacity-90"
              >
                Explore 1-on-1 Mentors
              </button>
            </div>
          </div>

          {/* COMMUNITY CARD */}
          <div className="relative group">
            {/* Glow Layer */}
            <div className="absolute -inset-[2px] rounded-2xl 
                bg-gradient-to-r from-fuchsia-400 to-purple-600 
                blur opacity-30 group-hover:opacity-60 transition">
            </div>

            {/* Card */}
            <div className="relative bg-white rounded-2xl p-6 shadow-lg transition">
              {/* Top Row */}
              <div className="flex justify-between items-center mb-4">
                <img
                  src="/icons/community.png"
                  alt="Community"
                  className="w-10 h-10"
                />
                <span className="bg-fuchsia-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Free & Paid
                </span>
              </div>

              <h2 className="text-xl font-bold mb-2">Community Sessions</h2>
              <p className="text-gray-600 mb-5">
                Learn with peers through live group sessions, expert talks,
                Q&A discussions, and career workshops.
              </p>

              <div className="space-y-3 text-sm text-gray-700 mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Weekly live sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video size={16} />
                  <span>Live video + chat interaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Fixed schedule</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/mentors/community")}
                className="w-full border bg-fuchsia-600 text-sky-600 py-2 rounded-xl font-semibold hover:bg-fuchsia-500 text-white"
              >
                View Community Programs
              </button>
            </div>
          </div>

        </div>
      </section>

      <p className="text-xs text-gray-500 text-center m-3">
        Verified mentors • Secure sessions
      </p>

    </div>
  );
}
