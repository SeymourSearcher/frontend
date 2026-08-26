import { OrderType, HexMatchType, Tier, BuyOrderCreate } from "@/types/marketplace";
import { PieceIndex } from "@/lib/pieces";

export interface BuyOrderFormValues {
  orderType: OrderType;
  price: string;
  setName: string;
  selectedPieceTypes: PieceIndex[];
  tier: Tier;
  hexMatchType: HexMatchType;
  hexValue: string;
  maxDeltaE: string;
  hexPieceTypes: PieceIndex[];
  hexAnyPiece: boolean;
}

export type BuildResult =
  | { ok: true; orders: BuyOrderCreate[] }
  | { ok: false; error: string };

/** A hex-pattern form submits one order per selected piece; "Any" submits a single null-piece order. */
export function buildBuyOrders(values: BuyOrderFormValues): BuildResult {
  const price = parseInt(values.price, 10);
  if (!price || price <= 0) {
    return { ok: false, error: "Price must be a positive number" };
  }

  if (values.orderType === OrderType.SET_PIECE) {
    if (!values.setName) {
      return { ok: false, error: "Please select a set" };
    }
    if (values.selectedPieceTypes.length === 0) {
      return { ok: false, error: "Please select at least one piece type" };
    }
    return {
      ok: true,
      orders: [
        {
          price,
          order_type: values.orderType,
          set_criteria: {
            set_name: values.setName,
            piece_types: values.selectedPieceTypes,
            tier: values.tier,
          },
        },
      ],
    };
  }

  const cleanHex = values.hexValue.replace("#", "").toUpperCase();
  if (cleanHex.length !== 6) {
    return { ok: false, error: "Hex value must be 6 characters" };
  }
  if (!values.hexAnyPiece && values.hexPieceTypes.length === 0) {
    return { ok: false, error: "Please select at least one piece type or choose 'Any'" };
  }

  const pieces: (PieceIndex | null)[] = values.hexAnyPiece ? [null] : values.hexPieceTypes;

  return {
    ok: true,
    orders: pieces.map((piece_type) => ({
      price,
      order_type: values.orderType,
      hex_criteria: {
        match_type: values.hexMatchType,
        hex_value: cleanHex,
        max_delta_e:
          values.hexMatchType === HexMatchType.DELTA_E
            ? parseFloat(values.maxDeltaE) || null
            : null,
        piece_type,
      },
    })),
  };
}
