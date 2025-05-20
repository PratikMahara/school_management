const Result = require("../model/result.model");

// POST /teacher/uploadresult
const uploadResult = async (req, res) => {
  try {
    const { classId, examId } = req.body;
    const teacherId = req.user.id; // Assuming teacher ID comes from auth middleware
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Result PDF is required" 
      });
    }

    const newResult = new Result({
      resultpdf: req.file.path,
      result_class: classId,
      uploaded_teacher: teacherId, // Using authenticated teacher's ID
      examtype: examId
    });

    await newResult.save();

    res.status(201).json({
      success: true,
      message: "Result uploaded successfully",
      data: {
        filename: req.file.filename,
        class: classId,
        exam: examId,
        teacher: teacherId
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Result upload failed",
      error: error.message
    });
  }
};

module.exports = { uploadResult };
