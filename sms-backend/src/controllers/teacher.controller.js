import { assignClasssesService, getTeachersService, getTeacherByUserIdService, updateTeacherService, deleteTeacherService } from "../services/teacher.service.js"

export const getTeachersController = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const teachers = await getTeachersService({ page: Number(page), limit: Number(limit) });
        res.json(teachers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteTeacherController = async (req, res) => {
    try {
        const teacher = await deleteTeacherService(req.params.id);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const assignClassesController = async(req, res) => {
    try{
        const teacher = await assignClasssesService(
            req.params.id,
            req.body.classes
        );

        res.json(teacher);
    } catch(error){
        res.status(400).json({ message: error.message });
    }
};

export const updateTeacherController = async (req, res) => {
    try {
        const teacher = await updateTeacherService(req.params.id, req.body);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTeacherMeController = async (req, res) => {
    try {
        const teacher = await getTeacherByUserIdService(req.user.id);
        if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};