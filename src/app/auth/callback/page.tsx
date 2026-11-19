"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { track } from "@/lib/analytics";
import { exchangeCode, setToken } from "@/lib/api";
import { consumeOAuthState } from "@/lib/auth";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  // The state check is single-use, so StrictMode's second pass would fail it.
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const code = searchParams.get("code");
    if (!code) {
      router.push("/");
      return;
    }

    if (!consumeOAuthState(searchParams.get("state"))) {
      router.push("/?error=auth_failed");
      return;
    }

    exchangeCode(code).then(async (result) => {
      if (!result.ok) {
        router.push("/?error=auth_failed");
        return;
      }
      setToken(result.data.access_token);
      // The provider already resolved as logged-out on mount; without this the
      // header stays signed-out until a full reload.
      await refresh();
      track("login_completed");
      router.push("/items");
    });
  }, [searchParams, router, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Authenticating...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
