export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const token = getToken();
  const headers: HeadersInit = { ...options?.headers };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) return null;
  return res.json();
}

export async function exchangeCode(code: string) {
  const res = await fetch(`${API_URL}/auth/discord/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) return null;
  return res.json() as Promise<{ access_token: string }>;
}

export async function fetchCurrentUser() {
  return request<{ discord_id: number; username: string; avatar_hash: string | null }>("/auth/me");
}

export async function uploadSeymours(file: File) {
  const token = getToken();
  if (!token) return null;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/seymours/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) return null;
  return res.json() as Promise<{ imported: number; skipped: number }>;
}

export async function fetchGlobalStats() {
  const res = await fetch(`${API_URL}/stats/`);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchUserStats() {
  return request<{
    stars: number;
    t1: number;
    t2: number;
    t3: number;
    words: number;
    dupes: number;
    total_sets: number;
    dyed_sets: number;
    total_seymours: number;
  }>("/stats/me");
}

export async function fetchUserSeymours(filter?: string, subFilter?: string, skip = 0, limit = 100, incompleteOnly = false, includeDyes = false, sort?: string) {
  const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
  if (filter && filter !== "all") {
    params.set("filter", filter);
  }
  if (subFilter) {
    params.set("sub_filter", subFilter);
  }
  if (incompleteOnly) {
    params.set("incomplete_only", "true");
  }
  if (includeDyes) {
    params.set("include_dyes", "true");
  }
  if (sort) {
    params.set("sort", sort);
  }
  return request<{
    id: number;
    item_name: string;
    hex_color: string;
    match?: { target_name: string; target_hex: string; delta_e: number; missing?: string[] } | null;
  }[]>(`/seymours/?${params}`);
}

export async function fetchAvailableFilters(filter: string, incompleteOnly = false, includeDyes = false) {
  const params = new URLSearchParams({ filter });
  if (incompleteOnly) {
    params.set("incomplete_only", "true");
  }
  if (includeDyes) {
    params.set("include_dyes", "true");
  }
  return request<string[]>(`/seymours/available-filters?${params}`);
}

export interface RankingUser {
  discord_id: number;
  username: string;
  avatar_hash: string | null;
  stars: number;
  t1: number;
  t2: number;
  t3: number;
  words: number;
  dupes: number;
  total_sets: number;
  dyed_sets: number;
  total_seymours: number;
}

export async function fetchRankings() {
  const res = await fetch(`${API_URL}/stats/rankings`);
  if (!res.ok) return null;
  return res.json() as Promise<RankingUser[]>;
}

export interface HexUser {
  discord_id: number;
  username: string;
  avatar_hash: string | null;
  delta_e: number;
}

export interface HexMatch {
  item_name: string;
  target_hex: string;
  delta_e: number;
  pieces: string[];
  users_by_tier: {
    t1: HexUser[];
    t2: HexUser[];
    t3: HexUser[];
  };
}

export interface HexInfo {
  hex_code: string;
  top_matches: HexMatch[];
}

export async function fetchHexInfo(hexCode: string): Promise<HexInfo | null> {
  const res = await fetch(`${API_URL}/hex/${hexCode}`);
  if (!res.ok) return null;
  return res.json();
}

