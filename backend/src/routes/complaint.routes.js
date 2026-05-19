const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
  getStats,
} = require("../controllers/complaint.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const complaintRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
  body("title").trim().isLength({ min: 5 }).withMessage("Title must be at least 5 characters"),
  body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
  body("category").notEmpty().withMessage("Category is required").isIn([
    "Water Supply","Electricity","Garbage & Sanitation","Roads & Infrastructure",
    "Public Safety","Healthcare","Education","Other",
  ]).withMessage("Invalid category"),
  body("location").trim().notEmpty().withMessage("Location is required"),
];

// All routes are protected
router.use(protect);

router.get("/stats", authorizeRoles("admin"), getStats);
router.get("/search", searchComplaints);
router.get("/", getAllComplaints);
router.post("/", complaintRules, validate, createComplaint);
router.get("/:id", getComplaintById);
router.put("/:id", updateComplaint);
router.delete("/:id", deleteComplaint);

module.exports = router;
