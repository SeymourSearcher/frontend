/**
 * The four Seymour armour pieces. The API identifies a piece by its index (0-3);
 * these are the only display names for it. Mirrors backend/app/pieces.py.
 */
export type PieceIndex = 0 | 1 | 2 | 3;

/** Iterate this rather than mapping over a name table -- `.map` widens the index to number. */
export const PIECE_INDEXES: PieceIndex[] = [0, 1, 2, 3];

export const PIECE_SLOT_NAMES = ["Helmet", "Chestplate", "Leggings", "Boots"] as const;
export const PIECE_ITEM_NAMES = [
  "Velvet Top Hat",
  "Cashmere Jacket",
  "Satin Trousers",
  "Oxford Shoes",
] as const;

/** URL slugs for /pieces/[slug], indexed by PieceIndex. */
export const PIECE_SLUGS = PIECE_ITEM_NAMES.map((name) => name.toLowerCase().replace(/ /g, "-"));

export function piecePath(piece: PieceIndex): string {
  return `/pieces/${PIECE_SLUGS[piece]}`;
}

export function pieceForSlug(slug: string): PieceIndex | null {
  const index = PIECE_SLUGS.indexOf(slug);
  return index === -1 ? null : (index as PieceIndex);
}

export function pieceSlotLabel(piece: PieceIndex): string {
  return `Seymour ${PIECE_SLOT_NAMES[piece].toLowerCase()}`;
}
