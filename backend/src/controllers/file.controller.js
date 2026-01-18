import openai from "../utils/openai.js";
import Project from "../models/Project.js";
import fs from "fs";
import path from "path";

export const uploadProjectFile = async (req, res) => {
  try {
    const { projectId } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Read file from disk (because multer stored it physically)
    const fileStream = fs.createReadStream(file.path);

    // Upload to OpenAI
    const uploaded = await openai.files.create({
      file: fileStream,
      purpose: "assistants"
    });

    // Store metadata in project
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        files: {
          name: file.originalname,
          url: `/uploads/${file.filename}`,
          type: file.mimetype,
          openaiFileId: uploaded.id
        }
      }
    });

    res.json({
      message: "File uploaded successfully",
      fileId: uploaded.id
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "File upload failed" });
  }
};

