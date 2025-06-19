const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", authenticate, authorizeRoles("Admin", "Manager"), projectController.createProject);
router.put("/:id", authenticate, authorizeRoles("Admin", "Manager"), projectController.updateProject);
router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), projectController.deleteProject);
router.post(
  "/:id/assign",
  authenticate,
  authorizeRoles("Admin", "Manager"),
  projectController.assignUsers
);

router.get("/", authenticate, projectController.getAllProjects);
router.get("/:id", authenticate, projectController.getProjectById);

module.exports = router;
