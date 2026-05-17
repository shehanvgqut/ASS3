    // src/services/authService.js

import apiClient from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  const token = response.data.token;
  await AsyncStorage.setItem("token", token);

  return response.data;
};

export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const getStoredToken = async () => {
  return await AsyncStorage.getItem("token");
};