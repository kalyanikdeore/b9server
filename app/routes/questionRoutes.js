// routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const questionController = require("../controller/questionController");

router.post("/", questionController.createQuestion);
router.get("/", questionController.getAllQuestions);
router.get("/active", questionController.getActiveQuestions);
router.put("/:id", questionController.updateQuestion);
router.delete("/:id", questionController.deleteQuestion);

module.exports = router;
