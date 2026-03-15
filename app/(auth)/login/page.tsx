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
  const router = useRouter();
  const [error, setError] = useState("");

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
             onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
             onChange={(e) => setPassword(e.target.value)} required />
          <div className="text-right">
             <Link href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot Password?</Link>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button onClick={handleGoogleLogin} className="w-full border p-2 rounded flex justify-center items-center gap-2 hover:bg-gray-50">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
          Sign in with Google
        </button>
        
        <p className="mt-4 text-center text-sm">
           Don't have an account? <Link href="/register" className="text-blue-600 font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}