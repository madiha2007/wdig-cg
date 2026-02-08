"use client"; // this is required for client components

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase"; // adjust if firebase.js is elsewhere
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Full name is required";
    if (!form.email.includes("@")) err.email = "Enter a valid email";
    if (!form.phone.match(/^[0-9]{10}$/))
      err.phone = "Enter a valid 10-digit phone number";
    if (form.password.length < 6)
      err.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      await updateProfile(userCred.user, {
        displayName: form.name.trim(),
      });

      router.push("/login");
      await updateProfile(userCred.user, {
  displayName: form.name.trim(),
});

// Save user info locally for quick access
localStorage.setItem(
  "user",
  JSON.stringify({
    name: form.name.trim(),
    email: userCred.user.email,
    uid: userCred.user.uid,
  })
);

// Redirect straight to dashboard
router.push("/dashboard");

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErrors({ email: "Email already registered" });
      } else {
        setErrors({ general: "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gray-50">

      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left marketing panel */}
        <section className="hidden lg:block flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Start Your Journey To
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-sky-600">
            Career Success
          </h1>
          <p className="text-black/70 max-w-xl mt-8 mb-6">
            Join thousands of students and professionals discovering their perfect career path with AI-powered guidance, personalized recommendations, and expert mentorship.
          </p>

          <div className="max-w-xl py-6">
            {[
              {
                title: "AI-Powered Assessments",
                desc: "Discover your strengths and ideal career matches",
              },
              {
                title: "Personalized Recommendations",
                desc: "Get college and career suggestions tailored to you",
              },
              {
                title: "Expert Mentorship",
                desc: "Connect with industry mentors for guidance",
              },
            ].map((item, i) => (
              <div key={i} className="mb-4">
                <p className="flex items-center gap-2 text-black font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#5aa4cb"
                      d="M5.7 6.71a.996.996 0 0 0 0 1.41L9.58 12L5.7 15.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L7.12 6.71c-.39-.39-1.03-.39-1.42 0"
                    />
                    <path
                      fill="#5aa4cb"
                      d="M12.29 6.71a.996.996 0 0 0 0 1.41L16.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L13.7 6.7c-.38-.38-1.02-.38-1.41.01"
                    />
                  </svg>
                  {item.title}
                </p>
                <p className="text-black/60 text-sm ml-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right registration card */}
        <section className="w-full md:w-[520px]">
          <div className="rounded-2xl p-8 bg-white/5 border border-black/20 backdrop-blur-sm shadow-xl">
            <h3 className="text-2xl font-bold mb-1">Create your account</h3>
            <p className="text-black/70 mb-6">
              Enter your details to get started with your career journey
            </p>

            {errors.general && (
              <p className="text-red-300 text-sm mb-3">{errors.general}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-black/80">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Aisha Patel"
                  className="w-full p-3 rounded-lg bg-white/10 border border-black/20 outline-none"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-black/80">Email address</label>
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

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-black/80">Phone number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="10-digit phone number"
                  className="w-full p-3 rounded-lg bg-white/10 border border-black/20 outline-none"
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1 relative">
                <label className="text-sm font-medium text-black/80">Password</label>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 6 characters"
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

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-black/80">Confirm password</label>
                <input
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="w-full p-3 rounded-lg bg-white/10 border border-black/20 outline-none"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-gray-900 bg-gradient-to-r from-sky-300 via-purple-300 to-fuchsia-300"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <p className="text-sm text-black/70 mt-4 text-center">
              Already have an account?{" "}
              <Link href="/login" className="underline font-medium">
                Login
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
