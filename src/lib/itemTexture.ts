/**
 * Leather armour item textures, tinted the way Minecraft tints dyed leather:
 * output = grayscale texture x dye colour, per channel.
 *
 * Art extracted from the "toy car 16x [1.21] default" resource pack. That pack's
 * leather_*_overlay.png files are empty, so there is no untinted trim layer to composite.
 */
import { cleanHexInput, isValidHex } from "./hex";
import type { PieceIndex } from "./pieces";

const SIZE = 16;
const PIXELS = SIZE * SIZE;

/** 256 grayscale bytes per piece, base64, indexed by PieceIndex. Byte 0 means transparent -- the darkest real pixel is 0x35. */
const PIECE_TEXTURES = [
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTU1NTU1MAAAAAAAAAAABTlpaWlnNzNQAAAAAAAABTls/Ps5aWlnM1AAAAAAAAU7PPz8+zlpaWNQAAAAAAAFOzs1OWljVzljUAAAAAAABTs1M1U1M1NZY1AAAAAAAAU7NTNTU1NTVzNQAAAAAAAFOWNTU1NTU1czUAAAAAAAAAUzUAAAAANTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU1NTU1MAAAAAU1NTU1MAAFPPz7NTAAAAAFPPz7NTAABTz7OzllMAAFOWz8/PUwAAU7Ozs8+WU1OWz8/Pz1MAAFNzlrPPz8/Pz8/PlnNTAAA1NXPPz8/Pz8/Pz3M1NQAAAAA1z8/Pz8/Pz881AAAAAAAANc/Pz8/Pz8/PNQAAAAAAADXPz8/Pz8/PszUAAAAAAAA1s8/Pz8/Ps7M1AAAAAAAANZazs7Ozs7OWNQAAAAAAAAA1lrOzs7OWNQAAAAAAAAAAADU1NTU1NQAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU1NTU1NTUzUAAAAAAAAAU8/Pz8/Ps7NzNQAAAAAAAFPPz7Ozs7OzljUAAAAAAABTz7Ozlpazs5Y1AAAAAAAAU8+zljU1c7OWNQAAAAAAAFPGszUAADWzljUAAAAAAABTxrM1AAA1s5Y1AAAAAAAAU8aWNQAANZaWNQAAAAAAAFOWljUAADWWljUAAAAAAAA1lpY1AAA1lnM1AAAAAAAANXNzNQAANXNzNQAAAAAAADU1NTUAADU1NTUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFNTUwAAU1NTAAAAAAAAAFPPzzUAAFPPzzUAAAAAAABTz881AABTz7M1AAAAAAAAU8+zNQAAU7OzNQAAAAAAAFOzszUAAFOzszUAAAAAAABTs5Y1AABTs7M1AAAAAABLs7OWQAAAS5azlkAAAABLs7OWXUAAAEtdlrOWQAAAS5aWXUBAAABAQJaWg0AAAEtAQEAAAAAAAABAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
] as const;

const decoded: (Uint8Array | undefined)[] = [];

function grayscale(piece: PieceIndex): Uint8Array {
  const cached = decoded[piece];
  if (cached) return cached;

  const binary = atob(PIECE_TEXTURES[piece]);
  const bytes = new Uint8Array(PIXELS);
  for (let i = 0; i < PIXELS; i++) bytes[i] = binary.charCodeAt(i);

  decoded[piece] = bytes;
  return bytes;
}

let scratch: CanvasRenderingContext2D | null = null;

function scratchContext(): CanvasRenderingContext2D | null {
  if (scratch) return scratch;

  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  scratch = canvas.getContext("2d");
  return scratch;
}

/** Keyed `piece:hex`. Item lists re-render every sprite on each filter change, so encoding is not free. */
const tinted = new Map<string, string>();

/** Returns a 16x16 PNG data URL, or null when there is no DOM or the hex is malformed. */
export function tintPieceTexture(piece: PieceIndex, hex: string): string | null {
  if (typeof document === "undefined") return null;

  const clean = cleanHexInput(hex);
  if (!isValidHex(clean)) return null;

  const key = `${piece}:${clean}`;
  const cached = tinted.get(key);
  if (cached) return cached;

  const context = scratchContext();
  if (!context) return null;

  const dye = parseInt(clean, 16);
  const red = (dye >> 16) & 0xff;
  const green = (dye >> 8) & 0xff;
  const blue = dye & 0xff;

  const gray = grayscale(piece);
  const rgba = new Uint8ClampedArray(PIXELS * 4);
  for (let i = 0; i < PIXELS; i++) {
    const level = gray[i];
    if (level === 0) continue;

    const offset = i * 4;
    rgba[offset] = (level * red) / 255;
    rgba[offset + 1] = (level * green) / 255;
    rgba[offset + 2] = (level * blue) / 255;
    rgba[offset + 3] = 255;
  }

  context.putImageData(new ImageData(rgba, SIZE, SIZE), 0, 0);

  const url = context.canvas.toDataURL();
  tinted.set(key, url);
  return url;
}
