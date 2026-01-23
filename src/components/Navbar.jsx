"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
          <div className="flex items-center gap-3 border-b border-black/20 pb-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-sky-900 text-white flex items-center justify-center font-semibold">
              A
            </div>
            <div>
              <p className="font-semibold text-black">Aisha Patel</p>
              <p className="text-sm text-black/60">Student</p>
            </div>
          </div>

          {/* MENU */}
          <div className="space-y-4">
            <MobileNavItem href="/" icon={icons.home} label="Home" close={setMenuOpen} />
            <MobileNavItem href="/explore" icon={icons.career} label="Explore Careers" close={setMenuOpen} />
            <MobileNavItem href="/institute" icon={icons.institute} label="Find Institutes" close={setMenuOpen} />
            <MobileNavItem href="/mentor" icon={icons.mentor} label="Mentorship" close={setMenuOpen} />
            <MobileNavItem href="/trending" icon={icons.trending} label="Trending" close={setMenuOpen} />
          </div>

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
