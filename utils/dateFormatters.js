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

export const formatDisplayDate = (dateValue) => {
  const parsedDate = parseDateSafely(dateValue);

  if (!parsedDate) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
    year: "numeric",
  }).format(parsedDate);
};

export const formatDisplayTime = (dateValue) => {
  const parsedDate = parseDateSafely(dateValue);

  if (!parsedDate) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
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
