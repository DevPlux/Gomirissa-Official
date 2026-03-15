"use client";
import { useState } from "react";
import { auth } from "../../../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setMessage("Error sending email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <form onSubmit={handleReset} className="space-y-4">
          <input type="email" placeholder="Enter your email" className="w-full p-2 border rounded"
            onChange={(e) => setEmail(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white p-2 rounded">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}