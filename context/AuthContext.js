import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: null,
  authLoading: true,
  isLoggedIn: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);
      } catch (error) {
        console.log("Token load error:", error);
        setToken(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadToken();
  }, []);

  async function signIn(newToken) {
    await AsyncStorage.setItem("token", newToken);
    setToken(newToken);
  }

  async function signOut() {
    await AsyncStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        authLoading,
        isLoggedIn: Boolean(token),
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}