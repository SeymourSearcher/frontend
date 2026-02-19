"use client";

import { useState, useCallback } from "react";
import { createSellOrders, ApiError } from "@/lib/api";

export function useSellMode() {
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

  const selectAll = useCallback((ids: number[]) => {
    setSelectedIds(new Set(ids));
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

    try {
      const orders = await createSellOrders({
        seymour_ids: Array.from(selectedIds),
        price: priceNum,
      });
      setSuccessCount(orders.length);
      setSelectedIds(new Set());
      setPrice("");
      setSellMode(false);
      return true;
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail);
      } else {
        setError("Failed to create sell orders");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [price, selectedIds]);

  const dismissSuccess = useCallback(() => {
    setSuccessCount(null);
  }, []);

  return {
    sellMode,
    toggleSellMode,
    selectedIds,
    selectedCount: selectedIds.size,
    toggleSelection,
    selectAll,
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
