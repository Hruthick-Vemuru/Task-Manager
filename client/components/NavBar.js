"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-slate-900/70 backdrop-blur-md p-4 sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-white text-2xl font-bold cursor-pointer tracking-wider">
            TaskFlow
          </span>
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              <span className="text-slate-300 hidden sm:block">
                Welcome, {user.name}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className="text-slate-300 hover:text-white cursor-pointer">
                  Login
                </span>
              </Link>
              <Link href="/register">
                <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
                  Register
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
