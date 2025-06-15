const LeaveApplication = require('../model/leaveApplication.model');

module.exports = {

  viewLeaveApplications: async (req, res) => {
    try {

        const teacherId = req.user.id;

        const leaveApplications = await LeaveApplication.find()
          .populate({
            path: "student",
            populate: {
              path: "student_class",
              match: { class_teacher: teacherId },
              model: "Class"
            },
          });
          
        return res.status(200).json({
            message: "Leave applications fetched successfully",
            data: leaveApplications
        });

    } catch (error) {
      console.error('Error fetching leave applications:', error);
      return res.status(500).json({ message: 'Server error', error });
    }
  },
  
};
