import { OrderStatus } from "@/types/marketplace";

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  if (status === OrderStatus.ACTIVE) return null;

  return (
    <span
      className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold ${
        status === OrderStatus.CANCELLED
          ? "bg-red-600/30 text-red-300"
          : "bg-yellow-600/30 text-yellow-300"
      }`}
    >
      {status}
    </span>
  );
}
