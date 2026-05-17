import * as Notifications from "expo-notifications";

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const showRegistrationNotification = async (eventTitle) => {
  const granted = await requestNotificationPermission();

  if (!granted) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Event Registration Successful",
      body: `You have registered for ${eventTitle}.`,
    },
    trigger: null,
  });
};