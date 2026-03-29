"use client";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react";

export default function RequireAuth({ children, role }: { children: React.ReactNode, role?: string }){
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || (role && user.role !== role))) {
            router.replace("/login");
        }
    }, [user, loading, role, router]);

    if (loading || !user || (role && user.role !== role)) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-6">
                <div className="rounded-lg border border-slate-300 bg-white p-6 shadow text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <p>Checking authentication…</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}