const normalizeValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getCountryCode = (address) => normalizeValue(address?.isoCountryCode);

const getCountryName = (address) => normalizeValue(address?.country);

const getRegion = (address) => normalizeValue(address?.region);

const formatValue = (value) => String(value || "").trim();

const getCountryLabel = (address) =>
  formatValue(address?.country) ||
  formatValue(address?.isoCountryCode).toUpperCase();

const getRegionLabel = (address) => formatValue(address?.region);

const getStateAndCountryLabel = (address) =>
  [getRegionLabel(address), getCountryLabel(address)].filter(Boolean).join(", ");

const isSameCountry = (firstAddress, secondAddress) => {
  const firstCountryCode = getCountryCode(firstAddress);
  const secondCountryCode = getCountryCode(secondAddress);

  if (firstCountryCode && secondCountryCode) {
    return firstCountryCode === secondCountryCode;
  }

  const firstCountryName = getCountryName(firstAddress);
  const secondCountryName = getCountryName(secondAddress);

  return Boolean(firstCountryName && firstCountryName === secondCountryName);
};

const isAustralia = (address) =>
  getCountryCode(address) === "au" || getCountryName(address) === "australia";

export const isSameRegionAddress = (firstAddress, secondAddress) => {
  const firstRegion = getRegion(firstAddress);
  const secondRegion = getRegion(secondAddress);

  return (
    isSameCountry(firstAddress, secondAddress) &&
    firstRegion &&
    secondRegion &&
    firstRegion === secondRegion
  );
};

export const getEventLocationWarning = (eventAddress, userAddress) => {
  if (!eventAddress || !userAddress) {
    return null;
  }

  if (!isSameCountry(eventAddress, userAddress)) {
    const userCountry = getCountryLabel(userAddress) || "your current country";
    const eventCountry = getCountryLabel(eventAddress) || "the event country";

    return {
      title: "Overseas event",
      message:
        "This event appears to be overseas from your current location. " +
        `You are currently in ${userCountry}, and the event is in ${eventCountry}. ` +
        "Please confirm you still want to register.",
    };
  }

  const eventRegion = getRegion(eventAddress);
  const userRegion = getRegion(userAddress);

  if (
    isAustralia(userAddress) &&
    eventRegion &&
    userRegion &&
    eventRegion !== userRegion
  ) {
    const userLocation =
      getStateAndCountryLabel(userAddress) || "your current state";
    const eventLocation =
      getStateAndCountryLabel(eventAddress) || "the event state";

    return {
      title: "Out-of-state event",
      message:
        "This event appears to be in a different Australian state from your current location. " +
        `You are currently in ${userLocation}, and the event is in ${eventLocation}. ` +
        "Please confirm you still want to register.",
    };
  }

  return null;
};
