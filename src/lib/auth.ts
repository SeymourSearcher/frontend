import { env } from "@/lib/env";

export function redirectToDiscord() {
  const params = new URLSearchParams({
    client_id: env.discordClientId,
    redirect_uri: env.discordRedirectUri,
    response_type: "code",
    scope: "identify",
  });
  window.location.href = `https://discord.com/api/oauth2/authorize?${params}`;
}

