import { createStudentSchema } from "../validators/student.validator.js";
import { createStudentService, deleteStudentService, getStudentService, updateStudentService } from "../services/student.service.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";

/* ---------- CREATE STUDENT CONTROLLER ---------- */
export const createStudentController = async (req, res) => {
    try {
        const validated = createStudentSchema.parse(req.body);

        const teacher = await Teacher.findOne({ userId: req.user.id });

        if (!teacher && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not a teacher or admin' });
        }

        const student = await createStudentService(validated, teacher, req.user.role);

        res.status(201).json(student);

    } catch(error) {
        res.status(400).json({message: error.message});
    }
};




/* ---------- GET STUDENT CONTROLLER ---------- */
export const getStudentController = async (req,res) => {
    try{
        const teacher = await Teacher.findOne({ userId: req.user.id });

        const result = await getStudentService(req.query, teacher, req.user);

        res.json(result);
    } catch(error) {
        res.status(400).json({message: error.message});
    }
}

/* ---------- GET CURRENT STUDENT CONTROLLER ---------- */
export const getCurrentStudentController = async (req,res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email phone role');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}


/* ---------- UPDATE STUDENT CONTROLLER ---------- */
export const updateStudentController = async (req, res) => {
    try{
        const teacher = await Teacher.findOne({ userId: req.user.id });
        const existingStudent = await Student.findById(req.params.id);

        if (!existingStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (req.user.role === 'teacher') {
            if (!teacher) {
                return res.status(403).json({ message: 'Not a teacher' });
            }

            const allowed = teacher.assignedClass.some((cls) => cls.year === existingStudent.year && cls.section === existingStudent.section);
            if (!allowed) {
                return res.status(403).json({ message: 'Not authorized to update this student' });
            }
            if (teacher.branch && existingStudent.branch !== teacher.branch) {
                return res.status(403).json({ message: 'Not authorized to update student in this branch' });
            }
        }

        const student = await updateStudentService(req.params.id, req.body);

        res.json(student);
    }catch(error){
        res.status(400).json({ message: error.message })
    }
}




/* ---------- DELETE STUDENT CONTROLLER ---------- */
export const deleteStudentController = async (req, res) => {
    try{
        const student = await deleteStudentService(req.params.id);

        res.json(student);
    } catch(error){
        res.status(400).json({ message:error.message })
    }
}

export const updateStudentPasswordController = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const result = await updateStudentPasswordService(req.params.id, password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};