"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/features/auth/RequireAuth";
import { useAuth } from "@/features/auth/AuthContext";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toast";

interface StudentInput {
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  dob: string;
  year: number;
  branch: string;
  section: string;
}

export default function TeacherPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultMsg, setResultMsg] = useState("");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "present" | "absent">>({});
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [section, setSection] = useState("A");
  const [teacherBranch, setTeacherBranch] = useState<string>("");
  const [studentForm, setStudentForm] = useState<StudentInput>({
    name: "",
    email: "",
    phone: "",
    rollNo: "",
    dob: "",
    year: new Date().getFullYear(),
    branch: "",
    section: "A",
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/students", { params: { page: 1, limit: 20 } });
      setStudents(res.data.students || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load students";
      setError(msg);
      toast({ variant: "error", title: "Student load failed", description: msg });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacher = async () => {
    try {
      const res = await api.get("/teachers/me");
      setTeacherBranch(res.data.branch || "");
      setStudentForm((prev) => ({ ...prev, branch: res.data.branch || "" }));
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load teacher profile";
      setError(msg);
      toast({ variant: "error", title: "Teacher load failed", description: msg });
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchTeacher()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const markAttendance = async () => {
    setError("");
    setResultMsg("");
    try {
      const records = students.map((student) => ({
        studentId: student._id,
        status: attendanceMap[student._id] || "present",
      }));

      await api.post("/attendance/bulk", {
        year,
        section,
        records,
      });

      setResultMsg("Attendance recorded successfully.");
      toast({ variant: "success", title: "Attendance saved", description: "Attendance has been recorded." });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to mark attendance";
      setError(msg);
      toast({ variant: "error", title: "Attendance error", description: msg });
    }
  };

  const submitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResultMsg("");
    try {
      const res = await api.post("/students", { ...studentForm, branch: teacherBranch });
      setStudents((prev) => [res.data, ...prev]);
      setResultMsg("Student created successfully.");
      toast({ variant: "success", title: "Student added", description: "Student was added successfully." });
      setStudentForm({
        name: "",
        email: "",
        phone: "",
        rollNo: "",
        dob: "",
        year: new Date().getFullYear(),
        branch: teacherBranch,
        section: "A",
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to create student";
      setError(msg);
      toast({ variant: "error", title: "Create student failed", description: msg });
    }
  };

  return (
    <RequireAuth role="teacher">
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-6">Teacher Dashboard</h1>

        <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <p className="text-lg">Hello {user?.name ?? "Teacher"},</p>
          <p className="mt-2">Manage attendance and students within your classes.</p>
        </div>

        <section className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Student</h2>
          <form onSubmit={submitStudent} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className="rounded border p-2" placeholder="Name" value={studentForm.name} onChange={(e) => setStudentForm((s) => ({ ...s, name: e.target.value }))} required />
            <input className="rounded border p-2" type="email" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm((s) => ({ ...s, email: e.target.value }))} required />
            <input className="rounded border p-2" placeholder="Phone" value={studentForm.phone} onChange={(e) => setStudentForm((s) => ({ ...s, phone: e.target.value }))} />
            <input className="rounded border p-2" placeholder="Roll No" value={studentForm.rollNo} onChange={(e) => setStudentForm((s) => ({ ...s, rollNo: e.target.value }))} required />
            <input className="rounded border p-2" type="date" value={studentForm.dob} onChange={(e) => setStudentForm((s) => ({ ...s, dob: e.target.value }))} required />
            <input className="rounded border p-2" type="number" value={studentForm.year} onChange={(e) => setStudentForm((s) => ({ ...s, year: Number(e.target.value) }))} required />
            <div className="rounded border p-2 bg-slate-50">
              <p className="text-sm">Branch: {teacherBranch || studentForm.branch || "N/A"}</p>
            </div>
            <input className="rounded border p-2" placeholder="Section" value={studentForm.section} onChange={(e) => setStudentForm((s) => ({ ...s, section: e.target.value }))} required />
            <button type="submit" className="sm:col-span-2 rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">Add Student</button>
          </form>
        </section>

        {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}
        {resultMsg && <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-700">{resultMsg}</div>}

        <section className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Year</label>
            <input value={year} onChange={(e) => setYear(Number(e.target.value))} type="number" className="mt-1 block w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Section</label>
            <input value={section} onChange={(e) => setSection(e.target.value)} className="mt-1 block w-full rounded border p-2" />
          </div>
        </section>

        <section className="overflow-x-auto rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          {loading ? (
            <p>Loading students...</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Roll</th>
                  <th className="px-4 py-2">Mark</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-slate-500">No students found.</td>
                  </tr>
                )}
                {students.map((student) => (
                  <tr key={student._id} className="border-t border-slate-100">
                    <td className="px-4 py-2">{student.userId?.name || student.name || "Unknown"}</td>
                    <td className="px-4 py-2">{student.rollNo}</td>
                    <td className="px-4 py-2">
                      <select
                        value={attendanceMap[student._id] ?? "present"}
                        onChange={(e) =>
                          setAttendanceMap((prev) => ({ ...prev, [student._id]: e.target.value as "present" | "absent" }))
                        }
                        className="rounded border p-1"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={markAttendance} className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
            Save attendance
          </button>
        </section>
      </main>
    </RequireAuth>
  );
}
