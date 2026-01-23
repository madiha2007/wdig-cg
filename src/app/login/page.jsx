"use client"; // Next.js Client Component

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signInWithGoogle } from "../../../firebase"; // adjust path to your firebase.js
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    // Replace with real login logic
    setTimeout(() => {
      setLoading(false);
      alert("Logged in successfully!");
      router.push("/"); // redirect after login
    }, 1200);
  };

  return (
    <div className="min-h-screen text-black">

      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row items-center gap-12">

        {/* LEFT SIDE (Animation) */}
        <motion.section
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block flex-1 text-center lg:text-left"
        >
          <h1 className="text-4xl md:text-5xl mb-4 bg-clip-text text-black">
            Welcome Back
          </h1>
          <h1 className="text-4xl md:text-5xl mb-4 bg-clip-text text-sky-600">
            Continue Your Career Journey
          </h1>
          <p className="text-black/70 max-w-xl mt-8 mb-6">
            Continue exploring AI-powered career guidance, personalized recommendations, and connect with mentors to accelerate your professional growth.
          </p>
        </motion.section>

        {/* RIGHT CARD (Animation) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full md:w-[520px]"
        >
          <div className="rounded-2xl p-8 bg-white/5 border border-black/20 backdrop-blur-sm shadow-xl">
            <h3 className="text-2xl font-bold mb-1">Log in to your account</h3>
            <p className="text-black/70 mb-6">
              Enter your credentials to access your dashboard
            </p>

            {/* Google Login (Updated Professional Style) */}
            <button
              onClick={async () => {
                try {
                  const result = await signInWithGoogle();
                  console.log("User:", result.user);
                  alert("Logged in successfully!");
                  router.push("/"); // redirect if needed
                } catch (error) {
                  console.error(error);
                  alert("Google login failed. Please try again.");
                }
              }}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition text-gray-700 shadow-sm mb-5"
            >
              {/* Google Logo */}
              <img
                src="/google.svg"
                alt="Google"
                style={{ width: "30px", height: "30px" }}
              />
              <span className="font-medium">Sign in with Google</span>
            </button>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-black/80">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full p-3 rounded-lg bg-white/10 border border-black/20 outline-none"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-black/80">Password</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-lg bg-white/10 border border-black/20 outline-none pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-9 right-3 text-sm text-sky-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-sky-600 underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-gray-900 
                          bg-gradient-to-r from-sky-300 via-purple-300 to-fuchsia-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-sm text-black/70 mt-4 text-center">
              Don’t have an account?{" "}
              <Link href="/signup" className="underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
