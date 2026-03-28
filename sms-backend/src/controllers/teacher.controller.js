import { assignClasssesService, getTeachersService } from "../services/teacher.service.js"

export const getTeachersController = async (req, res) => {
    try {
        const teachers = await getTeachersService();
        res.json(teachers);
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