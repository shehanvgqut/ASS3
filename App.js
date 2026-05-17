import React, { useContext } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { NetworkProvider } from "./context/NetworkContext";

function RootNavigator() {
  const { isLoggedIn, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>Checking login...</Text>
      </View>
    );
  }

  return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <NetworkProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <RootNavigator />
            </NavigationContainer>
          </NetworkProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
