import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { getEvents } from "../services/eventService";
import LoadingView from "../components/LoadingView";
import ErrorMessage from "../components/ErrorMessage";
import OfflineBanner from "../components/OfflineBanner";
import EventSearchBar from "../components/EventSearchBar";
import { NetworkContext } from "../context/NetworkContext";
import {
  formatDisplayDate,
  formatDisplayTime,
  parseDateSafely,
} from "../utils/dateFormatters";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import {
  getCachedAvailableEvents,
  saveCachedEventDetails,
  saveCachedAvailableEvents,
} from "../utils/offlineCache";

const PAGE_SIZE = 8;

const sortEventsByLatestDate = (eventList) =>
  [...eventList].sort((firstEvent, secondEvent) => {
    const firstDate = parseDateSafely(firstEvent?.date);
    const secondDate = parseDateSafely(secondEvent?.date);

    if (!firstDate && !secondDate) return 0;
    if (!firstDate) return 1;
    if (!secondDate) return -1;

    return secondDate - firstDate;
  });

export default function AvailableEventsScreen({ navigation }) {
  const { isOnline } = useContext(NetworkContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showingCachedData, setShowingCachedData] = useState(false);

  const eventsRef = useRef([]);
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const hasNextPageRef = useRef(false);
  const pageRef = useRef(1);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  const loadEvents = useCallback(async ({ pageToLoad = 1, append = false } = {}) => {
    const search = debouncedSearchQuery;

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
        search,
        page: pageToLoad,
        limit: PAGE_SIZE,
        sortBy: "date",
        sortOrder: "desc",
      });

      const eventList = sortEventsByLatestDate(
        Array.isArray(data) ? data : data.events || []
      );
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
      setShowingCachedData(false);
      if (!search) {
        await saveCachedAvailableEvents(mergedEvents);
      }
    } catch (err) {
      if (append) {
        setError(
          getApiErrorMessage(err, "Unable to load more events. Please try again.")
        );
        return;
      }

      const cached = await getCachedAvailableEvents();
      if (cached) {
        const cachedEvents = sortEventsByLatestDate(
          search
            ? cached.filter((event) => {
              const searchableText = [
                event.title,
                event.location,
                event.description,
                event.category,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              return searchableText.includes(search.toLowerCase());
            })
            : cached
        );

        eventsRef.current = cachedEvents;
        pageRef.current = 1;
        hasNextPageRef.current = false;

        setEvents(cachedEvents);
        setHasNextPage(hasNextPageRef.current);
        setShowingCachedData(true);
        setError(
          getApiErrorMessage(
            err,
            search
              ? "Unable to connect to the server. Searching saved events."
              : "Unable to connect to the server. Showing saved events."
          )
        );
      } else {
        setShowingCachedData(false);
        setError(
          getApiErrorMessage(
            err,
            "Unable to load events. Please check your connection."
          )
        );
      }
    } finally {
      loadingRef.current = false;
      loadingMoreRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearchQuery]);

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

      <EventSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      {loading && <LoadingView message="Loading events..." />}

      {error ? <ErrorMessage message={error} onRetry={loadEvents} /> : null}

      {!loading && events.length === 0 && (!error || showingCachedData) ? (
        <Text style={styles.emptyText}>
          {debouncedSearchQuery
            ? "No events match your search."
            : "No available events found."}
        </Text>
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
              <View style={styles.dateTimeRow}>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDisplayDate(item.date)}
                </Text>
              </View>
              <View style={styles.dateTimeRow}>
                <Text style={styles.dateTimeLabel}>Time</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDisplayTime(item.date)}
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={async () => {
                  await saveCachedEventDetails(item);
                  navigation.navigate("EventDetails", {
                    eventId: item._id || item.id,
                  });
                }}
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
  list: {
    paddingBottom: 24,
  },
  card: {
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  dateTimeLabel: {
    color: "#6e6578",
    fontWeight: "600",
    width: 48,
  },
  dateTimeValue: {
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
