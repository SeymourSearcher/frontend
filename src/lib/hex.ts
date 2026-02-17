export function cleanHexInput(input: string): string {
  return input.replace(/^#/, "").trim().toUpperCase();
}

export function isValidHex(hex: string): boolean {
  return /^[0-9A-F]{6}$/.test(hex);
}
