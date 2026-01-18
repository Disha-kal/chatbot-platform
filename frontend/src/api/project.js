import API from "./axios";
import axios from "./axios";
// GET my projects
export const getProjects = () => API.get("/projects");

// CREATE project
export const createProject = (data) =>
  API.post("/projects", data);

// GET single project
export const getProjectById = (id) =>
  API.get(`/projects/${id}`);

export const uploadProjectFile = (formData) =>
  axios.post("/projects/upload-file", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });