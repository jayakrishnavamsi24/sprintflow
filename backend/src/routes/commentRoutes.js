const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/tasks/:id/comments", authenticate, commentController.addComment);

router.get("/tasks/:id/comments", authenticate, commentController.getCommentsByTask);

module.exports = router;