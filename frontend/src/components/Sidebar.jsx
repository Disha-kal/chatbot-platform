const Sidebar = ({ projects, activeProject, setActiveProject }) => {
  return (
    <div
      style={{
        width: "260px",
        borderRight: "1px solid #ddd",
        padding: "15px",
        overflowY: "auto",
        height: "100vh",
      }}
    >
      <h3>My Agents</h3>

      {projects.map((p) => (
        <div
          key={p._id}
          onClick={() => setActiveProject(p)}
          style={{
            boxShadow: "0 2px 4px rgba(15, 14, 14, 0.1)",
            padding: "10px",
            marginBottom: "8px",
            cursor: "pointer",
            borderRadius: "6px",
            background: activeProject?._id === p._id ? "#992375" : "#f3f4f6",
            color: activeProject?._id === p._id ? "white" : "black",
          }}
        >
          {p.name}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
