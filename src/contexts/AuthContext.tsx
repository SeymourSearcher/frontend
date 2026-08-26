"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { clearToken, fetchCurrentUser } from "@/lib/api";
import { NETWORK_ERROR_STATUS } from "@/lib/apiResult";
import { redirectToDiscord } from "@/lib/auth";
import { User } from "@/types/user";

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  /** Re-read the session after a token is written, e.g. by the OAuth callback. */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await fetchCurrentUser();
    if (result.ok) {
      setUser(result.data);
    } else {
      // A failed reachability check must not discard a token that may still be good.
      if (result.status !== NETWORK_ERROR_STATUS) clearToken();
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login: redirectToDiscord, logout, refresh }),
    [user, loading, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
