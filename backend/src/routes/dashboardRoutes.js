const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/reports/tasks", authenticate, dashboardController.taskStatusCount);
router.get("/reports/overdue", authenticate, dashboardController.overdueTasks);
router.get("/reports/projects/:id/progress", authenticate, dashboardController.projectProgress);

module.exports = router;