"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { exchangeCode, setToken } from "@/lib/api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      router.push("/");
      return;
    }

    exchangeCode(code).then(async (data) => {
      if (!data) {
        router.push("/?error=auth_failed");
        return;
      }
      setToken(data.access_token);
      // The provider already resolved as logged-out on mount; without this the
      // header stays signed-out until a full reload.
      await refresh();
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
