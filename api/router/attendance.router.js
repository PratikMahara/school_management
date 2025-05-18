const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendance,
  checkAttendance,
  fetchAttendanceByClassAndDate,
  updateAttendance,
} = require('../controller/attendance.controller');
const authMiddleware = require('../auth/auth');

// Mark attendance
router.post('/mark', authMiddleware(['TEACHER']), markAttendance);

// Get attendance for a student
router.get('/:studentId', authMiddleware(['TEACHER', 'STUDENT', 'SCHOOL']), getAttendance);

// Check if attendance already taken for a class today
router.get('/check/:classId', authMiddleware(['TEACHER']), checkAttendance);

// Fetch attendance records by class and date (for editing)
router.get('/fetch', authMiddleware(['TEACHER']), fetchAttendanceByClassAndDate);

// Update attendance record by ID
router.put('/update/:id', authMiddleware(['TEACHER']), updateAttendance);

module.exports = router;
