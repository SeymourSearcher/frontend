"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchUserSeymours, fetchUserStats, fetchSubFilters } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useCollectionVersion } from "@/contexts/CollectionVersionContext";
import { Seymour, FilterType, SubFilterOption } from "@/types/seymour";
import { Stats } from "@/types/stats";

// Stable identity, so the memos below don't recompute on every non-success render.
const EMPTY_SEYMOURS: Seymour[] = [];
const EMPTY_SUB_FILTERS: SubFilterOption[] = [];

const FILTERS: { key: FilterType; label: string; hasSubFilter: boolean }[] = [
  { key: "all", label: "All", hasSubFilter: true },
  { key: "stars", label: "Stars", hasSubFilter: false },
  { key: "t1", label: "T1", hasSubFilter: true },
  { key: "t2", label: "T2", hasSubFilter: true },
  { key: "t3", label: "T3", hasSubFilter: true },
  { key: "words", label: "Words", hasSubFilter: false },
  { key: "dupes", label: "Dupes", hasSubFilter: false },
  { key: "sets", label: "Sets", hasSubFilter: true },
  { key: "dyes", label: "Dyes", hasSubFilter: true },
  { key: "custom", label: "Custom", hasSubFilter: false },
];

type GroupedSeymours = { [key: string]: Seymour[] };
type SortDirection = "asc" | "desc";

/** `enabled` gates the user-scoped calls; pass false until auth resolves to a signed-in user. */
export function useSeymours(enabled = true) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(true);
  const [availableSubFilters, setAvailableSubFilters] = useState<SubFilterOption[]>([]);
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [includeDyes, setIncludeDyes] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);
  const { version, bump } = useCollectionVersion();

  const currentFilterConfig = FILTERS.find(f => f.key === filter);
  const hasSubFilter = currentFilterConfig?.hasSubFilter ?? false;
  const shouldGroup = filter === "sets" || filter === "dyes" || filter === "custom";
  const canFilterIncomplete = filter === "sets" || filter === "dyes";
  const canIncludeDyes = filter === "t1" || filter === "t2" || filter === "t3";

  const subFilterParam = useMemo(() => {
    if (allSelected || selectedSubFilters.length === 0) return undefined;
    return selectedSubFilters.join(",");
  }, [allSelected, selectedSubFilters]);

  const toggleAllSelected = () => {
    setAllSelected(prev => !prev);
    if (!allSelected) {
      setSelectedSubFilters([]);
    }
  };

  const toggleSubFilter = (value: string) => {
    setSelectedSubFilters(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      return [...prev, value];
    });
  };

  useEffect(() => {
    if (!enabled) return;
    fetchUserStats().then((result) => {
      if (result.ok) setStats(result.data);
    });
  }, [enabled, version]);

  // Read inside the fetch below without making the selection a dependency --
  // that would refetch the options on every toggle.
  const selectedRef = useRef<string[]>([]);
  useEffect(() => {
    selectedRef.current = selectedSubFilters;
  }, [selectedSubFilters]);

  // The selection carries across tabs: only names the new tab does not offer are
  // dropped, and All comes back only when that leaves nothing. Tabs without a
  // sub-filter keep it untouched so switching through one is not a reset -- the
  // backend ignores sub_filter for those.
  useEffect(() => {
    if (!enabled || !hasSubFilter) return;
    fetchSubFilters(filter, incompleteOnly, includeDyes).then((result) => {
      const newFilters = result.ok ? result.data : [];
      const names = new Set(newFilters.map(o => o.name));
      const carried = selectedRef.current.filter(v => names.has(v));
      setAvailableSubFilters(newFilters);
      setSelectedSubFilters(carried);
      setAllSelected(carried.length === 0);
    });
  }, [enabled, filter, hasSubFilter, incompleteOnly, includeDyes, version]);

  const { state } = useAsyncData(
    () => fetchUserSeymours(
      filter, subFilterParam, 0, 210, incompleteOnly, includeDyes, sortDirection || undefined
    ),
    [filter, subFilterParam, incompleteOnly, includeDyes, sortDirection, version],
    enabled
  );

  const seymours = state.status === "success" ? state.data : EMPTY_SEYMOURS;

  const groupedSeymours = useMemo<GroupedSeymours>(() => {
    if (!shouldGroup) return { "": seymours };
    
    const groups: GroupedSeymours = {};
    const groupOrder: string[] = [];
    for (const s of seymours) {
      const setName = s.match?.target_name || "Unknown";
      if (!groups[setName]) {
        groups[setName] = [];
        groupOrder.push(setName);
      }
      groups[setName].push(s);
    }
    const orderedGroups: GroupedSeymours = {};
    for (const name of groupOrder) {
      orderedGroups[name] = groups[name];
    }
    return orderedGroups;
  }, [seymours, shouldGroup]);

  const getGroupAverage = (items: Seymour[]): number => {
    const deltas = items.map(s => s.match?.delta_e).filter((d): d is number => d !== undefined);
    if (deltas.length === 0) return Infinity;
    return deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
  };

  function getStatCount(key: FilterType): number {
    if (!stats || key === "all") return 0;
    const statMap: Record<string, number> = {
      stars: stats.stars,
      t1: stats.t1,
      t2: stats.t2,
      t3: stats.t3,
      words: stats.words,
      dupes: stats.dupes,
      sets: stats.total_sets,
      dyes: stats.dyed_sets,
    };
    return statMap[key] ?? 0;
  }

  function getSubFilterLabel(): string {
    if (filter === "sets") return "Sets";
    if (filter === "dyes") return "Dyes";
    if (filter === "all" || filter === "t1" || filter === "t2" || filter === "t3") return "Items";
    return "Sets";
  }

  const toggleSort = () => {
    setSortDirection(prev => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  return {
    seymours,
    stats,
    filter,
    setFilter,
    selectedSubFilters,
    toggleSubFilter,
    allSelected,
    toggleAllSelected,
    availableSubFilters: hasSubFilter ? availableSubFilters : EMPTY_SUB_FILTERS,
    loading: state.status === "loading",
    error: state.status === "error" ? state.detail : null,
    hasSubFilter,
    shouldGroup,
    groupedSeymours,
    getStatCount,
    getSubFilterLabel,
    getGroupAverage,
    FILTERS,
    incompleteOnly,
    setIncompleteOnly,
    canFilterIncomplete,
    includeDyes,
    setIncludeDyes,
    canIncludeDyes,
    sortDirection,
    toggleSort,
    reload: bump,
  };
}
