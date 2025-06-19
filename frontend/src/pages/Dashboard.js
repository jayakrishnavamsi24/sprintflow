import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ toDo: 0, inProgress: 0, done: 0 });
  const [overdue, setOverdue] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/reports/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data));

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/reports/overdue`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOverdue(res.data));

    // for now lets fetch progress for projectId = 1
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/reports/projects/1/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProgress(res.data.completionPercentage));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6">📊 Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow-md p-4 rounded text-center">
            <h3 className="text-gray-500">To Do</h3>
            <p className="text-3xl font-bold text-blue-700">{stats.toDo}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded text-center">
            <h3 className="text-gray-500">In Progress</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded text-center">
            <h3 className="text-gray-500">Done</h3>
            <p className="text-3xl font-bold text-green-600">{stats.done}</p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded mb-6">
          <h3 className="text-lg font-semibold mb-2">⏰ Overdue Tasks</h3>
          {overdue.length === 0 ? (
            <p className="text-gray-500">No overdue tasks 🎉</p>
          ) : (
            <ul className="list-disc pl-5">
              {overdue.map((task) => (
                <li key={task.id}>
                  <span className="font-medium">{task.title}</span> (Deadline:{" "}
                  {new Date(task.deadline).toLocaleDateString()})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">📈 Project Completion</h3>
          <p className="text-blue-700 text-2xl font-bold">
            {progress !== null ? `${progress}%` : "Loading..."}
          </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
