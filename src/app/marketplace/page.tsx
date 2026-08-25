"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchOrders,
  fetchMyOrders,
  fetchFillableOrders,
  fetchSellOrders,
  fetchMySellOrders,
  createOrder,
  cancelOrder,
  cancelSellOrder,
  fetchAvailableSets,
  fetchSetsPieces,
} from "@/lib/api";
import {
  BuyOrder,
  OrderType,
  BuyOrderCreate,
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
import {
  ModeToggle,
  TabButton,
  SeymourPickerModal,
  OrderMode,
} from "./ui";

type BuyTab = "all" | "mine" | "fillable";
type SellTab = "all" | "mine";

export default function MarketplacePage() {
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<OrderMode>("buy");
  const [buyTab, setBuyTab] = useState<BuyTab>("all");
  const [sellTab, setSellTab] = useState<SellTab>("all");
  const [orders, setOrders] = useState<BuyOrder[]>([]);
  const [myOrders, setMyOrders] = useState<BuyOrder[]>([]);
  const [fillableOrders, setFillableOrders] = useState<FillableOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<SellOrder[]>([]);
  const [mySellOrders, setMySellOrders] = useState<SellOrder[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    Promise.all([fetchAvailableSets(), fetchSetsPieces()]).then(
      ([setsData, piecesData]) => {
        setSets(setsData || []);
        setSetPieces(piecesData || {});
      }
    );
  }, []);

  useEffect(() => {
    loadCurrentView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user, mode, buyTab, sellTab,
    filterType, filterSet, filterTier, filterPieces, buySortBy, buySortOrder,
    sellFilterPiece, sellSortBy, sellSortOrder,
  ]);

  function loadCurrentView() {
    if (mode === "buy") {
      if (buyTab === "all") return loadOrders();
      if (buyTab === "mine" && user) return loadMyOrders();
      if (buyTab === "fillable" && user) return loadFillableOrders();
    } else {
      if (sellTab === "all") return loadSellOrders();
      if (sellTab === "mine" && user) return loadMySellOrders();
    }
  }

  function togglePiece(piece: PieceIndex) {
    setFilterPieces((prev) =>
      prev.includes(piece) ? prev.filter((p) => p !== piece) : [...prev, piece]
    );
  }

  async function loadOrders() {
    setLoading(true);
    const params: Parameters<typeof fetchOrders>[0] = {
      sort_by: buySortBy === "delta_e" ? "price" : buySortBy,
      sort_order: buySortOrder,
    };
    if (filterType) params.order_type = filterType;
    if (filterSet) params.set_name = filterSet;
    if (filterTier) params.tier = filterTier;
    if (filterPieces.length > 0) params.piece_types = filterPieces;
    const data = await fetchOrders(params);
    setOrders(data?.orders || []);
    setLoading(false);
  }

  async function loadMyOrders() {
    setLoading(true);
    const data = await fetchMyOrders({ 
      sort_by: buySortBy === "delta_e" ? "price" : buySortBy, 
      sort_order: buySortOrder 
    });
    setMyOrders(data?.orders || []);
    setLoading(false);
  }

  async function loadFillableOrders() {
    setLoading(true);
    const data = await fetchFillableOrders({ 
      sort_by: buySortBy === "delta_e" ? "price" : buySortBy, 
      sort_order: buySortOrder 
    });
    setFillableOrders(data || []);
    setLoading(false);
  }

  async function loadSellOrders() {
    setLoading(true);
    const data = await fetchSellOrders({
      piece_type: sellFilterPiece ?? undefined,
      sort_by: sellSortBy,
      sort_order: sellSortOrder,
    });
    setSellOrders(data?.orders || []);
    setLoading(false);
  }

  async function loadMySellOrders() {
    setLoading(true);
    const data = await fetchMySellOrders({ 
      sort_by: sellSortBy === "delta_e" ? "price" : sellSortBy, 
      sort_order: sellSortOrder 
    });
    setMySellOrders(data?.orders || []);
    setLoading(false);
  }

  async function handleCreateOrder(data: BuyOrderCreate) {
    await createOrder(data);
    loadOrders();
    if (user) loadMyOrders();
  }

  async function handleCancelOrder(orderId: number) {
    const result = await cancelOrder(orderId);
    if (result) {
      loadMyOrders();
      loadOrders();
    }
  }

  async function handleCancelSellOrder(orderId: number) {
    const result = await cancelSellOrder(orderId);
    if (result) {
      loadMySellOrders();
      loadSellOrders();
    }
  }

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

          <div className="flex gap-1">
            {mode === "buy" ? (
              <>
                <TabButton active={buyTab === "all"} onClick={() => handleTabClick("all", false)}>
                  All
                </TabButton>
                <TabButton
                  active={buyTab === "mine"}
                  onClick={() => handleTabClick("mine", true)}
                  disabled={!user}
                >
                  Mine
                </TabButton>
                <TabButton
                  active={buyTab === "fillable"}
                  onClick={() => handleTabClick("fillable", true)}
                  disabled={!user}
                >
                  Fillable
                </TabButton>
              </>
            ) : (
              <>
                <TabButton active={sellTab === "all"} onClick={() => handleTabClick("all", false)}>
                  All
                </TabButton>
                <TabButton
                  active={sellTab === "mine"}
                  onClick={() => handleTabClick("mine", true)}
                  disabled={!user}
                >
                  Mine
                </TabButton>
              </>
            )}
          </div>

          <div className="flex-1" />

          {user && mode === "buy" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-3 py-1.5 rounded text-[11px] bg-[#5865F2] text-white border-none cursor-pointer hover:bg-[#4752c4] transition-colors font-bold"
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

        {loading || authLoading ? (
          <p className="text-[#888] text-center">Loading...</p>
        ) : mode === "buy" ? (
          <BuyOrdersGrid
            tab={buyTab}
            orders={orders}
            myOrders={myOrders}
            fillableOrders={fillableOrders}
            onCancelOrder={handleCancelOrder}
          />
        ) : (
          <SellOrdersGrid
            tab={sellTab}
            sellOrders={sellOrders}
            mySellOrders={mySellOrders}
            onCancelOrder={handleCancelSellOrder}
          />
        )}
      </div>

      {showCreateForm && sets.length > 0 && (
        <CreateOrderForm
          sets={sets}
          setPieces={setPieces}
          onSubmit={handleCreateOrder}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {showSeymourPicker && (
        <SeymourPickerModal
          onClose={() => {
            setShowSeymourPicker(false);
            loadSellOrders();
            loadMySellOrders();
          }}
        />
      )}

      {showLoginPrompt && <LoginPromptModal onClose={() => setShowLoginPrompt(false)} />}
    </main>
  );
}
