import React from "react";
import { Button } from "react-native-paper";

import { shareEvent } from "../utils/shareEvent";

export default function ShareEventButton({
  event,
  mode = "outlined",
  shareContext = "event",
  compact = false,
}) {
  return (
    <Button
      compact={compact}
      mode={mode}
      onPress={() => shareEvent(event, shareContext)}
    >
      Share
    </Button>
  );
}
