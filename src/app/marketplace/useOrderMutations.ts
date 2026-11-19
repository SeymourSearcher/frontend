"use client";

import { cancelOrder, cancelSellOrder, createOrder } from "@/lib/api";
import type { ApiResult } from "@/lib/apiResult";
import type { BuyOrderCreate } from "@/types/marketplace";
import { useCollectionVersion } from "@/contexts/CollectionVersionContext";

/** Every mutation resolves to an error message (null on success) and bumps the
 *  collection version once if anything changed, so dependent lists refetch. */
export function useOrderMutations() {
  const { bump } = useCollectionVersion();

  async function cancelWith(
    cancel: (orderId: number) => Promise<ApiResult<unknown>>,
    orderId: number
  ): Promise<string | null> {
    const result = await cancel(orderId);
    if (!result.ok) return result.detail;
    bump();
    return null;
  }

  /** One error slot per order, in order. Sequential, so a failure is attributable. */
  async function createBuyOrders(orders: BuyOrderCreate[]): Promise<(string | null)[]> {
    const errors: (string | null)[] = [];
    for (const order of orders) {
      const result = await createOrder(order);
      errors.push(result.ok ? null : result.detail);
    }
    if (errors.includes(null)) bump();
    return errors;
  }

  return {
    createBuyOrders,
    cancelBuyOrder: (orderId: number) => cancelWith(cancelOrder, orderId),
    cancelSellOrder: (orderId: number) => cancelWith(cancelSellOrder, orderId),
  };
}
