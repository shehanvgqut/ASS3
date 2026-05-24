// src/services/registrationService.js

import apiClient from "./apiClient";

export const registerForEvent = async (eventId) => {
  const response = await apiClient.post("/event-registrations", {
    event: eventId,
  });
  return response.data;
};

export const getCurrentUserRegistrations = async () => {
  const response = await apiClient.get("/event-registrations/currentUser");
  return response.data;
};

export const getCurrentUserRegistrationForEvent = async (eventId) => {
  const response = await apiClient.get(
    `/event-registrations/currentUser/event/${eventId}`
  );
  return response.data;
};

export const getMyRegistrations = getCurrentUserRegistrations;
export const getMyRegistrationForEvent = getCurrentUserRegistrationForEvent;

const extractPopulatedEventFromRegistration = (registration) => {
  if (!registration?.event || typeof registration.event !== "object") {
    return null;
  }

  return registration.event;
};

const normalizeRegistrationList = (registrationResponse) =>
  Array.isArray(registrationResponse)
    ? registrationResponse
    : registrationResponse?.registrations || registrationResponse?.events || [];

const isActiveRegistrationStatus = (status) =>
  !status || String(status).toLowerCase() === "registered";

const isUpcomingEvent = (event) =>
  !event?.status || String(event.status).toLowerCase() === "upcoming";

const parseEventDate = (event) => {
  const eventDate = new Date(event?.date);
  return Number.isNaN(eventDate.getTime()) ? null : eventDate;
};

const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { now, startOfWeek, endOfWeek };
};

export const getCurrentUserJoinedEvents = async () => {
  const registrationResponse = await getCurrentUserRegistrations();
  const registrations = normalizeRegistrationList(registrationResponse);

  return registrations
    .filter(
      (registration) =>
        registration && isActiveRegistrationStatus(registration.status)
    )
    .map(extractPopulatedEventFromRegistration)
    .filter((event) => event?.title && event?.date && (event._id || event.id))
    .sort((firstEvent, secondEvent) => {
      const firstDate = parseEventDate(firstEvent);
      const secondDate = parseEventDate(secondEvent);

      if (!firstDate && !secondDate) return 0;
      if (!firstDate) return 1;
      if (!secondDate) return -1;

      return firstDate - secondDate;
    });
};

export const getMyJoinedEvents = getCurrentUserJoinedEvents;

export const getCurrentUserUpcomingEventsThisWeek = async () => {
  try {
    const joinedEvents = await getCurrentUserJoinedEvents();
    const { now, endOfWeek } = getCurrentWeekRange();

    return joinedEvents
      .filter((event) => {
        if (!event?.date || !isUpcomingEvent(event)) {
          return false;
        }

        const eventDate = parseEventDate(event);
        if (!eventDate) {
          return false;
        }

        return eventDate >= now && eventDate <= endOfWeek;
      })
      .sort(
        (firstEvent, secondEvent) =>
          new Date(firstEvent.date) - new Date(secondEvent.date)
      );
  } catch (error) {
    console.log(
      "Dashboard registrations error:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const getMyUpcomingEventsThisWeek = getCurrentUserUpcomingEventsThisWeek;

export const cancelCurrentUserRegistration = async (eventId) => {
  const response = await apiClient.delete(
    `/event-registrations/event/${eventId}/currentUser`
  );
  return response.data;
};

export const cancelRegistration = cancelCurrentUserRegistration;
