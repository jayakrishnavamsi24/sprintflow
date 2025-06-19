const Comment = require("../models/Comment");
const User = require("../models/User");

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const taskId = req.params.id;

    const comment = await Comment.create({
      content,
      taskId,
      userId: req.user.id,
    });

    res.status(201).json(comment);
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ message: "Failed to add comment" });
  }
};

exports.getCommentsByTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const comments = await Comment.findAll({
      where: { taskId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Fetch Comment Error:", err);
    res.status(500).json({ message: "Failed to get comments" });
  }
};