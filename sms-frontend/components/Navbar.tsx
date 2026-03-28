"use client";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 font-semibold text-slate-900 dark:text-slate-100">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-300">SMS</Link>
          <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-300">Dashboard</Link>
          {user?.role === "admin" && <Link href="/admin" className="hover:text-indigo-600 dark:hover:text-indigo-300">Admin</Link>}
          {user?.role === "teacher" && <Link href="/teacher" className="hover:text-indigo-600 dark:hover:text-indigo-300">Teacher</Link>}
          {user?.role === "student" && <Link href="/student" className="hover:text-indigo-600 dark:hover:text-indigo-300">Student</Link>}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{user.name} ({user.role})</span>
              <Button variant="secondary" onClick={logout}>Logout</Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Login
              </Link>
              <Link href="/register" className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}