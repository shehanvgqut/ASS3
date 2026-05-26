// src/services/apiClient.js

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BACKEND_API_ERROR_MESSAGE } from "../utils/apiErrorMessage";

const API_BASE_URL = "https://jacaranda04.ifn666.com/assignment2/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const ENABLE_API_LOGS = false;

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (ENABLE_API_LOGS) {
      console.log("API response:", {
        method: response.config.method?.toUpperCase(),
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    const backendUnavailable =
      !error.response ||
      error.response?.status >= 500 ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error";

    if (backendUnavailable) {
      error.userMessage = BACKEND_API_ERROR_MESSAGE;
    }

    if (ENABLE_API_LOGS) {
      console.log("API error:", {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
