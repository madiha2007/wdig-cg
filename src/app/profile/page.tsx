// app/profile/page.tsx
// This is the Next.js page that wraps the UserProfile component

import UserProfile from '@/components/user-profile';
// Import your existing components
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';

export const metadata = {
  title: 'My Profile | Where Do I Go?',
  description: 'View and manage your career guidance profile, track your progress, and explore career recommendations.',
};

export default function ProfilePage() {
  return (
    <>
      {/* Uncomment these when you have your Navbar and Footer */}
      {/* <Navbar /> */}
      
      <main>
        <UserProfile />
      </main>
      
      {/* <Footer /> */}
    </>
  );
}