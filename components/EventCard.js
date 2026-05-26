import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";

import { formatDisplayDate, formatDisplayTime } from "../utils/dateFormatters";

export default function EventCard({ event, onPress, actionLabel = "Details" }) {
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title title={event.title} subtitle={event.location} />
      <Card.Content>
        {event.description ? <Text>{event.description}</Text> : null}
        {event.date ? (
          <View style={styles.dateTimeBlock}>
            <Text style={styles.dateTimeText}>
              Date: {formatDisplayDate(event.date)}
            </Text>
            <Text style={styles.dateTimeText}>
              Time: {formatDisplayTime(event.date)}
            </Text>
          </View>
        ) : null}
      </Card.Content>
      {onPress ? (
        <Card.Actions>
          <Button onPress={onPress}>{actionLabel}</Button>
        </Card.Actions>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  dateTimeBlock: {
    marginTop: 8,
  },
  dateTimeText: {
    fontWeight: "600",
  },
});
