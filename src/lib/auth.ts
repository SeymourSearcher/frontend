import { env } from "@/lib/env";

// sessionStorage, not localStorage: the value is dead once this tab finishes the
// round trip, and a stale one in another tab would only cause false mismatches.
const STATE_KEY = "oauth_state";

export function redirectToDiscord() {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: env.discordClientId,
    redirect_uri: env.discordRedirectUri,
    response_type: "code",
    scope: "identify",
    state,
  });
  window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
}

/** True if the callback's `state` matches the one we sent. Single use. */
export function consumeOAuthState(returned: string | null): boolean {
  const expected = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return Boolean(expected) && expected === returned;
}
