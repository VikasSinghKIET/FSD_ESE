const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

// All routes are protected
router.use(protect);

router.get("/", authorizeRoles("admin"), getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", authorizeRoles("admin"), deleteUser);

module.exports = router;
