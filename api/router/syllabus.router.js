const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { uploadSyllabus, getAllSyllabus, updateSyllabus, deleteSyllabus } = require("../controller/syllabus.controller");

router.post("/upload", authMiddleware(['SCHOOL']), uploadSyllabus);
router.get("/fetch-all", authMiddleware(['SCHOOL','STUDENT','TEACHER']), getAllSyllabus);
// router.get("/fetch/:audience", authMiddleware(['SCHOOL','TEACHER','STUDENT']), fetchAudiance);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateSyllabus);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteSyllabus)

module.exports = router;
