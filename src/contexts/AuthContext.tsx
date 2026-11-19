"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { clearToken, fetchCurrentUser, onSessionExpired } from "@/lib/api";
import { redirectToDiscord } from "@/lib/auth";
import { User } from "@/types/user";

interface AuthValue {
  user: User | null;
  loading: boolean;
  /** True after a signed-in user's token was rejected mid-session. */
  sessionExpired: boolean;
  dismissSessionExpired: () => void;
  login: () => void;
  logout: () => void;
  /** Re-read the session after a token is written, e.g. by the OAuth callback. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const refresh = useCallback(async () => {
    const result = await fetchCurrentUser();
    if (result.ok) {
      setUser(result.data);
    } else {
      // Only the server rejecting the token proves it's bad. A 500, a 502 from the
      // proxy mid-deploy, or a dropped connection must not log the user out.
      if (result.status === 401 || result.status === 403) clearToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // The API client has already cleared the token. A stale token found on page
  // load is not an "expiry" worth a prompt -- nobody was signed in yet.
  useEffect(
    () =>
      onSessionExpired(() => {
        if (userRef.current) setSessionExpired(true);
        setUser(null);
      }),
    []
  );

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      sessionExpired,
      dismissSessionExpired,
      login: redirectToDiscord,
      logout,
      refresh,
    }),
    [user, loading, sessionExpired, dismissSessionExpired, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
