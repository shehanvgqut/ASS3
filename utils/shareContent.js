import { Share } from "react-native";

export const shareTextContent = async ({ title, message }) => {
  try {
    await Share.share({
      title,
      message,
    });
  } catch (error) {
    console.log("Share error:", error);
  }
};
