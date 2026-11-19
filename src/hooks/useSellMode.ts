"use client";

import { useState, useCallback } from "react";
import { track } from "@/lib/analytics";
import { createSellOrders } from "@/lib/api";
import { useCollectionVersion } from "@/contexts/CollectionVersionContext";

export function useSellMode() {
  const { bump } = useCollectionVersion();
  const [sellMode, setSellMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [price, setPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const toggleSellMode = useCallback(() => {
    setSellMode((prev) => {
      if (prev) {
        setSelectedIds(new Set());
        setPrice("");
        setError(null);
        setSuccessCount(null);
      }
      return !prev;
    });
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: number) => selectedIds.has(id), [selectedIds]);

  const submitSellOrders = useCallback(async () => {
    const priceNum = parseInt(price, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Please enter a valid price");
      return false;
    }

    if (selectedIds.size === 0) {
      setError("Please select at least one seymour");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createSellOrders({
      seymour_ids: Array.from(selectedIds),
      price: priceNum,
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.detail);
      return false;
    }

    track("sell_order_created", { price: priceNum, piece_count: result.data.length });
    setSuccessCount(result.data.length);
    setSelectedIds(new Set());
    setPrice("");
    setSellMode(false);
    bump();
    return true;
  }, [price, selectedIds, bump]);

  const dismissSuccess = useCallback(() => {
    setSuccessCount(null);
  }, []);

  return {
    sellMode,
    toggleSellMode,
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelection,
    clearSelection,
    isSelected,
    price,
    setPrice,
    isSubmitting,
    error,
    setError,
    successCount,
    dismissSuccess,
    submitSellOrders,
  };
}
