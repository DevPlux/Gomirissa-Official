"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import logo from "../assets/gomirissa.png";
import { useRouter, usePathname } from "next/navigation";

// --- Icons ---
const MenuIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DashboardIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

// --- Types ---
interface NavbarProps {
  onBookNow?: () => void;
}

const navLinks = [
  { href: "#tours", label: "Experiences" },
  { href: "#gallery", label: "Gallery" },
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar({ onBookNow }: NavbarProps) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToSection = (sectionId: string) => {
    setMobileMenuOpen(false);

    if (pathname !== "/") {
      router.push(`/#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handleLogoClick = () => {
    if (pathname !== "/") {
      router.push("/");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const sectionId = window.location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [pathname]);

  if (loading) {
    return <nav className="fixed top-0 w-full h-20 z-50 bg-transparent" />;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-white/20 py-3"
          : "bg-gradient-to-b from-black/30 to-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleLogoClick();
            }
          }}
        >
          <div className="relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
            <Image
              src={logo}
              alt="GoMirissa Fishing Tours Logo"
              fill
              priority
              className="object-contain rounded-2xl shadow-md"
            />
          </div>

          <span
            className={`text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 ${
              scrolled ? "text-slate-900" : "text-white"
            } ${
              !scrolled
                ? "text-transparent bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text"
                : ""
            }`}
          >
            GoMirissa
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {!isAdmin && (
            <>
              <div className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() =>
                      navigateToSection(link.href.replace("#", ""))
                    }
                    className={`text-sm font-medium transition-all duration-200 relative group cursor-pointer ${
                      scrolled ? "text-slate-600" : "text-white/90"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                        scrolled ? "bg-blue-500" : "bg-white"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            </>
          )}

          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="text-right hidden lg:block">
                  <p
                    className={`text-sm font-semibold ${
                      scrolled ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {user.displayName || "User"}
                  </p>
                  <p className="text-xs font-medium text-blue-500 uppercase tracking-wider">
                    {isAdmin ? "Admin" : "Member"}
                  </p>
                </div>

                <div className="relative">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=3B82F6&color=fff&bold=true`
                    }
                    className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=3B82F6&color=fff&bold=true`;
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=3B82F6&color=fff&bold=true&size=80`
                        }
                        className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover"
                        alt="Profile"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {isAdmin ? "Administrator" : "Member"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {!isAdmin && (
                      <>
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <UserIcon />
                          </div>
                          <span className="font-medium">My Profile</span>
                        </Link>

                        <Link
                          href="/my-bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <CalendarIcon />
                          </div>
                          <span className="font-medium">My Bookings</span>
                        </Link>
                      </>
                    )}

                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <DashboardIcon />
                        </div>
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <LogoutIcon />
                      </div>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className={`text-sm font-semibold px-4 py-2 rounded-2xl transition-all duration-200 ${
                  scrolled
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r font-semibold from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl px-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full transition-all duration-300 ${
                scrolled
                  ? "text-slate-900 hover:bg-gray-100 bg-gray-500/20"
                  : "text-white hover:bg-white/20 bg-gray-500/50"
              }`}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[85vw] max-w-md bg-white p-0">
            <div className="flex flex-col h-full">
              <div className="px-6 pt-8 pb-4 bg-gradient-to-r from-blue-600 to-blue-900">
                <div className="flex items-center justify-between mb-6">
                  <div
                    onClick={() => {
                      handleLogoClick();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="relative w-10 h-10">
                      <Image
                        src={logo}
                        alt="Logo"
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                    <span className="text-white text-xl font-bold">
                      GoMirissa
                    </span>
                  </div>
                </div>

                {user && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mt-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.photoURL ||
                          `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=FFFFFF&color=3B82F6&bold=true&size=80`
                        }
                        className="w-14 h-14 rounded-full border-2 border-white object-cover"
                        alt="User"
                      />
                      <div className="flex-1">
                        <p className="text-white font-bold text-lg">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-white/80 text-sm truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                          {isAdmin ? "Admin" : "Member"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 px-6 py-6 overflow-y-auto">
                {!isAdmin && (
                  <>
                    <div className="space-y-1">
                      {navLinks.map((link) => (
                        <button
                          key={link.href}
                          onClick={() =>
                            navigateToSection(link.href.replace("#", ""))
                          }
                          className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group cursor-pointer"
                        >
                          <span className="text-base font-medium">
                            {link.label}
                          </span>
                          <svg
                            className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6" />
                  </>
                )}

                {user && !isAdmin && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                      Quick Actions
                    </p>
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <UserIcon />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/my-bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <CalendarIcon />
                      <span>My Bookings</span>
                    </Link>
                  </div>
                )}

                {isAdmin && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">
                      Admin
                    </p>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <DashboardIcon />
                      <span>Admin Dashboard</span>
                    </Link>
                  </div>
                )}

                {!isAdmin && onBookNow && (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onBookNow();
                    }}
                    className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md mb-4"
                  >
                    Book Now
                  </Button>
                )}

                <div className="space-y-3 font-semibold">
                  {!user ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full py-6 rounded-xl border-2 mb-4 bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                        >
                          Sign In
                        </Button>
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                          Create Account
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    >
                      <LogoutIcon />
                      <span className="ml-2 font-semibold">Logout</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-center text-gray-400">
                  © 2026 GoMirissa. All rights reserved.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
