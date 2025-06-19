const { generateUserStories } = require("../services/groqService");
const UserStory = require("../models/UserStory");
const Task = require("../models/Task");

exports.generateStories = async (req, res) => {
  try {
    const { projectDescription, projectId } = req.body;

    if (!projectDescription || !projectId) {
      return res.status(400).json({ message: "Missing description or project ID" });
    }

    const stories = await generateUserStories(projectDescription);
    const savedStories = [];

    for (let story of stories) {
      const userStory = await UserStory.create({
        content: story,
        projectId,
      });

      await Task.create({
        title: story.slice(0, 50) + "...", // Trim title
        description: story,
        status: "To Do",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
        projectId,
        assignedTo: req.user.id, // Assign to current user for now
      });

      savedStories.push(userStory);
    }

    res.status(200).json(savedStories);
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ message: "AI story generation failed" });
  }
};