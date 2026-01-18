import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import { uploadProjectFile } from "../controllers/file.controller.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), uploadProjectFile);

export default router;
