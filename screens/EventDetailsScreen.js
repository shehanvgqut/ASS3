import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";

import { getEventById } from "../services/eventService";
import {
  cancelCurrentUserRegistration,
  getCurrentUserRegistrationForEvent,
  registerForEvent,
} from "../services/registrationService";
import LoadingView from "../components/LoadingView";
import ErrorMessage from "../components/ErrorMessage";
import OfflineBanner from "../components/OfflineBanner";
import ShareEventButton from "../components/ShareEventButton";
import { NetworkContext } from "../context/NetworkContext";
import {
  showRegistrationCancelledNotification,
  showRegistrationNotification,
} from "../services/notificationService";

export default function EventDetailsScreen({ route }) {
  const { eventId } = route.params;
  const { isOnline } = useContext(NetworkContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const selectedEventId = event?._id || event?.id || eventId;
  const eventStatus = event?.status?.toLowerCase();
  const isRegistrationClosed = ["cancelled", "completed"].includes(eventStatus);

  const loadRegistrationStatus = async () => {
    try {
      await getCurrentUserRegistrationForEvent(eventId);
      setIsRegistered(true);
    } catch (err) {
      setIsRegistered(false);
    }
  };

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const eventData = await getEventById(eventId);
      setEvent(eventData);
      await loadRegistrationStatus();
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to load event details.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isOnline) {
      setError("You are offline. Please reconnect before registering.");
      return;
    }

    if (isRegistrationClosed) {
      setError("Registrations are closed for this event.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await registerForEvent(selectedEventId);
      setIsRegistered(true);
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

  const handleLeave = async () => {
    if (!isOnline) {
      setError("You are offline. Please reconnect before leaving this event.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await cancelCurrentUserRegistration(selectedEventId);
      setIsRegistered(false);
      setSuccess("You have left this event.");

      if (event?.title) {
        await showRegistrationCancelledNotification(event.title);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to leave this event. Please try again.";
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

      {error ? (
        <ErrorMessage message={error} onRetry={!event ? loadEvent : undefined} />
      ) : null}

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

            {event.status ? (
              <>
                <Text style={styles.label}>Status</Text>
                <Text style={isRegistrationClosed ? styles.closedStatus : null}>
                  {event.status}
                </Text>
              </>
            ) : null}
          </Card.Content>

          <Card.Actions>
            <Button
              mode={isRegistered ? "outlined" : "contained"}
              onPress={isRegistered ? handleLeave : handleRegister}
              loading={actionLoading}
              disabled={
                actionLoading ||
                !isOnline ||
                (!isRegistered && isRegistrationClosed)
              }
            >
              {isRegistered
                ? "Leave Event"
                : isRegistrationClosed
                ? "Closed"
                : "Register"}
            </Button>

            <ShareEventButton
              event={event}
              shareContext={isRegistered ? "joined" : "event"}
            />
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
  closedStatus: {
    color: "#b00020",
    fontWeight: "bold",
  },
});
