import API from "./axios";

// Send message to agent
export const sendMessage = (data) =>
  API.post("/chat", data);

// Get chat history
export const getChatHistory = (projectId) =>
  API.get(`/chat/${projectId}`);
