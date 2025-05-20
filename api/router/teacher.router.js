const express = require("express");
const { getTeacherWithQuery, loginTeacher, updateTeacherWithId, getTeacherWithId, signOut, isTeacherLoggedIn, registerTeacher, deleteTeacherWithId, getTeacherOwnDetails } = require("../controller/teacher.controller");
const router = express.Router();
const authMiddleware = require("../auth/auth");
const resultController = require("../controller/result.controller");

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/results");
    // Create the directory if it doesn't exist
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });


router.post('/register', authMiddleware(['SCHOOL']), registerTeacher);
router.get("/fetch-with-query", authMiddleware(['SCHOOL']), getTeacherWithQuery);
router.post("/login", loginTeacher);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateTeacherWithId);
router.get("/fetch-own", authMiddleware(['TEACHER']), getTeacherOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['TEACHER', 'SCHOOL']), getTeacherWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteTeacherWithId)
router.post("/uploadresult" , upload.single("resultFile"), resultController.uploadResult);
// router.get("/sign-out", signOut);
// router.get("/is-login",  isTeacherLoggedIn)

module.exports = router;