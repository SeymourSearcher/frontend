/**
 * Client-visible environment, validated once at module load.
 *
 * Next inlines `process.env.NEXT_PUBLIC_*` at build time only for statically
 * written references, so every var must be spelled out literally below -- a loop
 * or a dynamic key would inline to `undefined`.
 *
 * Because the values are inlined, a missing var can only ever be missing at
 * build time. Throwing here therefore fails `next build`, never a live page.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  discordClientId: required(
    "NEXT_PUBLIC_DISCORD_CLIENT_ID",
    process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
  ),
  discordRedirectUri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "http://localhost:3000",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY || null,
} as const;
