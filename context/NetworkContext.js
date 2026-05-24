import React, { createContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const NetworkContext = createContext({
  isOnline: true,
});

export function NetworkProvider({ children }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const hasConnection = Boolean(state.isConnected);
      const hasInternet = state.isInternetReachable !== false;

      setIsOnline(hasConnection && hasInternet);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
      {children}
    </NetworkContext.Provider>
  );
}
