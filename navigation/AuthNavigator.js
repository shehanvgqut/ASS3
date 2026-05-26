import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const authHeaderOptions = {
  headerStyle: {
    backgroundColor: "#f8f6fb",
  },
  headerShadowVisible: false,
  headerTitleAlign: "left",
  headerTitleStyle: {
    color: "#21172f",
    fontSize: 24,
    fontWeight: "800",
  },
  headerTintColor: "#6f43b7",
};

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={authHeaderOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Create Account" }}
      />
    </Stack.Navigator>
  );
}
