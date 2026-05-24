import { Platform } from "react-native";

const EVENT_NOTIFICATION_CHANNEL_ID = "event-updates-v2";
const EXPO_GO_ANDROID_PUSH_WARNING =
  "expo-notifications: Android Push notifications (remote notifications)";

let notificationSetupPromise = null;

const loadNotificationsModule = async () => {
  if (Platform.OS !== "android") {
    return await import("expo-notifications");
  }

  const originalConsoleError = console.error;

  console.error = (...args) => {
    const [firstArg] = args;

    if (
      typeof firstArg === "string" &&
      firstArg.startsWith(EXPO_GO_ANDROID_PUSH_WARNING)
    ) {
      return;
    }

    originalConsoleError(...args);
  };

  try {
    return await import("expo-notifications");
  } finally {
    console.error = originalConsoleError;
  }
};

export const initializeLocalNotifications = async () => {
  if (!notificationSetupPromise) {
    notificationSetupPromise = (async () => {
      const Notifications = await loadNotificationsModule();

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowAlert: true,
          shouldShowBanner: true,
          shouldShowList: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      });

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          EVENT_NOTIFICATION_CHANNEL_ID,
          {
            name: "Event updates",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#6f43b7",
            sound: "default",
          }
        );
      }

      return Notifications;
    })().catch((error) => {
      notificationSetupPromise = null;
      throw error;
    });
  }

  return notificationSetupPromise;
};

export const requestNotificationPermission = async () => {
  const Notifications = await initializeLocalNotifications();
  const currentPermission = await Notifications.getPermissionsAsync();

  if (
    currentPermission.granted ||
    currentPermission.status === Notifications.PermissionStatus.GRANTED
  ) {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();

  const granted =
    requestedPermission.granted ||
    requestedPermission.status === Notifications.PermissionStatus.GRANTED;

  if (!granted) {
    console.log("Notification permission was not granted.");
  }

  return granted;
};

export const scheduleLocalNotification = async ({
  title,
  body,
  data = {},
  trigger = null,
}) => {
  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    console.log("Local notification skipped because permission is disabled.");
    return null;
  }

  const Notifications = await initializeLocalNotifications();
  const notificationTrigger =
    trigger ||
    (Platform.OS === "android"
      ? { channelId: EVENT_NOTIFICATION_CHANNEL_ID }
      : null);

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: "default",
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: notificationTrigger,
  });

  console.log("Local notification scheduled:", notificationId);
  return notificationId;
};

export const showRegistrationNotification = async (eventTitle) => {
  try {
    return await scheduleLocalNotification({
      title: "Event Registration Successful",
      body: `You have registered for ${eventTitle}.`,
      data: {
        type: "event-registration",
        eventTitle,
      },
    });
  } catch (error) {
    console.log("Registration notification error:", error);
    return null;
  }
};

export const showRegistrationCancelledNotification = async (eventTitle) => {
  try {
    return await scheduleLocalNotification({
      title: "Event Registration Cancelled",
      body: `You have left ${eventTitle}.`,
      data: {
        type: "event-registration-cancelled",
        eventTitle,
      },
    });
  } catch (error) {
    console.log("Registration cancellation notification error:", error);
    return null;
  }
};
