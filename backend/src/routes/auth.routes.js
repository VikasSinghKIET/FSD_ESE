const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signup, login, getMe, getAllUsers, toggleUserStatus } = require("../controllers/auth.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

// Validation rules
const signupRules = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginRules = [
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, getMe);
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.put("/users/:id/toggle", protect, authorizeRoles("admin"), toggleUserStatus);

module.exports = router;
