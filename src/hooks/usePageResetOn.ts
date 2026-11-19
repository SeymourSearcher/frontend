"use client";

import { useState } from "react";

/**
 * A page index that reads as 0 the moment `key` changes, in the same render, so
 * a fetch keyed on the page never fires once with a stale offset first.
 */
export function usePageResetOn(key: string): [number, (page: number) => void] {
  const [state, setState] = useState({ key, page: 0 });
  const page = state.key === key ? state.page : 0;
  return [page, (next: number) => setState({ key, page: next })];
}
