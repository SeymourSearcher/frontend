"use client";

import { TabButton } from "@/components/ui/TabButton";
import type { OrderMode } from "./ModeToggle";

export type BuyTab = "all" | "mine" | "fillable";
export type SellTab = "all" | "mine";

const BUY_TABS: { tab: BuyTab; label: string; requiresAuth: boolean }[] = [
  { tab: "all", label: "All", requiresAuth: false },
  { tab: "mine", label: "Mine", requiresAuth: true },
  { tab: "fillable", label: "Fillable", requiresAuth: true },
];

const SELL_TABS: { tab: SellTab; label: string; requiresAuth: boolean }[] = [
  { tab: "all", label: "All", requiresAuth: false },
  { tab: "mine", label: "Mine", requiresAuth: true },
];

interface MarketplaceTabsProps {
  mode: OrderMode;
  activeTab: BuyTab | SellTab;
  signedIn: boolean;
  onTabClick: (tab: BuyTab | SellTab, requiresAuth: boolean) => void;
}

export function MarketplaceTabs({ mode, activeTab, signedIn, onTabClick }: MarketplaceTabsProps) {
  const tabs = mode === "buy" ? BUY_TABS : SELL_TABS;

  return (
    <div className="flex gap-1">
      {tabs.map(({ tab, label, requiresAuth }) => (
        <TabButton
          key={tab}
          size="compact"
          active={activeTab === tab}
          onClick={() => onTabClick(tab, requiresAuth)}
          disabled={requiresAuth && !signedIn}
        >
          {label}
        </TabButton>
      ))}
    </div>
  );
}
