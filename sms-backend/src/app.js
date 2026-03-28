import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

const app = express();

// DB connection
connectDB();


// Middleware
app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// Routes
import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);


// Error Handling
import errorHandling from "./middleware/error.middleware.js";
app.use(errorHandling);

export default app;