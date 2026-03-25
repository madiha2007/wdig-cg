"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const icons = {
  logo:      "/assets/icons/logo.svg",
  home:      "/assets/icons/home.svg",
  career:    "/assets/icons/career.png",
  institute: "/assets/icons/institute.png",
  mentor:    "/assets/icons/mentor.png",
  trending:  "/assets/icons/trending.png",
  profile:   "/assets/icons/profile.png",
  results:   "/assets/icons/results.png",
  about:     "/assets/icons/about.png",
  help:      "/assets/icons/help.png",
};

export default function Navbar() {
  const router       = useRouter();
  const pathname     = usePathname();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [user,         setUser]         = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const dropdownRef = useRef(null);

  // Scroll listener — switch from glass to solid
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth state
  useEffect(() => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      setUser(storedUser);
    } catch {}

    const handleStorageChange = () => {
      try {
        const updatedUser = JSON.parse(sessionStorage.getItem("user"));
        setUser(updatedUser);
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

  // Close dropdown on outside click
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
    sessionStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  };

  return (
    <>
      {/* ── HEADER ── */}
 <header
  className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
    isScrolled
      ? "bg-transparent"
      : "bg-transparent"
  }`}
  
>
  <div className="mx-2 md:mx-4 lg:mx-6 mt-3 border rounded-4xl py-4 px-6 md:px-12 flex items-center justify-between bg-white/40 backdrop-blur-xl border-white/20 shadow-sm">
    
    {/* LOGO */}
    <div className="flex items-center gap-3">
      <Image src={icons.logo} alt="Logo" width={40} height={40} />
      <Link href="/" className="font-semibold text-lg text-gray-800">
        Where Do I Go?
      </Link>
    </div>


        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItem href={user ? "/dashboard" : "/"} icon={icons.home}      label="Home"            isScrolled={isScrolled} />
          <NavItem href="/explore"                  icon={icons.career}    label="Explore Careers" isScrolled={isScrolled} />
          <NavItem href="/institute"                icon={icons.institute} label="Find Institutes"  isScrolled={isScrolled} />
          <NavItem href="/mentors"                  icon={icons.mentor}    label="Mentorship"       isScrolled={isScrolled} />
          <NavItem href="/trending"                 icon={icons.trending}  label="Trending"         isScrolled={isScrolled} />

          {!user ? (
            <>
              <Link
                href="/register"
                className="bg-white/80 backdrop-blur-sm text-violet-600 px-4 py-2 rounded-lg font-semibold border border-violet-200 hover:bg-white transition-all"
              >
                Signup
              </Link>
              <Link
                href="/login"
                className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center hover:opacity-90 transition-opacity shadow-md"
              >
                {user?.photo ? (
                  <Image src={user.photo} alt="User Avatar" width={40} height={40} className="object-cover" />
                ) : (
                  <span className="text-white font-semibold text-sm">
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
                    className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl border border-violet-100 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-violet-50">
                      <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                    </div>
                    {[
                      { label: "My Results", href: "/results"  },
                      { label: "My Profile", href: "/profile"  },
                      { label: "About Us",   href: "/about"    },
                      { label: "Help Center",href: "/help"     },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-violet-50"
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
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </div>
        </button>
        </div>
      </header>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-xl border-r border-white/30 z-[60] shadow-2xl transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">

          {/* CLOSE */}
          <button
            className="text-gray-500 hover:text-gray-800 text-xl self-end mb-4 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          {/* USER SECTION */}
          {user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 border-b border-violet-100 pb-4 mb-6 hover:opacity-80 transition"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-semibold overflow-hidden flex-shrink-0">
                {user?.photo ? (
                  <Image src={user.photo} alt="Avatar" width={44} height={44} className="object-cover" />
                ) : (
                  <span className="text-lg">{user?.email?.charAt(0)?.toUpperCase()}</span>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-gray-800 truncate">{user.email}</p>
                <p className="text-xs text-gray-400">Tap to view profile →</p>
              </div>
            </Link>
          )}

          {/* MAIN NAV LINKS */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
            <MobileNavItem href={user ? "/dashboard" : "/"} icon={icons.home}      label="Home"            close={setMenuOpen} />
            <MobileNavItem href="/explore"                  icon={icons.career}    label="Explore Careers" close={setMenuOpen} />
            <MobileNavItem href="/institute"                icon={icons.institute} label="Find Institutes"  close={setMenuOpen} />
            <MobileNavItem href="/mentors"                  icon={icons.mentor}    label="Mentorship"       close={setMenuOpen} />
            <MobileNavItem href="/trending"                 icon={icons.trending}  label="Trending"         close={setMenuOpen} />
          </div>

          {/* LOGGED IN EXTRA LINKS */}
          {user && (
            <div className="mt-6 space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
              <MobileNavItem href="/profile" icon={icons.profile} label="My Profile"  close={setMenuOpen} />
              <MobileNavItem href="/results" icon={icons.results} label="My Results"  close={setMenuOpen} />
              <MobileNavItem href="/about"   icon={icons.about}   label="About Us"    close={setMenuOpen} />
              <MobileNavItem href="/help"    icon={icons.help}     label="Help Center" close={setMenuOpen} />
            </div>
          )}

          {/* BOTTOM AUTH / LOGOUT */}
          <div className="mt-auto pt-4 space-y-3 border-t border-violet-100">
            {!user ? (
              <>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center border border-violet-200 text-violet-600 px-4 py-2 rounded-lg font-semibold hover:bg-violet-50 transition-colors"
                >
                  Signup
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-violet-600 hover:to-pink-600 transition-all"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
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

/* DESKTOP NAV ITEM */
function NavItem({ href, icon, label, isScrolled }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-700 hover:text-violet-600 transition-colors font-medium"
    >
      <Image src={icon} alt={label} width={20} height={20} />
      {label}
    </Link>
  );
}

/* MOBILE NAV ITEM */
function MobileNavItem({ href, icon, label, close }) {
  return (
    <Link
      href={href}
      onClick={() => close(false)}
      className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-violet-50 hover:text-violet-600 transition-colors"
    >
      <Image src={icon} alt={label} width={22} height={22} />
      {label}
    </Link>
  );
}