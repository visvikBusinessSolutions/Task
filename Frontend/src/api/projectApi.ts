import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1/project",
});

// Add token from localStorage (if using JWT)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
