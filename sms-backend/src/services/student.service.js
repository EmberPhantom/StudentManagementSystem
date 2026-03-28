import User from "../models/user.js";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import { Query } from "mongoose";

/* ---------- CREATE STUDENT SERVICE ---------- */
export const createStudentService = async(data, teacher, role = 'teacher') => {
    const{
        name,
        email,
        phone,
        rollNo,
        dob,
        year,
        branch,
        section
    } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error(`Email already exists: ${email}`);
    }





  /* ---------- TEACHER/ADMIN ACCESS ---------- */
    if (role !== 'admin') {
        if (!teacher || !Array.isArray(teacher.assignedClass)) {
            throw new Error('Teacher information is required to create a student.');
        }

        const hasAccess = teacher.assignedClass.some(
            (cls) => cls.year === year && cls.section === section
        );

        if (!hasAccess) {
            throw new Error('You are not assigned to this class');
        }
    }




/* ---------- CREATE STUDENT AS A USER ---------- */
    const password = dob.replaceAll('-', '');
    const hasdhedPassword = await bcrypt.hash(password, 10);

    // Creating User
    const user = await User.create({
        name,
        email,
        phone,
        password: hasdhedPassword,
        role: 'student'
    });




/* ---------- CREATE STUDENT SERVICE ---------- */
    const student = await Student.create({
        userId: user._id,
        name,
        email,
        rollNo,
        dob,
        year,
        branch,
        section
    });

    return student;
}




/* ---------- GET STUDENT SERVICE ---------- */
export const getStudentService = async(query, teacher) => {
    const { page = 1, limit = 10, year, section, branch } = query;

    const filter = {};

    if (year) filter.year = year;
    if (section) filter.section = section;
    if (branch) filter.branch = branch;

    if (teacher && Array.isArray(teacher.assignedClass) && teacher.assignedClass.length) {
        filter.$or = teacher.assignedClass.map((cls) => ({
            year: cls.year,
            section: cls.section
        }));
    }

    const total = await Student.countDocuments(filter);

    const students = await Student.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('userId', 'name email phone role');

    return { students, total };
};




/* ---------- UPDATE STUDENT SERVICE ---------- */
export const updateStudentService = async (id, data) => {
    const student = await Student.findById(id);
    if (!student) throw new Error('student not found');

    const fields = { ...data };
    const userFields = {};

    if (fields.name) {
      userFields.name = fields.name;
      fields.name = fields.name;
    }

    if (fields.email) {
      const existingUser = await User.findOne({ email: fields.email, _id: { $ne: student.userId } });
      if (existingUser) {
        throw new Error(`Email already exists: ${fields.email}`);
      }
      userFields.email = fields.email;
      fields.email = fields.email;
    }
    if (fields.phone) {
      userFields.phone = fields.phone;
      fields.phone = fields.phone;
    }

    delete fields.password;

    if (Object.keys(userFields).length > 0) {
        await User.findByIdAndUpdate(student.userId, userFields, { new: true });
    }

    return await Student.findByIdAndUpdate(id, fields, { new: true });
};




/* ---------- DELETE STUDENT STUDENT ---------- */
export const deleteStudentService = async (id) => {
    const student = await Student.findById(id);
    if (!student) throw new Error('student not found');

    await User.findByIdAndDelete(student.userId);
    return await Student.findByIdAndDelete(id);
};