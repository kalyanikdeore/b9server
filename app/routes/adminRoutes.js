const express = require("express");
const adminController = require("../controller/adminController");

const router = express.Router();
// api endpoints
router.post("/admin-register", adminController.signup); //  http://localhost:9099/api/v1/auth/signup
router.post("/admin-login", adminController.login);

// router.get("/admin-list", adminController.getAdminListing);
//
//  http://localhost:9099/api/v1/adminauth/admin-login

module.exports = router;
