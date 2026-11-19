import type {
  BuyOrderListResponse,
  BuyOrderCreate,
  BuyOrder,
  FillableOrder,
  SellOrder,
  SellOrderListResponse,
  SellOrderCreate,
  FetchOrdersParams,
  FetchMyOrdersParams,
  FetchFillableParams,
  FetchSellOrdersParams,
} from "@/types/marketplace";
import type { PieceIndex } from "@/lib/pieces";
import { postJson, request, toQuery } from "./client";

export function fetchOrders(params: FetchOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    order_type: params.order_type,
    set_name: params.set_name,
    piece_types: params.piece_types,
    tier: params.tier,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<BuyOrderListResponse>(`/marketplace/orders${query}`);
}

export function fetchMyOrders(params: FetchMyOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    status: params.status,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<BuyOrderListResponse>(`/marketplace/orders/mine${query}`);
}

export function fetchFillableOrders(params: FetchFillableParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<FillableOrder[]>(`/marketplace/orders/fillable${query}`);
}

export function createOrder(data: BuyOrderCreate) {
  return postJson<BuyOrder>("/marketplace/orders", data);
}

export function cancelOrder(orderId: number) {
  return request<{ detail: string }>(`/marketplace/orders/${orderId}`, { method: "DELETE" });
}

export function fetchAvailableSets() {
  return request<string[]>("/seymours/available-filters?filter=sets");
}

export function fetchSetsPieces() {
  return request<Record<string, PieceIndex[]>>("/marketplace/sets-pieces");
}

export function fetchSellOrders(params: FetchSellOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    piece_type: params.piece_type,
    hex_color: params.hex_color,
    min_price: params.min_price,
    max_price: params.max_price,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<SellOrderListResponse>(`/marketplace/orders/sell${query}`);
}

export function fetchMySellOrders(params: FetchMyOrdersParams = {}) {
  const query = toQuery({
    skip: params.skip,
    limit: params.limit,
    status: params.status,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
  });
  return request<SellOrderListResponse>(`/marketplace/orders/sell/mine${query}`);
}

export function createSellOrders(data: SellOrderCreate) {
  return postJson<SellOrder[]>("/marketplace/orders/sell", data);
}

export function cancelSellOrder(orderId: number) {
  return request<{ detail: string }>(`/marketplace/orders/sell/${orderId}`, { method: "DELETE" });
}
