// src/app/profile/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Your existing UserProfile (the dashboard with skill bars, activities, etc.)
// stays at the top of this page.
//
// CareerProfileForm is the NEW 2-min form (stage, skills, dream, etc.)
// shown BELOW the existing profile — accessed via the "Complete Career Profile"
// button, or shown automatically if coming from ?from=aptitude
// ─────────────────────────────────────────────────────────────────────────────

import UserProfile from "@/components/user-profile";         // ← your EXISTING component (unchanged)
import CareerProfileForm from "@/components/CareerProfileForm"; // ← the NEW form component

export const metadata = {
  title: "My Profile | Where Do I Go?",
  description: "View and manage your career guidance profile, track your progress, and explore career recommendations.",
};

export default function ProfilePage() {
  return (
    <>
      {/* Your existing full profile dashboard — unchanged */}
      <main>
        <UserProfile />
      </main>

      {/* The new career context form — shown below */}
      {/* Users can scroll to it, or it auto-focuses when ?from=aptitude */}
      <section id="career-profile">
        <CareerProfileForm />
      </section>
    </>
  );
}