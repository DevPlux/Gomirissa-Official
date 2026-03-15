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
  const router = useRouter();
  const [error, setError] = useState("");

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
      
      // Send Verification Email
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-2 border rounded" 
             onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" 
             onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded" 
             onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Register</button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button onClick={handleGoogleRegister} className="w-full border p-2 rounded flex justify-center items-center gap-2 hover:bg-gray-50">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5" />
          Sign up with Google
        </button>

        <p className="mt-4 text-center text-sm">
           Already have an account? <Link href="/login" className="text-blue-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}