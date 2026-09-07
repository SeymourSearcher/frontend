"use client";

import { useEffect, useState } from "react";
import { fetchCollectionValue } from "@/lib/api";
import type { CollectionValue } from "@/types/seymour";

/**
 * The collection's estimated worth.
 *
 * Deliberately its own hook rather than another field on useSeymours: the value
 * comes from an aggregate over ended_auctions, and the counts and the grid must
 * not wait on it. Null until it lands, so callers reserve space for it.
 */
export function useCollectionValue(enabled: boolean, includeDyes = false) {
  const [value, setValue] = useState<CollectionValue | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(null);
      return;
    }

    let current = true;
    fetchCollectionValue(includeDyes).then((result) => {
      if (current && result.ok) setValue(result.data);
    });
    return () => {
      current = false;
    };
  }, [enabled, includeDyes]);

  return value;
}
