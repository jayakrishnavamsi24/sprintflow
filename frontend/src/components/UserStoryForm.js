import { useState } from "react";
import axios from "axios";

const UserStoryForm = () => {
  const [description, setDescription] = useState("");
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState(1); // default projectId (or pass as prop)

  const token = localStorage.getItem("token");

  const handleGenerate = async () => {
    setLoading(true);
    setStories([]);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/ai/generate-user-stories`,
        {
          projectDescription: description,
          projectId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStories(res.data); // array of user story strings
      alert("✅ Tasks auto-created from user stories!");
    } catch (err) {
      console.error("AI Error:", err);
      alert("❌ Failed to generate stories.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-3">🤖 AI User Story Generator</h3>
      <textarea
        placeholder="Enter project description..."
        className="w-full border px-3 py-2 rounded mb-3"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        disabled={loading || !description}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate User Stories"}
      </button>

      {stories.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Generated Stories:</h4>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {stories.map((s, idx) => (
              <li key={idx}>{s.content}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserStoryForm;
