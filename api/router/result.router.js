const express = require("express");
const router = express.Router();

const {uploadResult} = require("../controller/result.controller");
router.post("/addresult", upload.single('resultpdf'), uploadResult);



module.exports = router;


