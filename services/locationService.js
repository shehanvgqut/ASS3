import * as Location from "expo-location";
import { Platform } from "react-native";

const LOCATION_TIMEOUT_MS = 5000;
const GEOCODE_TIMEOUT_MS = 5000;

const withTimeout = (promise, timeoutMs) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("location-timeout")), timeoutMs);
    }),
  ]);

const reverseGeocodeSafely = async (coords) => {
  try {
    const [address] = await withTimeout(
      Location.reverseGeocodeAsync(coords),
      GEOCODE_TIMEOUT_MS
    );
    return address || null;
  } catch (error) {
    return null;
  }
};

const geocodeSafely = async (locationText) => {
  try {
    const [location] = await withTimeout(
      Location.geocodeAsync(locationText),
      GEOCODE_TIMEOUT_MS
    );
    return location || null;
  } catch (error) {
    return null;
  }
};

export const getCurrentDeviceLocationDetails = async () => {
  if (Platform.OS === "web") {
    return {
      permissionGranted: false,
      location: null,
      address: null,
      error: "unsupported-platform",
    };
  }

  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== Location.PermissionStatus.GRANTED) {
    return {
      permissionGranted: false,
      location: null,
      address: null,
      error: "permission-denied",
    };
  }

  let location = null;

  try {
    location = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      LOCATION_TIMEOUT_MS
    );
  } catch (error) {
    try {
      location = await withTimeout(
        Location.getLastKnownPositionAsync(),
        LOCATION_TIMEOUT_MS
      );
    } catch (lastKnownError) {
      location = null;
    }
  }

  if (!location?.coords) {
    return {
      permissionGranted: true,
      location: null,
      address: null,
      error: "location-unavailable",
    };
  }

  const address = await reverseGeocodeSafely(location.coords);

  return {
    permissionGranted: true,
    location,
    address: address || null,
    error: address ? null : "address-unavailable",
  };
};

const getEventLocationText = (event) =>
  [event?.location, event?.address, event?.venue, event?.city]
    .filter(Boolean)
    .join(", ");

const getSimplifiedLocationText = (locationText) => {
  const parts = locationText
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.slice(-2).join(", ") || locationText;
};

export const getEventLocationDetails = async (event) => {
  if (Platform.OS === "web") {
    return null;
  }

  const latitude = event?.latitude || event?.lat || event?.coordinates?.latitude;
  const longitude =
    event?.longitude || event?.lng || event?.coordinates?.longitude;

  if (latitude != null && longitude != null) {
    const address = await reverseGeocodeSafely({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });

    return address || null;
  }

  const locationText = getEventLocationText(event);

  if (!locationText) {
    return null;
  }

  const geocodedLocation = await geocodeSafely(locationText);
  const fallbackLocationText = getSimplifiedLocationText(locationText);
  const fallbackGeocodedLocation = geocodedLocation
    ? null
    : await geocodeSafely(fallbackLocationText);
  const matchedLocation = geocodedLocation || fallbackGeocodedLocation;

  if (!matchedLocation) {
    return null;
  }

  const address = await reverseGeocodeSafely(matchedLocation);

  return address || null;
};
