import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [assignProjectId, setAssignProjectId] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProjects = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProjects(res.data));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingProjectId
      ? `${process.env.REACT_APP_API_URL}/api/projects/${editingProjectId}`
      : `${process.env.REACT_APP_API_URL}/api/projects`;

    const method = editingProjectId ? "put" : "post";

    axios[method](
      url,
      { name, description },
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(() => {
      setName("");
      setDescription("");
      setEditingProjectId(null);
      fetchProjects();
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      axios
        .delete(`${process.env.REACT_APP_API_URL}/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(fetchProjects);
    }
  };

  const startEditing = (project) => {
    setEditingProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
  };

  const fetchUsers = () => {
    axios
        .get(`${process.env.REACT_APP_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAllUsers(res.data));
  };

  const handleAssign = () => {
    axios
        .post(
        `${process.env.REACT_APP_API_URL}/api/projects/${assignProjectId}/assign`,
        { userIds: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
            setAssignProjectId(null);
            setSelectedUsers([]);
            alert("Users assigned successfully ✅");
        });
  };


  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">📁 Project Management</h2>

        {/* Project Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6 max-w-md">
          <h3 className="text-lg font-semibold mb-3">
            {editingProjectId ? "✏️ Edit Project" : "➕ Add New Project"}
          </h3>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
            required
          />
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingProjectId ? "Update Project" : "Create Project"}
          </button>
        </form>

        {/* Project List */}
        <div className="grid gap-4">
          {projects.map((project) => (
            <>
            <div
              key={project.id}
              className="bg-white p-4 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold text-lg">{project.name}</h4>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => startEditing(project)}
                  className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                    onClick={() => {
                        setAssignProjectId(project.id);
                        setSelectedUsers([]);
                        fetchUsers();
                    }}
                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Assign Users
                </button>

              </div>
            </div>
            {/* Assigned Users Section */}
            {project.Users?.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-600">👥 Assigned Team:</h4>
                <ul className="list-disc list-inside text-sm text-gray-800">
                  {project.Users.map((user) => (
                    <li key={user.id}>{user.name} ({user.role})</li>
                  ))}
                </ul>
              </div>
            )}
            {assignProjectId === project.id && (
                <div className="mt-3 border rounded p-3 bg-gray-50 shadow-sm">
                    <h4 className="font-semibold mb-2 text-sm text-gray-700">
                    Select team members:
                    </h4>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {allUsers.map((u) => (
                        <label key={u.id} className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            value={u.id}
                            onChange={(e) => {
                            if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, u.id]);
                            } else {
                                setSelectedUsers(selectedUsers.filter((id) => id !== u.id));
                            }
                            }}
                        />
                        <span>{u.name}</span>
                        </label>
                    ))}
                    </div>
                    <div className="mt-3 space-x-2">
                    <button
                        onClick={handleAssign}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                        Assign
                    </button>
                    <button
                        onClick={() => setAssignProjectId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                    >
                        Cancel
                    </button>
                    </div>
                </div>
            )}
            </>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectList;
