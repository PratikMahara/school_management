const express = require("express");
const { getStudentWithQuery, loginStudent, updateStudentWithId, getStudentWithId, signOut, isStudentLoggedIn, getOwnDetails, registerStudent, deleteStudentWithId, getStudentByClassId, getStudentResults, downloadResult, fileComplaint } = require("../controller/student.controller");
const authMiddleware = require("../auth/auth");
const { viewComplaints } = require("../controller/school.controller");
const router = express.Router();

router.post('/register', authMiddleware(['SCHOOL']), registerStudent);
router.get("/fetch-with-query", authMiddleware(['SCHOOL','TEACHER']), getStudentWithQuery);
router.get("/by-class/:id", authMiddleware(['SCHOOL' , "TEACHER"]), getStudentByClassId);
router.post("/login", loginStudent);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateStudentWithId);
router.get("/fetch-own", authMiddleware(['STUDENT']), getOwnDetails);
router.get("/fetch-single/:id", authMiddleware(['STUDENT','SCHOOL']), getStudentWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteStudentWithId);
router.get("/sign-out", signOut);
router.get("/is-login", isStudentLoggedIn);

router.get('/results/:studentId',  getStudentResults);

// Download result
router.get('/download-result/:resultId ', downloadResult);

// complaints
router.post('/complaints', authMiddleware(['STUDENT']), fileComplaint);
router.get('/complaints', authMiddleware(['SCHOOL']), viewComplaints);


module.exports = router;