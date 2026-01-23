"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const roadmapData = [
  {
    level: "Level 1",
    title: "Discover Yourself",
    path: "/",
    description:
      "Kick off your journey by understanding who you truly are. Our interactive aptitude and personality tests uncover your natural strengths, interests, and hidden potential — helping you build clarity from day one.",
    img: "/roadmap/level1.png",
  },
  {
    level: "Level 2",
    title: "Unlock Career Matches",
    path: "/",
    description:
      "Watch your possibilities open up! Based on your results, our AI instantly unlocks career paths that genuinely match your skills, mindset, and passions — no guesswork, only smart choices.",
    img: "/roadmap/level2.png",
  },
  {
    level: "Level 3",
    title: "Choose Your Roadmap",
    path: "",
    description:
      "No more confusion about “what next?”. Get crystal-clear, step-by-step roadmaps for each career, covering skills to learn, exams to crack, certifications to earn, and milestones to achieve.",
    img: "/roadmap/level3.png",
  },
  {
    level: "Level 4",
    title: "Explore Trending Careers",
    path: "",
    description:
      "See trending careers in your field of interest and get insights into emerging opportunities.",
    img: "/roadmap/level4.png",
  },
  {
    level: "Level 5",
    title: "Explore Best Institutes",
    path: "/institute",
    description:
      "Find the right place to grow. We recommend top colleges, institutes, and courses tailored to your career path, preferences, and location — so every decision moves you forward.",
    img: "/roadmap/level5.png",
  },
  {
    level: "Level 6",
    title: "Connect With Mentors",
    path: "/mentor",
    description:
      "Learn from those who’ve already walked the path. Connect with experienced mentors through 1-on-1 or community sessions, get real-world advice, and gain insights no textbook can offer.",
    img: "/roadmap/level6.png",
  },
  {
    level: "Level 7",
    title: "Talk to AI Career Bot",
    path: "/chatbot",
    description:
      "Get instant career advice from our AI-powered chatbot. Ask questions, get personalized guidance, and explore career paths in real-time.",
    img: "/roadmap/level7.png",
  },
];

export default function Roadmap() {
  return (
    <section className="w-full bg-sky-100 py-12 md:py-20 px-4 md:px-20 relative overflow-hidden">

      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Your <span className="text-sky-600">AI-Powered</span> Career Journey
        </h2>
      </div>

      {/* Timeline Cards */}
      <div className="space-y-10">
        {roadmapData.map((step, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <Link href={step.path || "#"} key={index} className="block">
              <motion.div
                className={`flex flex-col md:flex-row items-center gap-16 
                rounded-3xl p-10 
                bg-white/60 backdrop-blur-md
                shadow-lg hover:shadow-2xl transition-all duration-500
                ${isReversed ? "md:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                {/* Image */}
                <motion.div
                  className="w-32 md:w-1/5"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.05, rotate: isReversed ? -2 : 2 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                >
                  <Image
                    src={step.img}
                    alt={step.title}
                    width={200}
                    height={200}
                    className="w-full mx-auto drop-shadow-xl"
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  className="flex-1 relative text-center md:text-left"
                  initial={{ x: isReversed ? -100 : 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -z-10 w-40 h-40 bg-sky-200 rounded-full blur-3xl opacity-40 top-0 -left-10"></div>

                  <motion.span
                    className="text-2xl md:text-3xl text-sky-700 font-semibold"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {step.level}
                  </motion.span>

                  <motion.h4
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {step.title}
                  </motion.h4>

                  <motion.p
                    className="text-gray-600 text-base md:text-lg leading-relaxed
                    text-justify md:text-left max-w-prose mx-auto md:mx-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
