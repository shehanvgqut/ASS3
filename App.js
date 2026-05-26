import React, { useContext, useEffect, useState } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";
import SplashScreen from "./screens/SplashScreen";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { NetworkProvider } from "./context/NetworkContext";
import { initializeLocalNotifications } from "./services/notificationService";

LogBox.ignoreLogs([
  "Network Error",
  "Network connection failed",
  "Failed to connect to jacaranda04.ifn666.com",
]);

function RootNavigator() {
  const { isLoggedIn, authLoading } = useContext(AuthContext);
  const [minimumSplashTimePassed, setMinimumSplashTimePassed] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setMinimumSplashTimePassed(true);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []);

  if (authLoading || !minimumSplashTimePassed) {
    return <SplashScreen />;
  }

  return isLoggedIn ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  useEffect(() => {
    initializeLocalNotifications().catch((error) => {
      console.log("Notification setup error:", error);
    });
  }, []);

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
