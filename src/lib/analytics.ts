import type { PostHog } from "posthog-js";
import { env } from "@/lib/env";
import type { User } from "@/types/user";

export type SearchSource = "header" | "home" | "hex_page" | "search_page" | "not_found";

type AnalyticsEvents = {
  hex_searched: { hex: string; source: SearchSource };
  pattern_searched: { pattern: string; source: SearchSource };
  collection_uploaded: { piece_count: number };
  upload_failed: { reason: string };
  buy_order_created: { price: number };
  sell_order_created: { price: number; piece_count: number };
  order_cancelled: { side: "buy" | "sell" };
  login_started: Record<string, never>;
  login_completed: Record<string, never>;
};

let client: Promise<PostHog> | null = null;

const IDLE_TIMEOUT_MS = 3000;

function afterLoadIdle(): Promise<void> {
  return new Promise((resolve) => {
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
      } else {
        setTimeout(resolve, IDLE_TIMEOUT_MS);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  });
}

// Dynamic import keeps posthog-js off the wire entirely when no key is configured.
async function loadClient(key: string): Promise<PostHog> {
  await afterLoadIdle();
  const { default: posthog } = await import("posthog-js");
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: "https://eu.posthog.com",
    defaults: "2026-08-30",
    capture_pageview: "history_change",
    capture_pageleave: true,
    capture_heatmaps: true,
    capture_dead_clicks: true,
    session_recording: { maskAllInputs: true },
    disable_surveys: true,
  });
  return posthog;
}

/**
 * Idempotent; a no-op when NEXT_PUBLIC_POSTHOG_KEY is unset. The SDK loads once the page is idle after
 * `load` so it never competes with hydration; calls made before then queue on the returned promise.
 */
export function initAnalytics(): Promise<PostHog> | null {
  if (!client && env.posthogKey && typeof window !== "undefined") {
    client = loadClient(env.posthogKey);
  }
  return client;
}

function withClient(fn: (posthog: PostHog) => void): void {
  void initAnalytics()?.then(fn);
}

export function track<E extends keyof AnalyticsEvents>(
  event: E,
  ...props: AnalyticsEvents[E] extends Record<string, never> ? [] : [AnalyticsEvents[E]]
): void {
  withClient((posthog) => posthog.capture(event, props[0]));
}

export function identifyUser(user: User): void {
  withClient((posthog) =>
    posthog.identify(String(user.id), { username: user.username, created_at: user.created_at })
  );
}

export function resetAnalytics(): void {
  withClient((posthog) => posthog.reset());
}
