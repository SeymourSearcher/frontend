import { BuyOrder, OrderType, OrderStatus } from "@/types/marketplace";
import CancelOrderButton from "./CancelOrderButton";
import DiscordUserLink from "./DiscordUserLink";
import OrderCardFooter from "./OrderCardFooter";
import OrderCriteria from "./OrderCriteria";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderSwatch from "./OrderSwatch";
import OrderTypeBadge from "./OrderTypeBadge";

interface OrderCardProps {
  order: BuyOrder;
  isOwn?: boolean;
  onCancel?: () => void;
}

export default function OrderCard({ order, isOwn, onCancel }: OrderCardProps) {
  const isSetPiece = order.order_type === OrderType.SET_PIECE;
  const isActive = order.status === OrderStatus.ACTIVE;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] transition-colors relative flex flex-col h-full">
      {isOwn && <OrderStatusBadge status={order.status} />}

      <div className="flex items-center gap-3 flex-1">
        <OrderSwatch hexCriteria={order.hex_criteria} isSetPiece={isSetPiece} />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <OrderTypeBadge isSetPiece={isSetPiece} />
          </div>
          <OrderCriteria order={order} fixedHeight />
        </div>
      </div>

      <OrderCardFooter
        price={order.price}
        expiresAt={order.expires_at}
        action={
          isOwn
            ? isActive && onCancel && <CancelOrderButton onCancel={onCancel} />
            : order.user && <DiscordUserLink user={order.user} />
        }
      />
    </div>
  );
}
