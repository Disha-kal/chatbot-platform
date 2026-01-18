import API from "./axios";

export const uploadFileToProject = (formData) =>
  API.post("/files", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
