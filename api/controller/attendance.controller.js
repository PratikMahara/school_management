const Attendance = require('../model/attendance.model');
const moment = require('moment');

module.exports = {
  // Mark new attendance record
  markAttendance: async (req, res) => {
    const { studentId, date, status, classId } = req.body;
    try {
      const attendance = new Attendance({ student: studentId, date, status, class: classId});
      await attendance.save();
      res.status(201).json(attendance);
    } catch (err) {
      res.status(500).json({ message: 'Error marking attendance', err });
    }
  },

  // Get attendance records for a student
  getAttendance: async (req, res) => {
    const { studentId } = req.params;
    try {
      const attendance = await Attendance.find({ student: studentId }).populate('student');
      res.status(200).json(attendance);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching attendance', err });
    }
  },

  // Check if attendance already taken for a class today
  checkAttendance: async (req, res) => {
    try {
      const today = moment().startOf('day');
      const attendanceForToday = await Attendance.findOne({
        class: req.params.classId,
        date: {
          $gte: today.toDate(),
          $lt: moment(today).endOf('day').toDate(),
        },
      });

      if (attendanceForToday) {
        return res.status(200).json({ attendanceTaken: true, message: 'Attendance already taken for today' });
      } else {
        return res.status(200).json({ attendanceTaken: false, message: 'No attendance taken yet for today' });
      }
    } catch (error) {
      console.error('Error checking attendance:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  },

  // Fetch attendance records by class and date (for editing)
  fetchAttendanceByClassAndDate: async (req, res) => {
    try {
      const { classId, date } = req.query;

      if (!classId || !date) {
        return res.status(400).json({ message: 'classId and date are required' });
      }

      const startOfDay = moment(date).startOf('day').toDate();
      const endOfDay = moment(date).endOf('day').toDate();

      const records = await Attendance.find({
        class: classId,
        date: { $gte: startOfDay, $lte: endOfDay },
      }).populate('student');

      res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching attendance by class and date:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  // Update existing attendance record by ID
  updateAttendance: async (req, res) => {
    try {
      const attendanceId = req.params.id;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const updatedAttendance = await Attendance.findByIdAndUpdate(
        attendanceId,
        { status },
        { new: true }
      );

      if (!updatedAttendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }

      res.status(200).json(updatedAttendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },
};
