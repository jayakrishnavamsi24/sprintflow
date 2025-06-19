import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-700 text-white px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">🚀 SprintFlow</h1>
      <div className="space-x-4">
        {user?.role === "Admin" || user?.role === "Manager" ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/tasks" className="hover:underline">Tasks</Link>
            <Link to="/projects" className="hover:underline">Projects</Link>
            <Link to="/generate-stories" className="hover:underline">
              AI Generator
            </Link>
          </>
        ) : (
          <Link to="/tasks" className="hover:underline">My Tasks</Link>
        )}
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;