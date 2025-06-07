const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/results" }); // can configure location if needed in future

const router = express.Router();

const {uploadResult} = require("../controller/result.controller");
router.post("/addresult", upload.single('resultpdf'), uploadResult);



module.exports = router;


