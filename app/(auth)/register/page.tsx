"use client";

import { useState } from "react";
import { auth, googleProvider, db } from "../../../firebase/config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const saveUserToDb = async (user: User) => {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || username,
      role: "user",
      createdAt: new Date(),
    });
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

  const showInfoAlert = (message: string) => {
    Swal.fire({
      icon: "info",
      title: "Verification Required",
      text: message,
      confirmButtonColor: "#3B82F6",
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
      text: "Creating your account",
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      showWarningAlert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      showWarningAlert("Password should be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      showLoadingAlert();

      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username });
      await saveUserToDb(res.user);
      await sendEmailVerification(res.user);

      closeLoadingAlert();
      showInfoAlert(
        "Account created! Please check your email to verify your account.",
      );

      setTimeout(() => {
        router.push("/");
      }, 2500);
    } catch (err: unknown) {
      closeLoadingAlert();
      setIsLoading(false);

      const error = err as FirebaseAuthError;

      switch (error.code) {
        case "auth/email-already-in-use":
          showErrorAlert(
            "This email is already registered. Please login instead.",
          );
          break;
        case "auth/invalid-email":
          showErrorAlert(
            "Invalid email format. Please check your email address.",
          );
          break;
        case "auth/weak-password":
          showErrorAlert(
            "Password is too weak. Please use a stronger password.",
          );
          break;
        case "auth/operation-not-allowed":
          showErrorAlert(
            "Email/password registration is currently disabled. Please use Google sign-in.",
          );
          break;
        default:
          showErrorAlert(
            error.message || "Failed to create account. Please try again.",
          );
      }
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      showLoadingAlert();

      const res = await signInWithPopup(auth, googleProvider);
      await saveUserToDb(res.user);

      closeLoadingAlert();
      showSuccessAlert("Successfully registered with Google!");

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: unknown) {
      closeLoadingAlert();
      setIsLoading(false);

      const error = err as FirebaseAuthError;

      if (error.code === "auth/popup-closed-by-user") {
        showWarningAlert("Registration was cancelled");
      } else if (error.code === "auth/network-request-failed") {
        showErrorAlert("Network error. Please check your connection.");
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        showErrorAlert(
          "An account already exists with the same email but different sign-in method. Please login using your email/password.",
        );
      } else {
        showErrorAlert(error.message || "Failed to register with Google");
      }
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat p-4 sm:p-6 ${inter.variable} font-sans`}
      style={{ backgroundImage: "url('/images/sea bg4.jpg')" }}
    >
      {/* Compact Liquid Glass Card */}
      <div className="relative w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 sm:p-8 rounded-[2rem] shadow-2xl overflow-y-auto max-h-[95vh]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-white/50 text-xs mt-1">
              Start your journey with Gomirissa
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all disabled:opacity-50"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-transparent px-2 text-white/30">Or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full py-2.5 bg-white/90 text-gray-900 font-bold text-sm rounded-xl flex justify-center items-center gap-2 hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-4"
              alt="G"
            />
            {isLoading ? "Processing..." : "Google"}
          </button>

          <p className="mt-6 text-center text-xs text-white/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-bold hover:text-blue-300 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
