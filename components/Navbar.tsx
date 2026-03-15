"use client";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // දත්ත ලැබෙන තුරු පොඩි වෙලාවක් Navbar එක හිස්ව තබයි
  if (loading) return <nav className="p-4 bg-white shadow-md h-16"></nav>;

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md relative z-50">
      <Link href="/" className="text-2xl font-bold text-blue-600">Mirissa Adventures</Link>
      
      <div>
        {user ? (
          <div className="flex items-center gap-4">
             {/* User Info */}
             <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-500 uppercase font-semibold">{user.role}</p>
             </div>

             {/* Profile Image & Dropdown */}
             <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <img 
  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}`} 
  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover" 
  alt="Profile"
  referrerPolicy="no-referrer" // මේක ඉතාමත් වැදගත් Google Photos වලට
  onError={(e) => {
    // පින්තූරය load වෙන්නෙ නැතිනම් backup avatar එකක් පෙන්වන්න
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=0D8ABC&color=fff`;
  }}
/>
                
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-in fade-in zoom-in duration-200">
                    <div className="px-4 py-2 border-b text-xs text-gray-400 truncate">
                       {user.email}
                    </div>
                    {user.role === 'admin' && (
                        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-blue-50 text-blue-600 font-medium">
                          Admin Dashboard
                        </Link>
                    )}
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-lg transition">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}