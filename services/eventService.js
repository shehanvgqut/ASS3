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

export const getEvents = async ({
  search = "",
  category = "",
  location = "",
  status = "",
  dateFrom = "",
  dateTo = "",
  sortBy = "date",
  sortOrder = "desc",
  page = 1,
  limit = 8,
} = {}) => {
  const params = {
    sortBy,
    sortOrder,
    page,
    limit,
  };

  if (search.trim()) params.search = search.trim();
  if (category.trim()) params.category = category.trim();
  if (location.trim()) params.location = location.trim();
  if (status.trim()) params.status = status.trim();
  if (dateFrom.trim()) params.dateFrom = dateFrom.trim();
  if (dateTo.trim()) params.dateTo = dateTo.trim();

  const response = await apiClient.get("/events", { params });

  return response.data;
};
