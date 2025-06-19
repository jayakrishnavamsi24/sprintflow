const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require('./config/database');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Comment = require('./models/Comment');
const UserStory = require('./models/UserStory');

const app = express();
app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const commentRoutes = require('./routes/commentRoutes');
app.use("/api", commentRoutes);
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use("/api", dashboardRoutes);
const projectRoutes = require("./routes/projectRoutes");
app.use("/api/projects", projectRoutes);
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
const aiRoutes = require('./routes/aiRoutes');
app.use("/api", aiRoutes);


app.get("/", (req, res) => {
  res.send("Project Management Tool API is running!");
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Failed to sync DB', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

