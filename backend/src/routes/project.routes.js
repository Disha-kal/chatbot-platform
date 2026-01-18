import express from "express";
import {
  createProject,
  getMyProjects,
  getProjectById
} from "../controllers/project.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getMyProjects);
router.get("/:id", authMiddleware, getProjectById);

export default router;
