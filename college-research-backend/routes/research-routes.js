const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth-middleware");
const role = require("../middleware/role-middleware");
const controller = require("../controllers/research-controller");

// STUDENT
router.post("/submit", auth, role("student"), controller.submitResearch);
router.get("/my", auth, role("student"), controller.getMyResearch);

// TEACHER
router.get("/mystudent", auth, role("teacher"), controller.getMyStudentsResearch);
router.put("/update/:id", auth, role("teacher"), controller.updateResearchStatus);

module.exports = router;