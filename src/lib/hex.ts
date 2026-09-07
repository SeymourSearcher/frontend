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
