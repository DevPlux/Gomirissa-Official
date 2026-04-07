"use client";

import { useState } from "react";
import { auth } from "@/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import Link from "next/link";
import { Inter } from "next/font/google";
import Swal from "sweetalert2";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-inter",
});

// Define specific error type for Firebase auth errors
interface FirebaseAuthError {
  code: string;
  message: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const showSuccessAlert = (message: string) => {
    Swal.fire({
      icon: "success",
      title: "Email Sent!",
      text: message,
      confirmButtonColor: "#3B82F6",
      confirmButtonText: "OK",
      background: "#fff",
      customClass: {
        popup: "!rounded-3xl shadow-2xl",
        confirmButton: "!rounded-xl px-6 py-2",
      },
    });
  };

  const showErrorAlert = (message: string) => {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: message,
      confirmButtonColor: "#3B82F6",
      confirmButtonText: "Try Again",
      background: "#fff",
      customClass: {
        popup: "!rounded-3xl !shadow-2xl",
        confirmButton: "!rounded-xl px-6 py-2",
      },
    });
  };

  const showWarningAlert = (message: string) => {
    Swal.fire({
      icon: "warning",
      title: "Warning",
      text: message,
      confirmButtonColor: "#F59E0B",
      confirmButtonText: "OK",
      background: "#fff",
      customClass: {
        popup: "!rounded-3xl !shadow-2xl",
        confirmButton: "!rounded-xl px-6 py-2",
      },
    });
  };

  const showLoadingAlert = () => {
    Swal.fire({
      title: "Please wait...",
      text: "Sending reset link",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: "#fff",
      customClass: {
        popup: "!rounded-3xl !shadow-2xl",
      },
    });
  };

  const closeLoadingAlert = () => {
    Swal.close();
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showWarningAlert("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showWarningAlert("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      showLoadingAlert();

      await sendPasswordResetEmail(auth, email);

      closeLoadingAlert();
      showSuccessAlert(
        "Password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.",
      );

      // Clear email field after successful send
      setEmail("");
    } catch (err: unknown) {
      closeLoadingAlert();
      setIsLoading(false);

      const error = err as FirebaseAuthError;

      switch (error.code) {
        case "auth/invalid-email":
          showErrorAlert(
            "Invalid email format. Please check your email address.",
          );
          break;
        case "auth/user-not-found":
          showErrorAlert(
            "No account found with this email address. Please register first.",
          );
          break;
        case "auth/too-many-requests":
          showErrorAlert("Too many requests. Please try again later.");
          break;
        case "auth/network-request-failed":
          showErrorAlert(
            "Network error. Please check your internet connection.",
          );
          break;
        default:
          showErrorAlert("Unable to send reset link. Please try again later.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6 ${inter.variable} font-sans`}
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

          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-xs text-white/50 hover:text-white transition-colors flex items-center justify-center gap-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform"
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
