import Teacher from "../models/Teacher.js"

export const getTeachersService = async () => {
    return await Teacher.find().populate('userId', 'name email');
};

export const assignClasssesService = async (teacherId, classes) => {
    return await Teacher.findByIdAndUpdate(
        teacherId,
        { assignedClass: classes },
        { new: true }
    );
};