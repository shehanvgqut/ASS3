import React, { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import DashboardEventSection from "../components/DashboardEventSection";
import ErrorMessage from "../components/ErrorMessage";
import LoadingView from "../components/LoadingView";
import OfflineBanner from "../components/OfflineBanner";
import { NetworkContext } from "../context/NetworkContext";
import { getCurrentUserJoinedEvents } from "../services/registrationService";

const filterEventsOccurringThisWeek = (events) => {
  const now = new Date();
  const day = now.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - daysFromMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return events.filter((event) => {
    const eventDate = new Date(event.date);

    return (
      !Number.isNaN(eventDate.getTime()) &&
      eventDate >= now &&
      eventDate <= endOfWeek
    );
  });
};

export default function DashboardScreen({ navigation }) {
  const { isOnline } = useContext(NetworkContext);

  const [events, setEvents] = useState([]);
  const [thisWeekEvents, setThisWeekEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const joinedEvents = await getCurrentUserJoinedEvents();

      setEvents(joinedEvents);
      setThisWeekEvents(filterEventsOccurringThisWeek(joinedEvents));
    } catch (err) {
      console.log("Dashboard load error:", err.response?.data || err.message);
      setError("Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (event) => {
    navigation.navigate("Events", {
      screen: "EventDetails",
      params: {
        eventId: event._id || event.id,
      },
    });
  };

  const eventCountLabel = events.length === 1 ? "event" : "events";

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <OfflineBanner isOnline={isOnline} />

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>This week</Text>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Keep track of your joined events.
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{events.length}</Text>
            <Text style={styles.summaryLabel}>{eventCountLabel} joined</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {thisWeekEvents.length}
            </Text>
            <Text style={styles.summaryLabel}>this week</Text>
          </View>
        </View>
      </View>

      {loading ? <LoadingView message="Loading dashboard..." /> : null}

      {error ? <ErrorMessage message={error} onRetry={loadDashboard} /> : null}

      {!loading && !error ? (
        <DashboardEventSection
          title="My Joined Events"
          events={events}
          emptyMessage="You have not joined any events yet."
          onViewDetails={handleViewDetails}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f4f8",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: "#ffffff",
    borderColor: "#e6e0ec",
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },
  eyebrow: {
    color: "#6f43b7",
    fontWeight: "bold",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#666",
    lineHeight: 22,
  },
  summaryRow: {
    backgroundColor: "#f8f6fb",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 16,
    padding: 14,
  },
  summaryItem: {
    flex: 1,
  },
  summaryNumber: {
    color: "#2b2430",
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryLabel: {
    color: "#666",
    marginTop: 2,
  },
  summaryDivider: {
    backgroundColor: "#ded6e8",
    marginHorizontal: 14,
    width: 1,
  },
});
