import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../screens/DashboardScreen";
import AvailableEventsScreen from "../screens/AvailableEventsScreen";
import EventDetailsScreen from "../screens/EventDetailsScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import WatchlistScreen from "../screens/WatchlistScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function EventsStack() {
  return (
    <Stack.Navigator>
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

function MyEventsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyEventsList"
        component={MyEventsScreen}
        options={{ title: "My Events" }}
      />

      <Stack.Screen
        name="MyEventDetails"
        component={EventDetailsScreen}
        options={{ title: "Event Details" }}
      />
    </Stack.Navigator>
  );
}

function WatchlistStack() {
  return (
    <Stack.Navigator>
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
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      <Tab.Screen
        name="Events"
        component={EventsStack}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="My Events"
        component={MyEventsStack}
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