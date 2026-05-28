import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import DashboardEventSection from "./DashboardEventSection";
import LoadingView from "./LoadingView";
import { getNearbyStateEvents } from "../services/nearbyEventService";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

const getNearbyStateMessage = (nearbyStateResult) => {
  if (!nearbyStateResult.permissionGranted) {
    return "Allow native device location to find events in your state.";
  }

  if (nearbyStateResult.error === "location-unavailable") {
    return "Turn on device location to find events in your state.";
  }

  if (nearbyStateResult.error === "address-unavailable") {
    return "Your device location could not be matched to a state.";
  }

  return "";
};

export default function NearbyStateEvents({ isOnline, onViewDetails }) {
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadNearbyEvents = async () => {
    if (!isOnline) {
      setNearbyEvents([]);
      setMessage("Reconnect to find events near your current state.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const nearbyStateResult = await getNearbyStateEvents();

      setNearbyEvents(nearbyStateResult.events);
      setMessage(getNearbyStateMessage(nearbyStateResult));
    } catch (error) {
      setNearbyEvents([]);
      setMessage(getApiErrorMessage(error, "Unable to find nearby events."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyEvents();
  }, [isOnline]);

  return (
    <View style={styles.container}>
      {loading ? <LoadingView message="Finding nearby events..." /> : null}

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {!loading ? (
        <DashboardEventSection
          title="Nearby Events"
          events={nearbyEvents}
          emptyMessage="No events found in your current state."
          onViewDetails={onViewDetails}
          shareContext="event"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  message: {
    color: "#666",
    lineHeight: 20,
    marginTop: 12,
  },
});
