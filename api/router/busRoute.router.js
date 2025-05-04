const express = require("express");
const router = express.Router();
const authMiddleware = require('../auth/auth');
const { registerBusRoute, getAllRoutes, editBusRoute, deleteBusRoute } = require("../controller/busRoute.controller");

router.post("/create", authMiddleware(['SCHOOL']), registerBusRoute);
router.get("/fetch-all", authMiddleware(['SCHOOL','STUDENT','TEACHER']), getAllRoutes);
// router.get("/fetch-single/:id", authMiddleware(['SCHOOL']), );
router.patch("/update/:id", authMiddleware(['SCHOOL']), editBusRoute);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteBusRoute);

module.exports = router;