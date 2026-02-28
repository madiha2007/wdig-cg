"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import path from "path";
import { usePathname } from "next/navigation";

const icons = {
  logo: "/assets/icons/logo.svg",
  home: "/assets/icons/home.svg",
  career: "/assets/icons/career.png",
  institute: "/assets/icons/institute.png",
  mentor: "/assets/icons/mentor.png",
  trending: "/assets/icons/trending.png",
  profile: "/assets/icons/profile.png",
  results: "/assets/icons/results.png",
  about: "/assets/icons/about.png",
  help: "/assets/icons/help.png",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // 👈 tracks current route
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-sky-100 py-4 px-6 md:px-12 flex items-center justify-between z-50">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Image src={icons.logo} alt="Logo" width={40} height={40} />
          <Link href={user ? "/dashboard" : "/"} className="text-black font-semibold text-lg">
            Where Do I Go?
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItem href={user ? "/dashboard" : "/"} icon={icons.home} label="Home" />
          <NavItem href="/explore" icon={icons.career} label="Explore Careers" />
          <NavItem href="/institute" icon={icons.institute} label="Find Institutes" />
          <NavItem href="/mentors" icon={icons.mentor} label="Mentorship" />
          <NavItem href="/trending" icon={icons.trending} label="Trending" />

          {!user ? (
            <>
              <Link
                href="/register"
                className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow border border-black"
              >
                Signup
              </Link>
              <Link
                href="/login"
                className="bg-sky-900 text-white px-4 py-2 rounded-lg font-semibold shadow"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden bg-sky-900 flex items-center justify-center hover:opacity-90"
              >
                {user?.photo ? (
                  <Image src={user.photo} alt="User Avatar" width={40} height={40} className="object-cover" />
                ) : (
                  <span className="text-white font-semibold">
                    {user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-black truncate">{user?.email}</p>
                    </div>
                    <Link href="/results" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">My Results</Link>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                    <Link href="/about" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">About Us</Link>
                    <Link href="/help" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Help Center</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* MOBILE HAMBURGER */}
        <button className="md:hidden" onClick={() => setMenuOpen(true)}>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </div>
        </button>
      </header>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-sky-100 z-[60] shadow-xl transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">

          {/* CLOSE */}
          <button className="text-xl self-end mb-4" onClick={() => setMenuOpen(false)}>
            ✕
          </button>

          {/* USER SECTION — clickable to go to profile */}
          {user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-b border-black/20 pb-4 mb-6 hover:opacity-80 transition"
            >
              <div className="w-11 h-11 rounded-full bg-sky-900 text-white flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
                {user?.photo ? (
                  <Image src={user.photo} alt="Avatar" width={44} height={44} className="object-cover" />
                ) : (
                  <span className="text-lg">{user?.email?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-black truncate">{user.email}</p>
                <p className="text-xs text-black/50">Tap to view profile →</p>
              </div>
            </Link>
          )}

          {/* MAIN NAV LINKS */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Menu</p>
            <MobileNavItem href={user ? "/dashboard" : "/"} icon={icons.home} label="Home" close={setMenuOpen} />
            <MobileNavItem href="/explore" icon={icons.career} label="Explore Careers" close={setMenuOpen} />
            <MobileNavItem href="/institute" icon={icons.institute} label="Find Institutes" close={setMenuOpen} />
            <MobileNavItem href="/mentors" icon={icons.mentor} label="Mentorship" close={setMenuOpen} />
            <MobileNavItem href="/trending" icon={icons.trending} label="Trending" close={setMenuOpen} />
          </div>

          {/* LOGGED IN EXTRA LINKS */}
          {user && (
            <div className="mt-6 space-y-1">
              <p className="text-xs font-semibold text-black/40 uppercase tracking-wider mb-2">Account</p>
              <MobileNavItem href="/profile" icon={icons.profile} label="My Profile" close={setMenuOpen} />
              <MobileNavItem href="/results" icon={icons.results} label="My Results" close={setMenuOpen} />
              <MobileNavItem href="/about" icon={icons.about} label="About Us" close={setMenuOpen} />
              <MobileNavItem href="/help" icon={icons.help} label="Help Center" close={setMenuOpen} />
            </div>
          )}

          {/* BOTTOM: AUTH or LOGOUT */}
          <div className="mt-auto pt-4 space-y-3 border-t border-black/20">
            {!user ? (
              <>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center border px-4 py-2 rounded-lg border-black font-semibold"
                >
                  Signup
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center bg-sky-900 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            )}
          </div>

        </div>
      </aside>
    </>
  );
}

/* DESKTOP ITEM */
function NavItem({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-black/80 hover:text-sky-600">
      <Image src={icon} alt={label} width={20} height={20} />
      {label}
    </Link>
  );
}

/* MOBILE ITEM */
function MobileNavItem({ href, icon, label, close }) {
  return (
    <Link
      href={href}
      onClick={() => close(false)}
      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-base font-medium text-gray-900 hover:bg-sky-200 transition"
    >
      <Image src={icon} alt={label} width={22} height={22} />
      {label}
    </Link>
  );
}