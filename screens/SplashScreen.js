import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.brandMark}>
        <MaterialCommunityIcons
          name="calendar-check"
          size={58}
          color="#ffffff"
        />
      </View>

      <Text style={styles.title}>EVENT MANAGER</Text>
      <Text style={styles.studentNumber}>N11884347</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f6fb",
    padding: 24,
  },
  brandMark: {
    width: 112,
    height: 112,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6f43b7",
    marginBottom: 28,
  },
  title: {
    color: "#21172f",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  studentNumber: {
    color: "#6f43b7",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
});
