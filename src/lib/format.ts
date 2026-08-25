/** Compact price: 1.2B / 5.5M / 900.0K / 500. */
export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `${(price / 1_000).toFixed(1)}K`;
  return String(price);
}

/**
 * Remaining time as "3d 4h" / "5h 20m" / "40m", or null once elapsed.
 *
 * Null rather than a label because callers word that case differently -- an
 * auction has "Ended", an order has "Expired".
 */
export function formatDuration(ms: number): string | null {
  if (ms <= 0) return null;

  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);

  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Time until `target` (epoch ms), or `elapsedLabel` once it has passed.
 *
 * Reads the clock rather than taking `now`, matching the helpers it replaced:
 * these are static renders, not counters, so nothing re-renders as time passes.
 */
export function formatTimeUntil(target: number, elapsedLabel: string): string {
  return formatDuration(target - Date.now()) ?? elapsedLabel;
}

/** Elapsed time as "5s ago" / "3m ago" / "2h ago" / "4d ago". */
export function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}
