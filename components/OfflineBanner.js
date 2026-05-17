import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function OfflineBanner({ isOnline }) {
  if (isOnline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        You are offline. Some actions are unavailable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#fff3cd",
    padding: 10,
  },
  text: {
    color: "#856404",
    textAlign: "center",
    fontSize: 13,
  },
});