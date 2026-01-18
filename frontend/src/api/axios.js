import axios from "axios";

const API = axios.create({
  baseURL: "https://chatbot-platform-4-nprq.onrender.com/api",
  withCredentials: true
});


// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});
// REGISTER
export const registerUser = (data) =>
  API.post("/auth/register", data);

// LOGIN
export const loginUser = (data) =>
  API.post("/auth/login", data);

export default API;
