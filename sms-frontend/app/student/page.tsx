"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/features/auth/RequireAuth";
import { useAuth } from "@/features/auth/AuthContext";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toast";

export default function StudentPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await api.get("/students", { params: { page: 1, limit: 20 } });
        const list = res.data.students || [];
        setStudents(list);
        if (list.length > 0) {
          setSelectedId(list[0]._id);
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "Failed to load students";
        setError(msg);
        toast({ variant: "error", title: "Load failed", description: msg });
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const fetchReport = async (studentId: string) => {
    if (!studentId) return;
    setReportLoading(true);
    setError("");
    try {
      const res = await api.get(`/attendance/report/${studentId}`);
      setReport(res.data || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Unable to fetch attendance report";
      setError(msg);
      setReport([]);
      toast({ variant: "error", title: "Report failed", description: msg });
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    if (selectedId) fetchReport(selectedId);
  }, [selectedId]);

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
          <p>Loading student list...</p>
        ) : (
          <div className="mb-4 flex items-center gap-4">
            <label className="font-medium">Student</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rounded border px-3 py-2"
            >
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.rollNo})
                </option>
              ))}
            </select>
          </div>
        )}

        {reportLoading ? (
          <p>Loading attendance report...</p>
        ) : (
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Attendance</h2>
            {report.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No attendance records available.</p>
            ) : (
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
                {report.map((rec: any, i: number) => (
                  <li key={i}>{rec.date || rec._id}: {rec.status}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </RequireAuth>
  );
}
