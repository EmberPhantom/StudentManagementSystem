import { createStudentSchema } from "../validators/student.validator.js";
import { createStudentService, deleteStudentService, getStudentService, updateStudentService } from "../services/student.service.js";
import Teacher from "../models/Teacher.js";

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

        const result = await getStudentService(req.query, teacher);

        res.json(result);
    } catch(error) {
        res.status(400).json({message: error.message});
    }
}




/* ---------- UPDATE STUDENT CONTROLLER ---------- */
export const updateStudentController = async (req, res) => {
    try{
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