const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { getAllBooks, uploadBook, updateBook, deleteBook } = require("../controller/books.controller");

router.post("/upload", authMiddleware(['SCHOOL']), uploadBook);
router.get("/fetch-all", authMiddleware(['SCHOOL','STUDENT','TEACHER']), getAllBooks);
// router.get("/fetch/:audience", authMiddleware(['SCHOOL','TEACHER','STUDENT']), fetchAudiance);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateBook);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteBook)

module.exports = router;
