"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBar";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    } else if (!loading && !user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    );
  }

  // This part might not be reached if redirects happen quickly, but good for fallback
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 text-center mt-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Task Manager
        </h1>
        <p className="text-xl text-gray-600">
          Please log in or register to manage your tasks.
        </p>
      </main>
    </div>
  );
}
