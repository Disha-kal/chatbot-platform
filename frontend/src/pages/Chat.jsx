import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatHistory, sendMessage } from "../api/chat";
import "../styles/Chat.css";
import Sidebar from "../components/Sidebar";
import { getProjects } from "../api/project";
import { uploadFileToProject } from "../api/files";


const Chat = () => {
  const { projectId } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
const [attachedFileName, setAttachedFileName] = useState("");

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      const res = await getProjects();
      setProjects(res.data);

      const current = res.data.find(p => p._id === projectId);
      setActiveProject(current || res.data[0]);
    };

    loadProjects();
  }, [projectId]);

  // Load chat history
  useEffect(() => {
    if (!activeProject) return;

    const loadHistory = async () => {
      const res = await getChatHistory(activeProject._id);

      if (res.data.length === 0) {
        setMessages([
          {
            role: "assistant",
            content: "Hello 👋 Welcome! How can I help you today?"
          }
        ]);
      } else {
        setMessages(res.data);
      }
    };

    loadHistory();
  }, [activeProject]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !activeProject) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      const res = await sendMessage({
        message: input,
        projectId: activeProject._id,
      });

      const aiMessage = {
        role: "assistant",
        content: res.data.reply,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      alert("Chat failed");
    }
  };

  // Upload file
  const handleFileUpload = async (e) => {
  const uploadedFile = e.target.files[0];
  if (!uploadedFile || !activeProject) return;

  setAttachedFileName(uploadedFile.name);

  const formData = new FormData();
  formData.append("file", uploadedFile);
  formData.append("projectId", activeProject._id);

  try {
    await uploadFileToProject(formData);
  } catch (err) {
    console.error(err);
    alert("File upload failed");
  }

  e.target.value = "";
};


  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        projects={projects}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
      />

      <div className="containers" style={{ flex: 1 }}>
        <div className="chatBox">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`message ${m.role === "user" ? "user" : "assistant"}`}
            >
              {m.content}
            </div>
          ))}
        </div>

        <div className="inputArea">
          {attachedFileName && (
  <div style={{
    position: "absolute",
    bottom: "70px",
    left: "260px",
    background: "#f1e0f3",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px"
  }}>
    📎 {attachedFileName}
  </div>
)}

          <input
            type="file"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          <label htmlFor="fileUpload" className="buttons">
            Upload
          </label>

          <input
            className="inputs"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
          />

          <button className="buttons" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

