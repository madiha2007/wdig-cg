"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardBanner from "@/components/DashboardBanner";
import { auth } from "../../../firebase";

export default function DashboardPage() {
  const router = useRouter();
  const [status, setStatus] = useState("NOT_STARTED");
  const [progress, setProgress] = useState(0);
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser?.displayName) {
        setUserName(firebaseUser.displayName);
      } else {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
          const parsedUser = JSON.parse(userRaw);
          if (parsedUser?.name) setUserName(parsedUser.name);
        }
      }

      const result = localStorage.getItem("aptitudeResult");
      const savedProgress = localStorage.getItem("aptitudeProgress");

      let parsedResult = null;
      try {
        parsedResult = result ? JSON.parse(result) : null;
      } catch {}

      if (parsedResult?.completed === true) {
        setStatus("COMPLETED");
        setProgress(100);
        return;
      }

      if (savedProgress !== null) {
        const parsedProgress = Number(savedProgress);
        if (
          Number.isFinite(parsedProgress) &&
          parsedProgress > 0 &&
          parsedProgress < 100
        ) {
          setStatus("IN_PROGRESS");
          setProgress(parsedProgress);
          return;
        }
      }

      setStatus("NOT_STARTED");
      setProgress(0);
    } catch (err) {
      console.error("Dashboard init error:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb] px-6 py-8">
      {/* Banner */}
      <DashboardBanner
        status={status}
        userName={userName}
        onAction={() =>
          status === "COMPLETED"
            ? router.push("/explore-careers")
            : router.push("/aptitude-test")
        }
      />

      {/* ===== Stats Section (Inspired by UI) ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Career Matches", value: 6 },
          { label: "Courses Saved", value: 8 },
          { label: "Assessments Done", value: "2/5" },
          { label: "Paths Explored", value: 24 },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl p-6 shadow-sm border"
          >
            <p className="text-3xl font-semibold mb-1">{item.value}</p>
            <p className="text-gray-500 text-sm">{item.label}</p>
          </div>
        ))}
      </section>

      {/* ===== Feature Cards ===== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {[
          {
            title: "AI Aptitude Assessment",
            desc: "Take aptitude specialized test",
            route: "/aptitude-test",
          },
          {
            title: "College Recommendations",
            desc: "Get personalized college suggestions",
            route: "/colleges",
          },
          {
            title: "Career Roadmaps",
            desc: "Access detailed career roadmaps",
            route: "/roadmaps",
          },
          {
            title: "Connect with Mentors",
            desc: "Get guidance from industry experts",
            route: "/mentors",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 shadow-sm border flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm">{card.desc}</p>
            </div>

            <button
              onClick={() => router.push(card.route)}
              className="mt-6 text-sky-600 font-medium hover:underline"
            >
              Get Started →
            </button>
          </div>
        ))}
      </section>

      {/* ===== Status Sections ===== */}

      {status === "NOT_STARTED" && (
        <section className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-10">
          <h3 className="text-xl font-semibold mb-6">
            What you’ll unlock after the test 🔓
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Personalized Career Matches",
              "Skill Strength & Weakness Analysis",
              "Career Match Percentage",
              "Personal Learning Roadmap",
            ].map((item) => (
              <div
                key={item}
                className="relative border border-dashed rounded-2xl p-6 text-gray-400"
              >
                <span className="absolute top-4 right-4">🔒</span>
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      {status === "IN_PROGRESS" && (
        <section className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm p-10">
          <h2 className="text-2xl font-semibold mb-2">
            Resume Your Aptitude Test
          </h2>
          <p className="text-gray-600 mb-6">
            You’re almost done. Complete the test to unlock your results.
          </p>

          <div className="w-full bg-gray-200 h-3 rounded-full mb-4">
            <div
              className="bg-black h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-sm text-gray-500 mb-6">
            {progress}% completed
          </div>

          <button
            onClick={() => router.push("/aptitude-test")}
            className="bg-black text-white px-8 py-3 rounded-xl"
          >
            Resume Test
          </button>
        </section>
      )}
    </div>
  );
}
