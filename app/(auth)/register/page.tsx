"use client";

import { useState } from "react";
import { auth, googleProvider, db } from "../../../firebase/config";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const saveUserToDb = async (user: any) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || username,
      role: "user",
      createdAt: new Date(),
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username });
      await saveUserToDb(res.user);
      await sendEmailVerification(res.user);
      alert("Account created! Please check your email to verify.");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await saveUserToDb(res.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6"
      style={{ backgroundImage: "url('/images/sea bg1.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Compact Liquid Glass Card */}
      <div className="relative w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[95vh]">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p className="text-white/50 text-xs mt-1">Start your journey with Gomirissa</p>
          </div>

          {error && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-100 text-[10px] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />

            <button 
              type="submit" 
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95"
            >
              Register
            </button>
          </form>

          <div className="relative my-6">
            
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-2 text-white/30">Or</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleRegister} 
            className="w-full py-2.5 bg-white/90 text-gray-900 font-bold text-sm rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="G" />
            Google
          </button>

          <p className="mt-6 text-center text-xs text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-bold hover:text-blue-300 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}