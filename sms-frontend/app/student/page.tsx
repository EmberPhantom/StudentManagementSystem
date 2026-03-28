"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/features/auth/RequireAuth";
import { useAuth } from "@/features/auth/AuthContext";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function StudentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await api.get("/students/me");
        setStudent(res.data);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load student record";
        setError(msg);
        toast({ variant: "error", title: "Load failed", description: msg });
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, []);

  useEffect(() => {
    const loadReport = async () => {
      if (!student) return;
      setReportLoading(true);
      setError("");
      try {
        const res = await api.get(`/attendance/report/self`);
        setReport(res.data || {});
      } catch (err: any) {
        const msg = err.response?.data?.message || "Unable to fetch attendance report";
        setError(msg);
        setReport([]);
        toast({ variant: "error", title: "Report failed", description: msg });
      } finally {
        setReportLoading(false);
      }
    };

    loadReport();
  }, [student]);

  return (
    <RequireAuth role="student">
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-6">Student Dashboard</h1>

        <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <p className="text-lg">Hello {user?.name ?? "Student"},</p>
          <p className="mt-2">View attendance reports.</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}

        {loading ? (
          <p>Loading your student record...</p>
        ) : student ? (
          <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
            <p className="font-semibold">Student:</p>
            <p>{student.userId?.name || student.name}</p>
            <p className="text-sm text-slate-500">Roll No: {student.rollNo}</p>
            <p className="text-sm text-slate-500">Branch: {student.branch}</p>
          </div>
        ) : (
          <p>No student record found.</p>
        )}

        {reportLoading ? (
          <p>Loading attendance report...</p>
        ) : (
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Attendance</h2>
            {!report || Object.keys(report).length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No attendance data available.</p>
            ) : (
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <p>Total records: {report.total}</p>
                <p>Present: {report.present}</p>
                <p>Attendance: {report.percentage}%</p>
              </div>
            )}
          </div>
        )}
      </main>
    </RequireAuth>
  );
}
