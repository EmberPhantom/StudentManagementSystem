import { z } from "zod";

export const bulkAttendanceSchema = z.object({
    year: z.number(),
    section: z.string(),

    records: z.array(
        z.object({
            studentId: z.string(),
            status: z.enum(["present", "absent"])
        })
    )
});