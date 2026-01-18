import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getProjects } from "../api/project";
import "../styles/Login.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const navigate = useNavigate();

  // LOAD PROJECTS
  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createProject({ name, description, systemPrompt });

      setName("");
      setDescription("");
      setSystemPrompt("");
      loadProjects();
    } catch (err) {
      alert("Project creation failed");
    }
  };

  return (
    <div style={{ padding: "30px" }} className="Main">
      <h2>Create New Agent</h2>

      <form
        onSubmit={handleCreate}
        style={{ marginBottom: "30px" }}
        className="form"
      >
        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <br />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input"
        />
        <br />
        <textarea
          placeholder="System Prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="input"
        />
        <br />
        <button type="submit" className="button">
          Create
        </button>
      </form>

      <h2>My Agents</h2>

      {projects.map((p) => (
        <div
          
          key={p._id}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            marginBottom: "12px",
            cursor: "pointer",
            borderRadius: "10px",
            background: "#ecbcd9",
            
          }}
          onClick={() => navigate(`/chat/${p._id}`)}
        >
          <h3 style={{ color: "#400f28" }}>{p.name}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Projects;
