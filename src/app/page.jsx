"use client";

import Image from "next/image";
import Link from "next/link";
import Roadmap from "@/components/Roadmap";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
    const router = useRouter();
  const [hasResult, setHasResult] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("aptitudeResult");
    setHasResult(!!stored);
  }, []);

  return (
    <div className="w-full">

      {/* 🔹 Trending Marquee */}
      <div className="w-full bg-black text-white py-2 text-xs sm:text-sm text-center">
        <marquee behavior="scroll" direction="left">
          The Computer Field seems emerging on a large scale as there are new
          trends showing up and leading to opportunities...
        </marquee>
      </div>
 
      {/* 🔹 Hero Section */}
      <section className="w-full bg-white px-4 md:px-20 py-10 md:py-12 flex flex-col md:flex-row items-center gap-8 md:gap-10">

        {/* Left Text */}
        <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">

          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            Discover Your Perfect <br />
            <span className="text-blue-600">Career Path</span>
          </h1> 

          <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify max-w-3xl mx-auto">
            AI-powered career guidance to help you navigate from 10th grade
            through college and beyond. Get personalized recommendations,
            connect with mentors, and explore trending careers.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">

            {/* AI Assistant */}
            <Link href="/chatbot">
              <button className="w-full sm:w-max px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition flex items-center gap-3">
                <span>Meet Your Personal AI Assistant</span>
                <Image
                  src="/assets/bot.png"
                  alt="AI Assistant"
                  width={48}
                  height={48}
                />
              </button>
            </Link> 

            {/* Aptitude Test */}
          {hasResult ? (
              <button
                onClick={() => router.push("/results")}
                className="px-18 py-4 
                text-lg font-semibold 
                bg-green-500 text-white 
                rounded-2xl 
                shadow-lg 
                hover:bg-green-600 
                transition"
              >
                View My Results
              </button>
            ) : (
              <button
                onClick={() => router.push("/aptitude")}
                className="px-6 py-2 border-2 border-black rounded-xl"
              >
                Take Aptitude Test
              </button>
            )}

          </div>
        </div> 

        {/* Right Image */}
         <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/assets/hero.jpg"
            alt="Students"
            width={500}
            height={400}
            className="rounded-xl shadow-md w-full max-w-sm md:max-w-full"
          />
        </div>
      </section>

      <Roadmap />
    </div>
  );
}
