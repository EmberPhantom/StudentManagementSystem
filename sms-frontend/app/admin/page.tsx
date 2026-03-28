"use client";
import { useEffect, useMemo, useState } from "react";
import RequireAuth from "@/features/auth/RequireAuth";
import { useAuth } from "@/features/auth/AuthContext";
import api from "@/lib/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/toast";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits"),
  rollNo: z.string().min(1, "Roll No is required"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  year: z.number().int().min(1900).max(2100),
  branch: z.string().min(1, "Branch is required"),
  section: z.string().min(1, "Section is required"),
});

type StudentInput = z.infer<typeof studentSchema>;


export default function AdminPage() {
  const { user } = useAuth();

  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

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

  const [editingStudentId, setEditingStudentId] = useState<string>("");
  const [assignTeacherId, setAssignTeacherId] = useState<string>("");
  const [assignmentYear, setAssignmentYear] = useState<number>(new Date().getFullYear());
  const [assignmentSection, setAssignmentSection] = useState<string>("A");

  const fetchStudents = async (currentPage = page) => {
    try {
      const res = await api.get("/students", { params: { page: currentPage, limit } });
      setStudents(res.data.students || []);
      setTotal(res.data.total || 0);
      setPage(currentPage);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load students";
      setError(msg);
      toast({ variant: "error", title: "Student load failed", description: msg });
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data || []);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load teachers";
      setError(msg);
      toast({ variant: "error", title: "Teacher load failed", description: msg });
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(1), fetchTeachers()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rollNo: "",
      dob: "",
      year: new Date().getFullYear(),
      branch: "",
      section: "A",
    },
  });

  const resetForm = () => {
    reset({
      name: "",
      email: "",
      phone: "",
      rollNo: "",
      dob: "",
      year: new Date().getFullYear(),
      branch: "",
      section: "A",
    });
    setEditingStudentId("");
  };

  const submitStudent = async (formData: StudentInput) => {
    setError("");
    setSuccess("");

    try {
      if (editingStudentId) {
        const res = await api.put(`/students/${editingStudentId}`, formData);
        setStudents((prev) => prev.map((st) => (st._id === editingStudentId ? res.data : st)));
        setSuccess("Student updated successfully.");
        toast({ variant: "success", title: "Student updated", description: "Profile saved successfully." });
      } else {
        const res = await api.post("/students", formData);
        setStudents((prev) => [res.data, ...prev]);
        setSuccess("Student created successfully.");
        toast({ variant: "success", title: "Student created", description: "Profile created successfully." });
      }
      resetForm();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to save student";
      setError(msg);
      toast({ variant: "error", title: "Save failed", description: msg });
    }
  };

  const editStudent = (student: any) => {
    setEditingStudentId(student._id);
    reset({
      name: student.userId?.name ?? "",
      email: student.userId?.email ?? "",
      phone: student.userId?.phone ?? "",
      rollNo: student.rollNo ?? "",
      dob: student.dob?.slice(0, 10) ?? "",
      year: student.year ?? new Date().getFullYear(),
      branch: student.branch ?? "",
      section: student.section ?? "A",
    });
  };

  const deleteStudent = async (id: string) => {
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((student) => student._id !== id));
      setSuccess("Student deleted successfully.");
      toast({ variant: "success", title: "Student deleted", description: "Record removed successfully." });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to delete student";
      setError(msg);
      toast({ variant: "error", title: "Delete failed", description: msg });
    }
  };

  const assignClasses = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!assignTeacherId) {
      setError("Please select a teacher for assignment.");
      return;
    }

    try {
      const res = await api.put(`/teachers/assign/${assignTeacherId}`, {
        classes: [{ year: assignmentYear, section: assignmentSection }],
      });
      setTeachers((prev) => prev.map((t) => (t._id === assignTeacherId ? res.data : t)));
      setSuccess("Teacher assignment updated.");
      toast({ variant: "success", title: "Assignment updated", description: "Teacher class assignment succeeded." });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to assign class";
      setError(msg);
      toast({ variant: "error", title: "Assignment failed", description: msg });
    }
  };

  const rows = useMemo(() => students, [students]);

  return (
    <RequireAuth role="admin">
      <main className="mx-auto max-w-6xl p-8">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

        <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <p className="text-lg">Hello {user?.name ?? "Admin"},</p>
          <p className="mt-2">Manage student profiles and teacher assignments.</p>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-emerald-700">{success}</div>}

        <section className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Create / Update Student</h2>
          <form onSubmit={handleSubmit(submitStudent)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <input {...register("name")} className="rounded border p-2 w-full" placeholder="Name" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register("email")} className="rounded border p-2 w-full" type="email" placeholder="Email" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register("phone")} className="rounded border p-2 w-full" placeholder="Phone" />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <input {...register("rollNo")} className="rounded border p-2 w-full" placeholder="Roll No" />
              {errors.rollNo && <p className="text-xs text-red-600 mt-1">{errors.rollNo.message}</p>}
            </div>
            <div>
              <input {...register("dob")} className="rounded border p-2 w-full" type="date" />
              {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob.message}</p>}
            </div>
            <div>
              <input {...register("year", { valueAsNumber: true })} className="rounded border p-2 w-full" type="number" min={1900} max={2100} placeholder="Year" />
              {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year.message}</p>}
            </div>
            <div>
              <input {...register("branch")} className="rounded border p-2 w-full" placeholder="Branch" />
              {errors.branch && <p className="text-xs text-red-600 mt-1">{errors.branch.message}</p>}
            </div>
            <div>
              <input {...register("section")} className="rounded border p-2 w-full" placeholder="Section" />
              {errors.section && <p className="text-xs text-red-600 mt-1">{errors.section.message}</p>}
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button type="submit" className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
                {editingStudentId ? "Update Student" : "Create Student"}
              </button>
              {editingStudentId && (
                <button type="button" onClick={resetForm} className="rounded border px-4 py-2">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Assign Teacher to Class</h2>
          <form onSubmit={assignClasses} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select value={assignTeacherId} onChange={(e) => setAssignTeacherId(e.target.value)} className="rounded border p-2" required>
              <option value="">Select teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>{t.userId?.name} ({t.userId?.email})</option>
              ))}
            </select>
            <input type="number" value={assignmentYear} onChange={(e) => setAssignmentYear(Number(e.target.value))} className="rounded border p-2" placeholder="Year" required />
            <input value={assignmentSection} onChange={(e) => setAssignmentSection(e.target.value)} className="rounded border p-2" placeholder="Section" required />
            <button type="submit" className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500 sm:col-span-3">Assign class</button>
          </form>
        </section>

        <section className="overflow-x-auto rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Student List</h2>
          {loading ? (
            <p>Loading student records...</p>
          ) : (
            <div>
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-slate-600">Name</th>
                    <th className="px-4 py-2 text-slate-600">Email</th>
                    <th className="px-4 py-2 text-slate-600">Roll No</th>
                    <th className="px-4 py-2 text-slate-600">Year</th>
                    <th className="px-4 py-2 text-slate-600">Branch</th>
                    <th className="px-4 py-2 text-slate-600">Section</th>
                    <th className="px-4 py-2 text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-3 text-slate-500">No students found.</td>
                    </tr>
                  ) : (
                    rows.map((student) => (
                      <tr key={student._id} className="border-t border-slate-100">
                        <td className="px-4 py-2 text-slate-800">{student.userId?.name || student.name || "—"}</td>
                        <td className="px-4 py-2 text-slate-800">{student.userId?.email || "—"}</td>
                        <td className="px-4 py-2 text-slate-800">{student.rollNo}</td>
                        <td className="px-4 py-2 text-slate-800">{student.year}</td>
                        <td className="px-4 py-2 text-slate-800">{student.branch}</td>
                        <td className="px-4 py-2 text-slate-800">{student.section}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button onClick={() => editStudent(student)} className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">Edit</button>
                          <button onClick={() => deleteStudent(student._id)} className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-600">Showing {students.length} of {total}</p>
                <div className="flex gap-2">
                  <button onClick={() => fetchStudents(page - 1)} disabled={page <= 1} className="rounded border px-3 py-1 disabled:opacity-50">
                    Prev
                  </button>
                  <button onClick={() => fetchStudents(page + 1)} disabled={page * limit >= total} className="rounded border px-3 py-1 disabled:opacity-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-lg border bg-white p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Teacher List</h2>
          {teachers.length === 0 ? (
            <p className="text-sm text-slate-500">No teacher records yet. Register teachers using the register form.</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-slate-600">Name</th>
                  <th className="px-4 py-2 text-slate-600">Email</th>
                  <th className="px-4 py-2 text-slate-600">Branch</th>
                  <th className="px-4 py-2 text-slate-600">Assigned Classes</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-800">{teacher.userId?.name}</td>
                    <td className="px-4 py-2 text-slate-800">{teacher.userId?.email}</td>
                    <td className="px-4 py-2 text-slate-800">{teacher.branch || 'General'}</td>
                    <td className="px-4 py-2 text-slate-800">{(teacher.assignedClass || []).map((c: any) => `${c.year}${c.section}`).join(', ') || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </RequireAuth>
  );
}
