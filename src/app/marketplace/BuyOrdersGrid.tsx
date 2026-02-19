"use client";

import { BuyOrder, FillableOrder } from "@/types/marketplace";
import OrderCard from "./OrderCard";
import FillableOrderCard from "./FillableOrderCard";

type BuyTab = "all" | "mine" | "fillable";

interface BuyOrdersGridProps {
  tab: BuyTab;
  orders: BuyOrder[];
  myOrders: BuyOrder[];
  fillableOrders: FillableOrder[];
  onCancelOrder: (orderId: number) => void;
}

export default function BuyOrdersGrid({
  tab,
  orders,
  myOrders,
  fillableOrders,
  onCancelOrder,
}: BuyOrdersGridProps) {
  if (tab === "fillable") {
    if (fillableOrders.length === 0) {
      return <p className="text-[#888] text-center">No orders match your Seymours.</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-fr">
        {fillableOrders.map((fillable) => (
          <FillableOrderCard key={fillable.order.id} fillable={fillable} />
        ))}
      </div>
    );
  }

  const displayOrders = tab === "all" ? orders : myOrders;
  const isOwn = tab === "mine";

  if (displayOrders.length === 0) {
    return (
      <p className="text-[#888] text-center">
        {tab === "all"
          ? "No active buy orders yet."
          : "You haven't created any buy orders yet."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-fr">
      {displayOrders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isOwn={isOwn}
          onCancel={isOwn ? () => onCancelOrder(order.id) : undefined}
        />
      ))}
    </div>
  );
}
