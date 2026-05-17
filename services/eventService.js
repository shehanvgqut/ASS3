// src/services/eventService.js

import apiClient from "./apiClient";

export const getAllEvents = async () => {
  const response = await apiClient.get("/events");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

export const getEvents = async ({ search = "", page = 1, limit = 10 }) => {
  const response = await apiClient.get("/events", {
    params: { search, page, limit },
  });

  return response.data;
};