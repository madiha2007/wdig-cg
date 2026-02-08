"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Edit3,
  Target,
  TrendingUp,
  Award,
  Clock,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Sparkles,
  Brain,
  Heart,
  Zap,
  CheckCircle2,
  Settings,
  Download,
  Share2,
  Calendar,
  MapPin,
  Briefcase,
  Code,
  Palette,
  MessageCircle,
  BookOpen,
} from "lucide-react";

import { auth } from "../../firebase";
import ProfileEditForm from "./profile-edit-form";

// Mock data - replace with actual API calls
const mockUser = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "Student",
  avatar: null, // Will use initials fallback
  phone: "+1 234 567 8900",
  education: "Undergraduate",
  location: "Mumbai, India",
  joinedDate: "January 2024",
  bio: "Passionate about technology and helping others find their career path",
};

const mockStats = {
  assessmentsTaken: 3,
  savedCareers: 12,
  progressPercentage: 68,
  skillsAnalyzed: 15,
};

const mockSkills = [
  { name: "Logical Reasoning", score: 85, icon: <Brain className="w-4 h-4" /> },
  { name: "Creativity", score: 72, icon: <Palette className="w-4 h-4" /> },
  { name: "Communication", score: 90, icon: <MessageCircle className="w-4 h-4" /> },
  { name: "Technical Skills", score: 78, icon: <Code className="w-4 h-4" /> },
  { name: "Leadership", score: 65, icon: <Award className="w-4 h-4" /> },
];

const mockInterests = [
  "UI/UX Design",
  "Data Science",
  "Product Management",
  "Artificial Intelligence",
  "Digital Marketing",
  "Software Engineering",
];

const mockCareers = [
  {
    id: 1,
    title: "UX Designer",
    match: 94,
    icon: <Palette className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    title: "Data Analyst",
    match: 87,
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Product Manager",
    match: 82,
    icon: <Briefcase className="w-5 h-5" />,
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 4,
    title: "Software Engineer",
    match: 79,
    icon: <Code className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500",
  },
];

const mockActivity = [
  {
    id: 1,
    type: "assessment",
    title: "Completed Aptitude Test",
    date: "2 days ago",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "bg-green-500",
  },
  {
    id: 2,
    type: "career",
    title: "Explored UX Designer Path",
    date: "5 days ago",
    icon: <MapPin className="w-5 h-5" />,
    color: "bg-purple-500",
  },
  {
    id: 3,
    type: "update",
    title: "Updated Profile Information",
    date: "1 week ago",
    icon: <User className="w-5 h-5" />,
    color: "bg-blue-500",
  },
  {
    id: 4,
    type: "assessment",
    title: "Started Skills Assessment",
    date: "2 weeks ago",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-orange-500",
  },
];

export default function UserProfile() {
  const [user, setUser] = useState(mockUser);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          ...user,
          name: firebaseUser.displayName || user.name,
          email: firebaseUser.email || user.email,
          avatar: firebaseUser.photoURL || null,
        });
      }
    });
    return () => unsub();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

   const handleSaveProfile = (updatedData: typeof mockUser) => {
    // Save to backend
    console.log('Saving:', updatedData);
    // Update local state
    setUser(updatedData);
  };


  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);


  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500"
    >
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Header */}
        <motion.section
          style={{ y: headerY, opacity: headerOpacity }}
          className="relative"
        >
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            {/* Gradient Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
            
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar with Animated Ring */}
              <div className="relative group">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-opacity"
                />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-1">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={128}
                      height={128}
                      className="rounded-full w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                      <span className="text-4xl font-bold bg-gradient-to-br from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {getInitials(user.name)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Status Indicator */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white dark:border-slate-900"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    {user.role}
                  </span>
                </div>

                <div className="space-y-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinedDate}</span>
                  </div>
                </div>

                <p className="mt-4 text-slate-700 dark:text-slate-300 max-w-2xl">
                  {user.bio}
                </p>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditMode(!isEditMode)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Assessments Taken",
              value: mockStats.assessmentsTaken,
              icon: <CheckCircle2 className="w-6 h-6" />,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-500/10",
            },
            {
              label: "Saved Careers",
              value: mockStats.savedCareers,
              icon: <Heart className="w-6 h-6" />,
              color: "from-pink-500 to-rose-500",
              bgColor: "bg-pink-500/10",
            },
            {
              label: "Progress",
              value: `${mockStats.progressPercentage}%`,
              icon: <TrendingUp className="w-6 h-6" />,
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-500/10",
            },
            {
              label: "Skills Analyzed",
              value: mockStats.skillsAnalyzed,
              icon: <Brain className="w-6 h-6" />,
              color: "from-purple-500 to-violet-500",
              bgColor: "bg-purple-500/10",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredStat(index)}
              onHoverEnd={() => setHoveredStat(null)}
              className="relative group"
            >
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                      {stat.icon}
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      rotate: hoveredStat === index ? 360 : 0,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className={`w-5 h-5 ${hoveredStat === index ? 'text-yellow-500' : 'text-slate-400'}`} />
                  </motion.div>
                </div>

                <motion.div
                  animate={{ scale: hoveredStat === index ? 1.1 : 1 }}
                  className="text-3xl font-bold bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-1"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>

                {/* Progress Bar for Progress stat */}
                {stat.label === "Progress" && (
                  <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mockStats.progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Skills & Interests */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Skill Strengths
                </h2>
                <Brain className="w-6 h-6 text-purple-600" />
              </div>

              <div className="space-y-4">
                {mockSkills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-purple-600 dark:text-purple-400">
                          {skill.icon}
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {skill.score}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.score}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-600 transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Career Interests */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Career Interests
                </h2>
                <Target className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex flex-wrap gap-3">
                {mockInterests.map((interest, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 font-medium hover:border-purple-400 dark:hover:border-purple-600 transition-colors cursor-pointer"
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.section>

            {/* Recommended Careers Carousel */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Recommended Career Paths
                </h2>
                <Award className="w-6 h-6 text-orange-600" />
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-8 px-8">
                {mockCareers.map((career, index) => (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="min-w-[280px] snap-center"
                  >
                    <div className="h-full bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${career.color} flex items-center justify-center text-white mb-4`}>
                        {career.icon}
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {career.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {career.match}%
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Match
                        </span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                      >
                        Explore
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Right Column - Activity & Settings */}
          <div className="space-y-8">
            {/* Activity Timeline */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Recent Activity
                </h2>
                <Clock className="w-6 h-6 text-slate-600" />
              </div>

              <div className="space-y-4">
                {mockActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4 group"
                  >
                    {/* Connector Line */}
                    {index < mockActivity.length - 1 && (
                      <div className="absolute left-5 top-12 w-px h-12 bg-slate-200 dark:bg-slate-700" />
                    )}

                    <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      {activity.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {activity.date}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Quick Settings */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Quick Settings
                </h2>
                <Settings className="w-6 h-6 text-slate-600" />
              </div>

              <div className="space-y-4">
                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Notifications
                    </span>
                  </div>
                  <motion.button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      notifications
                        ? "bg-gradient-to-r from-purple-500 to-blue-500"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <motion.div
                      animate={{ x: notifications ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </motion.button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Dark Mode
                    </span>
                  </div>
                  <motion.button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      darkMode
                        ? "bg-gradient-to-r from-purple-500 to-blue-500"
                        : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  >
                    <motion.div
                      animate={{ x: darkMode ? 24 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </motion.button>
                </div>

                {/* Action Buttons */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Download Report
                  </span>
                  <Download className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 transition-colors" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Share Profile
                  </span>
                  <Share2 className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full p-4 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-red-600 dark:text-red-400">
                    Logout
                  </span>
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </motion.button>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Logout
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to logout? You'll need to sign in again to access your profile.
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    auth.signOut();
                    setShowLogoutModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium shadow-lg hover:shadow-xl transition-shadow"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

