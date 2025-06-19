const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/ai/generate-user-stories", authenticate, aiController.generateStories);

module.exports = router;