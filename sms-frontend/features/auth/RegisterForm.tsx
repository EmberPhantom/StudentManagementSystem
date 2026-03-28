"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", branch: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { user, login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/register", form);

      if (user?.role === "admin") {
        setSuccess("Teacher created successfully. You are still logged in as admin.");
        toast({ variant: "success", title: "Teacher added", description: "Teacher account created successfully." });
        router.push("/admin");
      } else {
        await login(form.email, form.password);
        setSuccess("Registration successful! Redirecting to dashboard...");
        toast({ variant: "success", title: "Registration successful", description: "Welcome! Redirecting to dashboard." });
        router.push("/dashboard");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast({ variant: "error", title: "Registration failed", description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Create your account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "teacher" && (
          <Input name="branch" placeholder="Branch (e.g. Math, Physics)" value={form.branch || ""} onChange={handleChange} />
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </Button>
        {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{error}</div>}
        {success && <div className="rounded-md bg-emerald-50 p-2 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">{success}</div>}
      </form>
    </div>
  );
}