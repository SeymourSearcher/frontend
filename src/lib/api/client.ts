import { env } from "@/lib/env";
import { type ApiResult, NETWORK_ERROR_STATUS } from "@/lib/apiResult";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

const sessionExpiredListeners = new Set<() => void>();

/** Fires when the server rejects a token we sent. Returns the unsubscribe. */
export function onSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
}

type QueryValue = string | number | boolean | readonly (string | number)[] | undefined | null;

/** Omits empty values, so absent filters stay absent rather than becoming `?tier=`. */
export function toQuery(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) search.set(key, value.join(","));
      continue;
    }
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** FastAPI sends `{detail: string}`; validation failures send `{detail: [...]}` instead. */
async function readDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.detail === "string") return body.detail;
  } catch {
    // Fall through to the generic message.
  }
  return `Request failed (${res.status})`;
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  parseAs: "json" | "text" = "json"
): Promise<ApiResult<T>> {
  const token = getToken();
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${env.apiUrl}${endpoint}`, { ...options, headers });
  } catch {
    return {
      ok: false,
      status: NETWORK_ERROR_STATUS,
      detail: "Could not reach the server. Check your connection and try again.",
    };
  }

  if (!res.ok) {
    // Only a token we sent can have expired; anonymous 401s must not log anyone out.
    if (res.status === 401 && token) {
      clearToken();
      sessionExpiredListeners.forEach((listener) => listener());
    }
    return { ok: false, status: res.status, detail: await readDetail(res) };
  }

  const data = parseAs === "text" ? await res.text() : await res.json();
  return { ok: true, data: data as T };
}

export function postJson<T>(endpoint: string, body: unknown): Promise<ApiResult<T>> {
  return request<T>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
