import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";

const canUseNotifications = () =>
  !(Platform.OS === "android" && isRunningInExpoGo());

export const requestNotificationPermission = async () => {
  if (!canUseNotifications()) {
    return false;
  }

  const Notifications = await import("expo-notifications");
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const showRegistrationNotification = async (eventTitle) => {
  const granted = await requestNotificationPermission();

  if (!granted) {
    return;
  }

  const Notifications = await import("expo-notifications");
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Event Registration Successful",
      body: `You have registered for ${eventTitle}.`,
    },
    trigger: null,
  });
};
