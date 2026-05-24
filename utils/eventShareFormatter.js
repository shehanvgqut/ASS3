import { formatDisplayDateTime } from "./dateFormatters";

const formatLabel = (value, fallback = "Not specified") => value || fallback;

const formatCategory = (category) =>
  category ? category.charAt(0).toUpperCase() + category.slice(1) : "General";

export const buildEventShareMessage = (event, shareContext = "event") => {
  const title = formatLabel(event?.title, "Event");
  const date = formatDisplayDateTime(event?.date);
  const location = formatLabel(event?.location);
  const category = formatCategory(event?.category);
  const status = formatLabel(event?.status, "upcoming");
  const description = event?.description?.trim();

  const contextLine =
    shareContext === "joined"
      ? "I have joined this event:"
      : "Check out this event:";

  return [
    contextLine,
    "",
    title,
    `Date: ${date}`,
    `Location: ${location}`,
    `Category: ${category}`,
    `Status: ${status}`,
    event?.maxAttendees ? `Capacity: ${event.maxAttendees} attendees` : null,
    description ? "" : null,
    description ? `About: ${description}` : null,
  ]
    .filter(Boolean)
    .join("\n");
};
