// src/services/registrationService.js

import apiClient from "./apiClient";

export const registerForEvent = async (eventId) => {
  const response = await apiClient.post(`/event-registrations/${eventId}`);
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await apiClient.get("/event-registrations/me");
  return response.data;
};

export const cancelRegistration = async (eventId) => {
  const response = await apiClient.delete(`/event-registrations/${eventId}`);
  return response.data;
};