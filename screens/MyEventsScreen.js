import React, { useCallback, useContext, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import ErrorMessage from "../components/ErrorMessage";
import LoadingView from "../components/LoadingView";
import OfflineBanner from "../components/OfflineBanner";
import { NetworkContext } from "../context/NetworkContext";
import {
  cancelRegistration,
  getMyRegistrations,
} from "../services/registrationService";
import { formatDisplayDate, formatDisplayTime } from "../utils/dateFormatters";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import {
  getCachedMyRegistrations,
  saveCachedEventDetails,
  saveCachedMyRegistrations,
} from "../utils/offlineCache";

const getEvent = (item) => item.event || item;
const getEventId = (item) => getEvent(item)._id || getEvent(item).id || item._id || item.id;

export default function MyEventsScreen({ navigation }) {
  const { isOnline } = useContext(NetworkContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showingCachedData, setShowingCachedData] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyRegistrations();
      const registrationEvents = Array.isArray(data)
        ? data
        : data.registrations || data.events || [];
      setEvents(registrationEvents);
      setShowingCachedData(false);
      await saveCachedMyRegistrations(registrationEvents);
    } catch (err) {
      const cachedRegistrations = await getCachedMyRegistrations();

      if (cachedRegistrations) {
        setEvents(cachedRegistrations);
        setShowingCachedData(true);
        setError(
          getApiErrorMessage(
            err,
            "Unable to connect to the server. Showing saved registered events."
          )
        );
      } else {
        setShowingCachedData(false);
        setError(getApiErrorMessage(err, "Unable to load your events."));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await cancelRegistration(eventId);
      await loadEvents();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to cancel this registration."));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  if (loading) {
    return <LoadingView message="Loading your events..." />;
  }

  return (
    <View style={styles.container}>
      <OfflineBanner isOnline={isOnline} />

      {error ? <ErrorMessage message={error} onRetry={loadEvents} /> : null}

      {events.length === 0 && (!error || showingCachedData) ? (
        <Text style={styles.empty}>You have not registered for any events.</Text>
      ) : null}

      <FlatList
        data={events}
        keyExtractor={(item, index) => getEventId(item) || String(index)}
        renderItem={({ item }) => {
          const event = getEvent(item);
          const eventId = getEventId(item);

          return (
            <Card style={styles.card}>
              <Card.Title title={event.title} subtitle={event.location} />
              <Card.Content>
                <Text style={styles.dateTimeText}>
                  Date: {formatDisplayDate(event.date)}
                </Text>
                <Text style={styles.dateTimeText}>
                  Time: {formatDisplayTime(event.date)}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  onPress={async () => {
                    await saveCachedEventDetails(event);
                    navigation.navigate("MyEventDetails", { eventId });
                  }}
                >
                  Details
                </Button>
                <Button
                  disabled={!isOnline}
                  onPress={() => handleCancel(eventId)}
                >
                  Cancel
                </Button>
              </Card.Actions>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    marginBottom: 12,
  },
  dateTimeText: {
    fontWeight: "600",
    marginTop: 4,
  },
  empty: {
    marginTop: 30,
    textAlign: "center",
  },
});
