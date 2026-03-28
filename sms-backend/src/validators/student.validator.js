import { z } from "zod";

export const createStudentSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
    rollNo: z.string().min(12),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format YYYY-MM-DD"),
    year: z.number().int().min(1900).max(2100),
    branch: z.string().min(1),
    section: z.string().min(1)
});