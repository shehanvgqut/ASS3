import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import AvailableEventsScreen from "../screens/AvailableEventsScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import WatchlistScreen from "../screens/WatchlistScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabIcon from "../components/TabIcon";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screenHeaderOptions = {
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

function EventsStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen
        name="AvailableEvents"
        component={AvailableEventsScreen}
        options={{ title: "Available Events" }}
      />

      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{ title: "Event Details" }}
      />
    </Stack.Navigator>
  );
}

function WatchlistStack() {
  return (
    <Stack.Navigator screenOptions={screenHeaderOptions}>
      <Stack.Screen
        name="WatchlistList"
        component={WatchlistScreen}
        options={{ title: "Watchlist" }}
      />

      <Stack.Screen
        name="WatchlistEventDetails"
        component={EventDetailsScreen}
        options={{ title: "Event Details" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...screenHeaderOptions,
        tabBarActiveTintColor: "#6f43b7",
        tabBarInactiveTintColor: "#8a8790",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: 4,
        },
        tabBarStyle: {
          borderTopColor: "#e6e0ec",
          height: 68,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, focused }) => {
          const tabIconNameByRouteName = {
            Dashboard: "dashboard",
            Events: "events",
            Watchlist: "watchlist",
            Profile: "profile",
          };

          return (
            <TabIcon
              iconName={tabIconNameByRouteName[route.name]}
              color={color}
              focused={focused}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      <Tab.Screen
        name="Events"
        component={EventsStack}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="Watchlist"
        component={WatchlistStack}
        options={{ headerShown: false }}
      />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
