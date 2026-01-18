import cors from "cors";
import express from "express";
import path from "path";
import authMiddleware from "./middleware/auth.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import fileRoutes from "./routes/file.routes.js";
const app = express();
app.use("/uploads", express.static(path.join("uploads")));
// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());
app.use("/api/chat", chatRoutes);
app.use("/api/projects", projectRoutes);

app.use("/api/files", fileRoutes);
// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Chatbot Platform Backend Running" });
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});
app.use("/api/auth", authRoutes);
export default app;
