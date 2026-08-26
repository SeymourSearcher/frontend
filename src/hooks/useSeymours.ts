"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchUserSeymours, fetchUserStats, fetchAvailableFilters } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Seymour, FilterType } from "@/types/seymour";
import { Stats } from "@/types/stats";

// Stable identity, so the memos below don't recompute on every non-success render.
const EMPTY_SEYMOURS: Seymour[] = [];

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

export function useSeymours() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(true);
  const [availableSubFilters, setAvailableSubFilters] = useState<string[]>([]);
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [includeDyes, setIncludeDyes] = useState(false);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

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
    fetchUserStats().then((result) => {
      if (result.ok) setStats(result.data);
    });
  }, []);

  useEffect(() => {
    if (hasSubFilter) {
      fetchAvailableFilters(filter, incompleteOnly, includeDyes).then((result) => {
        const newFilters = result.ok ? result.data : [];
        setAvailableSubFilters(newFilters);
        setSelectedSubFilters(prev => prev.filter(v => newFilters.includes(v)));
      });
    } else {
      setAvailableSubFilters([]);
      setSelectedSubFilters([]);
    }
    setAllSelected(true);
  }, [filter, hasSubFilter, incompleteOnly, includeDyes]);

  const { state } = useAsyncData(
    () => fetchUserSeymours(
      filter, subFilterParam, 0, 500, incompleteOnly, includeDyes, sortDirection || undefined
    ),
    [filter, subFilterParam, incompleteOnly, includeDyes, sortDirection]
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
    availableSubFilters,
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
  };
}
