import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Dashboard</Text>
      <Text style={styles.subtitle}>Browse events and manage your bookings.</Text>

      <Button mode="contained" onPress={() => navigation.navigate("Events")}>
        View Events
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 20,
    textAlign: "center",
  },
});
