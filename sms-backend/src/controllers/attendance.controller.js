import { bulkAttendanceSchema } from "../validators/attendance.validator.js";
import { markBulkAttendanceService, getAttendanceService, getAttendanceReportService } from "../services/attendance.service.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";


export const markBulkAttedanceController = async (req, res) => {
    try{

        const validated = bulkAttendanceSchema.parse(req.body);

        const teacher = await Teacher.findOne({ userId: req.user.id || req.user._id})

        if(!teacher) {
            return res.status(403).json({ message: 'Not a teacher' })
        }

        const result = await markBulkAttendanceService(validated, teacher);

        res.status(201).json(result);

    } catch(error){
        res.status(400).json({ message: error.message });
    }
}




export const getAttendanceController = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) return res.status(404).json({ message: 'Student not found' });

      req.query.studentId = student._id.toString();
    }

    const data = await getAttendanceService(req.query, teacher);

    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};




export const getAttendanceReportController = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      if (student._id.toString() !== req.params.studentId) {
        return res.status(403).json({ message: 'Not authorized to view this report' });
      }
    }

    const report = await getAttendanceReportService(req.params.studentId);

    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};