import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';  
import {Attendance} from '../models/attendance.model.js';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Student } from '../models/student.model.js';
import { Teacher } from '../models/teacher.model.js';

const createAttendance = asyncHandler(async (req, res) => {
    const { student, teacher, subName, date, status } = req.body;

    if (!student || !teacher || !subName || !date || !status) {
        throw new ApiError(400, 'All fields are required');
    }

    const studentexists = await Student.findById(student);
    if (!studentexists) {
        throw new ApiError(404, 'Student not found');
    }

    const teacherExists = await Teacher.findById(teacher);
    if (!teacherExists) {
        throw new ApiError(404, 'Teacher not found');
    }

    const existingAttendance = await Attendance.findOne({
        student,
        date: new Date(date)
    });

    if (existingAttendance) {
        throw new ApiError(400, 'Attendance for this student on this date already exists');
    }

    const attendance = await Attendance.create({
        student,
        teacher,
        subName,
        date: new Date(date),
        status
    });

    res.status(201).json(new ApiResponse('Attendance created successfully', attendance));
});

const getAllAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.find();
    if (attendance.length === 0) {
        return res.status(404).json(new ApiResponse('No attendance records found', []));
    }
    res.status(200).json(new ApiResponse('Attendance records fetched successfully', attendance));
});

const singleAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);
    if (!attendance) {
        return res.status(404).json(new ApiResponse('Attendance record not found', null));
    }
    res.status(200).json(new ApiResponse('Attendance record fetched successfully', attendance));
});

const updateAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { student, teacher, subName, date, status } = req.body;

    const attendanceRecord = await Attendance.findById(id);
    if (!attendanceRecord) {
        return res.status(404).json(new ApiResponse('Attendance record not found', null));
    }

    if (student && student !== attendanceRecord.student.toString()) {
        const studentExists = await Student.findById(student);
        if (!studentExists) {
            return res.status(404).json(new ApiResponse('Student not found', null));
        }
    }

    if (teacher && teacher !== attendanceRecord.teacher.toString()) {
        const teacherExists = await Teacher.findById(teacher);
        if (!teacherExists) {
            return res.status(404).json(new ApiResponse('Teacher not found', null));
        }
    }

    attendanceRecord.student = student || attendanceRecord.student;
    attendanceRecord.teacher = teacher || attendanceRecord.teacher;
    attendanceRecord.subName = subName || attendanceRecord.subName;
    attendanceRecord.date = date ? new Date(date) : attendanceRecord.date;
    attendanceRecord.status = status || attendanceRecord.status;

    const updatedAttendance = await attendanceRecord.save();

    res.status(200).json(new ApiResponse('Attendance updated successfully', updatedAttendance));
});

const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
        return res.status(404).json(new ApiResponse('Attendance record not found', null));
    }
    res.status(200).json(new ApiResponse('Attendance record deleted successfully', null));
});

export {
    createAttendance,
    getAllAttendance,
    singleAttendance,
    updateAttendance,
    deleteAttendance,  
 }