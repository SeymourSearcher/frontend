"use client";

import { SellOrder } from "@/types/marketplace";
import SellOrderCard from "./SellOrderCard";

type SellTab = "all" | "mine";

interface SellOrdersGridProps {
  tab: SellTab;
  sellOrders: SellOrder[];
  mySellOrders: SellOrder[];
  onCancelOrder: (orderId: number) => void;
}

export default function SellOrdersGrid({
  tab,
  sellOrders,
  mySellOrders,
  onCancelOrder,
}: SellOrdersGridProps) {
  const displayOrders = tab === "all" ? sellOrders : mySellOrders;
  const isOwn = tab === "mine";

  if (displayOrders.length === 0) {
    return (
      <p className="text-[#888] text-center">
        {tab === "all"
          ? "No sell orders available."
          : "You haven't listed any seymours for sale."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 auto-rows-fr">
      {displayOrders.map((order) => (
        <SellOrderCard
          key={order.id}
          order={order}
          isOwn={isOwn}
          onCancel={isOwn ? () => onCancelOrder(order.id) : undefined}
        />
      ))}
    </div>
  );
}
