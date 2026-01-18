import fetch from "node-fetch";
import ChatMessage from "../models/ChatMessage.js";
import Project from "../models/Project.js";

export const chatWithAgent = async (req, res) => {
  try {
    const { message, projectId } = req.body;

    if (!message)
      return res.status(400).json({ message: "Message is required" });

    if (!projectId)
      return res.status(400).json({ message: "Project ID is required" });

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found" });

    if (project.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    // Save user message
    await ChatMessage.create({
      project: project._id,
      user: req.user.id,
      role: "user",
      content: message
    });

    // Fetch chat history
    const previousMessages = await ChatMessage.find({
      project: project._id
    }).sort({ createdAt: 1 });

    const formattedHistory = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content
    }));

    // Files
    const projectFiles = project.files || [];

    // File name context
    let fileContext = "";
    if (projectFiles.length > 0) {
      fileContext =
        "Project attached files (use when relevant):\n" +
        projectFiles.map((f, i) => `${i + 1}. ${f.name}`).join("\n");
    }

    // Vision messages (images only)
    const visionMessages = [];

    projectFiles.forEach((file) => {
      if (file.type?.startsWith("image")) {
        visionMessages.push({
          role: "user",
          content: [
            { type: "text", text: "Here is an uploaded image for analysis" },
            {
              type: "image_url",
              image_url: {
                url: `http://localhost:5000${file.url}`
              }
            }
          ]
        });
      }
    });

    // Call OpenRouter with GPT-4o-mini
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Chatbot Platform"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `${project.systemPrompt}\n\n${fileContext}`
            },
            ...formattedHistory,
            ...visionMessages,
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    const aiReply =
      data?.choices?.[0]?.message?.content ||
      "AI did not return a response.";

    // Save reply
    await ChatMessage.create({
      project: project._id,
      user: req.user.id,
      role: "assistant",
      content: aiReply
    });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ message: "Chat failed" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    const messages = await ChatMessage.find({ project: projectId }).sort({
      createdAt: 1
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

