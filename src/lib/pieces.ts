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
