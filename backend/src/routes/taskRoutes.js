const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", authenticate, authorizeRoles("Admin", "Manager"), taskController.createTask);

router.get("/", authenticate, taskController.getAllTasks);
router.get("/:id", authenticate, taskController.getTaskById);

router.put("/:id", authenticate, taskController.updateTask);

router.delete("/:id", authenticate, authorizeRoles("Admin", "Manager"), taskController.deleteTask);

module.exports = router;
