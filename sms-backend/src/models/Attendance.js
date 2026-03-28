import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true 
    },

    date: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ["absent", "present"],
        require: true
    },
});

attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

attendanceSchema.index({ date: -1 });

export default mongoose.model('Attendance', attendanceSchema);