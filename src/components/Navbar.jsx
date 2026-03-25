"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const icons = {
  logo:      "/assets/icons/logo.svg",
  home:      "/assets/icons/home1.svg",
  career:    "/assets/icons/search1.svg",
  institute: "/assets/icons/university.svg",
  mentor:    "/assets/icons/mentor-stroke-rounded.svg",
  profile:   "/assets/icons/profile.png",
  results:   "/assets/icons/results.png",
  about:     "/assets/icons/about.png",
  help:      "/assets/icons/help.png",
};

/* ─── Animation variants ─── */

const headerVariants = {
  hidden:  { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 22, delay: 0.05 },
  },
};

const navItemVariants = {
  hidden:  { opacity: 0, y: -10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.07, type: "spring", stiffness: 300, damping: 24 },
  }),
};

const dropdownVariants = {
  hidden:  { opacity: 0, scale: 0.92, y: -6, originX: "right", originY: "top" },
  visible: { opacity: 1, scale: 1,    y: 0,
    transition: { type: "spring", stiffness: 340, damping: 26 } },
  exit:    { opacity: 0, scale: 0.92, y: -6,
    transition: { duration: 0.15 } },
};

const drawerVariants = {
  hidden:  { x: "-100%", opacity: 0 },
  visible: { x: 0,       opacity: 1,
    transition: { type: "spring", stiffness: 280, damping: 30 } },
  exit:    { x: "-100%", opacity: 0,
    transition: { type: "spring", stiffness: 320, damping: 32 } },
};

const drawerItemVariants = {
  hidden:  { opacity: 0, x: -18 },
  visible: (i) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.06 + i * 0.055, type: "spring", stiffness: 300, damping: 24 },
  }),
};

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

/* ─── Hamburger icon that morphs into ✕ ─── */
function HamburgerIcon({ open }) {
  return (
    <div className="w-6 h-5 flex flex-col justify-between">
      <motion.span
        className="block h-0.5 bg-gray-700 rounded-full origin-center"
        animate={open ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
      <motion.span
        className="block h-0.5 bg-gray-700 rounded-full"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="block h-0.5 bg-gray-700 rounded-full origin-center"
        animate={open ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      />
    </div>
  );
}

/* ─── Main Navbar ─── */
export default function Navbar() {
  const router       = useRouter();
  const pathname     = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [user,         setUser]         = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const desktopNavLinks = [
    { href: user ? "/dashboard" : "/", icon: icons.home,      label: "Home"            },
    { href: "/explore",                icon: icons.career,    label: "Explore Careers" },
    { href: "/institute",              icon: icons.institute, label: "Find Institutes"  },
    { href: "/mentors",                icon: icons.mentor,    label: "Mentorship"       },
  ];

  const mobileMainLinks = desktopNavLinks;

  const mobileAccountLinks = [
    { href: "/profile", icon: icons.profile, label: "My Profile"  },
    { href: "/results", icon: icons.results, label: "My Results"  },
    { href: "/about",   icon: icons.about,   label: "About Us"    },
    { href: "/help",    icon: icons.help,    label: "Help Center" },
  ];

  return (
    <>
      {/* ── HEADER ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[60]"
        variants={shouldReduceMotion ? {} : headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="mx-2 md:mx-4 lg:mx-30 mt-3 border rounded-4xl py-4 px-6 md:px-12 flex items-center justify-between bg-white/40 backdrop-blur-xl border-white/20"
          animate={{
            boxShadow: isScrolled
              ? "0 8px 32px rgba(0,0,0,0.12)"
              : "0 2px 8px rgba(0,0,0,0.04)",
          }}
          transition={{ duration: 0.35 }}
        >
          {/* LOGO */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <motion.div
              whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
            >
              <Image src={icons.logo} alt="Logo" width={40} height={40} />
            </motion.div>
            <Link href="/" className="font-semibold text-lg text-gray-800">
              Where Do I Go?
            </Link>
          </motion.div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            {desktopNavLinks.map((item, i) => (
              <motion.div
                key={item.href}
                custom={i}
                variants={shouldReduceMotion ? {} : navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <NavItem href={item.href} icon={item.icon} label={item.label} />
              </motion.div>
            ))}

            {!user ? (
              <>
                <motion.div
                  custom={desktopNavLinks.length}
                  variants={shouldReduceMotion ? {} : navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link
                    href="/register"
                    className="bg-white/80 backdrop-blur-sm text-violet-600 px-4 py-2 rounded-lg font-semibold border border-violet-200 hover:bg-white transition-all block"
                  >
                    Signup
                  </Link>
                </motion.div>
                <motion.div
                  custom={desktopNavLinks.length + 1}
                  variants={shouldReduceMotion ? {} : navItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all block"
                  >
                    Login
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div
                custom={desktopNavLinks.length}
                variants={shouldReduceMotion ? {} : navItemVariants}
                initial="hidden"
                animate="visible"
                className="relative"
                ref={dropdownRef}
              >
                <motion.button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-md"
                  whileHover={{ scale: 1.1, boxShadow: "0 0 0 3px rgba(139,92,246,0.35)" }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                >
                  {user?.photo ? (
                    <Image src={user.photo} alt="User Avatar" width={40} height={40} className="object-cover" />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {user?.email?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
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
                      ].map((item, i) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0, transition: { delay: i * 0.05 } }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-violet-50"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </nav>

          {/* MOBILE HAMBURGER */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <HamburgerIcon open={menuOpen} />
          </motion.button>
        </motion.div>
      </motion.header>

      {/* OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            className="fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-xl border-r border-white/30 z-[60] shadow-2xl"
            variants={shouldReduceMotion ? {} : drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-6 flex flex-col h-full overflow-y-auto">

              {/* CLOSE */}
              <motion.button
                className="text-gray-500 hover:text-gray-800 text-xl self-end mb-4 transition-colors"
                onClick={() => setMenuOpen(false)}
                whileHover={{ rotate: 90, scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 18 }}
              >
                ✕
              </motion.button>

              {/* USER SECTION */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
                >
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
                </motion.div>
              )}

              {/* MAIN NAV LINKS */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                {mobileMainLinks.map((item, i) => (
                  <motion.div
                    key={item.href}
                    custom={i}
                    variants={shouldReduceMotion ? {} : drawerItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <MobileNavItem href={item.href} icon={item.icon} label={item.label} close={setMenuOpen} />
                  </motion.div>
                ))}
              </div>

              {/* LOGGED-IN EXTRA LINKS */}
              {user && (
                <div className="mt-6 space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
                  {mobileAccountLinks.map((item, i) => (
                    <motion.div
                      key={item.href}
                      custom={mobileMainLinks.length + i}
                      variants={shouldReduceMotion ? {} : drawerItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <MobileNavItem href={item.href} icon={item.icon} label={item.label} close={setMenuOpen} />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* BOTTOM AUTH / LOGOUT */}
              <motion.div
                className="mt-auto pt-4 space-y-3 border-t border-violet-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.28 } }}
              >
                {!user ? (
                  <>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center border border-violet-200 text-violet-600 px-4 py-2 rounded-lg font-semibold hover:bg-violet-50 transition-colors"
                      >
                        Signup
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-violet-600 hover:to-pink-600 transition-all"
                      >
                        Login
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.button
                    onClick={handleLogout}
                    className="w-full text-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  >
                    Logout
                  </motion.button>
                )}
              </motion.div>

            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── DESKTOP NAV ITEM with sweep underline + icon bounce ─── */
function NavItem({ href, icon, label }) {
  return (
    <Link href={href} className="group flex items-center gap-2 text-gray-700 hover:text-violet-600 transition-colors font-medium relative">
      <motion.span
        className="inline-flex"
        whileHover={{ y: -2, rotate: -6 }}
        transition={{ type: "spring", stiffness: 400, damping: 14 }}
      >
        <Image src={icon} alt={label} width={20} height={20} />
      </motion.span>
      <span className="relative">
        {label}
        {/* Animated underline sweep */}
        <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  );
}

/* ─── MOBILE NAV ITEM with slide-right highlight ─── */
function MobileNavItem({ href, icon, label, close }) {
  return (
    <Link
      href={href}
      onClick={() => close(false)}
      className="group flex items-center gap-3 px-2 py-2.5 rounded-lg text-base font-medium text-gray-800 hover:bg-violet-50 hover:text-violet-600 transition-colors"
    >
      <motion.span
        className="inline-flex"
        whileHover={{ scale: 1.15, rotate: -6 }}
        transition={{ type: "spring", stiffness: 380, damping: 14 }}
      >
        <Image src={icon} alt={label} width={22} height={22} />
      </motion.span>
      {label}
    </Link>
  );
}