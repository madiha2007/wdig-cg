import { Suspense } from "react";
import UserProfile from "@/components/user-profile";
import CareerProfileFormClient from "@/components/CareerProfileForm";

export const metadata = {
  title: "My Profile | Where Do I Go?",
  description: "View and manage your career guidance profile.",
};

export default function ProfilePage() {
  return (
    <>
      <main>
        <UserProfile />
      </main>

      <section id="career-profile">
        <Suspense fallback={<div>Loading...</div>}>
          <CareerProfileFormClient />
        </Suspense>
      </section>
    </>
  );
}