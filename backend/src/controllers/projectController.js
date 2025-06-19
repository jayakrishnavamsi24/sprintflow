const Project = require("../models/Project");
const User = require("../models/User");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newProject = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ message: "Project creation failed" });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ message: "Error fetching project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    project.name = name || project.name;
    project.description = description || project.description;
    await project.save();

    res.status(200).json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Error updating project" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.destroy();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Error deleting project" });
  }
};

exports.assignUsers = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { userIds } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // This assumes many-to-many relation via ProjectUsers
    await project.setUsers(userIds); // Sequelize magic method
    res.status(200).json({ message: "Users assigned to project" });
  } catch (err) {
    console.error("Assign Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

