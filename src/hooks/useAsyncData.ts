"use client";

import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

import type { ApiResult } from "@/lib/apiResult";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; detail: string; statusCode: number };

/**
 * Runs `fetcher` whenever `deps` change, tracking loading and failure.
 *
 * Responses are dropped unless they belong to the most recent run, so rapid
 * dependency changes (typing in a filter, flipping tabs) can't paint stale data.
 */
export function useAsyncData<T>(fetcher: () => Promise<ApiResult<T>>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const runId = useRef(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    const id = ++runId.current;
    setState({ status: "loading" });

    const result = await fetcherRef.current();
    if (id !== runId.current) return;

    setState(
      result.ok
        ? { status: "success", data: result.data }
        : { status: "error", detail: result.detail, statusCode: result.status }
    );
    // `deps` is the caller's declared dependency list; the fetcher is read via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { state, reload };
}
