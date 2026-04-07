"use client";

import { useState } from "react";
import { auth, googleProvider, db } from "@/firebase/config";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRedirect = async (uid: string) => {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists() && docSnap.data().role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  const showSuccessAlert = (message: string) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      timer: 2000,
      showConfirmButton: false,
      background: "#fff",
      customClass: {
        popup: "!rounded-3xl shadow-2xl",
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
      text: "Signing you in",
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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      showLoadingAlert();

      const res = await signInWithPopup(auth, googleProvider);
      await handleRedirect(res.user.uid);

      closeLoadingAlert();
      showSuccessAlert("Successfully signed in with Google!");
    } catch (err: unknown) {
      closeLoadingAlert();
      setIsLoading(false);

      const error = err as FirebaseAuthError;

      if (error.code === "auth/popup-closed-by-user") {
        showWarningAlert("Sign in was cancelled");
      } else if (error.code === "auth/network-request-failed") {
        showErrorAlert("Network error. Please check your connection.");
      } else {
        showErrorAlert(error.message || "Failed to sign in with Google");
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showWarningAlert("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      showLoadingAlert();

      const res = await signInWithEmailAndPassword(auth, email, password);
      await handleRedirect(res.user.uid);

      closeLoadingAlert();
      showSuccessAlert("Welcome back! Redirecting you...");
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
        case "auth/user-disabled":
          showErrorAlert(
            "This account has been disabled. Please contact support.",
          );
          break;
        case "auth/user-not-found":
          showErrorAlert(
            "No account found with this email. Please register first.",
          );
          break;
        case "auth/wrong-password":
          showErrorAlert("Incorrect password. Please try again.");
          break;
        case "auth/too-many-requests":
          showErrorAlert("Too many failed attempts. Please try again later.");
          break;
        default:
          showErrorAlert("Invalid email or password. Please try again.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6 ${inter.variable} font-sans`}
      style={{ backgroundImage: "url('/images/sea bg7.jpg')" }}
    >
      {/* Glass Card */}
      <div className="relative w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[95vh]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-white/50 text-xs mt-1">
              Sign in to Mirissa Adventures
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />

            <div className="space-y-1">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <div className="flex justify-end px-1">
                <Link
                  href="/forgot-password"
                  className="text-white/40 hover:text-white transition-colors text-[10px]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-2 text-white/30">Or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 bg-white/90 text-gray-900 font-bold text-sm rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-4"
              alt="G"
            />
            {isLoading ? "Signing in..." : "Google"}
          </button>

          <p className="mt-6 text-center text-xs text-white/50">
            New here?{" "}
            <Link
              href="/register"
              className="text-white font-bold hover:text-blue-300 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
