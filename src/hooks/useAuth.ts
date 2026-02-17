"use client";

import { useEffect, useState, useCallback } from "react";
import { User } from "@/types/user";
import { exchangeCode, fetchCurrentUser, setToken, clearToken } from "@/lib/api";
import { redirectToDiscord } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const data = await fetchCurrentUser();
    if (data) {
      setUser(data);
    } else {
      clearToken();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      window.history.replaceState({}, "", "/");
      exchangeCode(code).then((data) => {
        if (data) {
          setToken(data.access_token);
          loadUser();
        } else {
          setLoading(false);
        }
      });
    } else {
      loadUser();
    }
  }, [loadUser]);

  function login() {
    redirectToDiscord();
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return { user, loading, login, logout };
}

