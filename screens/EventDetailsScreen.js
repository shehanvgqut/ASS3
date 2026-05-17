import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";

import { getEventById } from "../services/eventService";
import { registerForEvent } from "../services/registrationService";
import LoadingView from "../components/LoadingView";
import ErrorMessage from "../components/ErrorMessage";
import OfflineBanner from "../components/OfflineBanner";
import { NetworkContext } from "../context/NetworkContext";
import { shareEvent } from "../utils/shareEvent";
import { showRegistrationNotification } from "../utils/notifications";

export default function EventDetailsScreen({ route }) {
  const { eventId } = route.params;
  const { isOnline } = useContext(NetworkContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEventById(eventId);
      setEvent(data);
    } catch (err) {
      setError("Unable to load event details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isOnline) {
      setError("You are offline. Please reconnect before registering.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await registerForEvent(eventId);
      setSuccess("You have successfully registered for this event.");

      if (event?.title) {
        await showRegistrationNotification(event.title);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  if (loading) {
    return <LoadingView message="Loading event details..." />;
  }

  return (
    <ScrollView style={styles.container}>
      <OfflineBanner isOnline={isOnline} />

      {error ? <ErrorMessage message={error} onRetry={loadEvent} /> : null}

      {success ? <Text style={styles.success}>{success}</Text> : null}

      {event && (
        <Card style={styles.card}>
          <Card.Title title={event.title} subtitle={event.location} />
          <Card.Content>
            <Text style={styles.label}>Description</Text>
            <Text>{event.description}</Text>

            <Text style={styles.label}>Date</Text>
            <Text>{event.date}</Text>

            <Text style={styles.label}>Category</Text>
            <Text>{event.category || "General"}</Text>
          </Card.Content>

          <Card.Actions>
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={actionLoading}
              disabled={actionLoading || !isOnline}
            >
              Register
            </Button>

            <Button mode="outlined" onPress={() => shareEvent(event)}>
              Share
            </Button>
          </Card.Actions>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    marginTop: 12,
  },
  label: {
    marginTop: 14,
    fontWeight: "bold",
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: 12,
    borderRadius: 8,
    margin: 12,
    textAlign: "center",
  },
});