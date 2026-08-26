/**
 * The single contract every `lib/api` call returns.
 *
 * `status` is 0 when the request never reached the server, so callers can tell a
 * dropped connection from a 401 or a 500 rather than treating both as "empty".
 */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; detail: string };

export const NETWORK_ERROR_STATUS = 0;

/** For call sites that genuinely have nothing to show and nothing to say. */
export function dataOr<T>(result: ApiResult<T>, fallback: T): T {
  return result.ok ? result.data : fallback;
}

/** Reshape a successful payload, passing any failure through untouched. */
export function mapResult<T, U>(result: ApiResult<T>, fn: (data: T) => U): ApiResult<U> {
  return result.ok ? { ok: true, data: fn(result.data) } : result;
}
