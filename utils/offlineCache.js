import { getData, saveData } from "./storage";

const CACHE_KEYS = {
  availableEvents: "cachedEvents",
  eventDetails: "cachedEventDetails",
  joinedEvents: "cachedJoinedEvents",
  myRegistrations: "cachedMyRegistrations",
  profile: "cachedProfile",
  watchlist: "cachedWatchlist",
};

const getCachedList = async (key) => {
  const cachedValue = await getData(key);
  return Array.isArray(cachedValue) ? cachedValue : null;
};

const saveCachedList = async (key, value) => {
  if (Array.isArray(value)) {
    await saveData(key, value);
  }
};

export const getCachedAvailableEvents = () =>
  getCachedList(CACHE_KEYS.availableEvents);

export const saveCachedAvailableEvents = (events) =>
  saveCachedList(CACHE_KEYS.availableEvents, events);

export const getCachedEventDetails = async (eventId) => {
  const cachedEventsById = await getData(CACHE_KEYS.eventDetails);
  return cachedEventsById?.[eventId] || null;
};

export const saveCachedEventDetails = async (event) => {
  const eventId = event?._id || event?.id;

  if (!eventId) {
    return;
  }

  const cachedEventsById = (await getData(CACHE_KEYS.eventDetails)) || {};
  await saveData(CACHE_KEYS.eventDetails, {
    ...cachedEventsById,
    [eventId]: event,
  });
};

export const getCachedJoinedEvents = () =>
  getCachedList(CACHE_KEYS.joinedEvents);

export const saveCachedJoinedEvents = (events) =>
  saveCachedList(CACHE_KEYS.joinedEvents, events);

export const getCachedMyRegistrations = () =>
  getCachedList(CACHE_KEYS.myRegistrations);

export const saveCachedMyRegistrations = (registrations) =>
  saveCachedList(CACHE_KEYS.myRegistrations, registrations);

export const getCachedProfile = () => getData(CACHE_KEYS.profile);

export const saveCachedProfile = (profile) => {
  if (profile) {
    return saveData(CACHE_KEYS.profile, profile);
  }

  return Promise.resolve();
};

export const getCachedWatchlist = () => getCachedList(CACHE_KEYS.watchlist);

export const saveCachedWatchlist = (events) =>
  saveCachedList(CACHE_KEYS.watchlist, events);
