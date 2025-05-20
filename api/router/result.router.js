const express = require("express");
const router = express.Router();

const {uploadResult} = require("../controller/result.controller");

router.get("/addresult" , uploadResult);

module.exports = router;


