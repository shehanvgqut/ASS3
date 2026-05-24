import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";

import ShareEventButton from "./ShareEventButton";
import { formatDisplayDateTime, formatShortDay } from "../utils/dateFormatters";

const formatCategory = (category) =>
  category ? category.charAt(0).toUpperCase() + category.slice(1) : "Event";

export default function DashboardEventSection({
  title,
  events,
  emptyMessage,
  onViewDetails,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{events.length}</Text>
      </View>

      {events.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Nothing scheduled</Text>
          <Text style={styles.empty}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item._id || item.id || String(index)}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.datePill}>
                  <Text style={styles.datePillText}>
                    {formatShortDay(item.date)}
                  </Text>
                </View>

                <View style={styles.eventBody}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  {item.location ? (
                    <Text style={styles.meta}>{item.location}</Text>
                  ) : null}
                  <Text style={styles.date}>
                    {formatDisplayDateTime(item.date)}
                  </Text>
                  <Text style={styles.category}>
                    {formatCategory(item.category)}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <Button mode="contained-tonal" onPress={() => onViewDetails(item)}>
                  View Details
                </Button>
                <ShareEventButton
                  compact
                  event={item}
                  mode="outlined"
                  shareContext="joined"
                />
              </Card.Actions>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  count: {
    backgroundColor: "#ede7f6",
    borderRadius: 999,
    color: "#5e35b1",
    fontWeight: "bold",
    minWidth: 32,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: "center",
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#e6e0ec",
    borderRadius: 8,
    borderWidth: 1,
    padding: 22,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  empty: {
    color: "#666",
    lineHeight: 22,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
  },
  datePill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f1edf8",
    borderRadius: 8,
    minWidth: 64,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  datePillText: {
    color: "#5e35b1",
    fontWeight: "bold",
    textAlign: "center",
  },
  eventBody: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  meta: {
    color: "#555",
    marginBottom: 4,
  },
  date: {
    color: "#222",
    fontWeight: "bold",
    marginBottom: 8,
  },
  category: {
    alignSelf: "flex-start",
    backgroundColor: "#f5f5f5",
    borderRadius: 999,
    color: "#555",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  actions: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});
