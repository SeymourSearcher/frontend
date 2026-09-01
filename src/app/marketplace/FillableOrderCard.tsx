import { FillableOrder, OrderType } from "@/types/marketplace";
import DiscordUserLink from "./DiscordUserLink";
import MatchingSeymoursList from "./MatchingSeymoursList";
import OrderCardFooter from "./OrderCardFooter";
import OrderCriteria from "./OrderCriteria";
import OrderSwatch from "./OrderSwatch";
import OrderTypeBadge from "./OrderTypeBadge";

interface FillableOrderCardProps {
  fillable: FillableOrder;
}

export default function FillableOrderCard({ fillable }: FillableOrderCardProps) {
  const { order, matching_seymours } = fillable;
  const isSetPiece = order.order_type === OrderType.SET_PIECE;

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#252525] transition-colors">
      <div className="flex items-center gap-3">
        <OrderSwatch hexCriteria={order.hex_criteria} isSetPiece={isSetPiece} />
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <OrderTypeBadge isSetPiece={isSetPiece} />
          </div>
          <OrderCriteria order={order} />
        </div>
      </div>

      <OrderCardFooter
        price={order.price}
        expiresAt={order.expires_at}
        action={order.user && <DiscordUserLink user={order.user} />}
      />

      <MatchingSeymoursList seymours={matching_seymours} />
    </div>
  );
}
