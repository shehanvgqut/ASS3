export const parseDateSafely = (dateValue) => {
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatDisplayDateTime = (dateValue) => {
  const parsedDate = parseDateSafely(dateValue);

  if (!parsedDate) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
};

export const formatShortDay = (dateValue) => {
  const parsedDate = parseDateSafely(dateValue);

  if (!parsedDate) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
  }).format(parsedDate);
};
