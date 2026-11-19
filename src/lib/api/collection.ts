import type { VisualizationRequest, VisualizationStats } from "@/types/visualization";
import type {
  CollectionValue,
  Seymour,
  SeymourRemoval,
  SubFilterOption,
} from "@/types/seymour";
import type { Stats, RankingUser } from "@/types/stats";
import type { User } from "@/types/user";
import type { PieceIndex } from "@/lib/pieces";
import type { ApiResult } from "@/lib/apiResult";
import { getToken, postJson, request, toQuery } from "./client";

export function exchangeCode(code: string) {
  return postJson<{ access_token: string }>("/auth/discord/callback", { code });
}

export function fetchCurrentUser(): Promise<ApiResult<User>> {
  // Short-circuit rather than spend a guaranteed-401 round trip on every anonymous page load.
  if (!getToken()) {
    return Promise.resolve({ ok: false, status: 401, detail: "Not signed in" });
  }
  return request<User>("/auth/me");
}

export function uploadSeymours(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  // No Content-Type header -- the browser must set it to include the multipart boundary.
  return request<{ imported: number; skipped: number }>("/seymours/upload", {
    method: "POST",
    body: formData,
  });
}

/** Clears the uploaded collection. The account itself survives — see RemovalResponse. */
export function deleteAllSeymours() {
  return request<SeymourRemoval>("/seymours/", { method: "DELETE" });
}

export function fetchGlobalStats() {
  return request<Stats>("/stats/");
}

export function fetchUserStats() {
  return request<Stats>("/stats/me");
}

/** Separate from fetchUserStats so the chips never wait on an auction aggregate. */
export function fetchCollectionValue(includeDyes = false) {
  return request<CollectionValue>(
    `/stats/me/valuation${toQuery({ include_dyes: includeDyes || undefined })}`
  );
}

/**
 * The /items dropdown options — only what the user owns, with counts.
 * Not /seymours/available-filters, which fetchAvailableSets still reads
 * unrestricted so the marketplace can order a set you do not own.
 */
export function fetchSubFilters(filter: string, incompleteOnly = false, includeDyes = false) {
  const query = toQuery({
    filter,
    incomplete_only: incompleteOnly || undefined,
    include_dyes: includeDyes || undefined,
  });
  return request<SubFilterOption[]>(`/seymours/sub-filters${query}`);
}

export function fetchUserSeymours(
  filter?: string,
  subFilter?: string,
  skip = 0,
  limit = 100,
  incompleteOnly = false,
  includeDyes = false,
  sort?: string
) {
  const query = toQuery({
    skip,
    limit,
    filter: filter && filter !== "all" ? filter : undefined,
    sub_filter: subFilter,
    incomplete_only: incompleteOnly || undefined,
    include_dyes: includeDyes || undefined,
    sort,
  });
  return request<Seymour[]>(`/seymours/${query}`);
}

export function fetchUserSeymourHexes() {
  return request<[string, PieceIndex][]>("/seymours/hex-codes/with-pieces");
}

export function fetchRankings(sortBy?: keyof Stats) {
  return request<RankingUser[]>(`/stats/rankings${toQuery({ sort_by: sortBy })}`);
}

export function fetchVisualizationStats(data: VisualizationRequest) {
  return postJson<VisualizationStats>("/visualization/stats", data);
}

export function fetchVisualizationHtml(data: VisualizationRequest) {
  return request<string>(
    "/visualization/generate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    "text"
  );
}
