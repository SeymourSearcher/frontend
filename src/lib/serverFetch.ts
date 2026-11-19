import { cache } from "react";
import { env } from "@/lib/env";
import type { HexInfo } from "@/types/hex";

const TIMEOUT_MS = 5000;

/**
 * Server-side GET through Next's data cache. Null on any failure, so a page can
 * omit a section or hand the fetch to the client rather than 500.
 */
export async function getJson<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${env.apiUrl}${path}`, {
      next: { revalidate },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// cache() because a fetch with a signal skips Next's per-render dedupe, and both
// generateMetadata and the page read this.
export const getHexInfo = cache((hexcode: string) => getJson<HexInfo>(`/hex/${hexcode}`, 300));
