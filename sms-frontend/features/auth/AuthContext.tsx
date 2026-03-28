"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

type User = {
    id: string;
    name: string;
    email: string;
    role: "admin" | "teacher" | "student";
};

type AuthContextType = {
    user: User | null;
    loading:boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [ user, setUser ] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async() => {
        setLoading(true);
        try{ 
            const res = await api.get("/auth/me");
            setUser(res.data.user);
        } catch{
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async(email: string, password: string) => {
        await api.post("/auth/login", {email, password});
        await fetchUser();
    };

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, loading, login, logout, fetchUser}}>
            {children}
        </AuthContext.Provider>    )
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if(!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};