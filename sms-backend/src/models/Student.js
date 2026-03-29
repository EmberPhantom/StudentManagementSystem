import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: false,
            trim: true
        },
        rollNo: {
            type: String,
            required: true,
            unique: true
        },
        dob: {
            type: Date,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required:true 
        }
    },
    { timestamps: true }
);

studentSchema.index({ year: 1, section: 1 });

export default mongoose.model('student', studentSchema);