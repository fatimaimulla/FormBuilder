import axios from "axios";
import { getStoredAccessToken } from "../auth/storage";

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");
export const BACKEND_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
