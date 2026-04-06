"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// --- Icons ---
const WaveIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12c.8-.9 1.8-1.5 3-1.5s2.2.6 3 1.5c.8.9 1.8 1.5 3 1.5s2.2-.6 3-1.5c.8-.9 1.8-1.5 3-1.5s2.2.6 3 1.5" />
    <path d="M2 17c.8-.9 1.8-1.5 3-1.5s2.2.6 3 1.5c.8.9 1.8 1.5 3 1.5s2.2-.6 3-1.5c.8-.9 1.8-1.5 3-1.5s2.2.6 3 1.5" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent layout shift during auth check
  if (loading) return <nav className="fixed top-0 w-full h-20 z-50 bg-transparent"></nav>;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b
        ${scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg border-white/20 py-3"
          : "bg-transparent border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-md
              ${scrolled ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}>
            <WaveIcon />
          </div>
          <span className={`text-xl font-bold tracking-tight transition-colors duration-300
              ${scrolled ? "text-slate-900" : "text-white"}`}>
            Mirissa Adventures
          </span>
        </Link>

        {/* Desktop Navigation & Auth */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium hover:text-blue-500 transition-colors duration-200
                  ${scrolled ? "text-slate-600" : "text-white/90"}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-300/30" />

          {user ? (
            /* User Profile Dropdown */
            <div className="relative">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="text-right hidden lg:block">
                  <p className={`text-xs font-bold ${scrolled ? "text-gray-800" : "text-white"}`}>
                    {user.displayName || "User"}
                  </p>
                  <p className="text-[10px] opacity-70 uppercase font-bold text-blue-500">{user.role}</p>
                </div>
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`} 
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover shadow-sm transition group-hover:scale-105" 
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=0D8ABC&color=fff`;
                  }}
                />
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b text-xs text-gray-400 truncate">
                    {user.email}
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-blue-50 text-blue-600 font-semibold">
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => { logout(); setProfileOpen(false); }} 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Login/Register Buttons */
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className={`text-sm font-bold px-4 py-2 rounded-lg transition
                  ${scrolled ? "text-blue-600 hover:bg-blue-50" : "text-white hover:bg-white/10"}`}
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md transition-transform hover:scale-105">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${scrolled ? "text-slate-900" : "text-white hover:bg-white/20"}`}
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white p-8">
            <div className="flex flex-col gap-6 mt-12">
              {user && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-4">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    className="w-12 h-12 rounded-full border-2 border-blue-200"
                    alt="User"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{user.displayName || "User"}</p>
                    <p className="text-xs text-blue-600 font-bold uppercase">{user.role}</p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-medium text-slate-800 hover:text-blue-600 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="h-px bg-slate-100 my-2" />
              
              {!user ? (
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-6 rounded-xl border-blue-600 text-blue-600">Sign In</Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full py-6 rounded-xl bg-blue-600">Register</Button>
                  </Link>
                </div>
              ) : (
                <Button 
                  variant="destructive" 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full py-6 rounded-xl"
                >
                  Logout
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </nav>
  );
}