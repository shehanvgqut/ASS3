import React, { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

import { AuthContext } from "../context/AuthContext";
import { logout } from "../services/authService";
import { getMyProfile } from "../services/userService";
import ErrorMessage from "../components/ErrorMessage";
import LoadingView from "../components/LoadingView";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

export default function ProfileScreen() {
  const { signOut } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();
      setProfile(data.user || data);
    } catch (err) {
      const message = getApiErrorMessage(err, "Unable to load your profile.");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    await signOut();
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Your account details and session.</Text>

      {loading ? <LoadingView message="Loading profile..." /> : null}

      {error ? <ErrorMessage message={error} onRetry={loadProfile} /> : null}

      {!loading && profile ? (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.name?.charAt(0)?.toUpperCase() || "U"}
              </Text>
            </View>

            <Text style={styles.name}>{profile.name || "Unknown user"}</Text>
            <Text style={styles.email}>{profile.email}</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Role</Text>
              <Text style={styles.detailValue}>{profile.role || "user"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Member since</Text>
              <Text style={styles.detailValue}>
                {formatDate(profile.createdAt)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Last updated</Text>
              <Text style={styles.detailValue}>
                {formatDate(profile.updatedAt)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ) : null}

      <Button mode="contained" onPress={handleLogout} style={styles.logout}>
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f4f8",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  subtitle: {
    color: "#666",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    marginBottom: 20,
  },
  avatar: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#ede7f6",
    borderRadius: 999,
    height: 72,
    justifyContent: "center",
    marginBottom: 12,
    width: 72,
  },
  avatarText: {
    color: "#5e35b1",
    fontSize: 30,
    fontWeight: "bold",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  email: {
    color: "#666",
    marginBottom: 18,
    textAlign: "center",
  },
  detailRow: {
    borderTopColor: "#eee",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  detailLabel: {
    color: "#666",
  },
  detailValue: {
    color: "#222",
    fontWeight: "600",
  },
  logout: {
    marginTop: 8,
  },
});
