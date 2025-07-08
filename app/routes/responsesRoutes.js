// routes/responseRoutes.js
const express = require("express");
const router = express.Router();
const responseController = require("../controller/responseController");

router.post("/appointment/:appointmentId", responseController.submitResponses);
router.get("/user/:userId", responseController.getUserResponses);
router.get(
  "/appointment/:appointmentId",
  responseController.getAppointmentResponses
);

module.exports = router;
