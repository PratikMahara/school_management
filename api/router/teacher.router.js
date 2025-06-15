const express = require("express");
const { 
  getTeacherWithQuery, 
  loginTeacher, 
  updateTeacherWithId, 
  getTeacherWithId, 
  signOut, 
  isTeacherLoggedIn, 
  registerTeacher, 
  deleteTeacherWithId, 
  getTeacherOwnDetails 
} = require("../controller/teacher.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth");
const resultController = require("../controller/result.controller");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { createOrUpdateAdmitCard } = require("../controller/admitCard.controller");
const { viewLeaveApplications } = require("../controller/leaveApplication.controller");

// Configure storage for result PDFs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/results");
    // Create the directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    cb(null, `result-${uniqueSuffix}${fileExt}`);
  }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max file size
});

// Teacher routes
router.post('/register', authMiddleware(['SCHOOL']), registerTeacher);
router.get("/fetch-with-query", authMiddleware(['SCHOOL']), getTeacherWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateTeacherWithId);
router.get("/fetch-own", authMiddleware(['TEACHER']), getTeacherOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['TEACHER', 'SCHOOL']), getTeacherWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteTeacherWithId);

// Result routes
router.post(
  "/uploadresult", 
  authMiddleware(['TEACHER']), 
  upload.single("resultFile"), 
  resultController.uploadResult
);

// Get student results
router.get(
  "/student-results/:studentId",
  authMiddleware(['TEACHER', 'SCHOOL', 'STUDENT', 'PARENT']),
  resultController.getStudentResults
);

// admit card
router.post('/admit-card', authMiddleware(['TEACHER']), createOrUpdateAdmitCard);

//leave application
router.get('/leave-application', authMiddleware(['TEACHER']), viewLeaveApplications)



module.exports = router;