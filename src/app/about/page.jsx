"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { auth } from "../../../firebase";
import { useEffect, useState, useRef } from "react";
import {
  Lightbulb,
  Target,
  Rocket,
  Trophy,
  Users,
  Brain,
  TrendingUp,
  Shield,
  Sparkles,
  Heart,
  Code,
  Palette,
  Search,
  CheckCircle2,
} from "lucide-react";

const timeline = [
  {
    title: "Problem Identification",
    subtitle: "Understanding the Gap",
    desc: "We observed that students struggle to choose careers due to lack of personalized guidance and self-awareness.",
    icon: <Search className="w-6 h-6" />,
    color: "from-red-500 to-orange-500",
    stats: "73% of students feel uncertain about their career path",
  },
  {
    title: "Idea Formation",
    subtitle: "The Breakthrough Moment",
    desc: "The idea emerged to combine aptitude assessment with structured career exploration.",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "from-yellow-500 to-amber-500",
    stats: "One platform, infinite possibilities",
  },
  {
    title: "Development",
    subtitle: "Building the Solution",
    desc: "We designed and implemented a web-based system with assessments, profiles, and progress tracking.",
    icon: <Rocket className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-500",
    stats: "6 months of dedicated development",
  },
  {
    title: "Outcome",
    subtitle: "Making an Impact",
    desc: "A personalized career guidance platform suitable for students and early professionals.",
    icon: <Trophy className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    stats: "Empowering the next generation",
  },
];

const team = [
  {
    name: "Frontend Developer",
    img: "/assets/team/frontend.jpeg",
    role: "Crafting User Experiences",
    icon: <Code className="w-5 h-5" />,
    color: "bg-blue-500",
    skills: ["React", "Next.js", "Tailwind"],
  },
  {
    name: "Backend Developer",
    img: "/assets/team/backend.jpeg",
    role: "Building the Foundation",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-green-500",
    skills: ["Firebase", "APIs", "Security"],
  },
  {
    name: "Assessment & Researcher ",
    img: "/assets/team/research.jpeg",
    role: "Designing the Science",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-purple-500",
    skills: ["Analytics", "Testing"],
  },
  {
    name: "UI/UX Designer",
    img: "/assets/team/ui.jpeg",
    role: "Shaping the Journey",
    icon: <Palette className="w-5 h-5" />,
    color: "bg-pink-500",
    skills: ["Figma", "Design Systems", "UX"],
  },
];

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Aptitude-based Assessment",
    desc: "Scientific evaluation of strengths and interests",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Progress-based Unlocking",
    desc: "Structured career exploration as you grow",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure User Profiles",
    desc: "Your data is protected and private",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Intuitive Interface",
    desc: "Clean design that feels natural to use",
  },
];

const stats = [
  { value: "100+", label: "Career Paths" },
  { value: "50+", label: "Assessment Questions" },
  { value: "10+", label: "Skill Categories" },
  { value: "24/7", label: "Access" },
];

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return () => unsub();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20 transition-colors"
    >
      {/* Hero Section */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[85vh] flex items-center justify-center px-6 py-20 overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Final Year Project 2024-2025
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight"
          >
            Guiding the Next Generation
            <br />
            Toward Their Future
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            We're building a career guidance platform that transforms confusion
            into clarity, helping students discover their true potential through
            science-backed assessments and personalized insights.
          </motion.p>

          {user && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome back, <strong>{user.email}</strong>
              </span>
            </motion.div>
          )}

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {/* The Problem Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  The Challenge
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Students Feel Lost
                <br />
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  And We Understood Why
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Every year, millions of students face one of life's biggest
                decisions with little guidance. Traditional career counseling is
                generic, expensive, or simply unavailable.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                We saw friends, peers, and ourselves struggle with this. It
                wasn't just about choosing a job—it was about finding purpose.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/5 dark:to-orange-500/5 rounded-3xl p-8 backdrop-blur-sm border border-red-200 dark:border-red-800">
                <div className="space-y-4">
                  {[
                    "73% of students feel uncertain about career choices",
                    "Limited access to personalized guidance",
                    "Generic advice that doesn't fit individual strengths",
                    "Pressure to decide without self-awareness",
                  ].map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400" />
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {point}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Journey Timeline */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From identifying the problem to building a solution that matters
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 dark:from-blue-400 dark:via-purple-400 dark:to-green-400" />

            <div className="space-y-16">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`relative flex items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {item.icon}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full md:w-[calc(50%-4rem)] ${
                      i % 2 === 0
                        ? "md:pr-16 pl-24 md:pl-0"
                        : "md:pl-16 pl-24 md:pr-0"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl font-bold text-gray-200 dark:text-gray-700">
                          0{i + 1}
                        </span>
                        <div
                          className={`h-1 flex-1 bg-gradient-to-r ${item.color} rounded-full`}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4">
                        {item.subtitle}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="italic">{item.stats}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built with intention, designed for impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Meet the Team
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Built by Students,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                For Students
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Four passionate individuals who came together with a shared mission:
              making career guidance accessible to everyone
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all overflow-hidden">
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 ${member.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-3xl`}
                  />

                  {/* Profile Image */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-gray-100 dark:ring-gray-700 group-hover:ring-8 transition-all">
                      <Image
                        src={member.img}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Icon Badge */}
                    <div
                      className={`absolute bottom-0 right-1/2 translate-x-16 ${member.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg`}
                    >
                      {member.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {member.role}
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Team Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-800">
              <div className="absolute top-6 left-6 text-6xl text-blue-300 dark:text-blue-700 opacity-50">
                "
              </div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 italic text-center leading-relaxed relative z-10">
                We're not just building a project for grades. We're creating a
                tool we wish we had when we were making our own career decisions.
                This is personal.
              </p>
              <div className="absolute bottom-6 right-6 text-6xl text-purple-300 dark:text-purple-700 opacity-50">
                "
              </div>
            </div>
          </motion.div>
        </section>

        {/* Vision Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 p-12 md:p-20 text-center"
          >
            {/* Animated Background */}
            <div className="absolute inset-0">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              />
            </div>

            <div className="relative z-10">
              <Target className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our Vision
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                To help students make informed career decisions through structured
                self-assessment and guided exploration instead of guesswork. We
                envision a future where every student has access to personalized
                career guidance that understands their unique strengths and
                aspirations.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Impact Statement */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              This Is More Than a Project
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              It's our contribution to solving a real problem that affects millions
              of students. We hope this platform helps someone find their path—just
              like we're finding ours through building it.
            </p>
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Final Year Project | Career Guidance Application
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Built with dedication, designed with empathy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}