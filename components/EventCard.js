import React from "react";
import { Text } from "react-native";
import { Button, Card } from "react-native-paper";

export default function EventCard({ event, onPress, actionLabel = "Details" }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title title={event.title} subtitle={event.location} />
      <Card.Content>
        {event.description ? <Text>{event.description}</Text> : null}
        {event.date ? <Text style={{ marginTop: 8 }}>{event.date}</Text> : null}
      </Card.Content>
      {onPress ? (
        <Card.Actions>
          <Button onPress={onPress}>{actionLabel}</Button>
        </Card.Actions>
      ) : null}
    </Card>
  );
}
