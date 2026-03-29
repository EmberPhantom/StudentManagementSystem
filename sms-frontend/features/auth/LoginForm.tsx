'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { useToast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    const { toast } = useToast(); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(form.email, form.password);
            router.push("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.message || "Login failed";
            setError(msg);
            toast({ variant: "error", title: "Login failed", description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-md dark:border-slate-700 dark:bg-slate-900">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Login to your account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
                {error && <div className="rounded-md bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-200">{error}</div>}
            </form>
        </div>
    );
}