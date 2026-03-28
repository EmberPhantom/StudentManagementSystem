import Teacher from "../models/Teacher.js"
import User from "../models/user.js";

export const getTeachersService = async ({ page = 1, limit = 10 } = {}) => {
    const skip = (page - 1) * limit;
    const total = await Teacher.countDocuments();
    const teachers = await Teacher.find()
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('userId', 'name email role');

    return { teachers, total };
};

export const getTeacherByUserIdService = async (userId) => {
    return await Teacher.findOne({ userId }).populate('userId', 'name email');
};

export const assignClasssesService = async (teacherId, classes) => {
    return await Teacher.findByIdAndUpdate(
        teacherId,
        { assignedClass: classes },
        { new: true }
    );
};

export const updateTeacherService = async (teacherId, data) => {
    return await Teacher.findByIdAndUpdate(teacherId, data, { new: true }).populate('userId', 'name email');
};

export const deleteTeacherService = async (teacherId) => {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) throw new Error('Teacher not found');

    await Teacher.findByIdAndDelete(teacherId);
    await User.findByIdAndDelete(teacher.userId);
    return teacher;
};

