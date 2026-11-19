"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchUserSeymourHexes } from "@/lib/api";
import { useCollectionVersion } from "@/contexts/CollectionVersionContext";
import type { PieceIndex } from "@/lib/pieces";

type HexPiece = [string, PieceIndex];

const NONE: HexPiece[] = [];

/**
 * The signed-in user's (hex, piece) pairs, fetched lazily: pass `enabled` only
 * while something needs them. `ready` is false until the current collection
 * version has loaded, so callers never mistake "not loaded" for "owns nothing".
 */
export function useUserSeymourHexes(enabled: boolean) {
  const { version } = useCollectionVersion();
  const [loaded, setLoaded] = useState<{ version: number; data: HexPiece[] } | null>(null);
  const requested = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || requested.current === version) return;
    requested.current = version;
    fetchUserSeymourHexes().then((result) => {
      if (result.ok) setLoaded({ version, data: result.data });
      else requested.current = null;
    });
  }, [enabled, version]);

  const ready = loaded?.version === version;
  const seymours = ready ? loaded.data : NONE;
  const hexes = useMemo(() => [...new Set(seymours.map(([hex]) => hex))], [seymours]);

  return { seymours, hexes, ready };
}
