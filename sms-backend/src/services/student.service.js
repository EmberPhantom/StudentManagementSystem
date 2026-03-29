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

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new Error(`Email already exists: ${normalizedEmail}`);
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

        if (teacher.branch && branch !== teacher.branch) {
            throw new Error(`Teacher can only create students in branch ${teacher.branch}`);
        }
    }




/* ---------- CREATE STUDENT AS A USER ---------- */
    const passwordToUse = data.password ? data.password : dob.replace(/-/g, '');
    const hasdhedPassword = await bcrypt.hash(passwordToUse, 10);

    const user = await User.create({
        name,
        email: normalizedEmail,
        phone,
        password: hasdhedPassword,
        role: 'student'
    });




/* ---------- STUDENT SERVICE ---------- */
    const student = await Student.create({
        userId: user._id,
        name,
        email,
        phone,
        rollNo,
        dob,
        year,
        branch,
        section
    });

    return await Student.findById(student._id).populate('userId', 'name email phone role');
}




/* ---------- GET STUDENT SERVICE ---------- */
export const getStudentService = async(query, teacher, user) => {
    const { page = 1, limit = 10, year, section, branch } = query;

    const filter = {};

    if (user && user.role === 'student') {
        const student = await Student.findOne({ userId: user.id }).populate('userId', 'name email phone role');
        return { students: student ? [student] : [], total: student ? 1 : 0 };
    }

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
      const normalizedEmail = fields.email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: student.userId } });
      if (existingUser) {
        throw new Error(`Email already exists: ${normalizedEmail}`);
      }
      userFields.email = normalizedEmail;
      fields.email = normalizedEmail;
    }

    if (fields.password) {
      userFields.password = await bcrypt.hash(fields.password, 10);
      delete fields.password;
    }

    if (fields.phone) {
      userFields.phone = fields.phone;
      fields.phone = fields.phone;
    }

    delete fields.password;

    if (Object.keys(userFields).length > 0) {
        await User.findByIdAndUpdate(student.userId, userFields, { new: true });
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, fields, { new: true });

    if (userFields.phone) {
        await Student.findByIdAndUpdate(id, { phone: userFields.phone });
    }

    return await Student.findById(updatedStudent._id).populate('userId', 'name email phone role');
};




/* ---------- DELETE STUDENT DETAIL ---------- */
export const deleteStudentService = async (id) => {
    const student = await Student.findById(id);
    if (!student) throw new Error('student not found');

    await User.findByIdAndDelete(student.userId);
    return await Student.findByIdAndDelete(id);
};


/* ---------- UPDATE STUDENT DETAILS --------- */
export const updateStudentPasswordService = async (id, newPassword) => {
    const student = await Student.findById(id);
    if (!student) throw new Error('student not found');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(student.userId, { password: hashedPassword }, { new: true });

    return { message: 'Student password updated successfully' };
};