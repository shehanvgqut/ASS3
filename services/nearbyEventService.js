import { getEvents } from "./eventService";
import {
  getCurrentDeviceLocationDetails,
  getEventLocationDetails,
} from "./locationService";
import { isSameRegionAddress } from "../utils/eventLocationRisk";

const normalizeEventList = (eventsResponse) =>
  Array.isArray(eventsResponse)
    ? eventsResponse
    : eventsResponse?.events || eventsResponse?.data || [];

export const getNearbyStateEvents = async ({ limit = 4 } = {}) => {
  const deviceLocationDetails = await getCurrentDeviceLocationDetails();

  if (!deviceLocationDetails.permissionGranted || !deviceLocationDetails.address) {
    return {
      permissionGranted: deviceLocationDetails.permissionGranted,
      error: deviceLocationDetails.error,
      events: [],
    };
  }

  const eventsResponse = await getEvents({
    status: "upcoming",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    limit: 20,
  });
  const events = normalizeEventList(eventsResponse);
  const nearbyEvents = [];

  for (const event of events) {
    if (nearbyEvents.length >= limit) {
      break;
    }

    try {
      const eventAddress = await getEventLocationDetails(event);

      if (isSameRegionAddress(eventAddress, deviceLocationDetails.address)) {
        nearbyEvents.push(event);
      }
    } catch (error) {
      console.log("Nearby event location check failed:", error.message);
    }
  }

  return {
    permissionGranted: true,
    error: null,
    events: nearbyEvents,
  };
};
