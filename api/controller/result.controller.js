const Result = require("../model/result.model");
const path = require("path");
const fs = require("fs");

// POST /teacher/uploadresult
const uploadResult = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Result PDF is required" 
      });
    }

    // Extract data from request
    const { classId, examId , student } = req.body;
    console.log(req.body);
    
    const teacherId = req.user.id; // Assuming teacher ID comes from auth middleware
    
   if (!classId || !examId || !student) {
    if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({
        success: false,
        message: "Class and exam information are required"
    });
}



    const newResult = new Result({
      resultpdf: req.file.path,
      result_class: classId,
      uploaded_teacher: teacherId,
      student : student,
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
        teacher: teacherId,
        student: student,
      }
    });

  } catch (error) {
    // Clean up uploaded file if saving to DB fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    console.error("Result upload error:", error);
    res.status(500).json({
      success: false,
      message: "Result upload failed",
      error: error.message
    });
  }
};

// GET results for a specific student
const getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    console.log("result" , req.params);
    
    const results = await Result.find({ student: studentId })
      .populate('examtype', 'examType')
      .populate('result_class', 'class_name class_num')
      .populate('uploaded_teacher', 'name');
      
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
    
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student results",
      error: error.message
    });
  }
};

module.exports = { 
  uploadResult,
  getStudentResults
};