const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { analyzeComplaintAI, analyzeRaw } = require("../controllers/ai.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

router.use(protect);

router.post(
  "/analyze",
  [body("complaintId").notEmpty().withMessage("complaintId is required")],
  validate,
  analyzeComplaintAI
);

router.post(
  "/analyze-raw",
  [
    body("title").notEmpty().withMessage("title is required"),
    body("description").notEmpty().withMessage("description is required"),
  ],
  validate,
  analyzeRaw
);

module.exports = router;
