const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { getLatestCalendar, uploadCalendar, deleteCalendar } = require("../controller/calendar.controller");

router.post("/upload", authMiddleware(['SCHOOL']), uploadCalendar);
router.get("/fetch-calendar", authMiddleware(['SCHOOL','STUDENT','TEACHER']), getLatestCalendar);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteCalendar)

module.exports = router;