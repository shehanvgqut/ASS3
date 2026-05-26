// src/services/watchlistService.js

import apiClient from "./apiClient";

export const normalizeWatchlistItems = (watchlistResponse) =>
  Array.isArray(watchlistResponse)
    ? watchlistResponse
    : watchlistResponse?.items ||
      watchlistResponse?.watchlist ||
      watchlistResponse?.events ||
      [];

export const getWatchlist = async () => {
  const response = await apiClient.get("/event-watchlist/currentUser");
  return response.data;
};

export const addToWatchlist = async (eventId) => {
  const response = await apiClient.post("/event-watchlist", {
    event: eventId,
  });
  return response.data;
};

export const getCurrentUserWatchlistForEvent = async (eventId) => {
  const response = await apiClient.get(
    `/event-watchlist/currentUser/event/${eventId}`
  );
  return response.data;
};

export const removeFromWatchlist = async (eventId) => {
  const response = await apiClient.delete(
    `/event-watchlist/event/${eventId}/currentUser`
  );
  return response.data;
};
