import React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar } from "react-native-paper";

export default function EventSearchBar({ value, onChangeText, onClear }) {
  return (
    <View style={styles.container}>
      <Searchbar
        value={value}
        onChangeText={onChangeText}
        onClearIconPress={onClear}
        placeholder="Search events"
        autoCapitalize="none"
        inputStyle={styles.input}
        style={styles.searchbar}
        iconColor="#6f43b7"
        placeholderTextColor="#7b7285"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  searchbar: {
    backgroundColor: "#ffffff",
    borderColor: "#e6e0ec",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#21172f",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  input: {
    fontSize: 15,
  },
});
