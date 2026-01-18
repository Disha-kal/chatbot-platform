import express from "express";
import { chatWithAgent, getChatHistory } from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, chatWithAgent);
router.get("/:projectId", authMiddleware, getChatHistory);

export default router;

