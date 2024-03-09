const express = require("express");
const UserController = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const bodyParser = require("body-parser"); // Add bodyParser for JSON parsing

router.use(bodyParser.json()); // Use bodyParser for JSON parsing

// Registration route   //working
router.post("/register", UserController.Register);

// Login route with JWT integration     //working and auth working as well
router.post("/login", UserController.Login);

router.post("/registercompany", protect, UserController.RegisterCompany);

module.exports = router;
