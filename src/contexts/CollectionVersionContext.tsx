"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface CollectionVersionValue {
  /** Include in the dependency list of any fetch that reads the collection or orders. */
  version: number;
  /** Call after a mutation so every dependent view refetches. */
  bump: () => void;
}

const CollectionVersionContext = createContext<CollectionVersionValue | null>(null);

export function CollectionVersionProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  const value = useMemo(() => ({ version, bump }), [version, bump]);

  return (
    <CollectionVersionContext.Provider value={value}>{children}</CollectionVersionContext.Provider>
  );
}

export function useCollectionVersion() {
  const value = useContext(CollectionVersionContext);
  if (!value) throw new Error("useCollectionVersion must be used inside CollectionVersionProvider");
  return value;
}
