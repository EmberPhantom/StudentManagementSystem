import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        branch: {
            type: String,
            required: false,
            default: "General"
        },

        assignedClass: [{
            year: Number,
            section: String
        }]
    },
    { timestamps : true }
);

export default mongoose.model('Teacher', teacherSchema);