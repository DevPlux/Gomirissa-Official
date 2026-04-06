"use client";

import { useState } from "react";
import { auth, googleProvider, db } from "../../../firebase/config";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRedirect = async (uid: string) => {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists() && docSnap.data().role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await handleRedirect(res.user.uid);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await handleRedirect(res.user.uid);
    } catch (err: any) {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6"
      style={{ backgroundImage: "url('/images/sea bg2.jpg')" }}
    >
      {/* Liquid Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Compact Glass Card */}
      <div className="relative w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[95vh]">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p className="text-white/50 text-xs mt-1">Sign in to Mirissa Adventures</p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-100 text-[10px] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            
            <div className="space-y-1">
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <div className="flex justify-end px-1">
                <Link href="/forgot-password" className="text-white/40 hover:text-white transition-colors text-[10px]">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-2 text-white/30 ">Or</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            className="w-full py-2.5 bg-white/90 text-gray-900 font-bold text-sm rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="G" />
            Google
          </button>

          <p className="mt-6 text-center text-xs text-white/50">
            New here?{" "}
            <Link href="/register" className="text-white font-bold hover:text-blue-300 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}