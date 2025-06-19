import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const TaskList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState({}); // taskId -> comment array

  const token = localStorage.getItem("token");

  const fetchTasks = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = (taskId, newStatus) => {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(fetchTasks);
  };

  const loadComments = (taskId) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setComments((prev) => ({
          ...prev,
          [taskId]: res.data,
        }))
      );
  };

  const handleAddComment = (taskId) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setCommentText("");
        loadComments(taskId);
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">🧾 Task List</h2>
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-500">
                    Deadline:{" "}
                    <span className="font-medium">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Assigned To:{" "}
                    <span className="font-semibold">{task.assignee?.name}</span>
                  </p>
                </div>

                <div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="border px-2 py-1 rounded"
                    disabled={
                      user.role !== "Admin" &&
                      user.role !== "Manager" &&
                      task.assignedTo !== user.id
                    }
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedTaskId(
                      selectedTaskId === task.id ? null : task.id
                    );
                    if (!comments[task.id]) loadComments(task.id);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {selectedTaskId === task.id ? "Hide Comments" : "Show Comments"}
                </button>

                {selectedTaskId === task.id && (
                  <div className="mt-2 space-y-2">
                    <ul className="pl-4 text-sm list-disc">
                      {comments[task.id]?.map((c) => (
                        <li key={c.id}>
                          <span className="font-semibold">{c.User?.name}:</span>{" "}
                          {c.content}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 border px-2 py-1 rounded text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(task.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TaskList;
