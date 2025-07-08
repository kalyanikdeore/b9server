const express = require("express");
const authController = require("../controller/authController");
const loginController = require("../controller/loginController");
const { authenticate } = require("../middleware/authMiddleware");
const router = express.Router();
// api endpoints
router.post("/signup", authController.signup); //  http://localhost:9099/api/v1/auth/signup
router.post("/login", authController.login); //  http://localhost:9099/api/v1/auth/login a\
router.get("/refresh", authController.refreshToken); //  http://localhost:9099/api/v1/auth/refresh
router.post("/logout", authController.logout); //  http://localhost:9099/api/v1/auth/logout
router.get("/me", authenticate, authController.getEmp); //  http://localhost:9099/api/v1/auth/me
router.post("/adminlogin", loginController.login);

module.exports = router;
