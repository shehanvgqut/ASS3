import { buildEventShareMessage } from "./eventShareFormatter";
import { shareTextContent } from "./shareContent";

export const shareEvent = async (event, shareContext = "event") => {
  const message = buildEventShareMessage(event, shareContext);

  await shareTextContent({
    title: event?.title || "Event",
    message,
  });
};
