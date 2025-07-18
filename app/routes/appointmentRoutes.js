const express = require("express");
const appointmentController = require("../controller/appointmentController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create", authenticate, appointmentController.createAppointment);
router.get("/:id", appointmentController.getAppointmentById);
router.get("/list", appointmentController.getAppointments);
router.put("/:id", appointmentController.updateAppointment);
router.delete("/delete/:id", appointmentController.deleteAppointment);

module.exports = router;
