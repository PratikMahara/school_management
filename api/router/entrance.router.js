const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth')
const { addNewEntrance , allentrance } = require("../controller/entrance.controller");

router.get('/entrance' ,authMiddleware(["entrance"]), allentrance );
router.post("/entrance",authMiddleware(["entrance"]), addNewEntrance ); 

module.exports = router;