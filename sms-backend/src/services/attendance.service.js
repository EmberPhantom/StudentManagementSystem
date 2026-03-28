import Attendance from "../models/Attendance.js";
import Student from '../models/Student.js';

// SINGLE MARKING
export const markSingleAttendance = async (data) => {
    return await Attendance.create(data);
};


// BULK MARKING
export const markBulkAttendanceService = async (data, teacher) => {
    const { year, section, records } = data;

    if (!teacher || !Array.isArray(teacher.assignedClass)) {
        throw new Error('Teacher information is required to mark attendance.');
    }

    const hasAccess = teacher.assignedClass.some(
        (cls) => cls.year === year && cls.section === section 
    );

    if(!hasAccess) {
        throw new Error('You are not assigned to this class');
    }

    const today = new Date();

    const formattedRecords = records.map((rec) => ({
        ...rec,
        date: today
    }));

    try {
        return await Attendance.insertMany(formattedRecords, {
            ordered: false
        });
    } catch (error) {
        throw new Error('Some attendance records already exist');
    }
};


// FILTER ATTENDANCE
export const getAttendanceService = async (query, teacher) => {
  const { studentId, year, section, fromDate, toDate } = query;

  const filter = {};

  if (studentId) {
    filter.studentId = studentId;
  }

  if (fromDate && toDate) {
    filter.date = {
      $gte: new Date(fromDate),
      $lte: new Date(toDate)
    };
  }

  if (year && section) {
    const students = await Student.find({ year, section });

    const studentIds = students.map((s) => s._id);

    filter.studentId = { $in: studentIds };
  }

  if (teacher && Array.isArray(teacher.assignedClass) && year && section) {
    const hasAccess = teacher.assignedClass.some(
      (cls) => cls.year == year && cls.section == section
    );

    if (!hasAccess) {
      throw new Error('Unauthorized class access');
    }
  }

  const data = await Attendance.find(filter)
    .populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name' }
    })
    .sort({ date: -1 });

  return data;
};


// FILTER ATTENDANCE REPORT
export const getAttendanceReportService = async (studentId) => {
  const records = await Attendance.find({ studentId });

  const total = records.length;

  const present = records.filter((r) => r.status === 'present').length;

  const percentage = total === 0 ? 0 : (present / total) * 100;

  return {
    total,
    present,
    percentage: percentage.toFixed(2)
  };
};