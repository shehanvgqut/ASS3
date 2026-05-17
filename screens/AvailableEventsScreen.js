import React, { useCallback, useContext, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { getAllEvents } from "../services/eventService";
import LoadingView from "../components/LoadingView";
import ErrorMessage from "../components/ErrorMessage";
import OfflineBanner from "../components/OfflineBanner";
import { getData, saveData } from "../utils/storage";
import { NetworkContext } from "../context/NetworkContext";

export default function AvailableEventsScreen({ navigation }) {
  const { isOnline } = useContext(NetworkContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllEvents();

      const eventList = Array.isArray(data) ? data : data.events || [];

      setEvents(eventList);
      await saveData("cachedEvents", eventList);
    } catch (err) {
      const cached = await getData("cachedEvents");

      if (cached) {
        setEvents(cached);
        setError("Unable to connect to the server. Showing saved events.");
      } else {
        setError("Unable to load events. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  return (
    <View style={styles.container}>
      <OfflineBanner isOnline={isOnline} />

      <Text style={styles.title}>Available Events</Text>

      {loading && <LoadingView message="Loading events..." />}

      {error ? <ErrorMessage message={error} onRetry={loadEvents} /> : null}

      {!loading && events.length === 0 && !error ? (
        <Text style={styles.emptyText}>No available events found.</Text>
      ) : null}

      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.title} subtitle={item.location} />
            <Card.Content>
              <Text>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() =>
                  navigation.navigate("EventDetails", {
                    eventId: item._id || item.id,
                  })
                }
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
  },
  date: {
    marginTop: 8,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
  },
});
