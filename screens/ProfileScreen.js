import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

import { AuthContext } from "../context/AuthContext";
import { logout } from "../services/authService";

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    await signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button mode="contained" onPress={handleLogout}>
        Logout
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
    marginBottom: 20,
    textAlign: "center",
  },
});
