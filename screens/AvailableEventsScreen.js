import React, { useCallback, useContext, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { getEvents } from "../services/eventService";
import LoadingView from "../components/LoadingView";
import ErrorMessage from "../components/ErrorMessage";
import OfflineBanner from "../components/OfflineBanner";
import { getData, saveData } from "../utils/storage";
import { NetworkContext } from "../context/NetworkContext";

const PAGE_SIZE = 8;

export default function AvailableEventsScreen({ navigation }) {
  const { isOnline } = useContext(NetworkContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  const eventsRef = useRef([]);
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const hasNextPageRef = useRef(false);
  const pageRef = useRef(1);

  const loadEvents = useCallback(async ({ pageToLoad = 1, append = false } = {}) => {
    if (
      append &&
      (loadingMoreRef.current || loadingRef.current || !hasNextPageRef.current)
    ) {
      return;
    }

    try {
      if (append) {
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        loadingRef.current = true;
        setLoading(true);
      }

      setError("");

      const data = await getEvents({
        page: pageToLoad,
        limit: PAGE_SIZE,
      });

      const eventList = Array.isArray(data) ? data : data.events || [];
      const pagination = data?.pagination;

      const currentEvents = append ? eventsRef.current : [];
      const mergedEvents = append
        ? [
            ...currentEvents,
            ...eventList.filter(
              (event) =>
                !currentEvents.some(
                  (existingEvent) =>
                    (existingEvent._id || existingEvent.id) ===
                    (event._id || event.id)
                )
            ),
          ]
        : eventList;

      eventsRef.current = mergedEvents;
      pageRef.current = pagination?.page || pageToLoad;
      hasNextPageRef.current = Boolean(pagination?.hasNextPage);

      setEvents(mergedEvents);
      setHasNextPage(hasNextPageRef.current);
      await saveData("cachedEvents", mergedEvents);
    } catch (err) {
      if (append) {
        setError("Unable to load more events. Please try again.");
        return;
      }

      const cached = await getData("cachedEvents");
      if (cached) {
        eventsRef.current = cached;
        pageRef.current = 1;
        hasNextPageRef.current = false;

        setEvents(cached);
        setHasNextPage(hasNextPageRef.current);
        setError("Unable to connect to the server. Showing saved events.");
      } else {
        setError("Unable to load events. Please check your connection.");
      }
    } finally {
      loadingRef.current = false;
      loadingMoreRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMoreEvents = () => {
    loadEvents({
      pageToLoad: pageRef.current + 1,
      append: true,
    });
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents({ pageToLoad: 1 });
    }, [loadEvents])
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
        keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.list}
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loadingMore ? (
            <LoadingView message="Loading more events..." />
          ) : !loading && events.length > 0 && !hasNextPage ? (
            <Text style={styles.footerText}>No more events</Text>
          ) : null
        }
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
  footerText: {
    color: "#666",
    paddingVertical: 16,
    textAlign: "center",
  },
});
