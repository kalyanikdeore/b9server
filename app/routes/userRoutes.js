const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

// Get user dashboard
router.get(
  "/:userId/dashboard",

  userController.getUserDashboard
);

// Admin routes
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
