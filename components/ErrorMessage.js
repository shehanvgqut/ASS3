import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>

      {onRetry && (
        <Button mode="contained" onPress={onRetry} style={styles.button}>
          Try Again
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 10,
    backgroundColor: "#ffecec",
  },
  text: {
    color: "#b00020",
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
  },
});