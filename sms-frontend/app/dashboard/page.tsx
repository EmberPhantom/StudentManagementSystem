"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/features/auth/RequireAuth";
import { useAuth } from "@/features/auth/AuthContext";
import api from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentsCount, setStudentsCount] = useState(0);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const studentsRes = await api.get("/students");
        const attendanceRes = await api.get("/attendance");

        setStudentsCount(Array.isArray(studentsRes.data) ? studentsRes.data.length : 0);
        setAttendanceCount(Array.isArray(attendanceRes.data) ? attendanceRes.data.length : 0);
      } catch (err: any) {
        setError(err.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <RequireAuth>
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>
        ) : loading ? (
          <div className="rounded-lg border border-slate-300 bg-white p-4 text-slate-600">Loading statistics...</div>
        ) : (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total Students</p>
              <p className="text-3xl font-bold">{studentsCount}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">Total Attendance Records</p>
              <p className="text-3xl font-bold">{attendanceCount}</p>
            </div>
          </div>
        )}

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-lg">Welcome {user?.name ?? "user"}!</p>
          <p className="mt-3">
            You are logged in as <strong>{user?.role}</strong>.
          </p>
          {user?.role === "admin" && <p className="mt-4 text-green-700">Admin controls here</p>}
          {user?.role === "teacher" && <p className="mt-4 text-blue-700">Teacher controls here</p>}
          {user?.role === "student" && <p className="mt-4 text-slate-700">Student controls here</p>}
        </div>
      </main>
    </RequireAuth>
  );
}