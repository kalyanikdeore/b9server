// routes/clientRoutes.js
const express = require("express");
const clientController = require("../controller/clientController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/clients/create", authenticate, clientController.createClient);
router.get("/clients", clientController.getClients);
router.get("/clients/:id", clientController.getClientById);
router.get("/clients/:id/appointments", clientController.getClientAppointments);
router.put("/clients/:id", clientController.updateClient);
router.delete("/clients/:id", clientController.deleteClient);

module.exports = router;