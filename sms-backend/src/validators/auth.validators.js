import { z } from "zod";

export const registerSchema = z.object({
    name : z.string().min(3, 'Name must be at least 3 characters'),
    email : z.string().email("Invalid Email"),
    password : z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, 'Must contain one uppercase letter')
        .regex(/[0-9]/, "Must contain one number"),
    role : z.enum(['admin', 'teacher', 'student']),
    branch: z.string().optional(),
    rollNo: z.string().optional(),
    dob: z.string().optional(),
    year: z.number().int().optional(),
    section: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password : z.string()
});