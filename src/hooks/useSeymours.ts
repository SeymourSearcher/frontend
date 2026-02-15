"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchUserSeymours, fetchUserStats, fetchAvailableFilters } from "@/lib/api";
import { Seymour, UserStats, FilterType } from "@/types/seymour";

const FILTERS: { key: FilterType; label: string; hasSubFilter: boolean }[] = [
  { key: "all", label: "All", hasSubFilter: false },
  { key: "stars", label: "Stars", hasSubFilter: false },
  { key: "t1", label: "T1", hasSubFilter: true },
  { key: "t2", label: "T2", hasSubFilter: true },
  { key: "t3", label: "T3", hasSubFilter: true },
  { key: "words", label: "Words", hasSubFilter: false },
  { key: "dupes", label: "Dupes", hasSubFilter: false },
  { key: "sets", label: "Sets", hasSubFilter: true },
  { key: "dyes", label: "Dyes", hasSubFilter: true },
];

type GroupedSeymours = { [key: string]: Seymour[] };

export function useSeymours() {
  const [seymours, setSeymours] = useState<Seymour[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [subFilter, setSubFilter] = useState<string>("");
  const [availableSubFilters, setAvailableSubFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [incompleteOnly, setIncompleteOnly] = useState(false);

  const currentFilterConfig = FILTERS.find(f => f.key === filter);
  const hasSubFilter = currentFilterConfig?.hasSubFilter ?? false;
  const shouldGroup = filter === "sets" || filter === "dyes";
  const canFilterIncomplete = filter === "sets" || filter === "dyes";

  useEffect(() => {
    fetchUserStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

  useEffect(() => {
    if (hasSubFilter) {
      fetchAvailableFilters(filter, incompleteOnly).then((data) => {
        const newFilters = data || [];
        setAvailableSubFilters(newFilters);
        if (subFilter && !newFilters.includes(subFilter)) {
          setSubFilter("");
        }
      });
    } else {
      setAvailableSubFilters([]);
      setSubFilter("");
    }
  }, [filter, hasSubFilter, incompleteOnly]);

  useEffect(() => {
    setLoading(true);
    fetchUserSeymours(filter, subFilter || undefined, 0, 500, incompleteOnly).then((data) => {
      setSeymours(data || []);
      setLoading(false);
    });
  }, [filter, subFilter, incompleteOnly]);

  // Group by set name (e.g., "Strong Dragon") showing all pieces
  const groupedSeymours = useMemo<GroupedSeymours>(() => {
    if (!shouldGroup) return { "": seymours };
    
    const groups: GroupedSeymours = {};
    for (const s of seymours) {
      // Extract base set name (e.g., "Strong Dragon" from "Strong Dragon Chestplate")
      const setName = s.match?.target_name || "Unknown";
      if (!groups[setName]) groups[setName] = [];
      groups[setName].push(s);
    }
    return groups;
  }, [seymours, shouldGroup]);

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
    return "Items";
  }

  return {
    seymours,
    stats,
    filter,
    setFilter,
    subFilter,
    setSubFilter,
    availableSubFilters,
    loading,
    hasSubFilter,
    shouldGroup,
    groupedSeymours,
    getStatCount,
    getSubFilterLabel,
    FILTERS,
    incompleteOnly,
    setIncompleteOnly,
    canFilterIncomplete,
  };
}
