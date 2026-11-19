"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchOrders,
  fetchMyOrders,
  fetchFillableOrders,
  fetchSellOrders,
  fetchMySellOrders,
  fetchAvailableSets,
  fetchSetsPieces,
} from "@/lib/api";
import { dataOr, mapResult, type ApiResult } from "@/lib/apiResult";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useCollectionVersion } from "@/contexts/CollectionVersionContext";
import { StatusMessage } from "@/components/ui/StatusMessage";
import {
  BuyOrder,
  OrderType,
  FillableOrder,
  SortBy,
  SortOrder,
  SellOrder,
  Tier,
} from "@/types/marketplace";
import { LoginPromptModal } from "@/components/LoginPromptModal";
import CreateOrderForm from "./CreateOrderForm";
import BuyOrderFilters from "./BuyOrderFilters";
import SellOrderFilters from "./SellOrderFilters";
import BuyOrdersGrid from "./BuyOrdersGrid";
import SellOrdersGrid from "./SellOrdersGrid";
import { PieceIndex } from "@/lib/pieces";
import { ModeToggle, OrderMode } from "./ModeToggle";
import { SeymourPickerModal } from "./SeymourPickerModal";
import { MarketplaceTabs, type BuyTab, type SellTab } from "./MarketplaceTabs";
import { useOrderMutations } from "./useOrderMutations";

/** Tagged by view, so one tab's results can never be rendered under another. */
type ViewData =
  | { view: "orders"; orders: BuyOrder[] }
  | { view: "myOrders"; orders: BuyOrder[] }
  | { view: "fillable"; orders: FillableOrder[] }
  | { view: "sellOrders"; orders: SellOrder[] }
  | { view: "mySellOrders"; orders: SellOrder[] }
  | { view: "none" };

const NO_SETS: string[] = [];
const NO_SET_PIECES: Record<string, PieceIndex[]> = {};
const NO_BUY_ORDERS: BuyOrder[] = [];
const NO_SELL_ORDERS: SellOrder[] = [];
const NO_FILLABLE_ORDERS: FillableOrder[] = [];

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<OrderMode>("buy");
  const [buyTab, setBuyTab] = useState<BuyTab>("all");
  const [sellTab, setSellTab] = useState<SellTab>("all");
  const [sets, setSets] = useState<string[]>([]);
  const [setPieces, setSetPieces] = useState<Record<string, PieceIndex[]>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSeymourPicker, setShowSeymourPicker] = useState(false);
  const [filterType, setFilterType] = useState<OrderType | null>(null);
  const [filterSet, setFilterSet] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<Tier | null>(null);
  const [filterPieces, setFilterPieces] = useState<PieceIndex[]>([]);
  const [sellFilterPiece, setSellFilterPiece] = useState<PieceIndex | null>(null);
  const [buySortBy, setBuySortBy] = useState<SortBy>("price");
  const [buySortOrder, setBuySortOrder] = useState<SortOrder>("desc");
  const [sellSortBy, setSellSortBy] = useState<SortBy>("delta_e");
  const [sellSortOrder, setSellSortOrder] = useState<SortOrder>("asc");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { version } = useCollectionVersion();
  const { createBuyOrders, cancelBuyOrder, cancelSellOrder } = useOrderMutations();

  useEffect(() => {
    Promise.all([fetchAvailableSets(), fetchSetsPieces()]).then(
      ([setsResult, piecesResult]) => {
        setSets(dataOr(setsResult, NO_SETS));
        setSetPieces(dataOr(piecesResult, NO_SET_PIECES));
      }
    );
  }, []);

  function togglePiece(piece: PieceIndex) {
    setFilterPieces((prev) =>
      prev.includes(piece) ? prev.filter((p) => p !== piece) : [...prev, piece]
    );
  }

  // delta_e is a sell-side sort only; the buy endpoints reject it.
  const buySort = buySortBy === "delta_e" ? "price" : buySortBy;

  async function loadOrders() {
    const params: Parameters<typeof fetchOrders>[0] = {
      sort_by: buySort,
      sort_order: buySortOrder,
    };
    if (filterType) params.order_type = filterType;
    if (filterSet) params.set_name = filterSet;
    if (filterTier) params.tier = filterTier;
    if (filterPieces.length > 0) params.piece_types = filterPieces;
    return mapResult(await fetchOrders(params), ({ orders }) => ({
      view: "orders" as const,
      orders,
    }));
  }

  async function loadMyOrders() {
    const result = await fetchMyOrders({ sort_by: buySort, sort_order: buySortOrder });
    return mapResult(result, ({ orders }) => ({ view: "myOrders" as const, orders }));
  }

  async function loadFillableOrders() {
    const result = await fetchFillableOrders({ sort_by: buySort, sort_order: buySortOrder });
    return mapResult(result, (orders) => ({ view: "fillable" as const, orders }));
  }

  async function loadSellOrders() {
    const result = await fetchSellOrders({
      piece_type: sellFilterPiece ?? undefined,
      sort_by: sellSortBy,
      sort_order: sellSortOrder,
    });
    return mapResult(result, ({ orders }) => ({ view: "sellOrders" as const, orders }));
  }

  async function loadMySellOrders() {
    const result = await fetchMySellOrders({
      sort_by: sellSortBy === "delta_e" ? "price" : sellSortBy,
      sort_order: sellSortOrder,
    });
    return mapResult(result, ({ orders }) => ({ view: "mySellOrders" as const, orders }));
  }

  function loadCurrentView(): Promise<ApiResult<ViewData>> {
    if (mode === "buy") {
      if (buyTab === "all") return loadOrders();
      if (buyTab === "mine" && user) return loadMyOrders();
      if (buyTab === "fillable" && user) return loadFillableOrders();
    } else {
      if (sellTab === "all") return loadSellOrders();
      if (sellTab === "mine" && user) return loadMySellOrders();
    }
    // An authed tab with no session -- nothing to fetch, and nothing to wait for.
    return Promise.resolve({ ok: true, data: { view: "none" } });
  }

  const { state } = useAsyncData(loadCurrentView, [
    user, mode, buyTab, sellTab, version,
    filterType, filterSet, filterTier, filterPieces, buySortBy, buySortOrder,
    sellFilterPiece, sellSortBy, sellSortOrder,
  ]);

  const view = state.status === "success" ? state.data : null;

  function handleTabClick(tab: BuyTab | SellTab, requiresAuth: boolean) {
    if (requiresAuth && !user) {
      setShowLoginPrompt(true);
      return;
    }
    if (mode === "buy") {
      setBuyTab(tab as BuyTab);
    } else {
      setSellTab(tab as SellTab);
    }
  }

  return (
    <main className="min-h-screen bg-[#121212] p-6 font-['MinecraftSeven',Arial,sans-serif]">
      <h1 className="text-[1.5em] text-[#f0f0f0] mb-6 text-center">Marketplace</h1>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <ModeToggle mode={mode} onModeChange={setMode} />

          <div className="h-4 w-px bg-[#333]" />

          <MarketplaceTabs
            mode={mode}
            activeTab={mode === "buy" ? buyTab : sellTab}
            signedIn={!!user}
            onTabClick={handleTabClick}
          />

          <div className="flex-1" />

          {user && mode === "buy" && (
            <button
              onClick={() => setShowCreateForm(true)}
              disabled={sets.length === 0}
              title={sets.length === 0 ? "Sets unavailable — try reloading" : undefined}
              className="px-3 py-1.5 rounded text-[11px] bg-[#5865F2] text-white border-none cursor-pointer hover:bg-[#4752c4] transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#5865F2]"
            >
              + New Order
            </button>
          )}

          {user && mode === "sell" && (
            <button
              onClick={() => setShowSeymourPicker(true)}
              className="px-3 py-1.5 rounded text-[11px] bg-[#4ade80] text-[#121212] border-none cursor-pointer hover:bg-[#22c55e] transition-colors font-bold"
            >
              + New Listing
            </button>
          )}
        </div>

        {mode === "buy" && buyTab === "all" && (
          <BuyOrderFilters
            filterType={filterType}
            filterSet={filterSet}
            filterTier={filterTier}
            filterPieces={filterPieces}
            sortBy={buySortBy}
            sortOrder={buySortOrder}
            sets={sets}
            onFilterTypeChange={setFilterType}
            onFilterSetChange={setFilterSet}
            onFilterTierChange={setFilterTier}
            onTogglePiece={togglePiece}
            onClearPieces={() => setFilterPieces([])}
            onSortByChange={setBuySortBy}
            onSortOrderChange={setBuySortOrder}
          />
        )}

        {mode === "sell" && sellTab === "all" && (
          <SellOrderFilters
            sellFilterPiece={sellFilterPiece}
            sortBy={sellSortBy}
            sortOrder={sellSortOrder}
            onFilterPieceChange={setSellFilterPiece}
            onSortByChange={setSellSortBy}
            onSortOrderChange={setSellSortOrder}
          />
        )}

        {state.status === "loading" || authLoading ? (
          <StatusMessage>Loading...</StatusMessage>
        ) : state.status === "error" ? (
          <StatusMessage tone="error">{state.detail}</StatusMessage>
        ) : mode === "buy" ? (
          <BuyOrdersGrid
            tab={buyTab}
            orders={view?.view === "orders" ? view.orders : NO_BUY_ORDERS}
            myOrders={view?.view === "myOrders" ? view.orders : NO_BUY_ORDERS}
            fillableOrders={view?.view === "fillable" ? view.orders : NO_FILLABLE_ORDERS}
            onCancelOrder={cancelBuyOrder}
          />
        ) : (
          <SellOrdersGrid
            tab={sellTab}
            sellOrders={view?.view === "sellOrders" ? view.orders : NO_SELL_ORDERS}
            mySellOrders={view?.view === "mySellOrders" ? view.orders : NO_SELL_ORDERS}
            onCancelOrder={cancelSellOrder}
          />
        )}
      </div>

      {showCreateForm && (
        <CreateOrderForm
          sets={sets}
          setPieces={setPieces}
          onSubmit={createBuyOrders}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {showSeymourPicker && (
        <SeymourPickerModal onClose={() => setShowSeymourPicker(false)} />
      )}

      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
    </main>
  );
}
