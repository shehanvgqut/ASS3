// src/services/watchlistService.js

import apiClient from "./apiClient";

export const getWatchlist = async () => {
  const response = await apiClient.get("/watchlist");
  return response.data;
};

export const addToWatchlist = async (eventId) => {
  const response = await apiClient.post(`/watchlist/${eventId}`);
  return response.data;
};

export const removeFromWatchlist = async (eventId) => {
  const response = await apiClient.delete(`/watchlist/${eventId}`);
  return response.data;
};