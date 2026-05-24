import React from "react";
import { Ionicons } from "@expo/vector-icons";

const iconNameByTab = {
  dashboard: {
    focused: "grid",
    default: "grid-outline",
  },
  events: {
    focused: "calendar",
    default: "calendar-outline",
  },
  watchlist: {
    focused: "bookmark",
    default: "bookmark-outline",
  },
  profile: {
    focused: "person-circle",
    default: "person-circle-outline",
  },
};

export default function TabIcon({ iconName, color, focused }) {
  const ioniconName =
    iconNameByTab[iconName]?.[focused ? "focused" : "default"] ||
    "ellipse-outline";

  return <Ionicons name={ioniconName} size={24} color={color} />;
}
