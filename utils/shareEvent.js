import { Share } from "react-native";

export const shareEvent = async (event) => {
  try {
    await Share.share({
      message:
        `${event.title}\n\n` +
        `Date: ${event.date}\n` +
        `Location: ${event.location}\n\n` +
        `Details: ${event.description}`,
    });
  } catch (error) {
    console.log("Share error:", error);
  }
};