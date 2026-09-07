export const HEX_LENGTH = 6;

export function cleanHexInput(input: string): string {
  return input.replace(/^#/, "").trim().toUpperCase();
}

/** What a hex field is allowed to contain while it is being typed. */
export function sanitizeHexInput(input: string): string {
  return input.replace(/[^0-9A-Fa-f]/g, "").toUpperCase().slice(0, HEX_LENGTH);
}

export function isValidHex(hex: string): boolean {
  return /^[0-9A-F]{6}$/.test(hex);
}

/**
 * Pattern helpers. Grammar mirror of backend/app/services/hex_pattern.py:
 * 0-9A-F literal, ? wildcard, G-Z bound variable. Every valid hex is a valid
 * pattern, so these widen the search box without loosening the strict fields
 * (buy-order criteria, the /hex route) that stay on the helpers above.
 */
export function sanitizePatternInput(input: string): string {
  return input.replace(/[^0-9A-Za-z?]/g, "").toUpperCase().slice(0, HEX_LENGTH);
}

export function isValidPattern(pattern: string): boolean {
  return /^[0-9A-Z?]{6}$/.test(pattern);
}

/** True when the input needs the search page rather than a single colour page. */
export function hasWildcard(pattern: string): boolean {
  return /[G-Z?]/.test(pattern);
}

/** Whether a partial input is still pure hex, and so safe to render as a colour. */
export function isHexPrefix(input: string): boolean {
  return /^[0-9A-F]*$/.test(input);
}
