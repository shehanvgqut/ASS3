import React, { useContext, useState } from "react";
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

import { AuthContext } from "../context/AuthContext";
import { login } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiErrorMessage";

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await login(email.trim(), password);
      await signIn(data.token);
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Login failed. Please try again."
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
              name="calendar-check"
              size={42}
              color="#ffffff"
            />
          </View>
          <Text style={styles.appName}>EVENT MANAGER</Text>
          <Text style={styles.subtitle}>Sign in to manage your events.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>

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
            autoComplete="password"
            mode="outlined"
            left={<TextInput.Icon icon="lock-outline" />}
            style={styles.input}
            outlineColor="#ded7e8"
            activeOutlineColor="#6f43b7"
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginButtonLabel}
            buttonColor="#6f43b7"
          >
            Login
          </Button>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>New here?</Text>
            <Button
              compact
              mode="text"
              onPress={() => navigation.navigate("Register")}
              textColor="#6f43b7"
              labelStyle={styles.registerButtonLabel}
            >
              Create an account
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
    marginBottom: 34,
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
  loginButton: {
    borderRadius: 8,
    marginTop: 4,
  },
  loginButtonContent: {
    height: 52,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  registerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 14,
  },
  registerText: {
    color: "#766d82",
    fontSize: 14,
  },
  registerButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});
