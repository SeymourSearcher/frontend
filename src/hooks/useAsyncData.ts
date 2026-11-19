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
 *
 * Pass `enabled: false` while a precondition is still unknown (e.g. auth hasn't
 * resolved) — the hook stays in `loading` instead of firing a doomed request.
 *
 * `initialData` (e.g. server-rendered) is shown immediately and skips the first
 * fetch; any later dependency change fetches as usual.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<ApiResult<T>>,
  deps: DependencyList,
  enabled = true,
  initialData?: T
) {
  const [state, setState] = useState<AsyncState<T>>(
    initialData === undefined ? { status: "loading" } : { status: "success", data: initialData }
  );
  const skipFirstRun = useRef(initialData !== undefined);
  const runId = useRef(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    // Bump the run id so any in-flight response from before the gate closed is dropped.
    const id = ++runId.current;
    setState({ status: "loading" });
    if (!enabled) return;

    const result = await fetcherRef.current();
    if (id !== runId.current) return;

    setState(
      result.ok
        ? { status: "success", data: result.data }
        : { status: "error", detail: result.detail, statusCode: result.status }
    );
    // `deps` is the caller's declared dependency list; the fetcher is read via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  useEffect(() => {
    if (skipFirstRun.current) {
      skipFirstRun.current = false;
      return;
    }
    reload();
  }, [reload]);

  return { state, reload };
}
