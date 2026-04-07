"use client";

import { useState } from "react";
import { auth } from "../../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent! Please check your inbox.");
    } catch (err: any) {
      setError("Could not find an account with that email.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6"
      style={{ backgroundImage: "url('/images/sea bg5.jpg')" }}
    >
      {/* Compact Glass Card */}
      <div className="relative w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Reset Password
            </h2>
            <p className="text-white/50 text-xs mt-1">
              We'll send a recovery link to your email
            </p>
          </div>

          {message && (
            <div className="mb-4 p-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-100 text-[10px] text-center animate-pulse">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-100 text-[10px] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-xs text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
