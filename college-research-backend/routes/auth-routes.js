const express = require("express");
const { register, login  ,getTeachers} = require("../controllers/auth-controller");

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
// Students fetch teachers list
router.get("/teachers", getTeachers);

module.exports = router;