// app/admin/layout.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "admin") {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return <div className="h-screen flex items-center justify-center text-xl font-bold">Unauthorized...</div>;
  }

  return <>{children}</>;
}