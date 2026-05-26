import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";

import { register } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigation.navigate("Login");
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Registration failed. Please try again."
      );
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.brandMark}>
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={42}
              color="#ffffff"
            />
          </View>
          <Text style={styles.appName}>EVENT MANAGER</Text>
          <Text style={styles.subtitle}>Create your account to join events.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Get started</Text>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={20}
                color="#b00020"
              />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            autoComplete="name"
            mode="outlined"
            left={<TextInput.Icon icon="account-outline" />}
            style={styles.input}
            outlineColor="#ded7e8"
            activeOutlineColor="#6f43b7"
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            mode="outlined"
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
            outlineColor="#ded7e8"
            activeOutlineColor="#6f43b7"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password-new"
            mode="outlined"
            left={<TextInput.Icon icon="lock-outline" />}
            style={styles.input}
            outlineColor="#ded7e8"
            activeOutlineColor="#6f43b7"
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
            contentStyle={styles.registerButtonContent}
            labelStyle={styles.registerButtonLabel}
            buttonColor="#6f43b7"
          >
            Register
          </Button>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Button
              compact
              mode="text"
              onPress={() => navigation.navigate("Login")}
              textColor="#6f43b7"
              labelStyle={styles.loginButtonLabel}
            >
              Sign in
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f6fb",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  brandMark: {
    width: 88,
    height: 88,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6f43b7",
    marginBottom: 18,
  },
  appName: {
    color: "#21172f",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#766d82",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#21172f",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  title: {
    color: "#21172f",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#ffffff",
    marginBottom: 14,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdecef",
    borderColor: "#f4c7ce",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: "#8f001a",
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
  },
  registerButton: {
    borderRadius: 8,
    marginTop: 4,
  },
  registerButtonContent: {
    height: 52,
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  loginRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  loginText: {
    color: "#766d82",
    fontSize: 14,
  },
  loginButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});
