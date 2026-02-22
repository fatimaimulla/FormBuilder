import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../lib/apiClient";
import {
  clearSessionStorage,
  getStoredAccessToken,
  getStoredUser,
  saveSession,
} from "./storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const token = getStoredAccessToken();
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const res = await apiClient.get("/auth/me");
        const authenticatedUser = res?.data?.data?.user || null;
        if (!authenticatedUser) {
          clearSessionStorage();
          setAccessToken(null);
          setUser(null);
          setIsInitializing(false);
          return;
        }

        setAccessToken(token);
        setUser(authenticatedUser);
        saveSession({ accessToken: token, user: authenticatedUser });
      } catch {
        clearSessionStorage();
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  const setSession = ({ accessToken: nextAccessToken, user: nextUser }) => {
    setAccessToken(nextAccessToken);
    setUser(nextUser);
    saveSession({ accessToken: nextAccessToken, user: nextUser });
  };

  const logout = () => {
    clearSessionStorage();
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken && user),
      isInitializing,
      setSession,
      logout,
    }),
    [accessToken, user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
