"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const icons = {
  logo: "/assets/icons/logo.svg",
  home: "/assets/icons/home.svg",
  career: "/assets/icons/career.png",
  institute: "/assets/icons/institute.png",
  mentor: "/assets/icons/mentor.png",
  trending: "/assets/icons/trending.png",
};

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
const [user, setUser] = useState(null);
const [userMenuOpen, setUserMenuOpen] = useState(false);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  setUser(storedUser);
}, []);

const dropdownRef = useRef(null);

useEffect(() => {
  function handleClickOutside(e) {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setUserMenuOpen(false);
    }
  }

  if (userMenuOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [userMenuOpen]);


  return (
    <>
      {/* HEADER */}
      <header className="w-full bg-sky-100 py-4 px-6 md:px-12 flex items-center justify-between z-50">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Image src={icons.logo} alt="Logo" width={40} height={40} />
          <Link href="/" className="text-black font-semibold text-lg">
            Where Do I Go?
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItem href="/" icon={icons.home} label="Home" />
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
  <div className="relative">
    {/* USER BUTTON */}
<button
  onClick={() => setUserMenuOpen((prev) => !prev)}
  className="w-10 h-10 rounded-full overflow-hidden bg-sky-900 flex items-center justify-center hover:opacity-90"
>
  {user?.photo ? (
    <Image
      src={user.photo}
      alt="User Avatar"
      width={40}
      height={40}
      className="object-cover"
    />
  ) : (
    <span className="text-white font-semibold">
      {user?.email?.charAt(0)?.toUpperCase()}
    </span>
  )}
</button>

    {/* DROPDOWN */}
<AnimatePresence>
  {userMenuOpen && (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden z-50"
    >
      <div className="px-4 py-3 border-b">
        <p className="text-sm font-medium text-black truncate">
          {user?.email}
        </p>
      </div>

      <Link
        href="/profile"
        onClick={() => setUserMenuOpen(false)}
        className="block px-4 py-2 hover:bg-gray-100"
      >
        My Profile
      </Link>

      <Link
        href="/about"
        onClick={() => setUserMenuOpen(false)}
        className="block px-4 py-2 hover:bg-gray-100"
      >
        About Us
      </Link>

      <Link
        href="/help"
        onClick={() => setUserMenuOpen(false)}
        className="block px-4 py-2 hover:bg-gray-100"
      >
        Help Center
      </Link>      

      <button
        onClick={() => {
          localStorage.removeItem("user");
          setUserMenuOpen(false);
          window.location.href = "/login";
        }}
        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
      >
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
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-skySoft z-[60]
        shadow-xl transform transition-transform duration-300
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* CLOSE */}
          <button className="text-xl self-end" onClick={() => setMenuOpen(false)}>
            ✕
          </button>

          {/* USER */}
{/* USER */}
{user?.photo ? (
  <Image src={user.photo} alt="Avatar" width={40} height={40} className="rounded-full" />
) : (
  user?.email?.charAt(0)?.toUpperCase()
)}

{/* {user && (
  <div className="flex items-center gap-3 border-b border-black/20 pb-4 mb-6">
    <div className="w-10 h-10 rounded-full bg-sky-900 text-white flex items-center justify-center font-semibold">
      {user?.email?.charAt(0)?.toUpperCase()}
    </div>
    <div>
      <p className="font-semibold text-black">{user.email}</p>
      <p className="text-sm text-black/60">Account</p>
    </div>
  </div>
)} */}


          {/* MENU */}
          <div className="space-y-4">
            <MobileNavItem href="/" icon={icons.home} label="Home" close={setMenuOpen} />
            <MobileNavItem href="/explore" icon={icons.career} label="Explore Careers" close={setMenuOpen} />
            <MobileNavItem href="/institute" icon={icons.institute} label="Find Institutes" close={setMenuOpen} />
            <MobileNavItem href="/mentor" icon={icons.mentor} label="Mentorship" close={setMenuOpen} />
            <MobileNavItem href="/trending" icon={icons.trending} label="Trending" close={setMenuOpen} />
          </div>

{!user && (
          <div className="mt-auto pt-4 space-y-3 border-t border-black/20">
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="block text-center border px-4 py-2 rounded-lg border-black"
            >
              Signup
            </Link>

            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-center bg-sky-900 text-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>
          </div>
)}
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
      className="flex items-center gap-3 text-lg font-medium text-gray-900"
    >
      <Image src={icon} alt={label} width={24} height={24} />
      {label}
    </Link>
  );
}
